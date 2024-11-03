import { EmbedBuilder } from "discord.js";

const channelType = {
    GUILD_TEXT: 'Text',
    GUILD_VOICE: 'Voice',
    GUILD_CATEGORY: 'Category',
    GUILD_NEWS: 'Announcement',
    GUILD_STORE: 'Store'
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

            let type = channelType[channel.type] || 'Unknown';

            const embed = new EmbedBuilder() // Use EmbedBuilder directly
                .setTitle('Channel Information')
                .setDescription('\n')
                .addFields(
                    { name: '✉️ Name:', value: channel.name, inline: false },
                    { name: '🆔 ID:', value: channel.id, inline: false },
                    { name: '🗂️ Type:', value: type, inline: false },
                    { name: '📎 Raw Position:', value: channel.rawPosition.toString(), inline: false },
                    { name: '📆 Created At:', value: channel.createdAt.toLocaleDateString('en-us'), inline: false },
                    { name: '📜 Topic:', value: channel.topic || 'None', inline: false },
                    { name: '🔞 NSFW:', value: channel.nsfw ? 'Yes' : 'No', inline: false }
                )
                .setTimestamp()
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error); // Handle errors
            await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};