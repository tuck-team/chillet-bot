const { EmbedBuilder } = require('discord.js');

function pal({ args, pals, replyFunc }) {
	const palName = args.join(' ');
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

	const embed = new EmbedBuilder()
	  .setColor(color)
	  .setTitle(`${pal.name}`)
	  .setDescription(`Rarity: ${pal.rarity}\n *N°${pal.nb_pal}*` )

	if (pal.imageUrl) {
	  embed.setImage(pal.imageUrl);
	}

	replyFunc({ embeds: [embed] });
}

module.exports = { pal };