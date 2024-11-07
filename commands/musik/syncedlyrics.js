import { EmbedBuilder } from "discord.js"; 
import { useQueue, useMainPlayer } from "discord-player";

export default {
    name: "syncedlyrics", 
    description: "Membuat lirik sinkron dengan lagu yang sedang dimainkan", 

    run: async (client, interaction) => {
      try {
        await interaction.deferReply(); 
          if (true) { 
            if (!interaction.member.voice.channel) {
              await interaction.editReply({ content: 'aduh, kamu aja tidak berada di voice channel manapun', ephemeral: true });
              setTimeout(async () => {
                await interaction.deleteReply();
              }, 4000);
            return;
          }
          if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
              await interaction.editReply({ content: 'kita aja di voice channel yang berbeda', ephemeral: true });
            return;
          }
      }     

      const metadataThread = queue.metadata.lyricsThread;
      if (metadataThread && !metadataThread.archived) {
        await interaction.editReply({ 
          content: `Lirik thread sudah dibuat di ${metadataThread}, ngapain mau buat lagi?` 
        });
        setTimeout(async () => {
          await interaction.deleteReply(); 
        }, 5500);
        return;
      }

      const player = useMainPlayer();
      const results = await player.lyrics
        .search({ q: queue.currentTrack.title })
        .catch(async (e) => {
          console.log(e);
          await interaction.editReply({ 
            content: `Mohon maaf, tetapi ada kesalahan saat menjalankannya.` 
          });
          setTimeout(async () => {
            await interaction.deleteReply(); 
          }, 4500);
          return;
        });

      const lyrics = results?.[0];
      if (!lyrics?.plainLyrics) {
        await interaction.editReply({ 
          content: `Yah, saya gagal untuk mencari liriknya... mau coba lagi?` 
        });
        setTimeout(async () => {
          await interaction.deleteReply(); 
        }, 4500);
        return;
      }

      const thread = await queue.metadata.channel.threads.create({
        name: `Lirik dari ${queue.currentTrack.title}`
      });

      queue.setMetadata({
        channel: queue.metadata.channel,
        lyricsThread: thread
      });

      if (!queue.syncedLyrics) {
        await interaction.followUp({ 
          content: 'Yah, fitur synced lyrics lagi tidak tersedia untuk lagu ini', 
          ephemeral: true 
        });
        setTimeout(async () => {
          await interaction.deleteReply(); 
        }, 4500);
        return;
      }

      const syncedLyrics = queue.syncedLyrics(lyrics);
      syncedLyrics.onChange(async (newLyrics) => {
        await thread.send({ content: newLyrics });
      });
      syncedLyrics.subscribe();

      const embed = new EmbedBuilder()
        .setDescription(`Lirik telah berhasil saya sinkronkan di ${thread}!`)
        .setTimestamp()
        .setColor('#78ceda');
      return await interaction.followUp({ embeds: [embed] }); 
    } catch (error) {
      console.error(error);
      await interaction.followUp({ 
        content: 'Aduh, ada error pas menjalankan command ini', 
        ephemeral: true 
      });
    }
  },
};