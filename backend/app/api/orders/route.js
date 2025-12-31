import { NextResponse } from 'next/server';

import { sql, getConnection } from '../../../src/db';
import { middleware } from '../../../middleware/auth';

export async function GET(request) {
  await middleware(request);
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GetAllOrders');
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await middleware(request);
  const { userId, items, total, paymentId } = await request.json();
  try {
    const pool = await getConnection();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('Total', sql.Decimal(18, 2), total)
      .input('PaymentID', sql.Int, paymentId)
      .execute('CreateOrder');
    // Add order items logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
