const {SlashCommandBuilder} =require('discord.js');
const {getVoiceConnection} = require('@discordjs/voice')
const queue = require('./queue')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip song'),
    async execute(interaction){
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }

        const server_song = queue.queue.get(voiceChannel.guild.id)['song']
        const connection = getVoiceConnection(voiceChannel.guild.id)

        if (!connection || (connection.joinConfig.channelId != voiceChannel.id)) {
            return interaction.reply('The bot is not in this channel.');
        }
        try{
            connection.state.subscription.player.stop();
        }catch(error){'Failed to execute code on line 19 file: skip.js', error}
        
        if(server_song.length !== 0){
            await interaction.reply('Skipping to the next song.');
        }
    }
}