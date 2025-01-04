const {SlashCommandBuilder} =require('discord.js');
const {getVoiceConnection} = require('@discordjs/voice')


module.exports = {
    queue: new Map(),
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the queue'),
    async execute(interaction){
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }
        const connection = getVoiceConnection(voiceChannel.guild.id)
        if (!connection || (connection.joinConfig.channelId != voiceChannel.id)) {
            return interaction.reply('The bot is not in this channel.');
        }
        const guildID = voiceChannel.guild.id
        const server_song = this.queue.get(guildID)['song']
        await interaction.reply(`There is ${server_song.length} left`)
    }
}

