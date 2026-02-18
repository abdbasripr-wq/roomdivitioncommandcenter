import { ReportType } from './types';

/**
 * Maps raw column headers to canonical field names
 * Handles variations in naming conventions
 */
export const columnMappers: Record<ReportType, Record<string, string>> = {
  'in-house-guest-list': {
    'Guest Name': 'guestName',
    'Name': 'guestName',
    'Room No': 'roomNumber',
    'Room Number': 'roomNumber',
    'Room': 'roomNumber',
    'Check In': 'checkInDate',
    'Check In Date': 'checkInDate',
    'Arrival': 'checkInDate',
    'Check Out': 'checkOutDate',
    'Check Out Date': 'checkOutDate',
    'Departure': 'checkOutDate',
    'Nights': 'nights',
    'No. Of Nights': 'nights',
    'Rate': 'roomRate',
    'Room Rate': 'roomRate',
    'Total': 'totalCharge',
    'Total Charge': 'totalCharge',
    'Nationality': 'nationality',
    'Nation': 'nationality',
    'Country': 'nationality',
    'Company': 'company',
  },
  'walk-in-guest-list': {
    'Guest Name': 'guestName',
    'Name': 'guestName',
    'Room No': 'roomNumber',
    'Room Number': 'roomNumber',
    'Check In': 'checkInDate',
    'Check In Date': 'checkInDate',
    'Check Out': 'checkOutDate',
    'Check Out Date': 'checkOutDate',
    'Room Type': 'roomType',
    'Type': 'roomType',
    'Rate': 'roomRate',
    'Total': 'totalCharge',
    'Total Charge': 'totalCharge',
  },
  'room-revenue-breakdown': {
    'Date': 'date',
    'Room Type': 'roomType',
    'Type': 'roomType',
    'Rooms': 'rooms',
    'No. of Rooms': 'rooms',
    'Rate': 'rate',
    'Room Rate': 'rate',
    'Revenue': 'revenue',
    'Total Revenue': 'revenue',
    'Occupancy': 'occupancy',
    'Occupied Rooms': 'occupancy',
  },
  'payment-journal': {
    'Date': 'date',
    'Payment Method': 'paymentMethod',
    'Method': 'paymentMethod',
    'Amount': 'amount',
    'User': 'user',
    'Cashier': 'user',
    'Description': 'description',
    'Notes': 'description',
  },
  'turnover-report': {
    'Date': 'date',
    'Department': 'department',
    'Dept': 'department',
    'Category': 'category',
    'Amount': 'amount',
    'Cashier': 'cashier',
    'User': 'cashier',
  },
  'summary-cashier': {
    'Date': 'date',
    'Cashier': 'cashier',
    'Name': 'cashier',
    'Opening': 'opening',
    'Opening Balance': 'opening',
    'Closing': 'closing',
    'Closing Balance': 'closing',
    'Difference': 'difference',
    'Variance': 'difference',
    'Status': 'status',
  },
  'nation-country': {
    'Nationality': 'nationality',
    'Nation': 'nationality',
    'Country': 'nationality',
    'Guest Count': 'guestCount',
    'No. of Guests': 'guestCount',
    'Rooms': 'roomsOccupied',
    'Rooms Occupied': 'roomsOccupied',
    'Revenue': 'revenue',
    'Total Revenue': 'revenue',
  },
  'compliment-guest-list': {
    'Guest Name': 'guestName',
    'Name': 'guestName',
    'Room No': 'roomNumber',
    'Room Number': 'roomNumber',
    'Compliment Type': 'complimentType',
    'Type': 'complimentType',
    'Amount': 'amount',
    'Date': 'date',
    'Authorized By': 'authorizedBy',
    'Approved By': 'authorizedBy',
  },
  'cost-control-amenites': {
    'Date': 'date',
    'Amenity Type': 'amenityType',
    'Type': 'amenityType',
    'Quantity': 'quantity',
    'Qty': 'quantity',
    'Unit Cost': 'unitCost',
    'Cost per Unit': 'unitCost',
    'Total Cost': 'totalCost',
    'Total': 'totalCost',
  },
  'cost-control-laundry': {
    'Date': 'date',
    'Laundry Type': 'laundryType',
    'Type': 'laundryType',
    'Pieces': 'pieces',
    'No. of Pieces': 'pieces',
    'Cost per Piece': 'costPerPiece',
    'Unit Cost': 'costPerPiece',
    'Total Cost': 'totalCost',
    'Total': 'totalCost',
  },
  'guest-laundry': {
    'Date': 'date',
    'Room No': 'roomNumber',
    'Room Number': 'roomNumber',
    'Laundry Items': 'laundryItems',
    'Items': 'laundryItems',
    'Amount': 'amount',
    'Charged to Room': 'chargedToRoom',
    'Room Charge': 'chargedToRoom',
  },
};

/**
 * Auto-detect column mapping from headers
 * Tries to find best match with fuzzy matching
 */
export function autoMapColumns(
  headers: string[],
  reportType: ReportType
): Record<string, string> {
  const mapper = columnMappers[reportType] || {};
  const result: Record<string, string> = {};

  headers.forEach((header) => {
    const trimmed = header.trim();
    // Exact match first
    if (mapper[trimmed]) {
      result[trimmed] = mapper[trimmed];
    } else {
      // Try case-insensitive match
      const lowerHeader = trimmed.toLowerCase();
      const match = Object.entries(mapper).find(
        ([key]) => key.toLowerCase() === lowerHeader
      );
      if (match) {
        result[trimmed] = match[1];
      }
    }
  });

  return result;
}

/**
 * Safe type conversion utilities
 */
export const typeConverters = {
  toNumber: (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/,/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  },

  toDate: (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString().split('T')[0];
    return '';
  },

  toString: (value: any): string => {
    if (!value) return '';
    return String(value).trim();
  },

  toBoolean: (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['yes', 'true', '1', 'y'].includes(value.toLowerCase());
    }
    return false;
  },
};
