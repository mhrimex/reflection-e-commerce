import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sql, getConnection } from '../../../src/db';

export async function GET(request) {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const pool = await getConnection();
    const result = await pool.request()
      .input('UserID', sql.Int, decoded.userId)
      .execute('GetUserByID');
    const user = result.recordset[0];
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
