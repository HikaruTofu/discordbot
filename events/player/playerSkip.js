import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: `aku pergi` }) // Pass an object here
        .setDescription(`terpaksa melewati lagu ${track.title} soalnya ada masalah, maaf ya!`);

        queue.metadata.channel.send({ embeds: [embed], iconURL: track.thumbnail });
    })()
}