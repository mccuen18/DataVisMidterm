//Author: Cam McCuen
var margin = {left: 150, right:100, top:50, bottom:100};
var outerWidth = 1200;
var outerHeight = 900;
var innerWidth = outerWidth -margin.left -margin.right;
var innerHeight = outerHeight -margin.top -margin.bottom;
var paddingPercentage = .05;

var currentYTitle = "";
var currentXTitle = "";
var xColumnName = "";
var yColumnName = "";
var selectedGroup = "All";
function getGlobalTitle(){
    return currentYTitle+" vs "+currentXTitle+", " + selectedGroup+" is Selected";
}

//"teamID" string
//"AB" int
//"H" int
//"GHome" int Games played at home
//"G" int games played
//"W" int wins
//"L" int losses
//"WSWin" string world series win Y or N

var teamData;

d3.csv("SchichDataS1_FB.csv",convert,dataReady);



//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)


var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xAxisG = g.append("g")
        .attr("transform", "translate(0," + innerHeight + ")");
var yAxisG = g.append("g");

var scaleX = d3.scale.linear();
var scaleY = d3.scale.linear();

scaleX.range([0,innerWidth]);
scaleY.range([innerHeight,0]);

var xAxis = d3.svg.axis().scale(scaleX).orient("bottom")
.tickFormat(d3.format("d"))
.ticks(16);
var yAxis = d3.svg.axis().scale(scaleY).orient("left");


//xAxisG.call(xAxis);
//yAxisG.call(yAxis);

xAxisG.append("text")
.style("text-anchor","middle")
.text(currentXTitle)
.attr("id", "xAxisTitle")
.attr("transform","translate("+(innerWidth/2)+","+(50)+")");

yAxisG.append("text")
        .style("text-anchor","middle")
        .text(currentYTitle)
        .attr("id", "yAxisTitle")
        .attr("transform","translate("+-100+","+(innerHeight/2)+")rotate(-90)");


var circles;

var barWidth = 50;
var barHeight = 50;
var teamRects = g.append("g")
        .attr("transform", "translate("+(innerWidth+50)+","+(-50)+")");

function dataReady(data){
    
    teamData = data;
    console.log(data.length);
    console.log(data);
    /*
    //setup team rectangles
    var teamRect = teamRects.selectAll("g")
        .data(d3.map(data,function(d){return d.teamID;}).keys())
        .enter().append("g")
        .attr("transform",function(d,i){return "translate(0,"+i*barHeight/2+")"})
        .attr("class",function(d){return d})
        .on('mouseover', mouseEnterFunc)
        .on('mouseout', mouseExitFunc);
    
    teamRect.append("rect")
        .attr("width", barWidth)
        .attr("height", 20)
        .attr("fill","lightblue");
    teamRect.append("title")
        .text(function(d){return d});
    teamRect.append("text")
        .text(function(d){return d})
        .attr("transform","translate(10,15)");
    
    */
    

    
    
    
    renderDeathShareVTime();
}



function renderLatLong(){
    var data = teamData;
    //create circles for datapoints
    circles = g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle");
    
    //add stlye
    circles.attr("r", 2)
    .attr("fill", function(d){
    if(d.WSWin == "Y"){
        return "red";
    }else{
        return "blue";
    }})    
    .attr("class", function(d){return d.teamID})
    .attr("stroke", "black");
    
    //add title so hovering shows teamID
    circles.append("svg:title")
        .style("text-anchor", "middle")
        .text(function(d){return d.teamID});
    
    //add mouseOver functionality
    circles.on('mouseover', mouseEnterFunc)
        .on('mouseout', mouseExitFunc);
    
    
    xColumnName = "BLocLong";
    yColumnName = "BLocLat";
    
    currentXTitle = "Longitude";
    currentYTitle = "Latitude";
    
    transitionGlobalTitle(2000);
    transitionXAxisTitle(2000);
    transitionYAxisTitle(2000);
    
    setupXYAxes(data);
    
    circles.attr("cx", function(d) {return scaleX(d[xColumnName])});
    circles.transition().duration(2000).attr("cy", function(d) {return scaleY(d[yColumnName])});
}
function renderDeathShareVTime(){
    var data = teamData;
    xColumnName = "BLocLong";
    yColumnName = "attendance";
    
    currentXTitle = "Century";
    currentYTitle = "Death Share";
    /*
    data = data.filter(function(d){return (d.DYear >= 0)&&(d.DLocLabel == "Florence" ||
                                                          d.DLocLabel == "Rome" ||
                                                          d.DLocLabel == "Paris" ||
                                                          d.DLocLabel == "Los Angeles" ||
                                                          d.DLocLabel == "New York City" ||
                                                          d.DLocLabel == "London" ||
                                                          d.DLocLabel == "Moscow" ||
                                                          d.DLocLabel == "Berlin" ||
                                                          d.DLocLabel == "Munich" ||
                                                          d.DLocLabel == "Vienna" ||
                                                          d.DLocLabel == "Amsterdam" ||
                                                          d.DLocLabel == "Nuremberg"
                                                         );}
                      );
    */
    /*
        data = data.filter(function(d){return (d.DLocLabel == "Florence" ||
                                                          d.DLocLabel == "Rome" ||
                                                          d.DLocLabel == "Paris" ||
                                                          d.DLocLabel == "Los Angeles" ||
                                                          d.DLocLabel == "New York City" ||
                                                          d.DLocLabel == "London" ||
                                                          d.DLocLabel == "Moscow" ||
                                                          d.DLocLabel == "Berlin" ||
                                                          d.DLocLabel == "Munich" ||
                                                          d.DLocLabel == "Vienna" ||
                                                          d.DLocLabel == "Amsterdam" ||
                                                          d.DLocLabel == "Nuremberg"
                                                         );}
                      );
    
    */
    var totalDeaths = d3.nest()
    .key(function(d){return d.DLocLabel;})
    .rollup(function(v){ return {
        count: v.length,
       13: d3.sum(v, function(d){return (d.DYear >= 0 && d.DYear <= 1300)}),
        14: d3.sum(v, function(d){return (d.DYear > 1300 && d.DYear <= 1400)}),
        15: d3.sum(v, function(d){return (d.DYear > 1400 && d.DYear <= 1500)}),
        16: d3.sum(v, function(d){return (d.DYear > 1500 && d.DYear <= 1600)}),
        17: d3.sum(v, function(d){return (d.DYear > 1600 && d.DYear <= 1700)}),
        18: d3.sum(v, function(d){return (d.DYear > 1700 && d.DYear <= 1800)}),
        19: d3.sum(v, function(d){return (d.DYear > 1800 && d.DYear <= 1900)}),
        20: d3.sum(v, function(d){return (d.DYear > 1900 && d.DYear <= 2000)}),
        21: d3.sum(v, function(d){return (d.DYear > 2000 && d.DYear <= 2012)})
        
    }; })
    .entries(data);
    
    console.log(totalDeaths);
    
    
    var LocationToDeaths = {
        "Florence": 0,
        "Rome": 0,
        "Paris": 0,
        "Los Angeles": 0,
        "New York City": 0,
        "London": 0,
        "Moscow": 0,
        "Berlin": 0,
        "Munich": 0,
        "Vienna": 0,
        "Amsterdam": 0,
        "Nuremberg": 0
    };
    var LocationToDeaths = {
        "Florence": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "Rome": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "Paris": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "Los Angeles": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "New York City": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "London": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "Moscow": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "Berlin": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "Munich": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "Vienna": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "Amsterdam": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0},
        "Nuremberg": {"13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21":0}
    };
    console.log(LocationToDeaths);
    
    
    
    transitionGlobalTitle(2000);
    transitionYAxisTitle(2000);
    
    //setupXYAxes(data);
    
    circles.transition().duration(2000).attr("cy", function(d) {return scaleY(d[yColumnName])});
}

function renderER(){
    var data = teamData;
    yColumnName = "ER";
    currentYTitle = "Earned Runs";
    
    transitionGlobalTitle(2000);
    transitionYAxisTitle(2000);
    
    var yExtent = d3.extent(data, function(d){return d[yColumnName]});
    var yRange = yExtent[1]-yExtent[0];
    scaleY.domain([yExtent[0] - (yRange * paddingPercentage), yExtent[1] + (yRange * paddingPercentage)]);
    yAxisG.call(yAxis);
    
    circles.transition().duration(2000).attr("cy", function(d) {return scaleY(d[yColumnName])});
}

function transitionYAxisTitle(totalDuration){
        d3.select("#yAxisTitle")
        .transition()
        .duration(totalDuration/2)
        .style("font-size","1px")
        .transition()
        .duration(totalDuration/2)
        .text(currentYTitle)
        .style("font-size","18px");
}
function transitionXAxisTitle(totalDuration){
        d3.select("#xAxisTitle")
        .transition()
        .duration(totalDuration/2)
        .style("font-size","1px")
        .transition()
        .duration(totalDuration/2)
        .text(currentXTitle)
        .style("font-size","18px");
}
function transitionGlobalTitle(totalDuration){
        d3.select("#debug")
        .transition()
        .duration(totalDuration/2)
        .style("font-size","1px")
        .transition()
        .duration(totalDuration/2)
        .text(getGlobalTitle)
        .style("font-size","18px");
}
function setupXYAxes(data){
    //setup x axis
    var xExtent = d3.extent(data,function(d){return d[xColumnName]});
    var xRange = xExtent[1]-xExtent[0];
    scaleX.domain([xExtent[0] - (xRange * paddingPercentage), xExtent[1] + (xRange * paddingPercentage)]);
    xAxisG.call(xAxis);
    
    //setup y axis
    var yExtent = d3.extent(data, function(d){return d[yColumnName]});
    var yRange = yExtent[1]-yExtent[0];
    scaleY.domain([yExtent[0] - (yRange * paddingPercentage), yExtent[1] + (yRange * paddingPercentage)]);
    yAxisG.call(yAxis);
}



function mouseEnterFunc(){
    var team = d3.select(this).attr("class");
    
    d3.selectAll("circle").filter("."+team)
        .attr("r",10);

    d3.selectAll("circle").transition()
        .style("opacity", function(){
        if(d3.select(this).attr("class") == team){
            return 1;
        }else{
            return .3;
        }
    })
    selectedGroup = d3.select(this).attr("class");
    debugOut(getGlobalTitle);
}
function mouseExitFunc(){
    var team = d3.select(this).attr("class");
    d3.selectAll("."+team).attr("r", 5);
    d3.selectAll("circle").transition().style("opacity", 1);
    selectedGroup = "All";
    debugOut(getGlobalTitle);
}


function convert(d){
    d.BLocLong = +d.BLocLong;
    d.BLocLat = +d.BLocLat;
    d.BYear = +d.BYear;
    d.DYear = +d.DYear;
    d.PerformingArts= +d.PerformingArts;
    d.Creative= +d.Creative;
    d.GovLawMilActRel = +d.GovLawMilActRel;
    d.AcademicEduHealth = +d.AcademicEduHealth;
    d.Sports = +d.Sports;
    d.BusinessIndustryTravel= +d.BusinessIndustryTravel;
    return d;
}


//Debugging text setup-----------------------------------------------------------
svg.append("text")
.style("text-anchor", "middle")
.attr("x", innerWidth/2+margin.left)
.attr("y", 50)
.attr("id", "debug")
.text(getGlobalTitle);

function debugOut(text){
    d3.select("#debug")
    .text(text);
}
//-------------------------------------------------------------------------------
