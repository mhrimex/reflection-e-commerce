
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
} catch (e) { console.error(e); }

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        encrypt: false,
        trustedConnection: true
    }
};

async function dump() {
    try {
        await sql.connect(config);

        // 1. Get Payments Columns
        const cols = await sql.query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Payments'
        `);

        // 2. Get CreateOrder Definition
        const sp = await sql.query(`
            SELECT OBJECT_DEFINITION(OBJECT_ID('CreateOrder')) AS Body
        `);

        const output = `
PAUMENTS COLUMNS:
${JSON.stringify(cols.recordset, null, 2)}

CREATEORDER SP:
${sp.recordset[0].Body}
        `;

        fs.writeFileSync('sp_dump.txt', output);
        console.log('Dumped to sp_dump.txt');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sql.close();
    }
}

dump();
