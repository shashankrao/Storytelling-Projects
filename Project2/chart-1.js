(function() {
  var margin = { top: 30, left: 100, right: 30, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  console.log("Building chart 7");

  var svg = d3.select("#chart-7")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scaleLinear().range([0, width-100]);
  var yPositionScale = d3.scaleLinear().range([height, 0]);
  var colorScale = d3.scaleOrdinal().domain([
    "1","2","3","4","5","6","A","C","E","B","D","F","M","N","Q","R","J","Z","G","L"]).
  range(["#FF3535","#FF3535","#FF3535","#019733","#019733","#019733","#0F6797","#0F6797","#0F6797",
    "#FF9800","#FF9800","#FF9800","#FF9800","#ffe400","#ffe400","#ffe400","#986701","#986701","#9BCF00","#999999"])

  // Read in our data
  d3.queue()
    .defer(d3.csv, "subway-census.csv")
    .await(ready);

  function ready(error, datapoints) {

    d3.select('#subway-display').style('display','none')

    var minIncome = d3.min(datapoints, function(d) { return parseInt(d.income2011) });
    var maxIncome = d3.max(datapoints, function(d) { return parseInt(d.income2011) });
    yPositionScale.domain([minIncome, maxIncome+10000])

    /*svg.append("path")
    .datum(datapoints)
    .attr("d", line)
    .attr("fill","none")
    .attr("stroke","red")
    .attr("stroke-width", 2)*/


    function drawSubwayLine(line) {
        svg.selectAll(".subway-lines")
        .transition()
        .attr("opacity", function(d) {
          return 0;
        })

       svg.selectAll(".subway-lines")
        .transition()
        .attr("opacity", function(d) {
          if(d.key == line){
            return 1;
          }
          return 0;
        })

        svg.selectAll(".subway-stops")
        .remove();


        filtered_data = datapoints.filter(function(d) { 
          return d.line == line;
       })


        var minPos = d3.min(filtered_data, function(d) { return parseInt(d.position) });
    var maxPos = d3.max(filtered_data, function(d) { return parseInt(d.position) });
    xPositionScale.domain([minPos, maxPos])

    var minIncome = d3.min(filtered_data, function(d) { return parseInt(d.income2011) });
    var maxIncome = d3.max(filtered_data, function(d) { return parseInt(d.income2011) });
    yPositionScale.domain([minIncome, maxIncome+10000])

        // Draw dots
    svg.selectAll(".subway-stops")
    .data(filtered_data)
    .enter()
    .append("circle")
    .attr("class", "subway-stops")
    .attr("r", 6)
    .attr("cx", function(d) {
      return xPositionScale(d.position)
    })
    .attr("cy", function(d) {
      return yPositionScale(d.income2011)
    })
    .attr("fill","black")
    .attr("stroke","white")
    .attr("stroke-width",2)
    .on('mouseover', function(d) {
        if(d3.select(this).attr("opacity") > 0 ) {
          d3.selectAll(".subway-stops")
          .attr("fill", "black")
          .attr("r",6)

          d3.select(this)
          .transition()
          .attr("fill", "darkgrey")
          .attr("r",8)

          d3.select('#subway-display').style('display','block')
          d3.select('#location').text(d.stop_name)
          d3.select('#income').text('$' + d.income2011)
      }
    })
    .on('mouseout', function(d) {
      d3.select(this)
      .attr("fill", "black")
      .attr("r",6)

      d3.select('#subway-display').style('display','none')
    })
    .attr("opacity", 1)


  var linef = d3.line()
    .x(function (d){
      return xPositionScale(parseInt(d.position))
    })
    .y(function (d){
      return yPositionScale(parseInt(d.income2011))
    })
    .curve(d3.curveMonotoneX)

          svg.selectAll(".subway-lines")
          .remove()

          svg.append("path")
    .datum(filtered_data)
    .attr("class", "subway-lines")
    .attr("d", linef)
    .attr("fill","none")
    .attr("stroke",function(d){
        return colorScale(line)
      })
    .attr("stroke-width", 2)


    svg.select(".y-axis")
           .transition()
      .call(yAxis);

         svg.select(".x-axis")
         .transition()
      .call(xAxis);


    }

    function filter_by_line(id, line){

    d3.select(id)
    .on('click', function() {

        d3.selectAll(".line")
        .classed("selected", false)


        d3.select(this)
        .classed("selected", true)
        drawSubwayLine(line)

     })
  }

      filter_by_line("#line1","1")
      filter_by_line("#line2","2")
      filter_by_line("#line3","3")
      filter_by_line("#line4","4")
      filter_by_line("#line5","5")
      filter_by_line("#line6","6")
      filter_by_line("#lineA","A")
      filter_by_line("#lineC","C")
      filter_by_line("#lineE","E")
      filter_by_line("#lineB","B")
      filter_by_line("#lineD","D")
      filter_by_line("#lineF","F")
      filter_by_line("#lineM","M")
      filter_by_line("#lineN","N")
      filter_by_line("#lineQ","Q")
      filter_by_line("#lineR","R")
      filter_by_line("#lineJ","J")
      filter_by_line("#lineZ","Z")
      filter_by_line("#lineG","G")
      filter_by_line("#lineL","L")
      



    

    // Add in axes
    var xAxis = d3.axisBottom(xPositionScale).tickFormat(function (d) { return ''; })
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale).tickFormat(function (d) { return '$ ' + d; });
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width-20)
    .attr("y", height + 20)
    .text("Train Stops")
    .attr("style", "font-size:16px");


      svg.append("text")
      .attr("style", "font-size:16px")
    .attr("text-anchor", "end")
    .attr("y", -80)
        .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Median Income");
  }

})();
