import { EmbedBuilder } from "discord.js"; 
import { inspect } from 'util'; // Menggunakan import untuk util

const warningTokenMessage = [
  'g'
];

// Ganti dengan ID pengguna yang diizinkan
const allowedUser = ['880075646032834580', '908495264787087361']; // Ganti dengan ID yang sesuai

export default {
  name: "eval",
  description: "Evaluate JavaScript code.",
  options: [
    {
      name: "code",
      type: 3, // STRING type
      description: "The JavaScript code to evaluate.",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    // Memeriksa apakah pengguna diizinkan
    if (!allowedUser.includes(interaction.user.id)) {
      return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
      await interaction.deferReply();

      const code = interaction.options.getString("code");
      let evaled;

      if (code.includes(`token`)) {
        evaled = warningTokenMessage[Math.floor(Math.random() * warningTokenMessage.length)];
        console.log(`${interaction.user.tag} tried to evaluate code that involves tokens and privacy.`);
      } else {
        // Mengemas kode dalam fungsi untuk menggunakan return
        const wrappedCode = `(async () => { return ${code} })();`; // Pastikan ada return
        evaled = await eval(wrappedCode); // Evaluasi kode
      }

      // Cek jika evaled adalah undefined
      if (evaled === undefined) {
        evaled = 'Output is undefined'; // Ganti dengan pesan yang sesuai
      }

      if (typeof evaled !== "string") {
        evaled = inspect(evaled, { depth: 0 }); // Menggunakan inspect dari util
      }

      let output = clean(evaled);
      const embed = new EmbedBuilder()
        .setColor(0x00AE86) // Ganti dengan warna hexadecimal yang valid
        .addFields({ name: "📥 | Input", value: `\`\`\`js\n${code}\`\`\`` });

      if (output.length > 1024) {
        const jsonOutput = JSON.stringify({ output });
        await interaction.editReply({ 
          embeds: [embed.addFields({ name: "📤 | Output", value: "Output too long, sent as JSON." })],
          files: [{ attachment: Buffer.from(jsonOutput), name: 'output.json' }]
        });
      } else {
        embed.addFields({ name: "📤 | Output", value: `\`\`\`js\n${output}\`\`\`` });
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error); // Menangani kesalahan
      const jsonError = JSON.stringify({ error: clean(error) });
      const embed = new EmbedBuilder()
        .setColor(0xFF0000) // Ganti dengan warna hexadecimal yang valid
        .addFields({ name: "❌ | Error", value: "Error occurred, sent as JSON." });

      await interaction.editReply({ 
        embeds: [embed],
        files: [{ attachment: Buffer.from(jsonError), name: 'error.json' }]
      });
    }
  },
};

function clean(text) {
  if (typeof text !== "string") {
    text = inspect(text, { depth: 0 }); // Menggunakan inspect dari util
  }
  return text.replace(/`/g, "`​" + String.fromCharCode(8203)); // Prevents code blocks
}