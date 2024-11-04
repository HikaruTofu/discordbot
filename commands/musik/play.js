import { EmbedBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player'; // Ensure QueryType is imported
import { isInVoiceChannel } from '../../utils/voicechannel.js'; 

export default {
    name: "play",
    description: "putar lagu", 
    options: [
        {
            name: "query",
            type: 3, 
            description: "mau cari lagu apa?",
            required: true,
        },
    ],

    run: async (client, interaction) => {
        try {
            await interaction.deferReply(); // Defer the reply to indicate processing
            const inVoiceChannel = isInVoiceChannel(interaction);
            if (!inVoiceChannel) {
                return; // Early return if not in voice channel
            }

            const player = useMainPlayer();
            const query = interaction.options.getString('query');
            const searchResult = await player.search(query, {
                searchEngine: QueryType.AUTO,
            });

            if (!searchResult.hasTracks()) {
                return await interaction.followUp({ content: 'maaf, tapi aku tidak menemukan lagu yang diminta' });
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
                    .setAuthor({ name: `⏱ | Mencari lagu yang diminta` })
                    .setDescription(`\`\`\`${track.title}\`\`\``)
                    .setColor('#78ceda');
                
                await interaction.followUp({ embeds: [embed] }); // Follow up with the embed message
                setTimeout(async () => {
                    await interaction.deleteReply(); // Delete the reply after a timeout
                }, 3500);
            } catch (error) {
                // Handle errors during playback
                console.error(error); // Log the error for debugging
                await interaction.followUp({
                    content: 'An error has occurred while trying to play the track.',
                });
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            await interaction.followUp({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}