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
            .setDescription(`Aku terputus dari voice channel tempatku, antrian kuhapus ya!`);

        const message = await queue.metadata.channel.send({ embeds: [embed] });
        setTimeout(async () => {
            await message.delete();
        }, 6000); 
    })();
}