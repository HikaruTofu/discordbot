import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { isInVoiceChannel } from '../../utils/voicechannel.js'; 

export default {
    name: "skip",
    description: "melewati lagu yang sedang dimainkan", 

    run: async (client, interaction) => {
        try {
            await interaction.deferReply(); // Defer the reply to indicate processing
            const inVoiceChannel = isInVoiceChannel(interaction);
            if (!inVoiceChannel) {
                return; // Early return if not in voice channel
            }

            const queue = useQueue(interaction.guild.id);
            if (!queue || !queue.currentTrack) {
                return await interaction.followUp({ content: 'Sedang tidak ada lagu yang diputar loh' });
            }

            const currentTrack = queue.currentTrack;

            const success = queue.node.skip(); // Attempt to skip the track
            const embed = new EmbedBuilder()
                .setAuthor({ name: success ? `Lagu yang sedang dimainkan berhasil dilewati` : `aduh, ada error pas ngejalanin command ini` }) // Fixed typo here
                .setDescription(`\`\`\`${currentTrack.title}\`\`\``) // Use currentTrack.title for better display
                .setColor('#78ceda');

            await interaction.followUp({ embeds: [embed] }); // Follow up with the embed message
            setTimeout(async () => {
                await interaction.deleteReply(); // Delete the reply after a timeout
            }, 3500);
        } catch (error) {
            console.error(error); // Log the error for debugging
            await interaction.followUp({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}