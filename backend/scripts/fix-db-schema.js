const sql = require('mssql/msnodesqlv8');
const fs = require('fs');
const path = require('path');

try {
    const envConfig = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
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
        trustServerCertificate: true,
        encrypt: false,
        trustedConnection: true
    }
};

async function migrate() {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to database.');

        // 1. Add Stock column if it doesn't exist
        console.log('Adding Stock column...');
        try {
            await pool.request().query("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Products') AND name = 'Stock') ALTER TABLE Products ADD Stock INT DEFAULT 0;");
            console.log('Stock column added or already exists.');
        } catch (err) {
            console.error('Error adding stock column:', err.message);
        }

        // 1b. Add ImageUrl column if it doesn't exist
        console.log('Adding ImageUrl column...');
        try {
            await pool.request().query("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Products') AND name = 'ImageUrl') ALTER TABLE Products ADD ImageUrl NVARCHAR(255);");
            console.log('ImageUrl column added or already exists.');
        } catch (err) {
            console.error('Error adding ImageUrl column:', err.message);
        }

        // 2. Drop and recreate procedures
        console.log('Refreshing Stored Procedures...');
        const spPath = path.join(__dirname, '../../database/stored-procedures.sql');
        const content = fs.readFileSync(spPath, 'utf8');
        const batches = content.split(/(?=CREATE PROCEDURE)/i).filter(b => b.trim().length > 0);

        for (const batch of batches) {
            // Extract procedure name
            const match = batch.match(/CREATE PROCEDURE (\w+)/i);
            if (match) {
                const spName = match[1];
                console.log(`Refreshing ${spName}...`);
                try {
                    await pool.request().query(`IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = '${spName}') DROP PROCEDURE ${spName}`);
                    await pool.request().query(batch);
                } catch (err) {
                    console.error(`Error refreshing ${spName}:`, err.message);
                }
            }
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
