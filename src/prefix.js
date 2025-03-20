const { getConfig, saveConfig } = require("./config");

function prefix({ args, replyFunc }) {
	const config = getConfig();
	const newPrefix = args[0];
    if (!newPrefix) {
      replyFunc('Please provide a new prefix (e.g., `!` or `/`).');
      return;
    }
    config.prefix = newPrefix;
    saveConfig();
    replyFunc(`Prefix changed to \`${newPrefix}\``);
}

module.exports = { prefix };