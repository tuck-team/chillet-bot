const { EmbedBuilder } = require('discord.js');


function profile(messageAuthor, userData, pals, replyFunc) {
    const userPalData = userData[messageAuthor.id] || { caughtPals: [] };

    const palCounts = userPalData.caughtPals.length;

    const avatarURL = messageAuthor.displayAvatarURL({ dynamic: true, size: 1024 });

    // Create embed
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setThumbnail(avatarURL)
        .setTitle(`**${messageAuthor.username}**`)
        .setDescription(
            `**Total Pals Caught:** ${palCounts}/${pals.length}\n` +
            `**Gold:** ${userPalData.gold}\n` +
            `**Tier:** ${userPalData.tier}\n`
        )
        .setFooter({ text: 'this is a footer, dev forgot to change this, he\'s hella gay.'});
        replyFunc({ embeds: [embed] });
}

module.exports = { profile };