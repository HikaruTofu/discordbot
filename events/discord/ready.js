// events/ready.js
import chalk from "chalk"; // Untuk memberi warna pada output console
import moment from "moment-timezone"; // Untuk menangani waktu dengan zona
import fs from "fs"; // Untuk operasi file (meskipun tidak digunakan di sini)
import { ActivityType } from "discord.js"; // Untuk jenis aktivitas di Discord

const homePath = process.cwd(); // Mendapatkan direktori kerja saat ini

export default (client) => {
  // Menampilkan pesan di console saat bot siap
  console.log(chalk.bgBlue(`[${moment().tz("Asia/Makassar").format("hh:mm:ss")}]`) + ` Logged In As ${client.user.tag}`);
  
  // Mengatur aktivitas bot
  client.user.setActivity({
    name: `Robin Album`, // Nama aktivitas
    type: ActivityType.Listening // Tipe aktivitas
  });
};