import { configDotenv } from "dotenv";
import { glob } from "glob"; // No need to promisify
import { REST, Routes, Client } from "discord.js";
import { fileURLToPath, pathToFileURL } from "url"; // Import necessary functions
import { dirname, resolve } from "path"; // Import dirname and resolve

export default async (client) => {
  // Load environment variables
  configDotenv();

  // Ensure slashCommands is initialized
  if (!client.slashCommands) {
    client.slashCommands = new Map(); // Initialize as a Map
  }

  // Get the directory name of the current module
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Slash Commands
  const slashCommands = await glob(`${process.cwd()}/commands/*/*.js`, { nodir: true });
  const arrayOfSlashCommands = [];
  
  // Use Promise.all to wait for all imports to complete
  await Promise.all(slashCommands.map(async (value) => {
    // Convert the path to a file URL
    const filePath = pathToFileURL(resolve(value)).href; // Convert to file URL
    console.log(`Importing: ${filePath}`); // Log the path for debugging
    const file = await import(filePath); // Use dynamic import
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];

    if (!file?.default?.name) return; // Access the default export

    const properties = { directory, ...file.default }; // Use default export
    client.slashCommands.set(file.default.name, properties); // Use client instance

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
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  });

  // Slash Commands Register
  client.once("ready", async () => {
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

    try {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: arrayOfSlashCommands, // Use the correct variable
      });
      console.log('Successfully registered application commands.');
    } catch (error) {
      console.error(error);
    }
  });
};