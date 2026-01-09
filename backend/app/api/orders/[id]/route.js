import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { sql, getConnection } from '../../../../src/db';
import { middleware } from '../../../../middleware/auth';

// PUT: Update an order
export async function PUT(request, { params }) {
    await middleware(request);
    const { id } = await params;
    const body = await request.json();
    const { total, status, paymentId, shippingAddress, items } = body;

    try {
        const pool = await getConnection();

        // 1. Update Order Details
        const req = pool.request()
            .input('OrderID', sql.Int, id)
            .input('Total', sql.Decimal(18, 2), total)
            .input('Status', sql.NVarChar(50), status);

        if (paymentId) req.input('PaymentID', sql.Int, paymentId);
        if (shippingAddress) req.input('ShippingAddress', sql.NVarChar(255), shippingAddress);

        await req.execute('UpdateOrder');

        // 2. Handle Items Update (if provided)
        // Strategy: Clear existing items and re-insert logic
        if (items) {
            // Clear old items
            await pool.request()
                .input('OrderID', sql.Int, id)
                .execute('ClearOrderItems');

            // Add new items
            if (items.length > 0) {
                for (const item of items) {
                    await pool.request()
                        .input('OrderID', sql.Int, id)
                        .input('ProductID', sql.Int, item.productId)
                        .input('Quantity', sql.Int, item.quantity)
                        .input('Price', sql.Decimal(18, 2), item.price)
                        .execute('AddOrderItem');
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Order updated successfully' });
    } catch (error) {
        console.error('Order Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET Items for an Order
export async function GET(request, { params }) {
    await middleware(request);
    const { id } = await params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('OrderID', sql.Int, id)
            .execute('GetOrderItems');

        // Map to simpler structure
        const items = result.recordset.map(item => ({
            id: item.OrderItemID,
            productId: item.ProductID,
            name: item.Name,
            quantity: item.Quantity,
            price: item.Price
        }));

        return NextResponse.json(items);
    } catch (error) {
        console.error('Get Order Items Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Delete an order
export async function DELETE(request, { params }) {
    await middleware(request);
    const { id } = await params;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('OrderID', sql.Int, id)
            .execute('DeleteOrder');

        return NextResponse.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Order Delete Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
