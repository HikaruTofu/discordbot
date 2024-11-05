import { EmbedBuilder } from "discord.js";

export default async (client, queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
        .setColor('#78ceda')
        .setDescription(`Semua lagu dari playlist yang kamu kasih sudah kumasukkan di antrian ya!`);
        
        // Ensure queue.metadata is defined before accessing channel
        if (queue.metadata && queue.metadata.channel) {
            queue.metadata.channel.send({ embeds: [embed] });
        } else {
            console.error("Queue metadata or channel is undefined.");
        }
    })();
}