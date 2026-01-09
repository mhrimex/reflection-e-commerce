import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { sql, getConnection } from '../../../src/db';
import { middleware } from '../../../middleware/auth';

export async function GET(request) {
  await middleware(request);
  const userId = request.user?.userId;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('GetWishlistByUserID');
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await middleware(request);
  const { userId, productId } = await request.json();
  try {
    const pool = await getConnection();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('ProductID', sql.Int, productId)
      .execute('AddToWishlist');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
