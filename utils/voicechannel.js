import { GuildMember } from "discord.js";

export const isInVoiceChannel = async (interaction) => {
    // Cek apakah member adalah GuildMember dan apakah dia di voice channel
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'Aduh, kamu tidak ada di voice channel!',
                ephemeral: true,
            });
        }
        return false;
    }

    // Cek apakah bot berada di voice channel yang sama
    const botVoiceChannelId = interaction.guild.members.me.voice.channelId;
    if (botVoiceChannelId && interaction.member.voice.channelId !== botVoiceChannelId) {
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'Aduh, kita di voice channel yang berbeda!',
                ephemeral: true,
            });
        }
        return false;
    }
    
    return true;
}