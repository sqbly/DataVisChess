class EvalPlot{
    constructor(data){
        
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

        //this.drawChart(data["Vachier-Lagrave_Maxime_Caruana_Fabiano_01"]);
        this.drawChart(data["Giri_Anish_Alekseenko_Kirill_14"]);
        
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

    //TODO: 
    // 1. add max/min to mate values
    // 2. add tooltip version to those values (# of moves to mate)

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
    //1. plot chart
    //2. add y calculation from cp so it smooths better, sigmoid
    //3. add 2nd area for the other color, inverse of first area
    //4. add tooltip
    //5. add legend
    // https://d3-graph-gallery.com/area.html
    drawChart(data){
    var preparedData=this.prepareData(data);

    //x 
    var x = d3.scaleLinear()
        .domain([0, preparedData.values.length])
        .range([0, this.width]);

    //x axis ticks
    this.svg.append("g")
        .attr("transform", "translate(0," + (this.height) + ")")
        .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    //change here for 2 link: https://www.d3indepth.com/scales/#scales-with-continuous-input-and-continuous-output
    var y = d3.scaleSqrt()
        .domain([Math.min(...preparedData.values), Math.max(...preparedData.values)])
        .range([this.height, 0]);
    
    //y axis ticks
    this.svg.append("g")
        .attr("transform", "translate(0," + "0" + ")")
        .call(d3.axisLeft(y).ticks(10).tickSizeOuter(0));

    //first area
    this.svg.append("path")
        .datum(preparedData.values)
        .attr("fill", "gray")
        .attr("fill-opacity", .3)
        .attr("stroke", "#none")
        .attr("d", d3.area()
            .x(function(d, i) { return x(i) })
            .y0(this.height)
            .y1(function(d) { return y(d) })
            )
    //second area
    let height=this.height;
    this.svg.append("path")
        .datum(preparedData.values)
        .attr("fill", "white")
        .attr("fill-opacity", .3)
        .attr("stroke", "#none")
        .attr("d", d3.area()
            .x(function(d, i) { return x(i) })
            .y0(0)
            .y1(function(d) { return y(d) })
            )
    //line
    this.svg.append("path")
        .datum(preparedData.values)
        .attr("fill", "none")
        .attr("stroke", "#7777cc")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d, i) { return x(i) })
            .y(function(d) { return y(d) })
            )
    
    //nodes
    this.svg.selectAll("myCircles")
        .data(preparedData.values)
        .enter()
        .append("circle")
        .attr("fill", "grey")
        .attr("cx", function(d, i) { return x(i) })
        .attr("cy", function(d) { return y(d) })
        .attr("r", 3)
    }
}

fetch('./assets/jsons/evals.json')
    .then(response => response.json())
    .then(data => {
        new EvalPlot(data)});
    
