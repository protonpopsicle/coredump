var scaleX = 8;
var scaleY = 8;

var width = 440,
    height = 308;

var mapData = {"regions": [{"path": [{"y": 0, "x": 0}, {"y": 0, "x": 16}, {"y": 2, "x": 16}, {"y": 2, "x": 17}, {"y": 0, "x": 17}, {"y": 0, "x": 24}, {"y": 6, "x": 24}, {"y": 8, "x": 22}, {"y": 8, "x": 17}, {"y": 4, "x": 17}, {"y": 4, "x": 16}, {"y": 8, "x": 16}, {"y": 8, "x": 11}, {"y": 12, "x": 11}, {"y": 14, "x": 13}, {"y": 14, "x": 17}, {"y": 15, "x": 17}, {"y": 15, "x": 13}, {"y": 12, "x": 10}, {"y": 8, "x": 10}, {"y": 8, "x": 1}, {"y": 7, "x": 0}], "name": "Dungeon"}, {"path": [{"y": 0, "x": 1}, {"y": 2, "x": 1}, {"y": 2, "x": 0}, {"y": 3, "x": 0}, {"y": 3, "x": 3}, {"y": 2, "x": 4}, {"y": 0, "x": 4}], "name": "Room", "offset": [0, 16]}, {"path": [{"y": 0, "x": 1}, {"y": 3, "x": 4}, {"y": 4, "x": 3}, {"y": 1, "x": 0}], "name": "Passage"}, {"path": [{"y": 0, "x": 0}, {"y": 0, "x": 1}, {"y": 4, "x": 1}, {"y": 6, "x": 3}, {"y": 6, "x": 7}, {"y": 7, "x": 7}, {"y": 7, "x": 3}, {"y": 4, "x": 0}], "name": "Hallway", "offset": [8, 10]}], "objects": [{"marker": ["M 0 100 L 26 48 L 74 48 L 100 100 L 50 80 z", "M 30 40 L 50 0 L 70 40 z"], "href": "http://schneeblog.com/wp-content/uploads/2014/04/the-matrix-neo.jpg", "name": "Rhizome", "offset": [1, 1]}, {"marker": ["M 0 100 L 26 48 L 74 48 L 100 100 L 50 80 z", "M 30 40 L 50 0 L 70 40 z"], "href": "http://www.quickmeme.com/img/15/15dbaf9699b87fc1c90d8241e53b3aa2a08beab668584ee796c320d2c7415ef6.jpg", "name": "Art F City", "offset": [6, 4]}]};

var regions = mapData.regions
var objects = mapData.objects

var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x * scaleX; })
                         .y(function(d) { return d.y * scaleY; })
                         .interpolate('linear');

var zoom = d3.behavior.zoom()
    .scaleExtent([.5, 8])
    .size([width, height])
    .on('zoom', move);

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .call(zoom)
    .append('g')

svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', width * 10)
    .attr('height', height * 10)
    .attr('transform', function() { return translateCenter(this, width, height, 1); });

var map = svg.append('g')
    .attr('id', 'map')

// draw
for (var i=0; i < regions.length; i++) {
    map.append('path')
	.attr('d', lineFunction(regions[i].path) + 'Z')
	.attr('class', 'region')
        .attr('transform', function() {
	    if (regions[i].offset !== undefined) {
		return 'translate(' + regions[i].offset[1] * scaleX + ',' + regions[i].offset[0] * scaleY + ')'
	    }
	})
}

for (var i=0; i < objects.length; i++) {
    var marker = map.append('g')
	.attr('class', 'marker')
	.attr('sex:action', objects[i].href)
    	.on('click', function() { d3.select('img:first-child').attr('src', this.getAttribute('action')); })

    for (var j=0; j < objects[i].marker.length; j++) {
	marker.append('path')
	    .attr('d', objects[i].marker[j])
    }

    marker.attr('transform', function() {
    	    var x = objects[i].offset[0] * scaleX;
    	    var y = objects[i].offset[1] * scaleY;
       	    var scale = (scaleX / this.getBBox().width) * 1.5;
    	    return '' + translateTo([x, y], scale) + translateCenter(this, scaleX, scaleY, 1);
    	})
}

map.attr('transform', function() { return translateCenter(this, width, height, 1); })
    .transition()
    .attr('transform', function() { return translateCenter(this, width, height, 2); })
    .duration(750)
    .delay(100)

function translateCenter(elem, w, h, scale) {
    var bbox = elem.getBBox();
    var x = w / 2 - bbox.width * scale / 2;
    var y = h / 2 - bbox.height * scale / 2;
    return translateTo([x, y], scale);
}

function translateTo(point, scale) {
    return 'translate(' + point[0] + ',' + point[1] + ')scale(' + scale + ')';
}

function move() {
    svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
}

