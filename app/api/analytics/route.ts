import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Analytics API endpoint
 * Query parameters:
 * - scope: 'global' | 'module' | 'topic'
 * - module: 'front-office' | 'housekeeping' | 'room-divition'
 * - topic: analytics topic name
 * - startDate: ISO date string
 * - endDate: ISO date string
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scope = searchParams.get('scope') || 'global';
    const module = searchParams.get('module');
    const topic = searchParams.get('topic');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Mock analytics data
    const analyticsData = {
      id: randomUUID(),
      scope,
      module,
      topic,
      period: { startDate, endDate },
      kpis: {
        occupancy: 87,
        revenue: 42530,
        adr: 215.50,
        revpar: 187.49,
      },
      trend: [
        { date: '2024-01-01', value: 82 },
        { date: '2024-01-02', value: 85 },
        { date: '2024-01-03', value: 84 },
        { date: '2024-01-04', value: 88 },
        { date: '2024-01-05', value: 87 },
      ],
      insights: [
        'Occupancy increased 3% compared to yesterday',
        'Revenue exceeded target by 12%',
        'ADR trend is stable',
      ],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      ok: true,
      data: analyticsData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'ANALYTICS_ERROR',
          message: 'Failed to fetch analytics',
        },
      },
      { status: 500 }
    );
  }
}
