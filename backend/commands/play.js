require('dotenv').config()
const {SlashCommandBuilder,} =require('discord.js');
const { createAudioPlayer, createAudioResource,AudioPlayerStatus, NoSubscriberBehavior, getVoiceConnection,  } = require('@discordjs/voice');
const getStream = require('../music/getStream')
const getLinks = require('../music/getLinks')
const requirement = require('../music/requirement')
const playnext = require('../music/playnext')
const queueCom = require('../commands/queue')
const getSearch = require('../music/getSearch')


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
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('link');
        const voiceChannel = interaction.member.voice.channel;
        // create connection and queue
        if (!voiceChannel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }  
        await requirement(interaction,queue,url)


        const guildID = voiceChannel.guild.id;
        const connection = queue.get(guildID)['connection']
        const server_song = queue.get(guildID)['song']
        const original_length = server_song.length
        
        if(url.includes(' ')){
            const video = await getSearch(url)
            console.log('HI HERE IS AN ERROR')
        }else if (url.includes('list=') && !url.includes(' ')){ 
            const links = await getLinks(url)
            for (const link of links){
                const song = await getSearch(link)
                if (!song[0]) {
                    console.log('HEELLO')
                    return interaction.reply('There is an error adding this song')}
                server_song.push(song[0])
            }
        }else{
            const song = await getSearch(url)
            if (!song[0]) {
                console.log('SOMETHING WENT WRONG')
                return interaction.reply('There is an error adding this song')}
            server_song.push(song[0])
        }
        console.log("Song in queue:",queue.get(voiceChannel.guild.id)['song'])
        console.log('Song added')
        await interaction.reply(`Joining ${voiceChannel.name} and playing audio from: ${url}`);
        //Check if /play to add or to play song
        if (original_length > 0) return;

        //get stream from server song
        const stream =  getStream(server_song[0].url)
        currentStreamProcess = stream
        
        const resource =  createAudioResource(stream.stdout,
            {inputType: stream.stdout.inputType})
        // Play the audio resource
        player.play(resource);
        connection.subscribe(player);

            
        
        //Handle when song is finished


        if (!listenerOnline){
            listenerOnline = true
            player.on(AudioPlayerStatus.Idle,  playnext(player,guildID,connection,queue,server_song,currentStreamProcess))
        }
        
        //turn off listener once connection is destroyed
        connection.on('stateChange', (oldState, newState) => {
            if (newState.status === 'destroyed' && listenerOnline) {
                player.off(AudioPlayerStatus.Idle, playnext(player,guildID,connection,queue,server_song,currentStreamProcess));
                listenerOnline = false;
            }
        });
},  

};
