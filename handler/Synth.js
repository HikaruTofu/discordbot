// handler/Synth.js
import { Client, Collection } from "discord.js";
import db from 'quick.db';

class SynthClient {
  constructor() {
    this.client = Client;
    this.commands = new Collection(); 
    this.slashCommands = new Collection();
    this.cooldowns = new Collection(); 
    this.aliases = new Collection();
    this.db = db;
    this.recent = new Set();
    this.snipes = new Map();
    this.esnipes = new Map();
  }

  // Metode lainnya sesuai kebutuhan...
}

export default SynthClient; // Pastikan Anda mengekspor dengan 'export default'