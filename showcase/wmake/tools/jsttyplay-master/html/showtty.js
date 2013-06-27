// showtty.js - a building block for viewing tty animations
// Copyright 2008 Jack Christopher Kastorff

/**
 *
 * Note:
 *  The original author (JCK) uses the term "table" quite often. Instead, I
 *  will use the expression "Terminal View" in the comments as it better
 *  reflects the concept.
 *
 */

(function(){

/**
 * Foreground color map
 */
var clut = { 0: "#000", 1: "#D00", 2: "#0D0", 3: "#DD0", 4: "#00D", 5: "#D0D", 6: "#0DD", 7: "#DDD" };

/**
 * ? Seems to be unused
 */
var t = 0;

/**
 * Repeat a string n-times
 *
 * Takes a string as input, and returns a new string which consists of n-times
 * the input string (all concatenated together with the empty string).
 *
 * @param str: The input string
 * @param rep: How many times to repeat the string
 * @return: The repeated string
 */
var repeatString = function (str, rep) {
    var outstr = '';
    for (var i = 0; i < rep; i++) {
        outstr += str;
    }
    return outstr;
};

/**
 * Creates an array of PRE elements representing single terminal characters.
 *
 * These PRE elements are contained in a DIV element. The DIV element
 * represents a terminal row. As such each DIV contains as many PREs as there
 * are terminal columns.
 *
 * @param width: The number of terminal columns
 * @param height: The number of terminal rows
 * @return: An object with two members:
 *      - arr: A two-dimensional array containing the PREs
 *      - elem: the HTML DIV element with the PREs
 */
var makeTable = function (width, height) {
    var table = document.createElement("div");
    var arr = [];
    for (var j = 1; j <= height; j++) {
        var row = document.createElement("div");
        var arrrow = [];
        row.style.fontFamily = '"ProFont", "Luxi Mono", "Monaco", "Courier", "Courier new", monospace';
        row.style.margin = '0';
        row.style.padding = '0';
        row.style.wordSpacing = '0';
        row.style.height = '1.0em';
        for (var i = 1; i <= width; i++) {
            var charelem = document.createElement("pre");
            charelem.style.backgroundColor = '#000';
            charelem.style.color = '#FFF';
            charelem.style.display = 'inline';
            charelem.style.fontWeight = 'normal';
            charelem.style.textDecoration = 'none';
            charelem.style.letterSpacing = '0';
            charelem.style.margin = '0';
            charelem.style.padding = '0 0 0.2em 0';
            charelem.appendChild(document.createTextNode(" "));
            row.appendChild(charelem);
            arrrow.push(charelem);
        }
        table.appendChild(row);
        arr.push(arrrow);
    }
    return { "arr": arr, "elem": table };
};

/**
 * Sets a sequence of characters in a terminal view
 *
 * @param tb: The terminal view
 * @param r: The characters to be put into the terminal
 * @param index: The row index
 * @param stx: The starting column
 */
var setTextChunk = function (tb, r, index, stx) {
    for (var i = 0; i < r.length; i++) {
        tb.arr[index][i+stx].firstChild.replaceData(0, 1, r.charAt(i));
    }
};

/**
 * Sets the "bold" style for a character sequence.
 *
 * @param tb: The Terminal view
 * @param r: A string representing the bold states (0 = normal, 1 = bold)
 * @param index: The row index
 * @param stx: The starting column
 */
var setBoldChunk = function (tb, r, index, stx) {
    for (var i = 0; i < r.length; i++) {
        tb.arr[index][i+stx].style.fontWeight = r.charAt(i) == 0 ? 'normal' : 'bold';
    }
};

/**
 * Sets the "underline" style for a character sequence.
 *
 * @param tb: The Terminal view
 * @param r: A string representing the underline states (0 = normal, 1 =
 *           underlined)
 * @param index: The row index
 * @param stx: The starting column
 */
var setUnderlineChunk = function (tb, r, index, stx) {
    for (var i = 0; i < r.length; i++) {
        tb.arr[index][i+stx].style.textDecoration = r.charAt(i) == 0 ? 'none' : 'underline';
    }
};

/**
 * Sets the "foreground-color" style for a character sequence.
 *
 * @param tb: The Terminal view
 * @param r: A string representing the colors. Colors are mapped using the
 *           global variable "clut"
 * @param index: The row index
 * @param stx: The starting column
 */
var setFcolorChunk = function (tb, r, index, stx) {
    for (var i = 0; i < r.length; i++) {
        tb.arr[index][i+stx].style.color = clut[r.charAt(i)];
    }
};

/**
 * Sets the "background-color" style for a character sequence.
 *
 * @param tb: The Terminal view
 * @param r: A string representing the colors. Colors are mapped using the
 *           global variable "clut"
 * @param index: The row index
 * @param stx: The starting column
 */
var setBcolorChunk = function (tb, r, index, stx) {
    for (var i = 0; i < r.length; i++) {
        tb.arr[index][i+stx].style.backgroundColor = clut[r.charAt(i)];
    }
};

var loadIFrame = function (tb, rowcaches, fr, width, height) {
    var d = uncompressIFrameBlock(fr.d, width);
    for (var i = 0; i < d.length; i++) {
        setTextChunk(tb, d[i], i, 0);
        rowcaches.d[i] = d[i];
    }
    var B = uncompressIFrameBlock(fr.B, width);
    for (var i = 0; i < B.length; i++) {
        setBoldChunk(tb, B[i], i, 0);
        rowcaches.B[i] = B[i];
    }
    var U = uncompressIFrameBlock(fr.U, width);
    for (var i = 0; i < U.length; i++) {
        setUnderlineChunk(tb, U[i], i, 0);
        rowcaches.U[i] = U[i];
    }
    var f = uncompressIFrameBlock(fr.f, width);
    for (var i = 0; i < f.length; i++) {
        setFcolorChunk(tb, f[i], i, 0);
        rowcaches.f[i] = f[i];
    }
    var b = uncompressIFrameBlock(fr.b, width);
    for (var i = 0; i < b.length; i++) {
        setBcolorChunk(tb, b[i], i, 0);
        rowcaches.b[i] = b[i];
    }
};

var uncompressIFrameBlock = function (d,width) {
    var uncomp = [];
    var last = null;
    for (var i = 0; i < d.length; i++) {
        var uncomprow = null;
        if ( typeof d[i] == 'array' || typeof d[i] == 'object' ) {
            if ( d[i][0] == "r" ) {
                uncomprow = d[i][1];
            } else if ( d[i][0] == "a" ) {
                uncomprow = repeatString(d[i][1], width);
            } else {
                throw new Error ("bad iframe data: subarray is not valid");
            }
        } else if ( typeof d[i] == 'string' && d[i] == 'd' ) {
            uncomprow = last;
        } else {
            throw new Error ("bad iframe data: unknown " + (typeof d[i]) + " in array");
        }
        uncomp.push(uncomprow);
        last = uncomprow;
    }
    return uncomp;
};

var loadPFrame = function (table, rowcaches, fr, width, height) {
    if ( fr.d ) {
        diffPushGeneric(table, annotatedPFrameBlock(fr.d, width), rowcaches.d, setTextChunk);
    }
    if ( fr.B )  {
        diffPushGeneric(table, annotatedPFrameBlock(fr.B, width), rowcaches.B, setBoldChunk);
    }
    if ( fr.U ) {
        diffPushGeneric(table, annotatedPFrameBlock(fr.U, width), rowcaches.U, setUnderlineChunk);
    }
    if ( fr.f ) {
        diffPushGeneric(table, annotatedPFrameBlock(fr.f, width), rowcaches.f, setFcolorChunk);
    }
    if ( fr.b ) {
        diffPushGeneric(table, annotatedPFrameBlock(fr.b, width), rowcaches.b, setBcolorChunk);
    }
};

var diffPushGeneric = function (table, d, rowcache, set) {
    // convert everything to line operations
    for (var i = 0; i < d.length; i++) {
        var e = d[i];
        if ( e[0] == "cp" ) {
            set(table, rowcache[e[1]], e[2], 0);
            rowcache[e[2]] = rowcache[e[1]];
        } else if ( e[0] == 'char' ) {
            var r = e[1];
            var v = rowcache[r];
            var da = v.slice(0, e[2]) + e[3] + v.slice(e[2]+1);
            set(table, e[3], e[1], e[2]);
            rowcache[r] = da;
        } else if ( e[0] == 'chunk' ) {
            var r = e[1];
            var v = rowcache[r];
            var da = v.slice(0, e[2]) + e[4] + v.slice(e[3]+1);
            set(table, e[4], e[1], e[2]);
            rowcache[r] = da;
        } else if ( e[0] == 'line' ) {
            set(table, e[2], e[1], 0);
            rowcache[e[1]] = e[2];
        } else {
            throw new Error ("unknown p-frame item type " + e[0] + ", len " + e.length);
        }
    }
};

var annotatedPFrameBlock = function (frame, width) {
    var ann = [];
    for (var i = 0; i < frame.length; i++) {
        var e = frame[i];
        if ( e[0] == 'cp' ) {
            ann.push(e);
        } else if ( e.length == 2 ) {
            // raw line
            if ( typeof e[1] == 'string' ) {
                ann.push(['line', e[0], e[1]]);
            } else if ( e[1][0] == "a" ) {
                ann.push(['line', e[0], repeatString(e[1][1], width)]);
            } else {
                throw new Error ("p-frame corrupted: invalid 2-len");
            }
        } else if ( e.length == 3 ) {
            // char
            ann.push(['char', e[0], e[1], e[2]]);
        } else if ( e.length == 4 ) {
            // chunk
            if ( typeof e[3] == 'string' ) {
                ann.push(['chunk', e[0], e[1], e[2], e[3]]);
            } else if ( e[3][0] == 'a' ) {
                ann.push(['chunk', e[0], e[1], e[2], repeatString(e[3][1], e[2]-e[1]+1)]);
            } else {
                throw new Error ("p-frame corrupted: invalid 4-len");
            }
        } else {
            throw new Error ("p-frame corrupted: no such thing as a " + e.length + "-len");
        }
    }
    return ann;
};

var handleCursor = function (table, bgcache, curpos, dx, dy) {
    if ( typeof dx == 'number' || typeof dy == 'number' ) {
        // make sure the old cursor position has been overwritten
        setBcolorChunk(table, bgcache[curpos[1]-1].charAt(curpos[0]-1), curpos[1]-1, curpos[0]-1);
        if ( typeof dx == 'number' ) {
            curpos[0] = dx;
        }
        if ( typeof dy == 'number' ) {
            curpos[1] = dy;
        }
    }

    // draw the cursor
    table.arr[curpos[1]-1][curpos[0]-1].style.backgroundColor = '#FFF';
};

var animateNextFrame = function(holder) { with (holder) {
    var fr = timeline[nextframe];
    if ( fr.i ) {
        loadIFrame(table, rowcaches, fr, width, height);
    } else {
        loadPFrame(table, rowcaches, fr, width, height);
    }
    handleCursor(table, rowcaches.b, curpos, fr.x, fr.y);
    nextframe++;
    if ( timeline.length > nextframe ) {
        var wait = timeadd + timeline[nextframe].t - (new Date).getTime()/1000;
        if ( wait < 0 ) {
            // we're out of date! try to catch up.
            return animateNextFrame(holder);
        } else {
            setTimeout(function(){animateNextFrame(holder);}, wait*1000);
        }
    }
}};

/**
 * Fills an array with default characters.
 *
 * @param ch: The fill character
 * @param wid: The terminal width
 * @param hei: The terminal height
 * @return: An array of terminal rows. Each row is a simple string, filled
 *          with the specified fill character <ch>
 */
var makeCache = function(ch, wid, hei) {
    var c = [];
    for (var y = 0; y < hei; y++) {
        c.push( repeatString(ch, wid) );
    }
    return c;
};

/**
 * Load a TTY Session into an HTML elemen
 *
 * @param elem: The DOM node into which the session should be loaded
 * @param data: The object which contains the the terminal session data (can
 *              be loaded via showTTYURL)
 */
showTTY = function (elem, data) {

    // make sure the element is empty
    while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
    }

    var width = data.width;
    var height = data.height;
    var timeline = data.timeline;

    var table = makeTable(width, height);
    elem.appendChild(table.elem);

    var holder = {
        'width': width,
        'height': height,
        'timeline': timeline,
        'table': table,
        'nextframe': 0,
        'time': 0,
        'rowcaches': {
            'd': makeCache(" ", width, height),
            'f': makeCache("7", width, height),
            'b': makeCache("0", width, height),
            'B': makeCache("0", width, height),
            'U': makeCache("0", width, height)
        },
        'curpos': [1,1],
        'timeadd': (new Date).getTime()/1000-timeline[0].t
      };

    animateNextFrame(holder);
};

/**
 * Load the TTY session data from a remote URL.
 *
 * The URL will be fetched via XMLHttpRequest
 *
 * @param elem: The DOM node into which the session should be loaded
 * @param url: The URL which contains the JSON data of the terminal session
 */
showTTYURL = function (elem, url) {
    var showText = function (text) {
        while ( elem.firstChild ) {
            elem.removeChild( elem.firstChild );
        }
        elem.appendChild( document.createTextNode( text ) );
    };

    showText("Loading " + url);

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = function () {
        if ( req.readyState == 4 && req.status == 200 ) {
            var data = eval("(" + req.responseText + ")");
            if ( typeof data == "undefined" ) {
                showText("Error: didn't get tty data from " + url);
                req = null;
                return;
            }
            showTTY(elem, data);
        } else if ( req.readyState == 4 && req.status != 200 ) {
            showText("Error: couldn't retrieve " + url + ", got status code " + this.status);
            req = null;
        }
    };
    req.send(null);
};

}());
