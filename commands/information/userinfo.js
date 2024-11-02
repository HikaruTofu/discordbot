import { EmbedBuilder } from "discord.js"; 
import ms from 'parse-ms'

export default {
  name: "userinfo",
  description: "Memberikan informasi tentang suatu user",
  options: [
    {
        name: "option",
        type: 6, // USER type
        description: "Pilih Seseorang",
        required: true,
    },
  ],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      let user = interaction.options.getMember('option') || interaction.member; // Corrected here
      const roles = user.roles.cache.map(role => role.toString()).join("\n");
      const roleslist = roles.replace("@everyone, ", "");
      
      const flags = {
        DISCORD_EMPLOYEE: 'Discord Employee',
        DISCORD_PARTNER: 'Discord Partner',
        BUGHUNTER_LEVEL_1: 'Bug Hunter Level 1',
        BUGHUNTER_LEVEL_2: 'Bug Hunter Level 2',
        HYPESQUAD_EVENTS: 'HypeSquad Event',
        HOUSE_BRAVERY: 'House Bravery',
        HOUSE_BRILLIANCE: 'House Brilliance',
        HOUSE_BALANCE: 'House Balance',
        EARLY_SUPPORTER: 'Early Supporter',
        TEAM_USER: 'Team User',
        SYSTEM: 'System',
        VERIFIED_BOT: 'Verified Bot',
        EARLY_VERIFIED_DEVELOPER: 'Early Verified Developer',
        ACTIVE_DEVELOPER: 'Active Developer'
      };
      // Retrieve user flags
      
      const userFlagsArray = user.user.flags.toArray();
      console.log(userFlagsArray); // Debugging line to check flags    

      const userFlags = userFlagsArray.length ? userFlagsArray.map(flag => flags[flag] || flag).join('\n') : 'No badges';

      // Check user presence status
      let status = 'Offline'; // Default to Offline
      if (user.presence) {
        // Use optional chaining to access the presence status
        switch (user.presence.status) {
          case "online":
              status = 'Online';
              break;
          case "dnd":
              status = 'Do Not Disturb (DND)';
              break;
          case "idle":
              status = 'Idle';
              break;
          case "offline":
              status = 'Offline';
              break;
          default:
              status = 'Unknown';
              break;
        }
      }

      // Set default values if roles or flags are empty
      const rolesDisplay = roleslist || 'No roles';
      const flagsDisplay = userFlags || 'No flags';

      // Membuat embed menggunakan EmbedBuilder
      const embed = new EmbedBuilder()
      .setTitle(`${user.user.tag}'s Information`)
      .setThumbnail(user.displayAvatarURL())
      .setDescription('\n')
      .addFields(
        { name: "Name", value: user.user.username || 'Unknown', inline: true },
        { name: "ID", value: user.user.id || 'Unknown', inline: true },
        { name: "Current Status", value: status, inline: true },
        { name: "Custom Status", value: user.presence?.activities[0]?.state || `User  doesn't have a custom status!`, inline: true },
        { name: "Activity", value: user.presence?.activities[0]?.name || `User  isn't playing a game!`, inline: true },
        { name: "User Roles", value: rolesDisplay, inline: true },
        { name: "User Badges", value: flagsDisplay, inline: true },
        { name: "Creation Date", value: user.user.createdAt.toLocaleDateString("en-US"), inline: true },
        { name: "Joined Date", value: user.joinedAt.toLocaleDateString("en-US"), inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
      .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error(error); // Menangani kesalahan
        await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};