import { readdirSync } from 'fs'; // Untuk membaca direktori
import {
  Client,
  SlashCommandBuilder,
} from "discord.js"; // Mengimpor kelas dan fungsi dari discord.js
import chalk from "chalk"; // Untuk memberi warna pada output console
import moment from "moment-timezone"; // Untuk menangani waktu dengan zona

export default async (client) => {
  const events = readdirSync('./events/'); // Ambil semua file event dari direktori

  // Loop melalui setiap file event
  for (const event of events) {
    const file = await import(`../events/${event}`); // Impor file event
    // Daftarkan event ke client
    client.on(event.split('.')[0], (...args) => file.default(client, ...args)); // Panggil fungsi default dari file event
    console.log(chalk.bgBlue(`[${moment().tz("Asia/Makassar").format("hh:mm:ss")}]`) + ` Event has been successfully loaded`);
  }
};