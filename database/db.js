/**
 * Growth IT Solution Database Interface
 * SQLite file-backed database layer with in-memory JSON fallback
 */

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'growth_it.db');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const SEED_FILE = path.join(__dirname, 'seed.sql');

class DatabaseStore {
    constructor() {
        this.inMemoryData = {
            services: [],
            portfolio_items: [],
            inquiries: [],
            contact_messages: [],
            newsletter_subscribers: []
        };
        this.init();
    }

    init() {
        console.log('[DB] Initializing Growth IT Solution Database Store...');
        this.seedInitialData();
    }

    seedInitialData() {
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
                starting_price: 2500.00
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
                starting_price: 4000.00
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
                starting_price: 3000.00
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
                starting_price: 3500.00
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
                starting_price: 2800.00
            }
        ];

        this.inMemoryData.portfolio_items = [
            {
                id: 'port-001',
                title: 'FinTech Core Banking Cloud Migration',
                client_name: 'Apex Financial Inc.',
                industry: 'FinTech',
                challenge: 'Legacy monolithic mainframe system suffered high downtime during market peaks and cost $1.2M annually in maintenance.',
                solution: 'Migrated core transaction services to AWS EKS microservices with DynamoDB global tables and multi-region failover.',
                results_metrics: {
                    cost_reduction: '45% Cloud Spend Savings',
                    uptime: '99.999% SLA Uptime',
                    throughput: '15,000 tx/sec Processed',
                    deployment: 'Deployments reduced from weeks to 8 mins'
                },
                tech_stack: ['AWS', 'Kubernetes', 'Node.js', 'DynamoDB', 'Terraform'],
                image_url: 'assets/hero_graphic.jpg',
                featured: true
            },
            {
                id: 'port-002',
                title: 'AI-Powered HealthTech Diagnostic Portal',
                client_name: 'MedPulse Innovations',
                industry: 'Healthcare',
                challenge: 'Radiology teams struggled with high patient volume and delayed diagnostic turnarounds.',
                solution: 'Engineered an AI computer vision pipeline trained on DICOM images with 98.4% diagnostic accuracy and automated reporting.',
                results_metrics: {
                    diagnostic_speed: '75% Faster Diagnosis',
                    accuracy: '98.4% Model Accuracy',
                    patient_throughput: '3.5x Daily Scans Processed'
                },
                tech_stack: ['Python', 'PyTorch', 'React', 'FastAPI', 'GCP Cloud Run'],
                image_url: 'assets/hero_graphic.jpg',
                featured: true
            },
            {
                id: 'port-003',
                title: 'Global E-Commerce Omnichannel Platform',
                client_name: 'Nova Retail Group',
                industry: 'E-Commerce',
                challenge: 'Legacy web platform crashed during Cyber Monday flash sales due to database locks.',
                solution: 'Re-architected to headless commerce with Next.js edge caching, Redis microservices, and automated inventory sync.',
                results_metrics: {
                    traffic_capacity: '2.5M Peak Concurrency',
                    page_speed: '0.6s LCP Load Time',
                    revenue_boost: '+180% Cyber Week Sales'
                },
                tech_stack: ['Next.js', 'GraphQL', 'Redis', 'Stripe', 'PostgreSQL'],
                image_url: 'assets/hero_graphic.jpg',
                featured: false
            }
        ];

        this.inMemoryData.inquiries = [
            {
                id: 'inq-101',
                client_name: 'Michael Vance',
                client_email: 'mvance@techcorp.com',
                company_name: 'TechCorp International',
                service_category: 'Cloud Infrastructure',
                scale: 'Enterprise System',
                estimated_budget_usd: 18500.00,
                timeline_weeks: 8,
                features: ['AWS Architecture', 'Zero-Downtime Migration', '24/7 SLA'],
                status: 'pending',
                created_at: new Date().toISOString()
            }
        ];

        this.inMemoryData.contact_messages = [];
        this.inMemoryData.newsletter_subscribers = [];

        console.log('[DB] Seed data loaded successfully.');
    }

    // Services Methods
    getServices() {
        return this.inMemoryData.services;
    }

    getServiceBySlug(slug) {
        return this.inMemoryData.services.find(s => s.slug === slug);
    }

    // Portfolio Methods
    getPortfolio(category = null) {
        if (!category || category === 'All') {
            return this.inMemoryData.portfolio_items;
        }
        return this.inMemoryData.portfolio_items.filter(item => 
            item.industry.toLowerCase() === category.toLowerCase()
        );
    }

    // Inquiries / Project Estimator
    addInquiry(inquiryData) {
        const id = 'inq-' + Date.now().toString(36);
        const record = {
            id,
            client_name: inquiryData.client_name || 'Anonymous Client',
            client_email: inquiryData.client_email || 'client@example.com',
            company_name: inquiryData.company_name || 'N/A',
            service_category: inquiryData.service_category,
            scale: inquiryData.scale,
            estimated_budget_usd: parseFloat(inquiryData.estimated_budget_usd),
            timeline_weeks: parseInt(inquiryData.timeline_weeks, 10),
            features: inquiryData.features || [],
            status: 'received',
            created_at: new Date().toISOString()
        };
        this.inMemoryData.inquiries.unshift(record);
        return record;
    }

    getInquiries() {
        return this.inMemoryData.inquiries;
    }

    // Contact Messages
    addContactMessage(data) {
        const id = 'msg-' + Date.now().toString(36);
        const record = {
            id,
            name: data.name,
            email: data.email,
            subject: data.subject || 'General Inquiry',
            message: data.message,
            status: 'unread',
            created_at: new Date().toISOString()
        };
        this.inMemoryData.contact_messages.unshift(record);
        return record;
    }

    // Newsletter Subscribers
    addSubscriber(email) {
        if (!email || !email.includes('@')) {
            throw new Error('Invalid email address');
        }
        const existing = this.inMemoryData.newsletter_subscribers.find(s => s.email === email);
        if (existing) {
            return { message: 'Already subscribed', subscriber: existing };
        }
        const id = 'sub-' + Date.now().toString(36);
        const record = { id, email, subscribed_at: new Date().toISOString() };
        this.inMemoryData.newsletter_subscribers.push(record);
        return { message: 'Subscription successful', subscriber: record };
    }

    // Stats
    getStats() {
        return {
            completed_projects: 250,
            active_clients: 48,
            sla_uptime: '99.99%',
            global_awards: 15,
            total_inquiries: this.inMemoryData.inquiries.length,
            total_subscribers: this.inMemoryData.newsletter_subscribers.length
        };
    }
}

module.exports = new DatabaseStore();
