
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

async function apply() {
    try {
        await sql.connect(config);
        console.log('Connected to DB.');

        const query = `
        CREATE OR ALTER PROCEDURE UpdateOrder
            @OrderID INT,
            @Total DECIMAL(18,2), 
            @Status NVARCHAR(50),  
            @PaymentID INT = NULL,
            @ShippingAddress NVARCHAR(255) = NULL
        AS
        BEGIN
            UPDATE Orders 
            SET Total = @Total, 
                Status = @Status,
                PaymentID = @PaymentID, 
                ShippingAddress = @ShippingAddress
            WHERE OrderID = @OrderID;
        END
        `;

        await sql.query(query);
        console.log('UpdateOrder SP applied successfully.');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sql.close();
    }
}

apply();
