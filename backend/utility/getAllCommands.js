const path = require('node:path');
const fs = require('node:fs');
const {Collection} = require('discord.js')
const folderPath = path.join(__dirname,'..','commands')
const commandFolder = fs.readdirSync(folderPath)



//Get commands
module.exports = (() =>{
    const command = new Collection()

    for (const file of commandFolder){
        const filePath = path.join(folderPath,file)
        const commands = require(filePath)
        if ('data' in commands && 'execute' in commands){
            command.set(commands.data.name,commands)
        }
    };
    return command
})()