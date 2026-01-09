
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

        // Check Payments table
        const paymentsRes = await sql.query("SELECT * FROM Payments");
        console.log('Payments Table Content:', paymentsRes.recordset);

        // Check Orders table definition (conceptually, by trying to see nullable)
        console.log('Checking if PaymentID is nullable in Orders...');
        const schemaRes = await sql.query(`
            SELECT IS_NULLABLE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Orders' AND COLUMN_NAME = 'PaymentID'
        `);
        console.log('PaymentID Nullable:', schemaRes.recordset[0]);

    } catch (err) {
        console.error('DB Debug Error:', err);
    } finally {
        await sql.close();
    }
}

debug();
