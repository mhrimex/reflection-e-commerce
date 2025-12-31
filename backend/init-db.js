const sql = require('mssql/msnodesqlv8');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
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
        trustServerCertificate: true,
        encrypt: false,
        trustedConnection: true
    }
};

async function runScript(pool, scriptPath, splitByReq = false) {
    const content = fs.readFileSync(scriptPath, 'utf8');

    if (splitByReq) {
        // Simple splitter for CREATE PROCEDURE
        // Note: This is fragile but works for the provided file format
        const batches = content.split(/(?=CREATE PROCEDURE)/i).filter(b => b.trim().length > 0);

        for (const batch of batches) {
            try {
                // Check if proc exists to avoid error or drop it?
                // For now just try create, if fail assume exists or print error
                await pool.request().query(batch);
                console.log('Executed batch successfully.');
            } catch (err) {
                if (err.number === 2714) { // Object already exists
                    console.log('Object already exists, skipping.');
                    // Optional: ALTER PROCEDURE handling could go here
                } else {
                    console.error('Error executing batch:', err.message);
                }
            }
        }
    } else {
        // Tables can often be run in one go or split by GO if present.
        // Provided file has no GO. CREATE TABLE usually separate batches not strictly required but cleaner.
        // We'll try splitting by CREATE TABLE to be safe and handle errors individually.
        const batches = content.split(/(?=CREATE TABLE)/i).filter(b => b.trim().length > 0);
        for (const batch of batches) {
            try {
                await pool.request().query(batch);
                console.log('Executed table batch successfully.');
            } catch (err) {
                if (err.number === 2714) {
                    console.log('Table already exists, skipping.');
                } else {
                    console.error('Error executing table batch:', err.message);
                }
            }
        }

        // Also run indexes if any (they are at the end)
        // Actually splitting by CREATE TABLE might leave indexes attached to the last table chunk.
        // Let's rely on the split logic: the last chunk will contain indexes.
        // If the last chunk is solely indexes (unlikely with this split regex), it handles it.
        // If strict, we should run the whole file or parse better. 
        // Given the file structure, splitting by CREATE TABLE works for tables. 
        // Indexes at end will be part of last CREATE TABLE block? No.
        // "CREATE TABLE ... ; CREATE INDEX ..." is valid in one batch.
    }
}

async function init() {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to database.');

        const databaseDir = path.join(__dirname, '../database');

        console.log('Initializing Tables...');
        await runScript(pool, path.join(databaseDir, 'tables.sql'), false);

        console.log('Initializing Stored Procedures...');
        await runScript(pool, path.join(databaseDir, 'stored-procedures.sql'), true);

        console.log('Database initialization complete.');
        process.exit(0);
    } catch (err) {
        console.error('Initialization failed:', err);
        process.exit(1);
    }
}

init();
