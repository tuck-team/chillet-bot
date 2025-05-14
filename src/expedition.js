const { EmbedBuilder } = require('discord.js');
const { createProgressBar } = require('./paldex');
const { firepower } = require('./firepower');

function expedition(messageAuthor, userData, args, replyFunc) {
	if (messageAuthor.bot) return; // Ignore bot messages
	const user = userData[messageAuthor.id];
	if (user.tier < 1) {
		replyFunc("You need to be at least Tier 1 to start expeditions.");
		return;
	}
	if (args[0] === "start") {
		if (user.expeditions.length >= user.expeditionslots) { // check if user has available slots
			replyFunc("You have no available slots for expeditions. Upgrade your Tier to unlock more slots.");
			return;
		}
		user.expeditions.push({
			started: new Date().getTime(),
			duration: 36000000, // 10 hours
		});
		replyFunc('✅ Expedition started! You can claim your rewards in 10 hours.');
	}

	else if (args[0] === "claim") {
		const currentTime = new Date().getTime();
		var goldEarned = 0;
		var statues = 0;
		let claimedExpeditions = 0;

		user.expeditions = user.expeditions.filter(expedition => {
			if (expedition.started + expedition.duration <= currentTime) {
				claimedExpeditions++;
				const reward = Math.floor(Math.random() * (700 - 400 + 1)) + 400; // Random reward between 400 and 700
				user.gold += reward; // Add the reward to user's gold
				statues = firepower / 10; // Calculate the number of statues based on firepower
				return false; // Remove completed expedition
			}
			return true; // Keep ongoing expeditions
		});

		if (claimedExpeditions > 0) {
			replyFunc(`You have successfully claimed rewards from ${claimedExpeditions} completed expedition(s).`);
			replyFunc(`Earned ${goldEarned}<:Money:1352019542565720168>`);
			replyFunc(`Earned ${statues}<:lifmunk_effigy:1371757681995546746>`);
		} else {
			replyFunc("You have no completed expeditions to claim.");
		}
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