
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

// Ensure IDENTITY_INSERT is handled if you want specific IDs, but usually standard insert is fine if auto-increment
// But for Payments, having fixed IDs 1, 2, 3 is useful.
// Let's assume schema is (PaymentID INT IDENTITY PRIMARY KEY, Name ...)

async function seed() {
    try {
        await sql.connect(config);
        console.log('Connected to DB.');

        // Check if empty
        const countRes = await sql.query("SELECT COUNT(*) as count FROM Payments");
        if (countRes.recordset[0].count > 0) {
            console.log('Payments table already has data. Skipping seed.');
            const rows = await sql.query("SELECT * FROM Payments");
            console.log(rows.recordset);
            return;
        }

        console.log('Seeding Payments...');
        // Insert standard methods
        await sql.query("INSERT INTO Payments (Name) VALUES ('Credit Card')");
        await sql.query("INSERT INTO Payments (Name) VALUES ('PayPal')");
        await sql.query("INSERT INTO Payments (Name) VALUES ('Cash On Delivery')");

        console.log('Seeding complete.');

        const rows = await sql.query("SELECT * FROM Payments");
        console.log('New Content:', rows.recordset);

    } catch (err) {
        console.error('Seed Error:', err.message, err);
    } finally {
        await sql.close();
    }
}

seed();
