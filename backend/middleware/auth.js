import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided.' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    request.user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid token.' }, { status: 401 });
  }
}
