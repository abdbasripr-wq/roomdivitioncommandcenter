import { NextResponse } from 'next/server';

/**
 * Public health check endpoint
 * Used by deployment platforms and monitoring services
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Room Division Command Center',
    version: '1.0.0',
  });
}
