const http = require('http');

const BASE_URL = 'http://127.0.0.1:5000';
let sessionCookie = '';

function makeRequest(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (sessionCookie) {
            options.headers['Cookie'] = sessionCookie;
        }

        const req = http.request(options, (res) => {
            let data = '';
            if (res.headers['set-cookie']) {
                sessionCookie = res.headers['set-cookie'].join('; ');
            }
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: data });
                }
            });
        });

        req.on('error', reject);
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runPhase5Tests() {
    console.log('====================================================');
    console.log('🧪 Starting Phase 5 Media Library & Storage Test Suite...');
    console.log('====================================================');

    try {
        // 1. Authenticate as Super Admin
        const loginRes = await makeRequest('/api/auth/login', 'POST', {
            email: 'growthitsolution@gmail.com',
            password: 'growthitsolution123'
        });
        if (loginRes.status !== 200) throw new Error('Login failed');
        console.log('✅ 1. Authenticated as Super Admin');

        // 2. Upload valid PNG image (base64 of tiny PNG)
        const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const uploadRes = await makeRequest('/api/admin/media/upload', 'POST', {
            fileName: 'hero_banner.png',
            fileData: samplePngBase64,
            mimeType: 'image/png'
        });

        if (uploadRes.status !== 201 || !uploadRes.body.success) {
            throw new Error(`Upload failed: ${JSON.stringify(uploadRes.body)}`);
        }
        const media = uploadRes.body.data;
        console.log('✅ 2. Media Uploaded successfully:', media.id, media.file_url, `(${media.file_size_kb} KB, ${media.dimensions})`);

        // 3. Test Invalid MIME type rejection
        const invalidRes = await makeRequest('/api/admin/media/upload', 'POST', {
            fileName: 'script.exe',
            fileData: 'dGVzdA==',
            mimeType: 'application/x-msdownload'
        });
        if (invalidRes.status === 400 && invalidRes.body.error.includes('Allowed')) {
            console.log('✅ 3. Backend Upload Validation verified (Invalid extension/MIME rejected)');
        } else {
            throw new Error('Upload validation failed to reject invalid file!');
        }

        // 4. Test Rename Media
        const renameRes = await makeRequest(`/api/admin/media/${media.id}/rename`, 'PUT', {
            file_name: 'renamed_hero_banner.png'
        });
        if (renameRes.status !== 200 || renameRes.body.data.file_name !== 'renamed_hero_banner.png') {
            throw new Error('Media Rename failed');
        }
        console.log('✅ 4. Media Renamed successfully to:', renameRes.body.data.file_name);

        // 5. Test Reference check before linking
        const refRes1 = await makeRequest(`/api/admin/media/${media.id}/references`);
        if (refRes1.body.isUsed !== false) throw new Error('Reference check should be false for fresh file');
        console.log('✅ 5. Initial Reference Check verified (Unused asset)');

        // 6. Link image to a project
        const projectRes = await makeRequest('/api/admin/projects', 'POST', {
            title: 'Media Demo Project',
            slug: 'media-demo-project',
            main_image: media.file_url,
            status: 'published'
        });
        const projectId = projectRes.body.data.id;
        console.log('✅ 6. Media asset linked to Project:', projectId);

        // 7. Verify Dependency Checker catches reference!
        const refRes2 = await makeRequest(`/api/admin/media/${media.id}/references`);
        if (!refRes2.body.isUsed || refRes2.body.usageCount < 1) {
            throw new Error('Dependency check failed to detect active usage in Project!');
        }
        console.log(`✅ 7. Safe Delete Dependency Check verified (${refRes2.body.usageCount} reference found in ${refRes2.body.references[0].collection})`);

        // 8. Cleanup & Safe Delete
        await makeRequest(`/api/admin/projects/${projectId}`, 'DELETE');
        const deleteRes = await makeRequest(`/api/admin/media/${media.id}`, 'DELETE');
        if (deleteRes.status !== 200) throw new Error('Delete media failed');
        console.log('✅ 8. Media asset safely deleted');

        console.log('====================================================');
        console.log('🎉 ALL PHASE 5 MEDIA & STORAGE TESTS PASSED PERFECTLY!');
        console.log('====================================================');

    } catch (err) {
        console.error('❌ Phase 5 Test Failed:', err.message);
        process.exit(1);
    }
}

runPhase5Tests();
