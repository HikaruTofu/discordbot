import { readdirSync } from 'fs';
import { Client, SlashCommandBuilder } from "discord.js";
import chalk from "chalk";
import moment from "moment-timezone";
import { Player } from 'discord-player';

export default async (client) => {
  // Create a new player instance
  const player = new Player(client); // Ensure this is created before using useMainPlayer
  const events = readdirSync('./events/discord').filter((file) => file.endsWith(".js"));
  const PlayerEvents = readdirSync('./events/player').filter((file) => file.endsWith(".js"));

  for (const file of events) {
    const DiscordEvent = await import(`../events/Discord/${file}`);
    const txtEvent = chalk.bgBlue(`[${moment().tz("Asia/Makassar").format("hh:mm:ss")}]`) + ` ${file.split(".")[0]} > Discord event has been successfully loaded`;
    console.log(txtEvent);
    client.on(file.split(".")[0], DiscordEvent.default.bind(null, client)); // Assuming the event is exported as default
  }

  for (const file of PlayerEvents) {
    const PlayerEvent = await import(`../events/Player/${file}`);
    const eventName = file.split(".")[0];
    const txtEvent = chalk.bgBlue(`[${moment().tz("Asia/Makassar").format("hh:mm:ss")}]`) + ` ${eventName} > Player event has been successfully loaded`;
    console.log(txtEvent);

    // Register the event
    player.events.on(eventName, PlayerEvent.default.bind(null));
    console.log(`Registered player event: ${eventName}`);
  }
};