import sql from 'mssql/msnodesqlv8';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'ECommerceDB',
    options: {
        trustServerCertificate: true,
        encrypt: false,
        trustedConnection: true
    }
};

async function test() {
    try {
        console.log('Testing connection with import...');
        const pool = await sql.connect(config);
        console.log('Connection successful!');
        const result = await pool.request().query('SELECT TOP 1 * FROM Products');
        console.log('Data:', result.recordset);
        await pool.close();
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

test();
