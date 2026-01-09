
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

        // Check Payments Columns
        const schemaRes = await sql.query(`
            SELECT COLUMN_NAME, DATA_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Payments'
        `);
        console.log('Payments Columns:', schemaRes.recordset);

        // Check CreateOrder SP Definition
        const spRes = await sql.query(`
            SELECT OBJECT_DEFINITION(OBJECT_ID('CreateOrder')) AS Body
        `);
        console.log('CreateOrder Definition:', spRes.recordset[0].Body);

    } catch (err) {
        console.error('DB Debug Error:', err);
    } finally {
        await sql.close();
    }
}

debug();
