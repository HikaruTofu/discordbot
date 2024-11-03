import { configDotenv } from "dotenv"; // Muat variabel lingkungan dari .env
import { glob } from "glob"; // Untuk mengambil file dengan pola tertentu
import { REST, Routes } from "discord.js"; // REST API untuk Discord
import { fileURLToPath, pathToFileURL } from "url"; // Untuk mengonversi URL file
import { dirname, resolve } from "path"; // Untuk menangani path file
import chalk from "chalk"; // Untuk memberi warna pada output console
import moment from "moment-timezone"; // Untuk menangani waktu dengan zona

export default async (client) => {
  configDotenv(); // Muat variabel lingkungan

  // Inisialisasi slashCommands jika belum ada
  if (!client.slashCommands) {
    client.slashCommands = new Map(); // Menggunakan Map untuk menyimpan perintah
  }

  const __filename = fileURLToPath(import.meta.url); // Dapatkan nama file saat ini
  const __dirname = dirname(__filename); // Dapatkan direktori dari file saat ini

  // Ambil semua file perintah slash
  const slashCommands = await glob(`${process.cwd()}/commands/*/*.js`, { nodir: true });
  const arrayOfSlashCommands = [];

  // Impor semua perintah secara dinamis
  await Promise.all(slashCommands.map(async (value) => {
    const filePath = pathToFileURL(resolve(value)).href; // Ubah path ke URL file
    const file = await import(filePath); // Impor file perintah
    const directory = value.split("/").slice(-2, -1)[0]; // Ambil nama direktori

    if (!file?.default?.name) return; // Pastikan ada nama perintah

    const properties = { directory, ...file.default }; // Gabungkan properti
    client.slashCommands.set(file.default.name, properties); // Simpan perintah dalam Map
    if (["MESSAGE", "USER"].includes(file.default.type)) delete file.default.description; // Hapus deskripsi jika perlu
    arrayOfSlashCommands.push(file.default); // Tambahkan ke array perintah
  }));

  // Tangani interaksi perintah
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return; // Pastikan ini adalah perintah

    const command = client.slashCommands.get(interaction.commandName); // Ambil perintah dari Map
    if (!command) return; // Jika tidak ada, keluar

    try {
      await command.run(client, interaction); // Jalankan perintah
    } catch (error) {
      console.error(error); // Log error
      await interaction.reply({ content: 'Error executing command!', ephemeral: true }); // Balas dengan pesan error
    }
  });

  // Daftarkan perintah slash saat client siap
  client.once("ready", async () => {
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN); // Siapkan REST API

    try {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: arrayOfSlashCommands, // Daftarkan perintah
      });
      console.log(chalk.bgBlue(`[${moment().tz("Asia/Makassar").format("hh:mm:ss")}]`) + ` Slash commands has been successfully registered.`);
    } catch (error) {
      console.error(error); // Log error jika gagal
    }
  });
};