const {SlashCommandBuilder} =require('discord.js');
const {getVoiceConnection} = require('@discordjs/voice')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause song'),
    async execute(interaction){
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }
        const connection = getVoiceConnection(voiceChannel.guild.id)
        if (!connection || (connection.joinConfig.channelId != voiceChannel.id)) {
            return interaction.reply('The bot is not in this channel.');
        }
        connection.state.subscription.player.pause();
        await interaction.reply('Paused.');
    }
}
