import { EmbedBuilder } from "discord.js"; 
import { QueryType, useMainPlayer } from "discord-player"; // Ensure you have the correct import for QueryType

export default {
  name: "play", // Set the command name
  description: "Play a song in your voice channel", // Set the command description
  options: [
    {
      name: "song",
      type: 3, // STRING type
      description: "The name of the song to play",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const player = useMainPlayer();
    const song = interaction.options.getString('song');

    try {
      await interaction.deferReply(); 

      if (true) { 
        if (!interaction.member.voice.channel) {
          return await interaction.editReply({ content: 'aduh, kamu ada engga ada di voice channel', ephemeral: true });
        }

        // Check if the user is in the same voice channel as the bot
        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
          return await interaction.editReply({ content: 'kita aja di voice channel yang berbeda', ephemeral: true });
        }
      }

      const res = await player.search(song, {
        requestedBy: interaction.member,
        searchEngine: QueryType.AUTO
      });

      if (!res?.tracks.length) {
        return await interaction.editReply({ content: 'maaf, tapi aku engga nemu lagu yang diminta', ephemeral: true });
      }

      // Attempt to play the song
      try {
        const { track } = await player.play(interaction.member.voice.channel, song, {
          nodeOptions: {
            metadata: {
              channel: interaction.channel
            },
            volume: client.config.opt.volume,
            leaveOnEmpty: client.config.opt.leaveOnEmpty,
            leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
            leaveOnEnd: client.config.opt.leaveOnEnd,
            leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
          }
        });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Mencari dan Memasukkan lagu yang diminta ke antrian` }) // Pass an object here
            .setDescription(`\`\`\`${track.title}\`\`\``)
            .setThumbnail(track.thumbnail)
            .setColor('#78ceda');
        await interaction.editReply({ embeds: [embed] })
        setTimeout(async () => {
          await interaction.deleteReply();
      }, 3000);
      } catch (error) {
        console.log(`Play error: ${error}`);
        return await interaction.editReply({ content: 'aduh, aku engga bisa join voice channelnya', ephemeral: true });
      }
    } catch (error) {
      console.error(error); // Handle errors
      await interaction.editReply({ content: 'aduh, ada error pas ngejalanin command ini', ephemeral: true });
    }
  },
};