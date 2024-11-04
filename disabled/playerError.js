import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    (async () => {    
        const message = await queue.metadata.channel.send({ content: `Mohon maaf, tetapi ada kerusakan saat menjalakannya.`, ephemeral: true });
        setTimeout(async () => {
             await message.delete();
         }, 3000); 

        console.log((`Error emitted from the player <${error.message}>`))
    })()
}