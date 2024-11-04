import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    if (queue.metadata.lyricsThread) {
        queue.metadata.lyricsThread.delete();
        queue.setMetadata({
            channel: queue.metadata.channel
        });
    }

    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Disconnect` }) // Pass an object here
        .setDescription(`engga ada satupun yang berada di voice channelku, aku pergi ya!`);

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}