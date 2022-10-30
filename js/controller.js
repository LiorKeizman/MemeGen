
'use strict'

let gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['politics', 'cat'] },
    { id: 2, url: 'img/2.jpg', keywords: ['funny', 'cat'] },
    { id: 3, url: 'img/3.jpg', keywords: ['funny', 'baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['funny', 'cat'] },
    { id: 5, url: 'img/5.jpg', keywords: ['baby', 'cat'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny', 'cat'] },
    { id: 7, url: 'img/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny', 'films'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'politics'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny', 'cat'] },
    { id: 12, url: 'img/12.jpg', keywords: ['funny', 'cat'] },
    { id: 13, url: 'img/13.jpg', keywords: ['films', 'cat'] },
    { id: 14, url: 'img/14.jpg', keywords: ['films', 'cat'] },
    { id: 15, url: 'img/15.jpg', keywords: ['films', 'cat'] },
    { id: 16, url: 'img/16.jpg', keywords: ['films', 'cat'] },
    { id: 17, url: 'img/17.jpg', keywords: ['politics', 'cat'] },
    { id: 18, url: 'img/18.jpg', keywords: ['funny', 'films'] },
];

function onInit() {
    init()
    renderGallery()
}

function renderSavedMemes() {
    let memesStr = ''
    console.log(getSavedMemes());
    getSavedMemes().forEach(meme => {
        memesStr += `<img data-id="${gImgs[meme.selectedImgId - 1].id}" src =${meme.imgUrl} onclick="onImgSelect(this)">`
        meme.id++
    })

    document.querySelector('.saved-memes').innerHTML = memesStr
}
function getImgs() {
    return gImgs
}

function renderGallery() {
    console.log(gFilterBy.keywords);
    if (gFilterBy.keywords == '') {
        var images = getImgs()
        const strHtml = images.map(image => `
<img data-id="${image.id}"src=${image.url} class="picture" 
alt="${image.url}"  onclick="onImgSelect(this)">
`).join(' ')
        document.querySelector('.gallery-container').innerHTML = strHtml
    }
else{
    var images = getImgs().filter(img => img.keywords.join().includes(gFilterBy.keywords.toLocaleLowerCase()))
    const strHtml = images.map(image => `
    <img data-id="${image.id}"src=${image.url} class="picture" 
    alt="${image.url}"  onclick="onImgSelect(this)">
    `).join(' ')
    document.querySelector('.gallery-container').innerHTML = strHtml
}
}


function onImgSelect(img) {
    document.querySelector('.gallery-container').classList.add('hide')
    document.querySelector('.meme-editor').classList.remove('hide')
    document.querySelector('.meme-editor').classList.add('hide1')
    document.querySelector('.saved-memes').classList.add('hide')
    setImg(img.dataset.id)
    renderMeme()
}

function onShowGallery() {
    document.querySelector('.gallery-container').classList.remove('hide')
    document.querySelector('.meme-editor').classList.remove('hide1')
    document.querySelector('.meme-editor').classList.add('hide')
    document.querySelector('.saved-memes').classList.add('hide')
}


function onShowSavedMemes() {
    document.querySelector('.gallery-container').classList.add('hide')
    document.querySelector('.meme-editor').classList.remove('hide1')
    document.querySelector('.meme-editor').classList.add('hide')
    document.querySelector('.saved-memes').classList.remove('hide')
}
