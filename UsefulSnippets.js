//filter data by unique keys
d3.select("#road").selectAll("option")
    .data(d3.map(data, function(d){return d.roadname;}).keys())
    .enter()
    .append("option")
    .text(function(d){return d;})
    .attr("value",function(d){return d;});



//A rect can't contain a text element. Instead transform a g element with the location of text and rectangle, then append both the rectangle and the text to it:

var bar = chart.selectAll("g")
    .data(data)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", x)
    .attr("height", barHeight - 1);

bar.append("text")
    .attr("x", function(d) { return x(d) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d; });
	
	
	//http://www.jeromecukier.net/blog/2012/05/28/manipulating-data-like-a-boss-with-d3/
	
	//https://github.com/curran/screencasts/tree/gh-pages/introToD3



    circles.on('mouseover', function(){
        var team = d3.select(this).attr("class");
        d3.selectAll("."+team).attr("r", 10); //select by class
        
        d3.selectAll("circle").transition().style("opacity", function(){
            if(d3.select(this).attr("class") === team){
                return 1;
            }else{
                return .5;
            }
        })
        
        //d3.select(this)
        //.style("fill", "green");
        
        //d3.select(this).style("fill")
        //console.log(this.style.fill);
        //var info = this.attr("x");
        //debugOut(this.attr("x")); //doesnt work, this needs to be selected by d3 to get the attr value
        //debugOut(String(this.style("fill")));
        debugOut(d3.select(this).attr("class"));
    })
    
    
    
        // get extents and range
var xExtent = d3.extent(data, function(d) { return d.grade; }),
  xRange = xExtent[1] - xExtent[0],
  yExtent = d3.extent(data, function(d) { return d.bin; }),
  yRange = yExtent[1] - yExtent[0];

// set domain to be extent +- 5%
x.domain([xExtent[0] - (xRange * .05), xExtent[1] + (xRange * .05)]);
y.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]);











//cross fade text
<h1>0</h1>
<script src="//d3js.org/d3.v4.0.0-alpha.23.min.js"></script>
<script>

var format = d3.format(",d");

d3.select("h1")
  .transition()
    .duration(2500)
    .on("start", function repeat() {
      var t = d3.active(this)
          .style("opacity", 0)
          .remove();

      d3.select("body").append("h1")
          .style("opacity", 0)
          .text(format(Math.random() * 1e6))
        .transition(t)
          .style("opacity", 1)
        .transition()
          .delay(1500)
          .on("start", repeat);
    });