import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Habis` }) // Pass an object here
        .setDescription(`lagu yang ada diantrian sudah habis`);

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}