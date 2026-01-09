
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getConnection, sql } from '@/db';

export async function GET(request, { params }) {
    let resolvedType = 'unknown';
    try {
        const p = await params;
        resolvedType = p.type;
        const { searchParams } = request.nextUrl;
        const categoryId = searchParams.get('categoryId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        console.log(`[REPORTS] Request received - Type: ${resolvedType}, Category: ${categoryId}, Date: ${startDate} to ${endDate}`);

        const pool = await getConnection();

        let procedureName = '';
        let req = pool.request();

        // Helper to add input if value exists
        const addInt = (name, val) => { if (val) req.input(name, sql.Int, val); };
        const addDate = (name, val) => { if (val) req.input(name, sql.Date, val); };

        switch (resolvedType) {
            case 'overview':
                procedureName = 'GetReportStats';
                break;
            case 'stock':
                procedureName = 'GetStockReport';
                addInt('CategoryID', categoryId);
                break;
            case 'sales':
                procedureName = 'GetSalesReport';
                addInt('CategoryID', categoryId);
                addDate('StartDate', startDate);
                addDate('EndDate', endDate);
                break;
            default:
                return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
        }

        console.log(`[REPORTS] Executing SP: ${procedureName}`);
        const result = await req.execute(procedureName);
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
