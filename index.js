const { Client, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_FILE = 'config.json';
let config = {
  token: '',
  clientId: '', // Added clientId field
  prefix: '!',
  targetChannelId: '',
  commands: {
    rolls: ['$wa', '$ha', '$ma', '$ta'],
    dailies: ['$daily', '$dk', '$vote', '$ku'],
    pokemon: ['$p', '$pd']
  },
  timers: {
    rollInterval: 60 * 60 * 1000, // 1 hour in milliseconds
    dailyCheckInterval: 12 * 60 * 60 * 1000, // 12 hours
  },
  settings: {
    autoRoll: true,
    autoClaim: true,
    autoDaily: true,
    autoKakera: true
  },
  claimCharacters: []
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
  console.log(`Please edit ${CONFIG_FILE} and add your bot token and channel ID`);
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

// Variables to track state
let lastRoll = 0;
let lastDailyCheck = 0;
let mudaeUserID = null;

// When the client is ready, run this code
client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  // Start timers if we have a target channel
  if (config.targetChannelId) {
    startTimers();
  } else {
    console.log('Please set a targetChannelId in config.json');
  }
});

// Set up timers for auto-rolling and daily commands
function startTimers() {
  console.log('Starting automation timers');
  
  // Check for rolls
  setInterval(() => {
    if (!config.settings.autoRoll) return;
    
    const now = Date.now();
    if (now - lastRoll >= config.timers.rollInterval) {
      sendRollCommands();
      lastRoll = now;
    }
  }, 60000); // Check every minute
  
  // Check for dailies
  setInterval(() => {
    if (!config.settings.autoDaily) return;
    
    const now = Date.now();
    if (now - lastDailyCheck >= config.timers.dailyCheckInterval) {
      sendDailyCommands();
      lastDailyCheck = now;
    }
  }, 3600000); // Check every hour
}

// Send roll commands
async function sendRollCommands() {
  const channel = client.channels.cache.get(config.targetChannelId);
  if (!channel) return;
  
  console.log('Sending roll commands');
  
  for (const cmd of config.commands.rolls) {
    await channel.send(cmd);
    // Wait between 2-4 seconds between commands to look natural
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  }
}

// Send daily commands
async function sendDailyCommands() {
  const channel = client.channels.cache.get(config.targetChannelId);
  if (!channel) return;
  
  console.log('Sending daily commands');
  
  for (const cmd of config.commands.dailies) {
    await channel.send(cmd);
    // Wait between commands
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
  }
  
  lastDailyCheck = Date.now();
}

// Process Mudae messages
function isMudaeEmbed(message) {
  if (!mudaeUserID && message.author.username.toLowerCase().includes('mudae')) {
    mudaeUserID = message.author.id;
  }
  
  return message.author.id === mudaeUserID && message.embeds.length > 0;
}

function shouldClaimCharacter(embed) {
  if (!config.settings.autoClaim || !embed) return false;
  
  // Check if this is a character embed (typically has title and description)
  if (!embed.title || !embed.description) return false;
  
  // If claimCharacters list is empty, claim all characters
  if (config.claimCharacters.length === 0) return true;
  
  // Otherwise, check if character name is in our claim list
  return config.claimCharacters.some(char => 
    embed.title.toLowerCase().includes(char.toLowerCase()));
}

// Command handling function - works for both text and slash commands
const handleCommand = async (command, args, replyFunc) => {
  // Command: help
  if (command === 'help') {
    replyFunc(
      `Commands:\n` +
      `${config.prefix}status - Show current status\n` +
      `${config.prefix}roll - Trigger roll commands now\n` +
      `${config.prefix}daily - Trigger daily commands now\n` +
      `${config.prefix}toggle [autoRoll|autoClaim|autoDaily|autoKakera] - Toggle a setting\n` +
      `${config.prefix}add [character] - Add character to auto-claim list\n` +
      `${config.prefix}remove [character] - Remove character from auto-claim list\n` +
      `${config.prefix}setchannel - Set current channel as target for commands`
    );
  }
  
  // Command: status
  else if (command === 'status') {
    replyFunc(
      `Status:\n` +
      `Auto Roll: ${config.settings.autoRoll ? 'On' : 'Off'}\n` +
      `Auto Claim: ${config.settings.autoClaim ? 'On' : 'Off'}\n` +
      `Auto Daily: ${config.settings.autoDaily ? 'On' : 'Off'}\n` +
      `Auto Kakera: ${config.settings.autoKakera ? 'On' : 'Off'}\n` +
      `Characters to claim: ${config.claimCharacters.length > 0 ? config.claimCharacters.join(', ') : 'All'}\n` +
      `Target channel: ${config.targetChannelId || 'Not set'}`
    );
  }
  
  // Command: roll
  else if (command === 'roll') {
    replyFunc('$ma');
    sendRollCommands();
  }
  
  // Command: daily
  else if (command === 'daily') {
    replyFunc('Triggering daily commands now');
    sendDailyCommands();
  }
  
  // Command: toggle
  else if (command === 'toggle' && args[0]) {
    const setting = args[0].toLowerCase();
    if (config.settings[setting] !== undefined) {
      config.settings[setting] = !config.settings[setting];
      replyFunc(`${setting} is now ${config.settings[setting] ? 'On' : 'Off'}`);
      saveConfig();
    } else {
      replyFunc(`Unknown setting: ${setting}`);
    }
  }
  
  // Command: add character
  else if (command === 'add' && args.length > 0) {
    const character = args.join(' ').trim();
    if (!config.claimCharacters.includes(character)) {
      config.claimCharacters.push(character);
      replyFunc(`Added "${character}" to auto-claim list`);
      saveConfig();
    } else {
      replyFunc(`"${character}" is already in the auto-claim list`);
    }
  }
  
  // Command: remove character
  else if (command === 'remove' && args.length > 0) {
    const character = args.join(' ').trim();
    const index = config.claimCharacters.indexOf(character);
    if (index !== -1) {
      config.claimCharacters.splice(index, 1);
      replyFunc(`Removed "${character}" from auto-claim list`);
      saveConfig();
    } else {
      replyFunc(`"${character}" is not in the auto-claim list`);
    }
  }
  
  // Command: setchannel
  else if (command === 'setchannel') {
    config.targetChannelId = args.channelId || args.channel?.id;
    replyFunc(`Set this channel as the target for commands`);
    saveConfig();
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
  
  // Mudae responses handling
  if (isMudaeEmbed(message) && message.embeds[0]) {
    const embed = message.embeds[0];
    
    // Check if this is a character we want to claim
    if (shouldClaimCharacter(embed)) {
      // Wait a random time to simulate human reaction (1-3 seconds)
      setTimeout(async () => {
        try {
          await message.react('💖');
          console.log(`Attempted to claim: ${embed.title}`);
        } catch (error) {
          console.error('Error trying to claim character:', error);
        }
      }, 1000 + Math.random() * 2000);
    }
    
    // Auto-kakera collection
    if (config.settings.autoKakera && message.components && message.components.length > 0) {
      // Wait a random time to simulate human reaction (2-5 seconds)
      setTimeout(async () => {
        try {
          await message.react('🧡');  // Kakera react
          console.log('Attempted to collect kakera');
        } catch (error) {
          console.error('Error trying to collect kakera:', error);
        }
      }, 2000 + Math.random() * 3000);
    }
  }
});

// Listen for slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;
  
  // Extract options based on command
  let args = [];
  
  if (commandName === 'toggle') {
    args = [options.getString('setting')];
  } else if (commandName === 'add' || commandName === 'remove') {
    args = [options.getString('character')];
  } else if (commandName === 'setchannel') {
    args = { channelId: interaction.channelId };
  }
  
  // Handle the command
  await handleCommand(commandName, args, (text) => interaction.reply(text));
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