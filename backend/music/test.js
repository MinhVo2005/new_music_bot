const getLinks = require('./getLinks')
const ytSearch = require('yt-search')

async function test(){
    const l =  await getLinks('https://www.youtube.com/playlist?list=PLwBnYkSZTLgLFk7bb4DChdrRvdWZQSA0Y')
console.log(l)
}
test2();

async function test2(){
    const r = await ytSearch('https://www.youtube.com/watch?v=K8GZ8SoNfmE')
    console.log(r.videos[0])
}