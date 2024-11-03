import { EmbedBuilder } from "discord.js";

const channelType = {
    0: 'Text',              // GUILD_TEXT
    2: 'Voice',             // GUILD_VOICE
    4: 'Category',          // GUILD_CATEGORY
    5: 'Announcement',      // GUILD_NEWS
    6: 'Store'              // GUILD_STORE
};

export default {
    name: "channel",
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
                .setAuthor({ name: `Informasi Channel`, iconURL: interaction.guild.iconURL() })
                .setColor('#78ceda')
                .setDescription('\n')
                .addFields(
                    { name: 'Nama', value: `\`\`\`${channel.name}\`\`\``, inline: true },
                    { name: 'ID', value: `\`\`\`${channel.id}\`\`\``, inline: true },
                    { name: 'Tipe', value: `\`\`\`${type}\`\`\``, inline: true },
                    { name: 'Dibuat pada', value: `\`\`\`${channel.createdAt.toLocaleDateString('en-us')}\`\`\``, inline: true },
                    { name: 'Topik', value: `\`\`\`${channel.topic || 'None'}\`\`\``, inline: true },
                    { name: 'NSFW', value: `\`\`\`${channel.nsfw ? 'Yes' : 'No'}\`\`\``, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error); // Handle errors
            await interaction.editReply({ content: 'aduh, ada error pas ngejalanin command ini', ephemeral: true });
        }
    },
};