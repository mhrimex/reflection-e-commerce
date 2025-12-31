import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql, getConnection } from '@/db';

export async function POST(request) {
  const { username, password, email, roleId } = await request.json();
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const pool = await getConnection();
    await pool.request()
      .input('Username', sql.NVarChar(100), username)
      .input('PasswordHash', sql.NVarChar(255), passwordHash)
      .input('Email', sql.NVarChar(100), email)
      .input('RoleID', sql.Int, roleId)
      .execute('InsertUser');
    return NextResponse.json({ success: true, message: 'User registered.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
