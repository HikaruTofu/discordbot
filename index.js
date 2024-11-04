import SynthClient from './handler/Synth.js';
import setupEvents from './handler/Event.js';
import setupModule from './handler/Module.js';

import dotenv from "dotenv";
import {
    Client,
    GatewayIntentBits,
} from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
});

const synthClient = new SynthClient(client);
setupEvents(client);
setupModule(client);

dotenv.config();
client.login(process.env.DISCORD_TOKEN).catch(e => console.log(e));