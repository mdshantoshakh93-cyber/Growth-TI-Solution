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
