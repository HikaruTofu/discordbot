import { configDotenv } from "dotenv"; 
import { glob } from "glob";
import { REST, Routes } from "discord.js"; 
import { fileURLToPath, pathToFileURL } from "url"; 
import { dirname, resolve } from "path";
import chalk from "chalk";
import moment from "moment-timezone"; 

export default async (client) => {
  configDotenv(); 

  if (!client.slashCommands) {
    client.slashCommands = new Map(); 
  }

  const __filename = fileURLToPath(import.meta.url); 
  const __dirname = dirname(__filename); 

  const slashCommands = await glob(`${process.cwd()}/commands/*/*.js`, { nodir: true });
  const arrayOfSlashCommands = [];

  await Promise.all(slashCommands.map(async (value) => {
    const filePath = pathToFileURL(resolve(value)).href; 
    const file = await import(filePath); 
    const directory = value.split("/").slice(-2, -1)[0]; 

    if (!file?.default?.name) return;

    const properties = { directory, ...file.default }; 
    client.slashCommands.set(file.default.name, properties); 
    if (["MESSAGE", "USER"].includes(file.default.type)) delete file.default.description; 
    arrayOfSlashCommands.push(file.default); 
  }));

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return; 
    const command = client.slashCommands.get(interaction.commandName); 
    if (!command) return; 

    try {
      await command.run(client, interaction);
    } catch (error) {
      console.error(error); 
      await interaction.reply({ content: 'Error executing command!', ephemeral: true }); 
    }
  });

  client.once("ready", async () => {
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

    try {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: arrayOfSlashCommands, 
      });
      console.log(chalk.bgBlue(`[${moment().tz("Asia/Makassar").format("hh:mm:ss")}]`) + ` Slash commands has been successfully registered.`);
    } catch (error) {
      console.error(error); 
    }
  });
};