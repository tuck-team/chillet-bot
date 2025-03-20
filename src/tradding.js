const { EmbedBuilder } = require('discord.js');

function getuserid(message) {
    // Check if there is at least one user mention in the message
    const member = message.mentions.members.first();
    if (!member)
        return message.reply("Please mention a valid user, e.g. @Nemesis.");

    return member.id;
}

function tradp({ args, replyFunc }, userData, messageAuthor, message) {
    const userPalData = userData[messageAuthor.id];
    const palName = args[1].startsWith('<') ? args[0] : args[0] + ' ' + args[1];
    const tradpartner = userData[getuserid(message)];

    console.log(palName);
    if (!tradpartner) {
        replyFunc('User not found!');
        return;
    }
    if (userPalData.tier < 3 || tradpartner.tier < 3) {
        replyFunc('You and your partner need to be at least Tier 3 to use this command!');
        return;
    }
    const userPals = userPalData.caughtPals.filter(p => p.name === palName);
    if (userPals.length === 0) {
        replyFunc('You don\'t have any ' + palName + ' Pals!');
        return;
    }
    userPalData.caughtPals.splice(userPalData.caughtPals.indexOf(userPals[0]), 1);
    tradpartner.caughtPals.push(userPals[0]);
    const pal = userPals[0];
    const embed = new EmbedBuilder()
        .setColor(pal.rarity === 'Legendary' ? '#FFD700' : pal.rarity === 'Epic' ? '#9B30FF' : pal.rarity === 'Rare' ? '#0099ff' : '#808080')
        .setTitle(`${userPalData.username} traded ${pal.name} to ${tradpartner.username}`)
        .setDescription(`${pal.name} has been added to ${tradpartner.username}'s collection!\n${pal.name} has been removed from ${userPalData.username}'s collection!\n`)
        .setThumbnail(pal.imageUrl);
    replyFunc({ embeds: [embed] });
}

function tradg({ args, replyFunc }, userData, messageAuthor, message) {
    const userPalData = userData[messageAuthor.id];
    const nbgold = parseInt(args[0], 10);
    const tradpartner = userData[getuserid(message)];

    if (!tradpartner) {
        replyFunc('User not found!');
        return;
    }
    if (userPalData.tier < 3 || tradpartner.tier < 3) {
        replyFunc('You and your partner need to be at least Tier 3 to use this command!');
        return;
    }
    if (nbgold > userPalData.gold) {
        replyFunc('You don\'t have enough <:Money:1352019542565720168>, you have ' + userPalData.gold + ' <:Money:1352019542565720168> and you need ' + nbgold + ' <:Money:1352019542565720168>!');
        return;
    }
    userPalData.gold -= nbgold;
    tradpartner.gold += nbgold;
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle(`${userPalData.username} give **${nbgold}** <:Money:1352019542565720168> to ${tradpartner.username}`)
        .setDescription(`${userPalData.username} has given **${nbgold}** <:Money:1352019542565720168> to ${tradpartner.username}!\n${tradpartner.username} has received **${nbgold}** <:Money:1352019542565720168> from ${userPalData.username}!\n`)
    replyFunc({ embeds: [embed] });
}

module.exports = { tradp, tradg };
