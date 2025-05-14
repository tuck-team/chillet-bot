const { EmbedBuilder } = require('discord.js');
const { createProgressBar } = require('./paldex');

function firepower(messageAuthor, userData, args, replyFunc) {
	const user = userData[messageAuthor.id];
	var firepower = 0;

    user.caughtPals.forEach(pal => {
        var rarity = pal.rarity === 'Legendary' ? 4 : pal.rarity === 'Epic' ? 3 : pal.rarity === "Rare" ? 2 : 1;
        firepower += (rarity ^ 2) * (pal.tier ^ 2);
    });
    replyFunc(`Your firepower is **${firepower}**!`);
    return firepower;
};

function palFirepower(messageAuthor, userData, args, replyFunc) {
    const user = userData[messageAuthor.id];
    var firepower = 0;
    var pal = user.caughtPals.find(p => p.name.toLowerCase() === args.join(' ').toLowerCase());

    if (!pal) {
        replyFunc(`You don't have a pal with that name!`);
        return;
    }

    var rarity = pal.rarity === 'Legendary' ? 4 : pal.rarity === 'Epic' ? 3 : pal.rarity === "Rare" ? 2 : 1;
    firepower += (rarity ^ 2) * (pal.tier ^ 2);

    replyFunc(`Your ${pal.name}'s firepower is **${firepower}**!`);
    return firepower;
}

module.exports = { firepower, palFirepower };