import { EmbedBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player'; 

export default {
    name: "resume",
    description: "melanjutkan lagu yang diberhentikan", 

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

            const queue = useQueue(interaction.guild.id);
            if (!queue || !queue.currentTrack) {
                await interaction.followUp({
                    content: 'sedang tidak ada lagu yang diputar loh?',
                });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }

            if (queue.node.isPlaying()) {
                interaction.followUp({
                    content: 'kamu mau nge-resume apaan? lagunya aja masih jalan',
                });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }

            const success = queue.node.resume();
            const embed = new EmbedBuilder()
            .setDescription(success ? 'Lagu yang sedang berhenti kembali dilanjutkan!' : 'Lagu tidak dapat dilanjutkan')
            .setTimestamp()
            .setColor('#78ceda');
            return await interaction.followUp({ embeds: [embed] }); 
        } catch (error) {
            console.error(error); 
            await interaction.followUp({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}