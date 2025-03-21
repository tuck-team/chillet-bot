const palList = require("../pal_list.json");
const floor = Math.floor;
const EmbedBuilder = require('discord.js').EmbedBuilder;
let getRandomPalByRarity, getPalImage;

function getinc_child(userPalData, male, female) {
    if (male.breeding_rank && female.breeding_rank) {
        const breedingRank = floor((male.breeding_rank + female.breeding_rank + 1) / 2);
        const palsWithBreedingRank = palList.filter(pal => pal.breeding_rank !== undefined && pal.breeding_rank !== "");
        let closestPal = null;
        if (palsWithBreedingRank.length > 0) {
            let minDifference = Infinity;
            // Find the pal with the closest breeding rank
            palsWithBreedingRank.forEach(pal => {
                const difference = Math.abs(parseInt(pal.breeding_rank) - parseInt(breedingRank));
                if (difference < minDifference) {
                    minDifference = difference;
                    closestPal = pal;
                }
            });
        }
        const child = closestPal ? [closestPal] : [];
        return {
            name: child[0].name,
            rarity: child[0].rarity
        }
    }
    else {
        const random = Math.random() * 100;
        let rarity;
        if (random < (3 * userPalData.multiplier)) {
            rarity = 'Legendary';
        } else if (random < (11 * userPalData.multiplier)) {
            rarity = 'Epic';
        } else if (random < (40 * userPalData.multiplier)) {
            rarity = 'Rare';
        } else {
            rarity = 'Common';
        }
        const palObj = getRandomPalByRarity(rarity);
        return {
            name: palObj.name,
            rarity: rarity
        }
    }
}

function getchild(inc_child, userPalData) {
    return {
        name: inc_child.name,
        rarity: inc_child.rarity,
        isLucky: Math.random() < (0.05 * userPalData.multiplier)
    }
}

async function addCaughtPalv2(userPalData, palName, rarity, isLucky, message) {
  // Check if this is the first time catching this Pal
  const existingPalIndex = userPalData.caughtPals.findIndex(pal => pal.name === palName);
  const isFirstCatch = existingPalIndex === -1;
  let isFirstLucky = false;

  // If this isn't the first catch and the new catch is lucky,
  // check if a lucky version of this pal hasn't been caught previously.
  if (!isFirstCatch && isLucky) {
    const alreadyLuckyExists = userPalData.caughtPals.some(pal => pal.name === palName && pal.isLucky);
    if (!alreadyLuckyExists) {
      isFirstLucky = true;
    }
  }

  if (isFirstCatch || isFirstLucky){
    userPalData.caughtPals.push({
      name: palName,
      rarity: rarity,
      isLucky: isLucky,
      nbCaught: 1,
      rank: 1,
      busy: false,
      caughtAt: new Date().toISOString()
    });
  }
  else if (!isFirstCatch) {
    const palIndex = userPalData.caughtPals.findIndex(
        pal => pal.name === palName && pal.isLucky === isLucky
    );
    if (palIndex !== -1) {
        userPalData.caughtPals[palIndex].nbCaught++;
        if (userPalData.caughtPals[palIndex].nbCaught > Math.pow(4, userPalData.caughtPals[palIndex].rank)) {
          userPalData.caughtPals[palIndex].rank++;
          userPalData.caughtPals[palIndex].nbCaught = 1;
        }
    }
  }
  let description = isLucky
      ? `:star2: It's a **LUCKY** ${palName}, he's so big! :star2:`
      : `It's a **${palName}**!`;

    // Add first catch message if applicable
    let color;
    var goldToAdd = 0;
    if (isFirstCatch) {
      if (rarity === 'Legendary') {
        color = '#FFD700';
        goldToAdd = 1500;
      } else if (rarity === 'Epic') {
        color = '#9B30FF';
        goldToAdd = 800;
      } else if (rarity === 'Rare') {
        color = '#0099ff';
        goldToAdd = 300;
      } else if (rarity === 'Common') {
        color = '#808080';
        goldToAdd = 100;
      }
    }
    if (isLucky) {
      goldToAdd += 1000;
    }
    userPalData.gold += goldToAdd;
    if (isFirstCatch) {
      description += '\n\n<:T_itemicon_PalSphere:1352291984953577542> **FIRST CATCH!** <:T_itemicon_PalSphere:1352291984953577542>\n Gains: **+' + goldToAdd + ' <:Money:1352019542565720168>**';
    }

    // Create embed message
    const embed = new EmbedBuilder()
      .setColor(color)
      .setAuthor({ name: isLucky ? `caught a Lucky ${rarity} Pal!` : `caught a ${rarity} Pal!`, iconURL: message.author.avatarURL() })
      .setDescription(description)
      .setFooter({ text: `${palName} caught so far: ${userPalData.caughtPals.find(pal => pal.name === palName && pal.isLucky === isLucky).nbCaught}` });

    const imageUrl = getPalImage(palName);
    if (imageUrl) {
      embed.setThumbnail(imageUrl);
    }

    // Send embed message
    await message.channel.send({ embeds: [embed] });
}

async function incubateur(messageAuthor, userData, args, replyFunc, message) {
    const userPalData = userData[messageAuthor.id];
    if (userPalData.tier < 5) {
        replyFunc("You need to be at least Tier 5 to use this command.");
        return;
    }
    if (args[0] === "start") {
        const male = userPalData.caughtPals.find(pal => (pal.name === args[1]));
        const female = userPalData.caughtPals.find(pal => (pal.name === args[2]));
        if (!male || !female) {
            replyFunc("You don't have this Pal.");
            return;
        }
        if (args.length < 3) {
            replyFunc("You need to specify a male and a female Pal to start an incubator.");
            return;
        }
        if (male.name === female.name) {
            replyFunc("You can't start an incubator with the same Pal.");
            return;
        }
        if (male.busy || female.busy) {
            replyFunc("You can't start an incubator while one of your Pal is busy.");
            return;
        }
        if (userPalData.incubator.length === userPalData.incubatorSlots) {
            replyFunc("All your incubator slots are already used.\nTry to **claim** your incubator first. (**!incubator claim**)");
            return;
        }
        userPalData.incubator.push({
            child: getinc_child(userPalData, male, female),
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
            addCaughtPalv2(userPalData, child.name, child.rarity, child.isLucky, message);
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

function initializeFunctions(functions) {
  getRandomPalByRarity = functions.getRandomPalByRarity;
  getPalImage = functions.getPalImage;
}

module.exports = { incubateur, initializeFunctions };
