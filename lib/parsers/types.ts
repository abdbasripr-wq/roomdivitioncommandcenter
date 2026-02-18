/**
 * Type definitions for all report types
 * These define the canonical structure for parsed data
 */

export type ReportType =
  | 'in-house-guest-list'
  | 'walk-in-guest-list'
  | 'room-revenue-breakdown'
  | 'payment-journal'
  | 'turnover-report'
  | 'summary-cashier'
  | 'nation-country'
  | 'compliment-guest-list'
  | 'cost-control-amenites'
  | 'cost-control-laundry'
  | 'guest-laundry';

export type ModuleType = 'front-office' | 'housekeeping' | 'room-divition';

/**
 * Base upload metadata
 */
export interface UploadMetadata {
  id: string;
  uploadedAt: string;
  uploadedBy: string;
  module: ModuleType;
  reportType: ReportType;
  filename: string;
  rowCount: number;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

/**
 * Base row structure (all reports)
 */
export interface BaseRow {
  _id: string;
  _uploadId: string;
  _rowNumber: number;
  _rawData: Record<string, any>;
}

/**
 * In-House Guest List
 */
export interface InHouseGuestRow extends BaseRow {
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  roomRate: number;
  totalCharge: number;
  nationality: string;
  company?: string;
}

/**
 * Walk-in Guest List
 */
export interface WalkInGuestRow extends BaseRow {
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  roomRate: number;
  totalCharge: number;
}

/**
 * Room Revenue Breakdown
 */
export interface RoomRevenueRow extends BaseRow {
  date: string;
  roomType: string;
  rooms: number;
  rate: number;
  revenue: number;
  occupancy: number;
}

/**
 * Payment Journal
 */
export interface PaymentJournalRow extends BaseRow {
  date: string;
  paymentMethod: string;
  amount: number;
  user: string;
  description?: string;
}

/**
 * Turnover Report
 */
export interface TurnoverReportRow extends BaseRow {
  date: string;
  department: string;
  category: string;
  amount: number;
  cashier: string;
}

/**
 * Summary Cashier Report
 */
export interface SummaryCashierRow extends BaseRow {
  date: string;
  cashier: string;
  opening: number;
  closing: number;
  difference: number;
  status: string;
}

/**
 * Nation/Country Report
 */
export interface NationCountryRow extends BaseRow {
  nationality: string;
  guestCount: number;
  roomsOccupied: number;
  revenue: number;
}

/**
 * Compliment Guest List
 */
export interface ComplimentGuestRow extends BaseRow {
  guestName: string;
  roomNumber: string;
  complimentType: string;
  amount: number;
  date: string;
  authorizedBy: string;
}

/**
 * Cost Control - Amenities
 */
export interface CostControlAmenitiesRow extends BaseRow {
  date: string;
  amenityType: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

/**
 * Cost Control - Laundry
 */
export interface CostControlLaundryRow extends BaseRow {
  date: string;
  laundryType: string;
  pieces: number;
  costPerPiece: number;
  totalCost: number;
}

/**
 * Guest Laundry
 */
export interface GuestLaundryRow extends BaseRow {
  date: string;
  roomNumber: string;
  laundryItems: string;
  amount: number;
  chargedToRoom: boolean;
}

/**
 * Union type for all row types
 */
export type DataRow =
  | InHouseGuestRow
  | WalkInGuestRow
  | RoomRevenueRow
  | PaymentJournalRow
  | TurnoverReportRow
  | SummaryCashierRow
  | NationCountryRow
  | ComplimentGuestRow
  | CostControlAmenitiesRow
  | CostControlLaundryRow
  | GuestLaundryRow;

/**
 * Parser result
 */
export interface ParseResult {
  success: boolean;
  rowCount: number;
  rows: DataRow[];
  errors?: string[];
}
