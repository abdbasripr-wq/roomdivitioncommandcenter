import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken, readFromDatabase, writeToDatabase, updateDatabase, deleteFromDatabase } from '@/lib/firebase/admin';
import { randomUUID } from 'crypto';

// Disable prerendering for this route as it requires Firebase credentials
export const dynamic = 'force-dynamic';

/**
 * GET /api/room-divition/unexpected-costs
 * List unexpected costs
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { ok: false, error: { code: 'UNAUTHORIZED', message: 'No auth token' } },
        { status: 401 }
      );
    }

    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } },
        { status: 401 }
      );
    }

    const costs = await readFromDatabase('roomDivition/unexpectedCosts');

    return NextResponse.json({
      ok: true,
      data: costs ? Object.values(costs) : [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/room-divition/unexpected-costs
 * Create new unexpected cost
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { ok: false, error: { code: 'UNAUTHORIZED', message: 'No auth token' } },
        { status: 401 }
      );
    }

    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = randomUUID();

    const costData = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
      createdBy: decodedToken.uid,
    };

    await writeToDatabase(`roomDivition/unexpectedCosts/${id}`, costData);

    return NextResponse.json({
      ok: true,
      data: costData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/room-divition/unexpected-costs/[id]
 * Update unexpected cost
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { ok: false, error: { code: 'UNAUTHORIZED', message: 'No auth token' } },
        { status: 401 }
      );
    }

    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = params.id;

    await updateDatabase(`roomDivition/unexpectedCosts/${id}`, {
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: decodedToken.uid,
    });

    return NextResponse.json({
      ok: true,
      data: { id, ...body },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/room-divition/unexpected-costs/[id]
 * Delete unexpected cost
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { ok: false, error: { code: 'UNAUTHORIZED', message: 'No auth token' } },
        { status: 401 }
      );
    }

    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { ok: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } },
        { status: 401 }
      );
    }

    const id = params.id;
    await deleteFromDatabase(`roomDivition/unexpectedCosts/${id}`);

    return NextResponse.json({
      ok: true,
      data: { id },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
