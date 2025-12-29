import { NextResponse } from 'next/server';
import { getConnection } from '../../../src/db';

export async function GET() {
  try {
    const pool = await getConnection();
    // Simple query to test connection
    const result = await pool.request().query('SELECT 1 AS test');
    return NextResponse.json({ success: true, result: result.recordset });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
