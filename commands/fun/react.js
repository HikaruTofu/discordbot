import { EmbedBuilder } from "discord.js"; 
import nekoslife from "nekos.life";
const neko = new nekoslife(); 
import superagent from "superagent";

const choices = ["hug", "kiss", "cuddle", "feed", "pat", "poke", "slap", "smug", "tickle", "wink"];

export default {
  name: "react",
  description: "reaksi suatu anime",
  options: [
    {
        name: "pilih_orang",  
        type: 6, // USER type
        description: "pilih orang yang di inginkan",
        required: true,
    },
    {
        name: "pilih_reaksi",  
        type: 3, // STRING type
        description: "pilih reaksi yang di inginkan",
        required: true,
        choices: choices.map((ch) => ({ name: ch, value: ch })),
    },
  ],
  
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const selectedUser   = interaction.options.getUser ("pilih_orang");
      const choice = interaction.options.getString("pilih_reaksi");

      const genReaction = async (category) => {
        try {
          let imageUrl;

          // Check for the category and fetch the image
          if (category === "wink") {
            const response = await superagent.get("https://some-random-api.com/animu/wink");
            if (!response.body || !response.body.url) {
              throw new Error("API did not return a valid response");
            }
            const imageUrl = response.body.url;
          } else {
            // Fetch from nekos.life
            imageUrl = (await neko[category]()).url;
          }

          // Return the embed with the image
          return new EmbedBuilder()
            .setTitle(`${interaction.user.username} ${category} ${selectedUser .username}`)
            .setImage(imageUrl)
            .setColor('#78ceda')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setTimestamp();
        } catch (ex) {
          console.error("Error fetching image:", ex); // Log the error
          return new EmbedBuilder()
            .setDescription("Failed to fetch meme. Try again!")
            .setColor('#78ceda')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setTimestamp();
        }
      };

      const embed = await genReaction(choice);
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error("Command error:", error); // Log the command execution error
      await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};