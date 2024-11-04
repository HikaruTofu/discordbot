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
            .setDescription(`aku terputus dari voice channel, antrian kuhapus ya!`);

        await queue.metadata.channel.send({ embeds: [embed] });
    })();
}