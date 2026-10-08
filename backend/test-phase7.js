/**
 * Growth IT Solution - Phase 7 Integration Verification Test Suite
 * Tests site settings, homepage hero content, contact phone/email, logo, services, projects, blogs, pricing management via Admin API and verifies immediate dynamic reflections on Public API endpoints.
 */

const http = require('http');

const BASE_URL = 'http://127.0.0.1:5000';
const ADMIN_EMAIL = 'growthitsolution@gmail.com';
const ADMIN_PASSWORD = 'growthitsolution123';

function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method,
            headers: Object.assign({
                'Content-Type': 'application/json'
            }, headers)
        };

        const req = http.request(options, (res) => {
            let data = '';
            const setCookie = res.headers['set-cookie'];

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    setCookie,
                    body: parsed
                });
            });
        });

        req.on('error', reject);
        if (body) {
            req.write(typeof body === 'string' ? body : JSON.stringify(body));
        }
        req.end();
    });
}

async function runPhase7Tests() {
    console.log(`====================================================`);
    console.log(`🧪 STARTING PHASE 7 INTEGRATION VERIFICATION SUITE`);
    console.log(`====================================================\n`);

    let passedTests = 0;
    let failedTests = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`  ✅ PASS: ${message}`);
            passedTests++;
        } else {
            console.error(`  ❌ FAIL: ${message}`);
            failedTests++;
        }
    }

    try {
        // Step 1: Admin Login
        console.log(`--- STEP 1: Authenticating Super Admin ---`);
        const loginRes = await makeRequest('POST', '/api/auth/login', {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        assert(loginRes.status === 200, `Admin Login HTTP 200 (Got ${loginRes.status})`);
        const token = loginRes.body?.token;
        const cookieHeader = loginRes.setCookie ? loginRes.setCookie[0].split(';')[0] : `session_id=${token}`;
        assert(Boolean(token), `Received valid session token (${token ? token.substring(0, 10) + '...' : 'none'})`);

        const authHeaders = {
            'Authorization': `Bearer ${token}`,
            'Cookie': cookieHeader
        };

        // Step 2: Change Logo, Hero Title, Hero Description, Phone, Email from Admin Settings
        console.log(`\n--- STEP 2: Updating Site Settings & Hero Content via Admin API ---`);
        const updatedSettingsPayload = {
            logo: 'https://cdn.growthit.com/brand/new-logo-2026.png',
            hero_heading: 'Empowering Global Enterprises with Next-Gen Cloud & AI Engine',
            hero_description: 'Growth IT Solution architects mission-critical AWS/GCP cloud platforms and bespoke LLM AI microservices for scale-ups worldwide.',
            contact_phone: '+1 (888) 999-GROWTH',
            support_email: 'contact.updated@growthitsolution.com',
            business_hours: '24/7 Global Engineering Operations'
        };

        const updateSettingsRes = await makeRequest('POST', '/api/admin/settings', updatedSettingsPayload, authHeaders);
        assert(updateSettingsRes.status === 200, `POST /api/admin/settings HTTP 200 (Got ${updateSettingsRes.status})`);
        assert(updateSettingsRes.body?.data?.logo === updatedSettingsPayload.logo, `Admin Settings updated new logo URL`);
        assert(updateSettingsRes.body?.data?.hero_heading === updatedSettingsPayload.hero_heading, `Admin Settings updated new hero heading`);
        assert(updateSettingsRes.body?.data?.contact_phone === updatedSettingsPayload.contact_phone, `Admin Settings updated new phone number`);
        assert(updateSettingsRes.body?.data?.support_email === updatedSettingsPayload.support_email, `Admin Settings updated new support email`);

        // Step 3: Verify Public API reflects Site Settings changes
        console.log(`\n--- STEP 3: Verifying Public Website Settings API (/api/public/site-settings) ---`);
        const publicSettingsRes = await makeRequest('GET', '/api/public/site-settings');
        assert(publicSettingsRes.status === 200, `GET /api/public/site-settings HTTP 200`);
        assert(publicSettingsRes.body?.data?.logo === updatedSettingsPayload.logo, `Public website reflects NEW LOGO dynamically`);
        assert(publicSettingsRes.body?.data?.hero_heading === updatedSettingsPayload.hero_heading, `Public website reflects NEW HERO HEADING dynamically`);
        assert(publicSettingsRes.body?.data?.hero_description === updatedSettingsPayload.hero_description, `Public website reflects NEW HERO DESCRIPTION dynamically`);
        assert(publicSettingsRes.body?.data?.contact_phone === updatedSettingsPayload.contact_phone, `Public website reflects NEW PHONE NUMBER dynamically`);
        assert(publicSettingsRes.body?.data?.support_email === updatedSettingsPayload.support_email, `Public website reflects NEW EMAIL dynamically`);

        // Step 4: Admin CRUD - Update a Service
        console.log(`\n--- STEP 4: Modifying a Service via Admin API (/api/admin/services) ---`);
        const servicesListRes = await makeRequest('GET', '/api/admin/services', null, authHeaders);
        const targetService = servicesListRes.body?.data[0];
        assert(Boolean(targetService), `Found existing service item (${targetService?.id})`);

        const newServiceTitle = `Quantum Cloud Infrastructure & MLOps ${Date.now()}`;
        const updateServiceRes = await makeRequest('PUT', `/api/admin/services/${targetService.id}`, {
            name: newServiceTitle,
            tagline: 'Quantum-ready serverless cloud infrastructure'
        }, authHeaders);
        assert(updateServiceRes.status === 200, `PUT /api/admin/services/${targetService.id} HTTP 200`);

        // Verify Public Services API
        const publicServicesRes = await makeRequest('GET', '/api/services');
        const updatedPublicService = publicServicesRes.body?.data.find(s => s.id === targetService.id);
        assert(updatedPublicService?.name === newServiceTitle, `Public Services API reflects modified Service Name: "${updatedPublicService?.name}"`);

        // Step 5: Admin CRUD - Update a Project
        console.log(`\n--- STEP 5: Modifying a Project via Admin API (/api/admin/projects) ---`);
        const projectsListRes = await makeRequest('GET', '/api/admin/projects', null, authHeaders);
        const targetProject = projectsListRes.body?.data[0];
        assert(Boolean(targetProject), `Found existing project item (${targetProject?.id})`);

        const newProjectTitle = `AI-Autonomous Satellite Logistics ${Date.now()}`;
        const updateProjectRes = await makeRequest('PUT', `/api/admin/projects/${targetProject.id}`, {
            title: newProjectTitle,
            short_description: 'Satellite AI computer vision route optimization.'
        }, authHeaders);
        assert(updateProjectRes.status === 200, `PUT /api/admin/projects/${targetProject.id} HTTP 200`);

        // Verify Public Projects API
        const publicProjectsRes = await makeRequest('GET', '/api/portfolio');
        const updatedPublicProject = publicProjectsRes.body?.data.find(p => p.id === targetProject.id);
        assert(updatedPublicProject?.title === newProjectTitle, `Public Portfolio API reflects modified Project Title: "${updatedPublicProject?.title}"`);

        // Step 6: Admin CRUD - Create and Update a Blog
        console.log(`\n--- STEP 6: Creating and Modifying a Blog via Admin API (/api/admin/blogs) ---`);
        const newBlogPayload = {
            title: `Phase 7 Automated Testing & Dynamic Content Sync`,
            slug: `phase-7-testing-${Date.now()}`,
            category: 'Engineering',
            content: '<p>This blog was created via Phase 7 Admin Panel API verification.</p>',
            status: 'published'
        };
        const createBlogRes = await makeRequest('POST', '/api/admin/blogs', newBlogPayload, authHeaders);
        assert(createBlogRes.status === 201, `POST /api/admin/blogs HTTP 201`);

        // Verify Public Blogs API
        const publicBlogsRes = await makeRequest('GET', '/api/blogs');
        const createdPublicBlog = publicBlogsRes.body?.data.find(b => b.title === newBlogPayload.title);
        assert(Boolean(createdPublicBlog), `Public Blogs API reflects newly created Blog post: "${createdPublicBlog?.title}"`);

        // Step 7: Admin CRUD - Update Pricing Tier
        console.log(`\n--- STEP 7: Modifying Pricing Tiers via Admin API (/api/admin/pricing) ---`);
        const pricingListRes = await makeRequest('GET', '/api/admin/pricing', null, authHeaders);
        const targetPricing = pricingListRes.body?.data[0];
        assert(Boolean(targetPricing), `Found existing pricing tier (${targetPricing?.id})`);

        const updatedPrice = 9999;
        const updatePricingRes = await makeRequest('PUT', `/api/admin/pricing/${targetPricing.id}`, {
            price_usd: updatedPrice,
            tier_name: 'Startup MVP Engine Pro'
        }, authHeaders);
        assert(updatePricingRes.status === 200, `PUT /api/admin/pricing/${targetPricing.id} HTTP 200`);

        // Verify Public Pricing API
        const publicPricingRes = await makeRequest('GET', '/api/pricing');
        const updatedPublicPricing = publicPricingRes.body?.data.find(p => p.id === targetPricing.id);
        assert(updatedPublicPricing?.price_usd === updatedPrice || updatedPublicPricing?.price === updatedPrice, `Public Pricing API reflects updated tier price ($${updatedPrice})`);

    } catch (err) {
        console.error(`💥 TEST SUITE EXCEPTION:`, err.message);
        failedTests++;
    }

    console.log(`\n====================================================`);
    console.log(`📊 PHASE 7 INTEGRATION TEST SUMMARY`);
    console.log(`Passed: ${passedTests}`);
    console.error(`Failed: ${failedTests}`);
    console.log(`====================================================`);

    if (failedTests > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runPhase7Tests();
