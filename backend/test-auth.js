/**
 * Growth IT Solution - Phase 2 Comprehensive Auth & Authorization Integration Test Suite
 */

const http = require('http');

const BASE_URL = 'http://127.0.0.1:5000';

function makeRequest(path, method = 'GET', data = null, cookie = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const reqHeaders = Object.assign({
            'Content-Type': 'application/json'
        }, headers);

        if (cookie) {
            reqHeaders['Cookie'] = cookie;
        }

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
                try {
                    parsed = JSON.parse(body);
                } catch (e) {
                    parsed = body;
                }
                const setCookieHeader = res.headers['set-cookie'];
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    setCookie: setCookieHeader,
                    body: parsed
                });
            });
        });

        req.on('error', err => reject(err));
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

function extractSessionCookie(setCookieHeader) {
    if (!setCookieHeader) return null;
    const cookieStr = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
    const match = cookieStr.match(/session_id=([^;]+)/);
    return match ? `session_id=${match[1]}` : null;
}

async function runAuthTests() {
    console.log('====================================================');
    console.log('🧪 Starting Phase 2 Admin Auth & Authorization Test Suite...');
    console.log('====================================================');

    try {
        // 1. Health check
        const health = await makeRequest('/api/health');
        console.log(`\n1️⃣ [/api/health Check] -> Status: ${health.statusCode} | Version: ${health.body.version}`);

        // 2. Missing credentials test
        const missingCreds = await makeRequest('/api/auth/login', 'POST', {});
        console.log(`\n2️⃣ [Missing Credentials Test] -> Status: ${missingCreds.statusCode} (Expected: 400)`);
        if (missingCreds.statusCode !== 400) throw new Error('Failed Missing Credentials Test');
        console.log(`   ✅ Response error: "${missingCreds.body.error}"`);

        // 3. Wrong password test
        const wrongPass = await makeRequest('/api/auth/login', 'POST', {
            email: 'growthitsolution@gmail.com',
            password: 'WrongPassword123!'
        });
        console.log(`\n3️⃣ [Wrong Password Test] -> Status: ${wrongPass.statusCode} (Expected: 401)`);
        if (wrongPass.statusCode !== 401) throw new Error('Failed Wrong Password Test');
        console.log(`   ✅ Response error: "${wrongPass.body.error}"`);

        // 4. Protected API without login test
        const unauthenticatedMe = await makeRequest('/api/auth/me');
        console.log(`\n4️⃣ [Unauthenticated /api/auth/me] -> Status: ${unauthenticatedMe.statusCode} (Expected: 401)`);
        if (unauthenticatedMe.statusCode !== 401) throw new Error('Failed Unauthenticated Me Test');
        console.log(`   ✅ Response error: "${unauthenticatedMe.body.error}"`);

        // 5. Successful Login (SUPER_ADMIN)
        const superAdminLogin = await makeRequest('/api/auth/login', 'POST', {
            email: 'growthitsolution@gmail.com',
            password: 'growthitsolution123'
        });
        console.log(`\n5️⃣ [SUPER_ADMIN Login] -> Status: ${superAdminLogin.statusCode} (Expected: 200)`);
        if (superAdminLogin.statusCode !== 200 || !superAdminLogin.body.success) throw new Error('Failed SUPER_ADMIN Login');
        
        const superAdminCookie = extractSessionCookie(superAdminLogin.setCookie);
        console.log(`   ✅ HttpOnly Cookie Received: ${superAdminCookie ? 'YES' : 'NO'}`);
        console.log(`   ✅ User Role: ${superAdminLogin.body.user.role}`);
        console.log(`   ✅ Password Hash Exposed in User Payload? ${superAdminLogin.body.user.password_hash ? 'YES (SECURITY RISK!)' : 'NO (SECURE)'}`);
        if (superAdminLogin.body.user.password_hash) throw new Error('SECURITY VIOLATION: Password hash exposed in login response!');

        // 6. Current User check (/api/auth/me with Cookie)
        const meResult = await makeRequest('/api/auth/me', 'GET', null, superAdminCookie);
        console.log(`\n6️⃣ [Current User /api/auth/me] -> Status: ${meResult.statusCode} (Expected: 200)`);
        if (meResult.statusCode !== 200 || !meResult.body.user) throw new Error('Failed Current User Test');
        console.log(`   ✅ Identified User: ${meResult.body.user.full_name} (${meResult.body.user.email})`);

        // 7. SUPER_ADMIN Access to Protected Admin User List
        const adminUsersList = await makeRequest('/api/admin/users', 'GET', null, superAdminCookie);
        console.log(`\n7️⃣ [SUPER_ADMIN Access GET /api/admin/users] -> Status: ${adminUsersList.statusCode} (Expected: 200)`);
        if (adminUsersList.statusCode !== 200) throw new Error('Failed SUPER_ADMIN User List Access Test');
        console.log(`   ✅ Total System Users Retrieved: ${adminUsersList.body.count}`);

        // 8. Role-Based Login: Login as EDITOR
        const editorLogin = await makeRequest('/api/auth/login', 'POST', {
            email: 'editor@growthit.com',
            password: 'EditorPass2026!'
        });
        console.log(`\n8️⃣ [EDITOR Login] -> Status: ${editorLogin.statusCode} (Expected: 200)`);
        const editorCookie = extractSessionCookie(editorLogin.setCookie);

        // 9. Unauthorized Role Access: EDITOR trying to access GET /api/admin/users (SUPER_ADMIN only)
        const unauthorizedAccess = await makeRequest('/api/admin/users', 'GET', null, editorCookie);
        console.log(`\n9️⃣ [Unauthorized Role Access: EDITOR -> /api/admin/users] -> Status: ${unauthorizedAccess.statusCode} (Expected: 403 Forbidden)`);
        if (unauthorizedAccess.statusCode !== 403) throw new Error('Failed Authorization Enforce Test (Expected 403)');
        console.log(`   ✅ Backend Middleware Enforced Authorization: "${unauthorizedAccess.body.error}"`);

        // 10. EDITOR Authorized Access: POST /api/admin/blogs
        const editorBlog = await makeRequest('/api/admin/blogs', 'POST', {
            title: 'Cloud Native Microservices Architecture 2026'
        }, editorCookie);
        console.log(`\n🔟 [EDITOR Authorized Access POST /api/admin/blogs] -> Status: ${editorBlog.statusCode} (Expected: 201 Created)`);
        if (editorBlog.statusCode !== 201) throw new Error('Failed EDITOR Blog Post Creation');
        console.log(`   ✅ Blog Created: "${editorBlog.body.data.title}"`);

        // 11. Change Password Test for EDITOR
        const changePass = await makeRequest('/api/auth/change-password', 'POST', {
            current_password: 'EditorPass2026!',
            new_password: 'NewEditorPass2026!'
        }, editorCookie);
        console.log(`\n1️⃣1️⃣ [Change Password Test] -> Status: ${changePass.statusCode} (Expected: 200)`);
        if (changePass.statusCode !== 200) throw new Error('Failed Change Password Test');
        console.log(`   ✅ Response: "${changePass.body.message}"`);

        // Verify login with NEW password
        const newLogin = await makeRequest('/api/auth/login', 'POST', {
            email: 'editor@growthit.com',
            password: 'NewEditorPass2026!'
        });
        console.log(`\n1️⃣2️⃣ [Login with NEW Password] -> Status: ${newLogin.statusCode} (Expected: 200)`);
        if (newLogin.statusCode !== 200) throw new Error('Failed Login with New Password');
        console.log(`   ✅ Successfully authenticated with updated bcrypt password hash!`);

        // Revert password back for test repeatability
        const newCookie = extractSessionCookie(newLogin.setCookie);
        await makeRequest('/api/auth/change-password', 'POST', {
            current_password: 'NewEditorPass2026!',
            new_password: 'EditorPass2026!'
        }, newCookie);

        // 13. Logout Test
        const logoutRes = await makeRequest('/api/auth/logout', 'POST', null, superAdminCookie);
        console.log(`\n1️⃣3️⃣ [Logout Test] -> Status: ${logoutRes.statusCode} (Expected: 200)`);
        if (logoutRes.statusCode !== 200) throw new Error('Failed Logout Test');

        // Verify session invalidated after logout
        const postLogoutMe = await makeRequest('/api/auth/me', 'GET', null, superAdminCookie);
        console.log(`\n1️⃣4️⃣ [Post-Logout /api/auth/me Verification] -> Status: ${postLogoutMe.statusCode} (Expected: 401)`);
        if (postLogoutMe.statusCode !== 401) throw new Error('Session still valid after logout!');
        console.log(`   ✅ Session invalidated successfully upon logout.`);

        console.log('\n====================================================');
        console.log('🎉 ALL PHASE 2 AUTHENTICATION & AUTHORIZATION TESTS PASSED PERFECTLY!');
        console.log('====================================================');
        process.exit(0);

    } catch (err) {
        console.error('\n❌ Integration Test Failed:', err.message);
        process.exit(1);
    }
}

// Give server time to respond if running
runAuthTests();
