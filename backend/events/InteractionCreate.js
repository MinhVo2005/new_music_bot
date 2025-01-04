//Executing commands
const {Events} = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) {
            console.error('Command Not Found!')
            return
        }

            await command.execute(interaction)
        
}}


