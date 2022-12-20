var config = {
    position: 'start'
}

var board1 = Chessboard('board1', config)


// minimal heatmap instance configuration
var heatmapInstance = h337.create({
    // only container is required, the rest will be defaults
    container: document.querySelector('.heatmap')
});

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

