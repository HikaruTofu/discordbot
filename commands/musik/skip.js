import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
    name: "skip",
    description: "melewati lagu yang sedang dimainkan", 

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
                await interaction.followUp({ content: 'sedang tidak ada lagu yang diputar loh?' });
                setTimeout(async () => {
                    await interaction.deleteReply(); 
                }, 4500);
                return;
            }

            const currentTrack = queue.currentTrack;

            const success = queue.node.skip(); 
            const embed = new EmbedBuilder()
                .setAuthor({ name: success ? `Lagu yang sedang dimainkan berhasil dilewati` : `aduh, ada error pas ngejalanin command ini` }) 
                .setDescription(`\`\`\`${currentTrack.title}\`\`\``)
                .setTimestamp()
                .setColor('#78ceda');

            await interaction.followUp({ embeds: [embed] }); 
            setTimeout(async () => {
                await interaction.deleteReply(); 
            }, 4500);
        } catch (error) {
            console.error(error); 
            await interaction.followUp({
                content: 'aduh, ada error pas ngejalanin command ini: ' + error.message,
            });
        }
    }
}