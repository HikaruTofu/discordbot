import { EmbedBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player';

export default {
    name: "search",
    description: "binggung lagu yang diminta tidak sesuai? cari aja", 
    options: [
        {
            name: "song",
            type: 3, 
            description: "mau cari lagu apa?",
            required: true,
        },
    ],

    run: async (client, interaction) => {
        try {
            await interaction.deferReply(); 
            if (true) { 
                if (!interaction.member.voice.channel) {
                  await interaction.editReply({ content: 'aduh, kamu ada engga ada di voice channel', ephemeral: true })
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

            const player = useMainPlayer();
            const song = interaction.options.getString('song');
        
            const res = await player.search(song, {
                requestedBy: interaction.member,
                searchEngine: QueryType.AUTO
            });
        
            if (!res?.tracks.length) {
                await interaction.followUp({ content: 'maaf, tapi aku tidak menemukan lagu yang diminta' });
                setTimeout(async () => {
                    await interaction.deleteReply();
                }, 4000);
                return;
            }
        
            const queue = player.nodes.create(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                },
                spotifyBridge: client.config.opt.spotifyBridge,
                volume: client.config.opt.defaultvolume,
                leaveOnEnd: client.config.opt.leaveOnEnd,
                leaveOnEmpty: client.config.opt.leaveOnEmpty
            });

            const maxTracks = res.tracks.slice(0, 10);

            const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: `⏱ | Hasil pencarian untuk lagu yang diminta:`})
            .setDescription(`\`\`\`${maxTracks.map((track, i) => `${i + 1}. ${track.title} | ${track.author}`).join('\n')}\`\`\``)
            .setFooter({ text: `pilih lagu antara 1 - ${maxTracks.length} atau cancel` });
        interaction.followUp({ embeds: [embed] });

        const collector = interaction.channel.createMessageCollector({
            time: 15000,
            max: 1,
            errors: ['time'],
            filter: m => m.author.id === interaction.member.id
        });

        collector.on('collect', async (query) => {
            collector.stop();
            if (query.content.toLowerCase() === 'cancel') {
                interaction.followUp({ content: 'okelah, pencarian dibatalkan' });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }

            const value = parseInt(query);
            if (!value || value <= 0 || value > maxTracks.length) {
                interaction.followUp({ content: `response mu salah, coba lagi dari angka \`1 - ${maxTracks.length}\`, \`cancel\` untuk membatalkan` });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                await player.deleteQueue(interaction.guildId);
                interaction.followUp({ content: 'aduh, aku tidak bisa join voice channelmu karena suatu alasan' });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }

            await interaction.followUp({ content: 'mencoba untuk memasukan lagu ke antrian...' });
            setTimeout(async () => {
                await interaction.deleteReply(); 
            }, 4500);
            queue.addTrack(res.tracks[query.content - 1]);

            if (!queue.isPlaying()) await queue.node.play();
        });

        collector.on('end', async (msg, reason) => {
            if (reason === 'time') { 
                interaction.followUp({ content: 'maaf kamu terlalu lambat, waktu habis' });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }
        });

        } catch (error) {
            console.error(error); 
            await interaction.followUp({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}