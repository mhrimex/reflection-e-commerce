import { NextResponse } from 'next/server';
import { sql, getConnection } from '@/db';
import { middleware } from '~/middleware/auth';

export async function PUT(request, { params }) {
    // await middleware(request); // Disable for now to fix "Failed to fetch" if no token
    const { id } = await params;
    const { name, description, price, categoryId, brandId, stock, imageUrl } = await request.json();
    try {
        console.log(`Updating product ${id} with:`, { name, price, stock, categoryId, brandId });
        const pool = await getConnection();
        await pool.request()
            .input('ProductID', sql.Int, Number(id))
            .input('Name', sql.NVarChar(100), name)
            .input('Description', sql.NVarChar(255), description || null)
            .input('Price', sql.Decimal(18, 2), price)
            .input('CategoryID', sql.Int, categoryId ? Number(categoryId) : null)
            .input('BrandID', sql.Int, brandId ? Number(brandId) : null)
            .input('Stock', sql.Int, Number(stock) || 0)
            .input('ImageUrl', sql.NVarChar(255), imageUrl || null)
            .execute('UpdateProduct');
        console.log('UpdateProduct executed successfully');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('UpdateProduct Failed:', error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await middleware(request);
    const { id } = await params;
    try {
        console.log(`Deleting product ${id}`);
        const pool = await getConnection();
        await pool.request()
            .input('ProductID', sql.Int, Number(id))
            .execute('DeleteProduct');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DeleteProduct Failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
