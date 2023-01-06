class EvalPlot{
    constructor(data){
        this.first=true;
        this.data=data;
        this.margin = {top: 40, right: 90, bottom: 90, left: 90};
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;
        this.ceil=this.height-30;

        this.svg=d3.select(".eval_plot")
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.changeTo("asd")
        //this.drawChart(data["Vachier-Lagrave_Maxime_Caruana_Fabiano_01"]);
    }

    changeTo(gamename){
        if (gamename in this.data){
            this.svg.selectAll("*").remove();
            this.drawChart(this.data[gamename]);
        } else {
            this.svg.selectAll("*").remove();
        }
    }

    adjustedEval(d,min,max){
        if(d.type==="mate"){
            if (d.value>0){
                return max+d.value
            }
            else{
                return min+d.value
            }
        }
    }

    prepareData(data){
    let newData={}
    let max=Math.max(...data.map(d=>d.value))
    let min=Math.min(...data.map(d=>d.value))
    let values=data.map((d)=>{if(d.type==="cp"){ return d.value;}else{return this.adjustedEval(d,min,max)}})
    newData["values"]=values
    let tooltip=data.map((d)=>{if(d.type==="cp"){ return d.value;}else{return '#'+Math.abs(d.value)}})
    newData["tooltip"]=tooltip
    return newData
    }

    //TODO:
    //1. plot chart -done
    //2. add y calculation from cp so it smooths better, sigmoid 
    //3. add 2nd area for the other color, inverse of first area -done
    //4. add tooltip -done
    // https://d3-graph-gallery.com/area.html
    drawChart(data){

    var preparedData=this.prepareData(data);
    let height=this.height;
    let svg=this.svg;
    
    //x 
    var x = d3.scaleLinear()
        .domain([0, preparedData.values.length])
        .range([0, this.width]);

    //x axis ticks
     
    this.svg.append("g")
        .attr("transform", "translate(0," + (this.height) + ")")
        .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0).tickFormat(function(d) { return d/2 +1; }));

    
    //change here for 2 link: https://www.d3indepth.com/scales/#scales-with-continuous-input-and-continuous-output
    var maxValue=Math.max(Math.max(...preparedData.values),Math.abs(Math.min(...preparedData.values)))
    var y = d3.scaleSqrt()
        .domain([-maxValue, 0,maxValue])
        .range([this.height,this.height/2, 0])
        .nice();
    
    //y axis ticks do we even want this?
    //this.svg.append("g")
    //    .attr("transform", "translate(0," + "0" + ")")
    //    .call(d3.axisLeft(y).ticks(1).tickSizeOuter(0));

    //line through 0 point
    this.svg.append("line")
        .attr("x1", 0)
        .attr("y1", this.height/2)
        .attr("x2", this.width)
        .attr("y2", this.height/2)
        .attr("stroke-width", 0.5)
        .attr("stroke", "black")
        .append("svg:title")
        .text("Equal position");

    //first area
    this.svg.append("path")
        .datum(preparedData.values)
        .attr("fill", "gray")
        .attr("fill-opacity", .3)
        .attr("stroke", "#none")
        .attr("d", d3.area()
            .x(function(d, i) { return x(i) })
            .y0(this.height)
            .y1(function(d) { return y(d) }));

    //second area

    this.svg.append("path")
        .datum(preparedData.values)
        .attr("fill", "white")
        .attr("fill-opacity", .3)
        .attr("stroke", "#none")
        .attr("d", d3.area()
            .x(function(d, i) { return x(i) })
            .y0(0)
            .y1(function(d) { return y(d) }));
    //line
    let equalline=this.svg.append("path")
        .datum(preparedData.values)
        .attr("fill", "none")
        .attr("stroke", "#7777cc")
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 0.5)
        .attr("d", d3.line()
            .x(function(d, i) { return x(i) })
            .y(function(d) { return y(d) })
            )

    //nodes
    let nodes= this.svg.selectAll("myCircles")
        .data(preparedData.values)
        .enter()
        .append("circle")
        .attr("fill", function(d,i) { return i%2===0 ? "#Ebf3f9" : "grey" })
        .attr("cx", function(d, i) { return x(i) })
        .attr("cy", function(d) { return y(d) })
        .attr("r", 4)
        .attr("fill-opacity", 0.9)

    //tooltip
    nodes.append("svg:title")
        .text(function(d,i) { return preparedData.tooltip[i] });
    
    //mark hovered node
    nodes.on("mouseover", function(d,i){
        d3.select(this).attr("fill", "red").attr("fill-opacity", 0.5)
        d3.select(this).attr("r", 5)
        d3.select(this).append("svg:title")
            .text(function(d,i) { return preparedData.tooltip[i] });
    })
    nodes.on("mouseout", function(d,i){
        d3.select(this).attr("fill",function(d) { return i%2===0 ? "#Ebf3f9" : "grey" })
        d3.select(this).attr("r", 4).attr("fill-opacity", 1)
        d3.select(this).append("svg:title")
        .attr("fill", )

    })

    //TODO: update chessboard to selected move, please do it in this function if possible
    //movenbumber starts at 0
    var setBoard=function(data,movenumber){
        var black=movenumber%2===1
        let actualmove=Math.floor(movenumber/2)+1
        var y = document.getElementById("situation_board");
        if (y.style.display === "none") {
            showerToggler();
        }
        var move_code = actualmove.toString();
        if (black) {
            move_code = move_code + 'b';
        } else {
            move_code = move_code + 'w';
        }

        posShow.setPos(currentGame, move_code)
    }

    //update chessboard to selected move
    nodes.on("click", function(d,i){
        setBoard(data,i)
    })
    }
}

var evalPlot;

function loadEval(game){
    evalPlot.changeTo(game)
}


fetch('./assets/jsons/evals.json')
    .then(response => response.json())
    .then(data => {
        evalPlot=new EvalPlot(data)});
    
