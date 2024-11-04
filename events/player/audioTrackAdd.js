import { EmbedBuilder } from "discord.js";

export default async (client, queue, track) => {
    // Debugging: Log the track object
    console.log('Track:', track);

    // Check if the track is defined
    if (!track) {
        console.error('No track information available.');
        return;
    }

    (async () => {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Lagu yang diminta sudah berhasil dimasukkan ke antrian` }) // Pass an object here
            .setDescription(`\`\`\`${track.title}\`\`\``)
            .setImage(track.thumbnail)
            .setColor('#78ceda');

        await queue.metadata.channel.send({ embeds: [embed] });
    })();
}