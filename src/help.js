const { EmbedBuilder } = require('discord.js');

function help(messageAuthor, replyFunc) {
	// Create embed
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor({ name: `Chillet - Commands`, iconURL: "https://images-ext-1.discordapp.net/external/hzDCqfprtmio_kYVxRCe_dDEXnuFv4X1Yiiu_B26HK8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1351958685970206720/a_ff53788ebd8e64bd5fa30927360d73f2.gif" })
        .addFields(
            {
                name: "Trading",
                value: (
                    "`/tradp` _-l_ **Palname** **@user** - Trade a Pal to a user, -l to select Lucky Pal\n" +
                    "`/tradg` **amount** **@who** - Trade gold to a user\n"
                ),
                inline: false
            },
            {
                name: "Pals",
                value: (
                    "`/pal` **name** - Check some infos about a Pal\n" +
                    "`/palbox` - View your caught Pals\n" +
                    "`/paldex` - View Paldex completion status\n" +
                    "`/topserv` - View server leaderboard by Paldex completion\n"
                ),
                inline: false
            },
            {
                name: "Economy",
                value: (
                    "`/gold` - Check your gold\n" +
                    "`/paycheck` - Check your paycheck\n" +
                    "`/tier` - Check your tier\n" +
                    "`/tupgrade` - Upgrade your tier\n" 
                ),
                inline: false
            },
            {
                name: "Configuration",
                value: (
                    "`/setcooldown` **minutes** - Set the cooldown time (default: 5)\n" +
                    "`/prefix` **newPrefix** - Change the command prefix\n" +
                    "`/debug` _tool_ - Debug command, developer tool\n"
                ),
                inline: false
            },
            {
                name: "Others",
                value: (
                    "`/help` - Show this help message\n" +
                    "`/cooldown` - Check your cooldown status\n" +
                    "`/expedition` _start/claim_ - Start, consult or claim an expedition\n" +
                    "`/incubator` _start **palA** **palB**/claim_ - Start, consult or hatch an incubator\n"
                ),
                inline: false
            }
        )
        .setDescription(
            "_Italic_ is optional, **bold** is required\n"
        )
        .setFooter({ text: `© Tuck TO` })
        .setTimestamp();
		replyFunc({ embeds: [embed] });
}

module.exports = { help };