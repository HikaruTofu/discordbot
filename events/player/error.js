import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
            .setColor('#78ceda')
            .setDescription(`Mohon maaf, tetapi ada kerusakan saat menjalakannya.`);

        const message = await queue.metadata.channel.send({ embeds: [embed] });
        setTimeout(async () => {
            await message.delete();
        }, 3000); 

        console.log((`Error emitted from the Bot <${error}>`))
    })()
}