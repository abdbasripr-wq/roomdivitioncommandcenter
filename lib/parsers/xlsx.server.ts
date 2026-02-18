import { readFile } from 'fs/promises';
import * as XLSX from 'xlsx';
import { ReportType, DataRow, ParseResult } from './types';
import { autoMapColumns, typeConverters } from './mappers';

/**
 * Server-only XLSX parser for Node.js runtime
 * This file should ONLY be imported in API routes with runtime='nodejs'
 */

/**
 * Simple UUID v4 generator
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Parse XLSX file from Buffer (Node.js runtime)
 * @param buffer - Raw file buffer
 * @param reportType - Type of report to parse
 * @returns Parsed and normalized data
 */
export async function parseXLSXBuffer(
  buffer: Buffer,
  reportType: ReportType
): Promise<ParseResult> {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return {
        success: false,
        error: 'No sheet found in workbook',
        data: [],
      };
    }

    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    if (!rawData || rawData.length === 0) {
      return {
        success: false,
        error: 'No data found in sheet',
        data: [],
      };
    }

    // Auto-map columns based on report type
    const columnMapping = autoMapColumns(rawData, reportType);

    // Normalize rows
    const rows: DataRow[] = rawData.map((row: any, rowNumber: number) => {
      const normalizedRow: DataRow = {
        _id: generateUUID(),
        _uploadId: '',
        _rowNumber: rowNumber + 1,
        _rawData: row,
      };

      // Apply column mappings
      Object.entries(columnMapping).forEach(([key, sourceColumn]) => {
        const value = row[sourceColumn as string];
        if (value !== undefined && value !== null) {
          // Convert value based on type
          const converter = typeConverters[key];
          const converted = converter ? converter(value) : value;
          (normalizedRow as any)[key] = converted;
        }
      });

      return normalizedRow;
    });

    return {
      success: true,
      data: rows,
      rowCount: rows.length,
      columns: Object.keys(rawData[0] || {}),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to parse XLSX file',
      data: [],
    };
  }
}
