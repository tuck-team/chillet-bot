const { Client, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_FILE = 'config.json';
let config = {
  token: '',
  clientId: '',
  prefix: '!'
};

// Load configuration if exists
if (fs.existsSync(CONFIG_FILE)) {
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    console.log('Configuration loaded successfully');
  } catch (error) {
    console.error('Error loading configuration:', error);
  }
} else {
  console.log('No configuration file found. Creating default config.json');
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  console.log(`Please edit ${CONFIG_FILE} and add your bot token`);
}

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// When the client is ready, run this code
client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Set bot's activity status
  client.user.setActivity('!help', { type: 0 }); // 0 is PLAYING
});

// Command handling function
const handleCommand = async (command, args, replyFunc) => {
  // Command: help
  if (command === 'help') {
    replyFunc(
      `Commands:\n` +
      `${config.prefix}help - Show this help message` +
      ' <:yesyes:1351976548638654507>'
    );
  }
};

// Listen for regular text commands
client.on(Events.MessageCreate, async message => {
  // Ignore own messages
  if (message.author.id === client.user.id) return;

  // Command handling
  if (message.content.startsWith(config.prefix)) {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    await handleCommand(command, args, (text) => message.channel.send(text));
  }
});

// Listen for slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // Handle the command
  await handleCommand(commandName, [], (text) => interaction.reply(text));
});

// Save configuration
function saveConfig() {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('Configuration saved');
  } catch (error) {
    console.error('Error saving configuration:', error);
  }
}

// Login to Discord with token from config
if (config.token) {
  client.login(config.token)
    .catch(error => {
      console.error('Failed to login:', error);
      console.log('Please check your token in config.json');
    });
} else {
  console.log('No token found in config.json. Please add your bot token and restart the application.');
}

console.log('To use this bot, you need to:');
console.log('1. Create a bot on Discord Developer Portal');
console.log('2. Get your bot token');
console.log('3. Add your token to config.json');
console.log('4. Enable Message Content Intent in the Discord Developer Portal');