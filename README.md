# Chillet Bot

Chillet Bot is a Discord bot that lets users catch pals, earn gold, upgrade tiers, and track their progress with features such as a palbox, paldex, and interactive leaderboards.

## Features

- **Pal Catching:** Catch pals of varying rarities (Legendary, Epic, Rare, Common) with bonus rewards on lucky catches!
- **Gold & Upgrades:** Earn gold with each catch and upgrade your tier for better rewards.
- **Paldex & Palbox:** Organize your collection and monitor your progress with detailed statistics.
- **Server Leaderboard:** Compare your progress with other users via live leaderboards.
- **Commands:** Utilize both slash and classic commands such as `!help`, `!pal [name]`, `!gold`, `!paycheck`, and more.

## Installation

1. **Clone the repository:**

    ```sh
    git clone <repository_url>
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Configuration:**
    - Create a `config.json` at the root of the project with a structure similar to:
      ```json
      {
        "token": "YOUR_DISCORD_BOT_TOKEN",
        "clientId": "YOUR_CLIENT_ID",
        "prefix": "!",
        "targetChannelId": "YOUR_TARGET_CHANNEL_ID",
        "commands": {
          "help": ["$help"],
          "config": ["$setPrefix", "$setCooldown"],
          "info": ["$cooldown", "$pal", "$topserv", "$palbox"]
        },
        "cooldownMinutes": 5
      }
      ```
    - Ensure you have a `pal_list.json` file for pal information and, optionally, a `user_data.json` file to store user progress.

4. **Register Slash Commands:**

    ```sh
    npm run register
    ```

5. **Start the Bot:**

    ```sh
    npm start
    ```

## Usage

- **Help Command:** `!help` – Displays a list of all available commands.
- **Pal Command:** `!pal [name]` – Retrieves details for a specified pal.
- **Gold Command:** `!gold` – Shows your current gold balance.
- **Paycheck Command:** `!paycheck` – Claim your regular gold paycheck.
- **Tier Commands:** Use `!tier` to view your current tier and `!tupgrade` to upgrade using gold.
- **Collection Commands:** Use `!palbox` and `!paldex` to view your caught pals and overall collection progress.
- **Configuration Commands:** Change settings with commands like `!setprefix [newPrefix]` and `!setcooldown [minutes]`.

## Contributing

Contributions are welcome! Please submit issues or pull requests with any suggestions or improvements.

## License

This project is licensed under the ISC License.

## Acknowledgements

- Built with [discord.js](https://discord.js.org/).
- Inspired by the unique characters and gameplay dynamics found in Palworld.