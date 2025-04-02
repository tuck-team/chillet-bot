const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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

	// Create pages for each rarity
	const rarities = ['Legendary', 'Epic', 'Rare', 'Common'];
	const pages = rarities.map(rarity => {
		const palsOfRarity = userPalData.caughtPals
			.filter(pal => pal.rarity === rarity)
			.map(pal => `${pal.isLucky ? '⭐ ' : ''}${pal.name} ${rank_print(pal)}`)
			.join('\n') || 'None';

		return new EmbedBuilder()
			.setColor('#0099ff')
			.setAuthor({ name: `${messageAuthor.username}'s Palbox`, iconURL: messageAuthor.avatarURL() })
			.setTitle(`${rarity} Pals`)
			.setDescription(palsOfRarity)
			.setFooter({ text: `Completion: ${counts[rarity]} caught` });
	});

	let currentPage = 0;

	// Create buttons
	const buttons = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('Legendary')
				.setEmoji('<:T_itemicon_PalSphere_Exotic:1352292228105764906>')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('Epic')
				.setEmoji('<:T_itemicon_PalSphere_Master:1352292134136320033>')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('Rare')
				.setEmoji('<:T_itemicon_PalSphere_Giga:1352292073616707718>')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('Common')
				.setEmoji('<:T_itemicon_PalSphere:1352291984953577542>')
				.setStyle(ButtonStyle.Secondary)
		);

	// Send initial message
	replyFunc({ embeds: [pages[currentPage]], components: [buttons] }).then(sentMessage => {
		const collector = sentMessage.createMessageComponentCollector({ time: 60000 });

		collector.on('collect', interaction => {
			if (interaction.user.id !== messageAuthor.id) {
				interaction.reply({ content: 'These buttons are not for you!', ephemeral: true });
				return;
			}

			if (interaction.customId === 'Legendary') {
				currentPage = rarities.indexOf('Legendary');
			} else if (interaction.customId === 'Epic') {
				currentPage = rarities.indexOf('Epic');
			} else if (interaction.customId === 'Rare') {
				currentPage = rarities.indexOf('Rare');
			} else if (interaction.customId === 'Common') {
				currentPage = rarities.indexOf('Common');
			}

			interaction.update({ embeds: [pages[currentPage]], components: [buttons] });
		});

		collector.on('end', () => {
			sentMessage.edit({ components: [] });
		});
	});
}

module.exports = { palbox };