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
  },
  {
    name: 'gold',
    description: 'Show user gold balance'
  },
  {
    name: 'paycheck',
    description: 'Use a paycheck if avaible'
  },
  {
    name: 'tier',
    description: 'Show user tier'
  },
  {
    name: 'tupgrade',
    description: 'Use gold to upgrade your tier'
  },
  {
    name: 'setprefix', // changed from "setPrefix"
    description: 'Set the prefix for the bot',
    options: [
      {
        name: 'name',
        type: 3, // string type
        description: 'The name of the pal',
        required: true
      }
    ]
  },
  {
    name: 'setcooldown', // changed from "setCooldown"
    description: 'Change the cooldown for the bot',
    options: [
      {
        name: 'time',
        type: 4, // integrer type
        description: 'Cooldown time in minutes',
        required: true
      }
    ]
  },
  {
    name: 'cooldown',
    description: 'Know the current cooldown'
  },
  {
    name: 'pal',
    description: 'Get the information of a pal',
    options: [
      {
        name: 'name',
        type: 3, // string type
        description: 'The name of the pal',
        required: true
      }
    ]
  },
  {
    name: 'topserv',
    description: 'Display the top 5 servers'
  },
  {
    name: 'paldex',
    description: 'Display the completion of the paldex'
  },
  {
    name: 'palbox',
    description: 'Open the palbox'
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
