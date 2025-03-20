const { EmbedBuilder } = require('discord.js');

function paldex({ messageAuthor, userData, pals, replyFunc }) {
	const userPalData = userData[messageAuthor.id] || { caughtPals: [] };

	// Count Pals by rarity
	const counts = {
	    Legendary: 0,
	    Epic: 0,
	    Rare: 0,
	    Common: 0,
		Lucky: {
			Legendary: 0,
			Epic: 0,
			Rare: 0,
			Common: 0
		}
	};

	// Count user's caught Pals
	userPalData.caughtPals.forEach(pal => {
	    if (!pal.isLucky) counts[pal.rarity]++;
	    if (pal.isLucky) counts.Lucky[pal.rarity]++;
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
	    Common: Math.round((counts.Common / totalCounts.Common) * 100) || 0,
		Lucky: {
			Legendary: Math.round((counts.Lucky.Legendary / totalCounts.Legendary) * 100) || 0,
			Epic: Math.round((counts.Lucky.Epic / totalCounts.Epic) * 100) || 0,
			Rare: Math.round((counts.Lucky.Rare / totalCounts.Rare) * 100) || 0,
			Common: Math.round((counts.Lucky.Common / totalCounts.Common) * 100) || 0
		}
	};

	const avatarURL = messageAuthor.displayAvatarURL({ dynamic: true, size: 1024 });

	// Create embed
	const embed = new EmbedBuilder()
	    .setColor('#0099ff')
		.setThumbnail(avatarURL)
	    .setTitle(`${messageAuthor.username}'s Paldex Progress`)
	    .setDescription(
			`**Total Pals Caught:** ${userPalData.caughtPals.length}/${pals.length}\n` +
			`:star2: **Lucky Pals:** ${counts.Lucky.Common + counts.Lucky.Rare + counts.Lucky.Epic + counts.Lucky.Legendary}/${pals.length}\n\n` +
			`<:PalSphere_Exotic:1352022219521527870> **Legendary** (${counts.Legendary}/${totalCounts.Legendary}) ${percentages.Legendary}%\n` +
			`${createProgressBar(counts.Legendary, totalCounts.Legendary)}\n\n` +
			`:star2: <:PalSphere_Exotic:1352022219521527870> **Lucky Legendary** (${counts.Lucky.Legendary}/${totalCounts.Legendary}) ${percentages.Lucky.Legendary}%\n` +
			`${createProgressBar(counts.Lucky.Legendary, totalCounts.Legendary)}\n\n` +
			`<:PalSphere_Master:1352022282490482828> **Epic** (${counts.Epic}/${totalCounts.Epic}) ${percentages.Epic}%\n` +
			`${createProgressBar(counts.Epic, totalCounts.Epic)}\n\n` +
			`:star2: <:PalSphere_Master:1352022282490482828> **Lucky Epic** (${counts.Lucky.Epic}/${totalCounts.Epic}) ${percentages.Lucky.Epic}%\n` +
			`${createProgressBar(counts.Lucky.Epic, totalCounts.Epic)}\n\n` +
			`<:PalSphere_Giga:1352022327243706379> **Rare** (${counts.Rare}/${totalCounts.Rare}) ${percentages.Rare}%\n` +
			`${createProgressBar(counts.Rare, totalCounts.Rare)}\n\n` +
			`:star2: <:PalSphere_Giga:1352022327243706379> **Lucky Rare** (${counts.Lucky.Rare}/${totalCounts.Rare}) ${percentages.Lucky.Rare}%\n` +
			`${createProgressBar(counts.Lucky.Rare, totalCounts.Rare)}\n\n` +
			`<:PalSphere:1352018389253623809> **Common** (${counts.Common}/${totalCounts.Common}) ${percentages.Common}%\n` +
			`${createProgressBar(counts.Common, totalCounts.Common)}\n\n` +
			`:star2: <:PalSphere:1352018389253623809> **Lucky Common** (${counts.Lucky.Common}/${totalCounts.Common}) ${percentages.Lucky.Common}%\n` +
			`${createProgressBar(counts.Lucky.Common, totalCounts.Common)}`
	    )
	    .setFooter({ text: 'Progress is based on the total number of Pals in each rarity.'});
		replyFunc({ embeds: [embed] });
}

// Add a global helper for creating progress bars
function createProgressBar(current, total, length = 24) {
	if (total <= 0) {
	    return '░'.repeat(length);
	}
	let filled = Math.round((current / total) * length);
	if (filled < 0) filled = 0;
	if (filled > length) filled = length;
	return '█'.repeat(filled) + '░'.repeat(length - filled);
}

module.exports = { paldex, createProgressBar };