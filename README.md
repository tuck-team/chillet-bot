# Auto-Mudae

A Discord bot for automating interactions with the Mudae bot.

## Features

- Auto-rolling for characters at configurable intervals
- Auto-claiming characters you want
- Auto-collecting kakera
- Daily command automation ($daily, $dk, etc.)
- Easy configuration via Discord commands

## Setup

1. **Create a Discord Bot**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name
   - Go to the "Bot" tab and click "Add Bot"
   - Under "Privileged Gateway Intents", enable all intents
   - Copy your bot token (keep this secret!)

2. **Invite your bot to your server**
   - Go to OAuth2 > URL Generator
   - Select the following scopes: `bot`, `applications.commands`
   - Select the following bot permissions: `Read Messages/View Channels`, `Send Messages`, `Read Message History`, `Add Reactions`
   - Copy the generated URL and open it in your browser to invite the bot

3. **Configure the bot**
   - Run the bot once to generate the config.json file
   - Edit the config.json file and add your bot token
   - Start the bot again
   - In Discord, use the `!setchannel` command in the channel where you want the bot to operate

## Usage

The bot uses the prefix `!` for commands:

- `!help` - Show available commands
- `!status` - Show current bot status and settings
- `!roll` - Manually trigger roll commands
- `!daily` - Manually trigger daily commands
- `!toggle autoRoll` - Toggle automatic rolling on/off
- `!toggle autoClaim` - Toggle automatic claiming on/off
- `!toggle autoDaily` - Toggle automatic daily commands on/off
- `!toggle autoKakera` - Toggle automatic kakera collection on/off
- `!add [character]` - Add a character to your auto-claim list
- `!remove [character]` - Remove a character from your auto-claim list
- `!setchannel` - Set the current channel as the target for commands

## Running the Bot

1. Install dependencies:
   ```
   npm install
   ```

2. Start the bot:
   ```
   npm start
   ```

## Disclaimer

Using automation with Discord bots might violate Discord's Terms of Service or Mudae's rules. Use at your own risk.