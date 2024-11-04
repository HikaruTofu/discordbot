import { EmbedBuilder } from "discord.js";

export default async (client, queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
        .setColor('#78ceda')
        .setDescription(`Semua lagu dari playlist yang kamu kasih sudah kumasukkan di antrian ya!`);
        queue.metadata.channel.send({ embeds: [embed] });
    })()
}