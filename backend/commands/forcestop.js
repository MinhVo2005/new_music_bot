const {SlashCommandBuilder} =require('discord.js');
const {getVoiceConnection} = require('@discordjs/voice')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forcestop')
        .setDescription('sStop and disconnect the bot'),
    async execute(interaction){
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }
        const connection = getVoiceConnection(voiceChannel.guild.id)

        try{
            connection.state.subscription.player.stop();
            connection.destroy()
        }catch(error){'Failed to execute code on line 19 file: skip.js', error}
        
        await interaction.reply('Bot has been force stop!');
    }
}