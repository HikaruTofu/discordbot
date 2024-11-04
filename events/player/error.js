import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: `error` }) // Pass an object here
        .setDescription(`ada kerusakan saat menjalankannya, tolong panggil tuanku untuk memperbaikinnya!`);

        queue.metadata.channel.send({ embeds: [embed] });

        console.log((`Error emitted from the Bot <${error}>`))
    })()
}