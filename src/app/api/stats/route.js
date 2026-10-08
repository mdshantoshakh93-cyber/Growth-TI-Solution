import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      completed_projects: 250,
      active_clients: 48,
      sla_uptime: '99.99%',
      global_awards: 15,
    },
  });
}
