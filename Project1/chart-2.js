(function() {
    var margin = { top: 30, left: 50, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 780 - margin.left - margin.right;

    console.log("Building chart 2");

    var svg = d3.select("#chart-2")
                .append("svg")
                .attr("height", height + margin.top + margin.bottom)
                .attr("width", width + margin.left + margin.right)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create your scales
    var xPositionScale = d3.scalePoint().domain([2010,2011,2012,2013,2014,2015]).range([0, width]);
    var yPositionScale = d3.scaleLinear().domain([100000,220000]).range([height, 0])
    var colorScale = d3.scaleOrdinal().domain(["TimesSq-42St","GrandCentral-42St","34St-HeraldSq"])
                                                                        .range(["#54546c","#9baec8","#d9e1e8"])

    var line = d3.area()
        .x(function (d){
            return xPositionScale(d.year)
        })
        .y1(function (d){
            return yPositionScale(d.ridership)
        })
        .y0(height)

    // Import data file using d3.queue()
    d3.queue()
        .defer(d3.csv, "stations.csv")
        .await(ready);

    function ready(error, datapoints) {

        // Draw dots
        svg.selectAll(".top-circle")
        .data(datapoints)
        .enter()
        .append("circle")
        .attr("class", "top-circle")
        .attr("r", 3)
        .attr("cx", function(d) {
            return xPositionScale(d.year)
        })
        .attr("cy", function(d) {
            return yPositionScale(d.ridership)
        })
        .attr("fill",function(d){
            return colorScale(d.station)
        })

        var nested = d3.nest()
            .key(function (d){
                return d.station;
            })
            .entries(datapoints)

            console.log("This is nest. anyone reading this?")
      console.log("We have" + nested.length + " points")
      console.log(nested)

            svg.selectAll(".station-lines")
            .data(nested)
            .enter().append("path")
            .attr("d",function(d){
                return line(d.values)
            })
            .attr("fill",function(d){
                return colorScale(d.key)
            })
            .attr("opacity",0.6)

        // Add  axes
        var xAxis = d3.axisBottom(xPositionScale)
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        var yAxis = d3.axisLeft(yPositionScale);
        svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis);
    }
})();