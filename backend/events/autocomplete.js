const { InteractionType } = require('discord.js');
const ytSearch = require('yt-search');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            const focusedValue = interaction.options.getFocused(); // User's input

            if (!focusedValue) return interaction.respond([]); // No input, return empty array

            try {
                // Perform a YouTube search using yt-search
                const results = await ytSearch(focusedValue);

                // Filter results to get the top 10 videos
                const suggestions = results.videos.slice(0, 5).map(video => ({
                    name: `${video.title.substring(0, 90)} (${video.timestamp})`, // Truncate title to 100 characters
                    value: video.url, // Use the video URL as the value
                }));

                // Respond with suggestions
                await interaction.respond(suggestions);
            } catch (error) {
                console.log('Error fetching YouTube search results:', error);
                await interaction.respond([]);
            }
        }
    },
};