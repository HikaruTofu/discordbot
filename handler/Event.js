import { readdirSync } from 'fs';
import chalk from "chalk";
import moment from "moment-timezone";

export default async (client) => {
  const events = readdirSync('./events').filter((file) => file.endsWith(".js"));

  for (const file of events) {
    const DiscordEvent = await import(`../events/${file}`);
    const txtEvent = chalk.bgWhite(`[${moment().tz("Asia/Makassar").format("hh:mm:ss")}]`) + ` ${file.split(".")[0]} > Discord event has been successfully loaded`;
    console.log(txtEvent);
    client.on(file.split(".")[0], DiscordEvent.default.bind(null, client));
  }
};