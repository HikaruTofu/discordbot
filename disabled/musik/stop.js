import { EmbedBuilder } from "discord.js"; 
import { useQueue } from "discord-player";

export default {
  name: "stop", // Set the command name
  description: "memberhentikan lagu yang sedang dimainkan", // Set the command description

  run: async (client, interaction) => {
    try {
      await interaction.deferReply(); 

        const queue = useQueue(interaction.guild);
        if (!queue?.isPlaying()) return interaction.editReply({ content: 'Sedang tidak ada lagu yang diputar loh', ephemeral: true });

        queue.delete();

      if (true) { 
        if (!interaction.member.voice.channel) {
          return await interaction.editReply({ content: 'aduh, kamu ada engga ada di voice channel', ephemeral: true });
        }

        // Check if the user is in the same voice channel as the bot
        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
          return await interaction.editReply({ content: 'kita aja di voice channel yang berbeda', ephemeral: true });
        }
      }

        const embed = new EmbedBuilder()
        .setDescription(`Lagu yang sekarang dimainkan sudah berhasil saya berhentikan!`)
        .setColor('#78ceda');
        await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.error(error); // Handle errors
      await interaction.editReply({ content: 'aduh, ada error pas ngejalanin command ini', ephemeral: true });
    }
  },
};