 require('dotenv').config()
const {Client,IntentsBitField, Collection,Events} = require('discord.js');

const ready = require('./events/ready')
const fs = require('node:fs')
const path = require('node:path')
const getAllCommands = require('./utility/getAllCommands')
const deployCommands = require('./utility/deployCommands');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
})
//Get commands
client.commands = getAllCommands
//Update/ Deploy commands to server
//deployCommands(client.commands)

const eventPath = path.join (__dirname, 'events');
const eventFiles = fs.readdirSync(eventPath)

for (const file of eventFiles){
    const filepath = path.join(eventPath,file);
    const event = require(filepath)
    if (event.once){
        client.once(event.name, (...args)=>event.execute(...args))
    }else{
        client.on(event.name,event.execute)
    }
}

client.login(process.env.TOKEN)








