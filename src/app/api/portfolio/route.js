import { NextResponse } from 'next/server';

const portfolioData = [
  {
    id: 'port-001',
    title: 'FinTech Core Banking Cloud Migration',
    client: 'Apex Financial Inc.',
    category: 'Cloud',
    metrics: '45% Cost Reduction | 99.999% SLA Uptime',
    description: 'Migrated core transaction services to AWS EKS microservices with DynamoDB global tables and multi-region failover.',
    techStack: ['AWS', 'Kubernetes', 'Node.js', 'DynamoDB', 'Terraform'],
  },
  {
    id: 'port-002',
    title: 'AI-Powered HealthTech Diagnostic Portal',
    client: 'MedPulse Innovations',
    category: 'AI / ML',
    metrics: '75% Faster Diagnosis | 98.4% Accuracy',
    description: 'Engineered an AI computer vision pipeline trained on DICOM images with automated triaging for hospital radiology teams.',
    techStack: ['Python', 'PyTorch', 'React', 'FastAPI', 'GCP Cloud Run'],
  },
  {
    id: 'port-003',
    title: 'Global E-Commerce Omnichannel Platform',
    client: 'Nova Retail Group',
    category: 'Web Development',
    metrics: '2.5M Peak Concurrency | +180% Sales Growth',
    description: 'Re-architected monolithic storefront into headless commerce with Next.js edge caching and automated inventory sync.',
    techStack: ['Next.js 15', 'GraphQL', 'Redis', 'Stripe', 'PostgreSQL'],
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryFilter = searchParams.get('category');

  let filtered = portfolioData;
  if (categoryFilter && categoryFilter !== 'All') {
    filtered = portfolioData.filter((item) => item.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
}
