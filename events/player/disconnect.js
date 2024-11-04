import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    if (queue.metadata.lyricsThread) {
        queue.metadata.lyricsThread.delete();
        queue.setMetadata({
            channel: queue.metadata.channel
        });
    }

    (async () => {
        const message = await queue.metadata.channel.send({ content: `Aku terputus dari voice channel tempatku, antrian kuhapus ya!`, ephemeral: true });
        setTimeout(async () => {
            await message.delete();
        }, 6000); 
    })();
}