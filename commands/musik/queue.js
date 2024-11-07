import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player'; 

export default {
    name: "queue",
    description: "menunjukkan antrian lagu", 

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

            const queue = useQueue(interaction.guild.id);
            if (!queue || !queue.currentTrack) {
                await interaction.editReply({
                    content: 'sedang tidak ada lagu yang diputar loh?',
                });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }
            const tracksArray = queue.tracks.toArray(); 
            if (tracksArray.length === 0) {
                await interaction.editReply({
                    content: 'tidak ada sama sekali lagu selanjutnya di antrian loh?',
                });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }

            const songs = tracksArray.length;
            const nextSongs = songs > 15 ? `dan ${songs - 15} lainnya diantrian berikutnya!` : `tidak ada lagu selanjutnya di antrian!`;
            const maxTracks = tracksArray.slice(0, 15); 

            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setTitle('`🎶` | Antrian lagu selanjutnya:')
                .setDescription(`\`\`\`${maxTracks.map((track, i) => `${i + 1}. ${track.title} - ${track.author}`).join('\n')}\`\`\``)
                .setFooter({ text: nextSongs });

            await interaction.editReply({ embeds: [embed] }); // Make sure to await this
        } catch (error) {
            console.error(error); 
            await interaction.editReply({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}