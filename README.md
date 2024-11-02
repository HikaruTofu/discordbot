Command Template
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

command types (for easier one)
```js
{
  name: "text",
  type: 1, // STRING type
  description: "Enter some text",
  required: true,
},
{
  name: "number",
  type: 4, // INTEGER type
  description: "Enter a number",
  required: false,
},
{
  name: "isActive",
  type: 5, // BOOLEAN type
  description: "Is this active?",
  required: false,
},
{
  name: "user",
  type: 6, // USER type
  description: "Select a user",
  required: false,
},
{
  name: "channel",
  type: 7, // CHANNEL type
  description: "Select a channel",
  required: false,
},
{
  name: "role",
  type: 8, // ROLE type
  description: "Select a role",
  required: false,
},
```

