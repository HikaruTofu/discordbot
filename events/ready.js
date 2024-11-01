// events/ready.js
import chalk from "chalk";
import moment from "moment-timezone";
import fs from "fs";
import { ActivityType } from "discord.js";

const homePath = process.cwd();

export default (client) => {
  	console.log(chalk.bgBlue(`[${moment().tz("Asia/Makassar").format("hh:mm:ss")}]`) + ` Logged In As ${client.user.tag}`);
	client.user.setActivity({
		name: `Honkai: Star Rail`,
		type: ActivityType.Streaming
	  });
};