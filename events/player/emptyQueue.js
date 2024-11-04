import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    (async () => {
        const message = await queue.metadata.channel.send({ content: `Yah, lagu yang berada diantrianku sudah habis`, ephemeral: true });
        setTimeout(async () => {
            await message.delete();
        }, 5000); 
    })();
}