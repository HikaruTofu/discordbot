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
        .setAuthor(`Disconnect`)
        .setDescription(`aku terputus dari voice channel, antrian kuhapus ya!`)

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}