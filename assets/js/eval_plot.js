class EvalPlot{
    constructor(data){
        this.data=data;
        this.margin = {top: 40, right: 90, bottom: 90, left: 90};
        this.width = 1080 - this.margin.left - this.margin.right;
        this.height = 800 - this.margin.top - this.margin.bottom;
        this.ceil=this.height-30;

        //this.drawChart(data["Vachier-Lagrave_Maxime_Caruana_Fabiano_01"]);
        this.drawChart(data["Giri_Anish_Alekseenko_Kirill_14"]);
        
        this.svg=d3.select("#eval_plot")
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

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
    // 2. add tooltip to those values (# of moves to mate)
    // 3. add a legend

    prepareData(data){
    let newData={}
    console.log(data)
    let max=Math.max(...data.map(d=>d.value))
    let min=Math.min(...data.map(d=>d.value))
    let values=data.map((d)=>{if(d.type==="cp"){ return d.value;}else{return this.adjustedEval(d,min,max)}})
    console.log(min,max)
    console.log(values)
    for (let i=0;i<data.length;i++){}
    
    }

    //TODO:
    //1. plot chart
    //2. add tooltip
    //3. add legend
    drawChart(data){
    console.log(data[0]);
    var preparedData=this.prepareData(data);
    }



}

fetch('./assets/jsons/evals.json')
    .then(response => response.json())
    .then(data => {
        new EvalPlot(data)});
    
