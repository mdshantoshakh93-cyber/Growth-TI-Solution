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

async function runPhase4Tests() {
    console.log('====================================================');
    console.log('🧪 Starting Phase 4 Full CRUD & Integration Test Suite...');
    console.log('====================================================');

    try {
        // 1. Authenticate as Super Admin
        const loginRes = await makeRequest('/api/auth/login', 'POST', {
            email: 'growthitsolution@gmail.com',
            password: 'growthitsolution123'
        });

        if (loginRes.status !== 200 || !loginRes.body.success) {
            throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
        }
        console.log('✅ 1. Authenticated as Super Admin successfully');

        // 2. Test Projects CRUD
        const projectRes = await makeRequest('/api/admin/projects', 'POST', {
            title: 'Test Enterprise AI Engine',
            slug: 'test-ai-engine',
            category: 'Enterprise AI',
            client_name: 'Alpha Corp',
            technologies: ['Python', 'PyTorch', 'AWS'],
            features: ['Real-time processing', 'SOC2 Certified'],
            status: 'published'
        });
        if (projectRes.status !== 201) throw new Error(`Project Create failed: ${JSON.stringify(projectRes.body)}`);
        const projectId = projectRes.body.data.id;
        console.log('✅ 2. Project Created:', projectId);

        const projectUpdate = await makeRequest(`/api/admin/projects/${projectId}`, 'PUT', {
            title: 'Updated Enterprise AI Engine',
            status: 'archived'
        });
        if (projectUpdate.status !== 200 || projectUpdate.body.data.status !== 'archived') {
            throw new Error(`Project Update failed: ${JSON.stringify(projectUpdate.body)}`);
        }
        console.log('✅ 3. Project Updated & Archived:', projectUpdate.body.data.title);

        // 3. Test Blogs CRUD with HTML Sanitization
        const blogRes = await makeRequest('/api/admin/blogs', 'POST', {
            title: 'Security Auditing Post',
            slug: 'security-auditing-post',
            category: 'Cybersecurity',
            author: 'Chief Architect',
            content: '<h2>Safe Heading</h2><script>alert("xss")</script><p>Clean content body</p>',
            status: 'published'
        });
        if (blogRes.status !== 201) throw new Error(`Blog Create failed: ${JSON.stringify(blogRes.body)}`);
        const blogId = blogRes.body.data.id;
        if (blogRes.body.data.content.includes('<script>')) {
            throw new Error('HTML Sanitization failed! Malicious <script> tag remained.');
        }
        console.log('✅ 4. Blog Created & Backend HTML Sanitization verified (Malicious <script> stripped)');

        // 4. Test Services CRUD
        const serviceRes = await makeRequest('/api/admin/services', 'POST', {
            name: 'Zero Trust Security Audit',
            slug: 'zero-trust-audit',
            icon: '🛡️',
            pricing: '$5,000 / audit',
            status: 'published'
        });
        if (serviceRes.status !== 201) throw new Error(`Service Create failed: ${JSON.stringify(serviceRes.body)}`);
        const serviceId = serviceRes.body.data.id;
        console.log('✅ 5. Service Created:', serviceId);

        // 5. Test Testimonials CRUD
        const testmRes = await makeRequest('/api/admin/testimonials', 'POST', {
            name: 'Jane Doe',
            company: 'TechCorp',
            position: 'CTO',
            rating: 5,
            review: 'Outstanding engineering team.',
            status: 'published'
        });
        if (testmRes.status !== 201) throw new Error(`Testimonial Create failed: ${JSON.stringify(testmRes.body)}`);
        const testmId = testmRes.body.data.id;
        console.log('✅ 6. Testimonial Created:', testmId);

        // 6. Test Pricing CRUD
        const priceRes = await makeRequest('/api/admin/pricing', 'POST', {
            plan_name: 'Global Enterprise Tier',
            price: '9999',
            currency: '$',
            features: ['Dedicated DevOps Team', '24/7 SLA'],
            status: 'published'
        });
        if (priceRes.status !== 201) throw new Error(`Pricing Create failed: ${JSON.stringify(priceRes.body)}`);
        const priceId = priceRes.body.data.id;
        console.log('✅ 7. Pricing Plan Created:', priceId);

        // 7. Test Contact Message API & Admin Message status update
        const publicContact = await makeRequest('/api/contact', 'POST', {
            name: 'Integration Tester',
            email: 'test@example.com',
            subject: 'Phase 4 CRUD Verification',
            message: 'Testing contact flow integration.'
        });
        if (publicContact.status !== 201) throw new Error(`Contact message failed: ${JSON.stringify(publicContact.body)}`);
        const msgId = publicContact.body.data.id;
        console.log('✅ 8. Public Contact Message Created:', msgId);

        const msgUpdate = await makeRequest(`/api/admin/messages/${msgId}`, 'PUT', {
            status: 'replied'
        });
        if (msgUpdate.status !== 200 || msgUpdate.body.data.status !== 'replied') {
            throw new Error(`Message Status Update failed: ${JSON.stringify(msgUpdate.body)}`);
        }
        console.log('✅ 9. Admin Message Status updated to replied');

        // 8. Test Delete Operations
        const deleteProj = await makeRequest(`/api/admin/projects/${projectId}`, 'DELETE');
        if (deleteProj.status !== 200) throw new Error(`Delete Project failed: ${JSON.stringify(deleteProj.body)}`);
        console.log('✅ 10. Project Deleted:', projectId);

        console.log('====================================================');
        console.log('🎉 ALL PHASE 4 CRUD & REST API TESTS PASSED PERFECTLY!');
        console.log('====================================================');

    } catch (err) {
        console.error('❌ Phase 4 Test Failed:', err.message);
        process.exit(1);
    }
}

runPhase4Tests();
