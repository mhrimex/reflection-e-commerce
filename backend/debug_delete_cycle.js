
const fs = require('fs');
const path = require('path');
const sql = require('mssql/msnodesqlv8');

try {
    const envPath = path.resolve(__dirname, '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) { }

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        encrypt: false,
        trustedConnection: true
    }
};

async function testDelete() {
    try {
        await sql.connect(config);
        console.log('Connected.');

        // 1. Create Dummy Order
        const insertRes = await sql.query(`
            INSERT INTO Orders (UserID, Total, Status, PaymentID)
            VALUES (NULL, 99.99, 'TestDelete', 1);
            SELECT SCOPE_IDENTITY() AS OrderID;
        `);
        const orderId = insertRes.recordset[0].OrderID;
        console.log(`Created Test Order: ${orderId}`);

        // 2. Add Item
        await sql.query(`
            INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price)
            VALUES (${orderId}, 1, 1, 10.00);
        `);
        console.log('Added Test Item.');

        // 3. Verify it exists
        const check1 = await sql.query(`SELECT * FROM Orders WHERE OrderID = ${orderId}`);
        if (check1.recordset.length === 0) throw new Error('Order not found after insert!');
        console.log('Order verified in DB.');

        // 4. Exec DeleteOrder SP
        console.log('Executing DeleteOrder SP...');
        await sql.query(`EXEC DeleteOrder @OrderID = ${orderId}`);

        // 5. Verify it is GONE
        const check2 = await sql.query(`SELECT * FROM Orders WHERE OrderID = ${orderId}`);
        if (check2.recordset.length === 0) {
            console.log('SUCCESS: Order is GONE from DB.');
        } else {
            console.error('FAILURE: Order STILL EXISTS in DB:', check2.recordset);
        }

    } catch (err) {
        console.error('Test Error:', err);
    } finally {
        await sql.close();
    }
}

testDelete();
