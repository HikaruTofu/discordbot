import SynthClient from './handler/Synth.js';
import setupEvents from './handler/Event.js';
import setupModule from './handler/Module.js';

import dotenv from "dotenv";
import {
    Client,
    GatewayIntentBits,
} from "discord.js";

import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';

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
};

const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    }
});
player.extractors.register(YoutubeiExtractor, {});

dotenv.config();
client.login(process.env.DISCORD_TOKEN).catch(e => console.log(e));