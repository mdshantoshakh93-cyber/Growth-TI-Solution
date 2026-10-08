/**
 * Growth IT Solution - Storage Provider Abstraction
 * Supports Cloudinary cloud storage and Local Disk fallback storage.
 * Easily extensible to AWS S3 or Google Cloud Storage.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

// Allowed image MIME types and extensions
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Basic image dimension extractor from buffer
 */
function getImageDimensions(buffer) {
    try {
        if (!buffer || buffer.length < 24) return { width: 800, height: 600 };

        // PNG
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
            return {
                width: buffer.readUInt32BE(16),
                height: buffer.readUInt32BE(20)
            };
        }

        // JPEG / JPG
        if (buffer[0] === 0xff && buffer[1] === 0xd8) {
            let offset = 2;
            while (offset < buffer.length) {
                const marker = buffer.readUInt16BE(offset);
                offset += 2;
                if (marker === 0xffc0 || marker === 0xffc2) {
                    return {
                        height: buffer.readUInt16BE(offset + 3),
                        width: buffer.readUInt16BE(offset + 5)
                    };
                }
                offset += buffer.readUInt16BE(offset);
            }
        }

        // WebP
        if (buffer.slice(0, 4).toString() === 'RIFF' && buffer.slice(8, 12).toString() === 'WEBP') {
            if (buffer.slice(12, 16).toString() === 'VP8 ') {
                return {
                    width: buffer.readUInt16LE(26) & 0x3fff,
                    height: buffer.readUInt16LE(28) & 0x3fff
                };
            }
            if (buffer.slice(12, 16).toString() === 'VP8L') {
                const b0 = buffer[21];
                const b1 = buffer[22];
                const b2 = buffer[23];
                const b3 = buffer[24];
                return {
                    width: 1 + (((b1 & 0x3f) << 8) | b0),
                    height: 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6))
                };
            }
        }
    } catch (e) {
        // Fallback dimensions if header parsing fails
    }
    return { width: 1200, height: 800 };
}

class StorageProvider {
    constructor() {
        this.cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        this.apiKey = process.env.CLOUDINARY_API_KEY;
        this.apiSecret = process.env.CLOUDINARY_API_SECRET;

        this.uploadsDir = path.join(__dirname, '../../uploads');
        this.frontendUploadsDir = path.join(__dirname, '../../frontend/uploads');

        // Ensure local uploads directory exists
        if (!fs.existsSync(this.uploadsDir)) {
            fs.existsSync(this.uploadsDir) || fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
        if (!fs.existsSync(this.frontendUploadsDir)) {
            fs.existsSync(this.frontendUploadsDir) || fs.mkdirSync(this.frontendUploadsDir, { recursive: true });
        }
    }

    isCloudinaryConfigured() {
        return Boolean(this.cloudName && this.apiKey && this.apiSecret);
    }

    validateFile({ mimeType, extension, sizeBytes }) {
        if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
            return { valid: false, error: `Invalid MIME type '${mimeType}'. Allowed: JPG, PNG, WEBP.` };
        }
        if (!ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
            return { valid: false, error: `Invalid extension '${extension}'. Allowed: .jpg, .jpeg, .png, .webp.` };
        }
        if (sizeBytes > MAX_FILE_SIZE_BYTES) {
            return { valid: false, error: `File size ${(sizeBytes / 1024 / 1024).toFixed(2)}MB exceeds maximum 5MB limit.` };
        }
        return { valid: true };
    }

    async uploadBuffer(buffer, fileName, mimeType) {
        const ext = path.extname(fileName).toLowerCase() || '.jpg';
        const sizeBytes = buffer.length;

        // 1. Validation
        const check = this.validateFile({ mimeType, extension: ext, sizeBytes });
        if (!check.valid) {
            throw new Error(check.error);
        }

        const dimensions = getImageDimensions(buffer);

        // 2. Cloudinary Upload if configured
        if (this.isCloudinaryConfigured()) {
            try {
                const cloudResult = await this.uploadToCloudinary(buffer, fileName);
                return {
                    file_url: cloudResult.secure_url,
                    file_name: fileName,
                    file_type: mimeType,
                    file_size_kb: Math.round(sizeBytes / 1024),
                    dimensions: `${cloudResult.width || dimensions.width}x${cloudResult.height || dimensions.height}`,
                    width: cloudResult.width || dimensions.width,
                    height: cloudResult.height || dimensions.height,
                    public_id: cloudResult.public_id,
                    provider: 'cloudinary'
                };
            } catch (err) {
                console.warn('[StorageProvider] Cloudinary upload failed, falling back to local disk:', err.message);
            }
        }

        // 3. Fallback to Local Disk Storage
        const uniqueHash = crypto.randomBytes(8).toString('hex');
        const safeBaseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const storedFileName = `${safeBaseName}_${uniqueHash}${ext}`;

        const backendFilePath = path.join(this.uploadsDir, storedFileName);
        const frontendFilePath = path.join(this.frontendUploadsDir, storedFileName);

        fs.writeFileSync(backendFilePath, buffer);
        fs.writeFileSync(frontendFilePath, buffer);

        return {
            file_url: `/uploads/${storedFileName}`,
            file_name: fileName,
            file_type: mimeType,
            file_size_kb: Math.round(sizeBytes / 1024),
            dimensions: `${dimensions.width}x${dimensions.height}`,
            width: dimensions.width,
            height: dimensions.height,
            public_id: storedFileName,
            provider: 'local'
        };
    }

    uploadToCloudinary(buffer, fileName) {
        return new Promise((resolve, reject) => {
            const timestamp = Math.floor(Date.now() / 1000);
            const strToSign = `timestamp=${timestamp}${this.apiSecret}`;
            const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

            const boundary = '----CloudinaryBoundary' + Math.random().toString(36).substring(2);
            let body = '';

            body += `--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${this.apiKey}\r\n`;
            body += `--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}\r\n`;
            body += `--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${signature}\r\n`;
            body += `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`;

            const headerBuffer = Buffer.from(body, 'utf-8');
            const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
            const payloadLength = headerBuffer.length + buffer.length + footerBuffer.length;

            const reqOptions = {
                hostname: 'api.cloudinary.com',
                port: 443,
                path: `/v1_1/${this.cloudName}/image/upload`,
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': payloadLength
                }
            };

            const req = https.request(reqOptions, (res) => {
                let resData = '';
                res.on('data', chunk => resData += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(resData);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(parsed);
                        } else {
                            reject(new Error(parsed.error?.message || 'Cloudinary error'));
                        }
                    } catch (e) {
                        reject(new Error('Invalid Cloudinary API response'));
                    }
                });
            });

            req.on('error', reject);
            req.write(headerBuffer);
            req.write(buffer);
            req.write(footerBuffer);
            req.end();
        });
    }

    async deleteAsset(fileUrl, publicId, provider) {
        if (provider === 'local' || fileUrl.startsWith('/uploads/')) {
            const fileName = path.basename(fileUrl);
            const p1 = path.join(this.uploadsDir, fileName);
            const p2 = path.join(this.frontendUploadsDir, fileName);
            if (fs.existsSync(p1)) fs.unlinkSync(p1);
            if (fs.existsSync(p2)) fs.unlinkSync(p2);
            return true;
        }

        if (provider === 'cloudinary' && this.isCloudinaryConfigured() && publicId) {
            try {
                // Cloudinary destroy API
                const timestamp = Math.floor(Date.now() / 1000);
                const strToSign = `public_id=${publicId}&timestamp=${timestamp}${this.apiSecret}`;
                const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

                const postData = new URLSearchParams({
                    public_id: publicId,
                    api_key: this.apiKey,
                    timestamp: String(timestamp),
                    signature: signature
                }).toString();

                const reqOptions = {
                    hostname: 'api.cloudinary.com',
                    port: 443,
                    path: `/v1_1/${this.cloudName}/image/destroy`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                return new Promise((resolve) => {
                    const req = https.request(reqOptions, (res) => {
                        resolve(true);
                    });
                    req.on('error', () => resolve(false));
                    req.write(postData);
                    req.end();
                });
            } catch (err) {
                console.warn('[StorageProvider] Remote delete failed:', err.message);
            }
        }
        return true;
    }
}

module.exports = new StorageProvider();
