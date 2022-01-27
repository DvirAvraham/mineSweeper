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
        if (board[mine.location.i][mine.location.j].is1Click) continue
        gMines.push(mine);
        board[mine.location.i][mine.location.j] = MINE;
    }
}