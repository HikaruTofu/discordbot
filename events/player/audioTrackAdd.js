import { EmbedBuilder } from "discord.js";

export default async (client, queue, track) => {
    console.log('Track:', track);
    if (!track) {
        console.error('No track information available.');
        return;
    }

    (async () => {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Lagu yang diminta sudah berhasil dimasukkan ke antrian` }) // Pass an object here
            .setDescription(`\`\`\`${track.title}\`\`\``)
            .setColor('#78ceda');
        await queue.metadata.channel.send({ embeds: [embed] });
    })();
}