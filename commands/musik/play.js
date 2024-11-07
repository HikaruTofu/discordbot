import { EmbedBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player'; 

export default {
    name: "play",
    description: "putar lagu", 
    options: [
        {
            name: "query",
            type: 3, 
            description: "mau minta lagu apa?",
            required: true,
        },
    ],

    run: async (client, interaction) => {
        try {
            await interaction.deferReply(); 
            if (true) { 
                if (!interaction.member.voice.channel) {
                  await interaction.editReply({ content: 'aduh, kamu aja tidak berada di voice channel manapun', ephemeral: true })
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
            const query = interaction.options.getString('query');
            const searchResult = await player.search(query, {
                requestedBy: interaction.member,
                searchEngine: QueryType.AUTO,
            });

            if (!searchResult.hasTracks()) { 
                await interaction.  editReply({ content: 'maaf, tapi aku tidak menemukan lagu yang diminta' })
                setTimeout(async () => {
                    await interaction.deleteReply();
                }, 4500);
                return;
            }   

            try {
                const { track } = await player.play(interaction.member.voice.channel, searchResult.tracks[0], { 
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
                    .setTitle('`⏱` | Mencari lagu yang diminta:')
                    .setDescription(`\`\`\`${track.title}\`\`\``)
                    .setColor('#78ceda')
                    .setTimestamp();
                
                await interaction.followUp({ embeds: [embed] }); 
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 5000);
            } catch (error) {
                console.error(error); {
                    await interaction.followUp({ content: 'An error has occurred while trying to play the track.',});
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 4000);
                }
            }
        } catch (error) {
            console.error(error); 
            await interaction.followUp({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}