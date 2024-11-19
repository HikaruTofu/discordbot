import { EmbedBuilder } from "discord.js"; 
import { stripIndent } from "common-tags";

export default {
  name: "ban",
  description: "nge-ban orang yang dipilih dari server",
  options: [
    {
        name: "user",
        type: 6, // USER type
        description: "pilih orangnya",
        required: true, //true or false
    },
    {
        name: "alasan",
        type: 3,
        description: "apa alasan kamu ngeban dia?",
        required: false,
    },
  ],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const TargetOrang = interaction.options.getUser('user');
      const alasan = interaction.options.getString('alasan') || 'gada alasan';

      const TargetMember = await interaction.guild.members.fetch(TargetOrang.id);

      if (TargetOrang.id === interaction.user.id) {
        return interaction.reply({
            content : 'kamu ngapain mau ngeban diri sendiri?',
            ephemeral: true
        })
      }
      if (TargetOrang.id === interaction.client.user.id) {
        return interaction.reply({
            content: 'ada dendam apa sampai mau ngeban aku?',
            ephemeral: true
        })
      }
      if (TargetOrang.id === interaction.guild.ownerId) {
        return interaction.reply({
            content: 'kamu ngapain mau nge-ban owner server?',
            ephemeral: true
        })
      }
      
      const InteractionMember = await interaction.guild.members.fetch(interaction.user.id);
      if (InteractionMember.roles.highest.position <= TargetMember.roles.highest.position) {
        return interaction.reply({
            content: 'maaf, kamu tidak dapat nge-ban orang yang memilki role yang setara atau lebih tinggi darimu',
            ephemeral: true
        })
      }

      if (!TargetMember.bannable) {
        return interaction.reply({
            content: 'aduh, aku tidak dapat nge-ban orang ini',
            ephemeral: true
        })
      }

      const BanEmbed = new EmbedBuilder()
        .setTitle(`Kamu ter-banned`)
        .setDescription(stripIndent`
             \`🔨\` - Yah, sepertinya kamu telah diban dari ${interaction.guild.name}, Ini informasi lebih lanjutnya:
            > • Server: ${interaction.guild.name} (${interaction.guild.id})
            > • Action: Moderation (Ban)
            > • Banned By: ${interaction.user.username} (${interaction.user.id})
            > • Banned At: ${new Date().toLocaleString()}
            > • Reason: ${alasan}
            `)
        .setTimestamp(); 
      try {
        await TargetOrang.send({ embeds: [BanEmbed] });
      } catch {

      }

      await interaction.guild.members.ban(TargetOrang, {reason: alasan});
      const successEmbed = new EmbedBuilder()
        .setTitle('Berhasil diban')
        .setDescription(`**${TargetOrang.username}**/\`${TargetOrang.id}\` telah berhasil diban dari server`)
        .addFields(
            { name: 'Reason', value: alasan },
            { name: 'Banned By', value: interaction.user.username }
        )
        .setTimestamp();
        await interaction.followUp({ embeds: [successEmbed] });
    } catch (error) {
        console.error(error); 
        await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};