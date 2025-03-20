const { EmbedBuilder } = require('discord.js');
const { createProgressBar } = require('./paldex');

function topserv({ userData, pals, replyFunc }) {
	// Get user completion data
    const userCompletions = [];

    for (const userId in userData) {
      if (userData.hasOwnProperty(userId)) {
        const user = userData[userId];

        // Get unique Pals the user has caught
        const uniquePals = new Set();
        user.caughtPals.forEach(pal => uniquePals.add(pal.name));

        // Calculate completion percentage
        const completionPercentage = Math.round((uniquePals.size / pals.length) * 100);

        userCompletions.push({
          id: userId,
          username: user.username,
          uniqueCount: uniquePals.size,
          totalCount: pals.length,
          completionPercentage: completionPercentage,
          luckyCount: user.caughtPals.filter(pal => pal.isLucky).length
        });
      }
    }

    // Sort users by completion percentage in descending order
    userCompletions.sort((a, b) => b.completionPercentage - a.completionPercentage);

    // Create the embed
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Server Paldex Leaderboard')
      .setDescription('Players ranked by Paldex completion percentage')
      .setFooter({ text: 'Completion percentage is based on the total number of unique Pals in the Paldex' });
    // Add the leaderboard
    if (userCompletions.length === 0) {
      embed.addFields({ name: 'No Data', value: 'No players have caught any Pals yet!' });
    } else {
      let leaderboardText = '';
      userCompletions.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        leaderboardText += `${medal} **${user.username}**: ${user.completionPercentage}% (${user.uniqueCount}/${user.totalCount})\n`;
        leaderboardText += `${createProgressBar(user.uniqueCount, user.totalCount)} | ⭐ Lucky: ${user.luckyCount}\n\n`;

        // Break into multiple fields if needed (Discord has a 25 field limit)
        if ((index + 1) % 5 === 0 || index === userCompletions.length - 1) {
          embed.addFields({
            name: index === 4 ? 'Top 5' : index < 10 ? 'Top 10' : `Ranks ${index - 4}-${index + 1}`,
            value: leaderboardText
          });
          leaderboardText = '';
        }
      });
    }

    replyFunc({ embeds: [embed] });
}

module.exports = { topserv };