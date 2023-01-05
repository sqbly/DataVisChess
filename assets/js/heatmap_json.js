var width = 600;
var height = 600;

var currentGame = null;
var currentPiece = 'opening';


function posTranslator(pos) {
    var x = pos.charCodeAt(0) - 97;
    var y = pos.charCodeAt(1) - 49;
    y = 8 - y - 1;
    var point = {
        x: x * Math.floor((width - 2) / 8) + Math.floor(width / 16) + 1,
        y: y * Math.floor((height - 2) / 8) + Math.floor(height / 16) + 2,
        value: 1
    };
    return point;
}

function otherColor(color) {
    if (color == "black") {
        return "white";
    } else {
        return "black";
    }
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
                this.total_piece_pos['white']['opening'] = [];
                this.total_piece_pos['black']['opening'] = [];
                this.total_piece_pos['white']['capture'] = [];
                this.total_piece_pos['black']['capture'] = [];
                this.total_piece_pos['white']['check'] = [];
                this.total_piece_pos['black']['check'] = [];

                for (const [game, moves] of Object.entries(games)) {
                    this.piece_positions[game] = new Object();
                    this.piece_positions[game]['white'] = new Object();
                    this.piece_positions[game]['black'] = new Object();
                    this.piece_positions[game]['white']['opening'] = [];
                    this.piece_positions[game]['black']['opening'] = [];
                    this.piece_positions[game]['white']['capture'] = [];
                    this.piece_positions[game]['black']['capture'] = [];
                    this.piece_positions[game]['white']['check'] = [];
                    this.piece_positions[game]['black']['check'] = [];
                    
                    
                    this.piece_positions[game][moves[0]['color']]['opening'].push(posTranslator(moves[0]['to']));
                    this.total_piece_pos[moves[0]['color']]['opening'].push(posTranslator(moves[0]['to']));
                    this.piece_positions[game][moves[1]['color']]['opening'].push(posTranslator(moves[1]['to']));
                    this.total_piece_pos[moves[1]['color']]['opening'].push(posTranslator(moves[1]['to']));

                    // var last_move = moves[moves.length - 1];
                    // if (last_move['checked']) {
                    //     this.piece_positions[game][otherColor(last_move['color'])]['mate'].push(posTranslator(last_move['enemy_k']));
                    //     this.total_piece_pos[otherColor(last_move['color'])]['mate'].push(posTranslator(last_move['enemy_k']));
                    // }

                    for (let i = 0; i < moves.length; i++) {
                        var piece = moves[i]['piece'];
                        var color = moves[i]['color'];

                        if (moves[i]['checked']) {
                            this.piece_positions[game][otherColor(color)]['check'].push(posTranslator(moves[i]['enemy_k']));
                            this.total_piece_pos[otherColor(color)]['check'].push(posTranslator(moves[i]['enemy_k']));
                        }
                        if (moves[i]['taking']) {
                            this.piece_positions[game][otherColor(color)]['capture'].push(posTranslator(moves[i]['to']));
                            this.total_piece_pos[otherColor(color)]['capture'].push(posTranslator(moves[i]['to']));
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
    showPiece('opening');
}
function showChecks() {
    showPiece('check');
}
function showCaptures() {
    showPiece('capture');
}
function showPiece(piece) {
    currentPiece = piece;
    refreshHeatmap();
}


function capitalizeFirst(word) {
    var first_letter = word.charCodeAt(0);
    var new_letter = String.fromCharCode(first_letter - 32);
    return new_letter + word.substring(1, word.length);
}

function refreshHeatmap() {
    document.getElementById("heatmap_title").innerHTML = capitalizeFirst(currentPiece) + " Heatmap";
    
    if (currentGame == null) {
        heatShow.plotHeatmap(heatShow.total_piece_pos['black'][currentPiece], heatShow.heatmapBlack);
        heatShow.plotHeatmap(heatShow.total_piece_pos['white'][currentPiece], heatShow.heatmapWhite);
    } else {
        heatShow.plotHeatmap(heatShow.piece_positions[currentGame]['black'][currentPiece], heatShow.heatmapBlack);
        heatShow.plotHeatmap(heatShow.piece_positions[currentGame]['white'][currentPiece], heatShow.heatmapWhite);
    }
}

// heatShow.plotHeatmap();

showerToggler()