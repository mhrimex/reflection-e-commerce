import { NextResponse } from 'next/server';

import { sql, getConnection } from '../../../src/db';
import { middleware } from '../../../middleware/auth';

export async function GET(request) {
  await middleware(request);
  const userId = request.user?.userId;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserID', sql.Int, userId)
      .execute('GetPaymentsByUserID');
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await middleware(request);
  const { userId, amount, method } = await request.json();
  try {
    const pool = await getConnection();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('Amount', sql.Decimal(18, 2), amount)
      .input('Method', sql.NVarChar(50), method)
      .execute('CreatePayment');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
