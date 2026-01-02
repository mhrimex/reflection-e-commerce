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
  try {
    const { name, icon } = await request.json();
    const pool = await getConnection();
    await pool.request()
      .input('Name', sql.NVarChar(100), name)
      .input('Icon', sql.NVarChar(100), icon || null)
      .execute('CreateCategory');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error in Categories POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
