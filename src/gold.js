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
			`<:T_itemicon_PalSphere:1352291984953577542> Tier 1: **1000** <:Money:1352019542565720168> Unlocks Expeditions\n` +
			`<:T_itemicon_PalSphere_Mega:1352292054679552050> Tier 2: **2000** <:Money:1352019542565720168> ???\n` +
			`<:T_itemicon_PalSphere_Giga:1352292073616707718> Tier 3: **3000** <:Money:1352019542565720168> Unlocks Trading\n` +
			`<:T_itemicon_PalSphere_Tera:1352292095842586747> Tier 4: **4000** <:Money:1352019542565720168> +1 Expedition Slot\n` +
			`<:T_itemicon_PalSphere_Master:1352292134136320033> Tier 5: **5000** <:Money:1352019542565720168> -5hr Trading Cooldown\n` +
			`<:T_itemicon_PalSphere_Legend:1352292167623905300> Tier 6: **6000** <:Money:1352019542565720168> ???\n` +
			`<:T_itemicon_PalSphere_Robbery:1352292188142305351> Tier 7: **7000** <:Money:1352019542565720168> ???\n` +
			`<:T_itemicon_PalSphere_Ultimate:1352292204609015858> Tier 8: **8000** <:Money:1352019542565720168> ???\n` +
			`<:T_itemicon_PalSphere_Exotic:1352292228105764906> Tier 9: **9000** <:Money:1352019542565720168> ???\n` +
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