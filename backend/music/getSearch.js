const ytSearch = require('yt-search')
const getLinks = require('./getLinks')

module.exports = async function getSearch(url) {
    if (url.includes('list=') && !url.includes(' ')){
        const links = await getLinks(url)
        const song_list = []
        for (const link of links){
            try{
                const r = await ytSearch(link)
                const song = r.videos
                if (song[0]) {
                    console.log(song[0].videoId)
                    song_list.push(song[0])
            }
            }catch(err){console.log('This video has an error',err)}
           }
        return song_list 
    
}else{
    const r = await ytSearch(url)
    const song = r.videos.slice(0,1)
    if (!song[0]) {
        console.log('SOMETHING WENT WRONG')
        return;
    }
    return song
}}