import { EmbedBuilder } from "discord.js";

export default async (queue, track) => {
    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Lagu yang sekarang dimainkan saya lewati`}) 
        .setDescription(`\`\`\`${queue.currentTrack.title}\`\`\``)
        .setColor('#78ceda');
        
        const message = queue.metadata.channel.send({ embeds: [embed] });
        setTimeout(async () => {
            await message.delete();
        }, 5000); 
    })()
}