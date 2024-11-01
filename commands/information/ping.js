import { EmbedBuilder } from "discord.js";

export default {
  name: "ping",
  description: "Returns websocket latency",

  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const sent = await interaction.reply({
        content: "Pinging...",
        fetchReply: true,
      });

      const latency = sent.createdTimestamp - interaction.createdTimestamp;

      // const embed = new EmbedBuilder()
      //   .setColor("#FF0000")
      //   .setTitle("🏓 Pong!")
      //   .setDescription(`Pong! 🏓\nLatency: ${latency}ms\nWebsocket: ${client.ws.ping}ms`)
      //   .setTimestamp()
      //   .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

      // await interaction.followUp({ embeds: [embed] });

      await interaction.editReply(
        `Pong! 🏓\nLatency: ${latency}ms\nWebsocket: ${client.ws.ping}ms`,
      );

    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};