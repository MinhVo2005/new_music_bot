require('dotenv').config()
const {REST, Routes} = require('discord.js')
const {clientID, guildID} = require('../config.json')

const rest = new REST().setToken(process.env.TOKEN)

module.exports = async (commands) =>{
    try{
        console.log(`Start refreshing ${commands.size} commands`) // Remove afterward
        const data = await rest.put(
            Routes.applicationGuildCommands(clientID,guildID),
            {body:(() =>{
                const commandlist = []
                for (const command of commands){
                    commandlist.push(command[1].data.toJSON());
                }; return commandlist
            })()}
        )
        console.log(`Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error){
        console.log(error)
    }
};