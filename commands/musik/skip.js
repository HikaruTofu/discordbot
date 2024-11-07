import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
    name: "skip",
    description: "melewati lagu yang sedang dimainkan", 

    run: async (client, interaction) => {
        try {
            await interaction.deferReply(); 
            if (!interaction.member.voice.channel) {
                await interaction.editReply({ content: 'aduh, kamu aja tidak berada di voice channel manapun', ephemeral: true });
                return;
            }
            if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
                await interaction.editReply({ content: 'kita aja di voice channel yang berbeda', ephemeral: true });
                return;
            }

            const queue = useQueue(interaction.guild.id);
            if (!queue || !queue.currentTrack) {
                await interaction.editReply({ content: 'sedang tidak ada lagu yang diputar loh?' });
                return;
            }

            const currentTrack = queue.currentTrack;

            const success = queue.node.skip(); 
            const embed = new EmbedBuilder()
                .setAuthor({ name: success ? `Lagu yang sedang dimainkan berhasil dilewati` : `aduh, ada error pas ngejalanin command ini` }) 
                .setDescription(`\`\`\`${currentTrack.title}\`\`\``)
                .setTimestamp()
                .setColor('#78ceda');

            const reply = await interaction.followUp({ embeds: [embed] }); 

            // Use a timeout to delete the reply after a certain period
            setTimeout(async () => {
                try {
                    await reply.delete(); // Delete the reply message
                } catch (err) {
                    console.error('Failed to delete message:', err);
                }
            }, 4500);
        } catch (error) {
            console.error(error); 
            await interaction.editReply({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}