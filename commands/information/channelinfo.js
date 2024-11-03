import { EmbedBuilder } from "discord.js";

const channelType = {
    0: 'Text',              // GUILD_TEXT
    2: 'Voice',             // GUILD_VOICE
    4: 'Category',          // GUILD_CATEGORY
    5: 'Announcement',      // GUILD_NEWS
    6: 'Store'              // GUILD_STORE
};

export default {
    name: "channelinfo",
    description: "Memberikan informasi tentang suatu channel",
    options: [
        {
            name: "channel",
            type: 7, // CHANNEL type
            description: "Pilih channel",
            required: false,
        },
    ],

    run: async (client, interaction) => {
        try {
            await interaction.deferReply();
            
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            if (!channel) {
                await interaction.editReply({ content: 'Channel not found!', ephemeral: true });
                return;
            }

            // Log the channel type to see what it returns
            console.log(`Channel Type: ${channel.type}`);

            // Use the numeric channel type to get the human-readable type
            let type = channelType[channel.type] || 'Unknown';

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Channel Information`, iconURL: interaction.guild.iconURL() })
                .setDescription('\n')
                .addFields(
                    { name: 'Name:', value: `\`\`\`${channel.name}\`\`\``, inline: true },
                    { name: 'ID:', value: `\`\`\`${channel.id}\`\`\``, inline: true },
                    { name: 'Type:', value: `\`\`\`${type}\`\`\``, inline: true },
                    { name: 'Created At:', value: `\`\`\`${channel.createdAt.toLocaleDateString('en-us')}\`\`\``, inline: true },
                    { name: 'Topic:', value: `\`\`\`${channel.topic || 'None'}\`\`\``, inline: true },
                    { name: 'NSFW:', value: `\`\`\`${channel.nsfw ? 'Yes' : 'No'}\`\`\``, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error); // Handle errors
            await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};