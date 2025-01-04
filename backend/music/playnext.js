const getStream = require('./getStream')
const {createAudioResource, AudioPlayerStatus} = require('@discordjs/voice')


function killStream(currentStreamProcess) {
    if (currentStreamProcess) {
        currentStreamProcess.kill('SIGTERM'); // Graceful termination
        currentStreamProcess.removeAllListeners();
        console.log('Stream terminated.');
    } else {
        console.log('No active stream to terminate.');
    }
}


module.exports = function playnext (player,guildID,connection,queue,server_song,stream) {
    return ()=>{
    if (!guildID || !queue.has(guildID)) return;
    // Remove the first song and get the next one
    server_song.shift();
    if (!server_song || server_song.length === 0) {
        console.log('Queue is empty. Stopping playback.');
        if (connection.state.status === 'ready'){
            connection.destroy()
            player.off(AudioPlayerStatus.Idle, playnext(player,guildID,connection,queue,server_song))
        }
        return;}
    
    //Remove current stream
    killStream(stream)

    //get the next song 
    try{
        const nextSong = server_song[0].url
        console.log(`Playing next song: ${nextSong}`);

        const stream = getStream(nextSong);
        const resource = createAudioResource(stream.stdout, { inputType: stream.stdout.inputType });
        player.play(resource); // Play the next song
        }
    catch(error){
        'Failed to execute code on line 33 file playnext.js \n', error
    }
}
};
