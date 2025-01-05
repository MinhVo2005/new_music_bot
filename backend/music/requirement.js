const {joinVoiceChannel} = require('@discordjs/voice')

module.exports = async(interaction,queue) =>{
    const voiceChannel = interaction.member.voice.channel; 
    const guildID = voiceChannel.guild.id;
    const channelId =  voiceChannel.id;

    // Join the voice channel
    const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildID,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    //Create a queue
    if (!queue || !queue.get(guildID)){
        queue.set(guildID, {connection:connection, song:[]})
    }
    try{
        if (queue.get(guildID)['connection'].state.status === 'destroyed'){
            queue.get(guildID)['connection'] = connection
        }
    }catch{console.log('Connection did not exist yet')}
}