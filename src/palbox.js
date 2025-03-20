const { EmbedBuilder } = require('discord.js');

function rank_print(pal) {
	let rank = '';
	for (let i = 1; i < pal.rank; i++) {
		rank += '✩';
	}
	return rank;
}

function palbox(messageAuthor, userData, replyFunc) {
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
		counts[pal.rarity] += pal.nbCaught;
		if (pal.isLucky) counts.Lucky += pal.nbCaught;
	});

	// Create embed
	const embed = new EmbedBuilder()
	    .setColor('#0099ff')
		.setAuthor({ name: `${messageAuthor.username}'s Palbox`, iconURL: messageAuthor.avatarURL() })
	    .setDescription(
			`Total Pals: ${counts.Legendary + counts.Epic + counts.Rare + counts.Common}\n` +
			`Legendary: ${counts.Legendary}\n` +
			`Epic: ${counts.Epic}\n` +
			`Rare: ${counts.Rare}\n` +
			`Common: ${counts.Common}\n` +
			`Lucky Pals: ${counts.Lucky}`
	    );

	// Add fields for each rarity
	['Legendary', 'Epic', 'Rare', 'Common'].forEach(rarity => {
		const palsOfRarity = userPalData.caughtPals
			.filter(pal => pal.rarity === rarity)
			.map(pal => `${pal.isLucky ? '⭐ ' : ''}${pal.name} ${rank_print(pal)}`)
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

module.exports = { palbox };