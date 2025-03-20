const { EmbedBuilder } = require('discord.js');

function debug(messageAuthor, message, args, replyFunc) {
    if (messageAuthor.bot) return; // Ignore bot messages

    if (args.length === 0) {
        replyFunc('Please provide a debug argument: `channelid`, `testembed`');
        return;
    }

    if (args[0] === 'channelid'){
        replyFunc(`The channel ID is: ${message.channel.id}`);
    }
    else if (args[0] === 'testembed') {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Info",
            iconURL: "https://palworld.gg/_ipx/q_80&s_60x60/images/items/T_itemicon_Weapon_HomingSphereLauncher.png",
          })
          .setTitle("Example Title")
          .setURL("https://palworld.gg/_ipx/q_80&s_60x60/images/items/T_itemicon_Weapon_HomingSphereLauncher.png")
          .setDescription("This is an example description. Markdown works too!\n\nhttps://automatic.links\n> Block Quotes\n```\nCode Blocks\n```\n*Emphasis* or _emphasis_\n`Inline code` or ``inline code``\n[Links](https://example.com)\n<@123>, <@!123>, <#123>, <@&123>, @here, @everyone mentions\n||Spoilers||\n~~Strikethrough~~\n**Strong**\n__Underline__")
          .addFields(
            {
              name: "Field Name",
              value: "This is the field value.",
              inline: false
            },
            {
              name: "The first inline field.",
              value: "This field is inline.",
              inline: true
            },
            {
              name: "The second inline field.",
              value: "Inline fields are stacked next to each other.",
              inline: true
            },
            {
              name: "The third inline field.",
              value: "You can have up to 3 inline fields in a row.",
              inline: true
            },
            {
              name: "Even if the next field is inline...",
              value: "It won't stack with the previous inline fields.",
              inline: true
            },
          )
          .setImage("https://cdn.donmai.us/original/f9/f2/__vladilena_millize_86_eightysix_drawn_by_flippy_cripine111__f9f2a9a31c581dca27e0fe16ed46f5a8.jpg")
          .setThumbnail("https://palworld.gg/_ipx/q_80&s_60x60/images/items/T_itemicon_Weapon_HomingSphereLauncher.png")
          .setColor("#74b054")
          .setFooter({
            text: "Example Footer",
            iconURL: "https://slate.dan.onl/slate.png",
          })
          .setTimestamp();

	    replyFunc({ embeds: [embed] });
    }
};

module.exports = { debug };