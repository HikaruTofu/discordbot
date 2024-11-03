import { EmbedBuilder } from "discord.js";

export default {
  name: "server",
  description: "memberikan informasi tentang server",

  run: async (client, interaction) => {
    await interaction.deferReply();

    // Use numeric values for channel types
    const text = interaction.guild.channels.cache.filter(r => r.type === 0).size; // GUILD_TEXT is 0
    const voice = interaction.guild.channels.cache.filter(r => r.type === 2).size; // GUILD_VOICE is 2
    const chs = interaction.guild.channels.cache.size;
    const rolesCount = interaction.guild.roles.cache.size;
    const roles = interaction.guild.roles.cache.map(role => role.toString()).join(" ");
    const rolesList = roles.replace("@everyone", "");
    const emojiSize = interaction.guild.emojis.cache.size;
    const emojis = interaction.guild.emojis.cache.map(emoji => emoji.toString()).join(" ");
    const region = interaction.guild.preferredLocale; // Use preferredLocale instead of region
    const regionUp = region.charAt(0).toUpperCase() + region.slice(1);
    let owner = await client.users.fetch(interaction.guild.ownerId).then(o => o.tag);

    let embed = new EmbedBuilder()
      .setAuthor({ name: `Server Information`, iconURL: interaction.guild.iconURL() })
      .setColor('#78ceda')
      .addFields(
        { name: "Guild Owner", value: `${owner}`, inline: true },
        { name: "Region", value: `${regionUp}`, inline: true },
        { name: "Server ID", value: `${interaction.guild.id}`, inline: true },
        { name: "Created At", value: interaction.guild.createdAt.toLocaleString(), inline: true },
        { name: `Server Boost Tier`, value: `${interaction.guild.premiumTier || 'Zero Tier'}`, inline: true },
        { name: `Server Boosts`, value: `${interaction.guild.premiumSubscriptionCount || 'No Boost'}`, inline: true },
        { name: "Verification Level", value: `${interaction.guild.verificationLevel}`, inline: true },
        { name: `Channels **(${chs})**`, value: `Text Channel - **${text}** ┇ Voice Channel - **${voice}**`, inline: true },
        { name: `Total | Members | BOT`, value: `${interaction.guild.members.cache.size} | ${interaction.guild.members.cache.filter(member => !member.user.bot).size} | ${interaction.guild.members.cache.filter(member => member.user.bot).size}`, inline: true },
        { name: `Roles **(${rolesCount})**`, value: rolesList, inline: false },
        { name: `Emojis **(${emojiSize})**`, value: emojis, inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
      .setTimestamp();
    await interaction.followUp({ embeds: [embed] });
  },
};