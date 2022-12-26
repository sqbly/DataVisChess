var width = 600;
var height = 600;

var currentGame = 'Alekseenko_Kirill_Caruana_Fabiano_09';

function posTranslator(pos) {
    var x = pos.charCodeAt(0) - 97;
    var y = pos.charCodeAt(1) - 49;
    var point = {
        x: x * Math.floor((width - 2) / 8) + Math.floor(width / 16) + 1,
        y: y * Math.floor((height - 2) / 8) + Math.floor(height / 16) + 2,
        value: 1
    };
    return point;
}

class HeatmapShower {
    constructor() {
        var config = {
            position: 'empty'
        }

        this.heatmap_board = Chessboard('board_heatmap', config)

        var heatmapConfigBlack = {
            container: document.querySelector('.heatmap'),
            radius: height/20,
            maxOpacity: 1,
            minOpacity: 0.5,
            blur: 0,
            gradient: {
                '0': 'black',
                '1': 'black'
            }
        };

        this.heatmapBlack = h337.create(heatmapConfigBlack);

        var heatmapConfigWhite = heatmapConfigBlack;

        heatmapConfigWhite['gradient'] = {
            '0': 'white',
            '1': 'white'
        }

        this.heatmapWhite = h337.create(heatmapConfigWhite);

        this.black_starts = [];
        this.white_starts = [];
        this.black_checks = [];
        this.white_checks = [];
        this.black_mates = [];
        this.white_mates = [];
        this.piece_positions = new Object();
        this.total_piece_pos = new Object();
    }
    fetchData() {
        fetch('./assets/jsons/moves.json')
            .then(response => response.json())
            .then(data3 => {
                var games = data3;

                this.total_piece_pos['white'] = new Object();
                this.total_piece_pos['black'] = new Object();

                for (const [game, moves] of Object.entries(games)) {
                    this.piece_positions[game] = new Object();
                    this.piece_positions[game]['white'] = new Object();
                    this.piece_positions[game]['black'] = new Object();
                    if (moves[0]['color'] == 'white') {
                        this.white_starts.push(posTranslator(moves[0]['to']));
                    } else {
                        this.black_starts.push(posTranslator(moves[0]['to']));
                    }
                    if (moves[1]['color'] == 'white') {
                        this.white_starts.push(posTranslator(moves[1]['to']));
                    } else {
                        this.black_starts.push(posTranslator(moves[1]['to']));
                    }
                    if (moves[moves.length - 1]['checked']) {
                        if (moves[moves.length - 1]['color'] == 'white') {
                            this.black_mates.push(posTranslator(moves[moves.length - 1]['enemy_k']));
                        } else {
                            this.white_mates.push(posTranslator(moves[moves.length - 1]['enemy_k']));
                        }
                    }

                    for (let i = 0; i < moves.length; i++) {
                        var piece = moves[i]['piece'];
                        var color = moves[i]['color'];

                        if (moves[i]['checked']) {
                            if (color == 'white') {
                                this.black_checks.push(posTranslator(moves[i]['enemy_k']));
                            } else {
                                this.white_checks.push(posTranslator(moves[i]['enemy_k']));
                            }
                        }

                        if (this.piece_positions[game][color][piece] == null) {
                            this.piece_positions[game][color][piece] = [];
                        }
                        if (this.total_piece_pos[color][piece] == null) {
                            this.total_piece_pos[color][piece] = [];
                        }

                        this.piece_positions[game][color][piece].push(posTranslator(moves[i]['to']));
                        this.total_piece_pos[color][piece].push(posTranslator(moves[i]['to']));
                    }
                }

                // this.plotHeatmap(this.piece_positions['Vachier-Lagrave_Maxime_Caruana_Fabiano_01']['black']['rook'], this.heatmapBlack);
                // this.plotHeatmap(this.piece_positions['Vachier-Lagrave_Maxime_Caruana_Fabiano_01']['white']['rook'], this.heatmapWhite);
                // this.plotHeatmap(this.total_piece_pos['black']['pawn'], this.heatmapBlack);
                // this.plotHeatmap(this.total_piece_pos['white']['knight'], this.heatmapWhite);

            });
    }
    plotHeatmap(working_data, working_heatmap) {

        var max = 0;

        // for (point in this.black_starts) {
        //     max = Math.max(max, point.val);
        // }
        var tmp = new Object();

        for (let i = 0; i < working_data.length; i++) {
            var tmp_val = tmp[working_data[i]['x'].toString() + '#' + working_data[i]['y'].toString()] ?? 0;
            tmp[working_data[i]['x'].toString() + '#' + working_data[i]['y'].toString()] = tmp_val + 1;

            max = Math.max(max, tmp_val+1)
            // console.log(max)
        }
        var data = {
            max: max,
            data: working_data
        };

        // console.log(working_data.length);
        working_heatmap.setData(data);
    }
}

heatShow = new HeatmapShower(); 

heatShow.fetchData();

function showOpenings() {
    heatShow.plotHeatmap(heatShow.black_starts, heatShow.heatmapBlack);
    heatShow.plotHeatmap(heatShow.white_starts, heatShow.heatmapWhite);
}
function showChecks() {
    heatShow.plotHeatmap(heatShow.black_checks, heatShow.heatmapBlack);
    heatShow.plotHeatmap(heatShow.white_checks, heatShow.heatmapWhite);
}
function showMates() {
    heatShow.plotHeatmap(heatShow.black_mates, heatShow.heatmapBlack);
    heatShow.plotHeatmap(heatShow.white_mates, heatShow.heatmapWhite);
}
function showPiece(piece) {
    if (currentGame == null) {
        heatShow.plotHeatmap(heatShow.total_piece_pos['black'][piece], heatShow.heatmapBlack);
        heatShow.plotHeatmap(heatShow.total_piece_pos['white'][piece], heatShow.heatmapWhite);
    } else {
        heatShow.plotHeatmap(heatShow.piece_positions[currentGame]['black'][piece], heatShow.heatmapBlack);
        heatShow.plotHeatmap(heatShow.piece_positions[currentGame]['white'][piece], heatShow.heatmapWhite);
    }
}

// heatShow.plotHeatmap();

// showerToggler()