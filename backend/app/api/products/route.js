import { NextResponse } from 'next/server';
import { sql, getConnection } from '@/db';
import { middleware } from '~/middleware/auth';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GetAllProducts');
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  // await middleware(request); // Disable for now
  const { name, description, price, categoryId, brandId, stock, imageUrl } = await request.json();
  try {
    const pool = await getConnection();
    await pool.request()
      .input('Name', sql.NVarChar(100), name)
      .input('Description', sql.NVarChar(255), description || null)
      .input('Price', sql.Decimal(18, 2), price)
      .input('CategoryID', sql.Int, categoryId ? Number(categoryId) : null)
      .input('BrandID', sql.Int, brandId ? Number(brandId) : null)
      .input('Stock', sql.Int, stock || 0)
      .input('ImageUrl', sql.NVarChar(255), imageUrl || null)
      .execute('CreateProduct');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
