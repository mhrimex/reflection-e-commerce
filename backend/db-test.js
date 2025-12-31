const sql = require('mssql/msnodesqlv8');
const fs = require('fs');
const path = require('path');

try {
    const envConfig = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.log('No .env file found');
}

const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'ECommerceDB',
    options: {
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        encrypt: false,
        trustedConnection: process.env.DB_TRUSTED_CONNECTION === 'true'
    }
};

console.log('Testing connection with config:', config);

async function testConnection() {
    try {
        await sql.connect(config);
        console.log('Connection successful!');

        const result = await sql.query`SELECT 1 as val`;
        console.log('Simple query result:', result.recordset);

        const spResult = await sql.query`SELECT name FROM sys.procedures WHERE name = 'GetAllProducts'`;
        console.log('Stored Procedure check:', spResult.recordset);

        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

testConnection();
