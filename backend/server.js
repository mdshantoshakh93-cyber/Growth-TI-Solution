/**
 * Growth IT Solution REST API Server
 * Built with Node.js native HTTP module (Zero-dependency & High Performance)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');

const PORT = process.env.PORT || 5000;
const HOST = '127.0.0.1';

// Helper: Parse JSON request body
function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1e6) { // 1MB limit safeguard
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

// Helper: Send JSON response
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-store'
    });
    res.end(JSON.stringify(data));
}

// Helper: Serve Static Files
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

// MIME types lookup
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
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

    // Handle CORS preflight options
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
                    version: '1.0.0',
                    timestamp: new Date().toISOString()
                });
            }

            // GET /api/services
            if (pathname === '/api/services' && method === 'GET') {
                const services = db.getServices();
                return sendJson(res, 200, { success: true, data: services });
            }

            // GET /api/portfolio
            if (pathname === '/api/portfolio' && method === 'GET') {
                const category = parsedUrl.searchParams.get('category');
                const items = db.getPortfolio(category);
                return sendJson(res, 200, { success: true, count: items.length, data: items });
            }

            // GET /api/stats
            if (pathname === '/api/stats' && method === 'GET') {
                const stats = db.getStats();
                return sendJson(res, 200, { success: true, data: stats });
            }

            // GET /api/inquiries
            if (pathname === '/api/inquiries' && method === 'GET') {
                const inquiries = db.getInquiries();
                return sendJson(res, 200, { success: true, count: inquiries.length, data: inquiries });
            }

            // POST /api/estimator
            if (pathname === '/api/estimator' && method === 'POST') {
                const body = await parseJsonBody(req);
                
                // Calculate dynamic project estimate logic
                let baseCost = 3000;
                let scaleMultiplier = 1.0;
                let estimatedWeeks = 4;

                if (body.service_category === 'Artificial Intelligence') baseCost = 4500;
                else if (body.service_category === 'Cloud Infrastructure') baseCost = 3500;
                else if (body.service_category === 'Security & Compliance') baseCost = 4000;

                if (body.scale === 'Growth Scale') {
                    scaleMultiplier = 1.8;
                    estimatedWeeks = 6;
                } else if (body.scale === 'Enterprise System') {
                    scaleMultiplier = 3.2;
                    estimatedWeeks = 10;
                }

                let featureAddonCost = (body.features ? body.features.length : 0) * 750;
                let totalEstimatedBudget = Math.round((baseCost * scaleMultiplier) + featureAddonCost);

                const inquiryRecord = db.addInquiry({
                    client_name: body.client_name,
                    client_email: body.client_email,
                    company_name: body.company_name,
                    service_category: body.service_category || 'Software Engineering',
                    scale: body.scale || 'Startup MVP',
                    estimated_budget_usd: totalEstimatedBudget,
                    timeline_weeks: estimatedWeeks,
                    features: body.features || []
                });

                return sendJson(res, 201, {
                    success: true,
                    message: 'Project estimate calculated and saved successfully!',
                    inquiry: inquiryRecord
                });
            }

            // POST /api/contact
            if (pathname === '/api/contact' && method === 'POST') {
                const body = await parseJsonBody(req);
                if (!body.name || !body.email || !body.message) {
                    return sendJson(res, 400, { success: false, error: 'Name, email, and message are required.' });
                }
                const contactRecord = db.addContactMessage(body);
                return sendJson(res, 201, {
                    success: true,
                    message: 'Thank you for reaching out! A Growth IT Solution engineer will contact you shortly.',
                    data: contactRecord
                });
            }

            // POST /api/subscribe
            if (pathname === '/api/subscribe' && method === 'POST') {
                const body = await parseJsonBody(req);
                const result = db.addSubscriber(body.email);
                return sendJson(res, 200, { success: true, message: result.message, data: result.subscriber });
            }

            // 404 for unknown API routes
            return sendJson(res, 404, { success: false, error: 'API endpoint not found' });

        } catch (err) {
            console.error('[API Error]', err.message);
            return sendJson(res, 500, { success: false, error: err.message || 'Internal Server Error' });
        }
    }

    // --- STATIC FILES / FRONTEND ---
    let reqFilePath = pathname === '/' ? '/index.html' : pathname;
    
    // Check if requesting from assets
    let targetFilePath;
    if (reqFilePath.startsWith('/assets/')) {
        targetFilePath = path.join(__dirname, '..', reqFilePath);
    } else {
        targetFilePath = path.join(__dirname, '../frontend', reqFilePath);
    }

    const ext = path.extname(targetFilePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    serveStaticFile(res, targetFilePath, contentType);
});

server.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(`🚀 Growth IT Solution Server Running!`);
    console.log(`🌐 Local Server:  http://${HOST}:${PORT}`);
    console.log(`🔌 API Endpoint: http://${HOST}:${PORT}/api/health`);
    console.log(`====================================================`);
});
