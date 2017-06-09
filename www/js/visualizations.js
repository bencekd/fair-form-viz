/////////////////////////////////
////  Korfa / Population pyramid
/////////////////////////////////

const ageShinyID = "shiny_agegender";

Shiny.addCustomMessageHandler("json_agegender", function(message) {

    var svg;

    if ($("#" + ageShinyID + " > svg").length == 0) {
        svg = d3.select("#" + ageShinyID).append("svg");
    } else {
        d3.select("#" + ageShinyID + " > svg").remove();
        svg = d3.select("#" + ageShinyID).append("svg");
    }

    var w = $("#" + ageShinyID)[0].clientWidth;
    var h = $("#" + ageShinyID)[0].clientHeight;
    console.log(h);

    svg.attr("width", w);
    svg.attr("height", h);

    var data = message;

    var margin = {
        top: 40,
        right: 20,
        bottom: 40,
        left: 50,
        middle: 0
    };

    var innerHeight = h - margin.top - margin.bottom - 40;
    var regionWidth = w / 2;
    console.log(innerHeight);

    var pointA = regionWidth,
        pointB = w - regionWidth;

    var totalPopulation = d3.sum(data, function(d) {
            return d.male + d.female;
        }),
        percentage = function(d) {
            return d / totalPopulation;
        };

    svg = svg
        .append('g')
        .attr('transform', translation(0, margin.top));

    var maxValue = Math.max(
        d3.max(data, function(d) {
            return percentage(d.male);
        }),
        d3.max(data, function(d) {
            return percentage(d.female);
        })
    );

    // DEFINE SCALES
    var xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, regionWidth])
        .nice();

    var xScaleLeft = d3.scaleLinear()
        .domain([0, maxValue])
        .range([regionWidth, 0]);

    var xScaleRight = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, regionWidth]);

    var yScale = d3.scalePoint()
        .domain(data.map(function(d) {
            return d.age;
        }))
        .range([innerHeight, 0]);

    // DEFINE AXES
    var yAxisLeft = d3.axisLeft(yScale)
        .tickSize(0, 0)
        .tickPadding(xScaleRight(maxValue));

    var xAxisRight = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d3.format('.0%'));

    var xAxisLeft = d3.axisBottom(xScale.copy().range([pointA, 0]))
        .ticks(5)
        .tickFormat(d3.format('.0%'));

    var leftBarGroup = svg.append('g')
        .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
    var rightBarGroup = svg.append('g')
        .attr('transform', translation(pointB, 0));

    // DRAW AXES
    svg.append('g')
        .attr('class', 'axis y left')
        .attr('transform', translation(pointA + 40, 0))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

    svg.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(40, innerHeight + 40))
        .call(xAxisLeft);

    svg.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(pointB + 40, innerHeight + 40))
        .call(xAxisRight);

    // DRAW BARS
    leftBarGroup.selectAll('.bar.left')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar left')
        .attr('x', -40)
        .attr('y', function(d) {
            return yScale(d.age) - ((yScale.step() - 20) / 2);
        })
        .attr('width', function(d) {
            return xScale(percentage(d.male));
        })
        .attr('height', yScale.step() - 20);

    rightBarGroup.selectAll('.bar.right')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar right')
        .attr('x', 40)
        .attr('y', function(d) {
            return yScale(d.age) - ((yScale.step() - 20) / 2);
        })
        .attr('width', function(d) {
            return xScale(percentage(d.female));
        })
        .attr('height', yScale.step() - 20);

    // DRAW MIDDLE LINE
    svg.append('line')
        .attr('x1', pointA + 40)
        .attr('x2', pointA + 40)
        .attr('y1', -40)
        .attr('y2', innerHeight + 40)
        .attr("stroke-width", 2)
        .attr("stroke", "white");

    // so sick of string concatenation for translations
    function translation(x, y) {
        return 'translate(' + x + ',' + y + ')';
    }

})

/////////////////////////////////
////  Choropleth map
/////////////////////////////////

const mapShinyID = "shiny_map";
const colorScale = ["#F9DC5C", "#ED254E"];

var map = L.map(mapShinyID).setView([47.1567835, 19.6133071], 7);
var w = $("#" + mapShinyID)[0].clientWidth;
var h = $("#" + mapShinyID)[0].clientHeight;

$("#" + mapShinyID).attr("width", w);
$("#" + mapShinyID).attr("height", h);

Shiny.addCustomMessageHandler("json_county", function(message) {
    var data = message;

    data.forEach(function(megye) {
        hungaryGEO.features.some(function(feature) {
            if (feature.properties.name === megye.county) {
                feature.properties.density = megye.count;
                feature.properties.freq = megye.freq;
                return true;
            }
            return false;
        })
    })

    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });

    var layer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWVjcyIsImEiOiJrY3VCVUNNIn0.7dZ0swuFiyqzhMeqwcNVgQ');
    map.addLayer(layer);

    var values = data.map(function(d) {
        return d.freq
    });

    color = d3.scaleLinear().domain([0, d3.max(values)])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb(colorScale[0]), d3.rgb(colorScale[1])]);

    L.geoJson(hungaryGEO, {
        style: function(feature) { // Style option
            return {
                'weight': 1.5,
                'color': 'black',
                'fillColor': color((feature.properties.freq) ? feature.properties.freq : '0'),
                'fillOpacity': 0.7
            }
        }
    }).addTo(map);
})

/////////////////////////////////
////  Treemap
/////////////////////////////////

const treemapShinyID = "shiny_field"

Shiny.addCustomMessageHandler("json_field", function(message) {

	var data = {
		"name": "main",
		"id": "main",
		"children": message.map(function(d){ return {id: "main." + d.name, name: d.name, size: d.count} })
	};

    var svg;

    if ($("#" + treemapShinyID + " > svg").length == 0) {
        svg = d3.select("#" + treemapShinyID).append("svg");
    } else {
        d3.select("#" + treemapShinyID + " > svg").remove();
        svg = d3.select("#" + treemapShinyID).append("svg");
    }

    var width = $("#" + treemapShinyID)[0].clientWidth;
    var height = $("#" + treemapShinyID)[0].clientHeight;

    svg.attr("width", width);
    svg.attr("height", height);

    color = d3.scaleOrdinal(["#0083A8", "#565554", "#F5F749", "#ED254E"]),
        format = d3.format(",d");

    var treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width, height])
        .round(true)
        .paddingInner(1);

    var root = d3.hierarchy(data)
        .eachBefore(function(d) {
        	console.log(d);
            d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
        })
        .sum(sumBySize)
        .sort(function(a, b) {
            return b.height - a.height || b.value - a.value;
        });

    console.log(JSON.stringify(data));

    root.parent = "main";
    treemap(root);

    var cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", function(d) {
            return "translate(" + d.x0 + "," + d.y0 + ")";
        });

    cell.append("rect")
        .attr("id", function(d) {
            return d.data.id;
        })
        .attr("width", function(d) {
            return d.x1 - d.x0;
        })
        .attr("height", function(d) {
            return d.y1 - d.y0;
        })
        .attr("fill", function(d) {
            return color(d.data.id);
        });

    cell.append("clipPath")
        .attr("id", function(d) {
            return "clip-" + d.data.id;
        })
        .append("use")
        .attr("xlink:href", function(d) {
            return "#" + d.data.id;
        });

    cell
        .append("image")
        // .attr("xlink:href", function(d) {
        //     return "icons/" + selectname[d.data.name] + ".png"
        // })
        .attr("x", 12)
        .attr("y", 8)
        .attr("width", 42)
        .attr("height", 42);

    var mapCell = cell.append("text")
        .attr("clip-path", function(d) {
            return "url(#clip-" + d.data.id + ")";
        })
        .selectAll("tspan")
        .data(function(d) {
            return d.data.name.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter()
        .append("tspan")
        .attr("class", "treemapText")
        .style("dominantBaseline", "hanging")
        // .style("fontSize", function(d, i){ return d.value })
        .attr("x", 12)
        .attr("y", function(d, i) {
            return 42 + 42 + i * 36;
        })
        .text(function(d) {
            return d;
        });

    cell
        .append("text")
        .append("tspan")
        .attr("class", "treemapValue")
        .attr("x", 12)
        .attr("dy", function(d) {
            return d.data.name.split(/(?=[A-Z][^A-Z])/g).length * 36 + 2 * 36 + 62 / 2
        })
        .text(function(d) {
            console.log(d);
            return d.value
        });

    cell.append("title")
        .text(function(d) {
            return d.data.id + "\n" + format(d.value);
        });

    d3.selectAll("input")
        .data([sumBySize, sumByCount], function(d) {
            return d ? d.name : this.value;
        })
        .on("change", changed);

    var timeout = d3.timeout(function() {
        d3.select("input[value=\"sumByCount\"]")
            .property("checked", true)
            .dispatch("change");
    }, 2000);

    function changed(sum) {
        timeout.stop();

        treemap(root.sum(sum));

        cell.transition()
            .duration(750)
            .attr("transform", function(d) {
                return "translate(" + d.x0 + "," + d.y0 + ")";
            })
            .select("rect")
            .attr("width", function(d) {
                return d.x1 - d.x0;
            })
            .attr("height", function(d) {
                return d.y1 - d.y0;
            });
    }

    function sumByCount(d) {
        return d.children ? 0 : 1;
    }

    function sumBySize(d) {
        return d.size;
    }
})