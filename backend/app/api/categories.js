import { NextResponse } from 'next/server';

import { sql, getConnection } from '../../src/db';
import { middleware } from '../../../middleware/auth';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GetAllCategories');
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
