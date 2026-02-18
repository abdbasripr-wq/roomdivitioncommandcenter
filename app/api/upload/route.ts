import { NextRequest, NextResponse } from 'next/server';
import { writeToDatabase, verifyIdToken } from '@/lib/firebase/admin';
import { parseXLSXBuffer } from '@/lib/parsers/xlsx.server';

// Use Node.js runtime for XLSX parsing
export const runtime = 'nodejs';

// Disable prerendering for this route as it requires Firebase credentials
export const dynamic = 'force-dynamic';

/**
 * POST /api/upload
 * Upload and parse XLSX file
 * 
 * Request:
 * - FormData with 'file' field
 * - Query params: module, reportType
 * 
 * Returns:
 * {
 *   ok: true,
 *   data: {
 *     uploadId: string,
 *     rowCount: number,
 *     status: 'processing'
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { ok: false, error: { code: 'UNAUTHORIZED', message: 'No auth token provided' } },
        { status: 401 }
      );
    }

    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_TOKEN', message: 'Invalid auth token' } },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const module = formData.get('module') as string;
    const reportType = formData.get('reportType') as string;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: { code: 'NO_FILE', message: 'No file provided' } },
        { status: 400 }
      );
    }

    if (!module || !reportType) {
      return NextResponse.json(
        { ok: false, error: { code: 'MISSING_PARAMS', message: 'Missing module or reportType' } },
        { status: 400 }
      );
    }

    const uploadId = `upload-${Date.now()}`;

    try {
      // Parse XLSX server-side using Node.js runtime
      const buffer = await file.arrayBuffer();
      const parseResult = await parseXLSXBuffer(
        Buffer.from(buffer),
        reportType as any
      );

      if (!parseResult.success) {
        return NextResponse.json(
          { ok: false, error: { code: 'PARSE_ERROR', message: parseResult.error } },
          { status: 400 }
        );
      }

      // Store metadata in Firebase
      await writeToDatabase(`uploads/${uploadId}`, {
        id: uploadId,
        uploadedAt: new Date().toISOString(),
        uploadedBy: decodedToken.uid,
        module,
        reportType,
        filename: file.name,
        rowCount: parseResult.rowCount || 0,
        status: 'completed',
        columns: parseResult.columns || [],
      });

      // Store parsed rows in Firebase
      if (parseResult.data && parseResult.data.length > 0) {
        const rowsPath = `uploads/${uploadId}/rows`;
        for (let i = 0; i < parseResult.data.length; i += 100) {
          const batch = parseResult.data.slice(i, i + 100);
          const rowsData: Record<string, any> = {};
          batch.forEach((row, idx) => {
            rowsData[`${i + idx}`] = row;
          });
          await writeToDatabase(`${rowsPath}`, rowsData);
        }
      }

      return NextResponse.json({
        ok: true,
        data: {
          uploadId,
          status: 'completed',
          rowCount: parseResult.rowCount || 0,
        },
      });
    } catch (parseError: any) {
      // Log parse error but still store metadata
      console.error('[API] Parse error:', parseError);
      await writeToDatabase(`uploads/${uploadId}`, {
        id: uploadId,
        uploadedAt: new Date().toISOString(),
        uploadedBy: decodedToken.uid,
        module,
        reportType,
        filename: file.name,
        rowCount: 0,
        status: 'error',
        error: parseError.message,
      });

      return NextResponse.json({
        ok: false,
        error: { code: 'PARSE_ERROR', message: parseError.message || 'Failed to parse file' },
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('[API] Upload error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: error.message || 'Failed to process upload',
        },
      },
      { status: 500 }
    );
  }
}
