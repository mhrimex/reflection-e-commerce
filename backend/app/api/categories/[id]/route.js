import { NextResponse } from 'next/server';
import { sql, getConnection } from '@/db';
import { middleware } from '~/middleware/auth';

export async function PUT(request, { params }) {
    // await middleware(request);
    const { id } = await params;
    const { name } = await request.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('CategoryID', sql.Int, id)
            .input('Name', sql.NVarChar(100), name)
            .execute('UpdateCategory');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    // await middleware(request);
    const { id } = await params;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('CategoryID', sql.Int, id)
            .execute('DeleteCategory');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
