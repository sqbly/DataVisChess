var config = {
    position: 'start'
}

var pos_board = Chessboard('board_positions', config)

const fens = require('fens.json');

console.log(fens[0].value);

var move3_pos = fens["Vachier-Lagrave_Maxime_Caruana_Fabiano_01"]['3w']



pos_bard.position(move3_pos)