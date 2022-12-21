// Player overview goes here

players=[];
links=[];

function addLink(white,black,winner) {
    link={white:white,black:black,winner:winner}
    links.push(link);
}

function addPlayer(id,name,elo,country) {
    player={id:id,name:name,elo:elo,country:country}
    players.push(player);
}

addPlayer(0,"Magnus Carlsen",2842,"Norway");
addPlayer(1,"Fabiano Caruana",2822,"USA");
addPlayer(2,"Maxime Vachier-Lagrave",2797,"France");
addPlayer(3,"Levon Aronian",2797,"Armenia");
addPlayer(4,"Wesley So",2780,"USA");
addPlayer(5,"Anish Giri",2776,"Netherlands");
addPlayer(6,"Vladimir Kramnik",2771,"Russia");
addPlayer(7,"Hikaru Nakamura",2767,"USA");

addLink(0,3,0);
addLink(1,4,1);
addLink(2,5,5);
addLink(6,7,7);
addLink(0,7,0);
addLink(3,5,3);
addLink(1,6,6);
addLink(2,4,2);
addLink(0,3,3);

//TODO:
// 1. add color coordination for white/black / gradient on arc
// 2. show elo and country, maybe in a generator with picture
// 3. make it easier to hover links
// 4. add a legend maybe
// 5. make a data generator for the link/player data
// 6. allow multiple games between two players
// 7. make hitbox bigger of lines
// 8. 
class PlayerOverview{
    constructor(players,links){
        this.players=players;
        this.links=links;
        this.margin = {top: 20, right: 60, bottom: 30, left: 60};
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.ceil=this.height-30;
        this.drawChart();
    }
    drawChart(){
        //used so the curves of arc are down and labels up, change also commented line in arcs
        //let ceil=this.height-30;
        let ceil=50

        var svg = d3.select("#playerOverview").append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        var allPlayers=this.players.map(function(d){return d.id});

        var x = d3.scalePoint().range([0, this.width]).domain(allPlayers);
        this.x_range=x
        var nodes=svg.selectAll("mynodes").data(this.players).enter().append("circle")
        .attr("cx", function(d){return x(d.id)})
        .attr("cy", ceil)
        .attr("r", 8)
        .style("fill", "#69b3a2")

        svg.selectAll("mylabels").data(this.players).enter().append("text")
        .attr("x", function(d){return x(d.id)})
        .attr("y", ceil-10)
        .text(function(d){return d.name})
        .attr("text-anchor", "middle")
        
        let start,end;
        var links=svg
        .selectAll('mylinks')
        .data(this.links)
        .enter()
        .append('path')
        .attr('d', function (d) {
          start = x(d.white)    // X position of start node on the X axis
          end = x(d.black)      // X position of end node
          return ['M', start, ceil ,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
            'A',                            // This means we're gonna build an elliptical arc
            (start - end)/2-25, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
            (start - end)/2-25, 0, 0, ',',
        //    start < end ? 1 : 0, end, ',', ceil] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            start < end ? 0 : 1, end, ',', ceil] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
        })
        .style("fill", "none")
        .attr("stroke", "black")
        .style("stroke-width", 2)

        nodes.on("mouseover", function(d) {
            nodes.style("fill", "#B8B8B8")
            d3.select(this).style("fill", "#69b3a2")
            links.style('stroke', function (link_d) { return link_d.white === d.id || link_d.black === d.id ? '#69b3b2' : '#b8b8b8';})
            .style('stroke-width', function (link_d) { return link_d.white === d.id || link_d.black === d.id ? 4 : 1;})
        })    
        .on('mouseout', function (d) {
            nodes.style('fill', "#69b3a2")
            links
              .style('stroke', 'black')
              .style('stroke-width', '2')
          })
        
          let tempText;
          links.on("mouseover", function(d) {
            links
            .style('stroke', 'black')
            .style('stroke-width', '2')
            d3.select(this).style('stroke', '#69b3b2')
            .style('stroke-width', 4)
            tempText=svg.append("text").style("font-size","20px")
              .attr("x",x(d.winner)-11)
              .attr("y",20).text("👑")    
          })
          .on("mouseout", function(d) {
              links
                .style('stroke', 'black')
                .style('stroke-width', '2')
              tempText.remove()
              tempText=null;
          })
    }
}
var playerOverview=new PlayerOverview(players,links);
