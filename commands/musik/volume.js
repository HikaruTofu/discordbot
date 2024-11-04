import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { isInVoiceChannel } from '../../utils/voicechannel.js'; 

const maxVol = 100;

export default {
    name: "volume",
    description: "atur volume mau seberapa besar atau kecil", 
    options: [
        {
            name: "volume",
            type: 4, // Corrected to INTEGER type
            description: "berapa volume yang kamu inginkan?",
            minValue: 1,
            maxValue: maxVol,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        await interaction.deferReply(); // Defer the reply to indicate processing

        const vol = interaction.options.getInteger('volume'); // Get the volume from interaction options
        const inVoiceChannel = isInVoiceChannel(interaction); // Check if the user is in a voice channel

        // Get the queue after checking if the user is in a voice channel
        if (!inVoiceChannel) {
            return await interaction.followUp({ content: 'Anda tidak berada di dalam saluran suara.' });
        }

        const queue = useQueue(interaction.guild.id); // Now we can safely get the queue
        if (!queue?.isPlaying()) {
            return await interaction.followUp({ content: 'Sedang tidak ada lagu yang diputar loh', ephemeral: true });
        }

        // Check if the current volume is the same as the requested volume
        if (queue.node.volume === vol) {
            return await interaction.followUp({ content: `Volume yang input aja adalah volumeku yang sekarang` });
        }

        // Set the volume
        const success = queue.node.setVolume(vol);

        // Create the embed response
        const embed = new EmbedBuilder()
            .setAuthor({ name: success ? `🔊 | Volume telah berhasil diubah ke yang baru ya!` : `aduh, ada error pas ngejalanin command ini` })
            .setDescription(`\`\`\`${vol}/${maxVol}\`\`\``)
            .setColor('#78ceda');

        // Send the response
        await interaction.followUp({ embeds: [embed] });
        
        // Optional: If you want to delete the reply after a timeout
        setTimeout(async () => {
            try {
                await interaction.deleteReply(); // This will fail if the reply has already been deleted
            } catch (err) {
                console.error('Failed to delete reply:', err); // Log the error if deletion fails
            }
        }, 3000);
    }
}