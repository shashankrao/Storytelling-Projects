(function() {
	var margin = { top: 30, left: 50, right: 30, bottom: 30},
	height = 400 - margin.top - margin.bottom,
	width = 780 - margin.left - margin.right;

	console.log("Building chart 3");

	var svg = d3.select("#chart-3")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var xPositionScale = d3.scalePoint().domain([2010,2011,2012,2013,2014,2015]).range([0, width-50]);
	var yPositionScale = d3.scaleLinear().domain([15000,18000]).range([height, 0]);

	var line = d3.line()
		.x(function (d){
			return xPositionScale(d.year)
		})
		.y(function (d){
			return yPositionScale(d.ridership)
		})
		.curve(d3.curveMonotoneX)

	d3.queue()
		.defer(d3.csv, "ridership.csv")
		.await(ready);

	function ready(error,datapoints) {


		svg.selectAll(".rd-circle")
		.data(datapoints)
		.enter()
		.append("circle")
		.attr("class", "rd-circle")
		.attr("r", function(d){
			if(d.year == "2015"){
				return 6
			}
			return 3

		})
		.attr("cx", function(d) {
			return xPositionScale(d.year)
		})
		.attr("cy", function(d) {
			console.log(d)
			return yPositionScale(d.ridership)
		})
		.attr("fill","red")

	svg.append("path")
    .datum(datapoints)
    .attr("d", line)
    .attr("fill","none")
    .attr("stroke","#EE7785")

			svg.append("text")
	    .attr("x", xPositionScale(2015))
	    .attr("dx",-120)
	    .attr("y", yPositionScale(15900))
	    .text("116St-Columbia University")
			.attr("style", "font-family: Verdana;font-size: 14px; fill: #EE7785");

		// Add your axes
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