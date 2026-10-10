/**
 * Growth IT Solution - Admin Portal & CMS JavaScript Engine
 * Handles Authentication, Tab Navigation, and Full CMS Collection CRUD
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
    const adminModal = document.getElementById('adminModal');
    const adminModalTitle = document.getElementById('adminModalTitle');
    const adminModalBody = document.getElementById('adminModalBody');
    const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');

    let currentUser = null;

    // Helper: Show Alert
    function showAlert(msg, type = 'danger', duration = 5000) {
        if (!globalAlert) return;
        globalAlert.className = `alert alert-${type}`;
        globalAlert.innerHTML = `<span>${msg}</span>`;
        globalAlert.classList.remove('hidden');

        if (duration > 0) {
            setTimeout(() => {
                globalAlert.classList.add('hidden');
            }, duration);
        }
    }

    // Modal Controls
    function openModal(title, contentHtml) {
        if (!adminModal || !adminModalTitle || !adminModalBody) return;
        adminModalTitle.textContent = title;
        adminModalBody.innerHTML = contentHtml;
        adminModal.style.display = 'flex';
    }

    function closeModal() {
        if (adminModal) adminModal.style.display = 'none';
    }

    if (closeAdminModalBtn) closeAdminModalBtn.addEventListener('click', closeModal);
    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) closeModal();
        });
    }

    // API Request Wrapper with Credentials (Cookie Session)
    async function apiRequest(endpoint, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        if (data) options.body = JSON.stringify(data);

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
        const elName = document.getElementById('profileName');
        const elEmail = document.getElementById('profileEmail');
        const elStatus = document.getElementById('profileStatus');

        if (elName) elName.textContent = user.full_name;
        if (elEmail) elEmail.textContent = user.email;
        if (elStatus) elStatus.textContent = user.status;
        
        const badge = document.getElementById('profileRoleBadge');
        if (badge) {
            badge.textContent = user.role;
            badge.className = `role-badge role-${user.role}`;
        }

        // Render Permissions
        const permContainer = document.getElementById('profilePermissionsList');
        if (permContainer) {
            permContainer.innerHTML = (user.permissions || ['full_access']).map(p => 
                `<span class="permission-pill" style="display:inline-block; padding:3px 10px; background:rgba(56,189,248,0.1); color:#38BDF8; border-radius:12px; margin:3px; font-size:0.75rem;">${p}</span>`
            ).join('');
        }

        // Load Initial Tab Data
        loadDashboardStats();
        loadNavigationData();
        loadProjectsData();
        loadServicesData();
        loadPricingData();
        loadDemosData();
        loadTeamData();
        loadBlogsData();
        loadMessagesData();
        loadSettingsData();

        if (user.role === 'SUPER_ADMIN') {
            loadUsersList();
        }
    }

    // Tab Switching System
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.remove('hidden');
        });
    });

    // ----------------------------------------------------
    // 1. DASHBOARD STATS
    // ----------------------------------------------------
    async function loadDashboardStats() {
        const res = await apiRequest('/api/stats');
        if (res.ok && res.body.data) {
            const d = res.body.data;
            const elProj = document.getElementById('dashStatProjects');
            const elSrv = document.getElementById('dashStatServices');
            const elMsg = document.getElementById('dashStatMessages');
            const elBlog = document.getElementById('dashStatBlogs');

            if (elProj) elProj.textContent = d.completed_projects || d.total_projects || 0;
            if (elSrv) elSrv.textContent = d.total_services || 0;
            if (elMsg) elMsg.textContent = d.unread_messages || d.total_messages || 0;
            if (elBlog) elBlog.textContent = d.total_blogs || 0;
        }
    }

    // ----------------------------------------------------
    // 2. DYNAMIC NAVBAR MANAGER
    // ----------------------------------------------------
    async function loadNavigationData() {
        const tbody = document.getElementById('navTableBody');
        if (!tbody) return;
        const res = await apiRequest('/api/admin/navigation');
        if (res.ok && res.body.data) {
            const items = res.body.data.sort((a,b) => (a.order || 0) - (b.order || 0));
            tbody.innerHTML = items.map(item => `
                <tr>
                    <td><strong>${item.order || 0}</strong></td>
                    <td><strong style="color:#F8FAFC;">${item.label}</strong></td>
                    <td><code style="color:#38BDF8;">${item.url}</code></td>
                    <td>${item.open_new_tab ? 'Yes ↗' : 'No'}</td>
                    <td>
                        <span style="color:${item.visible !== false ? '#10B981' : '#F43F5E'}; font-weight:600;">
                            ${item.visible !== false ? 'Visible' : 'Hidden'}
                        </span>
                    </td>
                    <td>
                        <div style="display:flex; gap:6px;">
                            <button class="btn btn-secondary edit-nav-btn" data-id="${item.id}" style="padding:4px 8px; font-size:0.75rem;">Edit</button>
                            <button class="btn btn-danger delete-nav-btn" data-id="${item.id}" style="padding:4px 8px; font-size:0.75rem;">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');

            // Edit Event Listeners
            tbody.querySelectorAll('.edit-nav-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const item = items.find(i => i.id === id);
                    if (item) openNavEditModal(item);
                });
            });

            // Delete Event Listeners
            tbody.querySelectorAll('.delete-nav-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this navigation link?')) {
                        const id = btn.getAttribute('data-id');
                        await apiRequest(`/api/admin/navigation/${id}`, 'DELETE');
                        showAlert('Navigation item deleted successfully', 'success');
                        loadNavigationData();
                    }
                });
            });
        }
    }

    const addNavBtn = document.getElementById('addNavModalBtn');
    if (addNavBtn) {
        addNavBtn.addEventListener('click', () => openNavEditModal());
    }

    function openNavEditModal(item = null) {
        const isEdit = !!item;
        const html = `
            <form id="navItemForm">
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Menu Label</label>
                    <input type="text" id="navLabelInput" class="form-input" value="${item ? item.label : ''}" placeholder="e.g. Services" required>
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Target URL / Hash</label>
                    <input type="text" id="navUrlInput" class="form-input" value="${item ? item.url : ''}" placeholder="e.g. #services or /about" required>
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Display Order Index</label>
                    <input type="number" id="navOrderInput" class="form-input" value="${item ? (item.order || 1) : 1}" required>
                </div>
                <div class="form-group" style="margin-bottom:12px; display:flex; gap:16px;">
                    <label style="display:flex; align-items:center; gap:6px; color:#F8FAFC; cursor:pointer;">
                        <input type="checkbox" id="navVisibleInput" ${!item || item.visible !== false ? 'checked' : ''}> Visible on Header
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; color:#F8FAFC; cursor:pointer;">
                        <input type="checkbox" id="navNewTabInput" ${item && item.open_new_tab ? 'checked' : ''}> Open in New Tab
                    </label>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; margin-top:16px;">${isEdit ? 'Save Changes' : 'Create Menu Item'}</button>
            </form>
        `;
        openModal(isEdit ? 'Edit Navigation Link' : 'Add New Navigation Link', html);

        document.getElementById('navItemForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                label: document.getElementById('navLabelInput').value,
                url: document.getElementById('navUrlInput').value,
                order: parseInt(document.getElementById('navOrderInput').value) || 1,
                visible: document.getElementById('navVisibleInput').checked,
                open_new_tab: document.getElementById('navNewTabInput').checked
            };

            const endpoint = isEdit ? `/api/admin/navigation/${item.id}` : '/api/admin/navigation';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await apiRequest(endpoint, method, payload);
            if (res.ok) {
                showAlert(isEdit ? 'Navigation link updated!' : 'Navigation link created!', 'success');
                closeModal();
                loadNavigationData();
            } else {
                showAlert(res.body.error || 'Failed to save navigation link', 'danger');
            }
        });
    }

    // ----------------------------------------------------
    // 3. PROJECTS MANAGER
    // ----------------------------------------------------
    async function loadProjectsData() {
        const tbody = document.getElementById('projectTableBody');
        if (!tbody) return;
        const res = await apiRequest('/api/admin/projects');
        if (res.ok && res.body.data) {
            const items = res.body.data;
            tbody.innerHTML = items.map(p => `
                <tr>
                    <td><strong style="color:#F8FAFC;">${p.title}</strong></td>
                    <td>${p.client_name || 'N/A'} <span style="font-size:0.75rem; color:#94A3B8;">(${p.industry || 'Tech'})</span></td>
                    <td><span style="color:#10B981; font-weight:600;">${p.status || 'published'}</span></td>
                    <td>
                        <div style="display:flex; gap:6px;">
                            <button class="btn btn-secondary edit-proj-btn" data-id="${p.id}" style="padding:4px 8px; font-size:0.75rem;">Edit</button>
                            <button class="btn btn-danger delete-proj-btn" data-id="${p.id}" style="padding:4px 8px; font-size:0.75rem;">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');

            tbody.querySelectorAll('.edit-proj-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = items.find(i => i.id === btn.getAttribute('data-id'));
                    if (item) openProjectEditModal(item);
                });
            });

            tbody.querySelectorAll('.delete-proj-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Delete this project?')) {
                        await apiRequest(`/api/admin/projects/${btn.getAttribute('data-id')}`, 'DELETE');
                        showAlert('Project deleted', 'success');
                        loadProjectsData();
                    }
                });
            });
        }
    }

    const addProjBtn = document.getElementById('addProjectModalBtn');
    if (addProjBtn) addProjBtn.addEventListener('click', () => openProjectEditModal());

    function openProjectEditModal(item = null) {
        const isEdit = !!item;
        const html = `
            <form id="projForm">
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Project Title</label>
                    <input type="text" id="pTitle" class="form-input" value="${item ? item.title : ''}" required>
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Client Name</label>
                    <input type="text" id="pClient" class="form-input" value="${item ? item.client_name || '' : ''}">
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Industry</label>
                    <input type="text" id="pIndustry" class="form-input" value="${item ? item.industry || '' : ''}" placeholder="FinTech / HealthTech">
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Challenge / Problem</label>
                    <textarea id="pChallenge" class="form-input">${item ? item.challenge || '' : ''}</textarea>
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Solution / Impact</label>
                    <textarea id="pSolution" class="form-input">${item ? item.solution || '' : ''}</textarea>
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Image Path / URL</label>
                    <input type="text" id="pImage" class="form-input" value="${item ? item.image_url || 'assets/hero_graphic.jpg' : 'assets/hero_graphic.jpg'}">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; margin-top:16px;">${isEdit ? 'Save Project' : 'Create Project'}</button>
            </form>
        `;
        openModal(isEdit ? 'Edit Project' : 'Add New Project', html);

        document.getElementById('projForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                title: document.getElementById('pTitle').value,
                client_name: document.getElementById('pClient').value,
                industry: document.getElementById('pIndustry').value,
                challenge: document.getElementById('pChallenge').value,
                solution: document.getElementById('pSolution').value,
                image_url: document.getElementById('pImage').value,
                status: 'published'
            };

            const endpoint = isEdit ? `/api/admin/projects/${item.id}` : '/api/admin/projects';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await apiRequest(endpoint, method, payload);
            if (res.ok) {
                showAlert(isEdit ? 'Project updated!' : 'Project created!', 'success');
                closeModal();
                loadProjectsData();
            }
        });
    }

    // ----------------------------------------------------
    // 4. SERVICES MANAGER
    // ----------------------------------------------------
    async function loadServicesData() {
        const tbody = document.getElementById('serviceTableBody');
        if (!tbody) return;
        const res = await apiRequest('/api/admin/services');
        if (res.ok && res.body.data) {
            const items = res.body.data;
            tbody.innerHTML = items.map(s => `
                <tr>
                    <td><strong style="color:#F8FAFC;">${s.icon || '⚡'} ${s.title || s.name}</strong></td>
                    <td>${s.category || 'Engineering'}</td>
                    <td>${(s.features || []).length} features</td>
                    <td>
                        <div style="display:flex; gap:6px;">
                            <button class="btn btn-secondary edit-srv-btn" data-id="${s.id}" style="padding:4px 8px; font-size:0.75rem;">Edit</button>
                            <button class="btn btn-danger delete-srv-btn" data-id="${s.id}" style="padding:4px 8px; font-size:0.75rem;">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');

            tbody.querySelectorAll('.edit-srv-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = items.find(i => i.id === btn.getAttribute('data-id'));
                    if (item) openServiceEditModal(item);
                });
            });

            tbody.querySelectorAll('.delete-srv-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Delete service?')) {
                        await apiRequest(`/api/admin/services/${btn.getAttribute('data-id')}`, 'DELETE');
                        showAlert('Service deleted', 'success');
                        loadServicesData();
                    }
                });
            });
        }
    }

    const addSrvBtn = document.getElementById('addServiceModalBtn');
    if (addSrvBtn) addSrvBtn.addEventListener('click', () => openServiceEditModal());

    function openServiceEditModal(item = null) {
        const isEdit = !!item;
        const html = `
            <form id="srvForm">
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Service Title</label>
                    <input type="text" id="sTitle" class="form-input" value="${item ? item.title || item.name : ''}" required>
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Category</label>
                    <input type="text" id="sCategory" class="form-input" value="${item ? item.category || '' : ''}" placeholder="Cloud / AI / Software">
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Icon (Emoji or Icon Name)</label>
                    <input type="text" id="sIcon" class="form-input" value="${item ? item.icon || '⚡' : '⚡'}">
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Description / Tagline</label>
                    <textarea id="sDesc" class="form-input" required>${item ? item.description || item.tagline || '' : ''}</textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; margin-top:16px;">${isEdit ? 'Save Service' : 'Create Service'}</button>
            </form>
        `;
        openModal(isEdit ? 'Edit Service' : 'Add New Service', html);

        document.getElementById('srvForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                title: document.getElementById('sTitle').value,
                name: document.getElementById('sTitle').value,
                category: document.getElementById('sCategory').value,
                icon: document.getElementById('sIcon').value,
                description: document.getElementById('sDesc').value,
                tagline: document.getElementById('sDesc').value,
                features: item ? item.features || [] : ['High Scalability', 'Enterprise Security']
            };

            const endpoint = isEdit ? `/api/admin/services/${item.id}` : '/api/admin/services';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await apiRequest(endpoint, method, payload);
            if (res.ok) {
                showAlert(isEdit ? 'Service updated!' : 'Service created!', 'success');
                closeModal();
                loadServicesData();
            }
        });
    }

    // ----------------------------------------------------
    // 5. PRICING PLANS MANAGER (Website, Software, Mobile App)
    // ----------------------------------------------------
    async function loadPricingData() {
        const tbody = document.getElementById('pricingTableBody');
        if (!tbody) return;
        const res = await apiRequest('/api/admin/pricing');
        if (res.ok && res.body.data) {
            const items = res.body.data;
            tbody.innerHTML = items.map(p => `
                <tr>
                    <td><strong style="color:#F8FAFC;">${p.icon || '💎'} ${p.tier_name}</strong></td>
                    <td><span style="color:#38BDF8; font-weight:600;">${p.category || 'Package'}</span></td>
                    <td><strong style="color:#10B981;">${p.price_bdt || ''} / $${p.price_usd || ''}</strong></td>
                    <td>${p.billing_cycle || 'Per Project'}</td>
                    <td>${p.highlighted ? '🔥 Highlighted' : 'Normal'}</td>
                    <td>
                        <div style="display:flex; gap:6px;">
                            <button class="btn btn-secondary edit-prc-btn" data-id="${p.id}" style="padding:4px 8px; font-size:0.75rem;">Edit</button>
                            <button class="btn btn-danger delete-prc-btn" data-id="${p.id}" style="padding:4px 8px; font-size:0.75rem;">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');

            tbody.querySelectorAll('.edit-prc-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = items.find(i => i.id === btn.getAttribute('data-id'));
                    if (item) openPricingEditModal(item);
                });
            });

            tbody.querySelectorAll('.delete-prc-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Delete pricing plan?')) {
                        await apiRequest(`/api/admin/pricing/${btn.getAttribute('data-id')}`, 'DELETE');
                        showAlert('Pricing plan deleted', 'success');
                        loadPricingData();
                    }
                });
            });
        }
    }

    const addPrcBtn = document.getElementById('addPricingModalBtn');
    if (addPrcBtn) addPrcBtn.addEventListener('click', () => openPricingEditModal());

    function openPricingEditModal(item = null) {
        const isEdit = !!item;
        const html = `
            <form id="prcForm">
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Tier / Package Name</label>
                    <input type="text" id="prTierName" class="form-input" value="${item ? item.tier_name : ''}" placeholder="e.g. Website Development" required>
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Category</label>
                    <select id="prCategory" class="form-select">
                        <option value="Website" ${item && item.category === 'Website' ? 'selected' : ''}>Website Development</option>
                        <option value="Software" ${item && item.category === 'Software' ? 'selected' : ''}>Software Development</option>
                        <option value="Mobile App" ${item && item.category === 'Mobile App' ? 'selected' : ''}>Mobile App Development</option>
                        <option value="Custom" ${item && item.category === 'Custom' ? 'selected' : ''}>Custom Enterprise Package</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Price in BDT (৳)</label>
                    <input type="text" id="prPriceBdt" class="form-input" value="${item ? item.price_bdt || '' : ''}" placeholder="e.g. ৳25,000">
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Price in USD ($)</label>
                    <input type="number" id="prPriceUsd" class="form-input" value="${item ? item.price_usd || 299 : 299}">
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Billing Cycle / Scope</label>
                    <input type="text" id="prBilling" class="form-input" value="${item ? item.billing_cycle || '' : ''}" placeholder="Starting From / Project">
                </div>
                <div class="form-group" style="margin-bottom:12px;">
                    <label class="form-label">Package Description</label>
                    <textarea id="prDesc" class="form-input">${item ? item.description || '' : ''}</textarea>
                </div>
                <div class="form-group" style="margin-bottom:12px; display:flex; gap:16px;">
                    <label style="display:flex; align-items:center; gap:6px; color:#F8FAFC; cursor:pointer;">
                        <input type="checkbox" id="prHighlight" ${item && item.highlighted ? 'checked' : ''}> 🔥 Highlighted Featured Plan
                    </label>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; margin-top:16px;">${isEdit ? 'Save Pricing Plan' : 'Create Pricing Plan'}</button>
            </form>
        `;
        openModal(isEdit ? 'Edit Pricing Plan' : 'Add New Pricing Plan', html);

        document.getElementById('prcForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                tier_name: document.getElementById('prTierName').value,
                category: document.getElementById('prCategory').value,
                price_bdt: document.getElementById('prPriceBdt').value,
                price_usd: parseInt(document.getElementById('prPriceUsd').value) || 299,
                billing_cycle: document.getElementById('prBilling').value,
                description: document.getElementById('prDesc').value,
                highlighted: document.getElementById('prHighlight').checked,
                features: item ? item.features || [] : ['Custom Design', '1-Year Support', 'SEO Optimized'],
                status: 'published'
            };

            const endpoint = isEdit ? `/api/admin/pricing/${item.id}` : '/api/admin/pricing';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await apiRequest(endpoint, method, payload);
            if (res.ok) {
                showAlert(isEdit ? 'Pricing plan updated!' : 'Pricing plan created!', 'success');
                closeModal();
                loadPricingData();
            }
        });
    }

    // ----------------------------------------------------
    // 6. WEBSITE DEMOS MANAGER
    // ----------------------------------------------------
    async function loadDemosData() {
        const tbody = document.getElementById('demoTableBody');
        if (!tbody) return;
        const res = await apiRequest('/api/admin/website-demos');
        if (res.ok && res.body.data) {
            const items = res.body.data;
            tbody.innerHTML = items.map(d => `
                <tr>
                    <td><strong style="color:#F8FAFC;">${d.title}</strong></td>
                    <td><span style="color:#38BDF8;">${d.category || 'Demo'}</span></td>
                    <td><a href="${d.preview_url}" target="_blank" style="color:#10B981;">${d.preview_url}</a></td>
                    <td>
                        <div style="display:flex; gap:6px;">
                            <button class="btn btn-danger delete-demo-btn" data-id="${d.id}" style="padding:4px 8px; font-size:0.75rem;">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');

            tbody.querySelectorAll('.delete-demo-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Delete demo?')) {
                        await apiRequest(`/api/admin/website-demos/${btn.getAttribute('data-id')}`, 'DELETE');
                        showAlert('Demo deleted', 'success');
                        loadDemosData();
                    }
                });
            });
        }
    }

    const addDemoBtn = document.getElementById('addDemoModalBtn');
    if (addDemoBtn) {
        addDemoBtn.addEventListener('click', () => {
            const html = `
                <form id="demoForm">
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Demo Title</label>
                        <input type="text" id="dTitle" class="form-input" required>
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Category</label>
                        <input type="text" id="dCategory" class="form-input" placeholder="E-Commerce / SaaS / Healthcare" required>
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Preview URL</label>
                        <input type="text" id="dUrl" class="form-input" placeholder="https://..." required>
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Description</label>
                        <textarea id="dDesc" class="form-input"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%; margin-top:16px;">Create Website Demo</button>
                </form>
            `;
            openModal('Add Website Demo', html);
            document.getElementById('demoForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const payload = {
                    title: document.getElementById('dTitle').value,
                    category: document.getElementById('dCategory').value,
                    preview_url: document.getElementById('dUrl').value,
                    description: document.getElementById('dDesc').value,
                    image_url: 'assets/hero_graphic.jpg'
                };
                await apiRequest('/api/admin/website-demos', 'POST', payload);
                showAlert('Demo added!', 'success');
                closeModal();
                loadDemosData();
            });
        });
    }

    // ----------------------------------------------------
    // 7. TEAM MANAGER
    // ----------------------------------------------------
    async function loadTeamData() {
        const tbody = document.getElementById('teamTableBody');
        if (!tbody) return;
        const res = await apiRequest('/api/admin/team');
        if (res.ok && res.body.data) {
            const items = res.body.data;
            tbody.innerHTML = items.map(t => `
                <tr>
                    <td><strong style="color:#F8FAFC;">${t.name}</strong></td>
                    <td><span style="color:#38BDF8;">${t.role}</span></td>
                    <td>${(t.bio || '').substring(0, 60)}...</td>
                    <td>
                        <button class="btn btn-danger delete-team-btn" data-id="${t.id}" style="padding:4px 8px; font-size:0.75rem;">Delete</button>
                    </td>
                </tr>
            `).join('');

            tbody.querySelectorAll('.delete-team-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Delete team member?')) {
                        await apiRequest(`/api/admin/team/${btn.getAttribute('data-id')}`, 'DELETE');
                        showAlert('Team member removed', 'success');
                        loadTeamData();
                    }
                });
            });
        }
    }

    const addTeamBtn = document.getElementById('addTeamModalBtn');
    if (addTeamBtn) {
        addTeamBtn.addEventListener('click', () => {
            const html = `
                <form id="teamForm">
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="tName" class="form-input" required>
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Role / Position</label>
                        <input type="text" id="tRole" class="form-input" required>
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Biography</label>
                        <textarea id="tBio" class="form-input"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%; margin-top:16px;">Add Team Member</button>
                </form>
            `;
            openModal('Add Team Member', html);
            document.getElementById('teamForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const payload = {
                    name: document.getElementById('tName').value,
                    role: document.getElementById('tRole').value,
                    bio: document.getElementById('tBio').value,
                    photo_url: 'assets/hero_graphic.jpg'
                };
                await apiRequest('/api/admin/team', 'POST', payload);
                showAlert('Team member added!', 'success');
                closeModal();
                loadTeamData();
            });
        });
    }

    // ----------------------------------------------------
    // 8. BLOG MANAGER
    // ----------------------------------------------------
    async function loadBlogsData() {
        const tbody = document.getElementById('blogTableBody');
        if (!tbody) return;
        const res = await apiRequest('/api/admin/blogs');
        if (res.ok && res.body.data) {
            const items = res.body.data;
            tbody.innerHTML = items.map(b => `
                <tr>
                    <td><strong style="color:#F8FAFC;">${b.title}</strong></td>
                    <td><span style="color:#38BDF8;">${b.category || 'Tech'}</span></td>
                    <td>${b.author || 'Team'}</td>
                    <td>${b.read_time || '5 min'}</td>
                    <td><span style="color:#10B981;">Published</span></td>
                    <td>
                        <button class="btn btn-danger delete-blog-btn" data-id="${b.id}" style="padding:4px 8px; font-size:0.75rem;">Delete</button>
                    </td>
                </tr>
            `).join('');

            tbody.querySelectorAll('.delete-blog-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Delete blog article?')) {
                        await apiRequest(`/api/admin/blogs/${btn.getAttribute('data-id')}`, 'DELETE');
                        showAlert('Article deleted', 'success');
                        loadBlogsData();
                    }
                });
            });
        }
    }

    const addBlogBtn = document.getElementById('addBlogModalBtn');
    if (addBlogBtn) {
        addBlogBtn.addEventListener('click', () => {
            const html = `
                <form id="blogForm">
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Article Title</label>
                        <input type="text" id="bTitle" class="form-input" required>
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Category</label>
                        <input type="text" id="bCategory" class="form-input" placeholder="Cloud / AI / Cybersecurity">
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label class="form-label">Content</label>
                        <textarea id="bContent" class="form-input" style="min-height:120px;" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%; margin-top:16px;">Publish Article</button>
                </form>
            `;
            openModal('Create New Blog Article', html);
            document.getElementById('blogForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const payload = {
                    title: document.getElementById('bTitle').value,
                    category: document.getElementById('bCategory').value,
                    content: document.getElementById('bContent').value,
                    author: currentUser ? currentUser.full_name : 'Growth IT Team',
                    read_time: '5 min read',
                    status: 'published'
                };
                await apiRequest('/api/admin/blogs', 'POST', payload);
                showAlert('Blog article published!', 'success');
                closeModal();
                loadBlogsData();
            });
        });
    }

    // ----------------------------------------------------
    // 9. CONTACT MESSAGES INBOX
    // ----------------------------------------------------
    async function loadMessagesData() {
        const tbody = document.getElementById('messageTableBody');
        if (!tbody) return;
        const res = await apiRequest('/api/admin/messages');
        if (res.ok && res.body.data) {
            const items = res.body.data;
            tbody.innerHTML = items.map(m => `
                <tr>
                    <td>${new Date(m.created_at || Date.now()).toLocaleDateString()}</td>
                    <td><strong style="color:#F8FAFC;">${m.name}</strong></td>
                    <td>${m.email}</td>
                    <td><span style="color:#38BDF8;">${m.subject || 'Inquiry'}</span></td>
                    <td><span style="color:${m.status === 'unread' ? '#F59E0B' : '#10B981'}; font-weight:600;">${m.status || 'read'}</span></td>
                    <td>
                        <button class="btn btn-secondary view-msg-btn" data-id="${m.id}" style="padding:4px 8px; font-size:0.75rem;">View Message</button>
                    </td>
                </tr>
            `).join('');

            tbody.querySelectorAll('.view-msg-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const msg = items.find(m => m.id === btn.getAttribute('data-id'));
                    if (msg) {
                        openModal(`Inquiry from ${msg.name}`, `
                            <p><strong>Date:</strong> ${new Date(msg.created_at || Date.now()).toLocaleString()}</p>
                            <p><strong>Email:</strong> ${msg.email}</p>
                            <p><strong>Subject:</strong> ${msg.subject || 'Inquiry'}</p>
                            <div style="margin-top:16px; padding:16px; background:rgba(255,255,255,0.03); border-radius:8px; color:#F8FAFC; line-height:1.6;">
                                ${msg.message}
                            </div>
                        `);
                    }
                });
            });
        }
    }

    // ----------------------------------------------------
    // 10. GLOBAL SITE SETTINGS
    // ----------------------------------------------------
    async function loadSettingsData() {
        const res = await apiRequest('/api/admin/settings');
        if (res.ok && res.body.data) {
            const s = res.body.data;
            if (document.getElementById('setCompanyName')) document.getElementById('setCompanyName').value = s.company_name || '';
            if (document.getElementById('setSupportEmail')) document.getElementById('setSupportEmail').value = s.support_email || '';
            if (document.getElementById('setContactPhone')) document.getElementById('setContactPhone').value = s.contact_phone || '';
            if (document.getElementById('setOfficeAddress')) document.getElementById('setOfficeAddress').value = s.office_address || '';
            if (document.getElementById('setBusinessHours')) document.getElementById('setBusinessHours').value = s.business_hours || '';
            if (document.getElementById('setLogoPath')) document.getElementById('setLogoPath').value = s.logo || '';

            if (document.getElementById('setHeroBadge')) document.getElementById('setHeroBadge').value = s.hero_badge || '';
            if (document.getElementById('setHeroHeading')) document.getElementById('setHeroHeading').value = s.hero_heading || '';
            if (document.getElementById('setHeroDescription')) document.getElementById('setHeroDescription').value = s.hero_description || '';
            if (document.getElementById('setHeroVideo')) document.getElementById('setHeroVideo').value = s.hero_video || '';

            if (document.getElementById('setPhoneDemoEnabled')) document.getElementById('setPhoneDemoEnabled').checked = s.hero_phone_demo_enabled !== false;
            if (document.getElementById('setPhoneBrand')) document.getElementById('setPhoneBrand').value = s.hero_phone_brand || 'Growth IT';
            if (document.getElementById('setPhoneGrowth')) document.getElementById('setPhoneGrowth').value = s.hero_phone_growth_val || '$24,850.00';
        }
    }

    const settingsForm = document.getElementById('globalSettingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                company_name: document.getElementById('setCompanyName').value,
                support_email: document.getElementById('setSupportEmail').value,
                contact_phone: document.getElementById('setContactPhone').value,
                office_address: document.getElementById('setOfficeAddress').value,
                business_hours: document.getElementById('setBusinessHours').value,
                logo: document.getElementById('setLogoPath').value,

                hero_badge: document.getElementById('setHeroBadge').value,
                hero_heading: document.getElementById('setHeroHeading').value,
                hero_description: document.getElementById('setHeroDescription').value,
                hero_video: document.getElementById('setHeroVideo').value,

                hero_phone_demo_enabled: document.getElementById('setPhoneDemoEnabled').checked,
                hero_phone_brand: document.getElementById('setPhoneBrand').value,
                hero_phone_growth_val: document.getElementById('setPhoneGrowth').value
            };

            const res = await apiRequest('/api/admin/settings', 'POST', payload);
            if (res.ok) {
                showAlert('Global site settings saved successfully!', 'success');
            } else {
                showAlert('Failed to save site settings', 'danger');
            }
        });
    }

    // ----------------------------------------------------
    // 11. USERS LIST & LOGIN HANDLER
    // ----------------------------------------------------
    async function loadUsersList() {
        const tbody = document.getElementById('userTableBody');
        if (!tbody) return;
        const res = await apiRequest('/api/admin/users');
        if (res.ok && res.body.data) {
            tbody.innerHTML = res.body.data.map(u => `
                <tr>
                    <td><strong>${u.full_name}</strong></td>
                    <td>${u.email}</td>
                    <td><span class="role-badge role-${u.role}">${u.role}</span></td>
                    <td><span style="color: #10B981; font-weight: 600;">${u.status}</span></td>
                </tr>
            `).join('');
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const res = await apiRequest('/api/auth/login', 'POST', { email, password });
            if (res.ok && res.body.success) {
                showAlert('Login successful!', 'success');
                loginForm.reset();
                currentUser = res.body.user;
                renderDashboard(currentUser);
            } else {
                showAlert(res.body.error || 'Authentication failed.', 'danger');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await apiRequest('/api/auth/logout', 'POST');
            currentUser = null;
            renderLoginView();
            showAlert('Logged out successfully', 'info');
        });
    }

    // Check session on startup
    checkSession();
});
