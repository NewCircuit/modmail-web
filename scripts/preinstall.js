const fs = require('fs');
const path = require('path');

const BASE_DIR = process.cwd();

const npmrc = path.join(BASE_DIR, '.npmrc');

if (!fs.existsSync(npmrc)) {
    console.log('Creating initial environment file.');
    const defaultNpmrc = path.join(BASE_DIR, '.npmrc.default');

    fs.copyFileSync(defaultNpmrc, npmrc);
}
