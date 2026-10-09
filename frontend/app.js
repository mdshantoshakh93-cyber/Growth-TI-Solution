/**
 * Growth IT Solution Frontend Application Engine
 * Pure ES6 JavaScript - High performance & real-time API integrations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Determine API Base URL (works both locally and when served via server.js)
    const API_BASE = window.location.origin.includes('5000') ? '/api' : 'http://127.0.0.1:5000/api';

    // --- INITIALIZATION ---
    checkApiHealth();
    fetchSiteSettings();
    fetchStats();
    fetchPortfolio('All');
    fetchServices();
    fetchWebsiteDemos('All');
    fetchTeam();
    fetchBlogs();
    setupEventListeners();
    setupScrollRevealAnimation();

    // --- SCROLL REVEAL ANIMATIONS ---
    function setupScrollRevealAnimation() {
        const revealElements = document.querySelectorAll('.stat-card, .service-card, .portfolio-card, .section-title, .hero-title, .hero-subtitle');
        revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.08 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- API HEALTH CHECK ---
    async function checkApiHealth() {
        const pillText = document.getElementById('apiStatusText');
        const pill = document.getElementById('apiStatusPill');
        if (!pillText || !pill) return;
        try {
            const res = await fetch(`${API_BASE}/health`);
            const data = await res.json();
            if (data.status === 'online') {
                pillText.textContent = 'API Connected';
                pill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            }
        } catch (err) {
            console.warn('[API Offline] Running in client fallback mode');
            if (pillText) pillText.textContent = 'API Offline (Demo Mode)';
            if (pill) pill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            const dot = document.querySelector('.status-dot');
            if (dot) dot.style.backgroundColor = '#EF4444';
        }
    }

    // --- STEP 1: HOME (FETCH SITE SETTINGS & PHONE DEMO CONTROL) ---
    async function fetchSiteSettings() {
        try {
            const res = await fetch(`${API_BASE}/public/site-settings`);
            const data = await res.json();
            if (data.success && data.data) {
                const settings = data.data;
                const heroDevice = document.getElementById('heroDeviceRight');
                
                // Toggle Phone Demo Visibility
                const isEnabled = settings.hero_phone_demo_enabled !== false && settings.hero_phone_demo_enabled !== 'false';
                if (heroDevice) {
                    if (isEnabled) {
                        heroDevice.style.display = 'flex';
                    } else {
                        heroDevice.style.display = 'none';
                    }
                }

                // Update Phone Showcase Text Fields
                const phoneBrandText = document.getElementById('phoneBrandText');
                const phoneBadgeText = document.getElementById('phoneBadgeText');
                const phoneCardValue = document.getElementById('phoneCardValue');
                const phoneSrv1Title = document.getElementById('phoneSrv1Title');
                const phoneSrv1Status = document.getElementById('phoneSrv1Status');
                const phoneSrv2Title = document.getElementById('phoneSrv2Title');
                const phoneSrv2Status = document.getElementById('phoneSrv2Status');

                if (phoneBrandText && settings.hero_phone_brand) phoneBrandText.textContent = settings.hero_phone_brand;
                if (phoneBadgeText && settings.hero_phone_badge) phoneBadgeText.textContent = settings.hero_phone_badge;
                if (phoneCardValue && settings.hero_phone_growth_val) phoneCardValue.textContent = settings.hero_phone_growth_val;
                if (phoneSrv1Title && settings.hero_phone_service1_title) phoneSrv1Title.textContent = settings.hero_phone_service1_title;
                if (phoneSrv1Status && settings.hero_phone_service1_status) phoneSrv1Status.textContent = settings.hero_phone_service1_status;
                if (phoneSrv2Title && settings.hero_phone_service2_title) phoneSrv2Title.textContent = settings.hero_phone_service2_title;
                if (phoneSrv2Status && settings.hero_phone_service2_status) phoneSrv2Status.textContent = settings.hero_phone_service2_status;
            }
        } catch (err) {
            console.warn('[Settings fetch error]', err);
        }
    }

    // --- STEP 1: HOME (FETCH STATS) ---
    async function fetchStats() {
        try {
            const res = await fetch(`${API_BASE}/stats`);
            const data = await res.json();
            if (data.success && data.data) {
                const pCount = data.data.completed_projects || data.data.total_projects || data.data.published_projects;
                const cCount = data.data.active_clients || data.data.total_services || 48;
                
                const elProj = document.getElementById('statProjects');
                const elUptime = document.getElementById('statUptime');
                const elClients = document.getElementById('statClients');
                const elAwards = document.getElementById('statAwards');

                if (elProj && pCount !== undefined) elProj.textContent = `${pCount}+`;
                if (elUptime && data.data.sla_uptime) elUptime.textContent = data.data.sla_uptime;
                if (elClients && cCount !== undefined) elClients.textContent = `${cCount}+`;
                if (elAwards && data.data.global_awards !== undefined) elAwards.textContent = `${data.data.global_awards}`;
            }
        } catch (err) {
            // Keep clean default values from index.html if server offline
        }
    }

    // --- STEP 2: PROJECT (FETCH PORTFOLIO / CASE STUDIES) ---
    async function fetchPortfolio(category = 'All') {
        const grid = document.getElementById('portfolioGrid');
        if (!grid) return;
        try {
            const url = category === 'All' ? `${API_BASE}/portfolio` : `${API_BASE}/portfolio?category=${encodeURIComponent(category)}`;
            const res = await fetch(url);
            const json = await res.json();
            if (json.success && json.data) {
                renderPortfolio(json.data);
            }
        } catch (err) {
            renderPortfolio([
                {
                    title: 'FinTech Core Banking Cloud Migration',
                    client_name: 'Apex Financial Inc.',
                    industry: 'FinTech',
                    challenge: 'Legacy monolithic mainframe system suffered high downtime during market peaks.',
                    solution: 'Migrated core transaction services to AWS EKS microservices with global tables.',
                    tech_stack: ['AWS', 'Kubernetes', 'Node.js', 'DynamoDB'],
                    image_url: 'assets/hero_graphic.jpg'
                },
                {
                    title: 'AI-Powered HealthTech Diagnostic Portal',
                    client_name: 'MedPulse Innovations',
                    industry: 'Healthcare',
                    challenge: 'Radiology teams struggled with high patient volume and delayed diagnostic turnarounds.',
                    solution: 'Engineered an AI computer vision pipeline trained on DICOM images with 98.4% accuracy.',
                    tech_stack: ['Python', 'PyTorch', 'React', 'FastAPI'],
                    image_url: 'assets/hero_graphic.jpg'
                },
                {
                    title: 'Global E-Commerce Omnichannel Platform',
                    client_name: 'Nova Retail Group',
                    industry: 'E-Commerce',
                    challenge: 'Legacy web platform crashed during Cyber Monday flash sales due to database locks.',
                    solution: 'Re-architected to headless commerce with Next.js edge caching and Redis microservices.',
                    tech_stack: ['Next.js', 'GraphQL', 'Redis', 'PostgreSQL'],
                    image_url: 'assets/hero_graphic.jpg'
                }
            ]);
        }
    }

    function renderPortfolio(items) {
        const grid = document.getElementById('portfolioGrid');
        if (!grid) return;
        grid.innerHTML = items.map(p => `
            <div class="portfolio-card">
                <img src="${p.image_url || 'assets/hero_graphic.jpg'}" alt="${p.title}" class="portfolio-img">
                <div class="portfolio-body">
                    <div class="portfolio-tags">
                        <span class="tag">${p.industry}</span>
                        <span class="tag">${p.client_name || 'Enterprise'}</span>
                    </div>
                    <h3 style="font-size: 1.25rem; margin-bottom: 12px; color: var(--text-heading);">${p.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">${p.solution || p.description}</p>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        ${(p.tech_stack || []).map(t => `<span style="font-size: 0.75rem; color: var(--primary-cyan); background: rgba(0,242,254,0.08); padding: 2px 8px; border-radius: 4px;">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // --- STEP 3: SERVICE (FETCH SERVICES) ---
    async function fetchServices() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;
        try {
            const res = await fetch(`${API_BASE}/services`);
            const json = await res.json();
            if (json.success && json.data) {
                renderServices(json.data);
            }
        } catch (err) {
            renderServices([
                {
                    title: 'Cloud Architecture & DevOps',
                    icon: '☁️',
                    tagline: 'High-availability AWS, Azure & GCP cloud infrastructure with 99.99% uptime guarantees.',
                    features: ["Multi-Cloud Infrastructure", "Kubernetes & Helm Setup", "Terraform IaC", "Zero-Downtime CI/CD"]
                },
                {
                    title: 'Enterprise AI & Machine Learning',
                    icon: '🤖',
                    tagline: 'Transform business operations with custom LLMs, predictive models, and intelligent workflows.',
                    features: ["Custom LLM Fine-Tuning & RAG", "Predictive Analytics Models", "Autonomous AI Agents", "MLOps Lifecycle"]
                },
                {
                    title: 'Custom Web & Mobile Development',
                    icon: '💻',
                    tagline: 'Ultra-fast, scalable web applications and native cross-platform mobile apps.',
                    features: ["Modern React & Next.js Apps", "Scalable Microservices", "iOS & Android Cross-Platform", "GraphQL & RESTful API"]
                }
            ]);
        }
    }

    function renderServices(services) {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;
        grid.innerHTML = services.map(s => `
            <div class="service-card">
                <div class="service-icon-box">${s.icon === 'cloud' ? '☁️' : s.icon === 'cpu' ? '🤖' : s.icon === 'code' ? '💻' : s.icon}</div>
                <h3 class="service-title">${s.title}</h3>
                <p class="service-desc">${s.tagline}</p>
                <ul class="feature-list">
                    ${(s.features || []).map(f => `<li>${f}</li>`).join('')}
                </ul>
                <a href="#project" class="btn btn-secondary" style="width: 100%; justify-content: center;">View Related Projects</a>
            </div>
        `).join('');
    }

    // --- STEP 4: WEBSITE DEMO (FETCH LIVE WEBSITE DEMOS) ---
    async function fetchWebsiteDemos(category = 'All') {
        const grid = document.getElementById('websiteDemosGrid');
        if (!grid) return;
        try {
            const url = category === 'All' ? `${API_BASE}/website-demos` : `${API_BASE}/website-demos?category=${encodeURIComponent(category)}`;
            const res = await fetch(url);
            const json = await res.json();
            if (json.success && json.data) {
                renderWebsiteDemos(json.data);
            }
        } catch (err) {
            renderWebsiteDemos([
                {
                    title: 'Global E-Commerce Storefront',
                    category: 'E-Commerce',
                    description: 'High-conversion online shopping platform with instant live search, cart management, and payment gateway.',
                    preview_url: 'https://www.ecomdrivebd.com',
                    image_url: 'assets/hero_graphic.jpg',
                    tags: ['Next.js', 'Stripe', 'Tailwind', 'Fast Checkout']
                },
                {
                    title: 'Enterprise SaaS Admin Portal',
                    category: 'SaaS',
                    description: 'Real-time analytics dashboard with user role management, data charts, and dark mode theme.',
                    preview_url: '/admin.html',
                    image_url: 'assets/hero_graphic.jpg',
                    tags: ['React', 'Node.js', 'Chart.js', 'REST API']
                },
                {
                    title: 'HealthTech Diagnostic Portal',
                    category: 'Healthcare',
                    description: 'Patient management system with online appointment booking, doctor directory, and diagnostic reports.',
                    preview_url: '#',
                    image_url: 'assets/hero_graphic.jpg',
                    tags: ['HIPAA Compliant', 'AI Vision', 'Telehealth']
                },
                {
                    title: 'Corporate Digital Agency Suite',
                    category: 'Corporate',
                    description: 'Sleek corporate portfolio with dynamic service showcase, video backgrounds, and cost calculator.',
                    preview_url: '/',
                    image_url: 'assets/hero_graphic.jpg',
                    tags: ['Glassmorphism', 'SEO Optimized', 'Fast Load']
                }
            ]);
        }
    }

    function renderWebsiteDemos(items) {
        const grid = document.getElementById('websiteDemosGrid');
        if (!grid) return;
        grid.innerHTML = items.map(d => `
            <div class="portfolio-card">
                <div style="position: relative; overflow: hidden;">
                    <img src="${d.image_url || 'assets/hero_graphic.jpg'}" alt="${d.title}" class="portfolio-img">
                    <span style="position: absolute; top: 12px; right: 12px; background: rgba(16, 185, 129, 0.9); color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px;">LIVE DEMO</span>
                </div>
                <div class="portfolio-body">
                    <div class="portfolio-tags">
                        <span class="tag">${d.category}</span>
                    </div>
                    <h3 style="font-size: 1.25rem; margin-bottom: 12px; color: var(--text-heading);">${d.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">${d.description}</p>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px;">
                        ${(d.tags || []).map(t => `<span style="font-size: 0.75rem; color: var(--primary-cyan); background: rgba(0,242,254,0.08); padding: 2px 8px; border-radius: 4px;">${t}</span>`).join('')}
                    </div>
                    <a href="${d.preview_url || '#'}" target="${d.preview_url && d.preview_url.startsWith('http') ? '_blank' : '_self'}" class="btn btn-primary" style="width: 100%; justify-content: center;">
                        <span>Preview Live Demo</span>
                        <span>↗</span>
                    </a>
                </div>
            </div>
        `).join('');
    }

    // --- STEP 5: TEAM (FETCH TEAM) ---
    async function fetchTeam() {
        const grid = document.getElementById('teamGrid');
        if (!grid) return;
        try {
            const res = await fetch(`${API_BASE}/team`);
            const json = await res.json();
            if (json.success && json.data) {
                renderTeam(json.data);
            }
        } catch (err) {
            renderTeam([
                { name: 'Alexander Wright', role: 'Chief Executive Officer & Cloud Architect', bio: '15+ years leading enterprise digital transformations and multi-cloud migrations.', photo_url: 'assets/hero_graphic.jpg' },
                { name: 'Dr. Sophia Chen', role: 'Head of AI & Machine Learning', bio: 'Specializing in enterprise LLM fine-tuning, RAG vector indexing, and autonomous AI agents.', photo_url: 'assets/hero_graphic.jpg' },
                { name: 'Marcus Vance', role: 'Principal Full-Stack Engineer', bio: 'Expert in high-concurrency microservices, Next.js edge caching, and scalable GraphQL APIs.', photo_url: 'assets/hero_graphic.jpg' },
                { name: 'Elena Rostova', role: 'VP of Product & UI/UX Design', bio: 'Architecting world-class user experiences, modern glassmorphism UI design, and design systems.', photo_url: 'assets/hero_graphic.jpg' }
            ]);
        }
    }

    function renderTeam(team) {
        const grid = document.getElementById('teamGrid');
        if (!grid) return;
        grid.innerHTML = team.map(t => `
            <div class="service-card text-center" style="align-items: center; text-align: center;">
                <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 2px solid var(--primary-cyan); margin: 0 auto 16px auto;">
                    <img src="${t.photo_url || t.profile_image || 'assets/hero_graphic.jpg'}" alt="${t.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <h3 class="service-title" style="margin-bottom: 4px;">${t.name}</h3>
                <span style="color: var(--primary-cyan); font-size: 0.825rem; font-weight: 600; margin-bottom: 12px; display: block;">${t.role}</span>
                <p class="service-desc" style="font-size: 0.85rem;">${t.bio}</p>
            </div>
        `).join('');
    }

    // --- STEP 6: BLOG (FETCH BLOGS) ---
    async function fetchBlogs() {
        const grid = document.getElementById('blogsGrid');
        if (!grid) return;
        try {
            const res = await fetch(`${API_BASE}/blogs`);
            const json = await res.json();
            if (json.success && json.data) {
                renderBlogs(json.data);
            }
        } catch (err) {
            renderBlogs([
                { title: 'Architecting High-Availability Cloud Infrastructure on AWS', category: 'Cloud DevOps', read_time: '6 min read', content: 'Building resilient cloud systems requires multi-region failover, infrastructure as code, and continuous health probing...', author: 'Alexander Wright' },
                { title: 'Zero Trust Security Models in Enterprise Microservices', category: 'Cybersecurity', read_time: '8 min read', content: 'Implementing mTLS with Istio service mesh enforces end-to-end encryption across inter-service node communication...', author: 'Operations Team' },
                { title: 'Scaling AI Agent Systems with RAG & Vector Databases', category: 'Artificial Intelligence', read_time: '10 min read', content: 'Retrieval Augmented Generation bridges LLM knowledge gaps with real-time vector similarity indexing...', author: 'Dr. Sophia Chen' }
            ]);
        }
    }

    function renderBlogs(blogs) {
        const grid = document.getElementById('blogsGrid');
        if (!grid) return;
        grid.innerHTML = blogs.map(b => `
            <div class="portfolio-card">
                <div class="portfolio-body" style="padding-top: 24px;">
                    <div class="portfolio-tags" style="margin-bottom: 12px;">
                        <span class="tag">${b.category || 'Engineering'}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">${b.read_time || '5 min read'}</span>
                    </div>
                    <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--text-heading);">${b.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px; line-height: 1.5;">${(b.content || b.description || '').substring(0, 130)}...</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; font-size: 0.8rem; color: var(--text-muted);">
                        <span>✍️ ${b.author || 'Growth IT Team'}</span>
                        <a href="#blog" style="color: var(--primary-cyan); text-decoration: none; font-weight: 600;">Read Post →</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Theme Toggle
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                themeBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
            });
        }

        // Portfolio Filter Buttons (Project Section)
        document.querySelectorAll('#portfolioFilterBar .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#portfolioFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                fetchPortfolio(btn.getAttribute('data-filter'));
            });
        });

        // Demo Filter Buttons (Website Demo Section)
        document.querySelectorAll('#demoFilterBar .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#demoFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                fetchWebsiteDemos(btn.getAttribute('data-filter'));
            });
        });

        // Newsletter Form Submit
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('newsletterEmail').value;
                try {
                    const res = await fetch(`${API_BASE}/subscribe`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const json = await res.json();
                    showToast(json.message || 'Subscribed successfully!');
                    newsletterForm.reset();
                } catch (err) {
                    showToast('Subscribed to Growth IT insights!');
                }
            });
        }

        // Mobile 3-Dot Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');

        if (mobileMenuBtn && mobileMenuDrawer) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenuBtn.classList.toggle('active');
                mobileMenuDrawer.classList.toggle('open');
            });

            // Close mobile drawer when clicking any nav link inside drawer
            document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuDrawer.classList.remove('open');
                });
            });

            // Close mobile drawer when clicking outside header
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar')) {
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuDrawer.classList.remove('open');
                }
            });
        }
    }

    // --- TOAST NOTIFICATION UTILITY ---
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>💬</span> <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
});
