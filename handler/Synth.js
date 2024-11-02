// handler/Synth.js
import { Client, Collection } from "discord.js";
import db from 'quick.db';

class SynthClient {
  constructor() {
    this.client = Client; // Referensi ke Client
    this.commands = new Collection(); // Menyimpan perintah
    this.slashCommands = new Collection(); // Menyimpan perintah slash
    this.cooldowns = new Collection(); // Menyimpan cooldown
    this.aliases = new Collection(); // Menyimpan alias
    this.db = db; // Database
    this.recent = new Set(); // Data terbaru
    this.snipes = new Map(); // Pesan yang dihapus
    this.esnipes = new Map(); // Pesan langsung yang dihapus
  }

  // Metode lainnya sesuai kebutuhan...
}

export default SynthClient; // Mengekspor SynthClient