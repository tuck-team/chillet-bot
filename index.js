const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_FILE = 'config.json';
const USER_DATA_FILE = 'user_data.json';
const PAL_LIST_FILE = 'pal_list.json';

let config = {
  token: '',
  clientId: '',
  prefix: '!'
};

// Cooldown tracking
const cooldowns = new Map();

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
  if (!userData[userId]) {
    userData[userId] = {
      username: username,
      caughtPals: []
    };
  }

  // Check if this is the first time catching this Pal
  const isFirstCatch = !userData[userId].caughtPals.some(pal => pal.name === palName);

  userData[userId].caughtPals.push({
    name: palName,
    rarity: rarity,
    isLucky: isLucky,
    isFirstCatch: isFirstCatch,
    caughtAt: new Date().toISOString()
  });

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
  client.user.setActivity('!help', { type: 0 }); // 0 is PLAYING
});

// Add a global helper for creating progress bars
function createProgressBar(current, total, length = 10) {
  if (total <= 0) {
    return '░'.repeat(length);
  }
  let filled = Math.round((current / total) * length);
  if (filled < 0) filled = 0;
  if (filled > length) filled = length;
  return '█'.repeat(filled) + '░'.repeat(length - filled);
}

// Command handling function
const handleCommand = async (command, args, replyFunc, messageAuthor) => {
  // Command: help
  if (command === 'help') {
    replyFunc(
      `**<:PalSphere:1352018389253623809> Commands: <:PalSphere:1352018389253623809>**\n` +
      `${config.prefix}help - Show this help message\n` +
      `${config.prefix}cooldown - Check your cooldown status\n` +
      `${config.prefix}setcooldown [minutes] - Set the cooldown time (default: 5)\n` +
      `${config.prefix}pal [name] - Check a Pal's rarity\n` +
      `${config.prefix}palbox - View your caught Pals\n` +
      `${config.prefix}paldex - View Paldex completion status\n` +
      `${config.prefix}topserv - View server leaderboard by Paldex completion`
    );
  }
  // Command: setcooldown
  else if (command === 'setcooldown') {
    const minutes = parseInt(args[0]);

    if (isNaN(minutes) || minutes < 1) {
      replyFunc('Please provide a valid number of minutes (minimum: 1)');
      return;
    }

    config.cooldownMinutes = minutes;
    saveConfig();
    replyFunc(`Cooldown time has been set to ${minutes} minute${minutes !== 1 ? 's' : ''}!`);
  }
  // Command: cooldown
  else if (command === 'cooldown') {
    const now = Date.now();
    const lastTrigger = cooldowns.get(messageAuthor.id) || 0;
    const cooldownTime = (config.cooldownMinutes || 5) * 60 * 1000; // Convert minutes to milliseconds
    const timeLeft = cooldownTime - (now - lastTrigger);

    if (timeLeft <= 0) {
      replyFunc('You can trigger the bot\'s reply now!');
    } else {
      const minutesLeft = Math.ceil(timeLeft / 60000);
      replyFunc(`You need to wait ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} before triggering the bot's reply again.`);
    }
  }
  // Command: palbox
  else if (command === 'palbox') {
    const userPalData = userData[messageAuthor.id];

    if (!userPalData || userPalData.caughtPals.length === 0) {
      replyFunc('You haven\'t caught any Pals yet!');
      return;
    }

    // Count Pals by rarity
    const counts = {
      Legendary: 0,
      Epic: 0,
      Rare: 0,
      Common: 0,
      Lucky: 0
    };

    userPalData.caughtPals.forEach(pal => {
      counts[pal.rarity]++;
      if (pal.isLucky) counts.Lucky++;
    });

    // Create embed
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${messageAuthor.username}'s Palbox`)
      .setDescription(
        `Total Pals: ${userPalData.caughtPals.length}\n` +
        `Legendary: ${counts.Legendary}\n` +
        `Epic: ${counts.Epic}\n` +
        `Rare: ${counts.Rare}\n` +
        `Common: ${counts.Common}\n` +
        `Lucky Pals: ${counts.Lucky}`
      )
      .setTimestamp();

    // Add fields for each rarity
    ['Legendary', 'Epic', 'Rare', 'Common'].forEach(rarity => {
      const palsOfRarity = userPalData.caughtPals
        .filter(pal => pal.rarity === rarity)
        .map(pal => `${pal.isLucky ? '⭐ ' : ''}${pal.name}`)
        .join('\n');

      if (palsOfRarity) {
        embed.addFields({
          name: `${rarity} Pals`,
          value: palsOfRarity || 'None'
        });
      }
    });

    replyFunc({ embeds: [embed] });
  }
  // Command: pal
  else if (command === 'pal') {
    const palName = args.join(' ');
    if (!palName) {
      replyFunc('Please provide a Pal name!');
      return;
    }

    const pal = pals.find(p => p.name.toLowerCase() === palName.toLowerCase());
    if (!pal) {
      replyFunc('Pal not found! Please check the spelling and try again.');
      return;
    }

    let color;
    switch (pal.rarity) {
      case 'Legendary':
        color = '#FFD700';
        break;
      case 'Epic':
        color = '#9B30FF';
        break;
      case 'Rare':
        color = '#0099ff';
        break;
      case 'Common':
        color = '#808080';
        break;
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`${pal.name}`)
      .setDescription(`Rarity: ${pal.rarity}`)
      .setTimestamp();

    if (pal.imageUrl) {
      embed.setImage(pal.imageUrl);
    }

    replyFunc({ embeds: [embed] });
  }
  // Command: paldex
  else if (command === 'paldex') {
    const userPalData = userData[messageAuthor.id] || { caughtPals: [] };

    // Count Pals by rarity
    const counts = {
      Legendary: 0,
      Epic: 0,
      Rare: 0,
      Common: 0,
      Lucky: 0
    };

    // Count user's caught Pals
    userPalData.caughtPals.forEach(pal => {
      counts[pal.rarity]++;
      if (pal.isLucky) counts.Lucky++;
    });

    // Count total Pals in Paldex
    const totalCounts = {
      Legendary: 0,
      Epic: 0,
      Rare: 0,
      Common: 0
    };

    pals.forEach(pal => {
      totalCounts[pal.rarity]++;
    });

    // Calculate completion percentages
    const percentages = {
      Legendary: Math.round((counts.Legendary / totalCounts.Legendary) * 100) || 0,
      Epic: Math.round((counts.Epic / totalCounts.Epic) * 100) || 0,
      Rare: Math.round((counts.Rare / totalCounts.Rare) * 100) || 0,
      Common: Math.round((counts.Common / totalCounts.Common) * 100) || 0
    };

    // Create embed
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${messageAuthor.username}'s Paldex Progress`)
      .setDescription(
        `**Total Pals Caught:** ${userPalData.caughtPals.length}/${pals.length}\n` +
        `:star2: **Lucky Pals:** ${counts.Lucky}/${pals.length}\n\n` +
        `<:PalSphere_Exotic:1352022219521527870> **Legendary** (${counts.Legendary}/${totalCounts.Legendary}) ${percentages.Legendary}%\n` +
        `${createProgressBar(counts.Legendary, totalCounts.Legendary)}\n\n` +
        `<:PalSphere_Master:1352022282490482828> **Epic** (${counts.Epic}/${totalCounts.Epic}) ${percentages.Epic}%\n` +
        `${createProgressBar(counts.Epic, totalCounts.Epic)}\n\n` +
        `<:PalSphere_Giga:1352022327243706379> **Rare** (${counts.Rare}/${totalCounts.Rare}) ${percentages.Rare}%\n` +
        `${createProgressBar(counts.Rare, totalCounts.Rare)}\n\n` +
        `<:PalSphere:1352018389253623809> **Common** (${counts.Common}/${totalCounts.Common}) ${percentages.Common}%\n` +
        `${createProgressBar(counts.Common, totalCounts.Common)}`
      )
      .setTimestamp();

    replyFunc({ embeds: [embed] });
  }
  // Command: topserv
  else if (command === 'topserv') {
    // Get user completion data
    const userCompletions = [];

    for (const userId in userData) {
      if (userData.hasOwnProperty(userId)) {
        const user = userData[userId];

        // Get unique Pals the user has caught
        const uniquePals = new Set();
        user.caughtPals.forEach(pal => uniquePals.add(pal.name));

        // Calculate completion percentage
        const completionPercentage = Math.round((uniquePals.size / pals.length) * 100);

        userCompletions.push({
          id: userId,
          username: user.username,
          uniqueCount: uniquePals.size,
          totalCount: pals.length,
          completionPercentage: completionPercentage,
          luckyCount: user.caughtPals.filter(pal => pal.isLucky).length
        });
      }
    }

    // Sort users by completion percentage in descending order
    userCompletions.sort((a, b) => b.completionPercentage - a.completionPercentage);

    // Create the embed
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Server Paldex Leaderboard')
      .setDescription('Players ranked by Paldex completion percentage')
      .setTimestamp();

    // Add the leaderboard
    if (userCompletions.length === 0) {
      embed.addFields({ name: 'No Data', value: 'No players have caught any Pals yet!' });
    } else {
      let leaderboardText = '';
      userCompletions.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        leaderboardText += `${medal} **${user.username}**: ${user.completionPercentage}% (${user.uniqueCount}/${user.totalCount})\n`;
        leaderboardText += `${createProgressBar(user.uniqueCount, user.totalCount)} | ⭐ Lucky: ${user.luckyCount}\n\n`;

        // Break into multiple fields if needed (Discord has a 25 field limit)
        if ((index + 1) % 5 === 0 || index === userCompletions.length - 1) {
          embed.addFields({
            name: index === 4 ? 'Top 5' : index < 10 ? 'Top 10' : `Ranks ${index - 4}-${index + 1}`,
            value: leaderboardText
          });
          leaderboardText = '';
        }
      });
    }

    replyFunc({ embeds: [embed] });
  }
};

// Message event with cooldown
client.on(Events.MessageCreate, async message => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Command handling
  if (message.content.startsWith(config.prefix)) {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    await handleCommand(command, args, (text) => message.channel.send(text), message.author);
    return; // Exit after handling command
  }

  // Check cooldown
  const now = Date.now();
  const lastTrigger = cooldowns.get(message.author.id) || 0;
  const cooldownTime = (config.cooldownMinutes || 5) * 60 * 1000; // Convert minutes to milliseconds

  if (now - lastTrigger >= cooldownTime) {
    // Update cooldown
    cooldowns.set(message.author.id, now);

    // Determine rarity
    const random = Math.random() * 100;
    let color, rarity;

    if (random < 1) {
      color = '#FFD700'; // Gold for Legendary
      rarity = 'Legendary';
    } else if (random < 11) {
      color = '#9B30FF'; // Purple for Epic
      rarity = 'Epic';
    } else if (random < 40) {
      color = '#0099ff'; // Blue for Rare
      rarity = 'Rare';
    } else {
      color = '#808080'; // Gray for Common
      rarity = 'Common';
    }

    // Get random Pal of the determined rarity
    const randomPal = getRandomPalByRarity(rarity);

    // Check if Pal is Lucky (5% chance)
    const isLucky = Math.random() < 0.05;

    // Add caught Pal to user data and check if it's their first time catching this Pal
    const isFirstCatch = addCaughtPal(message.author.id, message.author.username, randomPal, rarity, isLucky);

    // Create description based on conditions
    let description = isLucky
      ? `${message.author.username} caught a **LUCKY** ${randomPal}, he's so big!`
      : `${message.author.username} caught a ${randomPal}!`;

    // Add first catch message if applicable
    if (isFirstCatch) {
      description += '\n\n<:PalSphere:1352018389253623809> **FIRST CATCH!** <:PalSphere:1352018389253623809>';
    }

    // Create embed message
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(isLucky ? `:star2: Lucky ${rarity} Pal! :star2:` : `${rarity} Pal!`)
      .setDescription(description)
      .setTimestamp();

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

  const { commandName } = interaction;

  // Handle the command
  await handleCommand(commandName, [], (text) => interaction.reply(text), interaction.user);
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