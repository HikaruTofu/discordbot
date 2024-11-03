import { EmbedBuilder } from "discord.js"; 

export default {
  name: "purge", // Nama perintah
  description: "hapus pesan", // Deskripsi perintah
  options: [
    {
      name: "total", // Nama opsi
      type: 4, // INTEGER type untuk jumlah
      description: "mau hapus berapa pesan?", // Deskripsi opsi
      required: true, // Opsi ini diperlukan
    },
  ],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply(); // Menunda balasan

      const amount = interaction.options.getInteger("total"); // Mendapatkan jumlah pesan dari opsi

      // Cek izin pengguna
      if (!interaction.member.permissions.has("ManageMessages")) {
        return await interaction.followUp({ content: 'Aduh, kamu engga ada izin buat menggunakan ini', ephemeral: true });
      }

      // Cek izin bot
      if (!interaction.guild.members.me.permissions.has("ManageMessages")) {
        return await interaction.followUp({ content: 'Aduh, aku engga ada izin buat ini', ephemeral: true });
      }

      // Validasi jumlah pesan
      if (isNaN(amount) || amount <= 0) {
        return await interaction.followUp({ content: 'Pesannya tidak dapat dihapus', ephemeral: true });
      }

      // Batasi jumlah pesan yang akan dihapus
      let deleteAmount = amount > 100 ? 100 : amount;

      // Menghapus pesan
      interaction.channel.bulkDelete(deleteAmount, { filterOld: true }).then(async (messages) => {
        await interaction.reply(`aku berhasil menghapus total \`${messages.size}/${amount}\` pesan!`);
        setTimeout(async () => {
            await interaction.deleteReply();
        }, 2000);
    }).catch(() => null);
    } catch (error) {
      console.error(error); // Menangani kesalahan
      if (error.code === 10008) {
        // Jika terjadi kesalahan Unknown Message
        return await interaction.followUp({ content: 'aduh, pesannya tidak dapat ditemukan', ephemeral: true });
      } else if (error.code === 50001) {
        // Jika bot tidak memiliki izin untuk melihat pesan
        return await interaction.followUp({ content: 'aduh, aku engga bisa melihat di channel ini!', ephemeral: true });
      } else {
        // Untuk kesalahan lain
        return await interaction.editReply({ content: 'aduh, ada error pas ngejalanin command ini', ephemeral: true });
      }
    }
  },
};