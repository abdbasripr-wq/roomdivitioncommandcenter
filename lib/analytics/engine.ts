import { DataRow } from '@/lib/parsers/types';

/**
 * Analytics metrics structure
 */
export interface AnalyticsMetrics {
  occupancy: {
    rooms: number;
    occupied: number;
    rate: number;
  };
  revenue: {
    total: number;
    average: number;
    change: number;
  };
  adr: number; // Average Daily Rate
  revpar: number; // Revenue Per Available Room
  guests: {
    total: number;
    average: number;
  };
  marketSegment: Record<string, number>;
  sourceOfBusiness: Record<string, number>;
  roomTypePerformance: Record<string, { revenue: number; occupancy: number }>;
  trend: Array<{ date: string; revenue: number; occupancy: number }>;
  alerts: Array<{ severity: 'low' | 'medium' | 'high'; message: string }>;
}

/**
 * Compute occupancy metrics from in-house and walk-in guests
 */
export function computeOccupancy(rows: DataRow[]): AnalyticsMetrics['occupancy'] {
  const totalRooms = parseInt(process.env.NEXT_PUBLIC_AVAILABLE_ROOMS_DEFAULT || '120');
  
  // Count unique room numbers from in-house and walk-in lists
  const occupiedRooms = new Set(
    rows
      .filter((row) => 'roomNumber' in row && row.roomNumber)
      .map((row) => (row as any).roomNumber)
  ).size;

  return {
    rooms: totalRooms,
    occupied: occupiedRooms,
    rate: (occupiedRooms / totalRooms) * 100,
  };
}

/**
 * Compute revenue metrics
 */
export function computeRevenue(rows: DataRow[]): AnalyticsMetrics['revenue'] {
  const revenues = rows
    .filter((row) => 'totalCharge' in row || 'revenue' in row)
    .map((row) => {
      if ('totalCharge' in row) return (row as any).totalCharge || 0;
      if ('revenue' in row) return (row as any).revenue || 0;
      return 0;
    });

  const total = revenues.reduce((sum, r) => sum + r, 0);
  const average = revenues.length > 0 ? total / revenues.length : 0;

  return {
    total,
    average,
    change: 0, // Would need historical data
  };
}

/**
 * Compute ADR (Average Daily Rate)
 */
export function computeADR(rows: DataRow[]): number {
  const rates = rows
    .filter((row) => 'roomRate' in row || 'rate' in row)
    .map((row) => {
      if ('roomRate' in row) return (row as any).roomRate || 0;
      if ('rate' in row) return (row as any).rate || 0;
      return 0;
    });

  if (rates.length === 0) return 0;
  return rates.reduce((sum, r) => sum + r, 0) / rates.length;
}

/**
 * Compute RevPAR (Revenue Per Available Room)
 */
export function computeRevPAR(
  totalRevenue: number,
  availableRooms: number
): number {
  if (availableRooms === 0) return 0;
  return totalRevenue / availableRooms;
}

/**
 * Compute market segment breakdown
 */
export function computeMarketSegment(
  rows: DataRow[]
): Record<string, number> {
  const segment: Record<string, number> = {};

  rows.forEach((row) => {
    if ('nationality' in row) {
      const nat = (row as any).nationality || 'Unknown';
      segment[nat] = (segment[nat] || 0) + 1;
    } else if ('company' in row) {
      const company = (row as any).company || 'Individual';
      segment[company] = (segment[company] || 0) + 1;
    }
  });

  return segment;
}

/**
 * Compute source of business breakdown
 */
export function computeSourceOfBusiness(
  rows: DataRow[]
): Record<string, number> {
  const source: Record<string, number> = {};

  rows.forEach((row) => {
    if ('paymentMethod' in row) {
      const method = (row as any).paymentMethod || 'Other';
      source[method] = (source[method] || 0) + 1;
    }
  });

  return source;
}

/**
 * Compute room type performance
 */
export function computeRoomTypePerformance(
  rows: DataRow[]
): Record<string, { revenue: number; occupancy: number }> {
  const performance: Record<string, { revenue: number; occupancy: number }> = {};

  rows.forEach((row) => {
    if ('roomType' in row) {
      const roomType = (row as any).roomType || 'Standard';
      if (!performance[roomType]) {
        performance[roomType] = { revenue: 0, occupancy: 0 };
      }
      
      if ('revenue' in row) {
        performance[roomType].revenue += (row as any).revenue || 0;
      } else if ('totalCharge' in row) {
        performance[roomType].revenue += (row as any).totalCharge || 0;
      }
      
      performance[roomType].occupancy += 1;
    }
  });

  return performance;
}

/**
 * Detect alerts based on thresholds
 */
export function detectAlerts(metrics: Partial<AnalyticsMetrics>): Array<{
  severity: 'low' | 'medium' | 'high';
  message: string;
}> {
  const alerts: Array<{ severity: 'low' | 'medium' | 'high'; message: string }> = [];

  if (metrics.occupancy && metrics.occupancy.rate < 50) {
    alerts.push({
      severity: 'high',
      message: `Low occupancy rate: ${metrics.occupancy.rate.toFixed(1)}%`,
    });
  }

  if (metrics.occupancy && metrics.occupancy.rate > 90) {
    alerts.push({
      severity: 'medium',
      message: `High occupancy rate: ${metrics.occupancy.rate.toFixed(1)}%`,
    });
  }

  if (metrics.revenue && metrics.revenue.total === 0) {
    alerts.push({
      severity: 'high',
      message: 'No revenue data recorded',
    });
  }

  return alerts;
}

/**
 * Compute all analytics metrics
 */
export function computeAnalytics(rows: DataRow[]): AnalyticsMetrics {
  const occupancy = computeOccupancy(rows);
  const revenue = computeRevenue(rows);
  const adr = computeADR(rows);
  const revpar = computeRevPAR(revenue.total, occupancy.rooms);
  const marketSegment = computeMarketSegment(rows);
  const sourceOfBusiness = computeSourceOfBusiness(rows);
  const roomTypePerformance = computeRoomTypePerformance(rows);

  const metrics: AnalyticsMetrics = {
    occupancy,
    revenue,
    adr,
    revpar,
    guests: {
      total: rows.length,
      average: rows.length > 0 ? rows.length / 1 : 0,
    },
    marketSegment,
    sourceOfBusiness,
    roomTypePerformance,
    trend: [],
    alerts: [],
  };

  metrics.alerts = detectAlerts(metrics);

  return metrics;
}
