const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envDir = path.join(__dirname, '../src/environments');
const targetPath = path.join(envDir, 'environment.ts');

// ✅ Ensure the folder exists
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const envFileContent = `export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.NG_APP_FIREBASE_API_KEY}',
    authDomain: '${process.env.NG_APP_FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.NG_APP_FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.NG_APP_FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.NG_APP_FIREBASE_APP_ID}'
  }
};`;

fs.writeFileSync(targetPath, envFileContent);
console.log('✅ Environment.ts file generated successfully');