import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { isInVoiceChannel } from '../../utils/voicechannel.js'; 

export default {
    name: "stop",
    description: "memberhentikan lagu yang sedang dimainkan", 

    run: async (client, interaction) => {
        try {
            await interaction.deferReply(); // Defer the reply to indicate processing
            const inVoiceChannel = isInVoiceChannel(interaction);
            if (!inVoiceChannel) {
                return await interaction.followUp({ content: 'Anda tidak berada di dalam saluran suara.' });
            }

            const queue = useQueue(interaction.guild.id);
            if (!queue || !queue.currentTrack) {
                return await interaction.followUp({
                    content: 'Sedang tidak ada lagu yang diputar loh',
                });
            }

            queue.node.stop(); // Stop the current track
            queue.delete(); // Clear the queue

            const embed = new EmbedBuilder()
                .setDescription(`Lagu yang sekarang dimainkan sudah berhasil saya berhentikan!`)
                .setColor('#78ceda');

            return await interaction.followUp({ embeds: [embed] }); // Send the response
        } catch (error) {
            console.error(error); // Log the error for debugging
            await interaction.followUp({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}