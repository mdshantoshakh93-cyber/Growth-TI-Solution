require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const Service = require('../models/Service');
const Project = require('../models/Project');
const FAQ = require('../models/FAQ');
const PricingPlan = require('../models/PricingPlan');
const Testimonial = require('../models/Testimonial');
const BlogPost = require('../models/BlogPost');

const sampleServices = [
  {
    title: 'Cloud Architecture & DevOps [DEMO]',
    slug: 'cloud-devops-demo',
    category: 'Cloud Infrastructure',
    tagline: 'Sample multi-cloud architecture with automated CI/CD pipelines',
    description: 'Demonstration service for AWS, GCP, and Azure cloud infrastructure setup.',
    icon: 'Cloud',
    features: ['Demo Feature A', 'Demo Feature B', 'Demo Feature C'],
    startingPrice: 2500,
    isActive: true,
  },
  {
    title: 'Enterprise AI & Agentic Systems [DEMO]',
    slug: 'ai-agentic-demo',
    category: 'Artificial Intelligence',
    tagline: 'Sample RAG knowledge base & autonomous AI agent pipeline',
    description: 'Demonstration service for enterprise AI integrations and model fine-tuning.',
    icon: 'Cpu',
    features: ['Demo RAG Feature', 'Demo AI Workflow', 'Demo Model Monitoring'],
    startingPrice: 4000,
    isActive: true,
  },
];

const sampleProjects = [
  {
    title: 'FinTech Banking Cloud Migration [DEMO CASE STUDY]',
    slug: 'fintech-cloud-demo',
    client: 'Apex Global Financial (Sample Demo Client)',
    category: 'Cloud Infrastructure',
    summary: 'Sample cloud migration case study demonstrating 99.999% uptime.',
    description: 'Demonstration project detailing microservices migration and failover.',
    metrics: '45% Cost Reduction | 99.999% SLA Uptime [Sample Metric]',
    techStack: ['AWS', 'Kubernetes', 'Node.js', 'Terraform'],
    isFeatured: true,
  },
];

const sampleFAQs = [
  {
    question: 'How quickly can a solutions architect review our proposal? [DEMO]',
    answer: 'Sample answer: Senior Solutions Architects review inquiries within 2 business hours.',
    category: 'General',
    order: 1,
    isActive: true,
  },
];

const samplePricing = [
  {
    name: 'Growth Scale Plan [DEMO]',
    slug: 'growth-scale-demo',
    price: 3500,
    billingCycle: 'one-time',
    description: 'Sample pricing tier for growth-stage tech companies.',
    features: ['Full Architecture Audit', 'Automated CI/CD', '24/7 Monitoring'],
    isPopular: true,
  },
];

const sampleTestimonials = [
  {
    name: 'Alex Morgan [DEMO TESTIMONIAL]',
    role: 'VP of Engineering',
    company: 'Demo Tech Corp',
    quote: 'Sample testimonial: Growth IT Solution delivered exceptional cloud architecture.',
    rating: 5,
    isFeatured: true,
  },
];

const sampleBlogPosts = [
  {
    title: 'Building Zero-Downtime Multi-Cloud Kubernetes Clusters [DEMO ARTICLE]',
    slug: 'building-zero-downtime-k8s-demo',
    summary: 'Sample engineering article on high-availability Kubernetes cluster setup.',
    content: 'Demonstration technical blog content explaining cloud orchestration strategies.',
    author: 'Growth IT Engineering Team [DEMO]',
    category: 'Cloud Architecture',
    tags: ['Kubernetes', 'Cloud', 'DevOps'],
    status: 'published',
  },
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/growth_it_db';
  console.log(`🌱 [Seed Script] Connecting to MongoDB at ${uri}...`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB. Seeding sample development data...');

    await Service.deleteMany({ slug: /demo/i });
    await Project.deleteMany({ slug: /demo/i });
    await FAQ.deleteMany({ question: /demo/i });
    await PricingPlan.deleteMany({ slug: /demo/i });
    await Testimonial.deleteMany({ name: /demo/i });
    await BlogPost.deleteMany({ slug: /demo/i });

    await Service.insertMany(sampleServices);
    await Project.insertMany(sampleProjects);
    await FAQ.insertMany(sampleFAQs);
    await PricingPlan.insertMany(samplePricing);
    await Testimonial.insertMany(sampleTestimonials);
    await BlogPost.insertMany(sampleBlogPosts);

    console.log('🎉 Sample development data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.warn(`⚠️ [Seed Notice] MongoDB not reachable at ${uri} (${err.message}).`);
    console.warn('💡 Seed script exited gracefully. Ensure MongoDB daemon is running if you wish to populate local DB.');
    process.exit(0);
  }
}

seedDatabase();
