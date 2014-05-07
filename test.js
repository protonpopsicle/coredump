function SVG(tag) {
   return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function inArray(obj, someArray) {
    return someArray.indexOf(obj) > -1;
}

var PathParser = {
    directions: ['n', 's', 'e', 'w', 'j', 'k', 'l', 'm'],
    scale: 13
};

PathParser.neighbor = function(row, col, direction) {
    if (direction === 'n') {
        return [row-1, col];
    } else if (direction === 's') {
        return [row+1, col];
    } else if (direction === 'e') {
        return [row, col+1];
    } else if (direction === 'w') {
        return [row, col-1];
    } else if (direction === 'j') {
        return [row+1, col-1];
    } else if (direction === 'k') {
        return [row-1, col-1];
    } else if (direction === 'l') {
        return [row-1, col+1];
    } else if (direction === 'm') {
        return [row+1, col+1];
    }
}

PathParser.formatPoint = function(row, col) {
    return (col * this.scale) + ',' + (row * this.scale);
}

PathParser.startPoint = function(map) {
    for (var row=0; row < map.length; row++) {
        for (var col=0; col < map[row].length; col++) {
            if (inArray(map[row][col], this.directions)) {
                return [row, col];
            }
        }
    }
}

PathParser.scanMap = function(map, row, col, direction, points) {
    if (typeof points === 'undefined') {
        points = [];
    }

    if (inArray(map[row][col], this.directions)) {
        if (inArray(this.formatPoint(row, col), points)) {
            return points;
        }
        points.push(this.formatPoint(row, col));
        direction = map[row][col];
    }

    var point = this.neighbor(row, col, direction);
    return this.scanMap(map, point[0], point[1], direction, points);
}

$(function() {
    function formatPoints(points) {
        return points.reduce(function(previousValue, currentValue) { 
            return previousValue + ' ' + currentValue;
        });
    }

    function drawRegion(region) {
        var startPoint = PathParser.startPoint(region.geo);
        var points = PathParser.scanMap(region.geo, startPoint[0], startPoint[1]);

        var group = $(SVG('g')).attr(
            {'transform': 'translate(' + (region.offset[0] * PathParser.scale) + ',' + (region.offset[1] * PathParser.scale) + ')'
        }).appendTo('svg#grid')
        var poly = $(SVG('polygon')).attr({
            'points': formatPoints(points, 10),
            'class': 'region'
        }).appendTo(group);
    }

    var dungeon = {
        geo: [
            " e---------------se------s ",
            " |               ||      | ",
            " |               en      | ",
            " |                       | ",
            " |               sw      | ",
            " |               ||      | ",
            " |               ||      j ",
            " n               ||     /  ",
            "  k--------ws----wn----w   ",
            "           ||              ",
            "           ||              ",
            "           ||              ",
            "           nm              ",
            "            ``             ",
            "             `e---s        ",
            "              k---w        "
        ],
        offset: [0, 0]
    }

    var hall1 = {
        geo: [
            "  s--w ",
            "  |  | ",
            " sw  n ",
            " e--l  "
        ],
        offset: [16, 0]
    }

    var hall2 = {
        geo: [
            "  m    ",
            " l `   ",
            "  ` `  ",
            "   ` j ",
            "    k  "
        ],
        offset: [0, 0]
    }

    var pathway = {
        geo: [
            " es       ",
            " ||       ",
            " ||       ",
            " ||       ",
            " nm       ",
            "  ``      ",
            "   `e---s ",
            "    k---w "
        ],
        offset: [10, 8]
    }

    drawRegion(dungeon);
    drawRegion(hall1);
    drawRegion(hall2);
    drawRegion(pathway);

    // scale
    function scaleSVG(increment) {
        var svg = document.getElementsByTagName('svg')[0];
        var viewBox = svg.getAttribute('viewBox').split(' ');
        var newWidth = parseInt(viewBox[2]) + increment;
        var newHeight = parseInt(viewBox[3]) + increment;

        svg.setAttribute(
            'viewBox', '0 0 ' + newWidth + ' ' + newHeight
        );
    }

    $('button.zoom').click(function() {
        var increment = parseInt($(this).data('zoom-amount'));
        scaleSVG(increment);
    });
});