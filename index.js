// Mengimpor modul yang diperlukan
import SynthClient from './handler/Synth.js';
import setupEvents from './handler/Event.js';
import setupModule from './handler/Module.js';
import config from './config/config.js'

import dotenv from "dotenv";
import {
    Client,
    GatewayIntentBits,
} from "discord.js";

import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';

// Membuat instance client Discord dengan niat tertentu
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

// Menginisialisasi SynthClient dan mengatur event serta modul
const synthClient = new SynthClient(client); 
setupEvents(client);
setupModule(client);

client.config = config(client);

const player = new Player(client, client.config.opt.discordPlayer);
player.extractors.register(YoutubeiExtractor, {});

// Memuat variabel lingkungan dan login ke Discord
dotenv.config();
client.login(process.env.DISCORD_TOKEN).catch(e => console.log(e));