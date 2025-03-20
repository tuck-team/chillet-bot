const { EmbedBuilder } = require('discord.js');

function pal({ args, pals, replyFunc }, userData, messageAuthor) {
	const palName = args.join(' ');
	const userPalData = userData[messageAuthor.id];

	if (!palName) {
	  replyFunc('Please provide a Pal name!');
	  return;
	}

	const pal = pals.find(p => p.name.toLowerCase() === palName.toLowerCase());
	if (!pal) {
	  replyFunc('Pal not found! Please check the spelling and try again.');
	  return;
	}

	let color;
	switch (pal.rarity) {
	  case 'Legendary':
		color = '#FFD700';
		break;
	  case 'Epic':
		color = '#9B30FF';
		break;
	  case 'Rare':
		color = '#0099ff';
		break;
	  case 'Common':
		color = '#808080';
		break;
	}

	console.log(userPalData.caughtPals.filter(p => p.name === pal.name && !p.isLucky).length, userPalData.caughtPals.filter(p => p.name === pal.name && p.isLucky).length);
	const embed = new EmbedBuilder()
	  .setColor(color)
	  .setTitle(`${pal.name}`)
	  .setDescription(`Rarity: ${pal.rarity}\n *N°${pal.nb_pal}*` +
		`\nNormal catch: **${userPalData.caughtPals.filter(p => p.name === pal.name && !p.isLucky).length}**` +
		`\nLucky catch: **${userPalData.caughtPals.filter(p => p.name === pal.name && p.isLucky).length}**`
	  )
	if (pal.imageUrl) {
	  embed.setImage(pal.imageUrl);
	}

	replyFunc({ embeds: [embed] });
}

module.exports = { pal };
