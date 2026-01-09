import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { sql, getConnection } from '../../../src/db';
import { middleware } from '../../../middleware/auth';

export async function GET(request) {
  await middleware(request);
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GetAllOrders');
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await middleware(request);
  const body = await request.json();
  const { userId, items, total, paymentId, status, shippingAddress } = body;
  try {
    const pool = await getConnection();

    // 1. Create Order
    const req = pool.request()
      .input('UserID', sql.Int, userId)
      .input('Total', sql.Decimal(18, 2), total);

    if (paymentId) req.input('PaymentID', sql.Int, paymentId);
    if (status) req.input('Status', sql.NVarChar(50), status);
    if (shippingAddress) req.input('ShippingAddress', sql.NVarChar(255), shippingAddress);

    console.log('Executing CreateOrder...');
    const orderResult = await req.execute('CreateOrder');
    console.log('CreateOrder Result:', JSON.stringify(orderResult));

    // Check if recordset exists and has data
    if (!orderResult.recordset || orderResult.recordset.length === 0) {
      throw new Error('CreateOrder did not return an OrderID. Check Stored Procedure.');
    }

    const orderId = orderResult.recordset[0].OrderID;
    console.log('Created OrderID:', orderId);

    // 2. Add Items
    if (items && items.length > 0) {
      for (const item of items) {
        console.log('Adding Item Payload:', JSON.stringify(item));
        if (!item.productId) console.error('MISSING PRODUCT ID for item:', item);
        await pool.request()
          .input('OrderID', sql.Int, orderId)
          .input('ProductID', sql.Int, item.productId)
          .input('Quantity', sql.Int, item.quantity)
          .input('Price', sql.Decimal(18, 2), item.price)
          .execute('AddOrderItem');
      }
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
