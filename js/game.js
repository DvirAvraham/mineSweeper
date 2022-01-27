'use strict'

const EMPTY = ''
const HEART = '❤️'
var gBoard

var gIsLevel2 = 2
var gIsLevel3 = 3

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gClickCounter = 0
var gLives = 3
var gBestScore = 100


function init() {
    gGame.isOn = true
    endStopWatch()
    gMines = []
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    gLives = 3
    gClickCounter = 0
    gGame.markedCount = 0
    gGame.shownCount = 0
    var elBtn = document.querySelector('span')
    elBtn.innerText = '😊'
    var elTimer = document.querySelector('.time')
    elTimer.innerText = '0.00'
    var elLive = document.querySelector('.lives')
    elLive.innerText = HEART.repeat(gLives)
}


function gameOver(isWin) {
    endStopWatch()
    gGame.isOn = false
    var elBtn = document.querySelector('span')
    if (!isWin) {
        for (var i = 0; i < gMines.length; i++) {
            var mine = gMines[i]
            var elMine = document.getElementById(`${mine.location.i}-${mine.location.j}`)
            elMine.classList.add('reveal')
            elMine.style.backgroundColor = 'red'
            elBtn.innerText = '🤯'
            bombAudio()
        }
    } else {
        elBtn.innerText = '🥳'
        winnerrAudio()
    }
}


function mark(elcell) {
    if (gGame.isOn) {
        elcell.classList.toggle('flag')
        if (elcell.innerText === MINE) {
            if (gGame.markedCount < gLevel.MINES) gGame.markedCount++
        }
        if (gGame.markedCount === gLevel.MINES && (gBoard.length ** 2 - gLevel.MINES) === gGame.shownCount) gameOver(true)
    }
}


function cellClicked(elCell, id) {
    var location = idToLocation(id)
    var cell = gBoard[location[0]][location[1]]
    if (!gClickCounter) return onFirstClick(cell, id)
    if (cell.isShown || elCell.classList.contains('flag')) return

    if (gGame.isOn) {
        if (cell === MINE) {
            if (gLives) {
                oopsAudio()
                gLives--
                var elLive = document.querySelector('.lives')
                elLive.innerText = HEART.repeat(gLives)
            } else { return gameOver(false) }
            if (!gLives) gameOver(false)
        }
        if (cell.minesAroundCount === 0) { noNegsExpend(location[0], location[1]) }

        cell.isShown = true
        if (!elCell.classList.contains('reveal')) {
            elCell.classList.add('reveal')
            gGame.shownCount++
        }
        if (gGame.markedCount === gLevel.MINES && (gBoard.length ** 2 - gLevel.MINES) === gGame.shownCount) {
            gameOver(true)
        }
    }
}


function renderBoard(mat) {
    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = (mat[i][j] === MINE) ? MINE : mat[i][j].minesAroundCount
            var id = `${i}-${j}`
            strHTML += `<td id="${id}" class="cell" oncontextmenu="mark(this)" onclick="cellClicked(this, id)"  > ${cell} </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elContainer = document.querySelector(".table-container")
    elContainer.innerHTML = strHTML
}


function buildBoard(SIZE) {
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([])
        for (var j = 0; j < SIZE; j++) {

            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}


function setMinesNegsCount(board, cellI, cellJ) {
    var counter = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j] === MINE) counter++
        }
    }
    return counter
}


//should be in buildBoard function
function countNegs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] !== MINE) gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j)
        }
    }
}


function noNegsExpend(cellI, cellJ) {
    for (var i = +cellI - 1; i <= +cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = +cellJ - 1; j <= (+cellJ + 1); j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            else if (i === +cellI && j === +cellJ) continue;
            var elCell = document.getElementById(`${i}-${j}`)
            if (elCell.innerText === MINE) return
            if (elCell.classList.contains('reveal')) continue
            else {
                gGame.shownCount++
                    gBoard[cellI][cellJ].isShown = true
                elCell.classList.add('reveal')
            }
            if (elCell.innerText === '0') noNegsExpend(i, j)
        }
    }
}


function levelSetting(levelNum) {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    if (gIsLevel2 === levelNum) {
        gLevel.SIZE = 8
        gLevel.MINES = 12
    } else if (gIsLevel3 === levelNum) {
        gLevel.SIZE *= 3
        gLevel.MINES *= 15
    }
    init()
}


function onFirstClick(cell, id) {
    startStopWatch()
    cell.is1Click = true
    createMeins(gBoard, gLevel.MINES)
    countNegs()
    renderBoard(gBoard)
        // console.log(gMines);
    gClickCounter++
    gGame.shownCount++
        var firstElCell = document.getElementById(id)
    firstElCell.classList.add('reveal')
    var location = idToLocation(id)
    cell.isShown = true
    if (!cell.minesAroundCount) noNegsExpend(location[0], location[1])
}


function hintClick(id) {
    var location = idToLocation(id)
    for (var i = +location[0] - 1; i <= +location[0] + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = +location[1] - 1; j <= +location[1] + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            var elCell = document.getElementById(`${i}-${j}`)
            console.log(elCell);

        }
    }
}