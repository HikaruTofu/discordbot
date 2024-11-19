import { EmbedBuilder } from "discord.js"; 
import ms from 'parse-ms'

export default {
  name: "whois",
  description: "Memberikan informasi tentang suatu user",
  options: [
    {
        name: "option",
        type: 6, 
        description: "Pilih Seseorang",
        required: true,
    },
  ],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      let user = interaction.options.getMember('option') || interaction.member; 
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
      
      const userFlagsArray = user.user.flags.toArray();
      console.log(userFlagsArray); 

      const userFlags = userFlagsArray.length ? userFlagsArray.map(flag => flags[flag] || flag).join('\n') : 'No badges';

      let status = 'Offline'; 
      if (user.presence) {
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

      const rolesDisplay = roleslist || 'No roles';
      const flagsDisplay = userFlags || 'No flags';

      const embed = new EmbedBuilder()
      .setTitle(`Informasi seorang ${user.user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .setDescription('\n')
      .addFields(
        { name: "Nama", value: user.user.username || 'Unknown', inline: true },
        { name: "ID", value: user.user.id || 'Unknown', inline: true },
        { name: "Status Sekarang", value: status, inline: true },
        { name: "Status Kustom", value: user.presence?.activities[0]?.state || `dia gapunya status`, inline: true },
        { name: "Aktivitas", value: user.presence?.activities[0]?.name || `User  isn't playing a game!`, inline: true },
        { name: "Roles", value: rolesDisplay, inline: true },
        { name: "Badges", value: flagsDisplay, inline: true },
        { name: "Join discord pada?", value: user.user.createdAt.toLocaleDateString("en-US"), inline: true },
        { name: "Join server pada?", value: user.joinedAt.toLocaleDateString("en-US"), inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
      .setTimestamp()
      .setColor('#78ceda');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error(error); 
        await interaction.editReply({ content: 'aduh, ada error pas ngejalanin command ini', ephemeral: true });
    }
  },
};