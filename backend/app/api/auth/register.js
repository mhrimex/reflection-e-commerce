import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from 'mssql';

// Example config - replace with your actual connection string
const dbConfig = {
  server: 'DEVELOPER8',
  database: 'ECommerceDB',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    encrypt: false,
  },
};

export async function POST(request) {
  const { username, password, email, roleId } = await request.json();
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await sql.connect(dbConfig);
    await sql.query`
      EXEC InsertUser @Username=${username}, @PasswordHash=${passwordHash}, @Email=${email}, @RoleID=${roleId}
    `;
    return NextResponse.json({ success: true, message: 'User registered.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
