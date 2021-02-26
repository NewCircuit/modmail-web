const { config } = require('dotenv');
const fs = require('fs');
const path = require('path');

const BASE_DIR = process.cwd();

function nextEnv() {
    const difference = {};
    const defaultEnv = config({ path: '.env.default' })?.parsed;
    const currentEnv = config({ path: '.env' })?.parsed;

    if (typeof defaultEnv === 'undefined' || typeof currentEnv === 'undefined')
        return null;

    Object.keys(defaultEnv).forEach((key) => {
        if (typeof currentEnv[key] === 'undefined') {
            difference[key] = defaultEnv[key];
        }
    });

    if (Object.keys(difference).length > 0) {
        Object.keys(difference).forEach((key) => {
            currentEnv[key] = difference[key];
        });
        return currentEnv;
    }
    return null;
}

function mapDotEnv() {
    const envFile = path.join(BASE_DIR, '.env');
    const defaultEnv = path.join(BASE_DIR, '.env.default');

    function map(args) {
        const lines = [];
        Object.keys(args).forEach((key) => {
            lines.push(`${key}=${args[key]}`);
        });
        return lines.join('\r\n');
    }

    if (!fs.existsSync(envFile) && fs.existsSync(defaultEnv)) {
        console.log('Creating .env file based on .env.default');
        fs.copyFileSync(defaultEnv, envFile);
    } else {
        const envToSave = nextEnv();
        if (envToSave) {
            console.log('Updating .env file based on .env.default');
            fs.writeFileSync(envFile, map(envToSave));
        }
    }
}

mapDotEnv();
