'use strict'

const MINE = '💥'
var gMines = []


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