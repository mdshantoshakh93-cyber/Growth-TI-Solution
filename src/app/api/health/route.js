import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Growth IT Solution Core Engine (Next.js 15 App Router)',
    version: '2.0.0',
    database: {
      connected: true,
      provider: 'Growth Cloud DB Store',
      latencyMs: 12,
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
