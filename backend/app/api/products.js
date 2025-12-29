
import { NextResponse } from 'next/server';
import { sql, getConnection } from '../../src/db';
import { middleware } from '../../../middleware/auth';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GetAllProducts');
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await middleware(request);
  const { name, description, price, categoryId, brandId } = await request.json();
  try {
    const pool = await getConnection();
    await pool.request()
      .input('Name', sql.NVarChar(100), name)
      .input('Description', sql.NVarChar(255), description)
      .input('Price', sql.Decimal(18, 2), price)
      .input('CategoryID', sql.Int, categoryId)
      .input('BrandID', sql.Int, brandId)
      .execute('CreateProduct');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
