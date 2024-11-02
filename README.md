command template (im too lazy)
```js
import { EmbedBuilder } from "discord.js"; 

export default {
  name: "",
  description: "",
  options: [
    {
        name: "",
        type: , // USER type
        description: "",
        required: , //true or false
    },
  ],

  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      
    } catch (error) {
        console.error(error); // Menangani kesalahan
        await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};
```
