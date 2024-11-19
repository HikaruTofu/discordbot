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
        type: 6, 
        description: "pilih orang yang di inginkan",
        required: true,
    },
    {
        name: "pilih_reaksi",  
        type: 3, 
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

          if (category === "wink") {
            const response = await superagent.get("https://some-random-api.com/animu/wink");
            if (!response.body || !response.body.url) {
              throw new Error("API did not return a valid response");
            }
            const imageUrl = response.body.url;
          } else {
            imageUrl = (await neko[category]()).url;
          }

          return new EmbedBuilder()
            .setTitle(`${interaction.user.username} ${category} ${selectedUser .username}`)
            .setImage(imageUrl)
            .setColor('#78ceda')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setTimestamp();
        } catch (ex) {
          console.error("Error fetching image:", ex); 
          return new EmbedBuilder()
            .setDescription("gagal mengambil foto, maaf ya")
            .setColor('#78ceda')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setTimestamp();
        }
      };

      const embed = await genReaction(choice);
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error("Command error:", error); 
      await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};