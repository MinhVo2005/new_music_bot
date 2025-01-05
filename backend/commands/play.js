require('dotenv').config()
const {SlashCommandBuilder,} =require('discord.js');
const { createAudioPlayer, createAudioResource,AudioPlayerStatus, NoSubscriberBehavior, getVoiceConnection,  } = require('@discordjs/voice');
const getStream = require('../music/getStream')
const getLinks = require('../music/getLinks')
const requirement = require('../music/requirement')
const playnext = require('../music/playnext')
const queueCom = require('../commands/queue')




const queue = queueCom.queue // queue(guild.id, queue_constructor object {voice channel, connection, song[]})
//song has [url]
const player =  createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Stop,
    }});

let listenerOnline = false
let currentStreamProcess;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music')
         .addStringOption( option => 
            option
                .setName('link')
                .setDescription('Input a youtube link')
                .setRequired(true)
                .setAutocomplete(true)
            ),
    async execute(interaction) {
        const url = interaction.options.getString('link');
        console.log(url)
        const voiceChannel = interaction.member.voice.channel;
        // create connection and queue
        if (!voiceChannel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }  
        await requirement(interaction,queue)
        

        const guildID = voiceChannel.guild.id;
        const connection = queue.get(guildID)['connection']
        const server_song = queue.get(guildID)['song']
        const original_length = server_song.length

    
        if (url.includes('list=') && !url.includes(' ')){
            const links = await getLinks(url)
            for (const link of links){
                server_song.push(link)
            }
        }
        else{
            server_song.push(url)
        }
        //Check if /play to add or to play song
        if (original_length > 0){
            return interaction.reply('Song has been added')
        };

        //get stream from server song
        const song_url = server_song[0]
        await interaction.reply(`Joining ${voiceChannel.name} and playing audio from: ${song_url}`);
        const stream =  getStream(song_url)
        currentStreamProcess = stream
        
        const resource =  createAudioResource(stream.stdout,
            {inputType: stream.stdout.inputType})
        // Play the audio resource
        player.play(resource);
        connection.subscribe(player);
        //Handle when song is finished
        if (!listenerOnline){
            listenerOnline = true
            player.on(AudioPlayerStatus.Idle,  playnext(interaction,player,guildID,connection,queue,server_song,currentStreamProcess))
            console.log(player.listeners)
        }
        //turn off listener once connection is destroyed
        connection.on('stateChange', (oldState, newState) => {
            if (newState.status === 'destroyed' && listenerOnline) {
                player.off(AudioPlayerStatus.Idle, playnext(interaction,player,guildID,connection,queue,server_song,currentStreamProcess));
                listenerOnline = false;
                console.log('Turn off')
            }   
        });
},  
};
 