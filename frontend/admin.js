/**
 * Growth IT Solution - Admin Portal JavaScript Engine
 * Handles Admin Authentication, Cookie Sessions, Tab Navigation, and Authorization Testing
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const globalAlert = document.getElementById('globalAlert');
    const authSection = document.getElementById('authSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const headerUserNav = document.getElementById('headerUserNav');
    const userRoleBadge = document.getElementById('userRoleBadge');
    const userEmailSpan = document.getElementById('userEmailSpan');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginForm = document.getElementById('loginForm');

    let currentUser = null;

    // Helper: Show Alert
    function showAlert(msg, type = 'danger', duration = 5000) {
        globalAlert.className = `alert alert-${type}`;
        globalAlert.innerHTML = `<span>${msg}</span>`;
        globalAlert.classList.remove('hidden');

        if (duration > 0) {
            setTimeout(() => {
                globalAlert.classList.add('hidden');
            }, duration);
        }
    }

    // API Request Wrapper with credentials (Cookie header)
    async function apiRequest(endpoint, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(endpoint, options);
        const result = await response.json();
        return { status: response.status, ok: response.ok, body: result };
    }

    // Check Active Session (/api/auth/me)
    async function checkSession() {
        try {
            const res = await apiRequest('/api/auth/me');
            if (res.ok && res.body.success && res.body.user) {
                currentUser = res.body.user;
                renderDashboard(currentUser);
            } else {
                currentUser = null;
                renderLoginView();
            }
        } catch (err) {
            console.error('Session check error:', err);
            currentUser = null;
            renderLoginView();
        }
    }

    // Render Logged-Out View
    function renderLoginView() {
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        headerUserNav.classList.add('hidden');
    }

    // Render Logged-In Dashboard
    function renderDashboard(user) {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        headerUserNav.classList.remove('hidden');

        userEmailSpan.textContent = user.email;
        userRoleBadge.textContent = user.role;
        userRoleBadge.className = `role-badge role-${user.role}`;

        // Profile Tab Values
        document.getElementById('profileName').textContent = user.full_name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileStatus').textContent = user.status;
        document.getElementById('profileCreated').textContent = new Date(user.created_at).toLocaleString();
        
        const badge = document.getElementById('profileRoleBadge');
        badge.textContent = user.role;
        badge.className = `role-badge role-${user.role}`;

        // Render Permissions
        const permContainer = document.getElementById('profilePermissionsList');
        permContainer.innerHTML = (user.permissions || []).map(p => 
            `<span class="permission-pill">${p}</span>`
        ).join('');

        // Show/Hide Role Panels
        document.getElementById('rolePanelSuperAdmin').classList.toggle('hidden', user.role !== 'SUPER_ADMIN');
        document.getElementById('rolePanelAdmin').classList.toggle('hidden', !['SUPER_ADMIN', 'ADMIN'].includes(user.role));
        document.getElementById('rolePanelEditor').classList.toggle('hidden', !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role));
        document.getElementById('rolePanelContentManager').classList.toggle('hidden', !['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'CONTENT_MANAGER'].includes(user.role));

        // If SUPER_ADMIN, fetch users
        if (user.role === 'SUPER_ADMIN') {
            loadUsersList();
        }

        // Fetch Phone Demo Settings for admin panel
        loadPhoneSettings();
    }

    // Fetch Users List (SUPER_ADMIN)
    async function loadUsersList() {
        const res = await apiRequest('/api/admin/users');
        if (res.ok && res.body.data) {
            const tbody = document.getElementById('userTableBody');
            tbody.innerHTML = res.body.data.map(u => `
                <tr>
                    <td><strong>${u.full_name}</strong></td>
                    <td>${u.email}</td>
                    <td><span class="role-badge role-${u.role}">${u.role}</span></td>
                    <td><span style="color: var(--accent-emerald); font-weight: 600;">${u.status}</span></td>
                </tr>
            `).join('');
        }
    }

    // Handle Login Submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const res = await apiRequest('/api/auth/login', 'POST', { email, password });
            if (res.ok && res.body.success) {
                showAlert(res.body.message || 'Login successful!', 'success');
                loginForm.reset();
                currentUser = res.body.user;
                renderDashboard(currentUser);
            } else {
                showAlert(res.body.error || 'Authentication failed.', 'danger');
            }
        } catch (err) {
            showAlert('Server connection error. Failed to authenticate.', 'danger');
        }
    });

    // Handle Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await apiRequest('/api/auth/logout', 'POST');
            showAlert('You have been logged out.', 'info');
            currentUser = null;
            renderLoginView();
        } catch (err) {
            showAlert('Failed to logout cleanly.', 'danger');
        }
    });

    // Tab Switching Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Handle Create User (SUPER_ADMIN)
    const createUserForm = document.getElementById('createUserForm');
    if (createUserForm) {
        createUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const full_name = document.getElementById('newUserName').value;
            const email = document.getElementById('newUserEmail').value;
            const password = document.getElementById('newUserPassword').value;
            const role = document.getElementById('newUserRole').value;

            const res = await apiRequest('/api/admin/users', 'POST', { full_name, email, password, role });
            if (res.ok && res.body.success) {
                showAlert(res.body.message, 'success');
                createUserForm.reset();
                loadUsersList();
            } else {
                showAlert(res.body.error || 'Failed to create user.', 'danger');
            }
        });
    }

    // Handle Create Service (ADMIN+)
    const createServiceForm = document.getElementById('createServiceForm');
    if (createServiceForm) {
        createServiceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('srvTitle').value;
            const category = document.getElementById('srvCategory').value;

            const res = await apiRequest('/api/admin/services', 'POST', { title, category });
            if (res.ok && res.body.success) {
                showAlert(res.body.message, 'success');
                createServiceForm.reset();
            } else {
                showAlert(res.body.error || 'Operation forbidden.', 'danger');
            }
        });
    }

    // Handle Create Blog (EDITOR+)
    const createBlogForm = document.getElementById('createBlogForm');
    if (createBlogForm) {
        createBlogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('blogTitle').value;

            const res = await apiRequest('/api/admin/blogs', 'POST', { title });
            if (res.ok && res.body.success) {
                showAlert(res.body.message, 'success');
                createBlogForm.reset();
            } else {
                showAlert(res.body.error || 'Operation forbidden.', 'danger');
            }
        });
    }

    // Handle Create Assigned Content (CONTENT_MANAGER+)
    const createContentForm = document.getElementById('createContentForm');
    if (createContentForm) {
        createContentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('cntTitle').value;

            const res = await apiRequest('/api/admin/assigned-content', 'POST', { title });
            if (res.ok && res.body.success) {
                showAlert(res.body.message, 'success');
                createContentForm.reset();
            } else {
                showAlert(res.body.error || 'Operation forbidden.', 'danger');
            }
        });
    }

    // Handle Change Password
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const current_password = document.getElementById('currPassword').value;
            const new_password = document.getElementById('newPassword').value;
            const confirm_password = document.getElementById('confirmNewPassword').value;

            if (new_password !== confirm_password) {
                showAlert('New passwords do not match!', 'danger');
                return;
            }

            const res = await apiRequest('/api/auth/change-password', 'POST', { current_password, new_password });
            if (res.ok && res.body.success) {
                showAlert(res.body.message, 'success');
                changePasswordForm.reset();
            } else {
                showAlert(res.body.error || 'Failed to change password.', 'danger');
            }
        });
    }

    // Fetch and Populate Phone Demo Settings
    async function loadPhoneSettings() {
        const res = await apiRequest('/api/admin/settings');
        if (res.ok && res.body.data) {
            const settings = res.body.data;
            const enabledInput = document.getElementById('phoneDemoEnabledInput');
            const brandInput = document.getElementById('phoneBrandInput');
            const badgeInput = document.getElementById('phoneBadgeInput');
            const growthInput = document.getElementById('phoneGrowthInput');
            const srv1TitleInput = document.getElementById('phoneSrv1TitleInput');
            const srv1StatusInput = document.getElementById('phoneSrv1StatusInput');
            const srv2TitleInput = document.getElementById('phoneSrv2TitleInput');
            const srv2StatusInput = document.getElementById('phoneSrv2StatusInput');

            if (enabledInput) enabledInput.checked = settings.hero_phone_demo_enabled !== false && settings.hero_phone_demo_enabled !== 'false';
            if (brandInput) brandInput.value = settings.hero_phone_brand || 'Growth IT';
            if (badgeInput) badgeInput.value = settings.hero_phone_badge || 'LIVE DEMO';
            if (growthInput) growthInput.value = settings.hero_phone_growth_val || '$24,850.00';
            if (srv1TitleInput) srv1TitleInput.value = settings.hero_phone_service1_title || 'Cloud DevOps';
            if (srv1StatusInput) srv1StatusInput.value = settings.hero_phone_service1_status || '99.99% Uptime';
            if (srv2TitleInput) srv2TitleInput.value = settings.hero_phone_service2_title || 'AI Engine';
            if (srv2StatusInput) srv2StatusInput.value = settings.hero_phone_service2_status || 'Active';
        }
    }

    // Save Phone Demo Settings Form
    const phoneDemoSettingsForm = document.getElementById('phoneDemoSettingsForm');
    if (phoneDemoSettingsForm) {
        phoneDemoSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                hero_phone_demo_enabled: document.getElementById('phoneDemoEnabledInput').checked,
                hero_phone_brand: document.getElementById('phoneBrandInput').value.trim() || 'Growth IT',
                hero_phone_badge: document.getElementById('phoneBadgeInput').value.trim() || 'LIVE DEMO',
                hero_phone_growth_val: document.getElementById('phoneGrowthInput').value.trim() || '$24,850.00',
                hero_phone_service1_title: document.getElementById('phoneSrv1TitleInput').value.trim() || 'Cloud DevOps',
                hero_phone_service1_status: document.getElementById('phoneSrv1StatusInput').value.trim() || '99.99% Uptime',
                hero_phone_service2_title: document.getElementById('phoneSrv2TitleInput').value.trim() || 'AI Engine',
                hero_phone_service2_status: document.getElementById('phoneSrv2StatusInput').value.trim() || 'Active'
            };

            const res = await apiRequest('/api/admin/settings', 'POST', payload);
            if (res.ok && res.body.success) {
                const statusMsg = payload.hero_phone_demo_enabled ? 'Mobile Phone Demo is now ENABLED on website hero!' : 'Mobile Phone Demo is now DISABLED/REMOVED from website hero!';
                showAlert(`Settings Saved Successfully! ${statusMsg}`, 'success');
            } else {
                showAlert(res.body.error || 'Failed to save phone settings.', 'danger');
            }
        });
    }

    // Quick Toggle Button
    const quickTogglePhoneBtn = document.getElementById('quickTogglePhoneBtn');
    if (quickTogglePhoneBtn) {
        quickTogglePhoneBtn.addEventListener('click', async () => {
            const enabledInput = document.getElementById('phoneDemoEnabledInput');
            if (enabledInput) {
                enabledInput.checked = !enabledInput.checked;
                phoneDemoSettingsForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    // Authorization Middleware Tester Buttons
    const logBox = document.getElementById('apiTestResultLog');

    async function runAuthTest(endpoint, method = 'GET', payload = null) {
        logBox.textContent = `Sending ${method} ${endpoint}...`;
        const res = await apiRequest(endpoint, method, payload);
        const statusColor = res.ok ? '🟢 HTTP 200 OK' : (res.status === 403 ? '🔴 HTTP 403 FORBIDDEN' : '🟡 HTTP ' + res.status);
        logBox.textContent = `STATUS: ${statusColor}\nRESPONSE: ${JSON.stringify(res.body, null, 2)}`;
    }

    document.getElementById('testBtnSuperAdmin').addEventListener('click', () => {
        runAuthTest('/api/admin/users', 'GET');
    });

    document.getElementById('testBtnAdmin').addEventListener('click', () => {
        runAuthTest('/api/admin/services', 'POST', { title: 'Security Audit' });
    });

    document.getElementById('testBtnEditor').addEventListener('click', () => {
        runAuthTest('/api/admin/blogs', 'POST', { title: 'Cloud Infrastructure Guide' });
    });

    document.getElementById('testBtnContent').addEventListener('click', () => {
        runAuthTest('/api/admin/assigned-content', 'POST', { title: 'Roadmap Document' });
    });

    // Initialize checkSession
    checkSession();
});
