'use strict'

const MINE = '💥'
var gMines = []
var gSevenBoomMines = []
var gSevenBoomMinesCount = 0
var gMinesBoomCount = 0


function createMeins(board, quantity) {
    for (var i = 0; i < quantity; i++) {
        var mine = {
            location: {
                i: getRandomInt(0, board.length - 1),
                j: getRandomInt(0, board.length - 1)
            },
            isShown: false,
            isMine: true,
            isMarked: false
        }
        if (board[mine.location.i][mine.location.j].is1Click) {
            quantity++
            continue
        }
        if (isLocTaken(mine.location.i, mine.location.j)) {
            i--
            continue
        }
        gMines.push(mine);
        board[mine.location.i][mine.location.j] = MINE;
    }
}


function isLocTaken(idxI, idxJ) {
    if (!gMines.length) return false
    else {
        for (var i = 0; i < gMines.length; i++) {
            if (gMines[i].location.i === idxI && gMines[i].location.j === idxJ) return true
            else continue
        }
    }
}



function sevenBoom(board) {
    gSevenBoomMines = []
    findSevenBoomIdx(board)
    for (var i = 0; i < gSevenBoomMines.length; i++) {
        var mine = {
            location: gSevenBoomMines[i],
            isShown: false,
            isMine: true,
            isMarked: false
        }
        if (board[mine.location.i][mine.location.j].is1Click) {
            continue
        }
        gMines.push(mine);
        board[mine.location.i][mine.location.j] = MINE;
    }
}


function findSevenBoomIdx(board) {
    var counter = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            counter++
            var counterStr = counter + ''
            if (i === 0 && j === 0) continue
            if (counter % 7 === 0 || counterStr.includes('7')) {
                gSevenBoomMinesCount++
                gSevenBoomMines.push({ i: i, j: j })
            } else continue
        }
    }
}


function countMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] === MINE) gMinesBoomCount++
        }
    }
}