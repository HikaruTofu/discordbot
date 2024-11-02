import { EmbedBuilder } from "discord.js";
import ms from "parse-ms";
import moment from "moment";

export default {
  name: "serverinfo",
  description: "gives information about server",
  options: [
    {
        name: "option",
        type: 3, // STRING type
        description: "Choose an option (roles or emojis)",
        required: false,
        choices: [
        {
          name: "Roles",
          value: "roles",
        },
        {
          name: "Emojis",
          value: "emojis",
        },
      ],
    },
  ],

  run: async (client, interaction) => {
    await interaction.deferReply();

    const text = interaction.guild.channels.cache.filter(r => r.type === "GUILD_TEXT").size;
    const voice = interaction.guild.channels.cache.filter(r => r.type === "GUILD_VOICE").size;
    const chs = interaction.guild.channels.cache.size;
    const rolesCount = interaction.guild.roles.cache.size;
    const roles = interaction.guild.roles.cache.map(role => role.toString()).join(" ");
    const rolesList = roles.replace("@everyone", "");
    const emojiSize = interaction.guild.emojis.cache.size;
    const emojis = interaction.guild.emojis.cache.map(emoji => emoji.toString()).join(" ");
    const region = interaction.guild.preferredLocale; // Use preferredLocale instead of region
    const regionUp = region.charAt(0).toUpperCase() + region.slice(1);
    let owner = await client.users.fetch(interaction.guild.ownerId).then(o => o.tag);


    const yesno = {
        true: 'Yes',
        false: 'No'
    };

    if (!interaction.options.getString('option')) {
        let embed = new EmbedBuilder()
        .setAuthor({ name: `Server Information`, iconURL: interaction.guild.iconURL() }) // Corrected
        .addFields(
            { name: "Guild Owner", value: `${owner}`, inline: true },
            { name: "Region", value: `${regionUp}`, inline: true },
            { name: "Server ID", value: `${interaction.guild.id}`, inline: true },
            { name: "Created At", value: interaction.guild.createdAt.toLocaleString(), inline: false },
            { name: "Verification Level", value: `${interaction.guild.verificationLevel}`, inline: true },
            { name: `Server Features`, value: `${interaction.guild.features.join(" | ") || 'No Features'}`, inline: false },
            { name: `Server Boost Tier`, value: `${interaction.guild.premiumTier || 'Zero Tier'}`, inline: true },
            { name: `Server Boosts`, value: `${interaction.guild.premiumSubscriptionCount || 'No Boost'}`, inline: true },
            { name: `Channels **(${chs})**`, value: `Text Channel - **${text}** ┇ Voice Channel - **${voice}**`, inline: false },
            { name: `Total | Members | BOT Count`, value: `${interaction.guild.members.cache.size} | ${interaction.guild.members.cache.filter(member => !member.user.bot).size} | ${interaction.guild.members.cache.filter(member => member.user.bot).size}`, inline: false },
            { name: `Roles **(${rolesCount})**`, value: `Untuk melihat semua role server, gunakan perintah \`/serverinfo roles\``, inline: false },
            { name: `Emojis **(${emojiSize})**`, value: `Untuk melihat semua emoji server, gunakan perintah \`/serverinfo emojis\``, inline: true }
        )
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() }) // Corrected
        .setTimestamp();
        await interaction.followUp({ embeds: [embed] });
    } else if (interaction.options.getString('option') === 'roles') {
        let ndEmbed = new EmbedBuilder()
          .setAuthor({ name: `Server Roles List`, iconURL: interaction.guild.iconURL() })
          .setDescription(rolesList)
          .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
          .setTimestamp();
        await interaction.followUp({ embeds: [ndEmbed] });
      } else if (interaction.options.getString('option') === 'emojis') {
        let dndEmbed = new EmbedBuilder()
          .setAuthor({ name: `Server Emojis List`, iconURL: interaction.guild.iconURL() })
          .setDescription(emojis)
          .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
          .setTimestamp();
        await interaction.followUp({ embeds: [dndEmbed] });
      }
    },
};