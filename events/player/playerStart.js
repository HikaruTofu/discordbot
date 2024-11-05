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
            .setTitle('`🎵` | Musik dimulai:')
            .setThumbnail(track.thumbnail)
            .setDescription(`[${track.title}](${queue.currentTrack.url})`)
            .addFields(
                { name: "Durasi", value: `${queue.currentTrack.duration}`, inline: true },
                { name: "Antrian Server", value: `${queue.tracks.size} Lagu`, inline: true },
                { name: "Diminta oleh", value: `${track.requestedBy}`, inline: true }
            )
            .setColor('#78ceda')
            .setTimestamp()
        
        console.log(`Track started: ${track.title} in channel: ${queue.channel.name}`);
        await queue.metadata.channel.send({ embeds: [embed] });
    } catch (error) {
        console.error("Error sending message:", error);
    }
};