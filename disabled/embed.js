import { EmbedBuilder } from "discord.js"; 

export default {
    name: "embed",
    description: "generate an embed",
  
    run: async (client, interaction) => {
      try {
        await interaction.deferReply();
  
        const filter = msg => msg.author.id === interaction.user.id;
      const options = {
        max: 1,
        time: 60000, // 1 minute timeout
        errors: ['time'],
      };

      const embed = new EmbedBuilder()
        .setColor('#0099ff'); // Default color

      await interaction.editReply({ content: 'Reply With `skip` / `no` For The Next Embed Generator, Reply `Cancel` To Stop The Embed Generator' });

      // Title
      await interaction.editReply({ content: '```Do You Want Your Embed With Title?```\nReply With Word Or Reply With `skip` / `no` For The Next Embed Generator, Reply `Cancel` To Stop The Embed Generator' });
      let title = await interaction.channel.awaitMessages({ filter, ...options });
      if (title.first().content.toLowerCase() === 'cancel') return interaction.followUp({ content: 'Embed Generator Has Been Cancelled' });
      if (title.first().content.toLowerCase() !== 'skip') embed.setTitle(title.first().content);

      // Description
      await interaction.editReply({ content: '```Alright, Do You Want Your Embed With Description?```\nReply With Word Or Reply With `skip` / `no` For The Next Embed Generator, Reply `Cancel` To Stop The Embed Generator' });
      let description = await interaction.channel.awaitMessages({ filter, ...options });
      if (description.first().content.toLowerCase() === 'cancel') return interaction.followUp({ content: 'Embed Generator Has Been Cancelled' });
      if (description.first().content.toLowerCase() !== 'skip') embed.setDescription(description.first().content);

      // Color
await interaction.editReply({ content: '```Now, Do You Want Your Embed With Any Color?```\nReply With Word Or Reply With `skip` / `no` For The Next Embed Generator, Reply `Cancel` To Stop The Embed Generator' });
let color = await interaction.channel.awaitMessages({ filter, ...options });
if (color.first().content.toLowerCase() === 'cancel') return interaction.followUp({ content: 'Embed Generator Has Been Cancelled' });
if (color.first().content.toLowerCase() !== 'skip') {
    const colorValue = color.first().content;
    // Validate the color format (optional)
    if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
        embed.setColor(colorValue);
    } else {
        await interaction.followUp({ content: 'Invalid color format! Please use a hex color (e.g., #0099ff).' });
        return;
    }
}

// Author
await interaction.editReply({ content: '```Ok, Do You Want Your Embed With Author Field?```\nReply With Word Or Reply With `skip` / `no` For The Next Embed Generator, Reply `Cancel` To Stop The Embed Generator' });
let author = await interaction.channel.awaitMessages({ filter, ...options });
if (author.first().content.toLowerCase() === 'cancel') return interaction.followUp({ content: 'Embed Generator Has Been Cancelled' });
if (author.first().content.toLowerCase() !== 'skip') {
    embed.setAuthor({ name: author.first().content });
}

// Footer
await interaction.editReply({ content: '```Okay, Do You Want Your Embed With Footer?```\nReply With Word Or Reply With `skip` / `no` For The Next Embed Generator, Reply `Cancel` To Stop The Embed Generator' });
let footer = await interaction.channel.awaitMessages({ filter, ...options });
if (footer.first().content.toLowerCase() === 'cancel') return interaction.followUp({ content: 'Embed Generator Has Been Cancelled' });
if (footer.first().content.toLowerCase() !== 'skip') {
    embed.setFooter({ text: footer.first().content });
}

      // Timestamp
      await interaction.editReply({ content: '```Finally, Do You Want Your Embed With TimeStamp?```\nReply With `yes` / `no` Or Reply With `skip` / `no` For The Next Embed Generator, Reply `Cancel` To Stop The Embed Generator' });
      let timestamp = await interaction.channel.awaitMessages({ filter, ...options });
      if (timestamp.first().content.toLowerCase() === 'cancel') return interaction.followUp({ content: 'Embed Generator Has Been Cancelled' });
      if (timestamp.first().content.toLowerCase() === 'yes') embed.setTimestamp();

      await interaction.followUp({ embeds: [embed] });
      } catch (error) {
          console.error(error); // Menangani kesalahan
          await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    },
  };