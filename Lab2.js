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
    
    
    
    renderLatLong();
}



function renderLatLong(){
    var data = teamData;
    xColumnName = "BLocLong";
    yColumnName = "BLocLat";
    
    currentXTitle = "Longitude";
    currentYTitle = "Latitude";
    
    transitionGlobalTitle(2000);
    transitionXAxisTitle(2000);
    transitionYAxisTitle(2000);
    
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
    
    circles.attr("cx", function(d) {return scaleX(d[xColumnName])});
    circles.transition().duration(2000).attr("cy", function(d) {return scaleY(d[yColumnName])});
}
function renderDeathShareVTime(){
    var data = teamData;
    yColumnName = "attendance";
    currentYTitle = "Home Field Attendance";
    
    transitionGlobalTitle(2000);
    transitionYAxisTitle(2000);
    
    var yExtent = d3.extent(data, function(d){return d[yColumnName]});
    var yRange = yExtent[1]-yExtent[0];
    scaleY.domain([yExtent[0] - (yRange * paddingPercentage), yExtent[1] + (yRange * paddingPercentage)]);
    yAxisG.call(yAxis);
    
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
    d.ER = +d.ER; //converts ER to int value
    d.yearID = +d.yearID;
    d.BLocLong = +d.BLocLong;
    d.BLocLat = +d.BLocLat;
    d.GHome = +d.GHome;
    d.attendance = +d.attendance;
    d.G = +d.G;
    d.W = +d.W;
    d.L = +d.L;
    d.BYear = +d.BYear;
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
