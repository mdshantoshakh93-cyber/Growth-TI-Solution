import { NextResponse } from 'next/server';

const servicesData = [
  {
    id: 'cloud-devops',
    title: 'Cloud Architecture & DevOps',
    category: 'Cloud',
    description: 'High-availability AWS, Azure & GCP multi-cloud infrastructure with 99.99% SLA uptime guarantees.',
    icon: 'Cloud',
    features: ['Multi-Cloud Infrastructure (AWS/Azure/GCP)', 'Kubernetes Orchestration & Helm Setup', 'Terraform & Ansible Infrastructure as Code', 'Zero-Downtime CI/CD Pipelines'],
    startingPrice: '$2,500',
  },
  {
    id: 'ai-agents',
    title: 'Enterprise AI & Machine Learning',
    category: 'AI / ML',
    description: 'Transform enterprise operations with custom LLMs, RAG knowledge systems, and autonomous agentic workflows.',
    icon: 'Cpu',
    features: ['Custom LLM Fine-Tuning & RAG Pipelines', 'Predictive Analytics & Forecasting Models', 'Autonomous AI Agents & Chatbots', 'MLOps & Model Lifecycle Monitoring'],
    startingPrice: '$4,000',
  },
  {
    id: 'fullstack-web',
    title: 'Custom Web & Mobile Development',
    category: 'Web Development',
    description: 'Ultra-fast Next.js 15, React, and Node.js enterprise platforms with pixel-perfect responsive UX.',
    icon: 'Globe',
    features: ['Modern React & Next.js App Architecture', 'Scalable Microservices Backend', 'iOS & Android Cross-Platform Mobile Apps', 'Performance Optimization & SEO'],
    startingPrice: '$3,000',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Zero Trust Architecture',
    category: 'Security',
    description: 'Bulletproof digital assets with Zero Trust, penetration testing, SOC2 compliance, and continuous threat monitoring.',
    icon: 'ShieldCheck',
    features: ['Penetration Testing & Security Audits', 'Zero Trust Architecture Implementation', 'SOC2 Type II & ISO 27001 Compliance', 'Real-Time Intrusion Detection'],
    startingPrice: '$3,500',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    total: servicesData.length,
    data: servicesData,
  });
}
