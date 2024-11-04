import { EmbedBuilder } from "discord.js";

export default async (client, queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Dimasukkan` }) // Pass an object here
        .setDescription(`semua lagu dari playlist yang kamu kasih sudah kumasukkan di antrian ya!`);

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}