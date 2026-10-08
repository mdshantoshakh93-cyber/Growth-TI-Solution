import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const ticketId = 'TICK-' + Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Thank you for reaching out! A Senior Solutions Architect will contact you within 2 hours.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit consultation request.' },
      { status: 500 }
    );
  }
}
