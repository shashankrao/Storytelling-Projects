(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  var svg = d3.select("#chart-4")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var radius = 100;

  var radiusScale = d3.scaleLinear()
    .domain([0, 22000])
    .range([0, radius]);
  
  var angleScale = d3.scalePoint()
    .domain(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Blah'])
    .range([0, Math.PI * 2]);

  var colorScale = d3.scaleLinear().domain([0, 22000]).range(['lightblue', 'pink'])

  var radialLine = d3.radialLine()
    .angle(function(d) {
      return angleScale(d.day)
    })
    .radius(function(d) {
      return radiusScale(d.entries);
    })

  d3.queue()
    .defer(d3.csv, "daily-ridership.csv")
    .await(ready)

  function ready(error, datapoints) {
    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    datapoints.push(datapoints[0]);
    
    g.selectAll("circle")
      .data([0, 5000, 10000, 15000, 20000])
      .enter().append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", function(d) {
        return radiusScale(d)
      })
      .attr("fill", "none")
      .attr("stroke", function(d) {
        return colorScale(d)
      })

    g.append("path")
      .datum(datapoints)
      .attr("d", radialLine)
      .attr("stroke", "grey")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    g.selectAll(".days")
      .data(datapoints)
      .enter().append("text")
      .attr("x", function(d) {
        var a = angleScale(d.day);
        var r = radiusScale(d.entries);
        return (r + 10) * Math.sin(a);
      })
      .attr("y", function(d) {
        var a = angleScale(d.day);
        var r = radiusScale(d.entries);
        return (r + 10) * Math.cos(a) * -1;
      })
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d) {
        return d.high;
      })

    g.selectAll(".day-line")
      .data(datapoints)
      .enter().append("line")
      .attr("x0", 0)
      .attr("y0", 0)
      .attr("x1", function(d) {
        var a = angleScale(d.day);
        return radius * Math.sin(a);
      })
      .attr("y1", function(d) {
        var a = angleScale(d.day);
        return radius * Math.cos(a) * -1;
      })
      .attr("stroke", "lightgray")

    g.selectAll(".days")
      .data(datapoints)
      .enter().append("text")
      .attr("x", function(d) {
        var a = angleScale(d.day);
        return (radius + 30) * Math.sin(a);
      })
      .attr("y", function(d) {
        var a = angleScale(d.day);
        return (radius + 30) * Math.cos(a) * -1;
      })
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d) {
        return d.day;
      })


  }
})();