/**
 * Client-safe parser module
 * Does NOT import xlsx - safe to use in browser and Edge runtime
 * XLSX parsing happens server-side in API routes
 */

import { ReportType, DataRow, ParseResult } from './types';

/**
 * Upload and parse XLSX file via API
 * This function sends the file to the server for parsing
 * @param file - File object from form input
 * @param reportType - Type of report
 * @param module - Module name
 * @returns Parsed result from server
 */
export async function parseXLSX(
  file: File,
  reportType: ReportType,
  module?: string
): Promise<ParseResult> {
  try {
    // Create form data with file and metadata
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportType', reportType);
    if (module) {
      formData.append('module', module);
    }

    // Get auth token from Firebase (if available)
    let headers: Record<string, string> = {};
    try {
      const { auth } = await import('@/lib/firebase/client');
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // Firebase not available or user not logged in
    }

    // Send to server for parsing
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error?.message || 'Upload failed',
        data: [],
      };
    }

    const result = await response.json();
    return result.data || {
      success: false,
      error: 'Invalid response from server',
      data: [],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to parse file',
      data: [],
    };
  }
}

/**
 * Report type constants for client-side use
 */
export const REPORT_TYPES = {
  FO: [
    'in-house-guest-list',
    'walk-in-guest-list',
    'room-revenue-breakdown',
    'payment-journal',
    'turnover-report',
    'summary-cashier',
    'nation-country',
    'compliment-guest-list',
  ],
  HK: [
    'cost-control-amenites',
    'cost-control-laundry',
    'guest-laundry',
  ],
} as const;
