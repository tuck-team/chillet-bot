const { EmbedBuilder } = require('discord.js');
const { createProgressBar } = require('./paldex');

function expedition(messageAuthor, userData, args, replyFunc) {
	if (messageAuthor.bot) return; // Ignore bot messages
	const user = userData[messageAuthor.id];

	if (args[0] === "start") {
		user.expeditions.push({
			started: new Date().getTime(),
			duration: 36000000, // 10 hours
		});
	}

	else if (args[0] === "claim") {
		user.expeditions.push({
			started: new Date().getTime(),
			duration: 10,
		});
	}

	else {
		const totalExpeditions = user.expeditions.length;
		var description;

		description = user.expeditions.map(expedition =>
			`  - **Started:** ${new Date(expedition.started).toLocaleString()}\n` +
			`  - **Duration:** ${expedition.duration / 3600000}h\n` + // Convert milliseconds to hours
			`  - ${createProgressBar(new Date().getTime() - expedition.started, expedition.duration)}\n\n`
		).join("\n");

		const embed = new EmbedBuilder()
			.setAuthor({ name: `${messageAuthor.username}'s Expeditions`, iconURL: messageAuthor.avatarURL() })
			.setTitle(`You have ${totalExpeditions} expeditions running.`)
			.setDescription("Expeditions are a great way to earn rewards while you're away. Send your Pals on expeditions to gather resources, and come back later to claim your rewards!\n" +
				"• `!expedition start <expedition> <pal1> <pal2> <pal3>`\n" +
				"• `!expedition claim <expedition>`\n\n" +
				`You have **${user.expeditionslots - totalExpeditions}/${user.expeditionslots}** slots available.\n\n` +
				description
				)
			.setThumbnail("https://palworld.gg/images/T_icon_compass_dungeon.png")
			.setColor("#74b054")
			.setFooter({
				text: "Unlock more expeditions slots by upgrading your Tier. • !tier",
				iconURL: "https://palworld.gg/_ipx/q_80&s_60x60/images/items/T_itemicon_Material_Money.png",
			})
			.setTimestamp();

		replyFunc({ embeds: [embed] });
	}
};

module.exports = { expedition };