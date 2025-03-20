// Save configuration

const CONFIG_FILE = 'config.json';
const fs = require('fs');

let config = {};

try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    config = JSON.parse(data);
} catch (error) {
    // File might not exist or JSON might be invalid; start with an empty config.
    config = {};
}

function saveConfig() {
	try {
		fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
		console.log('Configuration saved');
	} catch (error) {
		console.error('Error saving configuration:', error);
	}
}

function getConfig() {
    return config;
}

module.exports = { saveConfig, fs, CONFIG_FILE, getConfig };