import { NextResponse } from 'next/server';

export async function POST(request) {
  // For JWT, logout is handled client-side by removing the token
  return NextResponse.json({ success: true, message: 'Logged out.' });
}
