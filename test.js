var scaleX = 8;
var scaleY = 8;

var width = 440,
    height = 308;

var lineData = [{"y": 0, "x": 0}, {"y": 0, "x": 16}, {"y": 2, "x": 16}, {"y": 2, "x": 17}, {"y": 0, "x": 17}, {"y": 0, "x": 24}, {"y": 6, "x": 24}, {"y": 8, "x": 22}, {"y": 8, "x": 17}, {"y": 4, "x": 17}, {"y": 4, "x": 16}, {"y": 8, "x": 16}, {"y": 8, "x": 11}, {"y": 12, "x": 11}, {"y": 14, "x": 13}, {"y": 14, "x": 17}, {"y": 15, "x": 17}, {"y": 15, "x": 13}, {"y": 12, "x": 10}, {"y": 8, "x": 10}, {"y": 8, "x": 1}, {"y": 7, "x": 0}]

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
    .attr('transform', translateCenter);

svg.append('path')
    .attr('d', lineFunction(lineData))
    .attr('class', 'outline')
    .attr('transform', translateCenter)
    .transition()
    .attr('transform', initialZoom)
    .duration(750)
    .delay(100);

function initialZoom() {
    var scale = 2;
    var bbox = this.getBBox();
    var x = width / 2 - (bbox.width * scale) / 2;
    var y = height / 2 - (bbox.height * scale) / 2;
    return translateTo([x, y], scale);
}

function translateCenter() {
    var bbox = this.getBBox();
    var x = width / 2 - bbox.width / 2;
    var y = height / 2 - bbox.height / 2;
    return translateTo([x, y], 1);
}

function translateTo(point, scale) {
    return 'translate(' + point[0] + ',' + point[1] + ')scale(' + scale + ')';
}

function move() {
    // var t = d3.event.translate,
    //     s = d3.event.scale;
    // t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
    // t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
    // zoom.translate(t);
    // svg.attr("transform", "translate(" + t + ")scale(" + s + ")");
    svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
}

