
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

async function debug() {
    try {
        await sql.connect(config);
        console.log('Connected to DB.');

        // Get latest order
        const orderRes = await sql.query("SELECT TOP 1 * FROM Orders ORDER BY OrderID DESC");
        const order = orderRes.recordset[0];

        if (!order) {
            console.log('No orders found.');
            return;
        }

        console.log('Latest Order:', order);

        // Check items
        const itemsRes = await sql.query(`SELECT * FROM OrderItems WHERE OrderID = ${order.OrderID}`);
        console.log('Raw Order Items from Table:', itemsRes.recordset);

        // Check GetOrderItems SP output
        const spRes = await sql.query(`EXEC GetOrderItems @OrderID = ${order.OrderID}`);
        console.log('SP GetOrderItems Output:', spRes.recordset);

    } catch (err) {
        console.error('DB Debug Error:', err);
    } finally {
        await sql.close();
    }
}

debug();
