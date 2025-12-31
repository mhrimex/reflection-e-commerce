import { NextResponse } from 'next/server';
import { sql, getConnection } from '@/db';

export async function GET() {
  try {
    console.log('Attempting to fetch categories...');
    const pool = await getConnection();
    const result = await pool.request().execute('GetAllCategories');
    console.log('Categories fetched successfully');
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('API Error in Categories GET:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}

export async function POST(request) {
  await middleware(request);
  const { name } = await request.json();
  try {
    const pool = await getConnection();
    await pool.request()
      .input('Name', sql.NVarChar(100), name)
      .execute('CreateCategory');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
