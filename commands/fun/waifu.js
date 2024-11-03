import { EmbedBuilder } from "discord.js"; 
import superagent from "superagent";
import nekoslife from "nekos.life";
const neko = new nekoslife(); 

const choices = ["waifu", "neko", "foxgirl", "avatar", "wallpaper"]; // Ensure all are lowercase

export default {
  name: "waifu",
  description: "Gacha waifu",
  options: [
    {
      name: "pilih",  
      type: 3, // STRING type
      description: "Pilih mau yang mana",
      required: true,
      choices: choices.map((ch) => ({ name: ch, value: ch })),
    },
  ],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const choice = interaction.options.getString("pilih");

      const genReaction = async (category) => {
        try {
          let imageUrl;

          const methods = {
            waifu: neko.waifu,
            neko: neko.neko,
            foxgirl: neko.foxGirl,
            avatar: neko.avatar,
            wallpaper: neko.wallpaper,
          };

          if (methods[category]) {
            imageUrl = (await methods[category]()).url;
          } else {
            throw new Error("Invalid category");
          }

          // Return the embed with the image
          return new EmbedBuilder()
            .setImage(imageUrl)
            .setColor('#78ceda')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setTimestamp();
        } catch (ex) {
          console.error("Error fetching image:", ex); // Log the error
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
      console.error(error); // Log the error for debugging
      await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};