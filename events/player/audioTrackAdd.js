import { EmbedBuilder } from "discord.js";

export default async (client, queue, track) => {
    console.log('Track:', track);
    if (!track) {
        console.error('No track information available.');
        return;
    }

    (async () => {
        const embed = new EmbedBuilder()
            .setTitle('`⏱` | Lagu yang diminta sudah berhasil dimasukkan ke antrian')
            .setDescription(`\`\`\`${track.title}\`\`\``)
            .setColor('#78ceda')
            .setTimestamp();
        await queue.metadata.channel.send({ embeds: [embed] });
    })();
}