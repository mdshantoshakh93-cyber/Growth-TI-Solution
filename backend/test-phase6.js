const http = require('http');

const BASE_URL = 'http://127.0.0.1:5000';

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

        const req = http.request(options, (res) => {
            let data = '';
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

async function runPhase6Tests() {
    console.log('====================================================');
    console.log('🧪 Starting Phase 6 Public Website Integration Test Suite...');
    console.log('====================================================');

    try {
        // 1. Test Site Settings & Navigation
        const settingsRes = await makeRequest('/api/public/site-settings');
        if (settingsRes.status !== 200 || !settingsRes.body.data.site_name) {
            throw new Error(`Site settings fetch failed: ${JSON.stringify(settingsRes.body)}`);
        }
        console.log('✅ 1. GET /api/public/site-settings:', settingsRes.body.data.site_name);

        const navRes = await makeRequest('/api/public/navigation');
        if (navRes.status !== 200 || !Array.isArray(navRes.body.data)) {
            throw new Error(`Navigation fetch failed: ${JSON.stringify(navRes.body)}`);
        }
        console.log('✅ 2. GET /api/public/navigation:', navRes.body.data.length, 'items');

        // 2. Test Dynamic Collections (Services, Portfolio, Blogs, Testimonials, Pricing, FAQs, Team, Careers)
        const servicesRes = await makeRequest('/api/services');
        if (servicesRes.status !== 200) throw new Error('Services fetch failed');
        console.log('✅ 3. GET /api/services:', servicesRes.body.count, 'services');

        const portfolioRes = await makeRequest('/api/portfolio');
        if (portfolioRes.status !== 200) throw new Error('Portfolio fetch failed');
        console.log('✅ 4. GET /api/portfolio:', portfolioRes.body.count, 'projects');

        const blogsRes = await makeRequest('/api/blogs');
        if (blogsRes.status !== 200) throw new Error('Blogs fetch failed');
        console.log('✅ 5. GET /api/blogs:', blogsRes.body.count, 'articles');

        const testmRes = await makeRequest('/api/testimonials');
        if (testmRes.status !== 200) throw new Error('Testimonials fetch failed');
        console.log('✅ 6. GET /api/testimonials:', testmRes.body.count, 'testimonials');

        const pricingRes = await makeRequest('/api/pricing');
        if (pricingRes.status !== 200) throw new Error('Pricing fetch failed');
        console.log('✅ 7. GET /api/pricing:', pricingRes.body.count, 'plans');

        const faqsRes = await makeRequest('/api/faqs');
        if (faqsRes.status !== 200) throw new Error('FAQs fetch failed');
        console.log('✅ 8. GET /api/faqs:', faqsRes.body.count, 'faqs');

        const teamRes = await makeRequest('/api/team');
        if (teamRes.status !== 200) throw new Error('Team fetch failed');
        console.log('✅ 9. GET /api/team:', teamRes.body.count, 'members');

        const careersRes = await makeRequest('/api/careers');
        if (careersRes.status !== 200) throw new Error('Careers fetch failed');
        console.log('✅ 10. GET /api/careers:', careersRes.body.count, 'jobs');

        // 3. Test Contact Form Submission (POST /api/messages)
        const contactRes = await makeRequest('/api/messages', 'POST', {
            name: 'Phase 6 Tester',
            email: 'phase6@test.com',
            phone: '+1-555-0199',
            company: 'Phase 6 Enterprise',
            service: 'Enterprise AI',
            budget: '$15,000 - $50,000',
            message: 'Testing public contact submission.'
        });
        if (contactRes.status !== 201 || !contactRes.body.success) {
            throw new Error(`Contact submission failed: ${JSON.stringify(contactRes.body)}`);
        }
        console.log('✅ 11. POST /api/messages (Public Contact Submission):', contactRes.body.data.id);

        // 4. Test Newsletter Subscription (POST /api/subscribe)
        const subRes = await makeRequest('/api/subscribe', 'POST', {
            email: 'newsletter_subscriber@growthit.com'
        });
        if (subRes.status !== 200 || !subRes.body.success) {
            throw new Error(`Newsletter subscription failed: ${JSON.stringify(subRes.body)}`);
        }
        console.log('✅ 12. POST /api/subscribe (Newsletter):', subRes.body.message);

        console.log('====================================================');
        console.log('🎉 ALL PHASE 6 PUBLIC WEBSITE TESTS PASSED PERFECTLY!');
        console.log('====================================================');

    } catch (err) {
        console.error('❌ Phase 6 Test Failed:', err.message);
        process.exit(1);
    }
}

runPhase6Tests();
