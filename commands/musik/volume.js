import { EmbedBuilder } from "discord.js"; 
import { useQueue } from "discord-player";
const maxVol = 100;

export default {
  name: "volume", 
  description: "atur volume baru seberapa besar atau kecil", 
  options: [
    {
        name: "volume",
        type: 10,
        description: "berapa volume yang kamu inginkan?",
        minValue: 1,
        maxValue: maxVol,
        required: true,
      },
  ],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply(); 

      const queue = useQueue(interaction.guild);
      if (!queue?.isPlaying()) return interaction.editReply({ content: 'Sedang tidak ada lagu yang diputar loh', ephemeral: true });

      if (true) { 
        if (!interaction.member.voice.channel) {
          return await interaction.editReply({ content: 'aduh, kamu ada engga ada di voice channel', ephemeral: true });
        }
        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
          return await interaction.editReply({ content: 'kita aja di voice channel yang berbeda', ephemeral: true });
        }
      }

      const vol = interaction.options.getNumber('volume');
      if (queue.node.volume === vol) return interaction.editReply({ content: `volume yang input aja adalah volumeku yang sekarang` });

      const success = queue.node.setVolume(vol);
      const embed = new EmbedBuilder()
        .setAuthor({ name: success ? `Volume telah berhasil diubah ke yang baru ya!` : `aduh, ada error pas ngejalanin command ini`}) 
        .setDescription(`\`\`\`${vol}/${maxVol}\`\`\``)
        .setColor('#78ceda');
      await interaction.editReply({ embeds: [embed] })
      setTimeout(async () => {
        await interaction.deleteReply();
    }, 3000);
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'aduh, ada error pas ngejalanin command ini', ephemeral: true });
    }
  },
};