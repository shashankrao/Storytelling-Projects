(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colorScale = d3.scaleOrdinal().domain(["BMT","IND","IRT","Others"])
                                    .range(["#67D5B5","#C89EC4","#EE7785","#84B1ED"])
  var radius = 100;

  var arc = d3.arc()
              .outerRadius(radius)
              .innerRadius(radius*0.4);

  var labelArc = d3.arc()
              .outerRadius(radius*2.4)
              .innerRadius(0);

  var pie = d3.pie()
              .sort(null)
              .value(function (d){
                return d.booths;
              });

  d3.queue()
    .defer(d3.csv, "lines.csv")
    .await(ready)

  function ready(error, datapoints) {

    pieContainer = svg.append('g').attr('transform', 'translate(' + width/2 + ',' + height/2 +')');

    pieContainer.selectAll("path")
       .data(pie(datapoints))
       .enter()
       .append('path')
       .attr("opacity",0.7)
       .attr('d',arc)
       .attr('fill', function (d) { return colorScale(d.data.line);})
       

    pieContainer.selectAll("text")
                .data(pie(datapoints))
                .enter()
                .append("text")
                .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                .text(function(d) { return d.data.line; })
                .attr("text-anchor", function(d) {
                      if(d.startAngle > Math.PI) {
                        return "end"
                      } else {
                        if(d.endAngle > Math.PI) {
                          return "end"
                        }
                        return "start"
                      }
	              })
              }

    legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(50,30)")
    .style("font-size","12px")
    .call(d3.legend)
})();
