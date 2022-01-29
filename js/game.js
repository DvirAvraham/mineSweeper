'use strict'

const EMPTY = ''
const HEART = '❤️'
const HINT = '💡'
var gBoard

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

var gLastMoves = []
var gIsLevel2 = 2
var gIsLevel3 = 3
var gClickCounter = 0
var gLivesStr = 3
var gHintsStr = 3
var gSafeClickCount = 3
var gManuallyMinesNum = 0
var gIsHintOn = false
var gIsSevenBoomOn = false
var gIsSafeOn = false
var gIsUnDoOn = false
var gIsManuallyOn = false
var gManuallyMode = false





function init() {
    gGame.isOn = true
    endStopWatch()
    gManuallyMode = false
    gIsManuallyOn = false
    gMines = []
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    gLivesStr = 3
    gHintsStr = 3
    gSafeClickCount = 3
    gClickCounter = 0
    gGame.secsPassed = 0
    gGame.markedCount = 0
    gGame.shownCount = 0
    gMinesBoomCount = 0
    gManuallyMinesNum = 0
    var elBtn = document.querySelector('span')
    elBtn.innerText = '😊'
    var elTimer = document.querySelector('.time')
    elTimer.innerText = '0.00'
    var elLive = document.querySelector('.lives')
    elLive.innerText = HEART.repeat(gLivesStr)
    var elHint = document.querySelector('.hint')
    elHint.innerText = HINT.repeat(gHintsStr)
    var elCount = document.querySelector('.safe-remain')
    elCount.innerText = gSafeClickCount
    var elManuallBtn = document.querySelector('.manually-create')
    elManuallBtn.innerText = 'manually create ? '
}


function gameOver(isWin) {
    gGame.isOn = false
    endStopWatch()
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
    if (isWin) {
        var elSecs = document.querySelector('.time').innerText
        gGame.secsPassed = elSecs
        if (gBoard.length === 4) bestTimeEasy()
        if (gBoard.length === 8) bestTimeHard()
        if (gBoard.length === 12) bestTimeExtreme()
    }
}


function mark(elcell) {
    if (gGame.isOn) {
        if (elcell.classList.contains('reveal')) return
        if (elcell.innerText === MINE && elcell.classList.contains('flag')) {
            gGame.markedCount--
                elcell.classList.remove('flag')
            return
        }
        if (elcell.innerText === MINE) {
            if (gGame.markedCount < gLevel.MINES || gGame.markedCount < gMinesBoomCount) gGame.markedCount++
        }
        elcell.classList.toggle('flag')
        if (gIsSevenBoomOn) {
            if (gGame.markedCount === gMinesBoomCount && (gBoard.length ** 2 - gMinesBoomCount) === gGame.shownCount) return gameOver(true)
        }
        if (gGame.markedCount === gLevel.MINES && (gBoard.length ** 2 - gLevel.MINES) === gGame.shownCount) gameOver(true)
    }
}


function cellClicked(elCell, id) {
    var location = idToLocation(id)
    var cell = gBoard[location[0]][location[1]]
    if (gIsManuallyOn) return clickManuallyCreate(id)
    if (!gClickCounter) return onFirstClick(cell, id)
    if (gIsHintOn) {
        gHintsStr--
        var elHint = document.querySelector('.hint')
        elHint.innerText = HINT.repeat(gHintsStr)
        hintClick(id)
        return gIsHintOn = false

    }
    if (cell.isShown || elCell.classList.contains('flag')) return

    if (gGame.isOn) {
        if (cell === MINE) {
            if (gLivesStr) {
                oopsAudio()
                gLivesStr--
                var elLive = document.querySelector('.lives')
                elLive.innerText = HEART.repeat(gLivesStr)
            } else { return gameOver(false) }
            if (!gLivesStr) gameOver(false)
        }

        if (cell.minesAroundCount === 0) { noNegsExpend(location[0], location[1]) }

        cell.isShown = true
        if (!elCell.classList.contains('reveal')) {
            elCell.classList.add('reveal')
            gGame.shownCount++
                gLastMoves.push(id)
        }
        if (gIsSevenBoomOn) {
            if (gGame.markedCount === gMinesBoomCount && (gBoard.length ** 2 - gMinesBoomCount) === gGame.shownCount) return gameOver(true)
        }
        if (gGame.markedCount === gLevel.MINES && (gBoard.length ** 2 - gLevel.MINES) === gGame.shownCount) gameOver(true)
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
                gLastMoves.push(i + '-' + j)
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
    if (gIsSevenBoomOn) {
        sevenBoom(gBoard)
        countMines(gBoard)
    } else if (gManuallyMode) console.log(':)');
    else createMeins(gBoard, gLevel.MINES)
    countNegs()
    renderBoard(gBoard)
    gClickCounter++
    gGame.shownCount++
        gLastMoves.push(id)
    var firstElCell = document.getElementById(id)
    firstElCell.classList.add('reveal')
    var location = idToLocation(id)
    cell.isShown = true
    if (!cell.minesAroundCount) noNegsExpend(location[0], location[1])
}


function hintClick(id) {
    if (!gGame.isOn) return
    var revealeds = []
    gIsHintOn = true
    var location = idToLocation(id)
    for (var i = +location[0] - 1; i <= +location[0] + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = +location[1] - 1; j <= +location[1] + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            var elNeg = document.getElementById(`${i}-${j}`)
            if (elNeg.classList.contains('reveal')) {
                revealeds.push({ i: i, j: j })
                continue
            } else {
                elNeg.classList.add('reveal')
                revealeds.push({ i: null, j: null })
            }
        }
    }

    setTimeout(function() {
        var length = revealeds.length
        var location = idToLocation(id)
        for (var i = +location[0] - 1; i <= +location[0] + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = +location[1] - 1; j <= +location[1] + 1; j++) {
                if (j < 0 || j >= gBoard.length) continue;
                var elNeg = document.getElementById(`${i}-${j}`)

                if (revealeds[0].i === i && revealeds[0].j === j) revealeds.shift()
                else {
                    revealeds.shift()
                    elNeg.classList.remove('reveal')
                }
            }

        }
    }, 1000)
}



// setTimeOut malfunction with the separate function below//***
// function hintRemover(id) {
//     var location = idToLocation(id)
//     for (var i = +location[0] - 1; i <= +location[0] + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = +location[1] - 1; j <= +location[1] + 1; j++) {
//             if (j < 0 || j >= gBoard.length) continue;
//             var elNeg = document.getElementById(`${i}-${j}`)
//             elNeg.classList.remove('reveal')
//         }
//     }
// }



function clickSevenBoom() {
    gIsSevenBoomOn = !gIsSevenBoomOn
    var elSeven = document.querySelector('.sevenBoom')
    if (gIsSevenBoomOn) {
        elSeven.innerText = 'Regular version?'
    } else {
        elSeven.innerText = '7 Boom ?'
    }
    init()
}

function safeClick() {
    if (gIsSevenBoomOn) {
        if ((gBoard.length ** 2 - gMinesBoomCount) === gGame.shownCount) return
    } else {
        if ((gBoard.length ** 2 - gLevel.MINES) === gGame.shownCount) return
    }
    if (!gGame.isOn) return
    if (!gGame.isOn) return
    if (!gSafeClickCount) return
    gSafeClickCount--
    gIsSafeOn = true
    var count = 0
    while (!count) {
        var idxI = getRandomInt(0, gBoard.length - 1)
        var idxJ = getRandomInt(0, gBoard.length - 1)
        var elCell = document.getElementById(`${idxI}-${idxJ}`)
        if (gBoard[idxI][idxJ] !== MINE && !elCell.classList.contains('reveal')) {
            count++
            elCell.classList.add('reveal')
            setTimeout(() => {
                elCell.classList.remove('reveal')
            }, 1000);

        }
        gIsSafeOn = false
        var elCount = document.querySelector('.safe-remain')
        elCount.innerText = gSafeClickCount

    }
}



function ClickOnUnDoBtn() {
    gIsUnDoOn = true
    var lastCell = gLastMoves.pop()
    var location = idToLocation(lastCell)
    gBoard[location[0]][location[1]].isShown = false
    gGame.shownCount--
        var elCell = document.getElementById(`${lastCell}`)
    elCell.classList.remove('reveal')
    gIsUnDoOn = false
}


function clickManuallyCreate(id) {
    debugger
    gIsManuallyOn = true
    if (!gManuallyMinesNum) {
        if (gBoard.length === 4) gManuallyMinesNum = 2
        else if (gBoard.length === 8) gManuallyMinesNum = 12
        else if (gBoard.length === 12) gManuallyMinesNum = 30
        document.querySelector('.manually-create').innerText = `place ${gManuallyMinesNum} mines`
    }
    if (!id) return
    var location = idToLocation(id)
    var mine = {
        location: {
            i: location[0],
            j: location[1]
        },
        isShown: false,
        isMine: true,
        isMarked: false
    }

    gMines.push(mine);
    gBoard[mine.location.i][mine.location.j] = MINE;
    gManuallyMinesNum--

    if (gManuallyMinesNum === 0) {
        document.querySelector('.manually-create').innerText = `Lets play !`
        gIsManuallyOn = !gIsManuallyOn
        gManuallyMode = true
    }
}