import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
            .setColor('#78ceda')
            .setDescription(`Yah, lagu yang berada diantrianku sudah habis`);

        const message = await queue.metadata.channel.send({ embeds: [embed] });
        setTimeout(async () => {
            await message.delete();
        }, 5000); 
    })();
}