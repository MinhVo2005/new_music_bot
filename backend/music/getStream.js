
module.exports = (url) => {
    const youtubedl = require('youtube-dl-exec');

    const currentStreamProcess = youtubedl.exec(url, {
        output: '-',
        format: 'bestaudio',
        quiet: true,
    }, { stdio: ['ignore', 'pipe', 'ignore'] });

    currentStreamProcess.on('error', (error) => {
        console.error('Stream error:', error);
    });

    currentStreamProcess.on('close', (code) => {
        if (code !== 0 && code !== null) {
            console.error(`Stream process exited with code ${code}`);
        }
    });
    return currentStreamProcess;
};