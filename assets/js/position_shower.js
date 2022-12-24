





class PositionShower{
    constructor() {
        var config = {
            position: 'start'
        }

        this.pos_board = Chessboard('board_positions', config)
    }
    setPos(game, round) {
        fetch('./assets/jsons/fens.json')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                var fens = data;
                var move3_pos = fens[game][round]
                console.log(move3_pos);
                this.pos_board.position(move3_pos)
            });
    }
}

posShow = new PositionShower(); 

posShow.setPos('Alekseenko_Kirill_Caruana_Fabiano_09', '5b')







