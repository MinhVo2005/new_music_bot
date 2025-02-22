const getStream = require('./getStream')
const {createAudioResource, AudioPlayerStatus} = require('@discordjs/voice')
const killStream = require('./killStream')

module.exports =  function playnext (interaction, player,guildID,connection,queue,server_song,stream) {
    return async ()=>{
    if (!guildID || !queue.has(guildID)) return;

    // Remove the first song and get the next one
    server_song.shift();
    //Remove current stream
    killStream(stream)
    if (!server_song || server_song.length === 0) {
        if (connection.state.status === 'ready'){
            connection.destroy()
            player.off(AudioPlayerStatus.Idle, playnext(player,guildID,connection,queue,server_song))
        }
        await interaction.editReply('Queue is empty. Stopping playback.');
        return
    }
    //get the next song 
    try{
        const nextSong = server_song[0]
        interaction.editReply(`Playing audio from: ${nextSong}`);
        stream = getStream(nextSong);
        const resource = createAudioResource(stream.stdout, { inputType: stream.stdout.inputType });
        player.play(resource); // Play the next song
        }  
    catch(error){
        'Failed to execute code on line 33 file playnext.js \n', error
    }
}
};
