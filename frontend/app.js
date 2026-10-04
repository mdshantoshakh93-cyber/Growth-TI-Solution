/**
 * Growth IT Solution Frontend Application Engine
 * Pure ES6 JavaScript - High performance & real-time API integrations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Determine API Base URL (works both locally and when served via server.js)
    const API_BASE = window.location.origin.includes('5000') ? '/api' : 'http://127.0.0.1:5000/api';

    // Application State
    const estimatorState = {
        service_category: 'Cloud Infrastructure',
        scale: 'Startup MVP',
        features: ['24/7 SLA Support', 'CI/CD Automation']
    };

    // --- INITIALIZATION ---
    checkApiHealth();
    fetchStats();
    fetchServices();
    fetchPortfolio('All');
    setupEventListeners();

    // --- API HEALTH CHECK ---
    async function checkApiHealth() {
        const pillText = document.getElementById('apiStatusText');
        const pill = document.getElementById('apiStatusPill');
        try {
            const res = await fetch(`${API_BASE}/health`);
            const data = await res.json();
            if (data.status === 'online') {
                pillText.textContent = 'API Connected';
                pill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            }
        } catch (err) {
            console.warn('[API Offline] Running in client fallback mode');
            pillText.textContent = 'API Offline (Demo Mode)';
            pill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            document.querySelector('.status-dot').style.backgroundColor = '#EF4444';
        }
    }

    // --- FETCH STATS ---
    async function fetchStats() {
        try {
            const res = await fetch(`${API_BASE}/stats`);
            const data = await res.json();
            if (data.success) {
                document.getElementById('statProjects').textContent = `${data.data.completed_projects}+`;
                document.getElementById('statUptime').textContent = data.data.sla_uptime;
                document.getElementById('statClients').textContent = `${data.data.active_clients}+`;
                document.getElementById('statAwards').textContent = data.data.global_awards;
            }
        } catch (err) {
            // Keep default values if server offline
        }
    }

    // --- FETCH SERVICES ---
    async function fetchServices() {
        const grid = document.getElementById('servicesGrid');
        try {
            const res = await fetch(`${API_BASE}/services`);
            const json = await res.json();
            if (json.success) {
                renderServices(json.data);
            }
        } catch (err) {
            // Render Fallback Services
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
        grid.innerHTML = services.map(s => `
            <div class="service-card">
                <div class="service-icon-box">${s.icon === 'cloud' ? '☁️' : s.icon === 'cpu' ? '🤖' : s.icon === 'code' ? '💻' : s.icon}</div>
                <h3 class="service-title">${s.title}</h3>
                <p class="service-desc">${s.tagline}</p>
                <ul class="feature-list">
                    ${(s.features || []).map(f => `<li>${f}</li>`).join('')}
                </ul>
                <a href="#estimator" class="btn btn-secondary" style="width: 100%;">Calculate Cost</a>
            </div>
        `).join('');
    }

    // --- FETCH PORTFOLIO / CASE STUDIES ---
    async function fetchPortfolio(category) {
        const grid = document.getElementById('portfolioGrid');
        try {
            const url = category === 'All' ? `${API_BASE}/portfolio` : `${API_BASE}/portfolio?category=${encodeURIComponent(category)}`;
            const res = await fetch(url);
            const json = await res.json();
            if (json.success) {
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
                }
            ]);
        }
    }

    function renderPortfolio(items) {
        const grid = document.getElementById('portfolioGrid');
        grid.innerHTML = items.map(p => `
            <div class="portfolio-card">
                <img src="${p.image_url || 'assets/hero_graphic.jpg'}" alt="${p.title}" class="portfolio-img">
                <div class="portfolio-body">
                    <div class="portfolio-tags">
                        <span class="tag">${p.industry}</span>
                        <span class="tag">${p.client_name}</span>
                    </div>
                    <h3 style="font-size: 1.25rem; margin-bottom: 12px;">${p.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">${p.solution}</p>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        ${(p.tech_stack || []).map(t => `<span style="font-size: 0.75rem; color: var(--primary-cyan); background: rgba(0,242,254,0.08); padding: 2px 8px; border-radius: 4px;">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // --- ESTIMATOR CALCULATION ENGINE ---
    function updateEstimate() {
        let baseCost = 3000;
        let scaleMult = 1.0;
        let timeline = '3 - 4 Weeks';

        if (estimatorState.service_category === 'Artificial Intelligence') baseCost = 4500;
        else if (estimatorState.service_category === 'Cloud Infrastructure') baseCost = 3500;
        else if (estimatorState.service_category === 'Security & Compliance') baseCost = 4000;

        if (estimatorState.scale === 'Growth Scale') {
            scaleMult = 1.8;
            timeline = '5 - 7 Weeks';
        } else if (estimatorState.scale === 'Enterprise System') {
            scaleMult = 3.2;
            timeline = '8 - 12 Weeks';
        }

        const featureCost = (estimatorState.features ? estimatorState.features.length : 0) * 750;
        const total = Math.round((baseCost * scaleMult) + featureCost);

        document.getElementById('estimatedPrice').textContent = `$${total.toLocaleString()}`;
        document.getElementById('estimatedTimeline').textContent = timeline;
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Theme Toggle
        document.getElementById('themeToggleBtn').addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            document.getElementById('themeToggleBtn').textContent = newTheme === 'dark' ? '🌙' : '☀️';
        });

        // Estimator Service Options
        document.querySelectorAll('#serviceOptions .option-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('#serviceOptions .option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                estimatorState.service_category = card.getAttribute('data-value');
                updateEstimate();
            });
        });

        // Estimator Scale Options
        document.querySelectorAll('#scaleOptions .option-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('#scaleOptions .option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                estimatorState.scale = card.getAttribute('data-value');
                updateEstimate();
            });
        });

        // Estimator Checkboxes
        document.querySelectorAll('#featureOptions input').forEach(input => {
            input.addEventListener('change', () => {
                estimatorState.features = Array.from(document.querySelectorAll('#featureOptions input:checked')).map(i => i.value);
                updateEstimate();
            });
        });

        // Estimator Form Submit
        document.getElementById('estimatorForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('estName').value;
            const email = document.getElementById('estEmail').value;

            try {
                const res = await fetch(`${API_BASE}/estimator`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        client_name: name,
                        client_email: email,
                        service_category: estimatorState.service_category,
                        scale: estimatorState.scale,
                        features: estimatorState.features
                    })
                });
                const json = await res.json();
                if (json.success) {
                    showToast('🎉 Project inquiry submitted! Our team will contact you within 2 hours.');
                    document.getElementById('estimatorForm').reset();
                }
            } catch (err) {
                showToast('🚀 Inquiry saved in offline demo mode!');
            }
        });

        // Portfolio Filter Buttons
        document.querySelectorAll('#portfolioFilterBar .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#portfolioFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                fetchPortfolio(btn.getAttribute('data-filter'));
            });
        });

        // Contact Form Submit
        document.getElementById('contactForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;

            try {
                const res = await fetch(`${API_BASE}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });
                const json = await res.json();
                showToast(json.message || 'Message received! We will be in touch shortly.');
                document.getElementById('contactForm').reset();
            } catch (err) {
                showToast('Message sent! (Demo mode)');
            }
        });

        // Newsletter Form Submit
        document.getElementById('newsletterForm').addEventListener('submit', async (e) => {
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
                document.getElementById('newsletterForm').reset();
            } catch (err) {
                showToast('Subscribed to Growth IT insights!');
            }
        });
    }

    // --- TOAST NOTIFICATION UTILITY ---
    function showToast(message) {
        const container = document.getElementById('toast-container');
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
