// Player overview goes here
players=[];
links=[];
dummyData=false;
function addLink(white,black,winner) {
    link={white:white,black:black,winner:winner}
    links.push(link);
}

function addPlayer(id,name,elo,country) {
    player={id:id,name:name,elo:elo,country:country}
    players.push(player);
}
if(dummyData){
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
addLink(3,5,-1);
addLink(1,6,6);
addLink(2,4,2);
addLink(0,3,3);
}
//TODO:
// 1. add color coordination for white/black (just make nodes corresponding color and border gold for the winner)
// 2. show elo and country, maybe in a generator with picture (make dict with player names and pictures and info that gets used)
// 3. make it easier to hover links
// 4. make nodes in circle
//    
class PlayerOverview{
    constructor(data){
        this.data=data;

        if (dummyData){
        this.players=players;
        this.links=links;
        } else {
        this.players=Object.values(data.players);
        this.links=Object.values(data.games);
        }
        this.margin = {top: 40, right: 90, bottom: 90, left: 90};
        this.width = 1080 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;
        this.ceil=this.height-30;
        this.drawChart();
        this.drawChart(true);
        this.drawChartCircle();
        this.drawChartCircleSplit();
    }

    linksSorting(a,b){
    if (a.winner<b.winner){
        return 1;}
    return -1;
    }

    drawChart(split=false){
        //used so the curves of arc are down and labels up, change also commented line in arcs
        //let ceil=this.height-30;
        let ceil=50
        let heightDict={}
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
        .attr("cy", function(d){heightDict[d.id]=ceil-60+55*Math.abs(4.5-d.id); return heightDict[d.id]})
        .attr("r", 8)
        .style("fill", "#69b3a2")

        svg.selectAll("mylabels").data(this.players).enter().append("text")
        .attr("x", function(d){return x(d.id)})
        .attr("y", function(d){return heightDict[d.id]-10})
        .text(function(d){return d.name})
        .attr("text-anchor", "middle")
        

        if(split){

        let start,end;
        var links=svg
        .selectAll('mylinks')
        .data(this.links)
        .enter()
        .append('path')
        .attr('d', function (d) {
          start = x(d.white)    // X position of start node on the X axis
          end = x(d.black)      // X position of end node
          return ['M', start, heightDict[d.white] ,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
            'A',                            // A means we're gonna build an elliptical arc
            (start - end)/2+20, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
            (start - end)/2+20,0, 0, ',',
        //    start < end ? 1 : 0, end, ',', ceil] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            start < end ? 0 : 1, end, ',', heightDict[d.black]] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
        })
        .style("fill", "none")
        .attr("opacity", function(d){return d.winner<0?0:1})
        .attr("stroke","black")
        .style("stroke-width", 2)
            
        } else {

        let start,end;
        var links=svg
        .selectAll('mylinks')
        .data(this.links)
        .enter()
        .append('path')
        .attr('d', function (d) {
          start = x(d.white)    // X position of start node on the X axis
          end = x(d.black)      // X position of end node
          return ['M', start, heightDict[d.white] ,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
            'A',                            // A means we're gonna build an elliptical arc
            (start - end)/2+20, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
            (start - end)/2+20,0, 0, ',',
        //    start < end ? 1 : 0, end, ',', ceil] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            start < end ? 0 : 1, end, ',', heightDict[d.black]] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
            .join(' ');
        })
        .style("fill", "none")
        .attr("stroke", "black")
        .style("stroke-width", 2)
        }
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
            if(d.winner>0){
                tempText=svg.append("text").style("font-size","20px")
                .attr("x",heightDict[d.winner]-11)
                .attr("y",20).text("👑")    
            }
          })
          .on("mouseout", function(d) {
              links
                .style('stroke', 'black')
                .style('stroke-width', '2')
                if (d.winner>0){
                    tempText.remove()
                    tempText=null;
                }   
          })
    }


    // https://gist.github.com/krosenberg/989204175f68f40dfe3b
    drawChartCircle(){
        var allPlayers=this.players.map(function(d){return d.id});
        var posDict={}
        
        var svg = d3.select("#playerOverview").append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)

        var dim=this.height;
        
        var circle=svg.append("path")
        .attr("d", "M "+this.margin.left+", "+(dim/2+this.margin.top)+" a "+dim/2+","+dim/2+" 0 1,0 "+dim+",0 a "+dim/2+","+dim/2+" 0 1,0 "+dim*-1+",0")
        .style("fill", "#f5f5f5")
        .style("fill", "#f5f5f5").attr("opacity",0);;

        //add all players to the circle and add the position to the posDict in [id]=position format
        allPlayers.forEach(function(d,i){
        var circumference= circle.node().getTotalLength();
        var pointAtLength = function(l){return circle.node().getPointAtLength(l)};
        var sectionLength = (circumference)/allPlayers.length;
        var position = sectionLength*i+sectionLength/2;
        var point = pointAtLength(circumference-position);
        posDict[d]=[point.x,point.y]
        })
        console.log(posDict)

        //nodes / dots / players
        var nodes=svg.selectAll("mynodes").data(this.players).enter().append("circle")
        .attr("cx", function(d){return posDict[d.id][0]})
        .attr("cy", function(d){return posDict[d.id][1]})
        .attr("r", 8)
        .style("fill", "#ee899a")

        //labels
        svg.selectAll("mylabels").data(this.players).enter().append("text")
        .attr("x", function(d){if (posDict[d.id][0]>dim/2) return posDict[d.id][0]+15; else return posDict[d.id][0]-15;})
        .attr("y", function(d){if (posDict[d.id][1]>dim/2) return posDict[d.id][1]+25; else return posDict[d.id][1]-15;})
        .text(function(d){return d.name})
        .attr("text-anchor", "middle")

        //links
        let start,end;
        console.log(this.links)
        var lines = svg.selectAll("mylinks")
        .data(this.links).enter().append("path")
        .attr("class", "node-link")
        .attr("d", function(d) {
            var dx = posDict[d.black][0] - posDict[d.white][0],
            dy = posDict[d.black][0] - posDict[d.white][1],
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            posDict[d.white][0] + "," + 
            posDict[d.white][1] + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            posDict[d.black][0] + "," + 
            posDict[d.black][1];
        })
        .style("fill", "none")
        .attr("stroke", "black")
        .style("stroke-width", 2);
    }

    //split winner and drawn games, drawn straight lines, winner curved lines, drawn very slightly only colored
    drawChartCircleSplit(){
        var allPlayers=this.players.map(function(d){return d.id});

        var posDict={}
        
        var svg = d3.select("#playerOverview").append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)

        var dim=this.height;
        
        var circle=svg.append("path")
        .attr("d", "M "+this.margin.left+", "+(dim/2+this.margin.top)+" a "+dim/2+","+dim/2+" 0 1,0 "+dim+",0 a "+dim/2+","+dim/2+" 0 1,0 "+dim*-1+",0")
        .style("fill", "#f5f5f5").attr("opacity",0);

        //add all players to the circle and add the position to the posDict in [id]=position format
        allPlayers.forEach(function(d,i){
        var circumference= circle.node().getTotalLength();
        var pointAtLength = function(l){return circle.node().getPointAtLength(l)};
        var sectionLength = (circumference)/allPlayers.length;
        var position = sectionLength*i+sectionLength/2;
        var point = pointAtLength(circumference-position);
        posDict[d]=[point.x,point.y]
        })
        console.log(posDict)

        //nodes / dots / players
        var nodes=svg.selectAll("mynodes").data(this.players).enter().append("circle")
        .attr("cx", function(d){return posDict[d.id][0]})
        .attr("cy", function(d){return posDict[d.id][1]})
        .attr("r", 8)
        .style("fill", "#ee899a")

        //labels
        svg.selectAll("mylabels").data(this.players).enter().append("text")
        .attr("x", function(d){if (posDict[d.id][0]>dim/2) return posDict[d.id][0]+15; else return posDict[d.id][0]-15;})
        .attr("y", function(d){if (posDict[d.id][1]>dim/2) return posDict[d.id][1]+25; else return posDict[d.id][1]-15;})
        .text(function(d){return d.name})
        .attr("text-anchor", "middle")
        var sortedLinks=  this.links.sort(this.sortedLinks)
        //links
        let start,end;
        var lines = svg.selectAll("mylinks")
        .data(sortedLinks).enter().append("path")
        .attr("class", "node-link")
        .attr("d", function(d) {
            var dx = posDict[d.black][0] - posDict[d.white][0],
            dy = posDict[d.black][0] - posDict[d.white][1],
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            posDict[d.white][0] + "," + 
            posDict[d.white][1] + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            posDict[d.black][0] + "," + 
            posDict[d.black][1];
        })
        .style("fill", "none")
        .attr("stroke", "black")
        .attr("opacity", function(d){return d.winner<0?0:1})
        .style("stroke-width", 2);
    }

}
if(!dummyData){
fetch('./assets/jsons/tournament.json')
    .then(response => response.json())
    .then(data => {
        new PlayerOverview(data)});
    }
else{
    data={"players":players,"links":links}
    new PlayerOverview(data);
}