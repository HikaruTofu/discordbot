import { EmbedBuilder } from "discord.js"; 
import { useQueue, useMainPlayer } from "discord-player";
import { isInVoiceChannel } from '../../utils/voicechannel.js'; 

export default {
  name: "syncedlyrics", // Set the command name
  description: "membuat lirik sinkron dengan lagu yang sedang dimainkan", // Set the command description

  run: async (client, interaction) => {
    try {
      await interaction.deferReply(); 

      const queue = useQueue(interaction.guild.id); // Initialize the queue here
      const inVoiceChannel = isInVoiceChannel(interaction); // Check if the user is in a voice channel

      if (!inVoiceChannel) {
        return await interaction.followUp({ content: 'Anda tidak berada di dalam saluran suara.' });
      }

      if (!queue?.isPlaying()) {
        return await interaction.followUp({ content: 'Sedang tidak ada lagu yang diputar loh', ephemeral: true });
      }

      const metadataThread = queue.metadata.lyricsThread;
      if (metadataThread && !metadataThread.archived) {
        return await interaction.followUp({ content: `Lirik thread sudah kebuat loh di <${queue.metadata.lyricsThread}>` });
      }

      const player = useMainPlayer();
      const results = await player.lyrics
        .search({
            q: queue.currentTrack.title
        })
        .catch(async (e) => {
            console.log(e);
            return await interaction.followUp({ content: `Mohon maaf, tetapi ada kerusakan saat menjalakannya.` });
        });

      const lyrics = results?.[0];
      if (!lyrics?.plainLyrics) {
        return await interaction.followUp({ content: `Yah, saya gagal untuk mencari liriknya...mau coba lagi?` });
      }

      const thread = await queue.metadata.channel.threads.create({
        name: `Lyrics of ${queue.currentTrack.title}`
      });

      queue.setMetadata({
        channel: queue.metadata.channel,
        lyricsThread: thread
      });

      // Check if syncedLyrics is available
      if (!queue.syncedLyrics) {
        return await interaction.followUp({ content: 'Fitur synced lyrics tidak tersedia untuk lagu ini.', ephemeral: true });
      }

      const syncedLyrics = queue.syncedLyrics(lyrics);
      syncedLyrics.onChange(async (newLyrics) => {
        await thread.send({
          content: newLyrics
        });
      });
      syncedLyrics.subscribe();

      return await interaction.followUp({ content: `Lirik telah berhasil di sinkronkan di <${thread}>!` });
    } catch (error) {
      console.error(error); // Handle errors
      await interaction.followUp({ content: 'Aduh, ada error pas ngejalanin command ini', ephemeral: true });
    }
  },
};