import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { sql, getConnection } from '../../../src/db';
import { middleware } from '../../../middleware/auth';

export async function GET(request) {
  await middleware(request);
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GetAllCoupons');
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await middleware(request);
  const { code, discount, expiresAt } = await request.json();
  try {
    const pool = await getConnection();
    await pool.request()
      .input('Code', sql.NVarChar(50), code)
      .input('Discount', sql.Decimal(5, 2), discount)
      .input('ExpiresAt', sql.DateTime, expiresAt)
      .execute('CreateCoupon');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
