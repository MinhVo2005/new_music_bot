const youtubedl = require('youtube-dl-exec')


module.exports = function getLinks(url_list){
    return new Promise((resolve, reject) => {
        const dataArray = [];
        const stream = youtubedl.exec(url_list, {
            flatPlaylist: true, // Get all URLs from a playlist
            getUrl: true        // Output direct video URLs
        });

        stream.stdout.on('data', (chunk) => {
            // Split chunk into individual links and add to the array
            const urls = chunk.toString().split('\n').filter(line => line.trim() !== '');
            dataArray.push(...urls);
        });

        stream.stdout.on('end',() => {
            resolve(dataArray); // Resolve the promise with the collected links
        });

        stream.stdout.on('error', (err) => {
            reject(new Error(`Error reading the stream: ${err.message}`)); // Reject the promise on error
        });

        stream.on('error', (err) => {
            reject(new Error(`Stream error: ${err.message}`)); // Handle process errors
        });
    });
 };




