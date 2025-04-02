const { getConfig, saveConfig } = require('./config');

const cooldowns = new Map();

function cooldown(messageAuthor, replyFunc) {
  const config = getConfig();
  const now = Date.now();
    const lastTrigger = cooldowns.get(messageAuthor.id) || 0;
    const cooldownTime = (config.cooldownMinutes || 5) * 60 * 1000; // Convert minutes to milliseconds
    const timeLeft = cooldownTime - (now - lastTrigger);

    if (timeLeft <= 0) {
      replyFunc('You can trigger the bot\'s reply now!');
    } else {
      const minutesLeft = Math.ceil(timeLeft / 60000);
      replyFunc(`You need to wait **${minutesLeft} min** before triggering the bot's reply again.`);
    }
}

function setCooldown(messageAuthor, args, replyFunc) {
	const config = getConfig();
	const minutes = parseInt(args[0]);

    if (isNaN(minutes) || minutes < 0) {
      replyFunc('Please provide a valid number of minutes (minimum: 0)');
      return;
    }

    config.cooldownMinutes = minutes;
    saveConfig();
    replyFunc(`Cooldown time has been set to ${minutes} minute${minutes !== 1 ? 's' : ''}!`);
}

module.exports = { cooldowns, cooldown, setCooldown };