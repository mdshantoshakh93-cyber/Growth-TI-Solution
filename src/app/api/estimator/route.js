import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { category, scale, features = [] } = body;

    let baseCost = 3000;
    let baseDays = 14;

    if (category === 'Cloud Infrastructure') {
      baseCost = 3500;
      baseDays = 14;
    } else if (category === 'Artificial Intelligence') {
      baseCost = 4500;
      baseDays = 21;
    } else if (category === 'Security & Compliance') {
      baseCost = 4000;
      baseDays = 14;
    }

    let scaleMultiplier = 1.0;
    if (scale === 'Growth Scale') scaleMultiplier = 1.8;
    if (scale === 'Enterprise Multi-Region') scaleMultiplier = 3.2;

    const featureCost = features.length * 750;
    const featureDays = features.length * 3;

    const estimatedTotal = Math.round((baseCost * scaleMultiplier) + featureCost);
    const estimatedDurationDays = Math.round((baseDays * scaleMultiplier) + featureDays);

    const inquiryId = 'INQ-' + Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json({
      success: true,
      inquiryId,
      summary: {
        category: category || 'Web Development',
        scale: scale || 'Startup MVP',
        featuresCount: features.length,
        estimatedCostUSD: estimatedTotal,
        estimatedDurationDays,
        currency: 'USD',
        status: 'Proposal Ready',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 }
    );
  }
}
