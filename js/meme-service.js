'use strict'
//  var gSavedMemes = [] 
 let  isLineBorder = true
 var gEmojies = `😃😄😁😆😅😂`
 var gKeywords = loadFromStorage('keywords')?loadFromStorage('keywords'):{funny:34,baby:20,animal:20,crazy:26,politic:30,}
 var gMeme = {
    selectedImgId:1, 
    selectedLineIdx: 0, 
    // pos:{x:200,y:200},
    lines: [ 
       { 
           pos:{x:200,y:200},
           txt: 'I sometimes eat Falafel', 
           size: 30, 
           align: 'center', 
           color: 'red',
           stroke: 'white',
           idx:0,
        //    width: gCtx.measureText(txt).width,
           isDrag:false

        },
            ]
        }
        var gSavedMemes = (loadFromStorage('savedMemes'))?loadFromStorage('savedMemes'):[]
        function getMeme(){
            return gMeme
}
function getSavedMemes(){
    return gSavedMemes
}
function getKeywords(){
    return gKeywords
}

function setLineTxt(text){
let idx = gMeme.selectedLineIdx
gMeme.lines[idx].txt = text
setTextBorder()
renderMeme()
}
function setImg(id){
gMeme.selectedImgId = +id
renderMeme()
}
function setColor(color){
 let idx = gMeme.selectedLineIdx
gMeme.lines[idx].color = color
renderMeme()
}
function getEmojies(){
    return gEmojies.split(/(?:)/u)
}
function setIncreaseFont(){
    let idx = gMeme.selectedLineIdx
    if(gMeme.lines[idx].size > 38)return
    gMeme.lines[idx].size += 2
    setTextBorder()
    renderMeme()
}
function setDecreaseFont(){
    let idx = gMeme.selectedLineIdx
    if(gMeme.lines[idx].size < 20)return
    gMeme.lines[idx].size -= 2
    setTextBorder()
    renderMeme()
}
function switchLine(){
  (gMeme.selectedLineIdx < gMeme.lines.length - 1)?gMeme.selectedLineIdx++ : gMeme.selectedLineIdx=0
  gMeme.lines[gMeme.selectedLineIdx]
  renderMeme()
}
function addLine(emoji){
    gMeme.selectedLineIdx++
    let canvas = getElCanvas()
    console.log(canvas.width,canvas.height );
    gMeme.lines.push({ 
        pos:{x:canvas.width / 2, y:canvas.height - 200 },
        txt:emoji || 'New Line!', 
        size: 30, 
        align: 'center', 
        color: 'black',
        idx:gMeme.selectedLineIdx,
        stroke: 'white'
    })
    isLineBorder = true
    document.querySelector('.txt').value = ''
    console.log(document.querySelector('.txt').value);
    document.querySelector('.txt').focus()
    setTextBorder()
    renderMeme()
}
function deleteLine(){
let idx = gMeme.selectedLineIdx
    gMeme.lines.splice(idx, 1)
    renderMeme()
}
function alignToLeft(){
    let idx = gMeme.selectedLineIdx
    gMeme.lines[idx].align = 'left'
    setTextBorder()
    renderMeme()
}
function alignToCenter(){
    let idx = gMeme.selectedLineIdx
    gMeme.lines[idx].align = 'center'
    setTextBorder()
    renderMeme()
}
function alignToRight(){
    let idx = gMeme.selectedLineIdx
    gMeme.lines[idx].align = 'right'
    setTextBorder()
    renderMeme()
}
function changeTxtStroke(){
 let idx = gMeme.selectedLineIdx;
 gMeme.lines[idx].stroke = (gMeme.lines[idx].stroke === 'white')?'black':'white'
//  (gMeme.lines[idx].stroke === 'white')?gMeme.lines[idx].stroke = 'black':gMeme.lines[idx].stroke = 'white'
 renderMeme()
}
function saveMeme(url){
    let savedMeme = JSON.parse(JSON.stringify(gMeme));
    savedMeme.imgUrl = url
    console.log(savedMeme);
    gSavedMemes.push(savedMeme)
    console.log(gSavedMemes);
    saveToStorage('savedMemes',gSavedMemes)
}
var gFilterBy = {keywords:[]}
function filterBySearch(val){
// let imgs = getImgs()
if(val !== undefined)gFilterBy.keywords = val
return gFilterBy
}

function getLineIdx(idx){
    gMeme.selectedLineIdx = idx   
}
function isTextClicked(clickedPos) {
    // let width = gCtx.meus
    const positions = getTextPosition()
    console.log(clickedPos);
    console.log(positions);
    const clickedText = positions.find(textPos => {
        // gMeme.selectedLineIdx = textPos.idx
        // Check if the click coordinates are inside the bar coordinates
        return clickedPos.x > textPos.x - 50 && clickedPos.x < textPos.x + textPos.width+30 &&
            clickedPos.y > textPos.y -50 && clickedPos.y < textPos.y + textPos.height
    })
    return clickedText
}


function setTextDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
  }
  function moveText(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
    // renderMeme()
  }
  function updateKeywords(val){
    if(gKeywords[val]>=50)return
    if(gKeywords[val])gKeywords[val] += 1
    saveToStorage('keywords',gKeywords)
  }