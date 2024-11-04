// playerStart.js
import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    // Check if the channel is defined
    if (!queue.metadata || !queue.metadata.channel) {
        console.error("Channel is not defined");
        return;
    }

    try {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Musik dimulai:` }) // Pass an object here
            .setDescription(`\`\`\`${track.title}\`\`\``)
            .setColor('#78ceda')
        
        console.log(`Track started: ${track.title} in channel: ${queue.channel.name}`);
        await queue.metadata.channel.send({ embeds: [embed] });
    } catch (error) {
        console.error("Error sending message:", error);
    }
};