const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'ecommerce-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const backendEnv = `DB_SERVER=${config.database.server.toString().trim()}
DB_NAME=${config.database.name.toString().trim()}
DB_TRUSTED_CONNECTION=${config.database.options.trustedConnection}
DB_TRUST_SERVER_CERTIFICATE=${config.database.options.trustServerCertificate}
PORT=${config.ports.backend}
`;

const adminEnv = `PORT=${config.ports.admin}
REACT_APP_API_URL=http://localhost:${config.ports.backend}/api
`;

const customerEnv = `PORT=${config.ports.customer}
REACT_APP_API_URL=http://localhost:${config.ports.backend}/api
`;

function writeEnv(relativePath, content) {
    const filePath = path.join(__dirname, '..', relativePath, '.env');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

writeEnv('backend', backendEnv);
writeEnv('frontend/admin-dashboard', adminEnv);
writeEnv('frontend/customer-ui', customerEnv);

console.log('Configuration updated successfully!');
