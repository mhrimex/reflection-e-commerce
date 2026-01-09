
import dotenv from 'dotenv';
import { getConnection, sql } from './src/db.js';

dotenv.config();

async function applyFixes() {
    try {
        console.log('Connecting to database...');
        const pool = await getConnection();
        console.log('Connected.');

        // 1. GetOrderItems Fix
        const getItemsSql = `
        IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetOrderItems')
        DROP PROCEDURE GetOrderItems;
        `;
        await pool.request().query(getItemsSql);

        const createGetItemsSql = `
        CREATE PROCEDURE GetOrderItems
            @OrderID INT
        AS
        BEGIN
            SET NOCOUNT ON;
            SELECT 
                oi.OrderItemID,
                oi.ProductID,
                p.Name,
                oi.Quantity,
                oi.Price
            FROM OrderItems oi
            LEFT JOIN Products p ON oi.ProductID = p.ProductID 
            WHERE oi.OrderID = @OrderID;
        END
        `;
        await pool.request().query(createGetItemsSql);
        console.log('Fixed GetOrderItems SP.');

        // 2. DeleteOrder Fix
        const deleteOrderSql = `
        IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'DeleteOrder')
        DROP PROCEDURE DeleteOrder;
        `;
        await pool.request().query(deleteOrderSql);

        const createDeleteOrderSql = `
        CREATE PROCEDURE DeleteOrder
            @OrderID INT
        AS
        BEGIN
            SET NOCOUNT ON;
            DELETE FROM OrderItems WHERE OrderID = @OrderID;
            DELETE FROM Orders WHERE OrderID = @OrderID;
        END
        `;
        await pool.request().query(createDeleteOrderSql);
        console.log('Fixed DeleteOrder SP.');

        process.exit(0);
    } catch (err) {
        console.error('Error applying fixes:', err);
        process.exit(1);
    }
}

applyFixes();
