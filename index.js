import SynthClient from './handler/Synth.js';
import setupEvents from './handler/Event.js';
import setupModule from './handler/Module.js';

import dotenv from "dotenv";
import {
    Client,
    ActivityType,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
} from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ],
});

const synthClient = new SynthClient(client); 
setupEvents(client);
setupModule(client);

dotenv.config();
client.login(process.env.DISCORD_TOKEN).catch(e => console.log(e));