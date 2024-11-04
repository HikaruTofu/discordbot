import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    if (queue.metadata.lyricsThread) {
        queue.metadata.lyricsThread.delete();
        queue.setMetadata({
            channel: queue.metadata.channel
        });
    }

    (async () => {
        const message = await queue.metadata.channel.send({ content: `Engga ada satupun yang berada di voice channelku, aku pergi ya!`, ephemeral: true });
        setTimeout(async () => {
            await message.delete();
        }, 5000); 
    })()
}