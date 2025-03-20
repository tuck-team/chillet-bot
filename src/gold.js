const { EmbedBuilder } = require('discord.js');

function gold(messageAuthor, userData, replyFunc) {
	const userPalData = userData[messageAuthor.id];

	// Create embed
	const embed = new EmbedBuilder()
		.setColor('#8C1C98')
		.setDescription(
			`Earn gold by catching shiny pals, completing expeditions, and using !paycheck\n\n` +
			`You have **${userPalData.gold}**<:Money:1352019542565720168>!\n\n` +
			`Spend gold to upgrade your **Tier** and unlock powerful upgrades :\n` +
			`Tier 1: cost : **1000** <:Money:1352019542565720168> Unlocks Expeditions\n` +
			`\n` +
			`Current Tier: **${userPalData.tier}**\n`
		);

	replyFunc({ embeds: [embed] });
}

function paycheck(messageAuthor, userData, replyFunc) {
	const userPalData = userData[messageAuthor.id];

	if (userPalData.lastPaycheck && Date.now() - userPalData.lastPaycheck < 60000) {
		const remainingTime = 15 * 60 * 60 * 1000 - (Date.now() - userPalData.lastPaycheck);
		const hours = Math.floor(remainingTime / (60 * 60 * 1000));
		const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
		replyFunc(`You can't use this command for another **${hours}h ${minutes}m**!`);
	} else {
		const random = Math.random() * 100;
		var payValue = Math.floor(random * 10);
		payValue < 200 ? payValue += 200 : payValue;
		payValue > 700 ? payValue -= 300 : payValue;

		userPalData.gold += payValue;
		replyFunc(`You have been paid **${payValue}**<:Money:1352019542565720168>!`);
		userPalData.lastPaycheck = Date.now();
	}
}

module.exports = { gold, paycheck };