export default {
  name: "ping",
  description: "Mengembalikan latency websocket",

  run: async (client, interaction) => {
    try {
      await interaction.deferReply(); // Deferring the reply

      // Send a follow-up message to indicate that we're pinging
      const sent = await interaction.followUp({
        content: "Pinging...",
        fetchReply: true, // This allows you to get the message object
      });

      // Calculate latency
      const latency = sent.createdTimestamp - interaction.createdTimestamp;

      // Prepare the response message
      const responseMessage = `Pong! 🏓\nLatency: ${latency}ms\nWebsocket: ${client.ws.ping}ms`;

      // Send the final response
      await interaction.editReply(responseMessage);
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};