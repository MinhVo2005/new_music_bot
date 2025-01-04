const ytSearch = require('yt-search')


async function getSearch() {
    const url =  await ytSearch('https://www.youtube.com/watch?v=SzZ9WecqUPQ')
    const vid = url.videos.slice(0,1)
    console.log(vid)
}
getSearch()