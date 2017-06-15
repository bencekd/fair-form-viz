/////////////////////////////////
////  ICON ASSIGNMENT
/////////////////////////////////

const iconsAgeGroup = {
    "18-24": "img/icons/002-library.png",
    "25-30": "img/icons/002-library.png",
    "31-36": "img/icons/002-library.png",
    "37-42": "img/icons/001-medicine-briefcase.png",
    "43-48": "img/icons/002-library.png",
    "49-54": "img/icons/002-library.png",
    "55-60": "img/icons/002-library.png",
    "60-": "img/icons/002-library.png"
};

const iconsFields = {
    "Gazdaságinformatika": "img/icons/fields/002-chart-analysis.png",
    "Műszaki informatika": "img/icons/fields/003-browser.png",
    "Gazdaságtan, közgazdaságtan": "img/icons/fields/001-dollar-analysis-bars-chart.png",
    "Egyéb terület": "img/icons/fields/004-college-graduation.png",
    "Matematika": "img/icons/fields/005-function-mathematical-symbol.png",
    "Mérnöki tudományok": "img/icons/fields/006-engineering.png",
    "Bölcsészettudományok": "img/icons/fields/010-humanities.png",
    "Fizika": "img/icons/fields/009-physics.png",
    "Más természettudományok": "img/icons/fields/008-science.png",
    "Társadalomtudomány": "img/icons/fields/007-socialscience.png"
}

const iconsVs = {
    "Ing / kosztüm / blúz": ["img/icons/vs/003_im.png", "img/icons/vs/003_polo.png"],
    "Gyűrűk Ura": ["img/icons/vs/005_lotr.png", "img/icons/vs/005_got.png"],
    "Hamburger": ["img/icons/vs/002_burger.png", "img/icons/vs/002_pizza.png"],
    "Star Wars": ["img/icons/vs/001_starwars.png", "img/icons/vs/001_startrek.png"],
    "Python": ["img/icons/vs/006_python.png", "img/icons/vs/006_rlogo.png"],
    "Linux": ["img/icons/vs/004_linux.png", "img/icons/vs/004_win.png"],
    "Póló": ["img/icons/vs/003_polo.png", "img/icons/vs/003_im.png"],
    "Trónok Harca": ["img/icons/vs/005_got.png", "img/icons/vs/005_lotr.png"],
    "Pizza": ["img/icons/vs/002_pizza.png", "img/icons/vs/002_burger.png"],
    "Star Trek": ["img/icons/vs/001_startrek.png", "img/icons/vs/001_starwars.png"],
    "R": ["img/icons/vs/006_rlogo.png", "img/icons/vs/006_python.png"],
    "Windows": ["img/icons/vs/004_win.png", "img/icons/vs/004_linux.png"]
}

/////////////////////////////////
////  Last reply
/////////////////////////////////

var _globalLastReply;

Shiny.addCustomMessageHandler("json_lastreply", function(lastrow) {

    _globalLastReply = lastrow[0];

    $(".sk-cube-grid")
    	.fadeOut(3000);

    $(".screen")
    	.fadeOut(3500)
    	.end()
    	.find(".leaflet-control-container")
    	.show();

})

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

    var w = $("#" + ageShinyID)[0].clientWidth * 0.9;
    var h = $("#" + ageShinyID)[0].clientHeight * 0.8;

    svg.attr("width", w);
    svg.attr("height", h);
    svg.style("margin", "auto");
    svg.style("display", "table-cell");
    svg.style("margin-top", "85px");

    var data = message;

    var margin = {
        top: 40,
        right: 20,
        bottom: 40,
        left: 300,
        middle: 0
    };

    var innerHeight = h - margin.top - margin.bottom - 40;
    var regionWidth = w / 2;

    var pointA = regionWidth,
        pointB = w - regionWidth;

    var totalPopulation = d3.sum(data, function(d) {
            return d.male + d.female;
        }),
        percentage = function(d) {
            return d / totalPopulation;
        };

    graph = svg
        .append('g')
        .attr('transform', 'translation(' + margin.left + ',' + margin.top + ')');

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

    var leftBarGroup = graph.append('g')
        .attr('transform', translation(pointA + 200, 50) + 'scale(-1,1)');

    var rightBarGroup = graph.append('g')
        .attr('transform', translation(pointB + 200, 50));

    // DRAW AXES
    graph.append('g')
        .attr('class', 'axis y left')
        .attr('transform', translation(pointA + 70, 50))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

    // DRAW BARS
    leftBarGroup.selectAll('.bar.left')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar left')
        .attr('x', -40)
        .attr('y', function(d) {
            return yScale(d.age) - ((yScale.step() - 20) / 2);
        })
        .attr('height', yScale.step() - 20)
        .transition().duration(1000).delay(1000)
        .style('fill', function(d) {
            return (d.age === _globalLastReply.age && _globalLastReply.gender === 'Férfi') ? 'white' : false
        })
        .attr('width', function(d) {
            return xScale(percentage(d.male));
        });

    rightBarGroup.selectAll('.bar.right')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar right')
        .attr('x', 40)
        .attr('y', function(d) {
            return yScale(d.age) - ((yScale.step() - 20) / 2);
        })
        .attr('height', yScale.step() - 20)
        .transition().duration(1000).delay(1000)
        .style('fill', function(d) {
            return (d.age === _globalLastReply.age && _globalLastReply.gender === 'Nő') ? 'white' : false
        })
        .attr('width', function(d) {
            return xScale(percentage(d.female));
        });

    // APPEND ICONS

    // icons = svg.append("g")
    //     .attr("class", "icons");

    // icons.selectAll("icon")
    //     .data(data).enter()
    //     .append("image")
    //     .attr("class", "icon")
    //     .attr("xlink:href", function(d) {
    //         return iconsAgeGroup[d.age];
    //     })
    //     .attr("x", 30)
    //     .attr('y', function(d) {
    //         return yScale(d.age) - ((yScale.step() - 20) / 2 - 45);
    //     })
    //     .attr("width", 100)
    //     .attr("height", 100);

    // DRAW MIDDLE LINE
    graph.append('line')
        .attr('x1', pointA + 200 + 40)
        .attr('x2', pointA + 200 + 40)
        .attr('y1', -40)
        .attr('y2', innerHeight + 40 + 60)
        .attr("stroke-width", 5)
        .attr("stroke", "#383C3E");

    // so sick of string concatenation for translations
    function translation(x, y) {
        return 'translate(' + x + ',' + y + ')';
    }

})

/////////////////////////////////
////  Choropleth map
/////////////////////////////////

const mapShinyID = "shiny_map";
const colorScale = ["#00B775", "#383C3E"];

var map = L.map(mapShinyID).setView([47.1567835, 19.6133071], 8);
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

    highlight = function(feature) {
        return (_globalLastReply.county === feature.properties.name) ? {
            color: 'white',
            width: 13
        } : {
            color: 'black',
            width: 1.5
        };
    };

    L.geoJson(hungaryGEO, {
        style: function(feature) { // Style option
            return {
                'weight': highlight(feature).width,
                'color': highlight(feature).color,
                'fillColor': color((feature.properties.freq) ? feature.properties.freq : '0'),
                'fillOpacity': 0.9
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
        "children": message.map(function(d) {
            return {
                id: "main." + d.name,
                name: d.name,
                size: d.count
            }
        })
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

    color = d3.scaleOrdinal(["#00B775", "#383C3E", "#9B9B9B", "#E4E4E4"]),
        format = d3.format(",d");

    var treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width, height])
        .round(true)
        .paddingInner(1);

    var root = d3.hierarchy(data)
        .eachBefore(function(d) {
            d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
        })
        .sum(sumBySize)
        .sort(function(a, b) {
            return b.height - a.height || b.value - a.value;
        });

    root.parent = "main";
    treemap(root);

    var highlight = function(dpoint) {
        return (dpoint.data.name === _globalLastReply.field) ? {
            color: 'white',
            width: 40
        } : {
            color: false,
            width: false
        }
    }

    var cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("class", "rectG")
        .attr("transform", function(d) {
            return "translate(" + d.x0 + "," + d.y0 + ")";
        });

    cell.append("rect")
        .attr("id", function(d) {
            return d.data.id;
        })
        .attr("fill", function(d) {
            return color(d.data.id);
        })
        .attr("height", 40)
        .attr("width", 40)
        .style("stroke", function(d) {
            return highlight(d).color;
        })
        .style("stroke-width", function(d) {
            return highlight(d).width
        })
        .transition().duration(1000).delay(500)
        .attr("height", function(d) {
            return d.y1 - d.y0;
        })
        .attr("width", function(d) {
            return d.x1 - d.x0;
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
        .attr("xlink:href", function(d) {
            return iconsFields[d.data.name];
        })
        .attr("x", function(d){ 
        	var winner = d.x1 - d.x0;
        	return winner * 0.05;
        })
        .attr("y", function(d){
        	var hinner = d.y1 - d.y0;
        	return hinner * 0.05;	
        })
        .attr("width", function(d){ 
        	var hinner = d.y1 - d.y0;
        	var winner = d.x1 - d.x0;
        	var maxinner = d3.min([hinner, winner]);
        	return maxinner * 0.5 
        })
        .attr("height", function(d){
        	var hinner = d.y1 - d.y0;
        	var winner = d.x1 - d.x0;
        	var maxinner = d3.min([hinner, winner]);
        	return maxinner * 0.5 
     	})
     	.style("opacity", 0)
     	.transition().delay(1500).duration(1000)
     	.style("opacity", 1);

    var textHolder = cell.append("g")
    	.attr("transform", function(d){
    		var hinner = d.y1 - d.y0;
    		var winner = d.x1 - d.x0;
    		var maxinner = d3.min([hinner, winner]);
    		return "translate(" + winner * 0.05 + "," + maxinner * 0.60 + ")";
    	});

    var mapCell = textHolder.append("text")
        .attr("clip-path", function(d) {
            return "url(#clip-" + d.data.id + ")";
        })
        .selectAll("tspan")
        .data(function(d) {
        	var winner = d.x1 - d.x0;
        	if(winner < (d.data.name.length * 20)){
            	return d.data.name.split(" ");
        	} else {
        		return [d.data.name];
        	}
        })
        .enter()
        .append("tspan")
        .attr("class", "treemapText")
        .style("dominantBaseline", "hanging")
        .attr("x", 12)
        .attr("y", 95)
        .attr("dy", function(d,i){ return i*36 })
        // .attr("y", function(d, i) {
        //     return 100 + 100 + i * 36;
        // })
        .style("fill-opacity", 0)
        .text(function(d) {
            return d;
        })
        .transition().delay(1500)
        .style("fill-opacity", 1);

    textHolder
        .append("text")
        .append("tspan")
        .attr("class", "treemapValue")
        .attr("x", 12)
        .attr("dy", 60)
        // .attr("dy", function(d) {
        //     return d.data.name.split(/(?=[A-Z][^A-Z])/g).length * 36 + 100 + 62 / 2
        // })
        .style("fill-opacity", 0)
        .text(function(d) {
            return d.value
        })
        .transition().delay(1500)
        .style("fill-opacity", 1);

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

/////////////////////////////////
////  KPI type plot
/////////////////////////////////

const kpiShinyID = "shiny_hobbies";

Shiny.addCustomMessageHandler("json_vs", function(message) {

    var svg;

    if ($("#" + kpiShinyID + " > svg").length == 0) {
        svg = d3.select("#" + kpiShinyID).append("svg");
    } else {
        d3.select("#" + kpiShinyID + " > svg").remove();
        svg = d3.select("#" + kpiShinyID).append("svg");
    }

    var w = $("#" + kpiShinyID)[0].clientWidth * 0.95;
    var h = $("#" + kpiShinyID)[0].clientHeight * 0.85;

    svg.attr("width", w);
    svg.attr("height", h);
    svg.style("margin", "auto");
    svg.style("display", "table-cell");
    svg.style("margin-top", "75px");

    const LEFT_COL = 200;
    const RIGHT_COL = 200;

    var innerW = w - LEFT_COL - RIGHT_COL;

    var data = message;

    svg = svg
        .append("g");

    var scaleToWidth = d3.scaleLinear()
        .domain([0, 1])
        .range([0, w]);

    const PADDING_BTWN_BARS = 70;
    const MAX_DURATION = 4000;

    var padding = {
    	top: 20,
    	bottom: 20
    }
    var barHeight = (((h - padding.top - padding.bottom) - ((data.length - 1) * PADDING_BTWN_BARS)) / data.length);

    // value bar + full bar

    var bars = svg
        .selectAll(".bar")
        .data(data)
        .enter();

    bars
        .append("rect")
        .attr("height", barHeight)
        .attr("x", 0)
        .attr("y", function(d, i) {
            return i * (barHeight + PADDING_BTWN_BARS) + padding.top
        })
        .attr("width", w)
        .style("fill", "#00B775")
        .transition().duration(1000).delay(3000)
        .style("fill", function(d, i) {
            return (d.name === _globalLastReply.vs[Object.keys(_globalLastReply.vs)[i]]) ? 'white' : "#00B775";
        });

    bars
        .append("rect")
        .attr("width", 0)
        .attr("height", barHeight)
        .attr("x", 0)
        .attr("y", function(d, i) {
            return i * (barHeight + PADDING_BTWN_BARS) + padding.top
        })
        .attr("hello", function(d) {
            return JSON.stringify(d)
        })
        .style("fill", "#00B775")
        .transition().ease(d3.easeQuadOut).duration(function(d) {
            return d.rate * MAX_DURATION
        }).delay(500)
        .attr("width", function(d) {
            return scaleToWidth(d.rate)
        })
        .transition().duration(1000)
        .style("fill", function(d, i) {
            return (d.name !== _globalLastReply.vs[Object.keys(_globalLastReply.vs)[i]]) ? 'white' : "#00B775"
        });

    bars
        .append("text")
        .attr("class", "startText")
        .attr("y", function(d, i) {
            return i * (barHeight + PADDING_BTWN_BARS) + barHeight / 2 + padding.top + 5
        })
        .attr("x", LEFT_COL - 30)
        .style("alignment-baseline", "middle")
        .style("font-size", "54px")
        .style("font-weight", "bold")
        .style("fill", "black")
        .text("0%");

    bars
        .append("text")
        .attr("class", "endText")
        .attr("y", function(d, i) {
            return i * (barHeight + PADDING_BTWN_BARS) + barHeight / 2 + padding.top + 5
        })
        .attr("x", innerW - 30 + LEFT_COL)
        .style("alignment-baseline", "middle")
        .style("text-anchor", "end")
        .style("font-size", "54px")
        .style("font-weight", "bold")
        .style("fill", "black")
        .text("100%");

    bars.selectAll(".endText")
        .transition().ease(d3.easeQuadOut).duration(function(d) {
            return d.rate * MAX_DURATION
        }).delay(500)
        .tween("text", function(d) {
            var i = d3.interpolate(1, 1 - d.rate);
            var that = d3.select(this);
            return function(t) {
                that.text(d3.format(".0%")(i(t)));
            }
        })

    bars.selectAll(".startText")
        .transition().ease(d3.easeQuadOut).duration(function(d) {
            return d.rate * MAX_DURATION
        }).delay(500)
        .tween("text", function(d) {
            var i = d3.interpolate(0, d.rate);
            var that = d3.select(this);
            return function(t) {
                that.text(d3.format(".0%")(i(t)));
            }
        })

    bars
        .append("image")
        .attr("xlink:href", function(d) {
            return iconsVs[d.name][0];
        })
        .attr("x", 25)
        .attr("y", function(d, i) {
            return i * (barHeight + PADDING_BTWN_BARS) + barHeight / 2 - 45 + padding.top
        })
        .attr("width", 90)
        .attr("height", 90)
        .style("opacity", 0)
     	.transition().delay(1500).duration(1000)
     	.style("opacity", 1);

    bars
        .append("image")
        .attr("xlink:href", function(d) {
            return iconsVs[d.name][1];
        })
        .attr("x", w - 150 - 25)
        .attr("y", function(d, i) {
            return i * (barHeight + PADDING_BTWN_BARS) + barHeight / 2 - 45 + padding.top
        })
        .attr("width", 90)
        .attr("height", 90)
        .style("opacity", 0)
     	.transition().delay(1500).duration(1000)
     	.style("opacity", 1);
})

/////////////////////////////////
////  HiflyScore
/////////////////////////////////

const HiflyScore = "calculated_score";

Shiny.addCustomMessageHandler("updatedShiny", function(message) {

	var calcScore = message;
    var svg;

    if ($("#" + HiflyScore + " > svg").length == 0) {
        svg = d3.select("#" + HiflyScore).append("svg");
    } else {
        d3.select("#" + HiflyScore + " > svg").remove();
        svg = d3.select("#" + HiflyScore).append("svg");
    }

    var w = $("#" + HiflyScore)[0].clientWidth;
    var h = $("#" + HiflyScore)[0].clientHeight;

    svg.attr("width", w);
    svg.attr("height", h);

    svg = svg
        .append("g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    var filter = svg.append("defs")
      .append("filter")
        .attr("id", "blur")
      .append("feGaussianBlur")
        .attr("stdDeviation", 5);

    var twoPi = 2 * Math.PI,
        progress = 0,
        total = calcScore,
        formatPercent = d3.format(".0%");

    var arc = d3.arc()
        .startAngle(0)
        .innerRadius(210)
        .outerRadius(250);

    var meter = svg.append("g")
        .attr("class", "progress-meter");

    meter.append("path")
        .attr("class", "background")
        .style("fill", "#565554")
        .attr("d", arc.endAngle(twoPi));

    var foreground = meter.append("path")
        .attr("class", "foreground")
        .attr("filter", "url(#blur)");

    var text = meter.append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "9em")
        .style("fill", "white")
        .attr("dy", ".35em");

    var interp = d3.interpolate(0, total/100);
    d3.transition().duration(5000).delay(4000).tween("progressName", function() {
        return function(t) {
            progress = interp(t);
            foreground.attr("d", arc.endAngle(twoPi * progress))
                .style("fill", "#00B775");
            text.text(formatPercent(progress));
        };
    });

})

