/**
 * Growth IT Solution REST API Server
 * Full-stack Zero-Dependency Node.js Server with Secure Admin Authentication & Role Authorization
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');
const bcrypt = require('./utils/bcrypt');
const { parseCookies, serializeCookie } = require('./utils/cookies');
const { loginRateLimiter } = require('./utils/rateLimiter');
const {
    authenticate,
    isAuthorizedRole
} = require('./middleware/authMiddleware');
const { sanitizeHtml } = require('./utils/sanitize');
const storageProvider = require('./utils/storageProvider');

const PORT = process.env.PORT || 5000;
const HOST = '127.0.0.1';

function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1e6) {
                req.destroy();
                reject(new Error('Payload too large'));
            }
        });
        req.on('end', () => {
            try {
                const parsed = body ? JSON.parse(body) : {};
                resolve(parsed);
            } catch (err) {
                reject(new Error('Invalid JSON payload'));
            }
        });
        req.on('error', err => reject(err));
    });
}

function sendJson(res, statusCode, data, headers = {}) {
    const responseHeaders = Object.assign({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
        'Cache-Control': 'no-store'
    }, headers);

    res.writeHead(statusCode, responseHeaders);
    res.end(JSON.stringify(data));
}

function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content);
        }
    });
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jsx': 'application/javascript',
    '.ts': 'application/typescript',
    '.tsx': 'application/typescript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie'
        });
        res.end();
        return;
    }

    console.log(`[API Request] ${method} ${pathname}`);

    // --- API ROUTES ---
    if (pathname.startsWith('/api/')) {
        try {
            // GET /api/health
            if (pathname === '/api/health' && method === 'GET') {
                return sendJson(res, 200, {
                    status: 'online',
                    service: 'Growth IT Solution API Engine',
                    db_status: 'operational',
                    version: '3.0.0-phase3',
                    timestamp: new Date().toISOString()
                });
            }

            // ==================================================
            // AUTHENTICATION ENDPOINTS
            // ==================================================

            // POST /api/auth/login
            if (pathname === '/api/auth/login' && method === 'POST') {
                const clientIp = loginRateLimiter.getIp(req);
                const rateCheck = loginRateLimiter.check(clientIp);

                if (rateCheck.limited) {
                    return sendJson(res, 429, {
                        success: false,
                        error: `Too many failed login attempts. Please try again in ${rateCheck.resetSeconds} seconds.`,
                        resetSeconds: rateCheck.resetSeconds
                    });
                }

                const body = await parseJsonBody(req);
                const { email, password } = body;

                if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
                    loginRateLimiter.consume(clientIp);
                    return sendJson(res, 400, {
                        success: false,
                        error: 'Missing required credentials. Both email and password must be provided.'
                    });
                }

                const user = db.getUserByEmail(email.trim());
                if (!user || user.status !== 'active') {
                    const consumed = loginRateLimiter.consume(clientIp);
                    return sendJson(res, 401, {
                        success: false,
                        error: 'Invalid email or password.',
                        remainingAttempts: consumed.remainingAttempts
                    });
                }

                const isPasswordValid = bcrypt.comparePassword(password, user.password_hash);
                if (!isPasswordValid) {
                    const consumed = loginRateLimiter.consume(clientIp);
                    return sendJson(res, 401, {
                        success: false,
                        error: 'Invalid email or password.',
                        remainingAttempts: consumed.remainingAttempts
                    });
                }

                loginRateLimiter.reset(clientIp);
                const session = db.createSession(user.id, 24 * 60 * 60 * 1000);

                const cookieHeader = serializeCookie('session_id', session.id, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'Lax',
                    maxAge: 86400
                });

                const sanitizedUser = {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    created_at: user.created_at
                };

                return sendJson(res, 200, {
                    success: true,
                    message: 'Authentication successful. Welcome to Growth IT Solution Admin Portal.',
                    token: session.id,
                    user: sanitizedUser
                }, { 'Set-Cookie': cookieHeader });
            }

            // POST /api/auth/logout
            if (pathname === '/api/auth/logout' && method === 'POST') {
                const cookies = parseCookies(req);
                const token = cookies.session_id || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

                if (token) {
                    db.deleteSession(token);
                }

                const clearCookieHeader = serializeCookie('session_id', '', {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'Lax',
                    maxAge: 0,
                    expires: new Date(0)
                });

                return sendJson(res, 200, {
                    success: true,
                    message: 'Logged out successfully.'
                }, { 'Set-Cookie': clearCookieHeader });
            }

            // GET /api/auth/me
            if (pathname === '/api/auth/me' && method === 'GET') {
                const user = authenticate(req);
                if (!user) {
                    return sendJson(res, 401, {
                        success: false,
                        error: 'Unauthorized. Active session required.'
                    });
                }

                return sendJson(res, 200, {
                    success: true,
                    user: user
                });
            }

            // POST /api/auth/change-password
            if (pathname === '/api/auth/change-password' && method === 'POST') {
                const user = authenticate(req);
                if (!user) {
                    return sendJson(res, 401, {
                        success: false,
                        error: 'Unauthorized. Active session required.'
                    });
                }

                const body = await parseJsonBody(req);
                const { current_password, new_password } = body;

                if (!current_password || !new_password) {
                    return sendJson(res, 400, {
                        success: false,
                        error: 'Both current_password and new_password are required.'
                    });
                }

                if (typeof new_password !== 'string' || new_password.length < 8) {
                    return sendJson(res, 400, {
                        success: false,
                        error: 'New password must be at least 8 characters long.'
                    });
                }

                const rawUser = db.getUserById(user.id);
                const isCurrentValid = bcrypt.comparePassword(current_password, rawUser.password_hash);
                if (!isCurrentValid) {
                    return sendJson(res, 400, {
                        success: false,
                        error: 'Current password is incorrect.'
                    });
                }

                const newHash = bcrypt.hashPassword(new_password, 10);
                db.updateUserPassword(user.id, newHash);

                const newSession = db.createSession(user.id, 24 * 60 * 60 * 1000);
                const cookieHeader = serializeCookie('session_id', newSession.id, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'Lax',
                    maxAge: 86400
                });

                return sendJson(res, 200, {
                    success: true,
                    message: 'Password changed successfully.'
                }, { 'Set-Cookie': cookieHeader });
            }

            // ==================================================
            // PROTECTED ADMIN API ENDPOINTS (Phase 3 Dashboard & CRUD)
            // ==================================================

            // 1. GET /api/admin/stats (Real Database Statistics)
            if (pathname === '/api/admin/stats' && method === 'GET') {
                const user = authenticate(req);
                if (!user) {
                    return sendJson(res, 401, { success: false, error: 'Unauthorized.' });
                }
                const stats = db.getStats();
                return sendJson(res, 200, { success: true, data: stats });
            }

            // 2. GET /api/admin/activity-logs
            if (pathname === '/api/admin/activity-logs' && method === 'GET') {
                const user = authenticate(req);
                if (!user) {
                    return sendJson(res, 401, { success: false, error: 'Unauthorized.' });
                }
                const logs = db.getCollection('activity_logs');
                return sendJson(res, 200, { success: true, count: logs.length, data: logs });
            }

            // ==================================================
            // PHASE 5 MEDIA MANAGEMENT SPECIAL ENDPOINTS
            // ==================================================

            // POST /api/admin/media/upload
            if (pathname === '/api/admin/media/upload' && method === 'POST') {
                const user = authenticate(req);
                if (!user) {
                    return sendJson(res, 401, { success: false, error: 'Unauthorized.' });
                }

                const body = await parseJsonBody(req);
                const { fileName = 'upload.jpg', fileData, mimeType = 'image/jpeg' } = body;

                if (!fileData) {
                    return sendJson(res, 400, { success: false, error: 'Missing fileData payload.' });
                }

                let buffer;
                if (fileData.startsWith('data:')) {
                    const base64Str = fileData.split(',')[1] || '';
                    buffer = Buffer.from(base64Str, 'base64');
                } else {
                    buffer = Buffer.from(fileData, 'base64');
                }

                try {
                    const uploadResult = await storageProvider.uploadBuffer(buffer, fileName, mimeType);
                    const mediaRecord = {
                        id: 'med-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
                        file_name: uploadResult.file_name,
                        file_url: uploadResult.file_url,
                        file_type: uploadResult.file_type,
                        file_size_kb: uploadResult.file_size_kb,
                        dimensions: uploadResult.dimensions,
                        width: uploadResult.width,
                        height: uploadResult.height,
                        public_id: uploadResult.public_id,
                        provider: uploadResult.provider,
                        uploaded_at: new Date().toISOString(),
                        uploaded_by: user.email
                    };

                    db.addItem('media', mediaRecord);
                    return sendJson(res, 201, {
                        success: true,
                        message: 'File uploaded successfully.',
                        data: mediaRecord
                    });
                } catch (err) {
                    return sendJson(res, 400, { success: false, error: err.message });
                }
            }

            // GET /api/admin/media/:id/references (Dependency Check)
            if (pathname.startsWith('/api/admin/media/') && pathname.endsWith('/references') && method === 'GET') {
                const user = authenticate(req);
                if (!user) {
                    return sendJson(res, 401, { success: false, error: 'Unauthorized.' });
                }

                const parts = pathname.split('/');
                const mediaId = parts[4]; // /api/admin/media/:id/references
                const mediaItem = db.getCollection('media').find(m => m.id === mediaId);

                if (!mediaItem) {
                    return sendJson(res, 404, { success: false, error: 'Media asset not found' });
                }

                const references = [];
                const targetUrl = mediaItem.file_url;
                const targetName = mediaItem.file_name;

                // Check Projects
                db.getCollection('portfolio_items').forEach(p => {
                    if (p.main_image === targetUrl || (p.gallery && p.gallery.includes(targetUrl))) {
                        references.push({ collection: 'Projects', id: p.id, title: p.title, field: p.main_image === targetUrl ? 'Main Cover Image' : 'Gallery Image' });
                    }
                });

                // Check Services
                db.getCollection('services').forEach(s => {
                    if (s.image === targetUrl) {
                        references.push({ collection: 'Services', id: s.id, title: s.name, field: 'Service Image' });
                    }
                });

                // Check Blogs
                db.getCollection('blogs').forEach(b => {
                    if (b.featured_image === targetUrl || (b.content && b.content.includes(targetUrl))) {
                        references.push({ collection: 'Blogs', id: b.id, title: b.title, field: 'Featured Image or Content HTML' });
                    }
                });

                // Check Testimonials
                db.getCollection('testimonials').forEach(t => {
                    if (t.profile_image === targetUrl) {
                        references.push({ collection: 'Testimonials', id: t.id, title: t.name, field: 'Profile Avatar' });
                    }
                });

                // Check Team
                db.getCollection('team').forEach(tm => {
                    if (tm.profile_image === targetUrl) {
                        references.push({ collection: 'Team', id: tm.id, title: tm.name, field: 'Profile Photo' });
                    }
                });

                return sendJson(res, 200, {
                    success: true,
                    isUsed: references.length > 0,
                    usageCount: references.length,
                    references: references
                });
            }

            // PUT /api/admin/media/:id/rename
            if (pathname.startsWith('/api/admin/media/') && pathname.endsWith('/rename') && (method === 'PUT' || method === 'POST')) {
                const user = authenticate(req);
                if (!user) {
                    return sendJson(res, 401, { success: false, error: 'Unauthorized.' });
                }
                const parts = pathname.split('/');
                const mediaId = parts[4];
                const body = await parseJsonBody(req);
                const { file_name } = body;

                if (!file_name) {
                    return sendJson(res, 400, { success: false, error: 'New file_name is required.' });
                }

                const updated = db.updateItem('media', mediaId, { file_name });
                if (!updated) {
                    return sendJson(res, 404, { success: false, error: 'Media record not found.' });
                }
                return sendJson(res, 200, { success: true, message: 'Media renamed successfully.', data: updated });
            }

            // Helper for protected collection routes
            const collectionsMap = {
                '/api/admin/projects': 'portfolio_items',
                '/api/admin/services': 'services',
                '/api/admin/blogs': 'blogs',
                '/api/admin/testimonials': 'testimonials',
                '/api/admin/pricing': 'pricing',
                '/api/admin/faqs': 'faqs',
                '/api/admin/team': 'team',
                '/api/admin/careers': 'careers',
                '/api/admin/messages': 'contact_messages',
                '/api/admin/newsletter': 'newsletter_subscribers',
                '/api/admin/media': 'media',
                '/api/admin/pages': 'pages',
                '/api/admin/navigation': 'navigation',
                '/api/admin/seo': 'seo',
                '/api/admin/users': 'users'
            };

            for (const [routePath, collectionKey] of Object.entries(collectionsMap)) {
                if (pathname === routePath || pathname.startsWith(routePath + '/')) {
                    const user = authenticate(req);
                    if (!user) {
                        return sendJson(res, 401, { success: false, error: 'Unauthorized. Authentication required.' });
                    }

                    const pathParts = pathname.split('/').filter(Boolean); // ['api', 'admin', 'projects', 'id']
                    const itemId = pathParts.length > 3 ? pathParts[3] : null;

                    // GET Collection or Item
                    if (method === 'GET') {
                        if (collectionKey === 'users' && !isAuthorizedRole(user, ['SUPER_ADMIN'])) {
                            return sendJson(res, 403, { success: false, error: 'Forbidden. SUPER_ADMIN privileges required.' });
                        }

                        if (collectionKey === 'users') {
                            const users = db.getAllUsers();
                            return sendJson(res, 200, { success: true, count: users.length, data: users });
                        }

                        const collection = db.getCollection(collectionKey);
                        return sendJson(res, 200, { success: true, count: collection.length, data: collection });
                    }

                    // POST Create Item
                    if (method === 'POST') {
                        const body = await parseJsonBody(req);

                        if (collectionKey === 'users') {
                            if (!isAuthorizedRole(user, ['SUPER_ADMIN'])) {
                                return sendJson(res, 403, { success: false, error: 'Forbidden. SUPER_ADMIN privileges required.' });
                            }
                            if (!body.full_name || !body.email || !body.password || !body.role) {
                                return sendJson(res, 400, { success: false, error: 'Name, email, password, and role are required.' });
                            }
                            if (db.getUserByEmail(body.email)) {
                                return sendJson(res, 400, { success: false, error: 'User with this email already exists.' });
                            }
                            const newUser = db.createUser({
                                full_name: body.full_name,
                                email: body.email,
                                password_hash: bcrypt.hashPassword(body.password, 10),
                                role: body.role,
                                status: 'active'
                            });
                            return sendJson(res, 201, { success: true, message: 'User created successfully.', data: newUser });
                        }

                        // Sanitize HTML content fields for safety
                        if (body.content) body.content = sanitizeHtml(body.content);
                        if (body.full_description) body.full_description = sanitizeHtml(body.full_description);

                        const created = db.addItem(collectionKey, body);
                        return sendJson(res, 201, { success: true, message: 'Item created successfully.', data: created });
                    }

                    // PUT / PATCH Update Item
                    if ((method === 'PUT' || method === 'PATCH') && itemId) {
                        const body = await parseJsonBody(req);

                        // Sanitize HTML content fields for safety
                        if (body.content) body.content = sanitizeHtml(body.content);
                        if (body.full_description) body.full_description = sanitizeHtml(body.full_description);

                        const updated = db.updateItem(collectionKey, itemId, body);
                        if (!updated) {
                            return sendJson(res, 404, { success: false, error: 'Item not found' });
                        }
                        return sendJson(res, 200, { success: true, message: 'Item updated successfully.', data: updated });
                    }

                    // DELETE Item
                    if (method === 'DELETE' && itemId) {
                        if (collectionKey === 'media') {
                            const mediaItem = db.getCollection('media').find(m => m.id === itemId);
                            if (mediaItem) {
                                await storageProvider.deleteAsset(mediaItem.file_url, mediaItem.public_id, mediaItem.provider);
                            }
                        }

                        const deleted = db.deleteItem(collectionKey, itemId);
                        if (!deleted) {
                            return sendJson(res, 404, { success: false, error: 'Item not found' });
                        }
                        return sendJson(res, 200, { success: true, message: 'Item deleted successfully.', data: deleted });
                    }
                }
            }

            // GET & POST /api/admin/settings
            if (pathname === '/api/admin/settings') {
                const user = authenticate(req);
                if (!user) {
                    return sendJson(res, 401, { success: false, error: 'Unauthorized.' });
                }
                if (method === 'GET') {
                    return sendJson(res, 200, { success: true, data: db.inMemoryData.settings });
                }
                if (method === 'POST' || method === 'PUT') {
                    const body = await parseJsonBody(req);
                    db.inMemoryData.settings = Object.assign({}, db.inMemoryData.settings, body);
                    db.logActivity('Settings Updated', user.email, 'Updated system settings.');
                    return sendJson(res, 200, { success: true, message: 'Settings saved.', data: db.inMemoryData.settings });
                }
            }

            // ==================================================
            // PUBLIC WEBSITE API ENDPOINTS
            // ==================================================
            if (pathname === '/api/public/site-settings' && method === 'GET') {
                return sendJson(res, 200, { success: true, data: db.inMemoryData.settings });
            }
            if (pathname === '/api/public/navigation' && method === 'GET') {
                const nav = db.getCollection('navigation').filter(n => n.visible !== false);
                return sendJson(res, 200, { success: true, data: nav });
            }
            if (pathname === '/api/services' && method === 'GET') {
                const services = db.getServices().filter(s => s.status !== 'draft' && s.status !== 'archived');
                return sendJson(res, 200, { success: true, count: services.length, data: services });
            }
            if (pathname === '/api/portfolio' && method === 'GET') {
                const category = parsedUrl.searchParams.get('category');
                let items = db.getPortfolio(category);
                items = items.filter(p => p.status !== 'draft' && p.status !== 'archived');
                return sendJson(res, 200, { success: true, count: items.length, data: items });
            }
            if (pathname === '/api/blogs' && method === 'GET') {
                const blogs = db.getCollection('blogs').filter(b => b.status === 'published' || b.status === undefined);
                return sendJson(res, 200, { success: true, count: blogs.length, data: blogs });
            }
            if (pathname === '/api/testimonials' && method === 'GET') {
                const testimonials = db.getCollection('testimonials').filter(t => t.status === 'published' || t.status === undefined);
                return sendJson(res, 200, { success: true, count: testimonials.length, data: testimonials });
            }
            if (pathname === '/api/pricing' && method === 'GET') {
                const pricing = db.getCollection('pricing').filter(p => p.status === 'published' || p.status === undefined);
                return sendJson(res, 200, { success: true, count: pricing.length, data: pricing });
            }
            if (pathname === '/api/faqs' && method === 'GET') {
                const faqs = db.getCollection('faqs').filter(f => f.status === 'published' || f.status === undefined);
                return sendJson(res, 200, { success: true, count: faqs.length, data: faqs });
            }
            if (pathname === '/api/team' && method === 'GET') {
                const team = db.getCollection('team').filter(t => t.status === 'active' || t.status === undefined);
                return sendJson(res, 200, { success: true, count: team.length, data: team });
            }
            if (pathname === '/api/careers' && method === 'GET') {
                const careers = db.getCollection('careers').filter(c => c.status === 'active' || c.status === undefined);
                return sendJson(res, 200, { success: true, count: careers.length, data: careers });
            }
            if (pathname === '/api/stats' && method === 'GET') {
                return sendJson(res, 200, { success: true, data: db.getStats() });
            }
            if (pathname === '/api/estimator' && method === 'POST') {
                const body = await parseJsonBody(req);
                const inquiryRecord = db.addInquiry(body);
                return sendJson(res, 201, { success: true, inquiry: inquiryRecord });
            }
            if ((pathname === '/api/contact' || pathname === '/api/messages') && method === 'POST') {
                const body = await parseJsonBody(req);
                const contactRecord = db.addContactMessage(body);
                return sendJson(res, 201, { success: true, message: 'Message submitted successfully.', data: contactRecord });
            }
            if (pathname === '/api/subscribe' && method === 'POST') {
                const body = await parseJsonBody(req);
                const result = db.addSubscriber(body.email);
                return sendJson(res, 200, { success: true, message: result.message, data: result.subscriber });
            }

            return sendJson(res, 404, { success: false, error: 'API endpoint not found' });

        } catch (err) {
            console.error('[API Error]', err.message);
            return sendJson(res, 500, { success: false, error: err.message || 'Internal Server Error' });
        }
    }

    // --- STATIC FILES / FRONTEND SERVING ---
    let targetFilePath;

    // Check for admin routes and static assets
    if (pathname === '/admin.html') {
        targetFilePath = path.join(__dirname, '../frontend/admin.html');
    } else if (pathname.startsWith('/admin') || pathname === '/login' || pathname.startsWith('/login/')) {
        const distIndexPath = path.join(__dirname, '../dist/index.html');
        if (fs.existsSync(distIndexPath)) {
            targetFilePath = distIndexPath;
        } else {
            targetFilePath = path.join(__dirname, '../frontend/admin.html');
        }
    } else if (pathname.startsWith('/uploads/')) {
        const uploadFileName = path.basename(pathname);
        targetFilePath = path.join(__dirname, '../uploads', uploadFileName);
        if (!fs.existsSync(targetFilePath)) {
            targetFilePath = path.join(__dirname, '../frontend/uploads', uploadFileName);
        }
    } else if (pathname.startsWith('/assets/')) {
        const distAssetPath = path.join(__dirname, '../dist', pathname);
        if (fs.existsSync(distAssetPath)) {
            targetFilePath = distAssetPath;
        } else {
            targetFilePath = path.join(__dirname, '..', pathname);
        }
    } else {
        const relativePath = pathname === '/' ? 'index.html' : pathname;
        const frontendFilePath = path.join(__dirname, '../frontend', relativePath);
        const distFilePath = path.join(__dirname, '../dist', relativePath);

        if (fs.existsSync(frontendFilePath) && fs.statSync(frontendFilePath).isFile()) {
            targetFilePath = frontendFilePath;
        } else if (fs.existsSync(distFilePath) && fs.statSync(distFilePath).isFile()) {
            targetFilePath = distFilePath;
        } else {
            targetFilePath = path.join(__dirname, '../frontend/index.html');
        }
    }

    const ext = path.extname(targetFilePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'text/html';

    serveStaticFile(res, targetFilePath, contentType);
});

server.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(`🚀 Growth IT Solution Server Running (Phase 3 Full Admin)!`);
    console.log(`🌐 Local Portal: http://${HOST}:${PORT}/admin/login`);
    console.log(`🔌 API Health:   http://${HOST}:${PORT}/api/health`);
    console.log(`====================================================`);
});
