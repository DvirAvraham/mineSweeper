'use strict'

const EMPTY = ''
var gBoard
var gLevel1 = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function init() {
    gGame.isOn = true
    gMines = []
    gBoard = buildBoard(gLevel1.SIZE)
    createMeins(gBoard, gLevel1.MINES)
    getNegCount()
    renderBoard(gBoard)
    gGame.markedCount = 0
    gGame.shownCount = 0
    var elBtn = document.querySelector('span')
    elBtn.innerText = '😊'
}


function gameOver(isWin) {
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
            LoserAudio()
        }
    } else {
        elBtn.innerText = '🥳'
    }
}


function mark(elcell) {
    elcell.classList.toggle('flag')
    if (elcell.innerText === MINE) {
        if (gGame.markedCount < gLevel1.MINES) gGame.markedCount++
    }
    if (gGame.markedCount === gLevel1.MINES && (gBoard.length ** 2 - gLevel1.MINES) === gGame.shownCount) gameOver(true, elcell)

}


function cellClicked(elCell, id) {
    var location = idToLocation(id)
    var cell = gBoard[location[0]][location[1]]
    if (cell.isShown) return
    if (gGame.isOn) {
        if (cell.minesAroundCount === 0) { noNegs(location[0], location[1]) }
        elCell.classList.add('reveal')
        if (cell === MINE) return gameOver(false)
        cell.isShown = true
        gGame.shownCount++
            console.log(gBoard.length ** 2 - gLevel1.MINES, 'gBoard.length - gLevel1.MINES');
        console.log(gLevel1.MINES, 'gLevel1.MINES');
        console.log(gGame.markedCount, 'gFlagCount');
        console.log(gGame.markedCount, 'gGame.markedCount');
        console.log(gGame.shownCount, 'gGame.shownCount');
        if (gGame.markedCount === gLevel1.MINES && (gBoard.length ** 2 - gLevel1.MINES) === gGame.shownCount) gameOver(true)
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
function getNegCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] !== MINE) gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j)
        }
    }
}

function noNegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellJ + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellI - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === cellI && j === cellJ) continue;
            var elCell = document.getElementById(`${i}-${j}`)
            if (elCell.classList.contains('reveal') || elCell.isMine) break
            else {
                elCell.classList.add('reveal')
                gGame.shownCount++
            }
        }
    }
}