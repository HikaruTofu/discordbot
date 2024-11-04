// index.js
import SynthClient from './handler/Synth.js';
import setupEvents from './handler/Event.js';
import setupModule from './handler/Module.js';
import config from './config/config.js'; // Importing the config object

import dotenv from "dotenv";
import {
    Client,
    GatewayIntentBits,
} from "discord.js";

import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';

// Creating an instance of the Discord client with specific intents
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

// Initializing SynthClient and setting up events and modules
const synthClient = new SynthClient(client);
setupEvents(client);
setupModule(client);

// Assigning the config object directly to client.config
client.config = {
    app: {
        extraMessages: false,
        loopMessage: false,
        enableEmojis: false,
    },
    emojis: {
        'back': '⏪',
        'skip': '⏩',
        'ResumePause': '⏯️',
        'savetrack': '💾',
        'volumeUp': '🔊',
        'volumeDown': '🔉',
        'loop': '🔁',
    },
    opt: {
        DJ: {
            enabled: false,
            roleName: '',
            commands: []
        },
        Translate_Timeout: 10000,
        maxVol: 100,
        spotifyBridge: true,
        volume: 75,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 30000,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
}; // No parentheses, since config is not a function

const player = new Player(client, client.config.opt.discordPlayer);
player.extractors.register(YoutubeiExtractor, {});

// Loading environment variables and logging in to Discord
dotenv.config();
client.login(process.env.DISCORD_TOKEN).catch(e => console.log(e));