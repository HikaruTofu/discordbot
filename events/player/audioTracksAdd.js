import { EmbedBuilder } from "discord.js";

export default async (client, queue, track) => {
    (async () => {
        if (queue.metadata && queue.metadata.channel) {
            const message = queue.metadata && queue.metadata.channel
            
            queue.metadata.channel.send({ content: `Semua lagu dari playlist yang kamu kasih sudah kumasukkan di antrian ya!`, ephemeral: true });
            setTimeout(async () => {
                await message.delete();
            }, 6000); 
        } else {
            console.error("Queue metadata or channel is undefined.");
        }
    })();
}