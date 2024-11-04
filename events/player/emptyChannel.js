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
            .setColor('#78ceda')
            .setDescription(`Engga ada satupun yang berada di voice channelku, aku pergi ya!`);

        const message = await queue.metadata.channel.send({ embeds: [embed] });
        setTimeout(async () => {
            await message.delete();
        }, 5000); 
    })()
}