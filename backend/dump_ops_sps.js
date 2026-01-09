
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

        const sps = ['DeleteOrder', 'UpdateOrder', 'GetOrderItems', 'ClearOrderItems'];

        let output = '';

        for (const sp of sps) {
            try {
                const res = await sql.query(`SELECT OBJECT_DEFINITION(OBJECT_ID('${sp}')) AS Body`);
                output += `--- ${sp} ---\n${res.recordset[0].Body}\n\n`;
            } catch (e) {
                output += `--- ${sp} ---\nERROR: ${e.message}\n\n`;
            }
        }

        fs.writeFileSync('sps_dump.txt', output);
        console.log('Dumped to sps_dump.txt');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sql.close();
    }
}

dump();
