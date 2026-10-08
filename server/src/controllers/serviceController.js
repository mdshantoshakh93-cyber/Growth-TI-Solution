const Service = require('../models/Service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const fallbackServices = [
  {
    title: 'Cloud Architecture & DevOps',
    slug: 'cloud-devops',
    category: 'Cloud Infrastructure',
    tagline: 'High-availability AWS, Azure & GCP cloud infrastructure with 99.99% uptime guarantees.',
    description: 'We design, deploy, and manage multi-cloud infrastructure with Kubernetes orchestration, Terraform IaC, and automated CI/CD deployment pipelines.',
    features: ['Multi-Cloud Infrastructure', 'Kubernetes & Helm Setup', 'Terraform IaC', 'Zero-Downtime CI/CD Pipelines'],
    startingPrice: 2500,
    isActive: true,
  },
  {
    title: 'Enterprise AI & Machine Learning',
    slug: 'ai-machine-learning',
    category: 'Artificial Intelligence',
    tagline: 'Transform business operations with custom LLMs, predictive models, and intelligent workflows.',
    description: 'From bespoke AI agents and RAG knowledge systems to real-time predictive analytics, we embed enterprise artificial intelligence directly into your core business.',
    features: ['Custom LLM Fine-Tuning & RAG', 'Predictive Analytics Models', 'Autonomous AI Agents', 'MLOps Lifecycle'],
    startingPrice: 4000,
    isActive: true,
  },
  {
    title: 'Custom Web & Mobile Development',
    slug: 'web-mobile-dev',
    category: 'Software Engineering',
    tagline: 'Ultra-fast, scalable web applications and native cross-platform mobile apps.',
    description: 'End-to-end full-stack development using React, Next.js, Node.js, Python, and Flutter to engineer pixel-perfect, secure, and intuitive applications.',
    features: ['Modern React & Next.js Apps', 'Scalable Microservices', 'iOS & Android Apps', 'GraphQL & RESTful API'],
    startingPrice: 3000,
    isActive: true,
  },
];

const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: 1 });
    return sendSuccess(res, services, 'Services retrieved successfully', 200, { total: services.length });
  } catch (err) {
    return sendSuccess(res, fallbackServices, 'Services retrieved (offline fallback mode)', 200, { total: fallbackServices.length, isFallback: true });
  }
};

const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (service) return sendSuccess(res, service, 'Service retrieved');
    const fallback = fallbackServices.find((s) => s.slug === req.params.slug);
    if (fallback) return sendSuccess(res, fallback, 'Service retrieved (fallback)');
    return sendError(res, 'Service not found', 404);
  } catch (err) {
    const fallback = fallbackServices.find((s) => s.slug === req.params.slug);
    if (fallback) return sendSuccess(res, fallback, 'Service retrieved (fallback)');
    return sendError(res, 'Service not found', 404);
  }
};

const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    return sendSuccess(res, service, 'Service created successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getServices, getServiceBySlug, createService };
