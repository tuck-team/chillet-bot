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
    else if (args[0] === 'testemoji') {
      const embedmoney = new EmbedBuilder()
      .setTitle("Money")
      .setColor("#74b054");
      replyFunc({ embeds: [embedmoney] });
      replyFunc(`<:Money:1352019542565720168>`);

      const embedspheres = new EmbedBuilder()
      .setTitle("Spheres")
      .setColor("#74b054");
      replyFunc({ embeds: [embedspheres] });
      replyFunc(`<:T_itemicon_PalSphere:1352291984953577542><:T_itemicon_PalSphere_Mega:1352292054679552050><:T_itemicon_PalSphere_Giga:1352292073616707718><:T_itemicon_PalSphere_Tera:1352292095842586747><:T_itemicon_PalSphere_Master:1352292134136320033><:T_itemicon_PalSphere_Legend:1352292167623905300><:T_itemicon_PalSphere_Robbery:1352292188142305351><:T_itemicon_PalSphere_Ultimate:1352292204609015858><:T_itemicon_PalSphere_Exotic:1352292228105764906>`);

      const embedmedals = new EmbedBuilder()
      .setTitle("Medals")
      .setColor("#74b054");
      replyFunc({ embeds: [embedmedals] });
      replyFunc(`<:1_:1356058529105973319><:2_:1356058541739216926><:3_:1356058550362964238><:4_:1356058558004990145><:5_:1356058565747408896><:6_:1356058574727680010><:7_:1356058586098171976><:8_:1356058595707322511><:9_:1356058604377215076><:10:1356058615873802420><:11:1356058632198029365><:12:1356058640657678376><:13:1356058654335439039><:14:1356058664552759549><:15:1356058673918513304>\n<:16:1356058682949107723><:17:1356058691153170462><:18:1356058704709156894><:19:1356058717535076402><:20:1356058728083882246><:21:1356058745796558898><:22:1356058759109279804><:23:1356058769641177128><:24:1356058781167128746><:25:1356058796904026205><:26:1356058805183451301><:27:1356058815539187904><:28:1356058825890988063>`);
  }
  else if (args[0] === 'testreact') {
    message.react('✅');
  }
  else if (args[0] === 'testmp') {
    message.author.send("This is a test message sent in DM.");
  }

};

module.exports = { debug };