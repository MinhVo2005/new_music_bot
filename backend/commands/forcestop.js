const {SlashCommandBuilder} =require('discord.js');
const {getVoiceConnection} = require('@discordjs/voice')
const {queue}  = require('./queue')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forcestop')
        .setDescription('sStop and disconnect the bot'),
    async execute(interaction){
        const voiceChannel = interaction.member.voice.channel;
        const guildId = voiceChannel.guild.id;
        if (!voiceChannel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }
        const connection = getVoiceConnection(voiceChannel.guild.id)

        try{
            console.log(queue.queue.get(guildId)['song'])
            queue.queue.get(guildId)['song'] = []
            connection.state.subscription.player.stop();
        }catch(error){'Failed to execute code on line 19 file: forcestop.js', error}
        
        await interaction.reply('Bot has been force stop!');
    }
}