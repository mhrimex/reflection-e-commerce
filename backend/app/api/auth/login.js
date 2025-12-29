import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from 'mssql';

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
  const { username, password } = await request.json();
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT * FROM Users WHERE Username=${username} AND IsDeleted=0
    `;
    const user = result.recordset[0];
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }
    const valid = await bcrypt.compare(password, user.PasswordHash);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Invalid password.' }, { status: 401 });
    }
    const token = jwt.sign({ userId: user.UserID, roleId: user.RoleID }, 'your_jwt_secret', { expiresIn: '1h' });
    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
