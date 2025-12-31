import { NextResponse } from 'next/server';

import { sql, getConnection } from '../../../src/db';
import { middleware } from '../../../middleware/auth';

export async function GET(request) {
  await middleware(request);
  const productId = request.query.get('productId');
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('ProductID', sql.Int, productId)
      .execute('GetReviewsByProductID');
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await middleware(request);
  const { userId, productId, rating, comment } = await request.json();
  try {
    const pool = await getConnection();
    await pool.request()
      .input('UserID', sql.Int, userId)
      .input('ProductID', sql.Int, productId)
      .input('Rating', sql.Int, rating)
      .input('Comment', sql.NVarChar(255), comment)
      .execute('AddReview');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
