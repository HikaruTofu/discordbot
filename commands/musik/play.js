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
    let defaultEmbed = new EmbedBuilder().setColor('#2f3136');
    let errorEmbed = new EmbedBuilder().setColor('#ff0000'); // Error embed

    try {
      await interaction.deferReply(); // Defer the reply

      // Check if the command requires the user to be in a voice channel
      if (true) { // Replace `true` with your condition to check if the command requires voice channel
        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
          errorEmbed.setDescription(`<❌> | You are not in a Voice Channel`);
          return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        // Check if the user is in the same voice channel as the bot
        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
          errorEmbed.setDescription(`<❌> | You are not in the same Voice Channel`);
          return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
      }

      // Search for the song
      const res = await player.search(song, {
        requestedBy: interaction.member,
        searchEngine: QueryType.AUTO
      });

      if (!res?.tracks.length) {
        defaultEmbed.setAuthor({ name: `No results found... try again ? <❌>` });
        return interaction.editReply({ embeds: [defaultEmbed] });
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

        defaultEmbed.setAuthor({ name: `Loading <${track.title}> to the queue... <✅>` });
        await interaction.editReply({ embeds: [defaultEmbed] });
      } catch (error) {
        console.log(`Play error: ${error}`);
        defaultEmbed.setAuthor({ name: `I can't join the voice channel... try again ? <❌>` });
        return interaction.editReply({ embeds: [defaultEmbed] });
      }
    } catch (error) {
      console.error(error); // Handle errors
      await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};