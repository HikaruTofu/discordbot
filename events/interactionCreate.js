import { configDotenv } from "dotenv"; // Muat variabel lingkungan dari .env
import { InteractionType } from "discord.js";

export default async (client, interaction) => {
    configDotenv(); // Muat variabel lingkungan
    await interaction.deferReply({ ephemeral: true });

    if (interaction.type === InteractionType.ApplicationCommand) {
        const DJ = client.config.opt.DJ;
        const command = client.commands.get(interaction.commandName);
    
        if (!command) {
            await interaction.followUp(`aduh, error entah kenapa`);
            setTimeout(async () => {
                await interaction.deleteReply();
            }, 5000);
        }
    
        if (command.permissions && !interaction.member.permissions.has(command.permissions)) {
            await interaction.followUp(`yah, kamu engga punya izin buat menggunakan ini`);
        }
    
        if (DJ.enabled && DJ.commands.includes(command) && !interaction.member._roles.includes(interaction.guild.roles.cache.find(x => x.name === DJ.roleName).id)) {
            await interaction.followUp(`command ini hanya dapat digunakan untuk \`${DJ.roleName}\` ya`);
        }
    
        if (command.voiceChannel) {
            if (!interaction.member.voice.channel) {
                await interaction.followUp(`kamu aja engga ada di voice channel, gimana aku mau mutar lagu?`);
            }
    
             if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
                await interaction.followUp(`aduh, kita voice channel yang berbeda`);
            }
        }
    
        command.execute({ interaction, client });
    } 
};