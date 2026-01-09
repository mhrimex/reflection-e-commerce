
const fs = require('fs');
const path = require('path');
const sql = require('mssql/msnodesqlv8');

// Manually load .env
try {
    const envPath = path.resolve(__dirname, '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.error('Could not read .env file', e);
}

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        encrypt: false
    }
};

if (process.env.DB_TRUSTED_CONNECTION === 'true') {
    config.options.trustedConnection = true;
} else if (process.env.DB_USER && process.env.DB_PASSWORD) {
    config.user = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
}

async function applyFixes() {
    try {
        console.log('Connecting to database...', config.server, config.database);
        const pool = await sql.connect(config);
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
