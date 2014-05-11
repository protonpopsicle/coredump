var scaleX = 8;
var scaleY = 8;

var width = 440,
    height = 308;

var mapData = {"regions": [{"path": [{"y": 0, "x": 0}, {"y": 0, "x": 16}, {"y": 2, "x": 16}, {"y": 2, "x": 17}, {"y": 0, "x": 17}, {"y": 0, "x": 24}, {"y": 6, "x": 24}, {"y": 8, "x": 22}, {"y": 8, "x": 17}, {"y": 4, "x": 17}, {"y": 4, "x": 16}, {"y": 8, "x": 16}, {"y": 8, "x": 11}, {"y": 12, "x": 11}, {"y": 14, "x": 13}, {"y": 14, "x": 17}, {"y": 15, "x": 17}, {"y": 15, "x": 13}, {"y": 12, "x": 10}, {"y": 8, "x": 10}, {"y": 8, "x": 1}, {"y": 7, "x": 0}, {"y": 0, "x": 0}], "name": "Dungeon"}, {"path": [{"y": 0, "x": 1}, {"y": 2, "x": 1}, {"y": 2, "x": 0}, {"y": 3, "x": 0}, {"y": 3, "x": 3}, {"y": 2, "x": 4}, {"y": 0, "x": 4}, {"y": 0, "x": 1}], "name": "Room", "offset": [0, 16]}, {"path": [{"y": 0, "x": 1}, {"y": 3, "x": 4}, {"y": 4, "x": 3}, {"y": 1, "x": 0}, {"y": 0, "x": 1}], "name": "Passage"}, {"path": [{"y": 0, "x": 0}, {"y": 0, "x": 1}, {"y": 4, "x": 1}, {"y": 6, "x": 3}, {"y": 6, "x": 7}, {"y": 7, "x": 7}, {"y": 7, "x": 3}, {"y": 4, "x": 0}, {"y": 0, "x": 0}], "name": "Hallway", "offset": [8, 10]}], "objects": [{"src": "colorful_beach_shorts.svg", "href": "http://yahoo.com", "name": "Shorts", "offset": [1, 1]}]};

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
    .append('g');

svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', width * 10)
    .attr('height', height * 10)
    .attr('transform', function() { return translateCenter(this, 1); });

svg.append('g')
    .attr('id', 'map')


// draw
for (var i=0; i < regions.length; i++) {
    d3.select('g#map').append('path')
	.attr('d', lineFunction(regions[i].path))
	.attr('class', function() { 
	    if (i === 0) { return 'outline'; }
	    return 'region';
	})
        .attr('transform', function() {
	    if (regions[i].offset !== undefined) {
		return 'translate(' + regions[i].offset[1] * scaleX + ',' + regions[i].offset[0] * scaleY + ')'
	    }
	})
}

for (var i=0; i < objects.length; i++) {
    d3.select('g#map').append('image')
        .attr('xlink:href', objects[i].src)
	.attr('mydata:action', objects[i].href)
	.attr('width', 1.6 * scaleX)
	.attr('height', 1.6 * scaleY)
	.on('click', function() { d3.select('iframe').attr('src', 'http://rhizome.org'); })
}

d3.select('g#map')
    .attr('transform', function() { return translateCenter(this, 1); })
    .transition()
    .attr('transform', function() { return translateCenter(this, 2); })
    .duration(750)
    .delay(100)

function translateCenter(elem, scale) {
    var bbox = elem.getBBox();
    var x = width / 2 - bbox.width * scale / 2;
    var y = height / 2 - bbox.height * scale / 2;
    return translateTo([x, y], scale);
}

function translateTo(point, scale) {
    return 'translate(' + point[0] + ',' + point[1] + ')scale(' + scale + ')';
}

function move() {
    svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
}

