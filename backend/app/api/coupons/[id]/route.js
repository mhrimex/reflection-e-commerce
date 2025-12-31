import { NextResponse } from 'next/server';
import { sql, getConnection } from '@/db';

export async function PUT(request, { params }) {
    const { id } = await params;
    const { code, discount, expiresAt } = await request.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('CouponID', sql.Int, id)
            .input('Code', sql.NVarChar(50), code)
            .input('Discount', sql.Decimal(5, 2), discount)
            .input('ExpiresAt', sql.DateTime, expiresAt)
            .execute('UpdateCoupon');
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
            .input('CouponID', sql.Int, id)
            .execute('DeleteCoupon');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
