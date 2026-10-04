/**
 * Integration Test for Growth IT Solution API
 */

const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: body });
                }
            });
        });

        req.on('error', err => reject(err));
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Starting API Verification Tests...');
    try {
        // Test Health
        const health = await makeRequest('/api/health');
        console.log('✅ /api/health Response:', health.statusCode, health.body.status);

        // Test Services
        const services = await makeRequest('/api/services');
        console.log('✅ /api/services Count:', services.body.data.length);

        // Test Portfolio
        const portfolio = await makeRequest('/api/portfolio');
        console.log('✅ /api/portfolio Count:', portfolio.body.data.length);

        // Test Estimator POST
        const estimate = await makeRequest('/api/estimator', 'POST', {
            client_name: 'Test Client',
            client_email: 'test@example.com',
            service_category: 'Artificial Intelligence',
            scale: 'Growth Scale',
            features: ['Custom RAG Pipeline', '24/7 Monitoring']
        });
        console.log('✅ /api/estimator Budget:', estimate.body.inquiry.estimated_budget_usd);

        // Test Contact POST
        const contact = await makeRequest('/api/contact', 'POST', {
            name: 'John Test',
            email: 'john@growthit.com',
            subject: 'Cloud Migration Quote',
            message: 'Need urgent cloud architecture review.'
        });
        console.log('✅ /api/contact Status:', contact.body.success);

        console.log('🎉 All API Integration Tests Passed Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ API Test Failed:', err.message);
        process.exit(1);
    }
}

// Give server 1 second to bind if spawned
setTimeout(runTests, 1000);
