
import { NextResponse } from 'next/server';
import { getConnection } from '@/db';

export async function GET(request, { params }) {
    let resolvedType = 'unknown';
    try {
        const p = await params;
        resolvedType = p.type;
        console.log(`[REPORTS] Request received for type: ${resolvedType}`);

        const pool = await getConnection();

        let procedureName = '';
        switch (resolvedType) {
            case 'overview': procedureName = 'GetReportStats'; break;
            case 'stock': procedureName = 'GetStockReport'; break;
            case 'sales': procedureName = 'GetSalesReport'; break;
            default:
                console.warn(`[REPORTS] Invalid type requested: ${resolvedType}`);
                return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
        }

        console.log(`[REPORTS] Executing SP: ${procedureName}`);
        const result = await pool.request().execute(procedureName);
        console.log(`[REPORTS] SP executed successfully. Result sets: ${result.recordsets.length}`);

        // Map recordsets based on report type
        let response = {};
        if (resolvedType === 'overview') {
            response = {
                metrics: result.recordsets[0][0] || {},
                recentOrders: result.recordsets[1] || []
            };
        } else if (resolvedType === 'stock') {
            response = {
                metrics: result.recordsets[0][0] || {},
                lowStock: result.recordsets[1] || [],
                byCategory: result.recordsets[2] || []
            };
        } else if (resolvedType === 'sales') {
            response = {
                topProducts: result.recordsets[0] || [],
                byCategory: result.recordsets[1] || [],
                dailyTrend: result.recordsets[2] || []
            };
        }

        console.log(`[REPORTS] Returning ${resolvedType} data package`);
        return NextResponse.json(response);
    } catch (error) {
        console.error(`[REPORTS] CRITICAL ERROR in Reports/[${resolvedType}]:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
