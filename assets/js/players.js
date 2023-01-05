// Player overview goes here
players = [];
links = [];
dummyData = false;
function addLink(white, black, winner) {
    link = { white: white, black: black, winner: winner }
    links.push(link);
}

function addPlayer(id, name, elo, country) {
    player = { id: id, name: name, elo: elo, country: country }
    players.push(player);
}
if (dummyData) {
    addPlayer(0, "Magnus Carlsen", 2842, "Norway");
    addPlayer(1, "Fabiano Caruana", 2822, "USA");
    addPlayer(2, "Maxime Vachier-Lagrave", 2797, "France");
    addPlayer(3, "Levon Aronian", 2797, "Armenia");
    addPlayer(4, "Wesley So", 2780, "USA");
    addPlayer(5, "Anish Giri", 2776, "Netherlands");
    addPlayer(6, "Vladimir Kramnik", 2771, "Russia");
    addPlayer(7, "Hikaru Nakamura", 2767, "USA");

    addLink(0, 3, 0);
    addLink(1, 4, 1);
    addLink(2, 5, 5);
    addLink(6, 7, 7);
    addLink(0, 7, 0);
    addLink(3, 5, -1);
    addLink(1, 6, 6);
    addLink(2, 4, 2);
    addLink(0, 3, 3);
}
//TODO:
// 1. add color coordination for white/black (just make nodes corresponding color and border gold for the winner)
// 2. show elo and country, maybe in a generator with picture (make dict with player names and pictures and info that gets used)
// 3. make it easier to hover links
// 4. make nodes in circle
//    
class PlayerOverview {
    constructor(data) {
        this.data = data;

        if (dummyData) {
            this.players = players;
            this.links = links;
        } else {
            this.players = Object.values(data.players);
            this.links = Object.values(data.games);
        }
        this.margin = { top: 40, right: 90, bottom: 90, left: 90 };
        this.width = 1080 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;
        this.ceil = this.height - 30;
        this.drawChart(true);
    }

    drawChart(split = false) {
        //used so the curves of arc are down and labels up, change also commented line in arcs
        //let ceil=this.height-30;
        let ceil = 50
        let heightDict = {}
        var svg = d3.select("#playerOverview").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        var allPlayers = this.players.map(function (d) { return d.id });

        var x = d3.scalePoint().range([0, this.width]).domain(allPlayers);
        this.x_range = x
        var nodes = svg.selectAll("mynodes").data(this.players).enter().append("circle")
            .attr("cx", function (d) { return x(d.id) })
            .attr("cy", function (d) { heightDict[d.id] = ceil - 60 + 55 * Math.abs(4.5 - d.id); return heightDict[d.id] })
            .attr("r", 8)
            .style("fill", "#b8b8b8")

        svg.selectAll("mylabels").data(this.players).enter().append("text")
            .attr("x", function (d) { return x(d.id) })
            .attr("y", function (d) { return heightDict[d.id] - 10 })
            .text(function (d) { return d.name })
            .attr("text-anchor", "middle")

        //onclick functionality of links TODO: 
        var selectGame = function (d) {
            console.log(d);
            console.log(d.winner)
            console.log(heightDict[d.winner])
            console.log(x(d.winner))
        }

        let start, end;
        var links = svg
            .selectAll('mylinks')
            .data(this.links)
            .enter()
            .append('path')
            .attr('d', function (d) {
                start = x(d.white)    // X position of start node on the X axis
                end = x(d.black)      // X position of end node
                return ['M', start, heightDict[d.white],    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
                    'A',                            // A means we're gonna build an elliptical arc
                    (start - end) / 2 + 20, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                    (start - end) / 2 + 20, 0, 0, ',',
                    //    start < end ? 1 : 0, end, ',', ceil] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
                    start < end ? 0 : 1, end, ',', heightDict[d.black]] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
                    .join(' ');
            })
            .style("fill", "none")
            .attr("opacity", function (d) { return d.winner < 0 ? 0.1 : 1 })
            .attr("stroke", "black")
            .style("stroke-width", 2)

        nodes.on("mouseover", function (d) {
            nodes.style("fill", "#b8b8b8")
            d3.select(this).style("fill", "black")
            d3.select(this).style("border", "2px solid gold")
            links.style('stroke', function (link_d) { return link_d.winner === d.id ? '#fcd30a' : '#8a8a8a'; })
                .style('stroke-width', function (link_d) { return link_d.white === d.id || link_d.black === d.id ? 4 : 2; })
                .style('opacity', function (link_d) { return link_d.white === d.id || link_d.black === d.id ? 1 : 0.1; })
        })
            .on('mouseout', function (d) {
                nodes.style('fill', "grey")
                links
                    .style('stroke', 'black')
                    .style('stroke-width', '2')
                    .style('opacity', function (link_d) { return link_d.winner < 0 ? 0.1 : 1; })
            })

        let tempText;
        links.on("mouseover", function (d) {
            links.style('stroke', 'black')
                .style('stroke-width', '2')
                .style('opacity', 0.1)

                d3.select(this)
                .style('stroke', function(link_d){return link_d.winner === d.white ? 'white' : link_d.winner === d.black ? 'black' : "grey";})
                .style('stroke-width', 4)
                .style('opacity', 1)
            nodes.style("fill", function (node_d) {
                if (node_d.id === d.white) {
                    return "white"
                } else if (node_d.id===d.black){
                    return "black"

                } else {return "#b8b8b8";} })
        })
            .on("mouseout", function (d) {
                links
                    .style('stroke', 'black')
                    .style('stroke-width', '2')
                    .style('opacity', function (link_d) { return link_d.winner < 0 ? 0.1 : 1; })
                nodes.style("fill", "#b8b8b8")

                if (d.winner > 0) {
                    tempText.remove()
                    tempText = null;
                }
            })
            .on("click", function (d) {
                selectGame(d);
            });
    }
}

if (!dummyData) {
    fetch('./assets/jsons/tournament.json')
        .then(response => response.json())
        .then(data => {
            new PlayerOverview(data)
        });
}
else {
    data = { "players": players, "links": links }
    new PlayerOverview(data);
}