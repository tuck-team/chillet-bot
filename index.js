const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const path = require('path');
const { channeladd, channelremove, ischannel } = require('./src/channel');

const { saveConfig, fs, CONFIG_FILE, getConfig } = require('./src/config');
const { cooldowns, cooldown, setCooldown } = require('./src/cooldown');
const { debug } = require('./src/debug');
const { expedition } = require('./src/expedition');
const { gold, paycheck } = require('./src/gold');
const { incubateur } = require('./src/incubateur');
const { pal } = require('./src/pal');
const { palbox } = require('./src/palbox');
const { paldex, createProgressBar } = require('./src/paldex');
const { prefix } = require('./src/prefix');
const { tier, tupgrade } = require('./src/tier');
const { topserv } = require('./src/topserv');
const { tradp, tradg } = require('./src/tradding');
// Configuration
const USER_DATA_FILE = 'user_data.json';
const PAL_LIST_FILE = 'pal_list.json';

let config = {
	token: '',
	clientId: '',
	prefix: '!'
};

// Load Pal data from JSON file
let pals = [];
if (fs.existsSync(PAL_LIST_FILE)) {
  try {
    pals = JSON.parse(fs.readFileSync(PAL_LIST_FILE, 'utf8'));
    console.log('Pal data loaded successfully');
  } catch (error) {
    console.error('Error loading Pal data:', error);
  }
} else {
  console.log('No Pal data file found. Please make sure pal_list.json exists.');
}

// User data storage
let userData = {};

// Load user data if exists
if (fs.existsSync(USER_DATA_FILE)) {
  try {
    userData = JSON.parse(fs.readFileSync(USER_DATA_FILE, 'utf8'));
    console.log('User data loaded successfully');
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Function to save user data
function saveUserData() {
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
    console.log('User data saved');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// Function to add a caught Pal to user data
function addCaughtPal(userId, username, palName, rarity, isLucky) {
  // Check if this is the first time catching this Pal
  const existingPalIndex = userData[userId].caughtPals.findIndex(pal => pal.name === palName);
  const isFirstCatch = existingPalIndex === -1;
  let isFirstLucky = false;

  // If this isn't the first catch and the new catch is lucky,
  // check if a lucky version of this pal hasn't been caught previously.
  if (!isFirstCatch && isLucky) {
    const alreadyLuckyExists = userData[userId].caughtPals.some(pal => pal.name === palName && pal.isLucky);
    if (!alreadyLuckyExists) {
      isFirstLucky = true;
    }
  }

  if (isFirstCatch || isFirstLucky){
    userData[userId].caughtPals.push({
      name: palName,
      rarity: rarity,
      isLucky: isLucky,
      nbCaught: 1,
      rank: 1,
      busy: false,
      caughtAt: new Date().toISOString()
    });
  }
  else if (!isFirstCatch) {
    const palIndex = userData[userId].caughtPals.findIndex(
        pal => pal.name === palName && pal.isLucky === isLucky
    );
    if (palIndex !== -1) {
        userData[userId].caughtPals[palIndex].nbCaught++;
        if (userData[userId].caughtPals[palIndex].nbCaught > 4^userData[userId].caughtPals[palIndex].rank) {
          userData[userId].caughtPals[palIndex].rank++;
          userData[userId].caughtPals[palIndex].nbCaught = 1;
        }
    }
  }
  saveUserData();

  return isFirstCatch;
}

// Function to get random Pal by rarity
function getRandomPalByRarity(rarity) {
  const palsOfRarity = pals.filter(pal => pal.rarity === rarity);

  if (palsOfRarity.length === 0) return null;
  return palsOfRarity[Math.floor(Math.random() * palsOfRarity.length)].name;
}

// Function to get Pal image URL
function getPalImage(palName) {
  const pal = pals.find(p => p.name === palName);
  return pal ? pal.imageUrl : null;
}

// Function to get Pal rarity
function getPalRarity(palName) {
  const pal = pals.find(p => p.name === palName);
  return pal ? pal.rarity : null;
}

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
  client.user.setActivity('!help | /help', { type: 0 }); // 0 is PLAYING
});

// Command handling function
const handleCommand = async (command, args, replyFunc, messageAuthor, userData, message) => {
  if (command === 'help') {
    replyFunc(
      `**<:T_itemicon_PalSphere:1352291984953577542> Commands: <:T_itemicon_PalSphere:1352291984953577542>**\n` +
      `**${config.prefix}help** - Show this help message\n` +
      `**${config.prefix}cooldown** - Check your cooldown status\n` +
      `**${config.prefix}setcooldown [minutes]** - Set the cooldown time (default: 5)\n` +
      `**${config.prefix}pal [name]** - Check a Pal's rarity\n` +
      `**${config.prefix}palbox** - View your caught Pals\n` +
      `**${config.prefix}paldex** - View Paldex completion status\n` +
      `**${config.prefix}topserv** - View server leaderboard by Paldex completion\n` +
      `**${config.prefix}prefix [newPrefix]** - Change the command prefix\n` +
      `**${config.prefix}tradp (optional [-l] for lucky) [Palname] @who** - Trade a Pal to a user\n` +
      `**${config.prefix}tradg [amount] @who** - Trade gold to a user\n` +
      `**${config.prefix}expedition** - Start an expedition\n` +
      `**${config.prefix}tier** - Check your tier\n` +
      `**${config.prefix}tupgrade** - Upgrade your tier\n` +
      `**${config.prefix}debug [channelid]** - Debug command\n` +
      `**${config.prefix}debug testembed** - Test embed command\n` +
      `**${config.prefix}gold** - Check your gold\n` +
      `**${config.prefix}paycheck** - Check your paycheck\n` +
      `**${config.prefix}incubator start [male] [female]** - Start an incubator\n` +
      `**${config.prefix}incubator claim** - Claim your incubator\n` +
      `**ramdom message** - ramdom pal catch`
    );
  }
  else if (command === 'debug') {
    debug(messageAuthor, message, args, replyFunc);
  }
  else if (command === 'prefix') {
    prefix({ args, replyFunc });
  }
  else if (command === 'gold') {
    gold(messageAuthor, userData, replyFunc);
  }
  else if (command === 'paycheck') {
    paycheck(messageAuthor, userData, replyFunc);
  }
  else if (command === 'setcooldown') {
    setCooldown(messageAuthor, args, replyFunc);
  }
  else if (command === 'cooldown') {
    cooldown(messageAuthor, replyFunc);
  }
  else if (command === 'palbox') {
    palbox(messageAuthor, userData, replyFunc);
  }
  else if (command === 'pal') {
    pal({ args, pals, replyFunc }, userData, messageAuthor);
  }
  else if (command === 'paldex') {
    paldex({ messageAuthor, userData, pals, replyFunc });
  }
  else if (command === 'topserv') {
    topserv({ userData, pals, replyFunc });
  }
  else if (command === 'tier') {
    tier(messageAuthor, userData, replyFunc);
  }
  else if (command === 'tupgrade') {
    tupgrade(messageAuthor, userData, replyFunc);
  }
  else if (command === 'tradp') {
    tradp({ args, replyFunc }, userData, messageAuthor, message);
  }
  else if (command === 'tradg') {
    tradg({ args, replyFunc }, userData, messageAuthor, message);
  }
  else if (command === 'expedition') {
    expedition(messageAuthor, userData, args, replyFunc);
  }
  else if (command === 'incubator') {
    incubateur(messageAuthor, userData, args, replyFunc);
  }
  config = getConfig();
  saveUserData();
};

// Message event with cooldown
client.on(Events.MessageCreate, async message => {
  // Ignore messages from bots
  if (message.author.bot) return;
  if (message.content.slice(config.prefix.length).trim().split(/ +/).shift().toLowerCase() === 'channeladd') {
    channeladd(message);
    return;
  }
  if (message.content.slice(config.prefix.length).trim().split(/ +/).shift().toLowerCase() === 'channelremove') {
    channelremove(message);
    return;
  }
  if (ischannel(message)) return;

  // Get current configuration
  config = getConfig();

  // Command handling
  if (message.content.startsWith(config.prefix)) {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    await handleCommand(command, args, (text) => message.channel.send(text), message.author, userData, message);
    return; // Exit after handling command
  }

  // Check cooldown
  const now = Date.now();
  const lastTrigger = cooldowns.get(message.author.id) || 0;
  const cooldownTime = (config.cooldownMinutes || 5) * 60 * 1000; // Convert minutes to milliseconds

  if (!userData[message.author.id]) {
    userData[message.author.id] = {
      username: message.author.username,
      gold: 0,
      tier: 0,
      multiplier: 1,
      lastPaycheck: null,
      expeditionslots: 1,
      incubatorSlots: 1,
      caughtPals: [],
      expeditions: [],
      incubator: []
    };
  }
  if (now - lastTrigger >= cooldownTime) {
    // Update cooldown
    cooldowns.set(message.author.id, now);

    // Determine rarity
    const random = Math.random() * 100;
    let color, rarity;

    if (random < (3 * userData[message.author.id].multiplier)) {
      color = '#FFD700'; // Gold for Legendary
      rarity = 'Legendary';
    } else if (random < (11 * userData[message.author.id].multiplier)) {
      color = '#9B30FF'; // Purple for Epic
      rarity = 'Epic';
    } else if (random < (40 * userData[message.author.id].multiplier)) {
      color = '#0099ff'; // Blue for Rare
      rarity = 'Rare';
    } else {
      color = '#808080'; // Gray for Common
      rarity = 'Common';
    }

    // Get random Pal of the determined rarity
    const randomPal = getRandomPalByRarity(rarity);

    // Check if Pal is Lucky (5% chance)
    var isLucky = Math.random() < (0.05 * userData[message.author.id].multiplier);
    if (userData[message.author.id].tier < 2) {
      isLucky = false;
    }

    // Add caught Pal to user data and check if it's their first time catching this Pal
    const isFirstCatch = addCaughtPal(message.author.id, message.author.username, randomPal, rarity, isLucky);

    // Create description based on conditions
    let description = isLucky
      ? `:star2: It's a **LUCKY** ${randomPal}, he's so big! :star2:`
      : `It's a **${randomPal}**!`;

    // Add first catch message if applicable
    var goldToAdd = 0;
    if (isFirstCatch) {
      if (rarity === 'Legendary') {
        goldToAdd = 1500;
      } else if (rarity === 'Epic') {
        goldToAdd = 800;
      } else if (rarity === 'Rare') {
        goldToAdd = 300;
      } else if (rarity === 'Common') {
        goldToAdd = 100;
      }
    }
    if (isLucky) {
      goldToAdd += 1000;
    }
    userData[message.author.id].gold += goldToAdd;
    if (isFirstCatch) {
      description += '\n\n<:T_itemicon_PalSphere:1352291984953577542> **FIRST CATCH!** <:T_itemicon_PalSphere:1352291984953577542>\n Gains: **+' + goldToAdd + ' <:Money:1352019542565720168>**';
    }

    // Create embed message
    const embed = new EmbedBuilder()
      .setColor(color)
      .setAuthor({ name: isLucky ? `caught a Lucky ${rarity} Pal!` : `caught a ${rarity} Pal!`, iconURL: message.author.avatarURL() })
      .setDescription(description)
      .setFooter({ text: `${randomPal} caught so far: ${userData[message.author.id].caughtPals.find(pal => pal.name === randomPal && pal.isLucky === isLucky).nbCaught}` });

    const imageUrl = getPalImage(randomPal);
    if (imageUrl) {
      embed.setThumbnail(imageUrl);
    }

    // Send embed message
    await message.channel.send({ embeds: [embed] });
  }
});

// Listen for slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;
  console.log(`Received command: ${commandName}`);

  // Retrieve options
  const args = options.data.map(option => option.value);
  console.log(`Options: ${args}`);

  // Handle the command
  await handleCommand(commandName, args, (text) => interaction.reply(text), interaction.user, userData, interaction);
});

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
