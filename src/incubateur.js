
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

function addCaughtPalv2(userPalData, palName, rarity, isLucky) {
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
        if (userPalData.caughtPals[palIndex].nbCaught > 4^userPalData.caughtPals[palIndex].rank) {
          userPalData.caughtPals[palIndex].rank++;
          userPalData.caughtPals[palIndex].nbCaught = 1;
        }
    }
  }
}

function incubateur(messageAuthor, userData, args, replyFunc) {
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
            child: getinc_child(male.name, female.name),
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
            addCaughtPalv2(userPalData, child.name, child.rarity, child.isLucky);
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
