/**
 * Growth IT Solution Database Interface
 * SQLite file-backed database layer with in-memory JSON fallback
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('../backend/utils/bcrypt');

class DatabaseStore {
    constructor() {
        this.inMemoryData = {
            users: [],
            sessions: [],
            services: [],
            portfolio_items: [],
            inquiries: [],
            contact_messages: [],
            newsletter_subscribers: [],
            blogs: [],
            testimonials: [],
            pricing: [],
            faqs: [],
            team: [],
            careers: [],
            media: [],
            pages: [],
            navigation: [],
            seo: [],
            activity_logs: [],
            website_demos: [],
            settings: {}
        };
        this.init();
    }

    init() {
        console.log('[DB] Initializing Growth IT Solution Database Store...');
        this.seedInitialData();
    }

    logActivity(action, performedBy, details = '') {
        const log = {
            id: 'log-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
            action,
            performed_by: performedBy || 'System',
            timestamp: new Date().toISOString(),
            details
        };
        this.inMemoryData.activity_logs.unshift(log);
        if (this.inMemoryData.activity_logs.length > 100) {
            this.inMemoryData.activity_logs.pop();
        }
        return log;
    }

    seedInitialData() {
        // --- 1. USERS & ROLES ---
        const superAdminEmail = process.env.ADMIN_EMAIL || 'growthitsolution@gmail.com';
        const superAdminPassword = process.env.ADMIN_PASSWORD || 'growthitsolution123';

        this.inMemoryData.users = [
            {
                id: 'usr-superadmin-001',
                full_name: 'System Super Admin',
                email: superAdminEmail,
                password_hash: bcrypt.hashPassword(superAdminPassword, 10),
                role: 'SUPER_ADMIN',
                status: 'active',
                created_at: new Date().toISOString()
            },
            {
                id: 'usr-superadmin-002',
                full_name: 'Super Admin',
                email: 'superadmin@growthit.com',
                password_hash: bcrypt.hashPassword('SuperAdminSecret2026!', 10),
                role: 'SUPER_ADMIN',
                status: 'active',
                created_at: new Date().toISOString()
            },
            {
                id: 'usr-admin-002',
                full_name: 'Operations Admin',
                email: 'admin@growthit.com',
                password_hash: bcrypt.hashPassword('AdminPass2026!', 10),
                role: 'ADMIN',
                status: 'active',
                created_at: new Date().toISOString()
            },
            {
                id: 'usr-editor-003',
                full_name: 'Lead Technical Editor',
                email: 'editor@growthit.com',
                password_hash: bcrypt.hashPassword('EditorPass2026!', 10),
                role: 'EDITOR',
                status: 'active',
                created_at: new Date().toISOString()
            },
            {
                id: 'usr-content-004',
                full_name: 'Content Manager',
                email: 'content@growthit.com',
                password_hash: bcrypt.hashPassword('ContentPass2026!', 10),
                role: 'CONTENT_MANAGER',
                status: 'active',
                created_at: new Date().toISOString()
            }
        ];

        this.inMemoryData.sessions = [];

        // --- 2. SERVICES ---
        this.inMemoryData.services = [
            {
                id: 'srv-001',
                title: 'Cloud Architecture & DevOps',
                slug: 'cloud-devops',
                category: 'Cloud Infrastructure',
                icon: 'cloud',
                tagline: 'High-availability AWS, Azure & GCP cloud infrastructure with 99.99% uptime guarantees.',
                description: 'We design, deploy, and manage multi-cloud infrastructure with Kubernetes orchestration, Terraform IaC, and automated CI/CD deployment pipelines.',
                features: ["Multi-Cloud Infrastructure (AWS/Azure/GCP)", "Kubernetes Orchestration & Helm Setup", "Terraform & Ansible Infrastructure as Code", "Zero-Downtime CI/CD Pipelines", "Cost Optimization & Cloud Governance"],
                starting_price: 2500.00,
                active: true,
                created_at: new Date().toISOString()
            },
            {
                id: 'srv-002',
                title: 'Enterprise AI & Machine Learning',
                slug: 'ai-machine-learning',
                category: 'Artificial Intelligence',
                icon: 'cpu',
                tagline: 'Transform business operations with custom LLMs, predictive models, and intelligent workflows.',
                description: 'From bespoke AI agents and RAG knowledge systems to real-time predictive analytics, we embed enterprise artificial intelligence directly into your core business.',
                features: ["Custom LLM Fine-Tuning & RAG Pipelines", "Predictive Analytics & Forecasting Models", "Computer Vision & OCR Automation", "Autonomous AI Agents & Chatbots", "MLOps & Model Lifecycle Monitoring"],
                starting_price: 4000.00,
                active: true,
                created_at: new Date().toISOString()
            },
            {
                id: 'srv-003',
                title: 'Custom Web & Mobile Development',
                slug: 'web-mobile-dev',
                category: 'Software Engineering',
                icon: 'code',
                tagline: 'Ultra-fast, scalable web applications and native cross-platform mobile apps.',
                description: 'End-to-end full-stack development using React, Next.js, Node.js, Python, and Flutter to engineer pixel-perfect, secure, and intuitive applications.',
                features: ["Modern React / Next.js & Vue Applications", "Scalable Microservices Backend Architecture", "iOS & Android Cross-Platform Mobile Apps", "GraphQL & RESTful API Engineering", "Performance Optimization & PWA Conversion"],
                starting_price: 3000.00,
                active: true,
                created_at: new Date().toISOString()
            },
            {
                id: 'srv-004',
                title: 'Cybersecurity & Zero Trust Architecture',
                slug: 'cybersecurity',
                category: 'Security & Compliance',
                icon: 'shield',
                tagline: 'Bulletproof your digital assets with Zero Trust, penetration testing, and SOC compliance.',
                description: 'Comprehensive security auditing, SOC2 / ISO27001 readiness, automated threat intelligence, and continuous vulnerability monitoring.',
                features: ["Penetration Testing & Security Audits", "Zero Trust Architecture Implementation", "SOC2 Type II & ISO 27001 Compliance", "Real-Time Intrusion Detection & SIEM", "Automated Encryption & Identity Management"],
                starting_price: 3500.00,
                active: true,
                created_at: new Date().toISOString()
            },
            {
                id: 'srv-005',
                title: 'Data Engineering & Big Data Analytics',
                slug: 'data-engineering',
                category: 'Data Analytics',
                icon: 'database',
                tagline: 'Turn raw enterprise data into actionable real-time business intelligence.',
                description: 'Build robust data lakes, real-time streaming pipelines with Kafka, BigQuery/Snowflake warehouses, and interactive BI dashboards.',
                features: ["Real-time Streaming Data Pipelines", "Snowflake & BigQuery Data Warehousing", "ETL / ELT Automation with dbt", "Custom PowerBI & Metabase Dashboards", "Data Quality Governance & Security"],
                starting_price: 2800.00,
                active: true,
                created_at: new Date().toISOString()
            }
        ];

        // --- 3. PROJECTS / PORTFOLIO ---
        this.inMemoryData.portfolio_items = [
            {
                id: 'port-001',
                title: 'FinTech Core Banking Cloud Migration',
                client_name: 'Apex Financial Inc.',
                industry: 'FinTech',
                status: 'published',
                challenge: 'Legacy monolithic mainframe system suffered high downtime during market peaks.',
                solution: 'Migrated core transaction services to AWS EKS microservices with DynamoDB global tables.',
                results_metrics: { cost_reduction: '45% Cloud Spend Savings', uptime: '99.999% SLA Uptime' },
                tech_stack: ['AWS', 'Kubernetes', 'Node.js', 'DynamoDB', 'Terraform'],
                image_url: 'assets/hero_graphic.jpg',
                featured: true,
                created_at: new Date().toISOString()
            },
            {
                id: 'port-002',
                title: 'AI-Powered HealthTech Diagnostic Portal',
                client_name: 'MedPulse Innovations',
                industry: 'Healthcare',
                status: 'published',
                challenge: 'Radiology teams struggled with high patient volume and delayed diagnostic turnarounds.',
                solution: 'Engineered an AI computer vision pipeline trained on DICOM images with 98.4% diagnostic accuracy.',
                results_metrics: { diagnostic_speed: '75% Faster Diagnosis', accuracy: '98.4% Model Accuracy' },
                tech_stack: ['Python', 'PyTorch', 'React', 'FastAPI', 'GCP Cloud Run'],
                image_url: 'assets/hero_graphic.jpg',
                featured: true,
                created_at: new Date().toISOString()
            },
            {
                id: 'port-003',
                title: 'Global E-Commerce Omnichannel Platform',
                client_name: 'Nova Retail Group',
                industry: 'E-Commerce',
                status: 'published',
                challenge: 'Legacy web platform crashed during Cyber Monday flash sales due to database locks.',
                solution: 'Re-architected to headless commerce with Next.js edge caching and Redis microservices.',
                results_metrics: { traffic_capacity: '2.5M Peak Concurrency', page_speed: '0.6s LCP Load Time' },
                tech_stack: ['Next.js', 'GraphQL', 'Redis', 'Stripe', 'PostgreSQL'],
                image_url: 'assets/hero_graphic.jpg',
                featured: false,
                created_at: new Date().toISOString()
            },
            {
                id: 'port-004',
                title: 'Autonomous Supply Chain Logistics AI',
                client_name: 'LogiGlobal Corp',
                industry: 'Logistics',
                status: 'draft',
                challenge: 'Manual route optimization caused high fuel waste.',
                solution: 'Deployed genetic route planning AI for fleet routing.',
                results_metrics: { fuel_saved: '30% Fuel Reduction' },
                tech_stack: ['Python', 'TensorFlow', 'Docker'],
                image_url: 'assets/hero_graphic.jpg',
                featured: false,
                created_at: new Date().toISOString()
            }
        ];

        // --- 4. BLOGS ---
        this.inMemoryData.blogs = [
            {
                id: 'blog-001',
                title: 'Architecting High-Availability Cloud Infrastructure on AWS',
                author: 'System Super Admin',
                category: 'Cloud Architecture',
                read_time: '6 min read',
                status: 'published',
                content: 'Building resilient cloud systems requires multi-region failover, infrastructure as code, and continuous health probing...',
                created_at: new Date().toISOString()
            },
            {
                id: 'blog-002',
                title: 'Zero Trust Security Models in Enterprise Microservices',
                author: 'Operations Admin',
                category: 'Cybersecurity',
                read_time: '8 min read',
                status: 'published',
                content: 'Implementing mTLS with Istio service mesh enforces end-to-end encryption across inter-service node communication...',
                created_at: new Date().toISOString()
            },
            {
                id: 'blog-003',
                title: 'Scaling AI Agent Systems with RAG & Vector Databases',
                author: 'Lead Technical Editor',
                category: 'Artificial Intelligence',
                read_time: '10 min read',
                status: 'draft',
                content: 'Retrieval Augmented Generation bridges LLM knowledge gaps with real-time vector similarity indexing...',
                created_at: new Date().toISOString()
            }
        ];

        // --- 5. TESTIMONIALS ---
        this.inMemoryData.testimonials = [
            {
                id: 'tst-001',
                client_name: 'Elena Rostova',
                company: 'Apex Financial Inc.',
                role: 'Chief Technology Officer',
                rating: 5,
                comment: 'Growth IT Solution migrated our entire legacy core banking system to AWS EKS with zero downtime. Exceptional engineering precision.',
                avatar_url: 'assets/hero_graphic.jpg'
            },
            {
                id: 'tst-002',
                client_name: 'Dr. Marcus Vance',
                company: 'MedPulse Innovations',
                role: 'VP of Diagnostic Engineering',
                rating: 5,
                comment: 'Their AI computer vision team built a model with 98.4% diagnostic accuracy that transformed radiology turnarounds.',
                avatar_url: 'assets/hero_graphic.jpg'
            }
        ];

        // --- 6. PRICING TIERS ---
        this.inMemoryData.pricing = [
            {
                id: 'prc-001',
                tier_name: 'Startup MVP Engine',
                price_usd: 3000,
                billing_cycle: 'One-time Project',
                features: ['Full-stack Web / Mobile App', 'Basic Cloud Setup', 'API Integrations', '30-Day Post Launch Support'],
                highlighted: false
            },
            {
                id: 'prc-002',
                tier_name: 'Growth Scale System',
                price_usd: 7500,
                billing_cycle: 'Custom Scope',
                features: ['Kubernetes Microservices', 'Custom AI LLM Integration', 'Penetration Testing & Security Audit', '99.9% SLA Guarantee'],
                highlighted: true
            },
            {
                id: 'prc-003',
                tier_name: 'Enterprise Ecosystem',
                price_usd: 18500,
                billing_cycle: 'Annual Retainer',
                features: ['Multi-cloud Terraform Deployment', '24/7 Managed SOC & Incident Response', 'Dedicated Solutions Architect', 'Custom MLOps Pipeline'],
                highlighted: false
            }
        ];

        // --- 7. FAQS ---
        this.inMemoryData.faqs = [
            {
                id: 'faq-001',
                question: 'What is your typical project delivery timeline?',
                answer: 'Startup MVP builds average 4-6 weeks, while complex Enterprise Cloud & AI projects range from 8-12 weeks.',
                category: 'General'
            },
            {
                id: 'faq-002',
                question: 'How do you guarantee cloud infrastructure security and compliance?',
                answer: 'We follow strict Zero Trust architecture, enforce SOC2/ISO27001 readiness standards, and conduct automated penetration testing.',
                category: 'Security'
            }
        ];

        // --- 8. TEAM ---
        this.inMemoryData.team = [
            {
                id: 'tem-001',
                name: 'Alexander Wright',
                role: 'Chief Executive Officer & Cloud Architect',
                bio: '15+ years leading enterprise digital transformations and multi-cloud architecture migrations.',
                photo_url: 'assets/hero_graphic.jpg',
                linkedin: 'https://linkedin.com',
                github: 'https://github.com'
            },
            {
                id: 'tem-002',
                name: 'Dr. Sophia Chen',
                role: 'Head of AI & Machine Learning',
                bio: 'Specializing in enterprise LLM fine-tuning, RAG vector indexing, and autonomous AI agents.',
                photo_url: 'assets/hero_graphic.jpg',
                linkedin: 'https://linkedin.com',
                github: 'https://github.com'
            },
            {
                id: 'tem-003',
                name: 'Marcus Vance',
                role: 'Principal Full-Stack Engineer',
                bio: 'Expert in high-concurrency microservices, Next.js edge caching, and scalable GraphQL APIs.',
                photo_url: 'assets/hero_graphic.jpg',
                linkedin: 'https://linkedin.com',
                github: 'https://github.com'
            },
            {
                id: 'tem-004',
                name: 'Elena Rostova',
                role: 'VP of Product & UI/UX Design',
                bio: 'Architecting world-class user experiences, modern glassmorphism UI design, and design systems.',
                photo_url: 'assets/hero_graphic.jpg',
                linkedin: 'https://linkedin.com',
                github: 'https://github.com'
            }
        ];

        // --- 8.5. WEBSITE DEMOS ---
        this.inMemoryData.website_demos = [
            {
                id: 'demo-001',
                title: 'Global E-Commerce Storefront',
                category: 'E-Commerce',
                description: 'High-conversion online shopping platform with instant live search, cart management, and payment gateway.',
                preview_url: 'https://www.ecomdrivebd.com',
                image_url: 'assets/hero_graphic.jpg',
                tags: ['Next.js', 'Stripe', 'Tailwind', 'Fast Checkout'],
                featured: true
            },
            {
                id: 'demo-002',
                title: 'Enterprise SaaS Admin Portal',
                category: 'SaaS',
                description: 'Real-time analytics dashboard with user role management, data charts, and dark mode theme.',
                preview_url: '/admin.html',
                image_url: 'assets/hero_graphic.jpg',
                tags: ['React', 'Node.js', 'Chart.js', 'REST API'],
                featured: true
            },
            {
                id: 'demo-003',
                title: 'HealthTech Diagnostic Portal',
                category: 'Healthcare',
                description: 'Patient management system with online appointment booking, doctor directory, and diagnostic reports.',
                preview_url: '#',
                image_url: 'assets/hero_graphic.jpg',
                tags: ['HIPAA Compliant', 'AI Vision', 'Telehealth'],
                featured: true
            },
            {
                id: 'demo-004',
                title: 'Corporate Digital Agency Suite',
                category: 'Corporate',
                description: 'Sleek corporate portfolio with dynamic service showcase, video backgrounds, and cost calculator.',
                preview_url: '/',
                image_url: 'assets/hero_graphic.jpg',
                tags: ['Glassmorphism', 'SEO Optimized', 'Fast Load'],
                featured: true
            }
        ];

        // --- 9. CAREERS (Active Jobs) ---
        this.inMemoryData.careers = [
            {
                id: 'car-001',
                job_title: 'Senior Cloud DevOps Architect',
                department: 'Infrastructure',
                location: 'Remote / New York',
                type: 'Full-time',
                status: 'active',
                description: 'Looking for a Kubernetes, Terraform, and AWS EKS specialist to lead multi-cloud migrations.'
            },
            {
                id: 'car-002',
                job_title: 'Principal AI Engineer (LLMs & RAG)',
                department: 'Artificial Intelligence',
                location: 'Remote / San Francisco',
                type: 'Full-time',
                status: 'active',
                description: 'Build enterprise-grade RAG indexing and autonomous agent orchestrations.'
            },
            {
                id: 'car-003',
                job_title: 'Cybersecurity Penetration Tester',
                department: 'Security',
                location: 'Remote',
                type: 'Contract',
                status: 'closed',
                description: 'Perform Zero Trust security audits and automated vulnerability scanning.'
            }
        ];

        // --- 10. CONTACT MESSAGES ---
        this.inMemoryData.contact_messages = [
            {
                id: 'msg-001',
                name: 'Sarah Jenkins',
                email: 'sarah.j@fintechcorp.io',
                subject: 'AWS EKS Migration Inquiry',
                message: 'We are looking to migrate our microservices stack to AWS EKS with Terraform IaC. Please connect us with a Cloud Architect.',
                status: 'unread',
                created_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 'msg-002',
                name: 'David K. Miller',
                email: 'david@healthtech.com',
                subject: 'Custom AI Agent Integration',
                message: 'Interested in implementing RAG knowledge systems for internal medical documentation analysis.',
                status: 'unread',
                created_at: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 'msg-003',
                name: 'Rachel Adams',
                email: 'radams@globalretail.com',
                subject: 'Cybersecurity Audit Consultation',
                message: 'We require a SOC2 Type II readiness assessment for our retail SaaS platform before Q4.',
                status: 'read',
                created_at: new Date(Date.now() - 172800000).toISOString()
            }
        ];

        // --- 11. NEWSLETTER SUBSCRIBERS ---
        this.inMemoryData.newsletter_subscribers = [
            { id: 'sub-001', email: 'techlead@cloudnet.org', subscribed_at: new Date().toISOString() },
            { id: 'sub-002', email: 'cto@innovate.ai', subscribed_at: new Date().toISOString() },
            { id: 'sub-003', email: 'devops@enterprise.com', subscribed_at: new Date().toISOString() },
            { id: 'sub-004', email: 'security@fintech.io', subscribed_at: new Date().toISOString() }
        ];

        // --- 12. MEDIA LIBRARY ---
        this.inMemoryData.media = [
            { id: 'med-001', file_name: 'hero_graphic.jpg', file_url: 'assets/hero_graphic.jpg', file_type: 'image/jpeg', file_size_kb: 420, uploaded_at: new Date().toISOString() },
            { id: 'med-002', file_name: 'logo.jpg', file_url: 'assets/logo.jpg', file_type: 'image/jpeg', file_size_kb: 85, uploaded_at: new Date().toISOString() }
        ];

        // --- 13. PAGES ---
        this.inMemoryData.pages = [
            { id: 'pag-001', title: 'Home Page', slug: 'home', status: 'published', last_updated: new Date().toISOString() },
            { id: 'pag-002', title: 'About Us', slug: 'about', status: 'published', last_updated: new Date().toISOString() },
            { id: 'pag-003', title: 'Privacy Policy', slug: 'privacy-policy', status: 'published', last_updated: new Date().toISOString() },
            { id: 'pag-004', title: 'Terms of Service', slug: 'terms-of-service', status: 'published', last_updated: new Date().toISOString() }
        ];

        // --- 14. NAVIGATION ---
        this.inMemoryData.navigation = [
            { id: 'nav-001', label: 'Services', url: '#services', order: 1, visible: true },
            { id: 'nav-002', label: 'Portfolio', url: '#portfolio', order: 2, visible: true },
            { id: 'nav-003', label: 'Cost Estimator', url: '#estimator', order: 3, visible: true },
            { id: 'nav-004', label: 'Contact', url: '#contact', order: 4, visible: true }
        ];

        // --- 15. SEO CONFIG ---
        this.inMemoryData.seo = [
            {
                id: 'seo-001',
                page_slug: 'home',
                meta_title: 'Growth IT Solution | Next-Gen Enterprise IT Engine & AI Solutions',
                meta_description: 'High-availability AWS, Azure & GCP cloud infrastructure, custom AI agents, and Zero Trust cybersecurity auditing.',
                keywords: 'cloud devops, enterprise ai, web development, cybersecurity audit'
            }
        ];

        // --- 16. SETTINGS ---
        this.inMemoryData.settings = {
            company_name: 'Growth IT Solution Inc.',
            site_name: 'Growth IT Solution Inc.',
            logo: 'assets/logo.jpg',
            favicon: 'assets/logo.jpg',
            company_description: 'Growth IT Solution provides innovative software, web, mobile and digital solutions that help businesses grow faster, work smarter and operate more efficiently.',
            support_email: 'growthitsolution@gmail.com',
            contact_phone: '+1 (800) 555-GROW',
            office_address: '100 Enterprise Way, Suite 500, New York, NY 10001',
            business_hours: 'Mon - Fri: 9:00 AM - 6:00 PM EST',

            // Social Links
            social_facebook: 'https://facebook.com/growthitsolution',
            social_instagram: 'https://instagram.com/growthitsolution',
            social_linkedin: 'https://linkedin.com/company/growthitsolution',
            social_youtube: 'https://youtube.com/@growthitsolution',
            social_tiktok: 'https://tiktok.com/@growthitsolution',
            social_x: 'https://x.com/growthitsolution',

            // Footer Copyright & Info
            footer_copyright: '© 2026 Growth IT Solution Inc. All rights reserved.',
            footer_description: 'Growth IT Solution provides innovative software, web, mobile and digital solutions that help businesses grow faster, work smarter and operate more efficiently.',

            // Global SEO
            global_seo: {
                site_title: 'Growth IT Solution | Next-Gen Enterprise IT Engine & AI Solutions',
                meta_description: 'Growth IT Solution provides innovative software, web, mobile and digital solutions that help businesses grow faster, work smarter and operate more efficiently.',
                og_image: 'assets/hero_graphic.jpg',
                default_keywords: 'cloud devops, enterprise ai, web development, cybersecurity audit',
                google_verification: 'google-site-verification-code-12345'
            },

            // Homepage Content & Mobile Phone Demo Showcase
            hero_badge: 'Next-Gen Enterprise IT Engine & AI Solutions',
            hero_heading: 'Grow Your Business With Smart Technology',
            hero_description: 'Growth IT Solution provides innovative software, web, mobile and digital solutions that help businesses grow faster, work smarter and operate more efficiently.',
            hero_image: 'assets/hero_graphic.jpg',
            hero_video: 'https://res.cloudinary.com/hvil3kt2/video/upload/v1791551107/flow-edf2d753-6ac4-4a20-a2c5-.mp4',
            hero_cta_primary_label: 'Get Started',
            hero_cta_primary_url: '/contact',
            hero_cta_secondary_label: 'Explore Services',
            hero_cta_secondary_url: '/services',

            // 3D Phone Demo Showcase Settings
            hero_phone_demo_enabled: true,
            hero_phone_brand: 'Growth IT',
            hero_phone_growth_val: '$24,850.00',
            hero_phone_badge: 'LIVE DEMO',
            hero_phone_service1_title: 'Cloud DevOps',
            hero_phone_service1_status: '99.99% Uptime',
            hero_phone_service2_title: 'AI Engine',
            hero_phone_service2_status: 'Active',

            stats_projects: '150+',
            stats_clients: '98%',
            stats_uptime: '99.99%',
            stats_satisfaction: '24/7',

            why_choose_us: [
                { title: 'Enterprise Architecture', description: 'Built with microservices, zero-trust security and scalable cloud infrastructure.', icon: 'ShieldCheck' },
                { title: 'Cutting-Edge AI Models', description: 'Integrating modern LLMs and vector search RAG systems to automate enterprise data.', icon: 'Cpu' },
                { title: 'Dedicated Support', description: 'Round-the-clock engineering monitoring and proactive threat resolution.', icon: 'Clock' }
            ],

            process_steps: [
                { step: '01', title: 'Discovery & Audit', description: 'We analyze your current infrastructure, architecture and business goals.' },
                { step: '02', title: 'Strategy & Engineering', description: 'Our senior engineers architect a custom high-availability solution.' },
                { step: '03', title: 'Deployment & Scaling', description: 'We launch with zero downtime, continuous integration, and monitoring.' }
            ],

            cta_banner_title: 'Ready to Transform Your Technology Stack?',
            cta_banner_description: 'Partner with Growth IT Solution to build scalable cloud software and AI applications tailored for your growth.',
            cta_banner_button_label: 'Schedule a Consultation',
            cta_banner_button_url: '/contact'
        };

        // Log initial activity
        this.logActivity('System Seed Initialized', 'System', 'Phase 3 database initial state created.');

        console.log(`[DB] Phase 3 Seed data loaded successfully. SUPER_ADMIN created (${superAdminEmail})`);
    }

    // --- USER MANAGEMENT ---
    getUserByEmail(email) {
        if (!email) return null;
        const target = email.trim().toLowerCase();
        return this.inMemoryData.users.find(u => u.email.trim().toLowerCase() === target);
    }

    getUserById(id) {
        if (!id) return null;
        return this.inMemoryData.users.find(u => u.id === id);
    }

    getAllUsers() {
        return this.inMemoryData.users.map(u => ({
            id: u.id,
            full_name: u.full_name,
            email: u.email,
            role: u.role,
            status: u.status,
            created_at: u.created_at
        }));
    }

    createUser(userData) {
        const id = 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
        const newUser = {
            id,
            full_name: userData.full_name,
            email: userData.email.toLowerCase(),
            password_hash: userData.password_hash,
            role: userData.role || 'client',
            status: userData.status || 'active',
            created_at: new Date().toISOString()
        };
        this.inMemoryData.users.push(newUser);
        this.logActivity('User Created', 'Admin', `Created user ${newUser.email} with role ${newUser.role}`);
        return newUser;
    }

    updateUserPassword(userId, newPasswordHash) {
        const user = this.inMemoryData.users.find(u => u.id === userId);
        if (!user) return false;
        user.password_hash = newPasswordHash;
        user.updated_at = new Date().toISOString();
        this.deleteUserSessions(userId);
        this.logActivity('Password Changed', user.email, 'User changed their password.');
        return true;
    }

    // --- SESSION MANAGEMENT ---
    createSession(userId, ttlMs = 24 * 60 * 60 * 1000) {
        const token = crypto.randomBytes(32).toString('hex');
        const now = Date.now();
        const session = {
            id: token,
            user_id: userId,
            created_at: new Date(now).toISOString(),
            expires_at: new Date(now + ttlMs).toISOString()
        };
        this.inMemoryData.sessions.push(session);
        return session;
    }

    getSession(token) {
        if (!token) return null;
        const session = this.inMemoryData.sessions.find(s => s.id === token);
        if (!session) return null;

        if (Date.now() > new Date(session.expires_at).getTime()) {
            this.deleteSession(token);
            return null;
        }

        return session;
    }

    deleteSession(token) {
        const idx = this.inMemoryData.sessions.findIndex(s => s.id === token);
        if (idx !== -1) {
            this.inMemoryData.sessions.splice(idx, 1);
            return true;
        }
        return false;
    }

    deleteUserSessions(userId) {
        this.inMemoryData.sessions = this.inMemoryData.sessions.filter(s => s.user_id !== userId);
    }

    // --- GENERIC CRUD HELPERS ---
    getCollection(name) {
        return this.inMemoryData[name] || [];
    }

    addItem(collectionName, item) {
        const prefix = collectionName.substring(0, 3);
        item.id = item.id || `${prefix}-${Date.now().toString(36)}`;
        item.created_at = item.created_at || new Date().toISOString();
        this.inMemoryData[collectionName].unshift(item);
        this.logActivity(`Created ${collectionName} Item`, 'Admin', `Added ${item.title || item.name || item.id}`);
        return item;
    }

    updateItem(collectionName, id, updates) {
        const items = this.inMemoryData[collectionName] || [];
        const idx = items.findIndex(i => i.id === id);
        if (idx === -1) return null;
        items[idx] = Object.assign({}, items[idx], updates, { updated_at: new Date().toISOString() });
        this.logActivity(`Updated ${collectionName} Item`, 'Admin', `Updated ${id}`);
        return items[idx];
    }

    deleteItem(collectionName, id) {
        const items = this.inMemoryData[collectionName] || [];
        const idx = items.findIndex(i => i.id === id);
        if (idx !== -1) {
            const removed = items.splice(idx, 1);
            this.logActivity(`Deleted ${collectionName} Item`, 'Admin', `Deleted ${id}`);
            return removed[0];
        }
        return null;
    }

    // --- DASHBOARD REAL STATISTICS COMPUTATION ---
    getStats() {
        const portfolio = this.inMemoryData.portfolio_items || [];
        const services = this.inMemoryData.services || [];
        const blogs = this.inMemoryData.blogs || [];
        const messages = this.inMemoryData.contact_messages || [];
        const careers = this.inMemoryData.careers || [];
        const subscribers = this.inMemoryData.newsletter_subscribers || [];

        return {
            total_projects: portfolio.length,
            published_projects: portfolio.filter(p => p.status === 'published' || p.status === undefined).length,
            draft_projects: portfolio.filter(p => p.status === 'draft').length,
            total_services: services.length,
            total_blogs: blogs.length,
            total_messages: messages.length,
            unread_messages: messages.filter(m => m.status === 'unread').length,
            active_jobs: careers.filter(c => c.status === 'active').length,
            newsletter_subscribers: subscribers.length
        };
    }

    // --- PUBLIC API METHODS ---
    getServices() {
        return this.inMemoryData.services;
    }

    getWebsiteDemos(category) {
        if (!category || category === 'All') return this.inMemoryData.website_demos;
        return (this.inMemoryData.website_demos || []).filter(d => d.category === category);
    }

    getPortfolio(category) {
        if (!category) return this.inMemoryData.portfolio_items;
        return this.inMemoryData.portfolio_items.filter(p => p.category === category);
    }

    addInquiry(inquiry) {
        return this.addItem('inquiries', inquiry);
    }

    addContactMessage(contact) {
        return this.addItem('contact_messages', contact);
    }

    addSubscriber(email) {
        const subscriber = this.addItem('newsletter_subscribers', { email });
        return { message: 'Subscribed successfully', subscriber };
    }
}

module.exports = new DatabaseStore();
