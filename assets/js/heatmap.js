var config = {
    position: 'empty'
}

var board1 = Chessboard('board_heatmap', config)

var heatmapConfig = {
    container: document.querySelector('.heatmap'),
    radius: 20,
    maxOpacity: 1,
    minOpacity: 0,
    blur: 0,
    gradient: {
        // enter n keys between 0 and 1 here
        // for gradient color customization
        '0': 'black',
        '1': 'black'
    }
};

// minimal heatmap instance configuration
var heatmapInstance = h337.create(heatmapConfig);

// now generate some random data
var points = [];
var max = 0;
var width = 400;
var height = 400;
var len = 50;

while (len--) {
    var val = Math.floor(Math.random() * 100);
    max = Math.max(max, val);
    var point = {
        x: Math.floor(Math.random() * 8) * Math.floor((width-2) / 8)  + Math.floor(width / 16) + 1 ,
        y: Math.floor(Math.random() * 8) * Math.floor((height-2) / 8)  + Math.floor(height / 16) + 2,
        value: val
    };
    points.push(point);
}
// heatmap data format
var data = {
    max: max,
    data: points
};
// if you have a set of datapoints always use setData instead of addData
// for data initialization
heatmapInstance.setData(data);

