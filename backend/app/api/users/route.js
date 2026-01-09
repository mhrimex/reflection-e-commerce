import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { sql, getConnection } from '@/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GetAllUsers');
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { username, password, email, roleId } = await request.json();
    if (!username || !password || !email || !roleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const pool = await getConnection();

    await pool.request()
      .input('Username', sql.NVarChar(100), username)
      .input('PasswordHash', sql.NVarChar(255), passwordHash)
      .input('Email', sql.NVarChar(100), email)
      .input('RoleID', sql.Int, roleId)
      .execute('InsertUser');

    return NextResponse.json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
