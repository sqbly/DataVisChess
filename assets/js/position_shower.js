function make_round_pretty(round) {
    if (round[round.length - 1] == 'b') {
        return round.substring(0, round.length - 1) + " black"
    } else {
        return round.substring(0, round.length - 1) + " white"
    }
}

class PositionShower{
    constructor() {
        var config = {
            position: 'start'
        }

        this.pos_board = Chessboard('board_positions', config)
        this.current_round = '0b';
    }
    setPos(game, round) {
        fetch('./assets/jsons/fens.json')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(round);
                var fens = data;
                var move = fens[game][round]
                if (move != null) {
                    console.log(move);
                    document.getElementById("sit_board_title").innerHTML = "Move " + make_round_pretty(round);
                    this.current_round = round;
                    this.pos_board.position(move)
                } else {
                    if (round == 'start' && game != null) {
                        document.getElementById("sit_board_title").innerHTML = "Start";

                        this.pos_board.position('start')
                        this.current_round = 'start';
                    }
                }
            });
    }
    reset() {
        document.getElementById("sit_board_title").innerHTML = "Start";
        this.pos_board.position('start')
        this.current_round = 'start';
    }
}

posShow = new PositionShower(); 

function prevMove() {

    var color = posShow.current_round[posShow.current_round.length - 1];
    var number = posShow.current_round.substring(0, posShow.current_round.length - 1);

    if (color == 'b') {
        var new_round = number + 'w';
        posShow.setPos(currentGame, new_round)
    } else {
        var round_no = parseInt(number);
        if (round_no != 1) {
            round_no = round_no - 1;
            var new_round = round_no.toString() + 'b';
            posShow.setPos(currentGame, new_round)
        } else {
            posShow.setPos(currentGame, "start")
        }
    }
}
function nextMove() {
    if (posShow.current_round == "start") {
        posShow.setPos(currentGame, "1w")
    }

    var color = posShow.current_round[posShow.current_round.length - 1];
    var number = posShow.current_round.substring(0, posShow.current_round.length - 1);

    if (color == 'w') {
        var new_round = number + 'b';
        posShow.setPos(currentGame, new_round)
    } else {
        var round_no = parseInt(number);
        
        round_no = round_no + 1;
        var new_round = round_no.toString() + 'w';
        posShow.setPos(currentGame, new_round)
        
    }
}







