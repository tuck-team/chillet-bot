const { EmbedBuilder } = require('discord.js');

function expedition(messageAuthor, args, replyFunc) {
	if (messageAuthor.bot) return; // Ignore bot messages

	const embed = new EmbedBuilder()
	  .setAuthor({
		name: "Info",
		iconURL: "https://palworld.gg/_ipx/q_80&s_60x60/images/items/T_itemicon_Weapon_HomingSphereLauncher.png",
	  })
	  .setTitle("Expeditions")
	  .setURL("https://palworld.gg/_ipx/q_80&s_60x60/images/items/T_itemicon_Weapon_HomingSphereLauncher.png")
	  .setDescription("This is an example description. Markdown works too!\n\nhttps://automatic.links\n> Block Quotes\n```\nCode Blocks\n```\n*Emphasis* or _emphasis_\n`Inline code` or ``inline code``\n[Links](https://example.com)\n<@123>, <@!123>, <#123>, <@&123>, @here, @everyone mentions\n||Spoilers||\n~~Strikethrough~~\n**Strong**\n__Underline__")
	  .setThumbnail("https://palworld.gg/images/T_icon_compass_dungeon.png")
	  .setColor("#74b054")
	  .setFooter({
		text: "Unlock more expeditions slots by upgrading your Tier ! `!tier`",
		iconURL: "https://palworld.gg/_ipx/q_80&s_60x60/images/items/T_itemicon_Material_Money.png",
	  })
	  .setTimestamp();

	replyFunc({ embeds: [embed] });
};

module.exports = { expedition };