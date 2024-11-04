import { GuildMember } from "discord.js";

export const isInVoiceChannel = (interaction) => {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        interaction.reply({
            content: 'aduh, kamu ada engga ada di voice channel', ephemeral: true,
        });
        return false;
    }

    if (
        interaction.guild.members.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    ) {
        interaction.reply({
            content: 'aduh, kita aja di voice channel yang berbeda', ephemeral: true,
        });
        return false;
    }
    return true;
}