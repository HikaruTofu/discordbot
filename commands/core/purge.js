import { EmbedBuilder } from "discord.js"; 

export default {
  name: "purge", 
  description: "hapus pesan", 
  options: [
    {
      name: "total", 
      type: 4, 
      description: "mau hapus berapa pesan?", 
      required: true, 
    },
  ],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply(); 

      const amount = interaction.options.getInteger("total"); 

      if (!interaction.member.permissions.has("ManageMessages")) {
        return await interaction.followUp({ content: 'Aduh, kamu engga ada izin buat menggunakan ini', ephemeral: true });
      }

      if (!interaction.guild.members.me.permissions.has("ManageMessages")) {
        return await interaction.followUp({ content: 'Aduh, aku engga ada izin buat ini', ephemeral: true });
      }

      if (isNaN(amount) || amount <= 0) {
        return await interaction.followUp({ content: 'Pesannya tidak dapat dihapus', ephemeral: true });
      }

      let deleteAmount = amount > 100 ? 100 : amount;

      interaction.channel.bulkDelete(deleteAmount, { filterOld: true }).then(async (messages) => {
        await interaction.followUp(`aku berhasil menghapus total \`${messages.size}/${amount}\` pesan!`);
        setTimeout(async () => {
            await interaction.deleteReply();
        }, 2000);
    }).catch(() => null);
    } catch (error) {
      console.error(error); 
      if (error.code === 10008) {
        return await interaction.followUp({ content: 'aduh, pesannya tidak dapat ditemukan', ephemeral: true });
      } else if (error.code === 50001) {
        return await interaction.followUp({ content: 'aduh, aku engga bisa melihat di channel ini!', ephemeral: true });
      } else {
        return await interaction.editReply({ content: 'aduh, ada error pas ngejalanin command ini', ephemeral: true });
      }
    }
  },
};