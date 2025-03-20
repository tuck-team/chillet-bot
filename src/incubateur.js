const { EmbedBuilder } = require('discord.js');
const { addCaughtPal } = require('./index');

function getinc_child(male, female) {
    return {
        name: "Incubator Child",    //TODO: change name
        rarity: "Legendary"         //TODO: change rarity
    }
}

function getchild(inc_child, userPalData) {
    return {
        name: inc_child.name,
        rarity: inc_child.rarity,
        isLucky: Math.random() < (0.05 * userPalData.multiplier)
    }
}

function incubateur(messageAuthor, userData, args, replyFunc) {
    const userPalData = userData[messageAuthor.id];
    if (userPalData.tier < 5) {
        replyFunc("You need to be at least Tier 5 to use this command.");
        return;
    }
    if (args[0] === "start") {
        if (userPalData.incubator.length === userPalData.incubatorSlots) {
            replyFunc("All your incubator slots are already used.\nTry to **claim** your incubator first. (**!incubator claim**)");
            return;
        }
        userPalData.incubator.push({
            child: getinc_child(args[1], args[2]),
            started: new Date().getTime(),
            duration: 300000,  //5min
        });
    }
    else if (args[0] === "claim") {
        const currentTime = new Date().getTime();
        let claimedIncubators = 0;

        userPalData.incubator = userPalData.incubator.filter(incubator => {
            if (incubator.started + incubator.duration <= currentTime) {
                claimedIncubators++;
                return false;
            }
            const child = getchild(incubator.child, userPalData);
            addCaughtPal(messageAuthor.id, messageAuthor.username, child.name, child.rarity, child.isLucky);
            return true;
        });
        if (claimedIncubators > 0) {
            replyFunc(`You have successfully claimed rewards from ${claimedIncubators} completed incubator(s).`);
        } else {
            replyFunc("You have no completed incubators to claim.");
        }
    }
    else {
        replyFunc("Invalid command. Please use **!incubator start** or **!incubator claim**.");
    }
}

module.exports = { incubateur };
