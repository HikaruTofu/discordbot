import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player'; 

export default {
    name: "remove",
    description: "menghapus suatu lagu diantrian", 
    options: [
        {
            name: "lagu",
            type: 3, 
            description: "nama lagu yang ingin dihapus dari antrian",
            required: false,
        },
        {
            name: "nomor",
            type: 10, 
            description: "nomor lagu yang ingin dihapus dari antrian",
            required: false,
        },
    ],

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
            if (!queue?.isPlaying()) {
                await interaction.editReply({
                    content: 'sedang tidak ada lagu yang diputar loh?',
                });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }

            const number = interaction.options.getNumber('nomor');
            const track = interaction.options.getString('lagu');
            if (!track && !number) {
                interaction.editReply({ content: 'kamu salah prompt, pilih opsi antara nomor atau lagu untuk melanjutkan', ephemeral: true });
                setTimeout(async () => {
                    await interaction.deleteReply();
                }, 4000);
            }

            let trackName;
            if (track) {
                const toRemove = queue.tracks.toArray().find((t) => t.title === track || t.url === track);
                if (!toRemove) {
                    interaction.editReply({ content: 'tidak dapat menghapus lagu yang diminta, apakah kamu yakin itu benar?', ephemeral: true });
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 4000);
                }
                queue.removeTrack(toRemove);
            } else if (number) {
                const index = number - 1;
                const name = queue.tracks.toArray()[index].title;
                if (!name) {
                    interaction.editReply({ content: 'tidak dapat menghapus lagu yang diminta, apakah kamu yakin itu benar?', ephemeral: true });
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 4000);
                }
                queue.removeTrack(index);
                trackName = name;
            }

            const embed = new EmbedBuilder()
            .setTitle('`⏱` | Lagu yang diminta berhasil dihapus dari antrian:')
            .setDescription(`\`\`\`${trackName}\`\`\``)
            .setTimestamp()
            .setColor('#78ceda');
            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error); 
            await interaction.followUp({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}