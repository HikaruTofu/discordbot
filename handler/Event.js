import { readdirSync } from 'fs';
import {
  Client,
  ActivityType,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

export default async (Client) => {
  const events = readdirSync('./events/');

  for (const event of events) {
    const file = await import(`../events/${event}`);
    // Pastikan Anda menggunakan 'client' (huruf kecil) di sini
    Client.on(event.split('.')[0], (...args) => file.default(Client, ...args));
  }
};