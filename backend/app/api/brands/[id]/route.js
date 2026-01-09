import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { sql, getConnection } from '@/db';

export async function PUT(request, { params }) {
    const { id } = await params;
    const { name } = await request.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('BrandID', sql.Int, id)
            .input('Name', sql.NVarChar(100), name)
            .execute('UpdateBrand');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('BrandID', sql.Int, id)
            .execute('DeleteBrand');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
