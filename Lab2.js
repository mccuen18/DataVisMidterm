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
var groupRects = g.append("g")
        .attr("transform", "translate("+(innerWidth+50)+","+(-50)+")");

function dataReady(data){
    
    teamData = data;
    console.log(data.length);
    console.log(data);
    /*
    //setup team rectangles
    var groupRect = groupRects.selectAll("g")
        .data(d3.map(data,function(d){return d.teamID;}).keys())
        .enter().append("g")
        .attr("transform",function(d,i){return "translate(0,"+i*barHeight/2+")"})
        .attr("class",function(d){return d})
        .on('mouseover', mouseEnterFunc)
        .on('mouseout', mouseExitFunc);
    
    groupRect.append("rect")
        .attr("width", barWidth)
        .attr("height", 20)
        .attr("fill","lightblue");
    groupRect.append("title")
        .text(function(d){return d});
    groupRect.append("text")
        .text(function(d){return d})
        .attr("transform","translate(10,15)");
    
    */
    

    
    
    
    renderDeathShareVTime();
}



function renderLatLong(){
    var data = teamData;
    xColumnName = "lon";
    yColumnName = "lat";
    
    currentXTitle = "Longitude";
    currentYTitle = "Latitude";
    
    transitionGlobalTitle(2000);
    transitionXAxisTitle(2000);
    transitionYAxisTitle(2000);
    
    var locationMap = {};
    for(var i = 0; i < data.length; i++){;
        if(!(data[i].BLocLabel in locationMap)){
            var loc = data.filter(function(d){
                return d.BLocLabel == data[i].BLocLabel});
            arrayOfSums = [];
            var performingArtsSum = loc.reduce(function(sum,d){return sum + d.PerformingArts;},0);
            arrayOfSums["PerformingArts"] = performingArtsSum;
            
            var creativeSum = loc.reduce(function(sum,d){return sum + d.Creative;},0);
            arrayOfSums["Creative"] = creativeSum;
            
            var govLawMilActRelSum = loc.reduce(function(sum,d){return sum + d.GovLawMilActRel;},0);
            arrayOfSums["GovLawMilActRel"] = govLawMilActRelSum;
            
            var academicEduHealthSum = loc.reduce(function(sum,d){return sum + d.AcademicEduHealth;},0);
            arrayOfSums["AcademicEduHealth"] = academicEduHealthSum;
            
            var sportsSum = loc.reduce(function(sum,d){return sum + d.Sports;},0);
            arrayOfSums["Sports"] = sportsSum;
            
            var businessIndustryTravelSum = loc.reduce(function(sum,d){return sum + d.BusinessIndustryTravel;},0);
            arrayOfSums["BusinessIndustryTravel"] = businessIndustryTravelSum;
            
            var max = d3.entries(arrayOfSums).sort(function(a,b){ return d3.descending(a.value, b.value);})[0];
            var locData = [data[i].BLocLat,data[i].BLocLong, max.key, max.value];
            locationMap[data[i].BLocLabel] = locData;
            //console.log(locData);
        }
   
   
    }
    var keys = Object.keys(locationMap);
    var keys2 = [,];
    for(var i = 0; i < keys.length; i++){
        var locArray = [keys[i]];
        var obj = new Object();
        obj.lat = parseFloat(locationMap[keys[i]][0]);
        obj.lon = parseFloat(locationMap[keys[i]][1]);
        obj.prof = locationMap[keys[i]][2];
        obj.max = locationMap[keys[i]][3];
        keys2[i] = obj;
    }
    var circles = g.selectAll("circle")
    .data(keys2)
    .enter()
    .append("circle");
    circles.attr("r", 2)
    .attr("fill", function(d){
        if(d.max == 0){
            return "black";
        }else if(d.prof == "PerformingArts"){
            return "dodgerblue";
        }else if(d.prof == "Creative"){
            return "red";
        }else if(d.prof == "GovLawMilActRel"){
            return "chartreuse";
        }else if(d.prof == "AcademicEduHealth"){
            return "fuchsia";
        }else if(d.prof == "Sports"){
            return "gold";
        }else if(d.prof == "BusinessIndustryTravel"){
            return "darkorange";
        }else{
            return "black";
        }
    })    
    .attr("class", function(d){return d.teamID});
    
        //setup x axis
    var xExtent = d3.extent(keys2,function(d){return d.lon});
    var xRange = xExtent[1]-xExtent[0];
    scaleX.domain([xExtent[0] - (xRange * paddingPercentage), xExtent[1] + (xRange * paddingPercentage)]);
    xAxisG.call(xAxis);
    
    //setup y axis
    var yExtent = d3.extent(keys2, function(d){return d.lat});
    var yRange = yExtent[1]-yExtent[0];
    scaleY.domain([yExtent[0] - (yRange * paddingPercentage), yExtent[1] + (yRange * paddingPercentage)]);
    yAxisG.call(yAxis);
    
    circles.attr("cx", function(d) {return scaleX(d.lon)});
    circles.transition().duration(2000).attr("cy", function(d) {return scaleY(d.lat)});
}
function renderDeathShareVTime(){
    var data = teamData;
    xColumnName = "BLocLong";
    yColumnName = "attendance";
    
    currentXTitle = "Century";
    currentYTitle = "Death Share";
    
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
//<<<<<<< HEAD
    
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
=======
>>>>>>> origin/master
    
    var totalDeaths = d3.nest()
    .key(function(d){return d.DLocLabel;})
    .rollup(function(v){ return {
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
   
    var flatDeaths = [];
    console.log(totalDeaths[0].values);
    /*
    for(var i = 0; i < 12; i++){
        flatDeaths.push(
        {
            Location: totalDeaths[i].key
        }
        
        );
        for(var j=13; j < 22;j++){
            //console.log(totalDeaths[i].values[j]);
            var tempVal = totalDeaths[i].values[j];
            flatDeaths[i][j]=tempVal;
        }
    }
    
    */
    
    for(var i = 0; i < 12; i++){

        for(var j=13; j < 22;j++){
            //console.log(totalDeaths[i].values[j]);
            
            var tempVal = totalDeaths[i].values[j];
                    flatDeaths.push(
        {
            DLocLabel: totalDeaths[i].key,
            Century: j,
            DeathCount: tempVal
        }
        
        );
            
        }
    }
    console.log(flatDeaths);
    
    data = flatDeaths;
    
    circles = g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle");
    circles.attr("r", 5)
    .attr("fill", function(d){
        if(d.DLocLabel == "Florence"){
            return "black";
        }else if(d.DLocLabel == "Rome"){
            return "dodgerblue";
        }else if(d.DLocLabel == "Paris"){
            return "red";
        }else if(d.DLocLabel == "Los Angeles"){
            return "chartreuse";
        }else if(d.DLocLabel == "New York City" ){
            return "fuchsia";
        }else if(d.DLocLabel == "London"){
            return "gold";
        }else if(d.DLocLabel == "Moscow"){
            return "darkorange";
        }else if(d.DLocLabel == "Berlin"){
            return "cyan";
        }else if(d.DLocLabel == "Munich"){
            return "forestgreen";
        }else if(d.DLocLabel == "Vienna"){
            return "indigo";
        }else if(d.DLocLabel == "Amsterdam"){
            return "sienna";
        }else if(d.DLocLabel == "Nuremberg"){
            return "tomato";
        }
    })    
    .attr("class", function(d){return d.DLocLabel})
        .on('mouseover', mouseEnterFunc)
        .on('mouseout', mouseExitFunc);
    
    xColumnName = "Century";
    yColumnName = "DeathCount";
    
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
    
    transitionGlobalTitle(2000);
    transitionYAxisTitle(2000);
    
    circles.attr("cx", function(d) {return scaleX(d[xColumnName])});
    circles.transition().duration(2000).attr("cy", function(d) {return scaleY(d[yColumnName])});
}

function renderBirthAmountVTime(){
    var data = teamData;
    yColumnName = "ER";
    currentYTitle = "# of Births";
    currentXTitle = "Century";

    transitionGlobalTitle(2000);
    transitionYAxisTitle(2000);
    var maleBirthArray = [];
    maleBirthArray[0] = data.filter(function(d){return (d.BYear >= 0) && (d.BYear <= 1300) && (d.Gender == "Male")});
    maleBirthArray[1] = data.filter(function(d){return (d.BYear > 1300) && (d.BYear <= 1400) && (d.Gender == "Male")});
    maleBirthArray[2] = data.filter(function(d){return (d.BYear > 1400) && (d.BYear <= 1500) && (d.Gender == "Male")});
    maleBirthArray[3] = data.filter(function(d){return (d.BYear > 1500) && (d.BYear <= 1600) && (d.Gender == "Male")});
    maleBirthArray[4] = data.filter(function(d){return (d.BYear > 1600) && (d.BYear <= 1700) && (d.Gender == "Male")});
    maleBirthArray[5] = data.filter(function(d){return (d.BYear > 1700) && (d.BYear <= 1800) && (d.Gender == "Male")});
    maleBirthArray[6] = data.filter(function(d){return (d.BYear > 1800) && (d.BYear <= 1900) && (d.Gender == "Male")});
    maleBirthArray[7] = data.filter(function(d){return (d.BYear > 1900) && (d.BYear <= 2000) && (d.Gender == "Male")});
    maleBirthArray[8] = data.filter(function(d){return (d.BYear > 2000) && (d.Gender == "Male")});
    for(var i = 0; i < maleBirthArray.length; i++){
        var obj = new Object();
        obj.century = i+13;
        obj.births = maleBirthArray[i].length;
        obj.gender = "male";
        maleBirthArray[i] = obj;
    }
    
    var femaleBirthArray = [];
    femaleBirthArray[0] = data.filter(function(d){return (d.BYear >= 0) && (d.BYear <= 1300) && (d.Gender == "Female")});
    femaleBirthArray[1] = data.filter(function(d){return (d.BYear > 1300) && (d.BYear <= 1400) && (d.Gender == "Female")});
    femaleBirthArray[2] = data.filter(function(d){return (d.BYear > 1400) && (d.BYear <= 1500) && (d.Gender == "Female")});
    femaleBirthArray[3] = data.filter(function(d){return (d.BYear > 1500) && (d.BYear <= 1600) && (d.Gender == "Female")});
    femaleBirthArray[4] = data.filter(function(d){return (d.BYear > 1600) && (d.BYear <= 1700) && (d.Gender == "Female")});
    femaleBirthArray[5] = data.filter(function(d){return (d.BYear > 1700) && (d.BYear <= 1800) && (d.Gender == "Female")});
    femaleBirthArray[6] = data.filter(function(d){return (d.BYear > 1800) && (d.BYear <= 1900) && (d.Gender == "Female")});
    femaleBirthArray[7] = data.filter(function(d){return (d.BYear > 1900) && (d.BYear <= 2000) && (d.Gender == "Female")});
    femaleBirthArray[8] = data.filter(function(d){return (d.BYear > 2000) && (d.Gender == "Female")});
    
    for(var i = 0; i < femaleBirthArray.length; i++){
        var obj = new Object();
        obj.century = i+13;
        obj.births = femaleBirthArray[i].length;
        obj.gender = "female";
        maleBirthArray.push(obj);
    }
    
    var unspecifiedBirthArray = [];
    unspecifiedBirthArray[0] = data.filter(function(d){return (d.BYear >= 0) && (d.BYear <= 1300) && (d.Gender == "[unspecified]")});
    unspecifiedBirthArray[1] = data.filter(function(d){return (d.BYear > 1300) && (d.BYear <= 1400) && (d.Gender == "[unspecified]")});
    unspecifiedBirthArray[2] = data.filter(function(d){return (d.BYear > 1400) && (d.BYear <= 1500) && (d.Gender == "[unspecified]")});
    unspecifiedBirthArray[3] = data.filter(function(d){return (d.BYear > 1500) && (d.BYear <= 1600) && (d.Gender == "[unspecified]")});
    unspecifiedBirthArray[4] = data.filter(function(d){return (d.BYear > 1600) && (d.BYear <= 1700) && (d.Gender == "[unspecified]")});
    unspecifiedBirthArray[5] = data.filter(function(d){return (d.BYear > 1700) && (d.BYear <= 1800) && (d.Gender == "[unspecified]")});
    unspecifiedBirthArray[6] = data.filter(function(d){return (d.BYear > 1800) && (d.BYear <= 1900) && (d.Gender == "[unspecified]")});
    unspecifiedBirthArray[7] = data.filter(function(d){return (d.BYear > 1900) && (d.BYear <= 2000) && (d.Gender == "[unspecified]")});
    unspecifiedBirthArray[8] = data.filter(function(d){return (d.BYear > 2000) && (d.Gender == "[unspecified]")});
    
    for(var i = 0; i < unspecifiedBirthArray.length; i++){
        var obj = new Object();
        obj.century = i+13;
        obj.births = unspecifiedBirthArray[i].length;
        obj.gender = "unspecified";
        maleBirthArray.push(obj);
    }
    
    
    var maleCircles = g.selectAll("circle")
    .data(maleBirthArray)
    .enter()
    .append("circle");
    maleCircles.attr("r", 5)
    .attr("fill", function(d){
        if(d.gender == "male"){
            return "blue";
        }
        if(d.gender == "female"){
            return "deeppink";
        }
        return "slategray";
    });
        //setup x axis
    var xExtent = d3.extent(maleBirthArray,function(d){return d.century});
    var xRange = xExtent[1]-xExtent[0];
    scaleX.domain([xExtent[0] - (xRange * paddingPercentage), xExtent[1] + (xRange * paddingPercentage)]);
    xAxisG.call(xAxis);
    
    //setup y axis
    var yExtent = d3.extent(maleBirthArray, function(d){return d.births});
    var yRange = yExtent[1]-yExtent[0];
    scaleY.domain([yExtent[0] - (yRange * paddingPercentage), yExtent[1] + (yRange * paddingPercentage)]);
    yAxisG.call(yAxis);
    
    maleCircles.attr("cx", function(d) {return scaleX(d.century)});
    maleCircles.transition().duration(2000).attr("cy", function(d) {return scaleY(d.births)});
    
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
    d.BLocLabel = d.BLocLabel;
    d.Gender = d.Gender;
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
