const { REST, Routes } = require('discord.js');
const fs = require('fs');

// Load configuration
let config = {};
try {
  config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
} catch (error) {
  console.error('Error loading configuration:', error);
  console.log('Please make sure config.json exists with token and clientId fields');
  process.exit(1);
}

// Check for required configuration
if (!config.token) {
  console.error('Bot token not found in config.json');
  process.exit(1);
}

if (!config.clientId) {
  console.error('Client ID not found in config.json');
  console.log('Please add your "clientId" to config.json (this is your bot\'s application ID)');
  process.exit(1);
}

// Define commands
const commands = [
  {
    name: 'help',
    description: 'Show available commands'
  }
];

// Prepare REST API client
const rest = new REST({ version: '10' }).setToken(config.token);

// Register commands function
async function registerCommands() {
  try {
    console.log('Started refreshing application (/) commands...');

    // Register global commands
    const data = await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );

    console.log(`Successfully registered ${data.length} application commands.`);
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Run the registration
registerCommands(); 