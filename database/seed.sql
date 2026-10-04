-- Growth IT Solution Database Seed Data

INSERT INTO services (id, title, slug, category, icon, tagline, description, features_json, starting_price) VALUES
(
    'srv-001',
    'Cloud Architecture & DevOps',
    'cloud-devops',
    'Cloud Infrastructure',
    'cloud',
    'High-availability AWS, Azure & GCP cloud infrastructure with 99.99% uptime guarantees.',
    'We design, deploy, and manage multi-cloud infrastructure with Kubernetes orchestration, Terraform IaC, and automated CI/CD deployment pipelines.',
    '["Multi-Cloud Infrastructure (AWS/Azure/GCP)", "Kubernetes Orchestration & Helm Setup", "Terraform & Ansible Infrastructure as Code", "Zero-Downtime CI/CD Pipelines", "Cost Optimization & Cloud Governance"]',
    2500.00
),
(
    'srv-002',
    'Enterprise AI & Machine Learning',
    'ai-machine-learning',
    'Artificial Intelligence',
    'cpu',
    'Transform business operations with custom LLMs, predictive models, and intelligent workflows.',
    'From bespoke AI agents and RAG knowledge systems to real-time predictive analytics, we embed enterprise artificial intelligence directly into your core business.',
    '["Custom LLM Fine-Tuning & RAG Pipelines", "Predictive Analytics & Forecasting Models", "Computer Vision & OCR Automation", "Autonomous AI Agents & Chatbots", "MLOps & Model Lifecycle Monitoring"]',
    4000.00
),
(
    'srv-003',
    'Custom Web & Mobile Development',
    'web-mobile-dev',
    'Software Engineering',
    'code',
    'Ultra-fast, scalable web applications and native cross-platform mobile apps.',
    'End-to-end full-stack development using React, Next.js, Node.js, Python, and Flutter to engineer pixel-perfect, secure, and intuitive applications.',
    '["Modern React / Next.js & Vue Applications", "Scalable Microservices Backend Architecture", "iOS & Android Cross-Platform Mobile Apps", "GraphQL & RESTful API Engineering", "Performance Optimization & PWA Conversion"]',
    3000.00
),
(
    'srv-004',
    'Cybersecurity & Zero Trust Architecture',
    'cybersecurity',
    'Security & Compliance',
    'shield',
    'Bulletproof your digital assets with Zero Trust, penetration testing, and SOC compliance.',
    'Comprehensive security auditing, SOC2 / ISO27001 readiness, automated threat intelligence, and continuous vulnerability monitoring.',
    '["Penetration Testing & Security Audits", "Zero Trust Architecture Implementation", "SOC2 Type II & ISO 27001 Compliance", "Real-Time Intrusion Detection & SIEM", "Automated Encryption & Identity Management"]',
    3500.00
),
(
    'srv-005',
    'Data Engineering & Big Data Analytics',
    'data-engineering',
    'Data Analytics',
    'database',
    'Turn raw enterprise data into actionable real-time business intelligence.',
    'Build robust data lakes, real-time streaming pipelines with Kafka, BigQuery/Snowflake warehouses, and interactive BI dashboards.',
    '["Real-time Streaming Data Pipelines", "Snowflake & BigQuery Data Warehousing", "ETL / ELT Automation with dbt", "Custom PowerBI & Metabase Dashboards", "Data Quality Governance & Security"]',
    2800.00
);

INSERT INTO portfolio_items (id, title, client_name, industry, challenge, solution, results_metrics_json, tech_stack_json, image_url, featured) VALUES
(
    'port-001',
    'FinTech Core Banking Cloud Migration',
    'Apex Financial Inc.',
    'FinTech',
    'Legacy monolithic mainframe system suffered high downtime during market peaks and cost $1.2M annually in maintenance.',
    'Migrated core transaction services to AWS EKS microservices with DynamoDB global tables and multi-region failover.',
    '{"cost_reduction": "45% Cloud Spend Savings", "uptime": "99.999% SLA Uptime", "throughput": "15,000 tx/sec Processed", "deployment": "Deployments reduced from weeks to 8 mins"}',
    '["AWS", "Kubernetes", "Node.js", "DynamoDB", "Terraform"]',
    'assets/hero_graphic.jpg',
    TRUE
),
(
    'port-002',
    'AI-Powered HealthTech Diagnostic Portal',
    'MedPulse Innovations',
    'Healthcare',
    'Radiology teams struggled with high patient volume and delayed diagnostic turnarounds.',
    'Engineered an AI computer vision pipeline trained on DICOM images with 98.4% diagnostic accuracy and automated reporting.',
    '{"diagnostic_speed": "75% Faster Diagnosis", "accuracy": "98.4% Model Accuracy", "patient_throughput": "3.5x Daily Scans Processed"}',
    '["Python", "PyTorch", "React", "FastAPI", "GCP Cloud Run"]',
    'assets/hero_graphic.jpg',
    TRUE
),
(
    'port-003',
    'Global E-Commerce Omnichannel Platform',
    'Nova Retail Group',
    'E-Commerce',
    'Legacy web platform crashed during Cyber Monday flash sales due to database locks.',
    'Re-architected to headless commerce with Next.js edge caching, Redis microservices, and automated inventory sync.',
    '{"traffic_capacity": "2.5M Peak Concurrency", "page_speed": "0.6s LCP Load Time", "revenue_boost": "+180% Cyber Week Sales"}',
    '["Next.js", "GraphQL", "Redis", "Stripe", "PostgreSQL"]',
    'assets/hero_graphic.jpg',
    FALSE
);

INSERT INTO inquiries (id, client_name, client_email, company_name, service_category, scale, estimated_budget_usd, timeline_weeks, status) VALUES
(
    'inq-001',
    'Sarah Jenkins',
    'sarah@fintechlabs.io',
    'FinTech Labs',
    'Cloud Infrastructure',
    'Growth Scale',
    12500.00,
    6,
    'approved'
);
