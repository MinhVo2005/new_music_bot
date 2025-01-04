const ytSearch = require('yt-search')


 module.exports = async function getSearch(url) {
    const r =  await ytSearch(url)
    const vid = r.videos
    return vid
}
