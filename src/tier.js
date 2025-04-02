const { EmbedBuilder } = require('discord.js');

function tier(messageAuthor, userData, replyFunc) {
	const userPalData = userData[messageAuthor.id];

	// Create embed
	const embed = new EmbedBuilder()
		.setColor('#FFD700')
		.setDescription(
			`Current Tier: **${userPalData.tier}**\n\n` +
			`<:T_itemicon_PalSphere:1352291984953577542> Tier 1: **1000** <:Money:1352019542565720168> Unlocks **Expeditions**\n` +
			`<:T_itemicon_PalSphere_Mega:1352292054679552050> Tier 2: **2000** <:Money:1352019542565720168> Pals have a chance to be **LUCKY**\n` +
			`<:T_itemicon_PalSphere_Giga:1352292073616707718> Tier 3: **3000** <:Money:1352019542565720168> Unlocks **Trading**\n` +
			`<:T_itemicon_PalSphere_Tera:1352292095842586747> Tier 4: **4000** <:Money:1352019542565720168> +1 Expedition Slot\n` +
			`<:T_itemicon_PalSphere_Master:1352292134136320033> Tier 5: **5000** <:Money:1352019542565720168> Unlocks **Incubator**\n` +
			`<:T_itemicon_PalSphere_Legend:1352292167623905300> Tier 6: **6000** <:Money:1352019542565720168> Increased Payckecks\n` +
			`<:T_itemicon_PalSphere_Robbery:1352292188142305351> Tier 7: **7000** <:Money:1352019542565720168> Incubator can hold another egg\n` +
			`<:T_itemicon_PalSphere_Ultimate:1352292204609015858> Tier 8: **8000** <:Money:1352019542565720168> + 2 Expedition Slots\n` +
			`<:T_itemicon_PalSphere_Exotic:1352292228105764906> Tier 9: **9000** <:Money:1352019542565720168> Unlocks **§$:#d@"%**\n` +
			`\n` +
            `**!tupgrade** to upgrade your tier <:Money:1352019542565720168><:Money:1352019542565720168>`
		)
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
	if (userPalData.tier == 0) {
	    userPalData.gold -= 1000;
        userPalData.tier += 1;
    } else if (userPalData.tier == 1) {
        userPalData.gold -= 2000;
        userPalData.tier += 1;
    } else if (userPalData.tier == 2) {
        userPalData.gold -= 3000;
        userPalData.tier += 1;
    } else if (userPalData.tier == 3) {
        userPalData.gold -= 4000;
        userPalData.tier += 1;
        userPalData.expeditionslots += 1;
    } else if (userPalData.tier == 4) {
        userPalData.gold -= 5000;
        userPalData.tier += 1;
    } else if (userPalData.tier == 5) {
        userPalData.gold -= 6000;
        userPalData.tier += 1;
    } else if (userPalData.tier == 6) {
        userPalData.gold -= 7000;
        userPalData.tier += 1;
        userPalData.incubator_slots += 1;
    } else if (userPalData.tier == 7) {
        userPalData.gold -= 8000;
        userPalData.tier += 1;
        userPalData.expeditionslots += 2;
    } else if (userPalData.tier == 8) {
        userPalData.gold -= 9000;
        userPalData.tier += 1;
    }
	replyFunc(`You have upgraded your tier to **${userPalData.tier}**` +
        `\n` + `You have **${userPalData.gold}**<:Money:1352019542565720168> left`);
}

module.exports = { tier, tupgrade };