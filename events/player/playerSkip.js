import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
        .setColor('#78ceda')
        .setDescription(`Terpaksa melewati lagu ${track.title} soalnya ada masalah, maaf ya!`);

        const message = queue.metadata.channel.send({ embeds: [embed] });
        setTimeout(async () => {
            await message.delete();
        }, 5000); 
    })()
}