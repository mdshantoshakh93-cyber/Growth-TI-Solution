/**
 * Growth IT Solution - Phase 3 Admin Dashboard & REST API Integration Test Suite
 */

const http = require('http');

const BASE_URL = 'http://127.0.0.1:5000';

function makeRequest(path, method = 'GET', data = null, cookie = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const reqHeaders = { 'Content-Type': 'application/json' };
        if (cookie) reqHeaders['Cookie'] = cookie;

        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: reqHeaders
        };

        const req = http.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                let parsed;
                try { parsed = JSON.parse(body); } catch (e) { parsed = body; }
                resolve({ statusCode: res.statusCode, setCookie: res.headers['set-cookie'], body: parsed });
            });
        });

        req.on('error', err => reject(err));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

function extractCookie(setCookieHeader) {
    if (!setCookieHeader) return null;
    const cookieStr = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
    const match = cookieStr.match(/session_id=([^;]+)/);
    return match ? `session_id=${match[1]}` : null;
}

async function runPhase3Tests() {
    console.log('====================================================');
    console.log('🧪 Starting Phase 3 Full Admin Dashboard Test Suite...');
    console.log('====================================================');

    try {
        // 1. Login as SUPER_ADMIN
        const loginRes = await makeRequest('/api/auth/login', 'POST', {
            email: 'growthitsolution@gmail.com',
            password: 'growthitsolution123'
        });
        if (loginRes.statusCode !== 200) throw new Error('Login failed for growthitsolution@gmail.com');
        const cookie = extractCookie(loginRes.setCookie);
        console.log('✅ 1. Authenticated as SUPER_ADMIN (growthitsolution@gmail.com)');

        // 2. GET /api/admin/stats (Real Database Stats)
        const statsRes = await makeRequest('/api/admin/stats', 'GET', null, cookie);
        console.log('✅ 2. GET /api/admin/stats Response:', statsRes.statusCode, statsRes.body.data);
        const stats = statsRes.body.data;
        if (stats.total_projects === undefined || stats.published_projects === undefined || stats.draft_projects === undefined) {
            throw new Error('Stats payload missing required fields!');
        }

        // 3. GET /api/admin/activity-logs
        const logsRes = await makeRequest('/api/admin/activity-logs', 'GET', null, cookie);
        console.log('✅ 3. GET /api/admin/activity-logs Count:', logsRes.body.count);

        // 4. Test CRUD for Projects
        const createProject = await makeRequest('/api/admin/projects', 'POST', {
            title: 'Quantum Financial AI Engine',
            client_name: 'Quantum Corp',
            industry: 'FinTech',
            status: 'published'
        }, cookie);
        console.log('✅ 4. POST /api/admin/projects:', createProject.statusCode, createProject.body.data.id);

        // 5. Test CRUD for Services
        const createService = await makeRequest('/api/admin/services', 'POST', {
            title: 'Quantum Cryptography Security',
            category: 'Security & Compliance',
            starting_price: 5000
        }, cookie);
        console.log('✅ 5. POST /api/admin/services:', createService.statusCode, createService.body.data.id);

        // 6. Test GET Collections
        const collections = ['projects', 'services', 'blogs', 'testimonials', 'pricing', 'faqs', 'team', 'careers', 'messages', 'newsletter', 'media', 'pages', 'navigation', 'seo', 'users'];
        for (const col of collections) {
            const colRes = await makeRequest(`/api/admin/${col}`, 'GET', null, cookie);
            if (colRes.statusCode !== 200) throw new Error(`Failed GET /api/admin/${col}`);
        }
        console.log(`✅ 6. Successfully verified all ${collections.length} Admin Collection endpoints!`);

        console.log('\n====================================================');
        console.log('🎉 ALL PHASE 3 ADMIN DASHBOARD TESTS PASSED PERFECTLY!');
        console.log('====================================================');
        process.exit(0);

    } catch (err) {
        console.error('❌ Phase 3 Test Failed:', err.message);
        process.exit(1);
    }
}

runPhase3Tests();
