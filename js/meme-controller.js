'use strict'
let gElCanvas
let gCtx
let gStartPos
let isBorderLine = true
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function init() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderEmojies()
    renderKeyWords()
}

function getElCanvas() {
    return gElCanvas
}


function renderMeme() {
    let meme = getMeme()
    let idx = meme.selectedLineIdx
    let memeIdx = meme.selectedImgId
    const img = new Image()
    img.src = `img/${memeIdx}.jpg`
    setTextBorder()
    img.onload = () => {
        resizeCanvas()
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        meme.lines.forEach((line, idx) => drawText(line, idx, line.pos.x, line.pos.y))
    }
}
function renderKeyWords() {
    let keyWordsByPopStr = '';
    const keywordsObj = getKeywords();
    console.log(keywordsObj);
    for (const word in keywordsObj) {
        keyWordsByPopStr += `<span class="keyword" style="font-size:${keywordsObj[word]}px;margin-right:5px" value="${word}" data-trans="${word}" onclick="onKeywordClick(this.getAttribute('value'))">${word}</span>`
    }
    document.querySelector('.keywords').innerHTML = keyWordsByPopStr;
}
function drawText(line, idx, x, y) {
    let text = line.txt
    let color = line.color
    let size = line.size
    let align = line.align
    let stroke = line.stroke
    gCtx.textAlign = align
    gCtx.lineWidth = 1
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = color

    let newX = x
    let newY = y
    gCtx.font = `${size}px arial`
    gCtx.fillText(text, newX, newY)
    gCtx.strokeText(text, newX, newY)
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL('image/jpeg')
    console.log('data', data)
    elLink.href = data
    elLink.download = 'My-new-meme'
}

function onFlexible() {
    document.querySelector('.gallery-container').classList.add('hide')
    document.querySelector('.meme-editor').classList.remove('hide')
    document.querySelector('.meme-editor').classList.add('hide1')
    flexibleMeme()

}


function flexibleMeme() {
    let meme = getMeme()
    if (meme.lines.length > 2) {
        meme.lines.length = 1
    }
    if (Math.random() < 0.55) {
        meme.lines.push({
            txt: randStr(),
            size: getRandomIntInclusive(20, 38),
            align: 'center',
            color: getRandomColor(),
            stroke: getRandomColor()
        })
    }
    const img = new Image()
    img.src = `img/${getRandomIntInclusive(1, 6)}.jpg`
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        meme.lines.forEach((line, idx) => drawRandomText(line, idx, 20, 50))
    }

}
function drawRandomText(line, idx, x, y) {
    let text = randStr()
    let color = getRandomColor()
    let size = getRandomIntInclusive(20, 38)
    let align = line.align
    let stroke = getRandomColor()
    gCtx.textAlign = align
    gCtx.lineWidth = 1
    gCtx.strokeStyle = stroke
    gCtx.fillStyle = color

    let newX = gElCanvas.width / 2
    let newY = y * (idx + 0.7)
    gCtx.font = `${size}px arial`
    gCtx.fillText(text, newX, newY)
    gCtx.strokeText(text, newX, newY)
}
function onSaveMeme() {
    saveMeme(gElCanvas.toDataURL('image/jpeg'))
    renderSavedMemes()
}
function onSubmitSearch(val) {
    filterBySearch(val)
    renderGallery()
}
function onKeywordClick(val){
    filterBySearch(val)
    renderGallery()
    updateKeywords(val)
    renderKeyWords()

}
function resizeCanvas() {
    const elContainer = document.querySelector('#my-canvas')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
    // renderMeme()
}
function addListeners() {
    addMouseListeners()
    addTouchListeners()

    // window.addEventListener('resize', () => {
    //   resizeCanvas()
    // //   renderMeme()
    // })
    //   renderCanvas()
    // })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}


function setTextBorder(){
if(!isBorderLine)return
const meme = getMeme()
let counter = 0
meme.lines.forEach((line) => { if (line.txt) counter++ })
if (counter === 0) return
gCtx.beginPath()
const { x, y, width, height } = getTextPosition(true)
gCtx.strokeStyle = 'yellow'
gCtx.lineWidth = 3
gCtx.strokeRect(x, y, width, height);
}
function getTextPosition(isCurrLine) {
    let meme = getMeme()
    let text = meme.lines[meme.selectedLineIdx].txt
    const lines = meme.lines.map(line => {
        const { width = gCtx.measureText(text).width, size: height, pos , idx ,txt} = line
        const posi = {
            x: pos.x - width / 2,
            y: pos.y - height,
            width: gCtx.measureText(txt).width,
            height: height * 1.2,
            idx,
        }
        return posi
    })
    if(isCurrLine)return lines[meme.selectedLineIdx]
    return lines
}
function onDown(ev) {
    const pos = getEvPos(ev)
    const text = isTextClicked(pos)
    console.log(text);
    if (!text) return
    console.log(text.idx);
    getLineIdx(text.idx)
    setTextDrag(true)
    setTextBorder()
    const meme = getMeme()
    const elTxtInputBox = document.querySelector('.txt')
    elTxtInputBox.value = meme.lines[meme.selectedLineIdx].txt
    elTxtInputBox.focus()
    document.querySelector('.txt').focus()
    gStartPos = pos
    document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    let meme = getMeme()
    const { isDrag } = meme.lines[meme.selectedLineIdx]
    if (!isDrag) return
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveText(dx, dy)
    gStartPos = pos
    setTextBorder()
    renderMeme()

}

function onUp() {
    setTextDrag(false)
    setTextBorder()
    document.body.style.cursor = 'grab'
}
function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}
function renderEmojies(){
    let display = document.querySelector('.emoji-container')
    var emojies = getEmojies()
    const strHTML = emojies.map(emoji =>`
    <button class="emoji" onclick="onSetEmoji(this)">${emoji}</button>`).join(' ')
    display.innerHTML = strHTML
}
function onSetEmoji(elEmoji){
addLine(elEmoji.innerText)
renderMeme()
}