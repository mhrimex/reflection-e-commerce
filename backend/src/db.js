import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sql = require('mssql/msnodesqlv8');
export { sql };


const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        encrypt: false // Set to false for local trusted connection
    }
};

// Use Windows Authentication (trusted connection) if specified
if (process.env.DB_TRUSTED_CONNECTION === 'true') {
    config.options.trustedConnection = true;
} else if (process.env.DB_USER && process.env.DB_PASSWORD) {
    config.user = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
}


export async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

// let pool;

// async function getConnection() {
//     if (!pool) {
//         pool = await sql.connect(config);
//     }
//     return pool;
// }

// module.exports = {
//     sql,
//     getConnection
// };
