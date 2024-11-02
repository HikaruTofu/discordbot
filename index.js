// Mengimpor modul yang diperlukan
import SynthClient from './handler/Synth.js';
import setupEvents from './handler/Event.js';
import setupModule from './handler/Module.js';
import dotenv from "dotenv";
import {
    Client,
    GatewayIntentBits,
} from "discord.js";

// Membuat instance client Discord dengan niat tertentu
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
    ],
});

// Menginisialisasi SynthClient dan mengatur event serta modul
const synthClient = new SynthClient(client); 
setupEvents(client);
setupModule(client);

// Memuat variabel lingkungan dan login ke Discord
dotenv.config();
client.login(process.env.DISCORD_TOKEN).catch(e => console.log(e));