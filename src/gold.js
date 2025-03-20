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

	const random = Math.random() * 100;
	var payValue = Math.floor(random * 10);
	payValue < 200 ? payValue += 200 : payValue;
	payValue > 700 ? payValue -= 300 : payValue;

	userPalData.gold += payValue;
	replyFunc(`You have been paid **${payValue}**<:Money:1352019542565720168>!`);
}

module.exports = { gold, paycheck };