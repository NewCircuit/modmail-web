const fs = require('fs');
const path = require('path');

const BASE_DIR = process.cwd();

const envFile = path.join(BASE_DIR, '.env');

if (!fs.existsSync(envFile)) {
    console.log('Creating initial environment file.');
    const defaultEnv = path.join(BASE_DIR, '.env.default');

    fs.copyFileSync(defaultEnv, envFile);
}
