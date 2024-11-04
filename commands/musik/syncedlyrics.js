import { EmbedBuilder } from "discord.js"; 
import { useQueue, useMainPlayer } from "discord-player";

export default {
  name: "syncedlyrics", // Set the command name
  description: "membuat lirik sinkron dengan lagu yang sedang dimainkan", // Set the command description

  run: async (client, interaction) => {
    try {
      await interaction.deferReply(); 

      const player = useMainPlayer();
      const queue = useQueue(interaction.guild);
      if (!queue?.isPlaying()) return interaction.editReply({ content: 'Sedang tidak ada lagu yang diputar loh', ephemeral: true });

      const metadataThread = queue.metadata.lyricsThread;
      if (metadataThread && !metadataThread.archived) return interaction.editReply({ content: `lirik thread sudah kebuat loh di <${queue.metadata.lyricsThread}>` });

      const results = await player.lyrics
        .search({
            q: queue.currentTrack.title
        })
        .catch(async (e) => {
            console.log(e);
            return inter.editReply({ content: `Mohon maaf, tetapi ada kerusakan saat menjalakannya.` });
        });
      const lyrics = results?.[0];
      
      const embed2 = new EmbedBuilder()
            .setAuthor({ name: `Yah, saya gagal untuk mencari liriknya...mau coba lagi?` }) // Pass an object here
            .setDescription(`\`\`\`${queue.currentTrack.title}\`\`\``)
            .setColor('#78ceda');
      if (!lyrics?.plainLyrics) 
        return interaction.editReply({ embeds: embed2 });
        setTimeout(async () => {
            await interaction.deleteReply();
        }, 3000);

      if (true) { 
        if (!interaction.member.voice.channel) {
          return await interaction.editReply({ content: 'aduh, kamu ada engga ada di voice channel', ephemeral: true });
        }

        // Check if the user is in the same voice channel as the bot
        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
          return await interaction.editReply({ content: 'kita aja di voice channel yang berbeda', ephemeral: true });
        }
      }

      const thread = await queue.metadata.channel.threads.create({
        name: `Lyrics of ${queue.currentTrack.title}`
      });

      queue.setMetadata({
        channel: queue.metadata.channel,
        lyricsThread: thread
      });

      const syncedLyrics = queue?.syncedLyrics(lyrics);
      syncedLyrics.onChange(async (lyrics) => {
        await thread.send({
        content: lyrics
        });
      });
      syncedLyrics?.subscribe();

      return interaction.editReply({ content: `lirik telah berhasil di sinkronkan di <${thread}>!` });
    } catch (error) {
      console.error(error); // Handle errors
      await interaction.editReply({ content: 'aduh, ada error pas ngejalanin command ini', ephemeral: true });
    }
  },
};