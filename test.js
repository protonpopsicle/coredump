
// TODO 
// border should go outside grid squares
// and added to position calc
// should use a scaling funciton which scales the whole dungeon
// that way can resize without redrawing entire thing

// POF -- zoom
// display objects in iframe


$(function() {
    var dungeon = [
    "|---------------|------|",
    "|a@aaaaaaaaaaaaa|jjbbbb|",
    "|aaaaaaaaaaaaaaajjjbbbb|",
    "|aaaaaaaaaaaaaaajbbbbbb|",
    "|aaaaaaaaaaaaaaa|bbbbbb|",
    "|aaaaaaaaaaaaaaa|------|",
    "|----|h|--------|       ",
    "     |h|-----|          ",
    "    -|hhhhhhh|-         ",
    "   |hhhhhhhhhhh|        ",
    "   |hhhhhhhhhhh|        ",
    "   |hhhhhhhhhhh|        ",
    "   |hhhhhhhhhhh|        ",
    "   |hhhhhhhhhhh|        ",
    "   |-----------|        ",
    ]

    var unit = 'px';
    var xScale = 10;
    var yScale = 10;

    objs = {
    '@': {
        'region': 'a',
        'img': 'colorful_beach_shorts.svg',
        'width': 1.5,
        'click': function() {
        console.log('DO SOMETHING!');
        }
    },
    }
   
    // function symbolBefore(map, row, col) {
    // if (col > 0) {
    //     return map[row][col - 1];
    // }
    // return null;
    // }

    // function symbolAfter(map, row, col) {
    // if (col < map[row].length - 1) {
    //     return map[row][col + 1];
    // }
    // return null;
    // }

    // function symbolAbove(map, row, col) {
    // if (row > 0) {
    //     return map[row - 1][col];
    // }
    // return null;
    // }

    // function symbolBelow(map, row, col) {
    // if (row < map.length - 1) {
    //     return map[row + 1][col];
    // }
    // return null;
    // }

    function topCenter(row, col) {
    return (row * yScale) + (0.5 * yScale);
    }
    function leftCenter(row, col) {
    return (col * xScale) + (0.5 * xScale);
    }

    function placeObject(obj, row, col) {
    var anchor = $('<a class="obj"></a>').css({
        'left': '' + leftCenter(row, col) - (0.5 * obj.width * xScale) + unit,
    }).click(obj.click).appendTo('#grid');

    var image = $('<img src="' + obj.img + '">').css({
        'width': '' + obj.width * xScale + unit,
    }).appendTo(anchor);

    image.load(function() {
        anchor.css({'top': '' + topCenter(row, col) - (0.5 * image.height()) + unit});
    });
    }

    function drawMap(map, objs) {
    for (var row=0; row < map.length; row++) {
        for (var col=0; col < map[row].length; col++) {
        var symbol = map[row][col];

        // check if symbol is object
        if (objs[symbol] !== undefined) {
            placeObject(objs[symbol], row, col);
            symbol = objs[symbol].region; // swap for the region symbol (gross)
        }

        if ([' ', '-', '|'].indexOf(symbol) === -1) {
            var elem = $('<a href="#" class="region"></a>').css({
            'top': '' + row * xScale + unit,
            'left': '' + col * yScale + unit,
            'width': '' + xScale + unit,
            'height': '' + yScale + unit,
            }).attr({
            'data-region': symbol,
            'data-row': row,
            'data-col': col,
            });

            // borders
            // if (['|', '-'].indexOf(symbolBefore(map, row, col)) > -1) {
            // elem.css({'border-left-width': '1px'});
            // }
            // if (['|', '-'].indexOf(symbolAfter(map, row, col)) > -1) {
            // elem.css({'border-right-width': '1px'});
            // }
            // if (['|', '-'].indexOf(symbolBelow(map, row, col)) > -1) {
            // elem.css({'border-bottom-width': '1px'});
            // }
            // if (['|', '-'].indexOf(symbolAbove(map, row, col)) > -1) {
            // elem.css({'border-top-width': '1px'});
            // }
            
            // highlight region
            elem.hover(function() {
            $('.region[data-region="' + $(this).data('region') + '"]').addClass('highlight');
            }, function() {
            $('.region[data-region="' + $(this).data('region') + '"]').removeClass('highlight');
            });
            
            elem.appendTo($('#grid'));
        }
        }
    }
    }
   
    function scaleMap(selector, duration) {
    // regions
    $(selector).css({
        'top': function() {
        return '' + $(this).data('row') * xScale + unit;
        },
        'left': function() {
        return '' + $(this).data('col') * yScale + unit;
        },
        'width': '' + xScale + unit,
        'height': '' + yScale + unit,
    });
    
    // objects
    }

    drawMap(dungeon, objs);

    $('button.zoom').click(function() {
    var amount = $(this).data('zoom-amount');
    xScale += amount;
    yScale += amount;
    scaleMap('.region');
    });
});





// <regionid='a' w=17 h=6>
//   <portal id='a1' top=3 right=0 dest='f1'>
// </region>

// <region id='f' w=3 h=3>
//   <portal id='f1' top=1 left=0 dest='
// </region>

// <region id='b' w=8 h=5>
// </region>


// aaaaaaaaaaaaaaa   bbbbbb
// aaaaaaaaaaaaaaafffbbbbbb
// aaaaaaaaaaaaaaa   bbbbbb
// aaaaaaaaaaaaaaa

