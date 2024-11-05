import { EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

const maxVol = 100;

export default {
    name: "volume",
    description: "atur volume mau seberapa besar atau kecil", 
    options: [
        {
            name: "volume",
            type: 4, 
            description: "berapa volume yang kamu inginkan?",
            minValue: 1,
            maxValue: maxVol,
            required: true,
        },
    ],

    run: async (client, interaction) => {
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

        const vol = interaction.options.getInteger('volume'); 

        const queue = useQueue(interaction.guild.id); 
        if (!queue?.isPlaying()) {
            await interaction.followUp({ content: 'Sedang tidak ada lagu yang diputar loh', ephemeral: true });
            setTimeout(async () => {
                await interaction.deleteReply(); 
            }, 4500);
            return;
        }

        if (queue.node.volume === vol) {
            await interaction.followUp({ content: `Volume yang input adalah volumeku yang sekarang!` });
            setTimeout(async () => {
                await interaction.deleteReply(); 
            }, 4500);
            return;
        }

        const success = queue.node.setVolume(vol);
        const embed = new EmbedBuilder()
            .setAuthor({ name: success ? `🔊 | Volume telah berhasil diubah ke yang baru ya!` : `aduh, ada error pas ngejalanin command ini` })
            .setDescription(`\`\`\`${vol}/${maxVol}\`\`\``)
            .setTimestamp()
            .setColor('#78ceda');
        await interaction.followUp({ embeds: [embed] });     
    }
}