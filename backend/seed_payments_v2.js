
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

async function seed() {
    try {
        await sql.connect(config);
        console.log('Connected.');

        // Check if exists
        const check = await sql.query("SELECT * FROM Payments WHERE PaymentID = 1");
        if (check.recordset.length > 0) {
            console.log('Payment ID 1 already exists.');
            return;
        }

        console.log('Seeding Placeholder Payment...');
        // Try with IDENTITY_INSERT
        try {
            await sql.query(`
                SET IDENTITY_INSERT Payments ON;
                INSERT INTO Payments (PaymentID, UserID, Amount, Method, PaidAt) 
                VALUES (1, NULL, 0.00, 'Placeholder', GETDATE());
                SET IDENTITY_INSERT Payments OFF;
            `);
            console.log('Seeded successfully with IDENTITY_INSERT.');
        } catch (e) {
            console.log('IDENTITY_INSERT failed or not needed, trying normal insert...');
            // Fallback if not identity
            await sql.query(`
                INSERT INTO Payments (UserID, Amount, Method, PaidAt) 
                VALUES (NULL, 0.00, 'Placeholder', GETDATE());
            `);
            console.log('Seeded successfully (Standard).');
        }

    } catch (err) {
        console.error('Seed Error:', err.message);
    } finally {
        await sql.close();
    }
}

seed();
