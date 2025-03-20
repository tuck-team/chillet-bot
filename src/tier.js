const { EmbedBuilder } = require('discord.js');

function tier(messageAuthor, userData, replyFunc) {
	const userPalData = userData[messageAuthor.id];

	// Create embed
	const embed = new EmbedBuilder()
		.setColor('#FFD700')
		.setDescription(
			`Current Tier: **${userPalData.tier}**\n` +
            `Tier 1: cost : **1000** <:Money:1352019542565720168> Unlocks Expeditions\n` +
            `Tier 2: cost : **1000** <:Money:1352019542565720168> Unlocks Expeditions\n` +
            `Tier 3: cost : **1000** <:Money:1352019542565720168> Unlocks Expeditions\n` +
            `Tier 4: cost : **1000** <:Money:1352019542565720168> Unlocks Expeditions\n` +
            `Tier 5: cost : **1000** <:Money:1352019542565720168> Unlocks Expeditions\n` +
            `Tier 6: cost : **1000** <:Money:1352019542565720168> Unlocks Expeditions\n` +
            `Tier 7: cost : **1000** <:Money:1352019542565720168> Unlocks Expeditions\n` +
            `Tier 8: cost : **1000** <:Money:1352019542565720168> Unlocks Expeditions\n\n` +
            `**!tupgrade** to upgrade your tier <:Money:1352019542565720168><:Money:1352019542565720168>`
		);

	replyFunc({ embeds: [embed] });
}

function tupgrade(messageAuthor, userData, replyFunc) {
	const userPalData = userData[messageAuthor.id];

    if (userPalData.tier >= 8) {
        replyFunc(`You have reached the maximum tier. You can't upgrade anymore.`);
        return;
    }
	if (userPalData.gold < 1000) {
		replyFunc(`You don't have enough gold to upgrade your tier. You need **1000** <:Money:1352019542565720168>`);
		return;
	}
	userPalData.gold -= 1000;
	userPalData.tier += 1;
	replyFunc(`You have upgraded your tier to **${userPalData.tier}**` +
        `\n` + `You have **${userPalData.gold}** <:Money:1352019542565720168> left`);
}

module.exports = { tier, tupgrade };