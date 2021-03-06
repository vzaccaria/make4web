/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
(function( window, undefined ) {
var
        // A central reference to the root jQuery(document)
        rootjQuery,

        // The deferred used on DOM ready
        readyList,

        // Use the correct document accordingly with window argument (sandbox)
        document = window.document,
        location = window.location,
        navigator = window.navigator,

        // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,

        // Map over the $ in case of overwrite
        _$ = window.$,

        // Save a reference to some core methods
        core_push = Array.prototype.push,
        core_slice = Array.prototype.slice,
        core_indexOf = Array.prototype.indexOf,
        core_toString = Object.prototype.toString,
        core_hasOwn = Object.prototype.hasOwnProperty,
        core_trim = String.prototype.trim,

        // Define a local copy of jQuery
        jQuery = function( selector, context ) {
                // The jQuery object is actually just the init constructor 'enhanced'
                return new jQuery.fn.init( selector, context, rootjQuery );
        },

        // Used for matching numbers
        core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

        // Used for detecting and trimming whitespace
        core_rnotwhite = /\S/,
        core_rspace = /\s+/,

        // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        // A simple way to check for HTML strings
        // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
        rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

        // Match a standalone tag
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

        // JSON RegExp
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

        // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,

        // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function( all, letter ) {
                return ( letter + "" ).toUpperCase();
        },

        // The ready event handler and self cleanup method
        DOMContentLoaded = function() {
                if ( document.addEventListener ) {
                        document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                        jQuery.ready();
                } else if ( document.readyState === "complete" ) {
                        // we're here because readyState === "complete" in oldIE
                        // which is good enough for us to call the dom ready!
                        document.detachEvent( "onreadystatechange", DOMContentLoaded );
                        jQuery.ready();
                }
        },

        // [[Class]] -> type pairs
        class2type = {};

jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        init: function( selector, context, rootjQuery ) {
                var match, elem, ret, doc;

                // Handle $(""), $(null), $(undefined), $(false)
                if ( !selector ) {
                        return this;
                }

                // Handle $(DOMElement)
                if ( selector.nodeType ) {
                        this.context = this[0] = selector;
                        this.length = 1;
                        return this;
                }

                // Handle HTML strings
                if ( typeof selector === "string" ) {
                        if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                                // Assume that strings that start and end with <> are HTML and skip the regex check
                                match = [ null, selector, null ];

                        } else {
                                match = rquickExpr.exec( selector );
                        }

                        // Match html or make sure no context is specified for #id
                        if ( match && (match[1] || !context) ) {

                                // HANDLE: $(html) -> $(array)
                                if ( match[1] ) {
                                        context = context instanceof jQuery ? context[0] : context;
                                        doc = ( context && context.nodeType ? context.ownerDocument || context : document );

                                        // scripts is true for back-compat
                                        selector = jQuery.parseHTML( match[1], doc, true );
                                        if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
                                                this.attr.call( selector, context, true );
                                        }

                                        return jQuery.merge( this, selector );

                                // HANDLE: $(#id)
                                } else {
                                        elem = document.getElementById( match[2] );

                                        // Check parentNode to catch when Blackberry 4.6 returns
                                        // nodes that are no longer in the document #6963
                                        if ( elem && elem.parentNode ) {
                                                // Handle the case where IE and Opera return items
                                                // by name instead of ID
                                                if ( elem.id !== match[2] ) {
                                                        return rootjQuery.find( selector );
                                                }

                                                // Otherwise, we inject the element directly into the jQuery object
                                                this.length = 1;
                                                this[0] = elem;
                                        }

                                        this.context = document;
                                        this.selector = selector;
                                        return this;
                                }

                        // HANDLE: $(expr, $(...))
                        } else if ( !context || context.jquery ) {
                                return ( context || rootjQuery ).find( selector );

                        // HANDLE: $(expr, context)
                        // (which is just equivalent to: $(context).find(expr)
                        } else {
                                return this.constructor( context ).find( selector );
                        }

                // HANDLE: $(function)
                // Shortcut for document ready
                } else if ( jQuery.isFunction( selector ) ) {
                        return rootjQuery.ready( selector );
                }

                if ( selector.selector !== undefined ) {
                        this.selector = selector.selector;
                        this.context = selector.context;
                }

                return jQuery.makeArray( selector, this );
        },

        // Start with an empty selector
        selector: "",

        // The current version of jQuery being used
        jquery: "1.8.3",

        // The default length of a jQuery object is 0
        length: 0,

        // The number of elements contained in the matched element set
        size: function() {
                return this.length;
        },

        toArray: function() {
                return core_slice.call( this );
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function( num ) {
                return num == null ?

                        // Return a 'clean' array
                        this.toArray() :

                        // Return just the object
                        ( num < 0 ? this[ this.length + num ] : this[ num ] );
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function( elems, name, selector ) {

                // Build a new jQuery matched element set
                var ret = jQuery.merge( this.constructor(), elems );

                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;

                ret.context = this.context;

                if ( name === "find" ) {
                        ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
                } else if ( name ) {
                        ret.selector = this.selector + "." + name + "(" + selector + ")";
                }

                // Return the newly-formed element set
                return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function( callback, args ) {
                return jQuery.each( this, callback, args );
        },

        ready: function( fn ) {
                // Add the callback
                jQuery.ready.promise().done( fn );

                return this;
        },

        eq: function( i ) {
                i = +i;
                return i === -1 ?
                        this.slice( i ) :
                        this.slice( i, i + 1 );
        },

        first: function() {
                return this.eq( 0 );
        },

        last: function() {
                return this.eq( -1 );
        },

        slice: function() {
                return this.pushStack( core_slice.apply( this, arguments ),
                        "slice", core_slice.call(arguments).join(",") );
        },

        map: function( callback ) {
                return this.pushStack( jQuery.map(this, function( elem, i ) {
                        return callback.call( elem, i, elem );
                }));
        },

        end: function() {
                return this.prevObject || this.constructor(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: core_push,
        sort: [].sort,
        splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
                target = {};
        }

        // extend jQuery itself if only one argument is passed
        if ( length === i ) {
                target = this;
                --i;
        }

        for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null ) {
                        // Extend the base object
                        for ( name in options ) {
                                src = target[ name ];
                                copy = options[ name ];

                                // Prevent never-ending loop
                                if ( target === copy ) {
                                        continue;
                                }

                                // Recurse if we're merging plain objects or arrays
                                if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                                        if ( copyIsArray ) {
                                                copyIsArray = false;
                                                clone = src && jQuery.isArray(src) ? src : [];

                                        } else {
                                                clone = src && jQuery.isPlainObject(src) ? src : {};
                                        }

                                        // Never move original objects, clone them
                                        target[ name ] = jQuery.extend( deep, clone, copy );

                                // Don't bring in undefined values
                                } else if ( copy !== undefined ) {
                                        target[ name ] = copy;
                                }
                        }
                }
        }

        // Return the modified object
        return target;
};

jQuery.extend({
        noConflict: function( deep ) {
                if ( window.$ === jQuery ) {
                        window.$ = _$;
                }

                if ( deep && window.jQuery === jQuery ) {
                        window.jQuery = _jQuery;
                }

                return jQuery;
        },

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Hold (or release) the ready event
        holdReady: function( hold ) {
                if ( hold ) {
                        jQuery.readyWait++;
                } else {
                        jQuery.ready( true );
                }
        },

        // Handle when the DOM is ready
        ready: function( wait ) {

                // Abort if there are pending holds or we're already ready
                if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
                        return;
                }

                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if ( !document.body ) {
                        return setTimeout( jQuery.ready, 1 );
                }

                // Remember that the DOM is ready
                jQuery.isReady = true;

                // If a normal DOM Ready event fired, decrement, and wait if need be
                if ( wait !== true && --jQuery.readyWait > 0 ) {
                        return;
                }

                // If there are functions bound, to execute
                readyList.resolveWith( document, [ jQuery ] );

                // Trigger any bound ready events
                if ( jQuery.fn.trigger ) {
                        jQuery( document ).trigger("ready").off("ready");
                }
        },

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function( obj ) {
                return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray || function( obj ) {
                return jQuery.type(obj) === "array";
        },

        isWindow: function( obj ) {
                return obj != null && obj == obj.window;
        },

        isNumeric: function( obj ) {
                return !isNaN( parseFloat(obj) ) && isFinite( obj );
        },

        type: function( obj ) {
                return obj == null ?
                        String( obj ) :
                        class2type[ core_toString.call(obj) ] || "object";
        },

        isPlainObject: function( obj ) {
                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
                        return false;
                }

                try {
                        // Not own constructor property must be Object
                        if ( obj.constructor &&
                                !core_hasOwn.call(obj, "constructor") &&
                                !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                                return false;
                        }
                } catch ( e ) {
                        // IE8,9 Will throw exceptions on certain host objects #9897
                        return false;
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.

                var key;
                for ( key in obj ) {}

                return key === undefined || core_hasOwn.call( obj, key );
        },

        isEmptyObject: function( obj ) {
                var name;
                for ( name in obj ) {
                        return false;
                }
                return true;
        },

        error: function( msg ) {
                throw new Error( msg );
        },

        // data: string of html
        // context (optional): If specified, the fragment will be created in this context, defaults to document
        // scripts (optional): If true, will include scripts passed in the html string
        parseHTML: function( data, context, scripts ) {
                var parsed;
                if ( !data || typeof data !== "string" ) {
                        return null;
                }
                if ( typeof context === "boolean" ) {
                        scripts = context;
                        context = 0;
                }
                context = context || document;

                // Single tag
                if ( (parsed = rsingleTag.exec( data )) ) {
                        return [ context.createElement( parsed[1] ) ];
                }

                parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
                return jQuery.merge( [],
                        (parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
        },

        parseJSON: function( data ) {
                if ( !data || typeof data !== "string") {
                        return null;
                }

                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = jQuery.trim( data );

                // Attempt to parse using the native JSON parser first
                if ( window.JSON && window.JSON.parse ) {
                        return window.JSON.parse( data );
                }

                // Make sure the incoming data is actual JSON
                // Logic borrowed from http://json.org/json2.js
                if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                        .replace( rvalidtokens, "]" )
                        .replace( rvalidbraces, "")) ) {

                        return ( new Function( "return " + data ) )();

                }
                jQuery.error( "Invalid JSON: " + data );
        },

        // Cross-browser xml parsing
        parseXML: function( data ) {
                var xml, tmp;
                if ( !data || typeof data !== "string" ) {
                        return null;
                }
                try {
                        if ( window.DOMParser ) { // Standard
                                tmp = new DOMParser();
                                xml = tmp.parseFromString( data , "text/xml" );
                        } else { // IE
                                xml = new ActiveXObject( "Microsoft.XMLDOM" );
                                xml.async = "false";
                                xml.loadXML( data );
                        }
                } catch( e ) {
                        xml = undefined;
                }
                if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
                        jQuery.error( "Invalid XML: " + data );
                }
                return xml;
        },

        noop: function() {},

        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function( data ) {
                if ( data && core_rnotwhite.test( data ) ) {
                        // We use execScript on Internet Explorer
                        // We use an anonymous function so that context is window
                        // rather than jQuery in Firefox
                        ( window.execScript || function( data ) {
                                window[ "eval" ].call( window, data );
                        } )( data );
                }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function( string ) {
                return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
        },

        nodeName: function( elem, name ) {
                return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        // args is for internal usage only
        each: function( obj, callback, args ) {
                var name,
                        i = 0,
                        length = obj.length,
                        isObj = length === undefined || jQuery.isFunction( obj );

                if ( args ) {
                        if ( isObj ) {
                                for ( name in obj ) {
                                        if ( callback.apply( obj[ name ], args ) === false ) {
                                                break;
                                        }
                                }
                        } else {
                                for ( ; i < length; ) {
                                        if ( callback.apply( obj[ i++ ], args ) === false ) {
                                                break;
                                        }
                                }
                        }

                // A special, fast, case for the most common use of each
                } else {
                        if ( isObj ) {
                                for ( name in obj ) {
                                        if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
                                                break;
                                        }
                                }
                        } else {
                                for ( ; i < length; ) {
                                        if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
                                                break;
                                        }
                                }
                        }
                }

                return obj;
        },

        // Use native String.trim function wherever possible
        trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
                function( text ) {
                        return text == null ?
                                "" :
                                core_trim.call( text );
                } :

                // Otherwise use our own trimming functionality
                function( text ) {
                        return text == null ?
                                "" :
                                ( text + "" ).replace( rtrim, "" );
                },

        // results is for internal usage only
        makeArray: function( arr, results ) {
                var type,
                        ret = results || [];

                if ( arr != null ) {
                        // The window, strings (and functions) also have 'length'
                        // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                        type = jQuery.type( arr );

                        if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
                                core_push.call( ret, arr );
                        } else {
                                jQuery.merge( ret, arr );
                        }
                }

                return ret;
        },

        inArray: function( elem, arr, i ) {
                var len;

                if ( arr ) {
                        if ( core_indexOf ) {
                                return core_indexOf.call( arr, elem, i );
                        }

                        len = arr.length;
                        i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

                        for ( ; i < len; i++ ) {
                                // Skip accessing in sparse arrays
                                if ( i in arr && arr[ i ] === elem ) {
                                        return i;
                                }
                        }
                }

                return -1;
        },

        merge: function( first, second ) {
                var l = second.length,
                        i = first.length,
                        j = 0;

                if ( typeof l === "number" ) {
                        for ( ; j < l; j++ ) {
                                first[ i++ ] = second[ j ];
                        }

                } else {
                        while ( second[j] !== undefined ) {
                                first[ i++ ] = second[ j++ ];
                        }
                }

                first.length = i;

                return first;
        },

        grep: function( elems, callback, inv ) {
                var retVal,
                        ret = [],
                        i = 0,
                        length = elems.length;
                inv = !!inv;

                // Go through the array, only saving the items
                // that pass the validator function
                for ( ; i < length; i++ ) {
                        retVal = !!callback( elems[ i ], i );
                        if ( inv !== retVal ) {
                                ret.push( elems[ i ] );
                        }
                }

                return ret;
        },

        // arg is for internal usage only
        map: function( elems, callback, arg ) {
                var value, key,
                        ret = [],
                        i = 0,
                        length = elems.length,
                        // jquery objects are treated as arrays
                        isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

                // Go through the array, translating each of the items to their
                if ( isArray ) {
                        for ( ; i < length; i++ ) {
                                value = callback( elems[ i ], i, arg );

                                if ( value != null ) {
                                        ret[ ret.length ] = value;
                                }
                        }

                // Go through every key on the object,
                } else {
                        for ( key in elems ) {
                                value = callback( elems[ key ], key, arg );

                                if ( value != null ) {
                                        ret[ ret.length ] = value;
                                }
                        }
                }

                // Flatten any nested arrays
                return ret.concat.apply( [], ret );
        },

        // A global GUID counter for objects
        guid: 1,

        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function( fn, context ) {
                var tmp, args, proxy;

                if ( typeof context === "string" ) {
                        tmp = fn[ context ];
                        context = fn;
                        fn = tmp;
                }

                // Quick check to determine if target is callable, in the spec
                // this throws a TypeError, but we will just return undefined.
                if ( !jQuery.isFunction( fn ) ) {
                        return undefined;
                }

                // Simulated bind
                args = core_slice.call( arguments, 2 );
                proxy = function() {
                        return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
                };

                // Set the guid of unique handler to the same of original handler, so it can be removed
                proxy.guid = fn.guid = fn.guid || jQuery.guid++;

                return proxy;
        },

        // Multifunctional method to get and set values of a collection
        // The value/s can optionally be executed if it's a function
        access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
                var exec,
                        bulk = key == null,
                        i = 0,
                        length = elems.length;

                // Sets many values
                if ( key && typeof key === "object" ) {
                        for ( i in key ) {
                                jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
                        }
                        chainable = 1;

                // Sets one value
                } else if ( value !== undefined ) {
                        // Optionally, function values get executed if exec is true
                        exec = pass === undefined && jQuery.isFunction( value );

                        if ( bulk ) {
                                // Bulk operations only iterate when executing function values
                                if ( exec ) {
                                        exec = fn;
                                        fn = function( elem, key, value ) {
                                                return exec.call( jQuery( elem ), value );
                                        };

                                // Otherwise they run against the entire set
                                } else {
                                        fn.call( elems, value );
                                        fn = null;
                                }
                        }

                        if ( fn ) {
                                for (; i < length; i++ ) {
                                        fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
                                }
                        }

                        chainable = 1;
                }

                return chainable ?
                        elems :

                        // Gets
                        bulk ?
                                fn.call( elems ) :
                                length ? fn( elems[0], key ) : emptyGet;
        },

        now: function() {
                return ( new Date() ).getTime();
        }
});

jQuery.ready.promise = function( obj ) {
        if ( !readyList ) {

                readyList = jQuery.Deferred();

                // Catch cases where $(document).ready() is called after the browser event has already occurred.
                // we once tried to use readyState "interactive" here, but it caused issues like the one
                // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
                if ( document.readyState === "complete" ) {
                        // Handle it asynchronously to allow scripts the opportunity to delay ready
                        setTimeout( jQuery.ready, 1 );

                // Standards-based browsers support DOMContentLoaded
                } else if ( document.addEventListener ) {
                        // Use the handy event callback
                        document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

                        // A fallback to window.onload, that will always work
                        window.addEventListener( "load", jQuery.ready, false );

                // If IE event model is used
                } else {
                        // Ensure firing before onload, maybe late but safe also for iframes
                        document.attachEvent( "onreadystatechange", DOMContentLoaded );

                        // A fallback to window.onload, that will always work
                        window.attachEvent( "onload", jQuery.ready );

                        // If IE and not a frame
                        // continually check to see if the document is ready
                        var top = false;

                        try {
                                top = window.frameElement == null && document.documentElement;
                        } catch(e) {}

                        if ( top && top.doScroll ) {
                                (function doScrollCheck() {
                                        if ( !jQuery.isReady ) {

                                                try {
                                                        // Use the trick by Diego Perini
                                                        // http://javascript.nwbox.com/IEContentLoaded/
                                                        top.doScroll("left");
                                                } catch(e) {
                                                        return setTimeout( doScrollCheck, 50 );
                                                }

                                                // and execute any waiting functions
                                                jQuery.ready();
                                        }
                                })();
                        }
                }
        }
        return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
        var object = optionsCache[ options ] = {};
        jQuery.each( options.split( core_rspace ), function( _, flag ) {
                object[ flag ] = true;
        });
        return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *      options: an optional list of space-separated options that will change how
 *                      the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *      once:                   will ensure the callback list can only be fired once (like a Deferred)
 *
 *      memory:                 will keep track of previous values and will call any callback added
 *                                      after the list has been fired right away with the latest "memorized"
 *                                      values (like a Deferred)
 *
 *      unique:                 will ensure a callback can only be added once (no duplicate in the list)
 *
 *      stopOnFalse:    interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
                ( optionsCache[ options ] || createOptions( options ) ) :
                jQuery.extend( {}, options );

        var // Last fire value (for non-forgettable lists)
                memory,
                // Flag to know if list was already fired
                fired,
                // Flag to know if list is currently firing
                firing,
                // First callback to fire (used internally by add and fireWith)
                firingStart,
                // End of the loop when firing
                firingLength,
                // Index of currently firing callback (modified by remove if needed)
                firingIndex,
                // Actual callback list
                list = [],
                // Stack of fire calls for repeatable lists
                stack = !options.once && [],
                // Fire callbacks
                fire = function( data ) {
                        memory = options.memory && data;
                        fired = true;
                        firingIndex = firingStart || 0;
                        firingStart = 0;
                        firingLength = list.length;
                        firing = true;
                        for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                                if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
                                        memory = false; // To prevent further calls using add
                                        break;
                                }
                        }
                        firing = false;
                        if ( list ) {
                                if ( stack ) {
                                        if ( stack.length ) {
                                                fire( stack.shift() );
                                        }
                                } else if ( memory ) {
                                        list = [];
                                } else {
                                        self.disable();
                                }
                        }
                },
                // Actual Callbacks object
                self = {
                        // Add a callback or a collection of callbacks to the list
                        add: function() {
                                if ( list ) {
                                        // First, we save the current length
                                        var start = list.length;
                                        (function add( args ) {
                                                jQuery.each( args, function( _, arg ) {
                                                        var type = jQuery.type( arg );
                                                        if ( type === "function" ) {
                                                                if ( !options.unique || !self.has( arg ) ) {
                                                                        list.push( arg );
                                                                }
                                                        } else if ( arg && arg.length && type !== "string" ) {
                                                                // Inspect recursively
                                                                add( arg );
                                                        }
                                                });
                                        })( arguments );
                                        // Do we need to add the callbacks to the
                                        // current firing batch?
                                        if ( firing ) {
                                                firingLength = list.length;
                                        // With memory, if we're not firing then
                                        // we should call right away
                                        } else if ( memory ) {
                                                firingStart = start;
                                                fire( memory );
                                        }
                                }
                                return this;
                        },
                        // Remove a callback from the list
                        remove: function() {
                                if ( list ) {
                                        jQuery.each( arguments, function( _, arg ) {
                                                var index;
                                                while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                                                        list.splice( index, 1 );
                                                        // Handle firing indexes
                                                        if ( firing ) {
                                                                if ( index <= firingLength ) {
                                                                        firingLength--;
                                                                }
                                                                if ( index <= firingIndex ) {
                                                                        firingIndex--;
                                                                }
                                                        }
                                                }
                                        });
                                }
                                return this;
                        },
                        // Control if a given callback is in the list
                        has: function( fn ) {
                                return jQuery.inArray( fn, list ) > -1;
                        },
                        // Remove all callbacks from the list
                        empty: function() {
                                list = [];
                                return this;
                        },
                        // Have the list do nothing anymore
                        disable: function() {
                                list = stack = memory = undefined;
                                return this;
                        },
                        // Is it disabled?
                        disabled: function() {
                                return !list;
                        },
                        // Lock the list in its current state
                        lock: function() {
                                stack = undefined;
                                if ( !memory ) {
                                        self.disable();
                                }
                                return this;
                        },
                        // Is it locked?
                        locked: function() {
                                return !stack;
                        },
                        // Call all callbacks with the given context and arguments
                        fireWith: function( context, args ) {
                                args = args || [];
                                args = [ context, args.slice ? args.slice() : args ];
                                if ( list && ( !fired || stack ) ) {
                                        if ( firing ) {
                                                stack.push( args );
                                        } else {
                                                fire( args );
                                        }
                                }
                                return this;
                        },
                        // Call all the callbacks with the given arguments
                        fire: function() {
                                self.fireWith( this, arguments );
                                return this;
                        },
                        // To know if the callbacks have already been called at least once
                        fired: function() {
                                return !!fired;
                        }
                };

        return self;
};
jQuery.extend({

        Deferred: function( func ) {
                var tuples = [
                                // action, add listener, listener list, final state
                                [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
                                [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
                                [ "notify", "progress", jQuery.Callbacks("memory") ]
                        ],
                        state = "pending",
                        promise = {
                                state: function() {
                                        return state;
                                },
                                always: function() {
                                        deferred.done( arguments ).fail( arguments );
                                        return this;
                                },
                                then: function( /* fnDone, fnFail, fnProgress */ ) {
                                        var fns = arguments;
                                        return jQuery.Deferred(function( newDefer ) {
                                                jQuery.each( tuples, function( i, tuple ) {
                                                        var action = tuple[ 0 ],
                                                                fn = fns[ i ];
                                                        // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                                        deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
                                                                function() {
                                                                        var returned = fn.apply( this, arguments );
                                                                        if ( returned && jQuery.isFunction( returned.promise ) ) {
                                                                                returned.promise()
                                                                                        .done( newDefer.resolve )
                                                                                        .fail( newDefer.reject )
                                                                                        .progress( newDefer.notify );
                                                                        } else {
                                                                                newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                                                                        }
                                                                } :
                                                                newDefer[ action ]
                                                        );
                                                });
                                                fns = null;
                                        }).promise();
                                },
                                // Get a promise for this deferred
                                // If obj is provided, the promise aspect is added to the object
                                promise: function( obj ) {
                                        return obj != null ? jQuery.extend( obj, promise ) : promise;
                                }
                        },
                        deferred = {};

                // Keep pipe for back-compat
                promise.pipe = promise.then;

                // Add list-specific methods
                jQuery.each( tuples, function( i, tuple ) {
                        var list = tuple[ 2 ],
                                stateString = tuple[ 3 ];

                        // promise[ done | fail | progress ] = list.add
                        promise[ tuple[1] ] = list.add;

                        // Handle state
                        if ( stateString ) {
                                list.add(function() {
                                        // state = [ resolved | rejected ]
                                        state = stateString;

                                // [ reject_list | resolve_list ].disable; progress_list.lock
                                }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
                        }

                        // deferred[ resolve | reject | notify ] = list.fire
                        deferred[ tuple[0] ] = list.fire;
                        deferred[ tuple[0] + "With" ] = list.fireWith;
                });

                // Make the deferred a promise
                promise.promise( deferred );

                // Call given func if any
                if ( func ) {
                        func.call( deferred, deferred );
                }

                // All done!
                return deferred;
        },

        // Deferred helper
        when: function( subordinate /* , ..., subordinateN */ ) {
                var i = 0,
                        resolveValues = core_slice.call( arguments ),
                        length = resolveValues.length,

                        // the count of uncompleted subordinates
                        remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

                        // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                        deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

                        // Update function for both resolve and progress values
                        updateFunc = function( i, contexts, values ) {
                                return function( value ) {
                                        contexts[ i ] = this;
                                        values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
                                        if( values === progressValues ) {
                                                deferred.notifyWith( contexts, values );
                                        } else if ( !( --remaining ) ) {
                                                deferred.resolveWith( contexts, values );
                                        }
                                };
                        },

                        progressValues, progressContexts, resolveContexts;

                // add listeners to Deferred subordinates; treat others as resolved
                if ( length > 1 ) {
                        progressValues = new Array( length );
                        progressContexts = new Array( length );
                        resolveContexts = new Array( length );
                        for ( ; i < length; i++ ) {
                                if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
                                        resolveValues[ i ].promise()
                                                .done( updateFunc( i, resolveContexts, resolveValues ) )
                                                .fail( deferred.reject )
                                                .progress( updateFunc( i, progressContexts, progressValues ) );
                                } else {
                                        --remaining;
                                }
                        }
                }

                // if we're not waiting on anything, resolve the master
                if ( !remaining ) {
                        deferred.resolveWith( resolveContexts, resolveValues );
                }

                return deferred.promise();
        }
});
jQuery.support = (function() {

        var support,
                all,
                a,
                select,
                opt,
                input,
                fragment,
                eventName,
                i,
                isSupported,
                clickFn,
                div = document.createElement("div");

        // Setup
        div.setAttribute( "className", "t" );
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

        // Support tests won't run in some limited or non-browser environments
        all = div.getElementsByTagName("*");
        a = div.getElementsByTagName("a")[ 0 ];
        if ( !all || !a || !all.length ) {
                return {};
        }

        // First batch of tests
        select = document.createElement("select");
        opt = select.appendChild( document.createElement("option") );
        input = div.getElementsByTagName("input")[ 0 ];

        a.style.cssText = "top:1px;float:left;opacity:.5";
        support = {
                // IE strips leading whitespace when .innerHTML is used
                leadingWhitespace: ( div.firstChild.nodeType === 3 ),

                // Make sure that tbody elements aren't automatically inserted
                // IE will insert them into empty tables
                tbody: !div.getElementsByTagName("tbody").length,

                // Make sure that link elements get serialized correctly by innerHTML
                // This requires a wrapper element in IE
                htmlSerialize: !!div.getElementsByTagName("link").length,

                // Get the style information from getAttribute
                // (IE uses .cssText instead)
                style: /top/.test( a.getAttribute("style") ),

                // Make sure that URLs aren't manipulated
                // (IE normalizes it by default)
                hrefNormalized: ( a.getAttribute("href") === "/a" ),

                // Make sure that element opacity exists
                // (IE uses filter instead)
                // Use a regex to work around a WebKit issue. See #5145
                opacity: /^0.5/.test( a.style.opacity ),

                // Verify style float existence
                // (IE uses styleFloat instead of cssFloat)
                cssFloat: !!a.style.cssFloat,

                // Make sure that if no value is specified for a checkbox
                // that it defaults to "on".
                // (WebKit defaults to "" instead)
                checkOn: ( input.value === "on" ),

                // Make sure that a selected-by-default option has a working selected property.
                // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
                optSelected: opt.selected,

                // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
                getSetAttribute: div.className !== "t",

                // Tests for enctype support on a form (#6743)
                enctype: !!document.createElement("form").enctype,

                // Makes sure cloning an html5 element does not cause problems
                // Where outerHTML is undefined, this still works
                html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

                // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
                boxModel: ( document.compatMode === "CSS1Compat" ),

                // Will be defined later
                submitBubbles: true,
                changeBubbles: true,
                focusinBubbles: false,
                deleteExpando: true,
                noCloneEvent: true,
                inlineBlockNeedsLayout: false,
                shrinkWrapBlocks: false,
                reliableMarginRight: true,
                boxSizingReliable: true,
                pixelPosition: false
        };

        // Make sure checked status is properly cloned
        input.checked = true;
        support.noCloneChecked = input.cloneNode( true ).checked;

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Test to see if it's possible to delete an expando from an element
        // Fails in Internet Explorer
        try {
                delete div.test;
        } catch( e ) {
                support.deleteExpando = false;
        }

        if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
                div.attachEvent( "onclick", clickFn = function() {
                        // Cloning a node shouldn't copy over any
                        // bound event handlers (IE does this)
                        support.noCloneEvent = false;
                });
                div.cloneNode( true ).fireEvent("onclick");
                div.detachEvent( "onclick", clickFn );
        }

        // Check if a radio maintains its value
        // after being appended to the DOM
        input = document.createElement("input");
        input.value = "t";
        input.setAttribute( "type", "radio" );
        support.radioValue = input.value === "t";

        input.setAttribute( "checked", "checked" );

        // #11217 - WebKit loses check when the name is after the checked attribute
        input.setAttribute( "name", "t" );

        div.appendChild( input );
        fragment = document.createDocumentFragment();
        fragment.appendChild( div.lastChild );

        // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

        // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        support.appendChecked = input.checked;

        fragment.removeChild( input );
        fragment.appendChild( div );

        // Technique from Juriy Zaytsev
        // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
        // We only care about the case where non-standard event systems
        // are used, namely in IE. Short-circuiting here helps us to
        // avoid an eval call (in setAttribute) which can cause CSP
        // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
        if ( div.attachEvent ) {
                for ( i in {
                        submit: true,
                        change: true,
                        focusin: true
                }) {
                        eventName = "on" + i;
                        isSupported = ( eventName in div );
                        if ( !isSupported ) {
                                div.setAttribute( eventName, "return;" );
                                isSupported = ( typeof div[ eventName ] === "function" );
                        }
                        support[ i + "Bubbles" ] = isSupported;
                }
        }

        // Run tests that need a body at doc ready
        jQuery(function() {
                var container, div, tds, marginDiv,
                        divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
                        body = document.getElementsByTagName("body")[0];

                if ( !body ) {
                        // Return for frameset docs that don't have a body
                        return;
                }

                container = document.createElement("div");
                container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
                body.insertBefore( container, body.firstChild );

                // Construct the test element
                div = document.createElement("div");
                container.appendChild( div );

                // Check if table cells still have offsetWidth/Height when they are set
                // to display:none and there are still other visible table cells in a
                // table row; if so, offsetWidth/Height are not reliable for use when
                // determining if an element has been hidden directly using
                // display:none (it is still safe to use offsets if a parent element is
                // hidden; don safety goggles and see bug #4512 for more information).
                // (only IE 8 fails this test)
                div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
                tds = div.getElementsByTagName("td");
                tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
                isSupported = ( tds[ 0 ].offsetHeight === 0 );

                tds[ 0 ].style.display = "";
                tds[ 1 ].style.display = "none";

                // Check if empty table cells still have offsetWidth/Height
                // (IE <= 8 fail this test)
                support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

                // Check box-sizing and margin behavior
                div.innerHTML = "";
                div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
                support.boxSizing = ( div.offsetWidth === 4 );
                support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

                // NOTE: To any future maintainer, we've window.getComputedStyle
                // because jsdom on node.js will break without it.
                if ( window.getComputedStyle ) {
                        support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
                        support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

                        // Check if div with explicit width and no margin-right incorrectly
                        // gets computed margin-right based on width of container. For more
                        // info see bug #3333
                        // Fails in WebKit before Feb 2011 nightlies
                        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                        marginDiv = document.createElement("div");
                        marginDiv.style.cssText = div.style.cssText = divReset;
                        marginDiv.style.marginRight = marginDiv.style.width = "0";
                        div.style.width = "1px";
                        div.appendChild( marginDiv );
                        support.reliableMarginRight =
                                !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
                }

                if ( typeof div.style.zoom !== "undefined" ) {
                        // Check if natively block-level elements act like inline-block
                        // elements when setting their display to 'inline' and giving
                        // them layout
                        // (IE < 8 does this)
                        div.innerHTML = "";
                        div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
                        support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

                        // Check if elements with layout shrink-wrap their children
                        // (IE 6 does this)
                        div.style.display = "block";
                        div.style.overflow = "visible";
                        div.innerHTML = "<div></div>";
                        div.firstChild.style.width = "5px";
                        support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

                        container.style.zoom = 1;
                }

                // Null elements to avoid leaks in IE
                body.removeChild( container );
                container = div = tds = marginDiv = null;
        });

        // Null elements to avoid leaks in IE
        fragment.removeChild( div );
        all = a = select = opt = input = fragment = div = null;

        return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rmultiDash = /([A-Z])/g;

jQuery.extend({
        cache: {},

        deletedIds: [],

        // Remove at next major release (1.9/2.0)
        uuid: 0,

        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
                "embed": true,
                // Ban all objects except for Flash (which handle expandos)
                "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                "applet": true
        },

        hasData: function( elem ) {
                elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
                return !!elem && !isEmptyDataObject( elem );
        },

        data: function( elem, name, data, pvt /* Internal Use Only */ ) {
                if ( !jQuery.acceptData( elem ) ) {
                        return;
                }

                var thisCache, ret,
                        internalKey = jQuery.expando,
                        getByName = typeof name === "string",

                        // We have to handle DOM nodes and JS objects differently because IE6-7
                        // can't GC object references properly across the DOM-JS boundary
                        isNode = elem.nodeType,

                        // Only DOM nodes need the global jQuery cache; JS object data is
                        // attached directly to the object so GC can occur automatically
                        cache = isNode ? jQuery.cache : elem,

                        // Only defining an ID for JS objects if its cache already exists allows
                        // the code to shortcut on the same path as a DOM node with no cache
                        id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

                // Avoid doing any more work than we need to when trying to get data on an
                // object that has no data at all
                if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
                        return;
                }

                if ( !id ) {
                        // Only DOM nodes need a new unique ID for each element since their data
                        // ends up in the global cache
                        if ( isNode ) {
                                elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
                        } else {
                                id = internalKey;
                        }
                }

                if ( !cache[ id ] ) {
                        cache[ id ] = {};

                        // Avoids exposing jQuery metadata on plain JS objects when the object
                        // is serialized using JSON.stringify
                        if ( !isNode ) {
                                cache[ id ].toJSON = jQuery.noop;
                        }
                }

                // An object can be passed to jQuery.data instead of a key/value pair; this gets
                // shallow copied over onto the existing cache
                if ( typeof name === "object" || typeof name === "function" ) {
                        if ( pvt ) {
                                cache[ id ] = jQuery.extend( cache[ id ], name );
                        } else {
                                cache[ id ].data = jQuery.extend( cache[ id ].data, name );
                        }
                }

                thisCache = cache[ id ];

                // jQuery data() is stored in a separate object inside the object's internal data
                // cache in order to avoid key collisions between internal data and user-defined
                // data.
                if ( !pvt ) {
                        if ( !thisCache.data ) {
                                thisCache.data = {};
                        }

                        thisCache = thisCache.data;
                }

                if ( data !== undefined ) {
                        thisCache[ jQuery.camelCase( name ) ] = data;
                }

                // Check for both converted-to-camel and non-converted data property names
                // If a data property was specified
                if ( getByName ) {

                        // First Try to find as-is property data
                        ret = thisCache[ name ];

                        // Test for null|undefined property data
                        if ( ret == null ) {

                                // Try to find the camelCased property
                                ret = thisCache[ jQuery.camelCase( name ) ];
                        }
                } else {
                        ret = thisCache;
                }

                return ret;
        },

        removeData: function( elem, name, pvt /* Internal Use Only */ ) {
                if ( !jQuery.acceptData( elem ) ) {
                        return;
                }

                var thisCache, i, l,

                        isNode = elem.nodeType,

                        // See jQuery.data for more information
                        cache = isNode ? jQuery.cache : elem,
                        id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

                // If there is already no cache entry for this object, there is no
                // purpose in continuing
                if ( !cache[ id ] ) {
                        return;
                }

                if ( name ) {

                        thisCache = pvt ? cache[ id ] : cache[ id ].data;

                        if ( thisCache ) {

                                // Support array or space separated string names for data keys
                                if ( !jQuery.isArray( name ) ) {

                                        // try the string as a key before any manipulation
                                        if ( name in thisCache ) {
                                                name = [ name ];
                                        } else {

                                                // split the camel cased version by spaces unless a key with the spaces exists
                                                name = jQuery.camelCase( name );
                                                if ( name in thisCache ) {
                                                        name = [ name ];
                                                } else {
                                                        name = name.split(" ");
                                                }
                                        }
                                }

                                for ( i = 0, l = name.length; i < l; i++ ) {
                                        delete thisCache[ name[i] ];
                                }

                                // If there is no data left in the cache, we want to continue
                                // and let the cache object itself get destroyed
                                if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
                                        return;
                                }
                        }
                }

                // See jQuery.data for more information
                if ( !pvt ) {
                        delete cache[ id ].data;

                        // Don't destroy the parent cache unless the internal data object
                        // had been the only thing left in it
                        if ( !isEmptyDataObject( cache[ id ] ) ) {
                                return;
                        }
                }

                // Destroy the cache
                if ( isNode ) {
                        jQuery.cleanData( [ elem ], true );

                // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
                } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
                        delete cache[ id ];

                // When all else fails, null
                } else {
                        cache[ id ] = null;
                }
        },

        // For internal use only.
        _data: function( elem, name, data ) {
                return jQuery.data( elem, name, data, true );
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function( elem ) {
                var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

                // nodes accept data unless otherwise specified; rejection can be conditional
                return !noData || noData !== true && elem.getAttribute("classid") === noData;
        }
});

jQuery.fn.extend({
        data: function( key, value ) {
                var parts, part, attr, name, l,
                        elem = this[0],
                        i = 0,
                        data = null;

                // Gets all values
                if ( key === undefined ) {
                        if ( this.length ) {
                                data = jQuery.data( elem );

                                if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
                                        attr = elem.attributes;
                                        for ( l = attr.length; i < l; i++ ) {
                                                name = attr[i].name;

                                                if ( !name.indexOf( "data-" ) ) {
                                                        name = jQuery.camelCase( name.substring(5) );

                                                        dataAttr( elem, name, data[ name ] );
                                                }
                                        }
                                        jQuery._data( elem, "parsedAttrs", true );
                                }
                        }

                        return data;
                }

                // Sets multiple values
                if ( typeof key === "object" ) {
                        return this.each(function() {
                                jQuery.data( this, key );
                        });
                }

                parts = key.split( ".", 2 );
                parts[1] = parts[1] ? "." + parts[1] : "";
                part = parts[1] + "!";

                return jQuery.access( this, function( value ) {

                        if ( value === undefined ) {
                                data = this.triggerHandler( "getData" + part, [ parts[0] ] );

                                // Try to fetch any internally stored data first
                                if ( data === undefined && elem ) {
                                        data = jQuery.data( elem, key );
                                        data = dataAttr( elem, key, data );
                                }

                                return data === undefined && parts[1] ?
                                        this.data( parts[0] ) :
                                        data;
                        }

                        parts[1] = value;
                        this.each(function() {
                                var self = jQuery( this );

                                self.triggerHandler( "setData" + part, parts );
                                jQuery.data( this, key, value );
                                self.triggerHandler( "changeData" + part, parts );
                        });
                }, null, value, arguments.length > 1, null, false );
        },

        removeData: function( key ) {
                return this.each(function() {
                        jQuery.removeData( this, key );
                });
        }
});

function dataAttr( elem, key, data ) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if ( data === undefined && elem.nodeType === 1 ) {

                var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

                data = elem.getAttribute( name );

                if ( typeof data === "string" ) {
                        try {
                                data = data === "true" ? true :
                                data === "false" ? false :
                                data === "null" ? null :
                                // Only convert to a number if it doesn't change the string
                                +data + "" === data ? +data :
                                rbrace.test( data ) ? jQuery.parseJSON( data ) :
                                        data;
                        } catch( e ) {}

                        // Make sure we set the data so it isn't changed later
                        jQuery.data( elem, key, data );

                } else {
                        data = undefined;
                }
        }

        return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
        var name;
        for ( name in obj ) {

                // if the public data object is empty, the private is still empty
                if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
                        continue;
                }
                if ( name !== "toJSON" ) {
                        return false;
                }
        }

        return true;
}
jQuery.extend({
        queue: function( elem, type, data ) {
                var queue;

                if ( elem ) {
                        type = ( type || "fx" ) + "queue";
                        queue = jQuery._data( elem, type );

                        // Speed up dequeue by getting out quickly if this is just a lookup
                        if ( data ) {
                                if ( !queue || jQuery.isArray(data) ) {
                                        queue = jQuery._data( elem, type, jQuery.makeArray(data) );
                                } else {
                                        queue.push( data );
                                }
                        }
                        return queue || [];
                }
        },

        dequeue: function( elem, type ) {
                type = type || "fx";

                var queue = jQuery.queue( elem, type ),
                        startLength = queue.length,
                        fn = queue.shift(),
                        hooks = jQuery._queueHooks( elem, type ),
                        next = function() {
                                jQuery.dequeue( elem, type );
                        };

                // If the fx queue is dequeued, always remove the progress sentinel
                if ( fn === "inprogress" ) {
                        fn = queue.shift();
                        startLength--;
                }

                if ( fn ) {

                        // Add a progress sentinel to prevent the fx queue from being
                        // automatically dequeued
                        if ( type === "fx" ) {
                                queue.unshift( "inprogress" );
                        }

                        // clear up the last queue stop function
                        delete hooks.stop;
                        fn.call( elem, next, hooks );
                }

                if ( !startLength && hooks ) {
                        hooks.empty.fire();
                }
        },

        // not intended for public consumption - generates a queueHooks object, or returns the current one
        _queueHooks: function( elem, type ) {
                var key = type + "queueHooks";
                return jQuery._data( elem, key ) || jQuery._data( elem, key, {
                        empty: jQuery.Callbacks("once memory").add(function() {
                                jQuery.removeData( elem, type + "queue", true );
                                jQuery.removeData( elem, key, true );
                        })
                });
        }
});

jQuery.fn.extend({
        queue: function( type, data ) {
                var setter = 2;

                if ( typeof type !== "string" ) {
                        data = type;
                        type = "fx";
                        setter--;
                }

                if ( arguments.length < setter ) {
                        return jQuery.queue( this[0], type );
                }

                return data === undefined ?
                        this :
                        this.each(function() {
                                var queue = jQuery.queue( this, type, data );

                                // ensure a hooks for this queue
                                jQuery._queueHooks( this, type );

                                if ( type === "fx" && queue[0] !== "inprogress" ) {
                                        jQuery.dequeue( this, type );
                                }
                        });
        },
        dequeue: function( type ) {
                return this.each(function() {
                        jQuery.dequeue( this, type );
                });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function( time, type ) {
                time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
                type = type || "fx";

                return this.queue( type, function( next, hooks ) {
                        var timeout = setTimeout( next, time );
                        hooks.stop = function() {
                                clearTimeout( timeout );
                        };
                });
        },
        clearQueue: function( type ) {
                return this.queue( type || "fx", [] );
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function( type, obj ) {
                var tmp,
                        count = 1,
                        defer = jQuery.Deferred(),
                        elements = this,
                        i = this.length,
                        resolve = function() {
                                if ( !( --count ) ) {
                                        defer.resolveWith( elements, [ elements ] );
                                }
                        };

                if ( typeof type !== "string" ) {
                        obj = type;
                        type = undefined;
                }
                type = type || "fx";

                while( i-- ) {
                        tmp = jQuery._data( elements[ i ], type + "queueHooks" );
                        if ( tmp && tmp.empty ) {
                                count++;
                                tmp.empty.add( resolve );
                        }
                }
                resolve();
                return defer.promise( obj );
        }
});
var nodeHook, boolHook, fixSpecified,
        rclass = /[\t\r\n]/g,
        rreturn = /\r/g,
        rtype = /^(?:button|input)$/i,
        rfocusable = /^(?:button|input|object|select|textarea)$/i,
        rclickable = /^a(?:rea|)$/i,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
        attr: function( name, value ) {
                return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
        },

        removeAttr: function( name ) {
                return this.each(function() {
                        jQuery.removeAttr( this, name );
                });
        },

        prop: function( name, value ) {
                return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
        },

        removeProp: function( name ) {
                name = jQuery.propFix[ name ] || name;
                return this.each(function() {
                        // try/catch handles cases where IE balks (such as removing a property on window)
                        try {
                                this[ name ] = undefined;
                                delete this[ name ];
                        } catch( e ) {}
                });
        },

        addClass: function( value ) {
                var classNames, i, l, elem,
                        setClass, c, cl;

                if ( jQuery.isFunction( value ) ) {
                        return this.each(function( j ) {
                                jQuery( this ).addClass( value.call(this, j, this.className) );
                        });
                }

                if ( value && typeof value === "string" ) {
                        classNames = value.split( core_rspace );

                        for ( i = 0, l = this.length; i < l; i++ ) {
                                elem = this[ i ];

                                if ( elem.nodeType === 1 ) {
                                        if ( !elem.className && classNames.length === 1 ) {
                                                elem.className = value;

                                        } else {
                                                setClass = " " + elem.className + " ";

                                                for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                                                        if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
                                                                setClass += classNames[ c ] + " ";
                                                        }
                                                }
                                                elem.className = jQuery.trim( setClass );
                                        }
                                }
                        }
                }

                return this;
        },

        removeClass: function( value ) {
                var removes, className, elem, c, cl, i, l;

                if ( jQuery.isFunction( value ) ) {
                        return this.each(function( j ) {
                                jQuery( this ).removeClass( value.call(this, j, this.className) );
                        });
                }
                if ( (value && typeof value === "string") || value === undefined ) {
                        removes = ( value || "" ).split( core_rspace );

                        for ( i = 0, l = this.length; i < l; i++ ) {
                                elem = this[ i ];
                                if ( elem.nodeType === 1 && elem.className ) {

                                        className = (" " + elem.className + " ").replace( rclass, " " );

                                        // loop over each item in the removal list
                                        for ( c = 0, cl = removes.length; c < cl; c++ ) {
                                                // Remove until there is nothing to remove,
                                                while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
                                                        className = className.replace( " " + removes[ c ] + " " , " " );
                                                }
                                        }
                                        elem.className = value ? jQuery.trim( className ) : "";
                                }
                        }
                }

                return this;
        },

        toggleClass: function( value, stateVal ) {
                var type = typeof value,
                        isBool = typeof stateVal === "boolean";

                if ( jQuery.isFunction( value ) ) {
                        return this.each(function( i ) {
                                jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
                        });
                }

                return this.each(function() {
                        if ( type === "string" ) {
                                // toggle individual class names
                                var className,
                                        i = 0,
                                        self = jQuery( this ),
                                        state = stateVal,
                                        classNames = value.split( core_rspace );

                                while ( (className = classNames[ i++ ]) ) {
                                        // check each className given, space separated list
                                        state = isBool ? state : !self.hasClass( className );
                                        self[ state ? "addClass" : "removeClass" ]( className );
                                }

                        } else if ( type === "undefined" || type === "boolean" ) {
                                if ( this.className ) {
                                        // store className if set
                                        jQuery._data( this, "__className__", this.className );
                                }

                                // toggle whole className
                                this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
                        }
                });
        },

        hasClass: function( selector ) {
                var className = " " + selector + " ",
                        i = 0,
                        l = this.length;
                for ( ; i < l; i++ ) {
                        if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
                                return true;
                        }
                }

                return false;
        },

        val: function( value ) {
                var hooks, ret, isFunction,
                        elem = this[0];

                if ( !arguments.length ) {
                        if ( elem ) {
                                hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

                                if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                                        return ret;
                                }

                                ret = elem.value;

                                return typeof ret === "string" ?
                                        // handle most common string cases
                                        ret.replace(rreturn, "") :
                                        // handle cases where value is null/undef or number
                                        ret == null ? "" : ret;
                        }

                        return;
                }

                isFunction = jQuery.isFunction( value );

                return this.each(function( i ) {
                        var val,
                                self = jQuery(this);

                        if ( this.nodeType !== 1 ) {
                                return;
                        }

                        if ( isFunction ) {
                                val = value.call( this, i, self.val() );
                        } else {
                                val = value;
                        }

                        // Treat null/undefined as ""; convert numbers to string
                        if ( val == null ) {
                                val = "";
                        } else if ( typeof val === "number" ) {
                                val += "";
                        } else if ( jQuery.isArray( val ) ) {
                                val = jQuery.map(val, function ( value ) {
                                        return value == null ? "" : value + "";
                                });
                        }

                        hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

                        // If set returns undefined, fall back to normal setting
                        if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                                this.value = val;
                        }
                });
        }
});

jQuery.extend({
        valHooks: {
                option: {
                        get: function( elem ) {
                                // attributes.value is undefined in Blackberry 4.7 but
                                // uses .value. See #6932
                                var val = elem.attributes.value;
                                return !val || val.specified ? elem.value : elem.text;
                        }
                },
                select: {
                        get: function( elem ) {
                                var value, option,
                                        options = elem.options,
                                        index = elem.selectedIndex,
                                        one = elem.type === "select-one" || index < 0,
                                        values = one ? null : [],
                                        max = one ? index + 1 : options.length,
                                        i = index < 0 ?
                                                max :
                                                one ? index : 0;

                                // Loop through all the selected options
                                for ( ; i < max; i++ ) {
                                        option = options[ i ];

                                        // oldIE doesn't update selected after form reset (#2551)
                                        if ( ( option.selected || i === index ) &&
                                                        // Don't return options that are disabled or in a disabled optgroup
                                                        ( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
                                                        ( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

                                                // Get the specific value for the option
                                                value = jQuery( option ).val();

                                                // We don't need an array for one selects
                                                if ( one ) {
                                                        return value;
                                                }

                                                // Multi-Selects return an array
                                                values.push( value );
                                        }
                                }

                                return values;
                        },

                        set: function( elem, value ) {
                                var values = jQuery.makeArray( value );

                                jQuery(elem).find("option").each(function() {
                                        this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                                });

                                if ( !values.length ) {
                                        elem.selectedIndex = -1;
                                }
                                return values;
                        }
                }
        },

        // Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
        attrFn: {},

        attr: function( elem, name, value, pass ) {
                var ret, hooks, notxml,
                        nType = elem.nodeType;

                // don't get/set attributes on text, comment and attribute nodes
                if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                        return;
                }

                if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
                        return jQuery( elem )[ name ]( value );
                }

                // Fallback to prop when attributes are not supported
                if ( typeof elem.getAttribute === "undefined" ) {
                        return jQuery.prop( elem, name, value );
                }

                notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

                // All attributes are lowercase
                // Grab necessary hook if one is defined
                if ( notxml ) {
                        name = name.toLowerCase();
                        hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
                }

                if ( value !== undefined ) {

                        if ( value === null ) {
                                jQuery.removeAttr( elem, name );
                                return;

                        } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
                                return ret;

                        } else {
                                elem.setAttribute( name, value + "" );
                                return value;
                        }

                } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
                        return ret;

                } else {

                        ret = elem.getAttribute( name );

                        // Non-existent attributes return null, we normalize to undefined
                        return ret === null ?
                                undefined :
                                ret;
                }
        },

        removeAttr: function( elem, value ) {
                var propName, attrNames, name, isBool,
                        i = 0;

                if ( value && elem.nodeType === 1 ) {

                        attrNames = value.split( core_rspace );

                        for ( ; i < attrNames.length; i++ ) {
                                name = attrNames[ i ];

                                if ( name ) {
                                        propName = jQuery.propFix[ name ] || name;
                                        isBool = rboolean.test( name );

                                        // See #9699 for explanation of this approach (setting first, then removal)
                                        // Do not do this for boolean attributes (see #10870)
                                        if ( !isBool ) {
                                                jQuery.attr( elem, name, "" );
                                        }
                                        elem.removeAttribute( getSetAttribute ? name : propName );

                                        // Set corresponding property to false for boolean attributes
                                        if ( isBool && propName in elem ) {
                                                elem[ propName ] = false;
                                        }
                                }
                        }
                }
        },

        attrHooks: {
                type: {
                        set: function( elem, value ) {
                                // We can't allow the type property to be changed (since it causes problems in IE)
                                if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
                                        jQuery.error( "type property can't be changed" );
                                } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                                        // Setting the type on a radio button after the value resets the value in IE6-9
                                        // Reset value to it's default in case type is set after value
                                        // This is for element creation
                                        var val = elem.value;
                                        elem.setAttribute( "type", value );
                                        if ( val ) {
                                                elem.value = val;
                                        }
                                        return value;
                                }
                        }
                },
                // Use the value property for back compat
                // Use the nodeHook for button elements in IE6/7 (#1954)
                value: {
                        get: function( elem, name ) {
                                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                                        return nodeHook.get( elem, name );
                                }
                                return name in elem ?
                                        elem.value :
                                        null;
                        },
                        set: function( elem, value, name ) {
                                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                                        return nodeHook.set( elem, value, name );
                                }
                                // Does not return so that setAttribute is also used
                                elem.value = value;
                        }
                }
        },

        propFix: {
                tabindex: "tabIndex",
                readonly: "readOnly",
                "for": "htmlFor",
                "class": "className",
                maxlength: "maxLength",
                cellspacing: "cellSpacing",
                cellpadding: "cellPadding",
                rowspan: "rowSpan",
                colspan: "colSpan",
                usemap: "useMap",
                frameborder: "frameBorder",
                contenteditable: "contentEditable"
        },

        prop: function( elem, name, value ) {
                var ret, hooks, notxml,
                        nType = elem.nodeType;

                // don't get/set properties on text, comment and attribute nodes
                if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                        return;
                }

                notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

                if ( notxml ) {
                        // Fix name and attach hooks
                        name = jQuery.propFix[ name ] || name;
                        hooks = jQuery.propHooks[ name ];
                }

                if ( value !== undefined ) {
                        if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                                return ret;

                        } else {
                                return ( elem[ name ] = value );
                        }

                } else {
                        if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                                return ret;

                        } else {
                                return elem[ name ];
                        }
                }
        },

        propHooks: {
                tabIndex: {
                        get: function( elem ) {
                                // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                                // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                                var attributeNode = elem.getAttributeNode("tabindex");

                                return attributeNode && attributeNode.specified ?
                                        parseInt( attributeNode.value, 10 ) :
                                        rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                                                0 :
                                                undefined;
                        }
                }
        }
});

// Hook for boolean attributes
boolHook = {
        get: function( elem, name ) {
                // Align boolean attributes with corresponding properties
                // Fall back to attribute presence where some booleans are not supported
                var attrNode,
                        property = jQuery.prop( elem, name );
                return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
                        name.toLowerCase() :
                        undefined;
        },
        set: function( elem, value, name ) {
                var propName;
                if ( value === false ) {
                        // Remove boolean attributes when set to false
                        jQuery.removeAttr( elem, name );
                } else {
                        // value is true since we know at this point it's type boolean and not false
                        // Set boolean attributes to the same name and set the DOM property
                        propName = jQuery.propFix[ name ] || name;
                        if ( propName in elem ) {
                                // Only set the IDL specifically if it already exists on the element
                                elem[ propName ] = true;
                        }

                        elem.setAttribute( name, name.toLowerCase() );
                }
                return name;
        }
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

        fixSpecified = {
                name: true,
                id: true,
                coords: true
        };

        // Use this for any attribute in IE6/7
        // This fixes almost every IE6/7 issue
        nodeHook = jQuery.valHooks.button = {
                get: function( elem, name ) {
                        var ret;
                        ret = elem.getAttributeNode( name );
                        return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
                                ret.value :
                                undefined;
                },
                set: function( elem, value, name ) {
                        // Set the existing or create a new attribute node
                        var ret = elem.getAttributeNode( name );
                        if ( !ret ) {
                                ret = document.createAttribute( name );
                                elem.setAttributeNode( ret );
                        }
                        return ( ret.value = value + "" );
                }
        };

        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
        // This is for removals
        jQuery.each([ "width", "height" ], function( i, name ) {
                jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
                        set: function( elem, value ) {
                                if ( value === "" ) {
                                        elem.setAttribute( name, "auto" );
                                        return value;
                                }
                        }
                });
        });

        // Set contenteditable to false on removals(#10429)
        // Setting to empty string throws an error as an invalid value
        jQuery.attrHooks.contenteditable = {
                get: nodeHook.get,
                set: function( elem, value, name ) {
                        if ( value === "" ) {
                                value = "false";
                        }
                        nodeHook.set( elem, value, name );
                }
        };
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
        jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
                jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
                        get: function( elem ) {
                                var ret = elem.getAttribute( name, 2 );
                                return ret === null ? undefined : ret;
                        }
                });
        });
}

if ( !jQuery.support.style ) {
        jQuery.attrHooks.style = {
                get: function( elem ) {
                        // Return undefined in the case of empty string
                        // Normalize to lowercase since IE uppercases css property names
                        return elem.style.cssText.toLowerCase() || undefined;
                },
                set: function( elem, value ) {
                        return ( elem.style.cssText = value + "" );
                }
        };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
        jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
                get: function( elem ) {
                        var parent = elem.parentNode;

                        if ( parent ) {
                                parent.selectedIndex;

                                // Make sure that it also works with optgroups, see #5701
                                if ( parent.parentNode ) {
                                        parent.parentNode.selectedIndex;
                                }
                        }
                        return null;
                }
        });
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
        jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
        jQuery.each([ "radio", "checkbox" ], function() {
                jQuery.valHooks[ this ] = {
                        get: function( elem ) {
                                // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                                return elem.getAttribute("value") === null ? "on" : elem.value;
                        }
                };
        });
}
jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
                set: function( elem, value ) {
                        if ( jQuery.isArray( value ) ) {
                                return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
                        }
                }
        });
});
var rformElems = /^(?:textarea|input|select)$/i,
        rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
        rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        hoverHack = function( events ) {
                return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
        };

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

        add: function( elem, types, handler, data, selector ) {

                var elemData, eventHandle, events,
                        t, tns, type, namespaces, handleObj,
                        handleObjIn, handlers, special;

                // Don't attach events to noData or text/comment nodes (allow plain objects tho)
                if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
                        return;
                }

                // Caller can pass in an object of custom data in lieu of the handler
                if ( handler.handler ) {
                        handleObjIn = handler;
                        handler = handleObjIn.handler;
                        selector = handleObjIn.selector;
                }

                // Make sure that the handler has a unique ID, used to find/remove it later
                if ( !handler.guid ) {
                        handler.guid = jQuery.guid++;
                }

                // Init the element's event structure and main handler, if this is the first
                events = elemData.events;
                if ( !events ) {
                        elemData.events = events = {};
                }
                eventHandle = elemData.handle;
                if ( !eventHandle ) {
                        elemData.handle = eventHandle = function( e ) {
                                // Discard the second event of a jQuery.event.trigger() and
                                // when an event is called after a page has unloaded
                                return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                                        jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
                                        undefined;
                        };
                        // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                        eventHandle.elem = elem;
                }

                // Handle multiple events separated by a space
                // jQuery(...).bind("mouseover mouseout", fn);
                types = jQuery.trim( hoverHack(types) ).split( " " );
                for ( t = 0; t < types.length; t++ ) {

                        tns = rtypenamespace.exec( types[t] ) || [];
                        type = tns[1];
                        namespaces = ( tns[2] || "" ).split( "." ).sort();

                        // If event changes its type, use the special event handlers for the changed type
                        special = jQuery.event.special[ type ] || {};

                        // If selector defined, determine special event api type, otherwise given type
                        type = ( selector ? special.delegateType : special.bindType ) || type;

                        // Update special based on newly reset type
                        special = jQuery.event.special[ type ] || {};

                        // handleObj is passed to all event handlers
                        handleObj = jQuery.extend({
                                type: type,
                                origType: tns[1],
                                data: data,
                                handler: handler,
                                guid: handler.guid,
                                selector: selector,
                                needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
                                namespace: namespaces.join(".")
                        }, handleObjIn );

                        // Init the event handler queue if we're the first
                        handlers = events[ type ];
                        if ( !handlers ) {
                                handlers = events[ type ] = [];
                                handlers.delegateCount = 0;

                                // Only use addEventListener/attachEvent if the special events handler returns false
                                if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                                        // Bind the global event handler to the element
                                        if ( elem.addEventListener ) {
                                                elem.addEventListener( type, eventHandle, false );

                                        } else if ( elem.attachEvent ) {
                                                elem.attachEvent( "on" + type, eventHandle );
                                        }
                                }
                        }

                        if ( special.add ) {
                                special.add.call( elem, handleObj );

                                if ( !handleObj.handler.guid ) {
                                        handleObj.handler.guid = handler.guid;
                                }
                        }

                        // Add to the element's handler list, delegates in front
                        if ( selector ) {
                                handlers.splice( handlers.delegateCount++, 0, handleObj );
                        } else {
                                handlers.push( handleObj );
                        }

                        // Keep track of which events have ever been used, for event optimization
                        jQuery.event.global[ type ] = true;
                }

                // Nullify elem to prevent memory leaks in IE
                elem = null;
        },

        global: {},

        // Detach an event or set of events from an element
        remove: function( elem, types, handler, selector, mappedTypes ) {

                var t, tns, type, origType, namespaces, origCount,
                        j, events, special, eventType, handleObj,
                        elemData = jQuery.hasData( elem ) && jQuery._data( elem );

                if ( !elemData || !(events = elemData.events) ) {
                        return;
                }

                // Once for each type.namespace in types; type may be omitted
                types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
                for ( t = 0; t < types.length; t++ ) {
                        tns = rtypenamespace.exec( types[t] ) || [];
                        type = origType = tns[1];
                        namespaces = tns[2];

                        // Unbind all events (on this namespace, if provided) for the element
                        if ( !type ) {
                                for ( type in events ) {
                                        jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                                }
                                continue;
                        }

                        special = jQuery.event.special[ type ] || {};
                        type = ( selector? special.delegateType : special.bindType ) || type;
                        eventType = events[ type ] || [];
                        origCount = eventType.length;
                        namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

                        // Remove matching events
                        for ( j = 0; j < eventType.length; j++ ) {
                                handleObj = eventType[ j ];

                                if ( ( mappedTypes || origType === handleObj.origType ) &&
                                         ( !handler || handler.guid === handleObj.guid ) &&
                                         ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
                                         ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                                        eventType.splice( j--, 1 );

                                        if ( handleObj.selector ) {
                                                eventType.delegateCount--;
                                        }
                                        if ( special.remove ) {
                                                special.remove.call( elem, handleObj );
                                        }
                                }
                        }

                        // Remove generic event handler if we removed something and no more handlers exist
                        // (avoids potential for endless recursion during removal of special event handlers)
                        if ( eventType.length === 0 && origCount !== eventType.length ) {
                                if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
                                        jQuery.removeEvent( elem, type, elemData.handle );
                                }

                                delete events[ type ];
                        }
                }

                // Remove the expando if it's no longer used
                if ( jQuery.isEmptyObject( events ) ) {
                        delete elemData.handle;

                        // removeData also checks for emptiness and clears the expando if empty
                        // so use it instead of delete
                        jQuery.removeData( elem, "events", true );
                }
        },

        // Events that are safe to short-circuit if no handlers are attached.
        // Native DOM events should not be added, they may have inline handlers.
        customEvent: {
                "getData": true,
                "setData": true,
                "changeData": true
        },

        trigger: function( event, data, elem, onlyHandlers ) {
                // Don't do events on text and comment nodes
                if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
                        return;
                }

                // Event object or event type
                var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
                        type = event.type || event,
                        namespaces = [];

                // focus/blur morphs to focusin/out; ensure we're not firing them right now
                if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
                        return;
                }

                if ( type.indexOf( "!" ) >= 0 ) {
                        // Exclusive events trigger only for the exact event (no namespaces)
                        type = type.slice(0, -1);
                        exclusive = true;
                }

                if ( type.indexOf( "." ) >= 0 ) {
                        // Namespaced trigger; create a regexp to match event type in handle()
                        namespaces = type.split(".");
                        type = namespaces.shift();
                        namespaces.sort();
                }

                if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
                        // No jQuery handlers for this event type, and it can't have inline handlers
                        return;
                }

                // Caller can pass in an Event, Object, or just an event type string
                event = typeof event === "object" ?
                        // jQuery.Event object
                        event[ jQuery.expando ] ? event :
                        // Object literal
                        new jQuery.Event( type, event ) :
                        // Just the event type (string)
                        new jQuery.Event( type );

                event.type = type;
                event.isTrigger = true;
                event.exclusive = exclusive;
                event.namespace = namespaces.join( "." );
                event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
                ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

                // Handle a global trigger
                if ( !elem ) {

                        // TODO: Stop taunting the data cache; remove global events and always attach to document
                        cache = jQuery.cache;
                        for ( i in cache ) {
                                if ( cache[ i ].events && cache[ i ].events[ type ] ) {
                                        jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
                                }
                        }
                        return;
                }

                // Clean up the event in case it is being reused
                event.result = undefined;
                if ( !event.target ) {
                        event.target = elem;
                }

                // Clone any incoming data and prepend the event, creating the handler arg list
                data = data != null ? jQuery.makeArray( data ) : [];
                data.unshift( event );

                // Allow special events to draw outside the lines
                special = jQuery.event.special[ type ] || {};
                if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
                        return;
                }

                // Determine event propagation path in advance, per W3C events spec (#9951)
                // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
                eventPath = [[ elem, special.bindType || type ]];
                if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

                        bubbleType = special.delegateType || type;
                        cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
                        for ( old = elem; cur; cur = cur.parentNode ) {
                                eventPath.push([ cur, bubbleType ]);
                                old = cur;
                        }

                        // Only add window if we got to document (e.g., not plain obj or detached DOM)
                        if ( old === (elem.ownerDocument || document) ) {
                                eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
                        }
                }

                // Fire handlers on the event path
                for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

                        cur = eventPath[i][0];
                        event.type = eventPath[i][1];

                        handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
                        if ( handle ) {
                                handle.apply( cur, data );
                        }
                        // Note that this is a bare JS function and not a jQuery handler
                        handle = ontype && cur[ ontype ];
                        if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
                                event.preventDefault();
                        }
                }
                event.type = type;

                // If nobody prevented the default action, do it now
                if ( !onlyHandlers && !event.isDefaultPrevented() ) {

                        if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
                                !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

                                // Call a native DOM method on the target with the same name name as the event.
                                // Can't use an .isFunction() check here because IE6/7 fails that test.
                                // Don't do default actions on window, that's where global variables be (#6170)
                                // IE<9 dies on focus/blur to hidden element (#1486)
                                if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

                                        // Don't re-trigger an onFOO event when we call its FOO() method
                                        old = elem[ ontype ];

                                        if ( old ) {
                                                elem[ ontype ] = null;
                                        }

                                        // Prevent re-triggering of the same event, since we already bubbled it above
                                        jQuery.event.triggered = type;
                                        elem[ type ]();
                                        jQuery.event.triggered = undefined;

                                        if ( old ) {
                                                elem[ ontype ] = old;
                                        }
                                }
                        }
                }

                return event.result;
        },

        dispatch: function( event ) {

                // Make a writable jQuery.Event from the native event object
                event = jQuery.event.fix( event || window.event );

                var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
                        handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
                        delegateCount = handlers.delegateCount,
                        args = core_slice.call( arguments ),
                        run_all = !event.exclusive && !event.namespace,
                        special = jQuery.event.special[ event.type ] || {},
                        handlerQueue = [];

                // Use the fix-ed jQuery.Event rather than the (read-only) native event
                args[0] = event;
                event.delegateTarget = this;

                // Call the preDispatch hook for the mapped type, and let it bail if desired
                if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
                        return;
                }

                // Determine handlers that should run if there are delegated events
                // Avoid non-left-click bubbling in Firefox (#3861)
                if ( delegateCount && !(event.button && event.type === "click") ) {

                        for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

                                // Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
                                if ( cur.disabled !== true || event.type !== "click" ) {
                                        selMatch = {};
                                        matches = [];
                                        for ( i = 0; i < delegateCount; i++ ) {
                                                handleObj = handlers[ i ];
                                                sel = handleObj.selector;

                                                if ( selMatch[ sel ] === undefined ) {
                                                        selMatch[ sel ] = handleObj.needsContext ?
                                                                jQuery( sel, this ).index( cur ) >= 0 :
                                                                jQuery.find( sel, this, null, [ cur ] ).length;
                                                }
                                                if ( selMatch[ sel ] ) {
                                                        matches.push( handleObj );
                                                }
                                        }
                                        if ( matches.length ) {
                                                handlerQueue.push({ elem: cur, matches: matches });
                                        }
                                }
                        }
                }

                // Add the remaining (directly-bound) handlers
                if ( handlers.length > delegateCount ) {
                        handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
                }

                // Run delegates first; they may want to stop propagation beneath us
                for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
                        matched = handlerQueue[ i ];
                        event.currentTarget = matched.elem;

                        for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
                                handleObj = matched.matches[ j ];

                                // Triggered event must either 1) be non-exclusive and have no namespace, or
                                // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                                if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

                                        event.data = handleObj.data;
                                        event.handleObj = handleObj;

                                        ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                                                        .apply( matched.elem, args );

                                        if ( ret !== undefined ) {
                                                event.result = ret;
                                                if ( ret === false ) {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                }
                                        }
                                }
                        }
                }

                // Call the postDispatch hook for the mapped type
                if ( special.postDispatch ) {
                        special.postDispatch.call( this, event );
                }

                return event.result;
        },

        // Includes some event props shared by KeyEvent and MouseEvent
        // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

        fixHooks: {},

        keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function( event, original ) {

                        // Add which for key events
                        if ( event.which == null ) {
                                event.which = original.charCode != null ? original.charCode : original.keyCode;
                        }

                        return event;
                }
        },

        mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function( event, original ) {
                        var eventDoc, doc, body,
                                button = original.button,
                                fromElement = original.fromElement;

                        // Calculate pageX/Y if missing and clientX/Y available
                        if ( event.pageX == null && original.clientX != null ) {
                                eventDoc = event.target.ownerDocument || document;
                                doc = eventDoc.documentElement;
                                body = eventDoc.body;

                                event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                                event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
                        }

                        // Add relatedTarget, if necessary
                        if ( !event.relatedTarget && fromElement ) {
                                event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                        }

                        // Add which for click: 1 === left; 2 === middle; 3 === right
                        // Note: button is not normalized, so don't use it
                        if ( !event.which && button !== undefined ) {
                                event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
                        }

                        return event;
                }
        },

        fix: function( event ) {
                if ( event[ jQuery.expando ] ) {
                        return event;
                }

                // Create a writable copy of the event object and normalize some properties
                var i, prop,
                        originalEvent = event,
                        fixHook = jQuery.event.fixHooks[ event.type ] || {},
                        copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

                event = jQuery.Event( originalEvent );

                for ( i = copy.length; i; ) {
                        prop = copy[ --i ];
                        event[ prop ] = originalEvent[ prop ];
                }

                // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
                if ( !event.target ) {
                        event.target = originalEvent.srcElement || document;
                }

                // Target should not be a text node (#504, Safari)
                if ( event.target.nodeType === 3 ) {
                        event.target = event.target.parentNode;
                }

                // For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
                event.metaKey = !!event.metaKey;

                return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
        },

        special: {
                load: {
                        // Prevent triggered image.load events from bubbling to window.load
                        noBubble: true
                },

                focus: {
                        delegateType: "focusin"
                },
                blur: {
                        delegateType: "focusout"
                },

                beforeunload: {
                        setup: function( data, namespaces, eventHandle ) {
                                // We only want to do this special case on windows
                                if ( jQuery.isWindow( this ) ) {
                                        this.onbeforeunload = eventHandle;
                                }
                        },

                        teardown: function( namespaces, eventHandle ) {
                                if ( this.onbeforeunload === eventHandle ) {
                                        this.onbeforeunload = null;
                                }
                        }
                }
        },

        simulate: function( type, elem, event, bubble ) {
                // Piggyback on a donor event to simulate a different one.
                // Fake originalEvent to avoid donor's stopPropagation, but if the
                // simulated event prevents default then we do the same on the donor.
                var e = jQuery.extend(
                        new jQuery.Event(),
                        event,
                        { type: type,
                                isSimulated: true,
                                originalEvent: {}
                        }
                );
                if ( bubble ) {
                        jQuery.event.trigger( e, null, elem );
                } else {
                        jQuery.event.dispatch.call( elem, e );
                }
                if ( e.isDefaultPrevented() ) {
                        event.preventDefault();
                }
        }
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
        function( elem, type, handle ) {
                if ( elem.removeEventListener ) {
                        elem.removeEventListener( type, handle, false );
                }
        } :
        function( elem, type, handle ) {
                var name = "on" + type;

                if ( elem.detachEvent ) {

                        // #8545, #7054, preventing memory leaks for custom events in IE6-8
                        // detachEvent needed property on element, by name of that event, to properly expose it to GC
                        if ( typeof elem[ name ] === "undefined" ) {
                                elem[ name ] = null;
                        }

                        elem.detachEvent( name, handle );
                }
        };

jQuery.Event = function( src, props ) {
        // Allow instantiation without the 'new' keyword
        if ( !(this instanceof jQuery.Event) ) {
                return new jQuery.Event( src, props );
        }

        // Event object
        if ( src && src.type ) {
                this.originalEvent = src;
                this.type = src.type;

                // Events bubbling up the document may have been marked as prevented
                // by a handler lower down the tree; reflect the correct value.
                this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
                        src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

        // Event type
        } else {
                this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if ( props ) {
                jQuery.extend( this, props );
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();

        // Mark it as fixed
        this[ jQuery.expando ] = true;
};

function returnFalse() {
        return false;
}
function returnTrue() {
        return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
        preventDefault: function() {
                this.isDefaultPrevented = returnTrue;

                var e = this.originalEvent;
                if ( !e ) {
                        return;
                }

                // if preventDefault exists run it on the original event
                if ( e.preventDefault ) {
                        e.preventDefault();

                // otherwise set the returnValue property of the original event to false (IE)
                } else {
                        e.returnValue = false;
                }
        },
        stopPropagation: function() {
                this.isPropagationStopped = returnTrue;

                var e = this.originalEvent;
                if ( !e ) {
                        return;
                }
                // if stopPropagation exists run it on the original event
                if ( e.stopPropagation ) {
                        e.stopPropagation();
                }
                // otherwise set the cancelBubble property of the original event to true (IE)
                e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = returnTrue;
                this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
}, function( orig, fix ) {
        jQuery.event.special[ orig ] = {
                delegateType: fix,
                bindType: fix,

                handle: function( event ) {
                        var ret,
                                target = this,
                                related = event.relatedTarget,
                                handleObj = event.handleObj,
                                selector = handleObj.selector;

                        // For mousenter/leave call the handler if related is outside the target.
                        // NB: No relatedTarget if the mouse left/entered the browser window
                        if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                                event.type = handleObj.origType;
                                ret = handleObj.handler.apply( this, arguments );
                                event.type = fix;
                        }
                        return ret;
                }
        };
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

        jQuery.event.special.submit = {
                setup: function() {
                        // Only need this for delegated form submit events
                        if ( jQuery.nodeName( this, "form" ) ) {
                                return false;
                        }

                        // Lazy-add a submit handler when a descendant form may potentially be submitted
                        jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
                                // Node name check avoids a VML-related crash in IE (#9807)
                                var elem = e.target,
                                        form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
                                if ( form && !jQuery._data( form, "_submit_attached" ) ) {
                                        jQuery.event.add( form, "submit._submit", function( event ) {
                                                event._submit_bubble = true;
                                        });
                                        jQuery._data( form, "_submit_attached", true );
                                }
                        });
                        // return undefined since we don't need an event listener
                },

                postDispatch: function( event ) {
                        // If form was submitted by the user, bubble the event up the tree
                        if ( event._submit_bubble ) {
                                delete event._submit_bubble;
                                if ( this.parentNode && !event.isTrigger ) {
                                        jQuery.event.simulate( "submit", this.parentNode, event, true );
                                }
                        }
                },

                teardown: function() {
                        // Only need this for delegated form submit events
                        if ( jQuery.nodeName( this, "form" ) ) {
                                return false;
                        }

                        // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
                        jQuery.event.remove( this, "._submit" );
                }
        };
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

        jQuery.event.special.change = {

                setup: function() {

                        if ( rformElems.test( this.nodeName ) ) {
                                // IE doesn't fire change on a check/radio until blur; trigger it on click
                                // after a propertychange. Eat the blur-change in special.change.handle.
                                // This still fires onchange a second time for check/radio after blur.
                                if ( this.type === "checkbox" || this.type === "radio" ) {
                                        jQuery.event.add( this, "propertychange._change", function( event ) {
                                                if ( event.originalEvent.propertyName === "checked" ) {
                                                        this._just_changed = true;
                                                }
                                        });
                                        jQuery.event.add( this, "click._change", function( event ) {
                                                if ( this._just_changed && !event.isTrigger ) {
                                                        this._just_changed = false;
                                                }
                                                // Allow triggered, simulated change events (#11500)
                                                jQuery.event.simulate( "change", this, event, true );
                                        });
                                }
                                return false;
                        }
                        // Delegated event; lazy-add a change handler on descendant inputs
                        jQuery.event.add( this, "beforeactivate._change", function( e ) {
                                var elem = e.target;

                                if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
                                        jQuery.event.add( elem, "change._change", function( event ) {
                                                if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                                                        jQuery.event.simulate( "change", this.parentNode, event, true );
                                                }
                                        });
                                        jQuery._data( elem, "_change_attached", true );
                                }
                        });
                },

                handle: function( event ) {
                        var elem = event.target;

                        // Swallow native change events from checkbox/radio, we already triggered them above
                        if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
                                return event.handleObj.handler.apply( this, arguments );
                        }
                },

                teardown: function() {
                        jQuery.event.remove( this, "._change" );

                        return !rformElems.test( this.nodeName );
                }
        };
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

                // Attach a single capturing handler while someone wants focusin/focusout
                var attaches = 0,
                        handler = function( event ) {
                                jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
                        };

                jQuery.event.special[ fix ] = {
                        setup: function() {
                                if ( attaches++ === 0 ) {
                                        document.addEventListener( orig, handler, true );
                                }
                        },
                        teardown: function() {
                                if ( --attaches === 0 ) {
                                        document.removeEventListener( orig, handler, true );
                                }
                        }
                };
        });
}

jQuery.fn.extend({

        on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
                var origFn, type;

                // Types can be a map of types/handlers
                if ( typeof types === "object" ) {
                        // ( types-Object, selector, data )
                        if ( typeof selector !== "string" ) { // && selector != null
                                // ( types-Object, data )
                                data = data || selector;
                                selector = undefined;
                        }
                        for ( type in types ) {
                                this.on( type, selector, data, types[ type ], one );
                        }
                        return this;
                }

                if ( data == null && fn == null ) {
                        // ( types, fn )
                        fn = selector;
                        data = selector = undefined;
                } else if ( fn == null ) {
                        if ( typeof selector === "string" ) {
                                // ( types, selector, fn )
                                fn = data;
                                data = undefined;
                        } else {
                                // ( types, data, fn )
                                fn = data;
                                data = selector;
                                selector = undefined;
                        }
                }
                if ( fn === false ) {
                        fn = returnFalse;
                } else if ( !fn ) {
                        return this;
                }

                if ( one === 1 ) {
                        origFn = fn;
                        fn = function( event ) {
                                // Can use an empty set, since event contains the info
                                jQuery().off( event );
                                return origFn.apply( this, arguments );
                        };
                        // Use same guid so caller can remove using origFn
                        fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
                }
                return this.each( function() {
                        jQuery.event.add( this, types, fn, data, selector );
                });
        },
        one: function( types, selector, data, fn ) {
                return this.on( types, selector, data, fn, 1 );
        },
        off: function( types, selector, fn ) {
                var handleObj, type;
                if ( types && types.preventDefault && types.handleObj ) {
                        // ( event )  dispatched jQuery.Event
                        handleObj = types.handleObj;
                        jQuery( types.delegateTarget ).off(
                                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                                handleObj.selector,
                                handleObj.handler
                        );
                        return this;
                }
                if ( typeof types === "object" ) {
                        // ( types-object [, selector] )
                        for ( type in types ) {
                                this.off( type, selector, types[ type ] );
                        }
                        return this;
                }
                if ( selector === false || typeof selector === "function" ) {
                        // ( types [, fn] )
                        fn = selector;
                        selector = undefined;
                }
                if ( fn === false ) {
                        fn = returnFalse;
                }
                return this.each(function() {
                        jQuery.event.remove( this, types, fn, selector );
                });
        },

        bind: function( types, data, fn ) {
                return this.on( types, null, data, fn );
        },
        unbind: function( types, fn ) {
                return this.off( types, null, fn );
        },

        live: function( types, data, fn ) {
                jQuery( this.context ).on( types, this.selector, data, fn );
                return this;
        },
        die: function( types, fn ) {
                jQuery( this.context ).off( types, this.selector || "**", fn );
                return this;
        },

        delegate: function( selector, types, data, fn ) {
                return this.on( types, selector, data, fn );
        },
        undelegate: function( selector, types, fn ) {
                // ( namespace ) or ( selector, types [, fn] )
                return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
        },

        trigger: function( type, data ) {
                return this.each(function() {
                        jQuery.event.trigger( type, data, this );
                });
        },
        triggerHandler: function( type, data ) {
                if ( this[0] ) {
                        return jQuery.event.trigger( type, data, this[0], true );
                }
        },

        toggle: function( fn ) {
                // Save reference to arguments for access in closure
                var args = arguments,
                        guid = fn.guid || jQuery.guid++,
                        i = 0,
                        toggler = function( event ) {
                                // Figure out which function to execute
                                var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                                jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                                // Make sure that clicks stop
                                event.preventDefault();

                                // and execute the function
                                return args[ lastToggle ].apply( this, arguments ) || false;
                        };

                // link all the functions, so any of them can unbind this click handler
                toggler.guid = guid;
                while ( i < args.length ) {
                        args[ i++ ].guid = guid;
                }

                return this.click( toggler );
        },

        hover: function( fnOver, fnOut ) {
                return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
        }
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

        // Handle event binding
        jQuery.fn[ name ] = function( data, fn ) {
                if ( fn == null ) {
                        fn = data;
                        data = null;
                }

                return arguments.length > 0 ?
                        this.on( name, null, data, fn ) :
                        this.trigger( name );
        };

        if ( rkeyEvent.test( name ) ) {
                jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
        }

        if ( rmouseEvent.test( name ) ) {
                jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
        }
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
        assertGetIdNotName,
        Expr,
        getText,
        isXML,
        contains,
        compile,
        sortOrder,
        hasDuplicate,
        outermostContext,

        baseHasDuplicate = true,
        strundefined = "undefined",

        expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

        Token = String,
        document = window.document,
        docElem = document.documentElement,
        dirruns = 0,
        done = 0,
        pop = [].pop,
        push = [].push,
        slice = [].slice,
        // Use a stripped-down indexOf if a native one is unavailable
        indexOf = [].indexOf || function( elem ) {
                var i = 0,
                        len = this.length;
                for ( ; i < len; i++ ) {
                        if ( this[i] === elem ) {
                                return i;
                        }
                }
                return -1;
        },

        // Augment a function for special use by Sizzle
        markFunction = function( fn, value ) {
                fn[ expando ] = value == null || value;
                return fn;
        },

        createCache = function() {
                var cache = {},
                        keys = [];

                return markFunction(function( key, value ) {
                        // Only keep the most recent entries
                        if ( keys.push( key ) > Expr.cacheLength ) {
                                delete cache[ keys.shift() ];
                        }

                        // Retrieve with (key + " ") to avoid collision with native Object.prototype properties (see Issue #157)
                        return (cache[ key + " " ] = value);
                }, cache );
        },

        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),

        // Regex

        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/css3-syntax/#characters
        characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

        // Loosely modeled on CSS identifier characters
        // An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
        identifier = characterEncoding.replace( "w", "w#" ),

        // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
        operators = "([*^$|!~]?=)",
        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
                "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

        // Prefer arguments not in parens/brackets,
        //   then attribute selectors and non-pseudos (denoted by :),
        //   then anything else
        // These preferences are here to reduce the number of selectors
        //   needing tokenize in the PSEUDO preFilter
        pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

        // For matchExpr.POS and matchExpr.needsContext
        pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
                "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
        rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

        rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
        rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
        rpseudo = new RegExp( pseudos ),

        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

        rnot = /^:not/,
        rsibling = /[\x20\t\r\n\f]*[+~]/,
        rendsWithNot = /:not\($/,

        rheader = /h\d/i,
        rinputs = /input|select|textarea|button/i,

        rbackslash = /\\(?!\\)/g,

        matchExpr = {
                "ID": new RegExp( "^#(" + characterEncoding + ")" ),
                "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
                "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
                "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
                "ATTR": new RegExp( "^" + attributes ),
                "PSEUDO": new RegExp( "^" + pseudos ),
                "POS": new RegExp( pos, "i" ),
                "CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
                        "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                        "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
                // For use in libraries implementing .is()
                "needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
        },

        // Support

        // Used for testing something on an element
        assert = function( fn ) {
                var div = document.createElement("div");

                try {
                        return fn( div );
                } catch (e) {
                        return false;
                } finally {
                        // release memory in IE
                        div = null;
                }
        },

        // Check if getElementsByTagName("*") returns only elements
        assertTagNameNoComments = assert(function( div ) {
                div.appendChild( document.createComment("") );
                return !div.getElementsByTagName("*").length;
        }),

        // Check if getAttribute returns normalized href attributes
        assertHrefNotNormalized = assert(function( div ) {
                div.innerHTML = "<a href='#'></a>";
                return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
                        div.firstChild.getAttribute("href") === "#";
        }),

        // Check if attributes should be retrieved by attribute nodes
        assertAttributes = assert(function( div ) {
                div.innerHTML = "<select></select>";
                var type = typeof div.lastChild.getAttribute("multiple");
                // IE8 returns a string for some attributes even when not present
                return type !== "boolean" && type !== "string";
        }),

        // Check if getElementsByClassName can be trusted
        assertUsableClassName = assert(function( div ) {
                // Opera can't find a second classname (in 9.6)
                div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
                if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
                        return false;
                }

                // Safari 3.2 caches class attributes and doesn't catch changes
                div.lastChild.className = "e";
                return div.getElementsByClassName("e").length === 2;
        }),

        // Check if getElementById returns elements by name
        // Check if getElementsByName privileges form controls or returns elements by ID
        assertUsableName = assert(function( div ) {
                // Inject content
                div.id = expando + 0;
                div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
                docElem.insertBefore( div, docElem.firstChild );

                // Test
                var pass = document.getElementsByName &&
                        // buggy browsers will return fewer than the correct 2
                        document.getElementsByName( expando ).length === 2 +
                        // buggy browsers will return more than the correct 0
                        document.getElementsByName( expando + 0 ).length;
                assertGetIdNotName = !document.getElementById( expando );

                // Cleanup
                docElem.removeChild( div );

                return pass;
        });

// If slice is not available, provide a backup
try {
        slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
        slice = function( i ) {
                var elem,
                        results = [];
                for ( ; (elem = this[i]); i++ ) {
                        results.push( elem );
                }
                return results;
        };
}

function Sizzle( selector, context, results, seed ) {
        results = results || [];
        context = context || document;
        var match, elem, xml, m,
                nodeType = context.nodeType;

        if ( !selector || typeof selector !== "string" ) {
                return results;
        }

        if ( nodeType !== 1 && nodeType !== 9 ) {
                return [];
        }

        xml = isXML( context );

        if ( !xml && !seed ) {
                if ( (match = rquickExpr.exec( selector )) ) {
                        // Speed-up: Sizzle("#ID")
                        if ( (m = match[1]) ) {
                                if ( nodeType === 9 ) {
                                        elem = context.getElementById( m );
                                        // Check parentNode to catch when Blackberry 4.6 returns
                                        // nodes that are no longer in the document #6963
                                        if ( elem && elem.parentNode ) {
                                                // Handle the case where IE, Opera, and Webkit return items
                                                // by name instead of ID
                                                if ( elem.id === m ) {
                                                        results.push( elem );
                                                        return results;
                                                }
                                        } else {
                                                return results;
                                        }
                                } else {
                                        // Context is not a document
                                        if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                                                contains( context, elem ) && elem.id === m ) {
                                                results.push( elem );
                                                return results;
                                        }
                                }

                        // Speed-up: Sizzle("TAG")
                        } else if ( match[2] ) {
                                push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
                                return results;

                        // Speed-up: Sizzle(".CLASS")
                        } else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
                                push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
                                return results;
                        }
                }
        }

        // All others
        return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
        return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
        return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
        return function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
        };
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
        return function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
        };
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
        return markFunction(function( argument ) {
                argument = +argument;
                return markFunction(function( seed, matches ) {
                        var j,
                                matchIndexes = fn( [], seed.length, argument ),
                                i = matchIndexes.length;

                        // Match elements found at the specified indexes
                        while ( i-- ) {
                                if ( seed[ (j = matchIndexes[i]) ] ) {
                                        seed[j] = !(matches[j] = seed[j]);
                                }
                        }
                });
        });
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
        var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;

        if ( nodeType ) {
                if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
                        // Use textContent for elements
                        // innerText usage removed for consistency of new lines (see #11153)
                        if ( typeof elem.textContent === "string" ) {
                                return elem.textContent;
                        } else {
                                // Traverse its children
                                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                                        ret += getText( elem );
                                }
                        }
                } else if ( nodeType === 3 || nodeType === 4 ) {
                        return elem.nodeValue;
                }
                // Do not include comment or processing instruction nodes
        } else {

                // If no nodeType, this is expected to be an array
                for ( ; (node = elem[i]); i++ ) {
                        // Do not traverse comment nodes
                        ret += getText( node );
                }
        }
        return ret;
};

isXML = Sizzle.isXML = function( elem ) {
        // documentElement is verified for cases where it doesn't yet exist
        // (such as loading iframes in IE - #4833)
        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
        function( a, b ) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                        bup = b && b.parentNode;
                return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
        } :
        docElem.compareDocumentPosition ?
        function( a, b ) {
                return b && !!( a.compareDocumentPosition( b ) & 16 );
        } :
        function( a, b ) {
                while ( (b = b.parentNode) ) {
                        if ( b === a ) {
                                return true;
                        }
                }
                return false;
        };

Sizzle.attr = function( elem, name ) {
        var val,
                xml = isXML( elem );

        if ( !xml ) {
                name = name.toLowerCase();
        }
        if ( (val = Expr.attrHandle[ name ]) ) {
                return val( elem );
        }
        if ( xml || assertAttributes ) {
                return elem.getAttribute( name );
        }
        val = elem.getAttributeNode( name );
        return val ?
                typeof elem[ name ] === "boolean" ?
                        elem[ name ] ? name : null :
                        val.specified ? val.value : null :
                null;
};

Expr = Sizzle.selectors = {

        // Can be adjusted by the user
        cacheLength: 50,

        createPseudo: markFunction,

        match: matchExpr,

        // IE6/7 return a modified href
        attrHandle: assertHrefNotNormalized ?
                {} :
                {
                        "href": function( elem ) {
                                return elem.getAttribute( "href", 2 );
                        },
                        "type": function( elem ) {
                                return elem.getAttribute("type");
                        }
                },

        find: {
                "ID": assertGetIdNotName ?
                        function( id, context, xml ) {
                                if ( typeof context.getElementById !== strundefined && !xml ) {
                                        var m = context.getElementById( id );
                                        // Check parentNode to catch when Blackberry 4.6 returns
                                        // nodes that are no longer in the document #6963
                                        return m && m.parentNode ? [m] : [];
                                }
                        } :
                        function( id, context, xml ) {
                                if ( typeof context.getElementById !== strundefined && !xml ) {
                                        var m = context.getElementById( id );

                                        return m ?
                                                m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
                                                        [m] :
                                                        undefined :
                                                [];
                                }
                        },

                "TAG": assertTagNameNoComments ?
                        function( tag, context ) {
                                if ( typeof context.getElementsByTagName !== strundefined ) {
                                        return context.getElementsByTagName( tag );
                                }
                        } :
                        function( tag, context ) {
                                var results = context.getElementsByTagName( tag );

                                // Filter out possible comments
                                if ( tag === "*" ) {
                                        var elem,
                                                tmp = [],
                                                i = 0;

                                        for ( ; (elem = results[i]); i++ ) {
                                                if ( elem.nodeType === 1 ) {
                                                        tmp.push( elem );
                                                }
                                        }

                                        return tmp;
                                }
                                return results;
                        },

                "NAME": assertUsableName && function( tag, context ) {
                        if ( typeof context.getElementsByName !== strundefined ) {
                                return context.getElementsByName( name );
                        }
                },

                "CLASS": assertUsableClassName && function( className, context, xml ) {
                        if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
                                return context.getElementsByClassName( className );
                        }
                }
        },

        relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" }
        },

        preFilter: {
                "ATTR": function( match ) {
                        match[1] = match[1].replace( rbackslash, "" );

                        // Move the given value to match[3] whether quoted or unquoted
                        match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

                        if ( match[2] === "~=" ) {
                                match[3] = " " + match[3] + " ";
                        }

                        return match.slice( 0, 4 );
                },

                "CHILD": function( match ) {
                        /* matches from matchExpr["CHILD"]
                                1 type (only|nth|...)
                                2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                                3 xn-component of xn+y argument ([+-]?\d*n|)
                                4 sign of xn-component
                                5 x of xn-component
                                6 sign of y-component
                                7 y of y-component
                        */
                        match[1] = match[1].toLowerCase();

                        if ( match[1] === "nth" ) {
                                // nth-child requires argument
                                if ( !match[2] ) {
                                        Sizzle.error( match[0] );
                                }

                                // numeric x and y parameters for Expr.filter.CHILD
                                // remember that false/true cast respectively to 0/1
                                match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
                                match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

                        // other types prohibit arguments
                        } else if ( match[2] ) {
                                Sizzle.error( match[0] );
                        }

                        return match;
                },

                "PSEUDO": function( match ) {
                        var unquoted, excess;
                        if ( matchExpr["CHILD"].test( match[0] ) ) {
                                return null;
                        }

                        if ( match[3] ) {
                                match[2] = match[3];
                        } else if ( (unquoted = match[4]) ) {
                                // Only check arguments that contain a pseudo
                                if ( rpseudo.test(unquoted) &&
                                        // Get excess from tokenize (recursively)
                                        (excess = tokenize( unquoted, true )) &&
                                        // advance to the next closing parenthesis
                                        (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                                        // excess is a negative index
                                        unquoted = unquoted.slice( 0, excess );
                                        match[0] = match[0].slice( 0, excess );
                                }
                                match[2] = unquoted;
                        }

                        // Return only captures needed by the pseudo filter method (type and argument)
                        return match.slice( 0, 3 );
                }
        },

        filter: {
                "ID": assertGetIdNotName ?
                        function( id ) {
                                id = id.replace( rbackslash, "" );
                                return function( elem ) {
                                        return elem.getAttribute("id") === id;
                                };
                        } :
                        function( id ) {
                                id = id.replace( rbackslash, "" );
                                return function( elem ) {
                                        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                                        return node && node.value === id;
                                };
                        },

                "TAG": function( nodeName ) {
                        if ( nodeName === "*" ) {
                                return function() { return true; };
                        }
                        nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

                        return function( elem ) {
                                return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                        };
                },

                "CLASS": function( className ) {
                        var pattern = classCache[ expando ][ className + " " ];

                        return pattern ||
                                (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                                classCache( className, function( elem ) {
                                        return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
                                });
                },

                "ATTR": function( name, operator, check ) {
                        return function( elem, context ) {
                                var result = Sizzle.attr( elem, name );

                                if ( result == null ) {
                                        return operator === "!=";
                                }
                                if ( !operator ) {
                                        return true;
                                }

                                result += "";

                                return operator === "=" ? result === check :
                                        operator === "!=" ? result !== check :
                                        operator === "^=" ? check && result.indexOf( check ) === 0 :
                                        operator === "*=" ? check && result.indexOf( check ) > -1 :
                                        operator === "$=" ? check && result.substr( result.length - check.length ) === check :
                                        operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                                        operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
                                        false;
                        };
                },

                "CHILD": function( type, argument, first, last ) {

                        if ( type === "nth" ) {
                                return function( elem ) {
                                        var node, diff,
                                                parent = elem.parentNode;

                                        if ( first === 1 && last === 0 ) {
                                                return true;
                                        }

                                        if ( parent ) {
                                                diff = 0;
                                                for ( node = parent.firstChild; node; node = node.nextSibling ) {
                                                        if ( node.nodeType === 1 ) {
                                                                diff++;
                                                                if ( elem === node ) {
                                                                        break;
                                                                }
                                                        }
                                                }
                                        }

                                        // Incorporate the offset (or cast to NaN), then check against cycle size
                                        diff -= last;
                                        return diff === first || ( diff % first === 0 && diff / first >= 0 );
                                };
                        }

                        return function( elem ) {
                                var node = elem;

                                switch ( type ) {
                                        case "only":
                                        case "first":
                                                while ( (node = node.previousSibling) ) {
                                                        if ( node.nodeType === 1 ) {
                                                                return false;
                                                        }
                                                }

                                                if ( type === "first" ) {
                                                        return true;
                                                }

                                                node = elem;

                                                /* falls through */
                                        case "last":
                                                while ( (node = node.nextSibling) ) {
                                                        if ( node.nodeType === 1 ) {
                                                                return false;
                                                        }
                                                }

                                                return true;
                                }
                        };
                },

                "PSEUDO": function( pseudo, argument ) {
                        // pseudo-class names are case-insensitive
                        // http://www.w3.org/TR/selectors/#pseudo-classes
                        // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                        // Remember that setFilters inherits from pseudos
                        var args,
                                fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                                        Sizzle.error( "unsupported pseudo: " + pseudo );

                        // The user may use createPseudo to indicate that
                        // arguments are needed to create the filter function
                        // just as Sizzle does
                        if ( fn[ expando ] ) {
                                return fn( argument );
                        }

                        // But maintain support for old signatures
                        if ( fn.length > 1 ) {
                                args = [ pseudo, pseudo, "", argument ];
                                return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                                        markFunction(function( seed, matches ) {
                                                var idx,
                                                        matched = fn( seed, argument ),
                                                        i = matched.length;
                                                while ( i-- ) {
                                                        idx = indexOf.call( seed, matched[i] );
                                                        seed[ idx ] = !( matches[ idx ] = matched[i] );
                                                }
                                        }) :
                                        function( elem ) {
                                                return fn( elem, 0, args );
                                        };
                        }

                        return fn;
                }
        },

        pseudos: {
                "not": markFunction(function( selector ) {
                        // Trim the selector passed to compile
                        // to avoid treating leading and trailing
                        // spaces as combinators
                        var input = [],
                                results = [],
                                matcher = compile( selector.replace( rtrim, "$1" ) );

                        return matcher[ expando ] ?
                                markFunction(function( seed, matches, context, xml ) {
                                        var elem,
                                                unmatched = matcher( seed, null, xml, [] ),
                                                i = seed.length;

                                        // Match elements unmatched by `matcher`
                                        while ( i-- ) {
                                                if ( (elem = unmatched[i]) ) {
                                                        seed[i] = !(matches[i] = elem);
                                                }
                                        }
                                }) :
                                function( elem, context, xml ) {
                                        input[0] = elem;
                                        matcher( input, null, xml, results );
                                        return !results.pop();
                                };
                }),

                "has": markFunction(function( selector ) {
                        return function( elem ) {
                                return Sizzle( selector, elem ).length > 0;
                        };
                }),

                "contains": markFunction(function( text ) {
                        return function( elem ) {
                                return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
                        };
                }),

                "enabled": function( elem ) {
                        return elem.disabled === false;
                },

                "disabled": function( elem ) {
                        return elem.disabled === true;
                },

                "checked": function( elem ) {
                        // In CSS3, :checked should return both checked and selected elements
                        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                        var nodeName = elem.nodeName.toLowerCase();
                        return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },

                "selected": function( elem ) {
                        // Accessing this property makes selected-by-default
                        // options in Safari work properly
                        if ( elem.parentNode ) {
                                elem.parentNode.selectedIndex;
                        }

                        return elem.selected === true;
                },

                "parent": function( elem ) {
                        return !Expr.pseudos["empty"]( elem );
                },

                "empty": function( elem ) {
                        // http://www.w3.org/TR/selectors/#empty-pseudo
                        // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
                        //   not comment, processing instructions, or others
                        // Thanks to Diego Perini for the nodeName shortcut
                        //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
                        var nodeType;
                        elem = elem.firstChild;
                        while ( elem ) {
                                if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
                                        return false;
                                }
                                elem = elem.nextSibling;
                        }
                        return true;
                },

                "header": function( elem ) {
                        return rheader.test( elem.nodeName );
                },

                "text": function( elem ) {
                        var type, attr;
                        // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                        // use getAttribute instead to test this case
                        return elem.nodeName.toLowerCase() === "input" &&
                                (type = elem.type) === "text" &&
                                ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
                },

                // Input types
                "radio": createInputPseudo("radio"),
                "checkbox": createInputPseudo("checkbox"),
                "file": createInputPseudo("file"),
                "password": createInputPseudo("password"),
                "image": createInputPseudo("image"),

                "submit": createButtonPseudo("submit"),
                "reset": createButtonPseudo("reset"),

                "button": function( elem ) {
                        var name = elem.nodeName.toLowerCase();
                        return name === "input" && elem.type === "button" || name === "button";
                },

                "input": function( elem ) {
                        return rinputs.test( elem.nodeName );
                },

                "focus": function( elem ) {
                        var doc = elem.ownerDocument;
                        return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },

                "active": function( elem ) {
                        return elem === elem.ownerDocument.activeElement;
                },

                // Positional types
                "first": createPositionalPseudo(function() {
                        return [ 0 ];
                }),

                "last": createPositionalPseudo(function( matchIndexes, length ) {
                        return [ length - 1 ];
                }),

                "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
                        return [ argument < 0 ? argument + length : argument ];
                }),

                "even": createPositionalPseudo(function( matchIndexes, length ) {
                        for ( var i = 0; i < length; i += 2 ) {
                                matchIndexes.push( i );
                        }
                        return matchIndexes;
                }),

                "odd": createPositionalPseudo(function( matchIndexes, length ) {
                        for ( var i = 1; i < length; i += 2 ) {
                                matchIndexes.push( i );
                        }
                        return matchIndexes;
                }),

                "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                        for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
                                matchIndexes.push( i );
                        }
                        return matchIndexes;
                }),

                "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                        for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
                                matchIndexes.push( i );
                        }
                        return matchIndexes;
                })
        }
};

function siblingCheck( a, b, ret ) {
        if ( a === b ) {
                return ret;
        }

        var cur = a.nextSibling;

        while ( cur ) {
                if ( cur === b ) {
                        return -1;
                }

                cur = cur.nextSibling;
        }

        return 1;
}

sortOrder = docElem.compareDocumentPosition ?
        function( a, b ) {
                if ( a === b ) {
                        hasDuplicate = true;
                        return 0;
                }

                return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
                        a.compareDocumentPosition :
                        a.compareDocumentPosition(b) & 4
                ) ? -1 : 1;
        } :
        function( a, b ) {
                // The nodes are identical, we can exit early
                if ( a === b ) {
                        hasDuplicate = true;
                        return 0;

                // Fallback to using sourceIndex (in IE) if it's available on both nodes
                } else if ( a.sourceIndex && b.sourceIndex ) {
                        return a.sourceIndex - b.sourceIndex;
                }

                var al, bl,
                        ap = [],
                        bp = [],
                        aup = a.parentNode,
                        bup = b.parentNode,
                        cur = aup;

                // If the nodes are siblings (or identical) we can do a quick check
                if ( aup === bup ) {
                        return siblingCheck( a, b );

                // If no parents were found then the nodes are disconnected
                } else if ( !aup ) {
                        return -1;

                } else if ( !bup ) {
                        return 1;
                }

                // Otherwise they're somewhere else in the tree so we need
                // to build up a full list of the parentNodes for comparison
                while ( cur ) {
                        ap.unshift( cur );
                        cur = cur.parentNode;
                }

                cur = bup;

                while ( cur ) {
                        bp.unshift( cur );
                        cur = cur.parentNode;
                }

                al = ap.length;
                bl = bp.length;

                // Start walking down the tree looking for a discrepancy
                for ( var i = 0; i < al && i < bl; i++ ) {
                        if ( ap[i] !== bp[i] ) {
                                return siblingCheck( ap[i], bp[i] );
                        }
                }

                // We ended someplace up the tree so do a sibling check
                return i === al ?
                        siblingCheck( a, bp[i], -1 ) :
                        siblingCheck( ap[i], b, 1 );
        };

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
        var elem,
                duplicates = [],
                i = 1,
                j = 0;

        hasDuplicate = baseHasDuplicate;
        results.sort( sortOrder );

        if ( hasDuplicate ) {
                for ( ; (elem = results[i]); i++ ) {
                        if ( elem === results[ i - 1 ] ) {
                                j = duplicates.push( i );
                        }
                }
                while ( j-- ) {
                        results.splice( duplicates[ j ], 1 );
                }
        }

        return results;
};

Sizzle.error = function( msg ) {
        throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
        var matched, match, tokens, type,
                soFar, groups, preFilters,
                cached = tokenCache[ expando ][ selector + " " ];

        if ( cached ) {
                return parseOnly ? 0 : cached.slice( 0 );
        }

        soFar = selector;
        groups = [];
        preFilters = Expr.preFilter;

        while ( soFar ) {

                // Comma and first run
                if ( !matched || (match = rcomma.exec( soFar )) ) {
                        if ( match ) {
                                // Don't consume trailing commas as valid
                                soFar = soFar.slice( match[0].length ) || soFar;
                        }
                        groups.push( tokens = [] );
                }

                matched = false;

                // Combinators
                if ( (match = rcombinators.exec( soFar )) ) {
                        tokens.push( matched = new Token( match.shift() ) );
                        soFar = soFar.slice( matched.length );

                        // Cast descendant combinators to space
                        matched.type = match[0].replace( rtrim, " " );
                }

                // Filters
                for ( type in Expr.filter ) {
                        if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                                (match = preFilters[ type ]( match ))) ) {

                                tokens.push( matched = new Token( match.shift() ) );
                                soFar = soFar.slice( matched.length );
                                matched.type = type;
                                matched.matches = match;
                        }
                }

                if ( !matched ) {
                        break;
                }
        }

        // Return the length of the invalid excess
        // if we're just parsing
        // Otherwise, throw an error or return tokens
        return parseOnly ?
                soFar.length :
                soFar ?
                        Sizzle.error( selector ) :
                        // Cache the tokens
                        tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
        var dir = combinator.dir,
                checkNonElements = base && combinator.dir === "parentNode",
                doneName = done++;

        return combinator.first ?
                // Check against closest ancestor/preceding element
                function( elem, context, xml ) {
                        while ( (elem = elem[ dir ]) ) {
                                if ( checkNonElements || elem.nodeType === 1  ) {
                                        return matcher( elem, context, xml );
                                }
                        }
                } :

                // Check against all ancestor/preceding elements
                function( elem, context, xml ) {
                        // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                        if ( !xml ) {
                                var cache,
                                        dirkey = dirruns + " " + doneName + " ",
                                        cachedkey = dirkey + cachedruns;
                                while ( (elem = elem[ dir ]) ) {
                                        if ( checkNonElements || elem.nodeType === 1 ) {
                                                if ( (cache = elem[ expando ]) === cachedkey ) {
                                                        return elem.sizset;
                                                } else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
                                                        if ( elem.sizset ) {
                                                                return elem;
                                                        }
                                                } else {
                                                        elem[ expando ] = cachedkey;
                                                        if ( matcher( elem, context, xml ) ) {
                                                                elem.sizset = true;
                                                                return elem;
                                                        }
                                                        elem.sizset = false;
                                                }
                                        }
                                }
                        } else {
                                while ( (elem = elem[ dir ]) ) {
                                        if ( checkNonElements || elem.nodeType === 1 ) {
                                                if ( matcher( elem, context, xml ) ) {
                                                        return elem;
                                                }
                                        }
                                }
                        }
                };
}

function elementMatcher( matchers ) {
        return matchers.length > 1 ?
                function( elem, context, xml ) {
                        var i = matchers.length;
                        while ( i-- ) {
                                if ( !matchers[i]( elem, context, xml ) ) {
                                        return false;
                                }
                        }
                        return true;
                } :
                matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
        var elem,
                newUnmatched = [],
                i = 0,
                len = unmatched.length,
                mapped = map != null;

        for ( ; i < len; i++ ) {
                if ( (elem = unmatched[i]) ) {
                        if ( !filter || filter( elem, context, xml ) ) {
                                newUnmatched.push( elem );
                                if ( mapped ) {
                                        map.push( i );
                                }
                        }
                }
        }

        return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
        if ( postFilter && !postFilter[ expando ] ) {
                postFilter = setMatcher( postFilter );
        }
        if ( postFinder && !postFinder[ expando ] ) {
                postFinder = setMatcher( postFinder, postSelector );
        }
        return markFunction(function( seed, results, context, xml ) {
                var temp, i, elem,
                        preMap = [],
                        postMap = [],
                        preexisting = results.length,

                        // Get initial elements from seed or context
                        elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

                        // Prefilter to get matcher input, preserving a map for seed-results synchronization
                        matcherIn = preFilter && ( seed || !selector ) ?
                                condense( elems, preMap, preFilter, context, xml ) :
                                elems,

                        matcherOut = matcher ?
                                // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                                postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                                        // ...intermediate processing is necessary
                                        [] :

                                        // ...otherwise use results directly
                                        results :
                                matcherIn;

                // Find primary matches
                if ( matcher ) {
                        matcher( matcherIn, matcherOut, context, xml );
                }

                // Apply postFilter
                if ( postFilter ) {
                        temp = condense( matcherOut, postMap );
                        postFilter( temp, [], context, xml );

                        // Un-match failing elements by moving them back to matcherIn
                        i = temp.length;
                        while ( i-- ) {
                                if ( (elem = temp[i]) ) {
                                        matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                                }
                        }
                }

                if ( seed ) {
                        if ( postFinder || preFilter ) {
                                if ( postFinder ) {
                                        // Get the final matcherOut by condensing this intermediate into postFinder contexts
                                        temp = [];
                                        i = matcherOut.length;
                                        while ( i-- ) {
                                                if ( (elem = matcherOut[i]) ) {
                                                        // Restore matcherIn since elem is not yet a final match
                                                        temp.push( (matcherIn[i] = elem) );
                                                }
                                        }
                                        postFinder( null, (matcherOut = []), temp, xml );
                                }

                                // Move matched elements from seed to results to keep them synchronized
                                i = matcherOut.length;
                                while ( i-- ) {
                                        if ( (elem = matcherOut[i]) &&
                                                (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

                                                seed[temp] = !(results[temp] = elem);
                                        }
                                }
                        }

                // Add elements to results, through postFinder if defined
                } else {
                        matcherOut = condense(
                                matcherOut === results ?
                                        matcherOut.splice( preexisting, matcherOut.length ) :
                                        matcherOut
                        );
                        if ( postFinder ) {
                                postFinder( null, results, matcherOut, xml );
                        } else {
                                push.apply( results, matcherOut );
                        }
                }
        });
}

function matcherFromTokens( tokens ) {
        var checkContext, matcher, j,
                len = tokens.length,
                leadingRelative = Expr.relative[ tokens[0].type ],
                implicitRelative = leadingRelative || Expr.relative[" "],
                i = leadingRelative ? 1 : 0,

                // The foundational matcher ensures that elements are reachable from top-level context(s)
                matchContext = addCombinator( function( elem ) {
                        return elem === checkContext;
                }, implicitRelative, true ),
                matchAnyContext = addCombinator( function( elem ) {
                        return indexOf.call( checkContext, elem ) > -1;
                }, implicitRelative, true ),
                matchers = [ function( elem, context, xml ) {
                        return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                                (checkContext = context).nodeType ?
                                        matchContext( elem, context, xml ) :
                                        matchAnyContext( elem, context, xml ) );
                } ];

        for ( ; i < len; i++ ) {
                if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
                        matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
                } else {
                        matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

                        // Return special upon seeing a positional matcher
                        if ( matcher[ expando ] ) {
                                // Find the next relative operator (if any) for proper handling
                                j = ++i;
                                for ( ; j < len; j++ ) {
                                        if ( Expr.relative[ tokens[j].type ] ) {
                                                break;
                                        }
                                }
                                return setMatcher(
                                        i > 1 && elementMatcher( matchers ),
                                        i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
                                        matcher,
                                        i < j && matcherFromTokens( tokens.slice( i, j ) ),
                                        j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                                        j < len && tokens.join("")
                                );
                        }
                        matchers.push( matcher );
                }
        }

        return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
        var bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function( seed, context, xml, results, expandContext ) {
                        var elem, j, matcher,
                                setMatched = [],
                                matchedCount = 0,
                                i = "0",
                                unmatched = seed && [],
                                outermost = expandContext != null,
                                contextBackup = outermostContext,
                                // We must always have either seed elements or context
                                elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
                                // Nested matchers should use non-integer dirruns
                                dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

                        if ( outermost ) {
                                outermostContext = context !== document && context;
                                cachedruns = superMatcher.el;
                        }

                        // Add elements passing elementMatchers directly to results
                        for ( ; (elem = elems[i]) != null; i++ ) {
                                if ( byElement && elem ) {
                                        for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
                                                if ( matcher( elem, context, xml ) ) {
                                                        results.push( elem );
                                                        break;
                                                }
                                        }
                                        if ( outermost ) {
                                                dirruns = dirrunsUnique;
                                                cachedruns = ++superMatcher.el;
                                        }
                                }

                                // Track unmatched elements for set filters
                                if ( bySet ) {
                                        // They will have gone through all possible matchers
                                        if ( (elem = !matcher && elem) ) {
                                                matchedCount--;
                                        }

                                        // Lengthen the array for every element, matched or not
                                        if ( seed ) {
                                                unmatched.push( elem );
                                        }
                                }
                        }

                        // Apply set filters to unmatched elements
                        matchedCount += i;
                        if ( bySet && i !== matchedCount ) {
                                for ( j = 0; (matcher = setMatchers[j]); j++ ) {
                                        matcher( unmatched, setMatched, context, xml );
                                }

                                if ( seed ) {
                                        // Reintegrate element matches to eliminate the need for sorting
                                        if ( matchedCount > 0 ) {
                                                while ( i-- ) {
                                                        if ( !(unmatched[i] || setMatched[i]) ) {
                                                                setMatched[i] = pop.call( results );
                                                        }
                                                }
                                        }

                                        // Discard index placeholder values to get only actual matches
                                        setMatched = condense( setMatched );
                                }

                                // Add matches to results
                                push.apply( results, setMatched );

                                // Seedless set matches succeeding multiple successful matchers stipulate sorting
                                if ( outermost && !seed && setMatched.length > 0 &&
                                        ( matchedCount + setMatchers.length ) > 1 ) {

                                        Sizzle.uniqueSort( results );
                                }
                        }

                        // Override manipulation of globals by nested matchers
                        if ( outermost ) {
                                dirruns = dirrunsUnique;
                                outermostContext = contextBackup;
                        }

                        return unmatched;
                };

        superMatcher.el = 0;
        return bySet ?
                markFunction( superMatcher ) :
                superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
        var i,
                setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[ expando ][ selector + " " ];

        if ( !cached ) {
                // Generate a function of recursive functions that can be used to check each element
                if ( !group ) {
                        group = tokenize( selector );
                }
                i = group.length;
                while ( i-- ) {
                        cached = matcherFromTokens( group[i] );
                        if ( cached[ expando ] ) {
                                setMatchers.push( cached );
                        } else {
                                elementMatchers.push( cached );
                        }
                }

                // Cache the compiled function
                cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
        }
        return cached;
};

function multipleContexts( selector, contexts, results ) {
        var i = 0,
                len = contexts.length;
        for ( ; i < len; i++ ) {
                Sizzle( selector, contexts[i], results );
        }
        return results;
}

function select( selector, context, results, seed, xml ) {
        var i, tokens, token, type, find,
                match = tokenize( selector ),
                j = match.length;

        if ( !seed ) {
                // Try to minimize operations if there is only one group
                if ( match.length === 1 ) {

                        // Take a shortcut and set the context if the root selector is an ID
                        tokens = match[0] = match[0].slice( 0 );
                        if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                                        context.nodeType === 9 && !xml &&
                                        Expr.relative[ tokens[1].type ] ) {

                                context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
                                if ( !context ) {
                                        return results;
                                }

                                selector = selector.slice( tokens.shift().length );
                        }

                        // Fetch a seed set for right-to-left matching
                        for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
                                token = tokens[i];

                                // Abort if we hit a combinator
                                if ( Expr.relative[ (type = token.type) ] ) {
                                        break;
                                }
                                if ( (find = Expr.find[ type ]) ) {
                                        // Search, expanding context for leading sibling combinators
                                        if ( (seed = find(
                                                token.matches[0].replace( rbackslash, "" ),
                                                rsibling.test( tokens[0].type ) && context.parentNode || context,
                                                xml
                                        )) ) {

                                                // If seed is empty or no tokens remain, we can return early
                                                tokens.splice( i, 1 );
                                                selector = seed.length && tokens.join("");
                                                if ( !selector ) {
                                                        push.apply( results, slice.call( seed, 0 ) );
                                                        return results;
                                                }

                                                break;
                                        }
                                }
                        }
                }
        }

        // Compile and execute a filtering function
        // Provide `match` to avoid retokenization if we modified the selector above
        compile( selector, match )(
                seed,
                context,
                xml,
                results,
                rsibling.test( selector )
        );
        return results;
}

if ( document.querySelectorAll ) {
        (function() {
                var disconnectedMatch,
                        oldSelect = select,
                        rescape = /'|\\/g,
                        rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

                        // qSa(:focus) reports false when true (Chrome 21), no need to also add to buggyMatches since matches checks buggyQSA
                        // A support test would require too much code (would include document ready)
                        rbuggyQSA = [ ":focus" ],

                        // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
                        // A support test would require too much code (would include document ready)
                        // just skip matchesSelector for :active
                        rbuggyMatches = [ ":active" ],
                        matches = docElem.matchesSelector ||
                                docElem.mozMatchesSelector ||
                                docElem.webkitMatchesSelector ||
                                docElem.oMatchesSelector ||
                                docElem.msMatchesSelector;

                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function( div ) {
                        // Select is set to empty string on purpose
                        // This is to test IE's treatment of not explictly
                        // setting a boolean content attribute,
                        // since its presence should be enough
                        // http://bugs.jquery.com/ticket/12359
                        div.innerHTML = "<select><option selected=''></option></select>";

                        // IE8 - Some boolean attributes are not treated correctly
                        if ( !div.querySelectorAll("[selected]").length ) {
                                rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
                        }

                        // Webkit/Opera - :checked should return selected option elements
                        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                        // IE8 throws error here (do not put tests after this one)
                        if ( !div.querySelectorAll(":checked").length ) {
                                rbuggyQSA.push(":checked");
                        }
                });

                assert(function( div ) {

                        // Opera 10-12/IE9 - ^= $= *= and empty values
                        // Should not select anything
                        div.innerHTML = "<p test=''></p>";
                        if ( div.querySelectorAll("[test^='']").length ) {
                                rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
                        }

                        // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                        // IE8 throws error here (do not put tests after this one)
                        div.innerHTML = "<input type='hidden'/>";
                        if ( !div.querySelectorAll(":enabled").length ) {
                                rbuggyQSA.push(":enabled", ":disabled");
                        }
                });

                // rbuggyQSA always contains :focus, so no need for a length check
                rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

                select = function( selector, context, results, seed, xml ) {
                        // Only use querySelectorAll when not filtering,
                        // when this is not xml,
                        // and when no QSA bugs apply
                        if ( !seed && !xml && !rbuggyQSA.test( selector ) ) {
                                var groups, i,
                                        old = true,
                                        nid = expando,
                                        newContext = context,
                                        newSelector = context.nodeType === 9 && selector;

                                // qSA works strangely on Element-rooted queries
                                // We can work around this by specifying an extra ID on the root
                                // and working up from there (Thanks to Andrew Dupont for the technique)
                                // IE 8 doesn't work on object elements
                                if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                                        groups = tokenize( selector );

                                        if ( (old = context.getAttribute("id")) ) {
                                                nid = old.replace( rescape, "\\$&" );
                                        } else {
                                                context.setAttribute( "id", nid );
                                        }
                                        nid = "[id='" + nid + "'] ";

                                        i = groups.length;
                                        while ( i-- ) {
                                                groups[i] = nid + groups[i].join("");
                                        }
                                        newContext = rsibling.test( selector ) && context.parentNode || context;
                                        newSelector = groups.join(",");
                                }

                                if ( newSelector ) {
                                        try {
                                                push.apply( results, slice.call( newContext.querySelectorAll(
                                                        newSelector
                                                ), 0 ) );
                                                return results;
                                        } catch(qsaError) {
                                        } finally {
                                                if ( !old ) {
                                                        context.removeAttribute("id");
                                                }
                                        }
                                }
                        }

                        return oldSelect( selector, context, results, seed, xml );
                };

                if ( matches ) {
                        assert(function( div ) {
                                // Check to see if it's possible to do matchesSelector
                                // on a disconnected node (IE 9)
                                disconnectedMatch = matches.call( div, "div" );

                                // This should fail with an exception
                                // Gecko does not error, returns false instead
                                try {
                                        matches.call( div, "[test!='']:sizzle" );
                                        rbuggyMatches.push( "!=", pseudos );
                                } catch ( e ) {}
                        });

                        // rbuggyMatches always contains :active and :focus, so no need for a length check
                        rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

                        Sizzle.matchesSelector = function( elem, expr ) {
                                // Make sure that attribute selectors are quoted
                                expr = expr.replace( rattributeQuotes, "='$1']" );

                                // rbuggyMatches always contains :active, so no need for an existence check
                                if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && !rbuggyQSA.test( expr ) ) {
                                        try {
                                                var ret = matches.call( elem, expr );

                                                // IE 9's matchesSelector returns false on disconnected nodes
                                                if ( ret || disconnectedMatch ||
                                                                // As well, disconnected nodes are said to be in a document
                                                                // fragment in IE 9
                                                                elem.document && elem.document.nodeType !== 11 ) {
                                                        return ret;
                                                }
                                        } catch(e) {}
                                }

                                return Sizzle( expr, null, null, [ elem ] ).length > 0;
                        };
                }
        })();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
        rparentsprev = /^(?:parents|prev(?:Until|All))/,
        isSimple = /^.[^:#\[\.,]*$/,
        rneedsContext = jQuery.expr.match.needsContext,
        // methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
                children: true,
                contents: true,
                next: true,
                prev: true
        };

jQuery.fn.extend({
        find: function( selector ) {
                var i, l, length, n, r, ret,
                        self = this;

                if ( typeof selector !== "string" ) {
                        return jQuery( selector ).filter(function() {
                                for ( i = 0, l = self.length; i < l; i++ ) {
                                        if ( jQuery.contains( self[ i ], this ) ) {
                                                return true;
                                        }
                                }
                        });
                }

                ret = this.pushStack( "", "find", selector );

                for ( i = 0, l = this.length; i < l; i++ ) {
                        length = ret.length;
                        jQuery.find( selector, this[i], ret );

                        if ( i > 0 ) {
                                // Make sure that the results are unique
                                for ( n = length; n < ret.length; n++ ) {
                                        for ( r = 0; r < length; r++ ) {
                                                if ( ret[r] === ret[n] ) {
                                                        ret.splice(n--, 1);
                                                        break;
                                                }
                                        }
                                }
                        }
                }

                return ret;
        },

        has: function( target ) {
                var i,
                        targets = jQuery( target, this ),
                        len = targets.length;

                return this.filter(function() {
                        for ( i = 0; i < len; i++ ) {
                                if ( jQuery.contains( this, targets[i] ) ) {
                                        return true;
                                }
                        }
                });
        },

        not: function( selector ) {
                return this.pushStack( winnow(this, selector, false), "not", selector);
        },

        filter: function( selector ) {
                return this.pushStack( winnow(this, selector, true), "filter", selector );
        },

        is: function( selector ) {
                return !!selector && (
                        typeof selector === "string" ?
                                // If this is a positional/relative selector, check membership in the returned set
                                // so $("p:first").is("p:last") won't return true for a doc with two "p".
                                rneedsContext.test( selector ) ?
                                        jQuery( selector, this.context ).index( this[0] ) >= 0 :
                                        jQuery.filter( selector, this ).length > 0 :
                                this.filter( selector ).length > 0 );
        },

        closest: function( selectors, context ) {
                var cur,
                        i = 0,
                        l = this.length,
                        ret = [],
                        pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
                                jQuery( selectors, context || this.context ) :
                                0;

                for ( ; i < l; i++ ) {
                        cur = this[i];

                        while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
                                if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
                                        ret.push( cur );
                                        break;
                                }
                                cur = cur.parentNode;
                        }
                }

                ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

                return this.pushStack( ret, "closest", selectors );
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function( elem ) {

                // No argument, return index in parent
                if ( !elem ) {
                        return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
                }

                // index in selector
                if ( typeof elem === "string" ) {
                        return jQuery.inArray( this[0], jQuery( elem ) );
                }

                // Locate the position of the desired element
                return jQuery.inArray(
                        // If it receives a jQuery object, the first element is used
                        elem.jquery ? elem[0] : elem, this );
        },

        add: function( selector, context ) {
                var set = typeof selector === "string" ?
                                jQuery( selector, context ) :
                                jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
                        all = jQuery.merge( this.get(), set );

                return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
                        all :
                        jQuery.unique( all ) );
        },

        addBack: function( selector ) {
                return this.add( selector == null ?
                        this.prevObject : this.prevObject.filter(selector)
                );
        }
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
        do {
                cur = cur[ dir ];
        } while ( cur && cur.nodeType !== 1 );

        return cur;
}

jQuery.each({
        parent: function( elem ) {
                var parent = elem.parentNode;
                return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function( elem ) {
                return jQuery.dir( elem, "parentNode" );
        },
        parentsUntil: function( elem, i, until ) {
                return jQuery.dir( elem, "parentNode", until );
        },
        next: function( elem ) {
                return sibling( elem, "nextSibling" );
        },
        prev: function( elem ) {
                return sibling( elem, "previousSibling" );
        },
        nextAll: function( elem ) {
                return jQuery.dir( elem, "nextSibling" );
        },
        prevAll: function( elem ) {
                return jQuery.dir( elem, "previousSibling" );
        },
        nextUntil: function( elem, i, until ) {
                return jQuery.dir( elem, "nextSibling", until );
        },
        prevUntil: function( elem, i, until ) {
                return jQuery.dir( elem, "previousSibling", until );
        },
        siblings: function( elem ) {
                return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
        },
        children: function( elem ) {
                return jQuery.sibling( elem.firstChild );
        },
        contents: function( elem ) {
                return jQuery.nodeName( elem, "iframe" ) ?
                        elem.contentDocument || elem.contentWindow.document :
                        jQuery.merge( [], elem.childNodes );
        }
}, function( name, fn ) {
        jQuery.fn[ name ] = function( until, selector ) {
                var ret = jQuery.map( this, fn, until );

                if ( !runtil.test( name ) ) {
                        selector = until;
                }

                if ( selector && typeof selector === "string" ) {
                        ret = jQuery.filter( selector, ret );
                }

                ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

                if ( this.length > 1 && rparentsprev.test( name ) ) {
                        ret = ret.reverse();
                }

                return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
        };
});

jQuery.extend({
        filter: function( expr, elems, not ) {
                if ( not ) {
                        expr = ":not(" + expr + ")";
                }

                return elems.length === 1 ?
                        jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
                        jQuery.find.matches(expr, elems);
        },

        dir: function( elem, dir, until ) {
                var matched = [],
                        cur = elem[ dir ];

                while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
                        if ( cur.nodeType === 1 ) {
                                matched.push( cur );
                        }
                        cur = cur[dir];
                }
                return matched;
        },

        sibling: function( n, elem ) {
                var r = [];

                for ( ; n; n = n.nextSibling ) {
                        if ( n.nodeType === 1 && n !== elem ) {
                                r.push( n );
                        }
                }

                return r;
        }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

        // Can't pass null or undefined to indexOf in Firefox 4
        // Set to 0 to skip string check
        qualifier = qualifier || 0;

        if ( jQuery.isFunction( qualifier ) ) {
                return jQuery.grep(elements, function( elem, i ) {
                        var retVal = !!qualifier.call( elem, i, elem );
                        return retVal === keep;
                });

        } else if ( qualifier.nodeType ) {
                return jQuery.grep(elements, function( elem, i ) {
                        return ( elem === qualifier ) === keep;
                });

        } else if ( typeof qualifier === "string" ) {
                var filtered = jQuery.grep(elements, function( elem ) {
                        return elem.nodeType === 1;
                });

                if ( isSimple.test( qualifier ) ) {
                        return jQuery.filter(qualifier, filtered, !keep);
                } else {
                        qualifier = jQuery.filter( qualifier, filtered );
                }
        }

        return jQuery.grep(elements, function( elem, i ) {
                return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
        });
}
function createSafeFragment( document ) {
        var list = nodeNames.split( "|" ),
        safeFrag = document.createDocumentFragment();

        if ( safeFrag.createElement ) {
                while ( list.length ) {
                        safeFrag.createElement(
                                list.pop()
                        );
                }
        }
        return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
                "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style|link)/i,
        rnocache = /<(?:script|object|embed|option|style)/i,
        rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
        rcheckableType = /^(?:checkbox|radio)$/,
        // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /\/(java|ecma)script/i,
        rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
        wrapMap = {
                option: [ 1, "<select multiple='multiple'>", "</select>" ],
                legend: [ 1, "<fieldset>", "</fieldset>" ],
                thead: [ 1, "<table>", "</table>" ],
                tr: [ 2, "<table><tbody>", "</tbody></table>" ],
                td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
                col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
                area: [ 1, "<map>", "</map>" ],
                _default: [ 0, "", "" ]
        },
        safeFragment = createSafeFragment( document ),
        fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
        wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
        text: function( value ) {
                return jQuery.access( this, function( value ) {
                        return value === undefined ?
                                jQuery.text( this ) :
                                this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
                }, null, value, arguments.length );
        },

        wrapAll: function( html ) {
                if ( jQuery.isFunction( html ) ) {
                        return this.each(function(i) {
                                jQuery(this).wrapAll( html.call(this, i) );
                        });
                }

                if ( this[0] ) {
                        // The elements to wrap the target around
                        var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

                        if ( this[0].parentNode ) {
                                wrap.insertBefore( this[0] );
                        }

                        wrap.map(function() {
                                var elem = this;

                                while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                                        elem = elem.firstChild;
                                }

                                return elem;
                        }).append( this );
                }

                return this;
        },

        wrapInner: function( html ) {
                if ( jQuery.isFunction( html ) ) {
                        return this.each(function(i) {
                                jQuery(this).wrapInner( html.call(this, i) );
                        });
                }

                return this.each(function() {
                        var self = jQuery( this ),
                                contents = self.contents();

                        if ( contents.length ) {
                                contents.wrapAll( html );

                        } else {
                                self.append( html );
                        }
                });
        },

        wrap: function( html ) {
                var isFunction = jQuery.isFunction( html );

                return this.each(function(i) {
                        jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
                });
        },

        unwrap: function() {
                return this.parent().each(function() {
                        if ( !jQuery.nodeName( this, "body" ) ) {
                                jQuery( this ).replaceWith( this.childNodes );
                        }
                }).end();
        },

        append: function() {
                return this.domManip(arguments, true, function( elem ) {
                        if ( this.nodeType === 1 || this.nodeType === 11 ) {
                                this.appendChild( elem );
                        }
                });
        },

        prepend: function() {
                return this.domManip(arguments, true, function( elem ) {
                        if ( this.nodeType === 1 || this.nodeType === 11 ) {
                                this.insertBefore( elem, this.firstChild );
                        }
                });
        },

        before: function() {
                if ( !isDisconnected( this[0] ) ) {
                        return this.domManip(arguments, false, function( elem ) {
                                this.parentNode.insertBefore( elem, this );
                        });
                }

                if ( arguments.length ) {
                        var set = jQuery.clean( arguments );
                        return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
                }
        },

        after: function() {
                if ( !isDisconnected( this[0] ) ) {
                        return this.domManip(arguments, false, function( elem ) {
                                this.parentNode.insertBefore( elem, this.nextSibling );
                        });
                }

                if ( arguments.length ) {
                        var set = jQuery.clean( arguments );
                        return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
                }
        },

        // keepData is for internal use only--do not document
        remove: function( selector, keepData ) {
                var elem,
                        i = 0;

                for ( ; (elem = this[i]) != null; i++ ) {
                        if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
                                if ( !keepData && elem.nodeType === 1 ) {
                                        jQuery.cleanData( elem.getElementsByTagName("*") );
                                        jQuery.cleanData( [ elem ] );
                                }

                                if ( elem.parentNode ) {
                                        elem.parentNode.removeChild( elem );
                                }
                        }
                }

                return this;
        },

        empty: function() {
                var elem,
                        i = 0;

                for ( ; (elem = this[i]) != null; i++ ) {
                        // Remove element nodes and prevent memory leaks
                        if ( elem.nodeType === 1 ) {
                                jQuery.cleanData( elem.getElementsByTagName("*") );
                        }

                        // Remove any remaining nodes
                        while ( elem.firstChild ) {
                                elem.removeChild( elem.firstChild );
                        }
                }

                return this;
        },

        clone: function( dataAndEvents, deepDataAndEvents ) {
                dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
                deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

                return this.map( function () {
                        return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
                });
        },

        html: function( value ) {
                return jQuery.access( this, function( value ) {
                        var elem = this[0] || {},
                                i = 0,
                                l = this.length;

                        if ( value === undefined ) {
                                return elem.nodeType === 1 ?
                                        elem.innerHTML.replace( rinlinejQuery, "" ) :
                                        undefined;
                        }

                        // See if we can take a shortcut and just use innerHTML
                        if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
                                ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
                                ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
                                !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

                                value = value.replace( rxhtmlTag, "<$1></$2>" );

                                try {
                                        for (; i < l; i++ ) {
                                                // Remove element nodes and prevent memory leaks
                                                elem = this[i] || {};
                                                if ( elem.nodeType === 1 ) {
                                                        jQuery.cleanData( elem.getElementsByTagName( "*" ) );
                                                        elem.innerHTML = value;
                                                }
                                        }

                                        elem = 0;

                                // If using innerHTML throws an exception, use the fallback method
                                } catch(e) {}
                        }

                        if ( elem ) {
                                this.empty().append( value );
                        }
                }, null, value, arguments.length );
        },

        replaceWith: function( value ) {
                if ( !isDisconnected( this[0] ) ) {
                        // Make sure that the elements are removed from the DOM before they are inserted
                        // this can help fix replacing a parent with child elements
                        if ( jQuery.isFunction( value ) ) {
                                return this.each(function(i) {
                                        var self = jQuery(this), old = self.html();
                                        self.replaceWith( value.call( this, i, old ) );
                                });
                        }

                        if ( typeof value !== "string" ) {
                                value = jQuery( value ).detach();
                        }

                        return this.each(function() {
                                var next = this.nextSibling,
                                        parent = this.parentNode;

                                jQuery( this ).remove();

                                if ( next ) {
                                        jQuery(next).before( value );
                                } else {
                                        jQuery(parent).append( value );
                                }
                        });
                }

                return this.length ?
                        this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
                        this;
        },

        detach: function( selector ) {
                return this.remove( selector, true );
        },

        domManip: function( args, table, callback ) {

                // Flatten any nested arrays
                args = [].concat.apply( [], args );

                var results, first, fragment, iNoClone,
                        i = 0,
                        value = args[0],
                        scripts = [],
                        l = this.length;

                // We can't cloneNode fragments that contain checked, in WebKit
                if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
                        return this.each(function() {
                                jQuery(this).domManip( args, table, callback );
                        });
                }

                if ( jQuery.isFunction(value) ) {
                        return this.each(function(i) {
                                var self = jQuery(this);
                                args[0] = value.call( this, i, table ? self.html() : undefined );
                                self.domManip( args, table, callback );
                        });
                }

                if ( this[0] ) {
                        results = jQuery.buildFragment( args, this, scripts );
                        fragment = results.fragment;
                        first = fragment.firstChild;

                        if ( fragment.childNodes.length === 1 ) {
                                fragment = first;
                        }

                        if ( first ) {
                                table = table && jQuery.nodeName( first, "tr" );

                                // Use the original fragment for the last item instead of the first because it can end up
                                // being emptied incorrectly in certain situations (#8070).
                                // Fragments from the fragment cache must always be cloned and never used in place.
                                for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
                                        callback.call(
                                                table && jQuery.nodeName( this[i], "table" ) ?
                                                        findOrAppend( this[i], "tbody" ) :
                                                        this[i],
                                                i === iNoClone ?
                                                        fragment :
                                                        jQuery.clone( fragment, true, true )
                                        );
                                }
                        }

                        // Fix #11809: Avoid leaking memory
                        fragment = first = null;

                        if ( scripts.length ) {
                                jQuery.each( scripts, function( i, elem ) {
                                        if ( elem.src ) {
                                                if ( jQuery.ajax ) {
                                                        jQuery.ajax({
                                                                url: elem.src,
                                                                type: "GET",
                                                                dataType: "script",
                                                                async: false,
                                                                global: false,
                                                                "throws": true
                                                        });
                                                } else {
                                                        jQuery.error("no ajax");
                                                }
                                        } else {
                                                jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
                                        }

                                        if ( elem.parentNode ) {
                                                elem.parentNode.removeChild( elem );
                                        }
                                });
                        }
                }

                return this;
        }
});

function findOrAppend( elem, tag ) {
        return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

        if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
                return;
        }

        var type, i, l,
                oldData = jQuery._data( src ),
                curData = jQuery._data( dest, oldData ),
                events = oldData.events;

        if ( events ) {
                delete curData.handle;
                curData.events = {};

                for ( type in events ) {
                        for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                                jQuery.event.add( dest, type, events[ type ][ i ] );
                        }
                }
        }

        // make the cloned public data object a copy from the original
        if ( curData.data ) {
                curData.data = jQuery.extend( {}, curData.data );
        }
}

function cloneFixAttributes( src, dest ) {
        var nodeName;

        // We do not need to do anything for non-Elements
        if ( dest.nodeType !== 1 ) {
                return;
        }

        // clearAttributes removes the attributes, which we don't want,
        // but also removes the attachEvent events, which we *do* want
        if ( dest.clearAttributes ) {
                dest.clearAttributes();
        }

        // mergeAttributes, in contrast, only merges back on the
        // original attributes, not the events
        if ( dest.mergeAttributes ) {
                dest.mergeAttributes( src );
        }

        nodeName = dest.nodeName.toLowerCase();

        if ( nodeName === "object" ) {
                // IE6-10 improperly clones children of object elements using classid.
                // IE10 throws NoModificationAllowedError if parent is null, #12132.
                if ( dest.parentNode ) {
                        dest.outerHTML = src.outerHTML;
                }

                // This path appears unavoidable for IE9. When cloning an object
                // element in IE9, the outerHTML strategy above is not sufficient.
                // If the src has innerHTML and the destination does not,
                // copy the src.innerHTML into the dest.innerHTML. #10324
                if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
                        dest.innerHTML = src.innerHTML;
                }

        } else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
                // IE6-8 fails to persist the checked state of a cloned checkbox
                // or radio button. Worse, IE6-7 fail to give the cloned element
                // a checked appearance if the defaultChecked value isn't also set

                dest.defaultChecked = dest.checked = src.checked;

                // IE6-7 get confused and end up setting the value of a cloned
                // checkbox/radio button to an empty string instead of "on"
                if ( dest.value !== src.value ) {
                        dest.value = src.value;
                }

        // IE6-8 fails to return the selected option to the default selected
        // state when cloning options
        } else if ( nodeName === "option" ) {
                dest.selected = src.defaultSelected;

        // IE6-8 fails to set the defaultValue to the correct value when
        // cloning other types of input fields
        } else if ( nodeName === "input" || nodeName === "textarea" ) {
                dest.defaultValue = src.defaultValue;

        // IE blanks contents when cloning scripts
        } else if ( nodeName === "script" && dest.text !== src.text ) {
                dest.text = src.text;
        }

        // Event data gets referenced instead of copied if the expando
        // gets copied too
        dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
        var fragment, cacheable, cachehit,
                first = args[ 0 ];

        // Set context from what may come in as undefined or a jQuery collection or a node
        // Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
        // also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
        context = context || document;
        context = !context.nodeType && context[0] || context;
        context = context.ownerDocument || context;

        // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
        // Cloning options loses the selected state, so don't cache them
        // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
        // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
        // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
        if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
                first.charAt(0) === "<" && !rnocache.test( first ) &&
                (jQuery.support.checkClone || !rchecked.test( first )) &&
                (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

                // Mark cacheable and look for a hit
                cacheable = true;
                fragment = jQuery.fragments[ first ];
                cachehit = fragment !== undefined;
        }

        if ( !fragment ) {
                fragment = context.createDocumentFragment();
                jQuery.clean( args, context, fragment, scripts );

                // Update the cache, but only store false
                // unless this is a second parsing of the same content
                if ( cacheable ) {
                        jQuery.fragments[ first ] = cachehit && fragment;
                }
        }

        return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
}, function( name, original ) {
        jQuery.fn[ name ] = function( selector ) {
                var elems,
                        i = 0,
                        ret = [],
                        insert = jQuery( selector ),
                        l = insert.length,
                        parent = this.length === 1 && this[0].parentNode;

                if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
                        insert[ original ]( this[0] );
                        return this;
                } else {
                        for ( ; i < l; i++ ) {
                                elems = ( i > 0 ? this.clone(true) : this ).get();
                                jQuery( insert[i] )[ original ]( elems );
                                ret = ret.concat( elems );
                        }

                        return this.pushStack( ret, name, insert.selector );
                }
        };
});

function getAll( elem ) {
        if ( typeof elem.getElementsByTagName !== "undefined" ) {
                return elem.getElementsByTagName( "*" );

        } else if ( typeof elem.querySelectorAll !== "undefined" ) {
                return elem.querySelectorAll( "*" );

        } else {
                return [];
        }
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
        if ( rcheckableType.test( elem.type ) ) {
                elem.defaultChecked = elem.checked;
        }
}

jQuery.extend({
        clone: function( elem, dataAndEvents, deepDataAndEvents ) {
                var srcElements,
                        destElements,
                        i,
                        clone;

                if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
                        clone = elem.cloneNode( true );

                // IE<=8 does not properly clone detached, unknown element nodes
                } else {
                        fragmentDiv.innerHTML = elem.outerHTML;
                        fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
                }

                if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                                (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
                        // IE copies events bound via attachEvent when using cloneNode.
                        // Calling detachEvent on the clone will also remove the events
                        // from the original. In order to get around this, we use some
                        // proprietary methods to clear the events. Thanks to MooTools
                        // guys for this hotness.

                        cloneFixAttributes( elem, clone );

                        // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
                        srcElements = getAll( elem );
                        destElements = getAll( clone );

                        // Weird iteration because IE will replace the length property
                        // with an element if you are cloning the body and one of the
                        // elements on the page has a name or id of "length"
                        for ( i = 0; srcElements[i]; ++i ) {
                                // Ensure that the destination node is not null; Fixes #9587
                                if ( destElements[i] ) {
                                        cloneFixAttributes( srcElements[i], destElements[i] );
                                }
                        }
                }

                // Copy the events from the original to the clone
                if ( dataAndEvents ) {
                        cloneCopyEvent( elem, clone );

                        if ( deepDataAndEvents ) {
                                srcElements = getAll( elem );
                                destElements = getAll( clone );

                                for ( i = 0; srcElements[i]; ++i ) {
                                        cloneCopyEvent( srcElements[i], destElements[i] );
                                }
                        }
                }

                srcElements = destElements = null;

                // Return the cloned set
                return clone;
        },

        clean: function( elems, context, fragment, scripts ) {
                var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
                        safe = context === document && safeFragment,
                        ret = [];

                // Ensure that context is a document
                if ( !context || typeof context.createDocumentFragment === "undefined" ) {
                        context = document;
                }

                // Use the already-created safe fragment if context permits
                for ( i = 0; (elem = elems[i]) != null; i++ ) {
                        if ( typeof elem === "number" ) {
                                elem += "";
                        }

                        if ( !elem ) {
                                continue;
                        }

                        // Convert html string into DOM nodes
                        if ( typeof elem === "string" ) {
                                if ( !rhtml.test( elem ) ) {
                                        elem = context.createTextNode( elem );
                                } else {
                                        // Ensure a safe container in which to render the html
                                        safe = safe || createSafeFragment( context );
                                        div = context.createElement("div");
                                        safe.appendChild( div );

                                        // Fix "XHTML"-style tags in all browsers
                                        elem = elem.replace(rxhtmlTag, "<$1></$2>");

                                        // Go to html and back, then peel off extra wrappers
                                        tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
                                        wrap = wrapMap[ tag ] || wrapMap._default;
                                        depth = wrap[0];
                                        div.innerHTML = wrap[1] + elem + wrap[2];

                                        // Move to the right depth
                                        while ( depth-- ) {
                                                div = div.lastChild;
                                        }

                                        // Remove IE's autoinserted <tbody> from table fragments
                                        if ( !jQuery.support.tbody ) {

                                                // String was a <table>, *may* have spurious <tbody>
                                                hasBody = rtbody.test(elem);
                                                        tbody = tag === "table" && !hasBody ?
                                                                div.firstChild && div.firstChild.childNodes :

                                                                // String was a bare <thead> or <tfoot>
                                                                wrap[1] === "<table>" && !hasBody ?
                                                                        div.childNodes :
                                                                        [];

                                                for ( j = tbody.length - 1; j >= 0 ; --j ) {
                                                        if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                                                                tbody[ j ].parentNode.removeChild( tbody[ j ] );
                                                        }
                                                }
                                        }

                                        // IE completely kills leading whitespace when innerHTML is used
                                        if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                                                div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
                                        }

                                        elem = div.childNodes;

                                        // Take out of fragment container (we need a fresh div each time)
                                        div.parentNode.removeChild( div );
                                }
                        }

                        if ( elem.nodeType ) {
                                ret.push( elem );
                        } else {
                                jQuery.merge( ret, elem );
                        }
                }

                // Fix #11356: Clear elements from safeFragment
                if ( div ) {
                        elem = div = safe = null;
                }

                // Reset defaultChecked for any radios and checkboxes
                // about to be appended to the DOM in IE 6/7 (#8060)
                if ( !jQuery.support.appendChecked ) {
                        for ( i = 0; (elem = ret[i]) != null; i++ ) {
                                if ( jQuery.nodeName( elem, "input" ) ) {
                                        fixDefaultChecked( elem );
                                } else if ( typeof elem.getElementsByTagName !== "undefined" ) {
                                        jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
                                }
                        }
                }

                // Append elements to a provided document fragment
                if ( fragment ) {
                        // Special handling of each script element
                        handleScript = function( elem ) {
                                // Check if we consider it executable
                                if ( !elem.type || rscriptType.test( elem.type ) ) {
                                        // Detach the script and store it in the scripts array (if provided) or the fragment
                                        // Return truthy to indicate that it has been handled
                                        return scripts ?
                                                scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
                                                fragment.appendChild( elem );
                                }
                        };

                        for ( i = 0; (elem = ret[i]) != null; i++ ) {
                                // Check if we're done after handling an executable script
                                if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
                                        // Append to fragment and handle embedded scripts
                                        fragment.appendChild( elem );
                                        if ( typeof elem.getElementsByTagName !== "undefined" ) {
                                                // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
                                                jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

                                                // Splice the scripts into ret after their former ancestor and advance our index beyond them
                                                ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                                                i += jsTags.length;
                                        }
                                }
                        }
                }

                return ret;
        },

        cleanData: function( elems, /* internal */ acceptData ) {
                var data, id, elem, type,
                        i = 0,
                        internalKey = jQuery.expando,
                        cache = jQuery.cache,
                        deleteExpando = jQuery.support.deleteExpando,
                        special = jQuery.event.special;

                for ( ; (elem = elems[i]) != null; i++ ) {

                        if ( acceptData || jQuery.acceptData( elem ) ) {

                                id = elem[ internalKey ];
                                data = id && cache[ id ];

                                if ( data ) {
                                        if ( data.events ) {
                                                for ( type in data.events ) {
                                                        if ( special[ type ] ) {
                                                                jQuery.event.remove( elem, type );

                                                        // This is a shortcut to avoid jQuery.event.remove's overhead
                                                        } else {
                                                                jQuery.removeEvent( elem, type, data.handle );
                                                        }
                                                }
                                        }

                                        // Remove cache only if it was not already removed by jQuery.event.remove
                                        if ( cache[ id ] ) {

                                                delete cache[ id ];

                                                // IE does not allow us to delete expando properties from nodes,
                                                // nor does it have a removeAttribute function on Document nodes;
                                                // we must handle all of these cases
                                                if ( deleteExpando ) {
                                                        delete elem[ internalKey ];

                                                } else if ( elem.removeAttribute ) {
                                                        elem.removeAttribute( internalKey );

                                                } else {
                                                        elem[ internalKey ] = null;
                                                }

                                                jQuery.deletedIds.push( id );
                                        }
                                }
                        }
                }
        }
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                /(msie) ([\w.]+)/.exec( ua ) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                [];

        return {
                browser: match[ 1 ] || "",
                version: match[ 2 ] || "0"
        };
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
        browser.webkit = true;
} else if ( browser.webkit ) {
        browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
        function jQuerySub( selector, context ) {
                return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
                if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                        context = jQuerySub( context );
                }

                return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
        ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity=([^)]*)/,
        rposition = /^(top|right|bottom|left)$/,
        // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
        // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rmargin = /^margin/,
        rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
        rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
        rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
        elemdisplay = { BODY: "block" },

        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssNormalTransform = {
                letterSpacing: 0,
                fontWeight: 400
        },

        cssExpand = [ "Top", "Right", "Bottom", "Left" ],
        cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

        eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

        // shortcut for names that are not vendor prefixed
        if ( name in style ) {
                return name;
        }

        // check for vendor prefixed names
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
                origName = name,
                i = cssPrefixes.length;

        while ( i-- ) {
                name = cssPrefixes[ i ] + capName;
                if ( name in style ) {
                        return name;
                }
        }

        return origName;
}

function isHidden( elem, el ) {
        elem = el || elem;
        return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
        var elem, display,
                values = [],
                index = 0,
                length = elements.length;

        for ( ; index < length; index++ ) {
                elem = elements[ index ];
                if ( !elem.style ) {
                        continue;
                }
                values[ index ] = jQuery._data( elem, "olddisplay" );
                if ( show ) {
                        // Reset the inline display of this element to learn if it is
                        // being hidden by cascaded rules or not
                        if ( !values[ index ] && elem.style.display === "none" ) {
                                elem.style.display = "";
                        }

                        // Set elements which have been overridden with display: none
                        // in a stylesheet to whatever the default browser style is
                        // for such an element
                        if ( elem.style.display === "" && isHidden( elem ) ) {
                                values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
                        }
                } else {
                        display = curCSS( elem, "display" );

                        if ( !values[ index ] && display !== "none" ) {
                                jQuery._data( elem, "olddisplay", display );
                        }
                }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for ( index = 0; index < length; index++ ) {
                elem = elements[ index ];
                if ( !elem.style ) {
                        continue;
                }
                if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
                        elem.style.display = show ? values[ index ] || "" : "none";
                }
        }

        return elements;
}

jQuery.fn.extend({
        css: function( name, value ) {
                return jQuery.access( this, function( elem, name, value ) {
                        return value !== undefined ?
                                jQuery.style( elem, name, value ) :
                                jQuery.css( elem, name );
                }, name, value, arguments.length > 1 );
        },
        show: function() {
                return showHide( this, true );
        },
        hide: function() {
                return showHide( this );
        },
        toggle: function( state, fn2 ) {
                var bool = typeof state === "boolean";

                if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
                        return eventsToggle.apply( this, arguments );
                }

                return this.each(function() {
                        if ( bool ? state : isHidden( this ) ) {
                                jQuery( this ).show();
                        } else {
                                jQuery( this ).hide();
                        }
                });
        }
});

jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
                opacity: {
                        get: function( elem, computed ) {
                                if ( computed ) {
                                        // We should always get a number back from opacity
                                        var ret = curCSS( elem, "opacity" );
                                        return ret === "" ? "1" : ret;

                                }
                        }
                }
        },

        // Exclude the following css properties to add px
        cssNumber: {
                "fillOpacity": true,
                "fontWeight": true,
                "lineHeight": true,
                "opacity": true,
                "orphans": true,
                "widows": true,
                "zIndex": true,
                "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
                // normalize float css property
                "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function( elem, name, value, extra ) {
                // Don't set styles on text and comment nodes
                if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
                        return;
                }

                // Make sure that we're working with the right name
                var ret, type, hooks,
                        origName = jQuery.camelCase( name ),
                        style = elem.style;

                name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

                // gets hook for the prefixed version
                // followed by the unprefixed version
                hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

                // Check if we're setting a value
                if ( value !== undefined ) {
                        type = typeof value;

                        // convert relative number strings (+= or -=) to relative numbers. #7345
                        if ( type === "string" && (ret = rrelNum.exec( value )) ) {
                                value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
                                // Fixes bug #9237
                                type = "number";
                        }

                        // Make sure that NaN and null values aren't set. See: #7116
                        if ( value == null || type === "number" && isNaN( value ) ) {
                                return;
                        }

                        // If a number was passed in, add 'px' to the (except for certain CSS properties)
                        if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                                value += "px";
                        }

                        // If a hook was provided, use that value, otherwise just set the specified value
                        if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
                                // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                                // Fixes bug #5509
                                try {
                                        style[ name ] = value;
                                } catch(e) {}
                        }

                } else {
                        // If a hook was provided get the non-computed value from there
                        if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                                return ret;
                        }

                        // Otherwise just get the value from the style object
                        return style[ name ];
                }
        },

        css: function( elem, name, numeric, extra ) {
                var val, num, hooks,
                        origName = jQuery.camelCase( name );

                // Make sure that we're working with the right name
                name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

                // gets hook for the prefixed version
                // followed by the unprefixed version
                hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

                // If a hook was provided get the computed value from there
                if ( hooks && "get" in hooks ) {
                        val = hooks.get( elem, true, extra );
                }

                // Otherwise, if a way to get the computed value exists, use that
                if ( val === undefined ) {
                        val = curCSS( elem, name );
                }

                //convert "normal" to computed value
                if ( val === "normal" && name in cssNormalTransform ) {
                        val = cssNormalTransform[ name ];
                }

                // Return, converting to number if forced or a qualifier was provided and val looks numeric
                if ( numeric || extra !== undefined ) {
                        num = parseFloat( val );
                        return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
                }
                return val;
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function( elem, options, callback ) {
                var ret, name,
                        old = {};

                // Remember the old values, and insert the new ones
                for ( name in options ) {
                        old[ name ] = elem.style[ name ];
                        elem.style[ name ] = options[ name ];
                }

                ret = callback.call( elem );

                // Revert the old values
                for ( name in options ) {
                        elem.style[ name ] = old[ name ];
                }

                return ret;
        }
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
        curCSS = function( elem, name ) {
                var ret, width, minWidth, maxWidth,
                        computed = window.getComputedStyle( elem, null ),
                        style = elem.style;

                if ( computed ) {

                        // getPropertyValue is only needed for .css('filter') in IE9, see #12537
                        ret = computed.getPropertyValue( name ) || computed[ name ];

                        if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
                                ret = jQuery.style( elem, name );
                        }

                        // A tribute to the "awesome hack by Dean Edwards"
                        // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
                        // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
                        // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
                        if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
                                width = style.width;
                                minWidth = style.minWidth;
                                maxWidth = style.maxWidth;

                                style.minWidth = style.maxWidth = style.width = ret;
                                ret = computed.width;

                                style.width = width;
                                style.minWidth = minWidth;
                                style.maxWidth = maxWidth;
                        }
                }

                return ret;
        };
} else if ( document.documentElement.currentStyle ) {
        curCSS = function( elem, name ) {
                var left, rsLeft,
                        ret = elem.currentStyle && elem.currentStyle[ name ],
                        style = elem.style;

                // Avoid setting ret to empty string here
                // so we don't default to auto
                if ( ret == null && style && style[ name ] ) {
                        ret = style[ name ];
                }

                // From the awesome hack by Dean Edwards
                // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

                // If we're not dealing with a regular pixel number
                // but a number that has a weird ending, we need to convert it to pixels
                // but not position css attributes, as those are proportional to the parent element instead
                // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
                if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

                        // Remember the original values
                        left = style.left;
                        rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

                        // Put in the new values to get a computed value out
                        if ( rsLeft ) {
                                elem.runtimeStyle.left = elem.currentStyle.left;
                        }
                        style.left = name === "fontSize" ? "1em" : ret;
                        ret = style.pixelLeft + "px";

                        // Revert the changed values
                        style.left = left;
                        if ( rsLeft ) {
                                elem.runtimeStyle.left = rsLeft;
                        }
                }

                return ret === "" ? "auto" : ret;
        };
}

function setPositiveNumber( elem, value, subtract ) {
        var matches = rnumsplit.exec( value );
        return matches ?
                        Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
                        value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
        var i = extra === ( isBorderBox ? "border" : "content" ) ?
                // If we already have the right measurement, avoid augmentation
                4 :
                // Otherwise initialize for horizontal or vertical properties
                name === "width" ? 1 : 0,

                val = 0;

        for ( ; i < 4; i += 2 ) {
                // both box models exclude margin, so add it if we want it
                if ( extra === "margin" ) {
                        // we use jQuery.css instead of curCSS here
                        // because of the reliableMarginRight CSS hook!
                        val += jQuery.css( elem, extra + cssExpand[ i ], true );
                }

                // From this point on we use curCSS for maximum performance (relevant in animations)
                if ( isBorderBox ) {
                        // border-box includes padding, so remove it if we want content
                        if ( extra === "content" ) {
                                val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
                        }

                        // at this point, extra isn't border nor margin, so remove border
                        if ( extra !== "margin" ) {
                                val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
                        }
                } else {
                        // at this point, extra isn't content, so add padding
                        val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

                        // at this point, extra isn't content nor padding, so add border
                        if ( extra !== "padding" ) {
                                val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
                        }
                }
        }

        return val;
}

function getWidthOrHeight( elem, name, extra ) {

        // Start with offset property, which is equivalent to the border-box value
        var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
                valueIsBorderBox = true,
                isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if ( val <= 0 || val == null ) {
                // Fall back to computed then uncomputed css if necessary
                val = curCSS( elem, name );
                if ( val < 0 || val == null ) {
                        val = elem.style[ name ];
                }

                // Computed unit is not pixels. Stop here and return.
                if ( rnumnonpx.test(val) ) {
                        return val;
                }

                // we need the check for style in case a browser which returns unreliable values
                // for getComputedStyle silently falls back to the reliable elem.style
                valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

                // Normalize "", auto, and prepare for extra
                val = parseFloat( val ) || 0;
        }

        // use the active box-sizing model to add/subtract irrelevant styles
        return ( val +
                augmentWidthOrHeight(
                        elem,
                        name,
                        extra || ( isBorderBox ? "border" : "content" ),
                        valueIsBorderBox
                )
        ) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
        if ( elemdisplay[ nodeName ] ) {
                return elemdisplay[ nodeName ];
        }

        var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
                display = elem.css("display");
        elem.remove();

        // If the simple way fails,
        // get element's real default display by attaching it to a temp iframe
        if ( display === "none" || display === "" ) {
                // Use the already-created iframe if possible
                iframe = document.body.appendChild(
                        iframe || jQuery.extend( document.createElement("iframe"), {
                                frameBorder: 0,
                                width: 0,
                                height: 0
                        })
                );

                // Create a cacheable copy of the iframe document on first call.
                // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
                // document to it; WebKit & Firefox won't allow reusing the iframe document.
                if ( !iframeDoc || !iframe.createElement ) {
                        iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
                        iframeDoc.write("<!doctype html><html><body>");
                        iframeDoc.close();
                }

                elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

                display = curCSS( elem, "display" );
                document.body.removeChild( iframe );
        }

        // Store the correct default display
        elemdisplay[ nodeName ] = display;

        return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
        jQuery.cssHooks[ name ] = {
                get: function( elem, computed, extra ) {
                        if ( computed ) {
                                // certain elements can have dimension info if we invisibly show them
                                // however, it must have a current display style that would benefit from this
                                if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
                                        return jQuery.swap( elem, cssShow, function() {
                                                return getWidthOrHeight( elem, name, extra );
                                        });
                                } else {
                                        return getWidthOrHeight( elem, name, extra );
                                }
                        }
                },

                set: function( elem, value, extra ) {
                        return setPositiveNumber( elem, value, extra ?
                                augmentWidthOrHeight(
                                        elem,
                                        name,
                                        extra,
                                        jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
                                ) : 0
                        );
                }
        };
});

if ( !jQuery.support.opacity ) {
        jQuery.cssHooks.opacity = {
                get: function( elem, computed ) {
                        // IE uses filters for opacity
                        return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
                                ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
                                computed ? "1" : "";
                },

                set: function( elem, value ) {
                        var style = elem.style,
                                currentStyle = elem.currentStyle,
                                opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
                                filter = currentStyle && currentStyle.filter || style.filter || "";

                        // IE has trouble with opacity if it does not have layout
                        // Force it by setting the zoom level
                        style.zoom = 1;

                        // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
                        if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
                                style.removeAttribute ) {

                                // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                                // if "filter:" is present at all, clearType is disabled, we want to avoid this
                                // style.removeAttribute is IE Only, but so apparently is this code path...
                                style.removeAttribute( "filter" );

                                // if there there is no filter style applied in a css rule, we are done
                                if ( currentStyle && !currentStyle.filter ) {
                                        return;
                                }
                        }

                        // otherwise, set new filter values
                        style.filter = ralpha.test( filter ) ?
                                filter.replace( ralpha, opacity ) :
                                filter + " " + opacity;
                }
        };
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
        if ( !jQuery.support.reliableMarginRight ) {
                jQuery.cssHooks.marginRight = {
                        get: function( elem, computed ) {
                                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                                // Work around by temporarily setting element display to inline-block
                                return jQuery.swap( elem, { "display": "inline-block" }, function() {
                                        if ( computed ) {
                                                return curCSS( elem, "marginRight" );
                                        }
                                });
                        }
                };
        }

        // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
        // getComputedStyle returns percent when specified for top/left/bottom/right
        // rather than make the css module depend on the offset module, we just check for it here
        if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
                jQuery.each( [ "top", "left" ], function( i, prop ) {
                        jQuery.cssHooks[ prop ] = {
                                get: function( elem, computed ) {
                                        if ( computed ) {
                                                var ret = curCSS( elem, prop );
                                                // if curCSS returns percentage, fallback to offset
                                                return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
                                        }
                                }
                        };
                });
        }

});

if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.hidden = function( elem ) {
                return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
        };

        jQuery.expr.filters.visible = function( elem ) {
                return !jQuery.expr.filters.hidden( elem );
        };
}

// These hooks are used by animate to expand properties
jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
}, function( prefix, suffix ) {
        jQuery.cssHooks[ prefix + suffix ] = {
                expand: function( value ) {
                        var i,

                                // assumes a single number if not a string
                                parts = typeof value === "string" ? value.split(" ") : [ value ],
                                expanded = {};

                        for ( i = 0; i < 4; i++ ) {
                                expanded[ prefix + cssExpand[ i ] + suffix ] =
                                        parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
                        }

                        return expanded;
                }
        };

        if ( !rmargin.test( prefix ) ) {
                jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
        }
});
var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
        serialize: function() {
                return jQuery.param( this.serializeArray() );
        },
        serializeArray: function() {
                return this.map(function(){
                        return this.elements ? jQuery.makeArray( this.elements ) : this;
                })
                .filter(function(){
                        return this.name && !this.disabled &&
                                ( this.checked || rselectTextarea.test( this.nodeName ) ||
                                        rinput.test( this.type ) );
                })
                .map(function( i, elem ){
                        var val = jQuery( this ).val();

                        return val == null ?
                                null :
                                jQuery.isArray( val ) ?
                                        jQuery.map( val, function( val, i ){
                                                return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                                        }) :
                                        { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                }).get();
        }
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
        var prefix,
                s = [],
                add = function( key, value ) {
                        // If value is a function, invoke it and return its value
                        value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
                        s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
                };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if ( traditional === undefined ) {
                traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
                // Serialize the form elements
                jQuery.each( a, function() {
                        add( this.name, this.value );
                });

        } else {
                // If traditional, encode the "old" way (the way 1.3.2 or older
                // did it), otherwise encode params recursively.
                for ( prefix in a ) {
                        buildParams( prefix, a[ prefix ], traditional, add );
                }
        }

        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
        var name;

        if ( jQuery.isArray( obj ) ) {
                // Serialize array item.
                jQuery.each( obj, function( i, v ) {
                        if ( traditional || rbracket.test( prefix ) ) {
                                // Treat each array item as a scalar.
                                add( prefix, v );

                        } else {
                                // If array item is non-scalar (array or object), encode its
                                // numeric index to resolve deserialization ambiguity issues.
                                // Note that rack (as of 1.0.0) can't currently deserialize
                                // nested arrays properly, and attempting to do so may cause
                                // a server error. Possible fixes are to modify rack's
                                // deserialization algorithm or to provide an option or flag
                                // to force array serialization to be shallow.
                                buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
                        }
                });

        } else if ( !traditional && jQuery.type( obj ) === "object" ) {
                // Serialize object item.
                for ( name in obj ) {
                        buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
                }

        } else {
                // Serialize scalar item.
                add( prefix, obj );
        }
}
var
        // Document location
        ajaxLocParts,
        ajaxLocation,

        rhash = /#.*$/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
        // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rquery = /\?/,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        rts = /([?&])_=[^&]*/,
        rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

        // Keep a copy of the old load method
        _load = jQuery.fn.load,

        /* Prefilters
         * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
         * 2) These are called:
         *    - BEFORE asking for a transport
         *    - AFTER param serialization (s.data is a string if s.processData is true)
         * 3) key is the dataType
         * 4) the catchall symbol "*" can be used
         * 5) execution will start with transport dataType and THEN continue down to "*" if needed
         */
        prefilters = {},

        /* Transports bindings
         * 1) key is the dataType
         * 2) the catchall symbol "*" can be used
         * 3) selection will start with transport dataType and THEN go to "*" if needed
         */
        transports = {},

        // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
        ajaxLocation = location.href;
} catch( e ) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement( "a" );
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

        // dataTypeExpression is optional and defaults to "*"
        return function( dataTypeExpression, func ) {

                if ( typeof dataTypeExpression !== "string" ) {
                        func = dataTypeExpression;
                        dataTypeExpression = "*";
                }

                var dataType, list, placeBefore,
                        dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
                        i = 0,
                        length = dataTypes.length;

                if ( jQuery.isFunction( func ) ) {
                        // For each dataType in the dataTypeExpression
                        for ( ; i < length; i++ ) {
                                dataType = dataTypes[ i ];
                                // We control if we're asked to add before
                                // any existing element
                                placeBefore = /^\+/.test( dataType );
                                if ( placeBefore ) {
                                        dataType = dataType.substr( 1 ) || "*";
                                }
                                list = structure[ dataType ] = structure[ dataType ] || [];
                                // then we add to the structure accordingly
                                list[ placeBefore ? "unshift" : "push" ]( func );
                        }
                }
        };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
                dataType /* internal */, inspected /* internal */ ) {

        dataType = dataType || options.dataTypes[ 0 ];
        inspected = inspected || {};

        inspected[ dataType ] = true;

        var selection,
                list = structure[ dataType ],
                i = 0,
                length = list ? list.length : 0,
                executeOnly = ( structure === prefilters );

        for ( ; i < length && ( executeOnly || !selection ); i++ ) {
                selection = list[ i ]( options, originalOptions, jqXHR );
                // If we got redirected to another dataType
                // we try there if executing only and not done already
                if ( typeof selection === "string" ) {
                        if ( !executeOnly || inspected[ selection ] ) {
                                selection = undefined;
                        } else {
                                options.dataTypes.unshift( selection );
                                selection = inspectPrefiltersOrTransports(
                                                structure, options, originalOptions, jqXHR, selection, inspected );
                        }
                }
        }
        // If we're only executing or nothing was selected
        // we try the catchall dataType if not done already
        if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
                selection = inspectPrefiltersOrTransports(
                                structure, options, originalOptions, jqXHR, "*", inspected );
        }
        // unnecessary when only executing (prefilters)
        // but it'll be ignored by the caller in that case
        return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
        var key, deep,
                flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for ( key in src ) {
                if ( src[ key ] !== undefined ) {
                        ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
                }
        }
        if ( deep ) {
                jQuery.extend( true, target, deep );
        }
}

jQuery.fn.load = function( url, params, callback ) {
        if ( typeof url !== "string" && _load ) {
                return _load.apply( this, arguments );
        }

        // Don't do a request if no elements are being requested
        if ( !this.length ) {
                return this;
        }

        var selector, type, response,
                self = this,
                off = url.indexOf(" ");

        if ( off >= 0 ) {
                selector = url.slice( off, url.length );
                url = url.slice( 0, off );
        }

        // If it's a function
        if ( jQuery.isFunction( params ) ) {

                // We assume that it's the callback
                callback = params;
                params = undefined;

        // Otherwise, build a param string
        } else if ( params && typeof params === "object" ) {
                type = "POST";
        }

        // Request the remote document
        jQuery.ajax({
                url: url,

                // if "type" variable is undefined, then "GET" method will be used
                type: type,
                dataType: "html",
                data: params,
                complete: function( jqXHR, status ) {
                        if ( callback ) {
                                self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
                        }
                }
        }).done(function( responseText ) {

                // Save response for use in complete callback
                response = arguments;

                // See if a selector was specified
                self.html( selector ?

                        // Create a dummy div to hold the results
                        jQuery("<div>")

                                // inject the contents of the document in, removing the scripts
                                // to avoid any 'Permission Denied' errors in IE
                                .append( responseText.replace( rscript, "" ) )

                                // Locate the specified elements
                                .find( selector ) :

                        // If not, just inject the full result
                        responseText );

        });

        return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
        jQuery.fn[ o ] = function( f ){
                return this.on( o, f );
        };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
        jQuery[ method ] = function( url, data, callback, type ) {
                // shift arguments if data argument was omitted
                if ( jQuery.isFunction( data ) ) {
                        type = type || callback;
                        callback = data;
                        data = undefined;
                }

                return jQuery.ajax({
                        type: method,
                        url: url,
                        data: data,
                        success: callback,
                        dataType: type
                });
        };
});

jQuery.extend({

        getScript: function( url, callback ) {
                return jQuery.get( url, undefined, callback, "script" );
        },

        getJSON: function( url, data, callback ) {
                return jQuery.get( url, data, callback, "json" );
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function( target, settings ) {
                if ( settings ) {
                        // Building a settings object
                        ajaxExtend( target, jQuery.ajaxSettings );
                } else {
                        // Extending ajaxSettings
                        settings = target;
                        target = jQuery.ajaxSettings;
                }
                ajaxExtend( target, settings );
                return target;
        },

        ajaxSettings: {
                url: ajaxLocation,
                isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
                global: true,
                type: "GET",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                processData: true,
                async: true,
                /*
                timeout: 0,
                data: null,
                dataType: null,
                username: null,
                password: null,
                cache: null,
                throws: false,
                traditional: false,
                headers: {},
                */

                accepts: {
                        xml: "application/xml, text/xml",
                        html: "text/html",
                        text: "text/plain",
                        json: "application/json, text/javascript",
                        "*": allTypes
                },

                contents: {
                        xml: /xml/,
                        html: /html/,
                        json: /json/
                },

                responseFields: {
                        xml: "responseXML",
                        text: "responseText"
                },

                // List of data converters
                // 1) key format is "source_type destination_type" (a single space in-between)
                // 2) the catchall symbol "*" can be used for source_type
                converters: {

                        // Convert anything to text
                        "* text": window.String,

                        // Text to html (true = no transformation)
                        "text html": true,

                        // Evaluate text as a json expression
                        "text json": jQuery.parseJSON,

                        // Parse text as xml
                        "text xml": jQuery.parseXML
                },

                // For options that shouldn't be deep extended:
                // you can add your own custom options here if
                // and when you create one that shouldn't be
                // deep extended (see ajaxExtend)
                flatOptions: {
                        context: true,
                        url: true
                }
        },

        ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
        ajaxTransport: addToPrefiltersOrTransports( transports ),

        // Main method
        ajax: function( url, options ) {

                // If url is an object, simulate pre-1.5 signature
                if ( typeof url === "object" ) {
                        options = url;
                        url = undefined;
                }

                // Force options to be an object
                options = options || {};

                var // ifModified key
                        ifModifiedKey,
                        // Response headers
                        responseHeadersString,
                        responseHeaders,
                        // transport
                        transport,
                        // timeout handle
                        timeoutTimer,
                        // Cross-domain detection vars
                        parts,
                        // To know if global events are to be dispatched
                        fireGlobals,
                        // Loop variable
                        i,
                        // Create the final options object
                        s = jQuery.ajaxSetup( {}, options ),
                        // Callbacks context
                        callbackContext = s.context || s,
                        // Context for global events
                        // It's the callbackContext if one was provided in the options
                        // and if it's a DOM node or a jQuery collection
                        globalEventContext = callbackContext !== s &&
                                ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
                                                jQuery( callbackContext ) : jQuery.event,
                        // Deferreds
                        deferred = jQuery.Deferred(),
                        completeDeferred = jQuery.Callbacks( "once memory" ),
                        // Status-dependent callbacks
                        statusCode = s.statusCode || {},
                        // Headers (they are sent all at once)
                        requestHeaders = {},
                        requestHeadersNames = {},
                        // The jqXHR state
                        state = 0,
                        // Default abort message
                        strAbort = "canceled",
                        // Fake xhr
                        jqXHR = {

                                readyState: 0,

                                // Caches the header
                                setRequestHeader: function( name, value ) {
                                        if ( !state ) {
                                                var lname = name.toLowerCase();
                                                name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                                                requestHeaders[ name ] = value;
                                        }
                                        return this;
                                },

                                // Raw string
                                getAllResponseHeaders: function() {
                                        return state === 2 ? responseHeadersString : null;
                                },

                                // Builds headers hashtable if needed
                                getResponseHeader: function( key ) {
                                        var match;
                                        if ( state === 2 ) {
                                                if ( !responseHeaders ) {
                                                        responseHeaders = {};
                                                        while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                                                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                                                        }
                                                }
                                                match = responseHeaders[ key.toLowerCase() ];
                                        }
                                        return match === undefined ? null : match;
                                },

                                // Overrides response content-type header
                                overrideMimeType: function( type ) {
                                        if ( !state ) {
                                                s.mimeType = type;
                                        }
                                        return this;
                                },

                                // Cancel the request
                                abort: function( statusText ) {
                                        statusText = statusText || strAbort;
                                        if ( transport ) {
                                                transport.abort( statusText );
                                        }
                                        done( 0, statusText );
                                        return this;
                                }
                        };

                // Callback for when everything is done
                // It is defined here because jslint complains if it is declared
                // at the end of the function (which would be more logical and readable)
                function done( status, nativeStatusText, responses, headers ) {
                        var isSuccess, success, error, response, modified,
                                statusText = nativeStatusText;

                        // Called once
                        if ( state === 2 ) {
                                return;
                        }

                        // State is "done" now
                        state = 2;

                        // Clear timeout if it exists
                        if ( timeoutTimer ) {
                                clearTimeout( timeoutTimer );
                        }

                        // Dereference transport for early garbage collection
                        // (no matter how long the jqXHR object will be used)
                        transport = undefined;

                        // Cache response headers
                        responseHeadersString = headers || "";

                        // Set readyState
                        jqXHR.readyState = status > 0 ? 4 : 0;

                        // Get response data
                        if ( responses ) {
                                response = ajaxHandleResponses( s, jqXHR, responses );
                        }

                        // If successful, handle type chaining
                        if ( status >= 200 && status < 300 || status === 304 ) {

                                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                                if ( s.ifModified ) {

                                        modified = jqXHR.getResponseHeader("Last-Modified");
                                        if ( modified ) {
                                                jQuery.lastModified[ ifModifiedKey ] = modified;
                                        }
                                        modified = jqXHR.getResponseHeader("Etag");
                                        if ( modified ) {
                                                jQuery.etag[ ifModifiedKey ] = modified;
                                        }
                                }

                                // If not modified
                                if ( status === 304 ) {

                                        statusText = "notmodified";
                                        isSuccess = true;

                                // If we have data
                                } else {

                                        isSuccess = ajaxConvert( s, response );
                                        statusText = isSuccess.state;
                                        success = isSuccess.data;
                                        error = isSuccess.error;
                                        isSuccess = !error;
                                }
                        } else {
                                // We extract error from statusText
                                // then normalize statusText and status for non-aborts
                                error = statusText;
                                if ( !statusText || status ) {
                                        statusText = "error";
                                        if ( status < 0 ) {
                                                status = 0;
                                        }
                                }
                        }

                        // Set data for the fake xhr object
                        jqXHR.status = status;
                        jqXHR.statusText = ( nativeStatusText || statusText ) + "";

                        // Success/Error
                        if ( isSuccess ) {
                                deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
                        } else {
                                deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
                        }

                        // Status-dependent callbacks
                        jqXHR.statusCode( statusCode );
                        statusCode = undefined;

                        if ( fireGlobals ) {
                                globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
                                                [ jqXHR, s, isSuccess ? success : error ] );
                        }

                        // Complete
                        completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

                        if ( fireGlobals ) {
                                globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
                                // Handle the global AJAX counter
                                if ( !( --jQuery.active ) ) {
                                        jQuery.event.trigger( "ajaxStop" );
                                }
                        }
                }

                // Attach deferreds
                deferred.promise( jqXHR );
                jqXHR.success = jqXHR.done;
                jqXHR.error = jqXHR.fail;
                jqXHR.complete = completeDeferred.add;

                // Status-dependent callbacks
                jqXHR.statusCode = function( map ) {
                        if ( map ) {
                                var tmp;
                                if ( state < 2 ) {
                                        for ( tmp in map ) {
                                                statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
                                        }
                                } else {
                                        tmp = map[ jqXHR.status ];
                                        jqXHR.always( tmp );
                                }
                        }
                        return this;
                };

                // Remove hash character (#7531: and string promotion)
                // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
                // We also use the url parameter if available
                s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

                // Extract dataTypes list
                s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

                // A cross-domain request is in order when we have a protocol:host:port mismatch
                if ( s.crossDomain == null ) {
                        parts = rurl.exec( s.url.toLowerCase() );
                        s.crossDomain = !!( parts &&
                                ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
                                        ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
                                                ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
                        );
                }

                // Convert data if not already a string
                if ( s.data && s.processData && typeof s.data !== "string" ) {
                        s.data = jQuery.param( s.data, s.traditional );
                }

                // Apply prefilters
                inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

                // If request was aborted inside a prefilter, stop there
                if ( state === 2 ) {
                        return jqXHR;
                }

                // We can fire global events as of now if asked to
                fireGlobals = s.global;

                // Uppercase the type
                s.type = s.type.toUpperCase();

                // Determine if request has content
                s.hasContent = !rnoContent.test( s.type );

                // Watch for a new set of requests
                if ( fireGlobals && jQuery.active++ === 0 ) {
                        jQuery.event.trigger( "ajaxStart" );
                }

                // More options handling for requests with no content
                if ( !s.hasContent ) {

                        // If data is available, append data to url
                        if ( s.data ) {
                                s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
                                // #9682: remove data so that it's not used in an eventual retry
                                delete s.data;
                        }

                        // Get ifModifiedKey before adding the anti-cache parameter
                        ifModifiedKey = s.url;

                        // Add anti-cache in url if needed
                        if ( s.cache === false ) {

                                var ts = jQuery.now(),
                                        // try replacing _= if it is there
                                        ret = s.url.replace( rts, "$1_=" + ts );

                                // if nothing was replaced, add timestamp to the end
                                s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
                        }
                }

                // Set the correct header, if data is being sent
                if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
                        jqXHR.setRequestHeader( "Content-Type", s.contentType );
                }

                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if ( s.ifModified ) {
                        ifModifiedKey = ifModifiedKey || s.url;
                        if ( jQuery.lastModified[ ifModifiedKey ] ) {
                                jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
                        }
                        if ( jQuery.etag[ ifModifiedKey ] ) {
                                jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
                        }
                }

                // Set the Accepts header for the server, depending on the dataType
                jqXHR.setRequestHeader(
                        "Accept",
                        s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                                s.accepts[ "*" ]
                );

                // Check for headers option
                for ( i in s.headers ) {
                        jqXHR.setRequestHeader( i, s.headers[ i ] );
                }

                // Allow custom headers/mimetypes and early abort
                if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                                // Abort if not done already and return
                                return jqXHR.abort();

                }

                // aborting is no longer a cancellation
                strAbort = "abort";

                // Install callbacks on deferreds
                for ( i in { success: 1, error: 1, complete: 1 } ) {
                        jqXHR[ i ]( s[ i ] );
                }

                // Get transport
                transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

                // If no transport, we auto-abort
                if ( !transport ) {
                        done( -1, "No Transport" );
                } else {
                        jqXHR.readyState = 1;
                        // Send global event
                        if ( fireGlobals ) {
                                globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
                        }
                        // Timeout
                        if ( s.async && s.timeout > 0 ) {
                                timeoutTimer = setTimeout( function(){
                                        jqXHR.abort( "timeout" );
                                }, s.timeout );
                        }

                        try {
                                state = 1;
                                transport.send( requestHeaders, done );
                        } catch (e) {
                                // Propagate exception as error if not done
                                if ( state < 2 ) {
                                        done( -1, e );
                                // Simply rethrow otherwise
                                } else {
                                        throw e;
                                }
                        }
                }

                return jqXHR;
        },

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

        var ct, type, finalDataType, firstDataType,
                contents = s.contents,
                dataTypes = s.dataTypes,
                responseFields = s.responseFields;

        // Fill responseXXX fields
        for ( type in responseFields ) {
                if ( type in responses ) {
                        jqXHR[ responseFields[type] ] = responses[ type ];
                }
        }

        // Remove auto dataType and get content-type in the process
        while( dataTypes[ 0 ] === "*" ) {
                dataTypes.shift();
                if ( ct === undefined ) {
                        ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
                }
        }

        // Check if we're dealing with a known content-type
        if ( ct ) {
                for ( type in contents ) {
                        if ( contents[ type ] && contents[ type ].test( ct ) ) {
                                dataTypes.unshift( type );
                                break;
                        }
                }
        }

        // Check to see if we have a response for the expected dataType
        if ( dataTypes[ 0 ] in responses ) {
                finalDataType = dataTypes[ 0 ];
        } else {
                // Try convertible dataTypes
                for ( type in responses ) {
                        if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                                finalDataType = type;
                                break;
                        }
                        if ( !firstDataType ) {
                                firstDataType = type;
                        }
                }
                // Or just use first one
                finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if ( finalDataType ) {
                if ( finalDataType !== dataTypes[ 0 ] ) {
                        dataTypes.unshift( finalDataType );
                }
                return responses[ finalDataType ];
        }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

        var conv, conv2, current, tmp,
                // Work with a copy of dataTypes in case we need to modify it for conversion
                dataTypes = s.dataTypes.slice(),
                prev = dataTypes[ 0 ],
                converters = {},
                i = 0;

        // Apply the dataFilter if provided
        if ( s.dataFilter ) {
                response = s.dataFilter( response, s.dataType );
        }

        // Create converters map with lowercased keys
        if ( dataTypes[ 1 ] ) {
                for ( conv in s.converters ) {
                        converters[ conv.toLowerCase() ] = s.converters[ conv ];
                }
        }

        // Convert to each sequential dataType, tolerating list modification
        for ( ; (current = dataTypes[++i]); ) {

                // There's only work to do if current dataType is non-auto
                if ( current !== "*" ) {

                        // Convert response if prev dataType is non-auto and differs from current
                        if ( prev !== "*" && prev !== current ) {

                                // Seek a direct converter
                                conv = converters[ prev + " " + current ] || converters[ "* " + current ];

                                // If none found, seek a pair
                                if ( !conv ) {
                                        for ( conv2 in converters ) {

                                                // If conv2 outputs current
                                                tmp = conv2.split(" ");
                                                if ( tmp[ 1 ] === current ) {

                                                        // If prev can be converted to accepted input
                                                        conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                                                converters[ "* " + tmp[ 0 ] ];
                                                        if ( conv ) {
                                                                // Condense equivalence converters
                                                                if ( conv === true ) {
                                                                        conv = converters[ conv2 ];

                                                                // Otherwise, insert the intermediate dataType
                                                                } else if ( converters[ conv2 ] !== true ) {
                                                                        current = tmp[ 0 ];
                                                                        dataTypes.splice( i--, 0, current );
                                                                }

                                                                break;
                                                        }
                                                }
                                        }
                                }

                                // Apply converter (if not an equivalence)
                                if ( conv !== true ) {

                                        // Unless errors are allowed to bubble, catch and return them
                                        if ( conv && s["throws"] ) {
                                                response = conv( response );
                                        } else {
                                                try {
                                                        response = conv( response );
                                                } catch ( e ) {
                                                        return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                                                }
                                        }
                                }
                        }

                        // Update prev for next iteration
                        prev = current;
                }
        }

        return { state: "success", data: response };
}
var oldCallbacks = [],
        rquestion = /\?/,
        rjsonp = /(=)\?(?=&|$)|\?\?/,
        nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
                var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
                this[ callback ] = true;
                return callback;
        }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

        var callbackName, overwritten, responseContainer,
                data = s.data,
                url = s.url,
                hasCallback = s.jsonp !== false,
                replaceInUrl = hasCallback && rjsonp.test( url ),
                replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
                        !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
                        rjsonp.test( data );

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

                // Get callback name, remembering preexisting value associated with it
                callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
                        s.jsonpCallback() :
                        s.jsonpCallback;
                overwritten = window[ callbackName ];

                // Insert callback into url or form data
                if ( replaceInUrl ) {
                        s.url = url.replace( rjsonp, "$1" + callbackName );
                } else if ( replaceInData ) {
                        s.data = data.replace( rjsonp, "$1" + callbackName );
                } else if ( hasCallback ) {
                        s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
                }

                // Use data converter to retrieve json after script execution
                s.converters["script json"] = function() {
                        if ( !responseContainer ) {
                                jQuery.error( callbackName + " was not called" );
                        }
                        return responseContainer[ 0 ];
                };

                // force json dataType
                s.dataTypes[ 0 ] = "json";

                // Install callback
                window[ callbackName ] = function() {
                        responseContainer = arguments;
                };

                // Clean-up function (fires after converters)
                jqXHR.always(function() {
                        // Restore preexisting value
                        window[ callbackName ] = overwritten;

                        // Save back as free
                        if ( s[ callbackName ] ) {
                                // make sure that re-using the options doesn't screw things around
                                s.jsonpCallback = originalSettings.jsonpCallback;

                                // save the callback name for future use
                                oldCallbacks.push( callbackName );
                        }

                        // Call if it was a function and we have a response
                        if ( responseContainer && jQuery.isFunction( overwritten ) ) {
                                overwritten( responseContainer[ 0 ] );
                        }

                        responseContainer = overwritten = undefined;
                });

                // Delegate to script
                return "script";
        }
});
// Install script dataType
jQuery.ajaxSetup({
        accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
                script: /javascript|ecmascript/
        },
        converters: {
                "text script": function( text ) {
                        jQuery.globalEval( text );
                        return text;
                }
        }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
        if ( s.cache === undefined ) {
                s.cache = false;
        }
        if ( s.crossDomain ) {
                s.type = "GET";
                s.global = false;
        }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

        // This transport only deals with cross domain requests
        if ( s.crossDomain ) {

                var script,
                        head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

                return {

                        send: function( _, callback ) {

                                script = document.createElement( "script" );

                                script.async = "async";

                                if ( s.scriptCharset ) {
                                        script.charset = s.scriptCharset;
                                }

                                script.src = s.url;

                                // Attach handlers for all browsers
                                script.onload = script.onreadystatechange = function( _, isAbort ) {

                                        if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                                                // Handle memory leak in IE
                                                script.onload = script.onreadystatechange = null;

                                                // Remove the script
                                                if ( head && script.parentNode ) {
                                                        head.removeChild( script );
                                                }

                                                // Dereference the script
                                                script = undefined;

                                                // Callback if not abort
                                                if ( !isAbort ) {
                                                        callback( 200, "success" );
                                                }
                                        }
                                };
                                // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                                // This arises when a base node is used (#2709 and #4378).
                                head.insertBefore( script, head.firstChild );
                        },

                        abort: function() {
                                if ( script ) {
                                        script.onload( 0, 1 );
                                }
                        }
                };
        }
});
var xhrCallbacks,
        // #5280: Internet Explorer will keep connections alive if we don't abort on unload
        xhrOnUnloadAbort = window.ActiveXObject ? function() {
                // Abort all pending requests
                for ( var key in xhrCallbacks ) {
                        xhrCallbacks[ key ]( 0, 1 );
                }
        } : false,
        xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
        try {
                return new window.XMLHttpRequest();
        } catch( e ) {}
}

function createActiveXHR() {
        try {
                return new window.ActiveXObject( "Microsoft.XMLHTTP" );
        } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
        /* Microsoft failed to properly
         * implement the XMLHttpRequest in IE7 (can't request local files),
         * so we use the ActiveXObject when it is available
         * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
         * we need a fallback.
         */
        function() {
                return !this.isLocal && createStandardXHR() || createActiveXHR();
        } :
        // For all other browsers, use the standard XMLHttpRequest object
        createStandardXHR;

// Determine support properties
(function( xhr ) {
        jQuery.extend( jQuery.support, {
                ajax: !!xhr,
                cors: !!xhr && ( "withCredentials" in xhr )
        });
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

        jQuery.ajaxTransport(function( s ) {
                // Cross domain only allowed if supported through XMLHttpRequest
                if ( !s.crossDomain || jQuery.support.cors ) {

                        var callback;

                        return {
                                send: function( headers, complete ) {

                                        // Get a new xhr
                                        var handle, i,
                                                xhr = s.xhr();

                                        // Open the socket
                                        // Passing null username, generates a login popup on Opera (#2865)
                                        if ( s.username ) {
                                                xhr.open( s.type, s.url, s.async, s.username, s.password );
                                        } else {
                                                xhr.open( s.type, s.url, s.async );
                                        }

                                        // Apply custom fields if provided
                                        if ( s.xhrFields ) {
                                                for ( i in s.xhrFields ) {
                                                        xhr[ i ] = s.xhrFields[ i ];
                                                }
                                        }

                                        // Override mime type if needed
                                        if ( s.mimeType && xhr.overrideMimeType ) {
                                                xhr.overrideMimeType( s.mimeType );
                                        }

                                        // X-Requested-With header
                                        // For cross-domain requests, seeing as conditions for a preflight are
                                        // akin to a jigsaw puzzle, we simply never set it to be sure.
                                        // (it can always be set on a per-request basis or even using ajaxSetup)
                                        // For same-domain requests, won't change header if already provided.
                                        if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                                                headers[ "X-Requested-With" ] = "XMLHttpRequest";
                                        }

                                        // Need an extra try/catch for cross domain requests in Firefox 3
                                        try {
                                                for ( i in headers ) {
                                                        xhr.setRequestHeader( i, headers[ i ] );
                                                }
                                        } catch( _ ) {}

                                        // Do send the request
                                        // This may raise an exception which is actually
                                        // handled in jQuery.ajax (so no try/catch here)
                                        xhr.send( ( s.hasContent && s.data ) || null );

                                        // Listener
                                        callback = function( _, isAbort ) {

                                                var status,
                                                        statusText,
                                                        responseHeaders,
                                                        responses,
                                                        xml;

                                                // Firefox throws exceptions when accessing properties
                                                // of an xhr when a network error occurred
                                                // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                                                try {

                                                        // Was never called and is aborted or complete
                                                        if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                                                                // Only called once
                                                                callback = undefined;

                                                                // Do not keep as active anymore
                                                                if ( handle ) {
                                                                        xhr.onreadystatechange = jQuery.noop;
                                                                        if ( xhrOnUnloadAbort ) {
                                                                                delete xhrCallbacks[ handle ];
                                                                        }
                                                                }

                                                                // If it's an abort
                                                                if ( isAbort ) {
                                                                        // Abort it manually if needed
                                                                        if ( xhr.readyState !== 4 ) {
                                                                                xhr.abort();
                                                                        }
                                                                } else {
                                                                        status = xhr.status;
                                                                        responseHeaders = xhr.getAllResponseHeaders();
                                                                        responses = {};
                                                                        xml = xhr.responseXML;

                                                                        // Construct response list
                                                                        if ( xml && xml.documentElement /* #4958 */ ) {
                                                                                responses.xml = xml;
                                                                        }

                                                                        // When requesting binary data, IE6-9 will throw an exception
                                                                        // on any attempt to access responseText (#11426)
                                                                        try {
                                                                                responses.text = xhr.responseText;
                                                                        } catch( e ) {
                                                                        }

                                                                        // Firefox throws an exception when accessing
                                                                        // statusText for faulty cross-domain requests
                                                                        try {
                                                                                statusText = xhr.statusText;
                                                                        } catch( e ) {
                                                                                // We normalize with Webkit giving an empty statusText
                                                                                statusText = "";
                                                                        }

                                                                        // Filter status for non standard behaviors

                                                                        // If the request is local and we have data: assume a success
                                                                        // (success with no data won't get notified, that's the best we
                                                                        // can do given current implementations)
                                                                        if ( !status && s.isLocal && !s.crossDomain ) {
                                                                                status = responses.text ? 200 : 404;
                                                                        // IE - #1450: sometimes returns 1223 when it should be 204
                                                                        } else if ( status === 1223 ) {
                                                                                status = 204;
                                                                        }
                                                                }
                                                        }
                                                } catch( firefoxAccessException ) {
                                                        if ( !isAbort ) {
                                                                complete( -1, firefoxAccessException );
                                                        }
                                                }

                                                // Call complete if needed
                                                if ( responses ) {
                                                        complete( status, statusText, responses, responseHeaders );
                                                }
                                        };

                                        if ( !s.async ) {
                                                // if we're in sync mode we fire the callback
                                                callback();
                                        } else if ( xhr.readyState === 4 ) {
                                                // (IE6 & IE7) if it's in cache and has been
                                                // retrieved directly we need to fire the callback
                                                setTimeout( callback, 0 );
                                        } else {
                                                handle = ++xhrId;
                                                if ( xhrOnUnloadAbort ) {
                                                        // Create the active xhrs callbacks list if needed
                                                        // and attach the unload handler
                                                        if ( !xhrCallbacks ) {
                                                                xhrCallbacks = {};
                                                                jQuery( window ).unload( xhrOnUnloadAbort );
                                                        }
                                                        // Add to list of active xhrs callbacks
                                                        xhrCallbacks[ handle ] = callback;
                                                }
                                                xhr.onreadystatechange = callback;
                                        }
                                },

                                abort: function() {
                                        if ( callback ) {
                                                callback(0,1);
                                        }
                                }
                        };
                }
        });
}
var fxNow, timerId,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
        rrun = /queueHooks$/,
        animationPrefilters = [ defaultPrefilter ],
        tweeners = {
                "*": [function( prop, value ) {
                        var end, unit,
                                tween = this.createTween( prop, value ),
                                parts = rfxnum.exec( value ),
                                target = tween.cur(),
                                start = +target || 0,
                                scale = 1,
                                maxIterations = 20;

                        if ( parts ) {
                                end = +parts[2];
                                unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

                                // We need to compute starting value
                                if ( unit !== "px" && start ) {
                                        // Iteratively approximate from a nonzero starting point
                                        // Prefer the current property, because this process will be trivial if it uses the same units
                                        // Fallback to end or a simple constant
                                        start = jQuery.css( tween.elem, prop, true ) || end || 1;

                                        do {
                                                // If previous iteration zeroed out, double until we get *something*
                                                // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                                                scale = scale || ".5";

                                                // Adjust and apply
                                                start = start / scale;
                                                jQuery.style( tween.elem, prop, start + unit );

                                        // Update scale, tolerating zero or NaN from tween.cur()
                                        // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
                                        } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
                                }

                                tween.unit = unit;
                                tween.start = start;
                                // If a +=/-= token was provided, we're doing a relative animation
                                tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
                        }
                        return tween;
                }]
        };

// Animations created synchronously will run synchronously
function createFxNow() {
        setTimeout(function() {
                fxNow = undefined;
        }, 0 );
        return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
        jQuery.each( props, function( prop, value ) {
                var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
                        index = 0,
                        length = collection.length;
                for ( ; index < length; index++ ) {
                        if ( collection[ index ].call( animation, prop, value ) ) {

                                // we're done with this property
                                return;
                        }
                }
        });
}

function Animation( elem, properties, options ) {
        var result,
                index = 0,
                tweenerIndex = 0,
                length = animationPrefilters.length,
                deferred = jQuery.Deferred().always( function() {
                        // don't match elem in the :animated selector
                        delete tick.elem;
                }),
                tick = function() {
                        var currentTime = fxNow || createFxNow(),
                                remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
                                // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
                                temp = remaining / animation.duration || 0,
                                percent = 1 - temp,
                                index = 0,
                                length = animation.tweens.length;

                        for ( ; index < length ; index++ ) {
                                animation.tweens[ index ].run( percent );
                        }

                        deferred.notifyWith( elem, [ animation, percent, remaining ]);

                        if ( percent < 1 && length ) {
                                return remaining;
                        } else {
                                deferred.resolveWith( elem, [ animation ] );
                                return false;
                        }
                },
                animation = deferred.promise({
                        elem: elem,
                        props: jQuery.extend( {}, properties ),
                        opts: jQuery.extend( true, { specialEasing: {} }, options ),
                        originalProperties: properties,
                        originalOptions: options,
                        startTime: fxNow || createFxNow(),
                        duration: options.duration,
                        tweens: [],
                        createTween: function( prop, end, easing ) {
                                var tween = jQuery.Tween( elem, animation.opts, prop, end,
                                                animation.opts.specialEasing[ prop ] || animation.opts.easing );
                                animation.tweens.push( tween );
                                return tween;
                        },
                        stop: function( gotoEnd ) {
                                var index = 0,
                                        // if we are going to the end, we want to run all the tweens
                                        // otherwise we skip this part
                                        length = gotoEnd ? animation.tweens.length : 0;

                                for ( ; index < length ; index++ ) {
                                        animation.tweens[ index ].run( 1 );
                                }

                                // resolve when we played the last frame
                                // otherwise, reject
                                if ( gotoEnd ) {
                                        deferred.resolveWith( elem, [ animation, gotoEnd ] );
                                } else {
                                        deferred.rejectWith( elem, [ animation, gotoEnd ] );
                                }
                                return this;
                        }
                }),
                props = animation.props;

        propFilter( props, animation.opts.specialEasing );

        for ( ; index < length ; index++ ) {
                result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
                if ( result ) {
                        return result;
                }
        }

        createTweens( animation, props );

        if ( jQuery.isFunction( animation.opts.start ) ) {
                animation.opts.start.call( elem, animation );
        }

        jQuery.fx.timer(
                jQuery.extend( tick, {
                        anim: animation,
                        queue: animation.opts.queue,
                        elem: elem
                })
        );

        // attach callbacks from options
        return animation.progress( animation.opts.progress )
                .done( animation.opts.done, animation.opts.complete )
                .fail( animation.opts.fail )
                .always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
        var index, name, easing, value, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for ( index in props ) {
                name = jQuery.camelCase( index );
                easing = specialEasing[ name ];
                value = props[ index ];
                if ( jQuery.isArray( value ) ) {
                        easing = value[ 1 ];
                        value = props[ index ] = value[ 0 ];
                }

                if ( index !== name ) {
                        props[ name ] = value;
                        delete props[ index ];
                }

                hooks = jQuery.cssHooks[ name ];
                if ( hooks && "expand" in hooks ) {
                        value = hooks.expand( value );
                        delete props[ name ];

                        // not quite $.extend, this wont overwrite keys already present.
                        // also - reusing 'index' from above because we have the correct "name"
                        for ( index in value ) {
                                if ( !( index in props ) ) {
                                        props[ index ] = value[ index ];
                                        specialEasing[ index ] = easing;
                                }
                        }
                } else {
                        specialEasing[ name ] = easing;
                }
        }
}

jQuery.Animation = jQuery.extend( Animation, {

        tweener: function( props, callback ) {
                if ( jQuery.isFunction( props ) ) {
                        callback = props;
                        props = [ "*" ];
                } else {
                        props = props.split(" ");
                }

                var prop,
                        index = 0,
                        length = props.length;

                for ( ; index < length ; index++ ) {
                        prop = props[ index ];
                        tweeners[ prop ] = tweeners[ prop ] || [];
                        tweeners[ prop ].unshift( callback );
                }
        },

        prefilter: function( callback, prepend ) {
                if ( prepend ) {
                        animationPrefilters.unshift( callback );
                } else {
                        animationPrefilters.push( callback );
                }
        }
});

function defaultPrefilter( elem, props, opts ) {
        var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
                anim = this,
                style = elem.style,
                orig = {},
                handled = [],
                hidden = elem.nodeType && isHidden( elem );

        // handle queue: false promises
        if ( !opts.queue ) {
                hooks = jQuery._queueHooks( elem, "fx" );
                if ( hooks.unqueued == null ) {
                        hooks.unqueued = 0;
                        oldfire = hooks.empty.fire;
                        hooks.empty.fire = function() {
                                if ( !hooks.unqueued ) {
                                        oldfire();
                                }
                        };
                }
                hooks.unqueued++;

                anim.always(function() {
                        // doing this makes sure that the complete handler will be called
                        // before this completes
                        anim.always(function() {
                                hooks.unqueued--;
                                if ( !jQuery.queue( elem, "fx" ).length ) {
                                        hooks.empty.fire();
                                }
                        });
                });
        }

        // height/width overflow pass
        if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
                // Make sure that nothing sneaks out
                // Record all 3 overflow attributes because IE does not
                // change the overflow attribute when overflowX and
                // overflowY are set to the same value
                opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

                // Set display property to inline-block for height/width
                // animations on inline elements that are having width/height animated
                if ( jQuery.css( elem, "display" ) === "inline" &&
                                jQuery.css( elem, "float" ) === "none" ) {

                        // inline-level elements accept inline-block;
                        // block-level elements need to be inline with layout
                        if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
                                style.display = "inline-block";

                        } else {
                                style.zoom = 1;
                        }
                }
        }

        if ( opts.overflow ) {
                style.overflow = "hidden";
                if ( !jQuery.support.shrinkWrapBlocks ) {
                        anim.done(function() {
                                style.overflow = opts.overflow[ 0 ];
                                style.overflowX = opts.overflow[ 1 ];
                                style.overflowY = opts.overflow[ 2 ];
                        });
                }
        }


        // show/hide pass
        for ( index in props ) {
                value = props[ index ];
                if ( rfxtypes.exec( value ) ) {
                        delete props[ index ];
                        toggle = toggle || value === "toggle";
                        if ( value === ( hidden ? "hide" : "show" ) ) {
                                continue;
                        }
                        handled.push( index );
                }
        }

        length = handled.length;
        if ( length ) {
                dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
                if ( "hidden" in dataShow ) {
                        hidden = dataShow.hidden;
                }

                // store state if its toggle - enables .stop().toggle() to "reverse"
                if ( toggle ) {
                        dataShow.hidden = !hidden;
                }
                if ( hidden ) {
                        jQuery( elem ).show();
                } else {
                        anim.done(function() {
                                jQuery( elem ).hide();
                        });
                }
                anim.done(function() {
                        var prop;
                        jQuery.removeData( elem, "fxshow", true );
                        for ( prop in orig ) {
                                jQuery.style( elem, prop, orig[ prop ] );
                        }
                });
                for ( index = 0 ; index < length ; index++ ) {
                        prop = handled[ index ];
                        tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
                        orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

                        if ( !( prop in dataShow ) ) {
                                dataShow[ prop ] = tween.start;
                                if ( hidden ) {
                                        tween.end = tween.start;
                                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                                }
                        }
                }
        }
}

function Tween( elem, options, prop, end, easing ) {
        return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
        constructor: Tween,
        init: function( elem, options, prop, end, easing, unit ) {
                this.elem = elem;
                this.prop = prop;
                this.easing = easing || "swing";
                this.options = options;
                this.start = this.now = this.cur();
                this.end = end;
                this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
        },
        cur: function() {
                var hooks = Tween.propHooks[ this.prop ];

                return hooks && hooks.get ?
                        hooks.get( this ) :
                        Tween.propHooks._default.get( this );
        },
        run: function( percent ) {
                var eased,
                        hooks = Tween.propHooks[ this.prop ];

                if ( this.options.duration ) {
                        this.pos = eased = jQuery.easing[ this.easing ](
                                percent, this.options.duration * percent, 0, 1, this.options.duration
                        );
                } else {
                        this.pos = eased = percent;
                }
                this.now = ( this.end - this.start ) * eased + this.start;

                if ( this.options.step ) {
                        this.options.step.call( this.elem, this.now, this );
                }

                if ( hooks && hooks.set ) {
                        hooks.set( this );
                } else {
                        Tween.propHooks._default.set( this );
                }
                return this;
        }
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
        _default: {
                get: function( tween ) {
                        var result;

                        if ( tween.elem[ tween.prop ] != null &&
                                (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
                                return tween.elem[ tween.prop ];
                        }

                        // passing any value as a 4th parameter to .css will automatically
                        // attempt a parseFloat and fallback to a string if the parse fails
                        // so, simple values such as "10px" are parsed to Float.
                        // complex values such as "rotate(1rad)" are returned as is.
                        result = jQuery.css( tween.elem, tween.prop, false, "" );
                        // Empty strings, null, undefined and "auto" are converted to 0.
                        return !result || result === "auto" ? 0 : result;
                },
                set: function( tween ) {
                        // use step hook for back compat - use cssHook if its there - use .style if its
                        // available and use plain properties where available
                        if ( jQuery.fx.step[ tween.prop ] ) {
                                jQuery.fx.step[ tween.prop ]( tween );
                        } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
                                jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
                        } else {
                                tween.elem[ tween.prop ] = tween.now;
                        }
                }
        }
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function( tween ) {
                if ( tween.elem.nodeType && tween.elem.parentNode ) {
                        tween.elem[ tween.prop ] = tween.now;
                }
        }
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
        var cssFn = jQuery.fn[ name ];
        jQuery.fn[ name ] = function( speed, easing, callback ) {
                return speed == null || typeof speed === "boolean" ||
                        // special check for .toggle( handler, handler, ... )
                        ( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
                        cssFn.apply( this, arguments ) :
                        this.animate( genFx( name, true ), speed, easing, callback );
        };
});

jQuery.fn.extend({
        fadeTo: function( speed, to, easing, callback ) {

                // show any hidden elements after setting opacity to 0
                return this.filter( isHidden ).css( "opacity", 0 ).show()

                        // animate to the value specified
                        .end().animate({ opacity: to }, speed, easing, callback );
        },
        animate: function( prop, speed, easing, callback ) {
                var empty = jQuery.isEmptyObject( prop ),
                        optall = jQuery.speed( speed, easing, callback ),
                        doAnimation = function() {
                                // Operate on a copy of prop so per-property easing won't be lost
                                var anim = Animation( this, jQuery.extend( {}, prop ), optall );

                                // Empty animations resolve immediately
                                if ( empty ) {
                                        anim.stop( true );
                                }
                        };

                return empty || optall.queue === false ?
                        this.each( doAnimation ) :
                        this.queue( optall.queue, doAnimation );
        },
        stop: function( type, clearQueue, gotoEnd ) {
                var stopQueue = function( hooks ) {
                        var stop = hooks.stop;
                        delete hooks.stop;
                        stop( gotoEnd );
                };

                if ( typeof type !== "string" ) {
                        gotoEnd = clearQueue;
                        clearQueue = type;
                        type = undefined;
                }
                if ( clearQueue && type !== false ) {
                        this.queue( type || "fx", [] );
                }

                return this.each(function() {
                        var dequeue = true,
                                index = type != null && type + "queueHooks",
                                timers = jQuery.timers,
                                data = jQuery._data( this );

                        if ( index ) {
                                if ( data[ index ] && data[ index ].stop ) {
                                        stopQueue( data[ index ] );
                                }
                        } else {
                                for ( index in data ) {
                                        if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                                                stopQueue( data[ index ] );
                                        }
                                }
                        }

                        for ( index = timers.length; index--; ) {
                                if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
                                        timers[ index ].anim.stop( gotoEnd );
                                        dequeue = false;
                                        timers.splice( index, 1 );
                                }
                        }

                        // start the next in the queue if the last step wasn't forced
                        // timers currently will call their complete callbacks, which will dequeue
                        // but only if they were gotoEnd
                        if ( dequeue || !gotoEnd ) {
                                jQuery.dequeue( this, type );
                        }
                });
        }
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
        var which,
                attrs = { height: type },
                i = 0;

        // if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth? 1 : 0;
        for( ; i < 4 ; i += 2 - includeWidth ) {
                which = cssExpand[ i ];
                attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
        }

        if ( includeWidth ) {
                attrs.opacity = attrs.width = type;
        }

        return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
        jQuery.fn[ name ] = function( speed, easing, callback ) {
                return this.animate( props, speed, easing, callback );
        };
});

jQuery.speed = function( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
                complete: fn || !fn && easing ||
                        jQuery.isFunction( speed ) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
                opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if ( opt.queue == null || opt.queue === true ) {
                opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function() {
                if ( jQuery.isFunction( opt.old ) ) {
                        opt.old.call( this );
                }

                if ( opt.queue ) {
                        jQuery.dequeue( this, opt.queue );
                }
        };

        return opt;
};

jQuery.easing = {
        linear: function( p ) {
                return p;
        },
        swing: function( p ) {
                return 0.5 - Math.cos( p*Math.PI ) / 2;
        }
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
        var timer,
                timers = jQuery.timers,
                i = 0;

        fxNow = jQuery.now();

        for ( ; i < timers.length; i++ ) {
                timer = timers[ i ];
                // Checks the timer has not already been removed
                if ( !timer() && timers[ i ] === timer ) {
                        timers.splice( i--, 1 );
                }
        }

        if ( !timers.length ) {
                jQuery.fx.stop();
        }
        fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
        if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
                timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
        }
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
        clearInterval( timerId );
        timerId = null;
};

jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.animated = function( elem ) {
                return jQuery.grep(jQuery.timers, function( fn ) {
                        return elem === fn.elem;
                }).length;
        };
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
        if ( arguments.length ) {
                return options === undefined ?
                        this :
                        this.each(function( i ) {
                                jQuery.offset.setOffset( this, options, i );
                        });
        }

        var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
                box = { top: 0, left: 0 },
                elem = this[ 0 ],
                doc = elem && elem.ownerDocument;

        if ( !doc ) {
                return;
        }

        if ( (body = doc.body) === elem ) {
                return jQuery.offset.bodyOffset( elem );
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        if ( !jQuery.contains( docElem, elem ) ) {
                return box;
        }

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if ( typeof elem.getBoundingClientRect !== "undefined" ) {
                box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        clientTop  = docElem.clientTop  || body.clientTop  || 0;
        clientLeft = docElem.clientLeft || body.clientLeft || 0;
        scrollTop  = win.pageYOffset || docElem.scrollTop;
        scrollLeft = win.pageXOffset || docElem.scrollLeft;
        return {
                top: box.top  + scrollTop  - clientTop,
                left: box.left + scrollLeft - clientLeft
        };
};

jQuery.offset = {

        bodyOffset: function( body ) {
                var top = body.offsetTop,
                        left = body.offsetLeft;

                if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
                        top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
                        left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
                }

                return { top: top, left: left };
        },

        setOffset: function( elem, options, i ) {
                var position = jQuery.css( elem, "position" );

                // set position first, in-case top/left are set even on static elem
                if ( position === "static" ) {
                        elem.style.position = "relative";
                }

                var curElem = jQuery( elem ),
                        curOffset = curElem.offset(),
                        curCSSTop = jQuery.css( elem, "top" ),
                        curCSSLeft = jQuery.css( elem, "left" ),
                        calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
                        props = {}, curPosition = {}, curTop, curLeft;

                // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
                if ( calculatePosition ) {
                        curPosition = curElem.position();
                        curTop = curPosition.top;
                        curLeft = curPosition.left;
                } else {
                        curTop = parseFloat( curCSSTop ) || 0;
                        curLeft = parseFloat( curCSSLeft ) || 0;
                }

                if ( jQuery.isFunction( options ) ) {
                        options = options.call( elem, i, curOffset );
                }

                if ( options.top != null ) {
                        props.top = ( options.top - curOffset.top ) + curTop;
                }
                if ( options.left != null ) {
                        props.left = ( options.left - curOffset.left ) + curLeft;
                }

                if ( "using" in options ) {
                        options.using.call( elem, props );
                } else {
                        curElem.css( props );
                }
        }
};


jQuery.fn.extend({

        position: function() {
                if ( !this[0] ) {
                        return;
                }

                var elem = this[0],

                // Get *real* offsetParent
                offsetParent = this.offsetParent(),

                // Get correct offsets
                offset       = this.offset(),
                parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

                // Subtract element margins
                // note: when an element has margin: auto the offsetLeft and marginLeft
                // are the same in Safari causing offset.left to incorrectly be 0
                offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
                offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

                // Add offsetParent borders
                parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
                parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

                // Subtract the two offsets
                return {
                        top:  offset.top  - parentOffset.top,
                        left: offset.left - parentOffset.left
                };
        },

        offsetParent: function() {
                return this.map(function() {
                        var offsetParent = this.offsetParent || document.body;
                        while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
                                offsetParent = offsetParent.offsetParent;
                        }
                        return offsetParent || document.body;
                });
        }
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
        var top = /Y/.test( prop );

        jQuery.fn[ method ] = function( val ) {
                return jQuery.access( this, function( elem, method, val ) {
                        var win = getWindow( elem );

                        if ( val === undefined ) {
                                return win ? (prop in win) ? win[ prop ] :
                                        win.document.documentElement[ method ] :
                                        elem[ method ];
                        }

                        if ( win ) {
                                win.scrollTo(
                                        !top ? val : jQuery( win ).scrollLeft(),
                                         top ? val : jQuery( win ).scrollTop()
                                );

                        } else {
                                elem[ method ] = val;
                        }
                }, method, val, arguments.length, null );
        };
});

function getWindow( elem ) {
        return jQuery.isWindow( elem ) ?
                elem :
                elem.nodeType === 9 ?
                        elem.defaultView || elem.parentWindow :
                        false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
        jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
                // margin is only for outerHeight, outerWidth
                jQuery.fn[ funcName ] = function( margin, value ) {
                        var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
                                extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

                        return jQuery.access( this, function( elem, type, value ) {
                                var doc;

                                if ( jQuery.isWindow( elem ) ) {
                                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                                        // https://github.com/jquery/jquery/pull/764
                                        return elem.document.documentElement[ "client" + name ];
                                }

                                // Get document width or height
                                if ( elem.nodeType === 9 ) {
                                        doc = elem.documentElement;

                                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                                        return Math.max(
                                                elem.body[ "scroll" + name ], doc[ "scroll" + name ],
                                                elem.body[ "offset" + name ], doc[ "offset" + name ],
                                                doc[ "client" + name ]
                                        );
                                }

                                return value === undefined ?
                                        // Get width or height on the element, requesting but not forcing parseFloat
                                        jQuery.css( elem, type, value, extra ) :

                                        // Set width or height on the element
                                        jQuery.style( elem, type, value, extra );
                        }, type, chainable ? margin : undefined, chainable, null );
                };
        });
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
        define( "jquery", [], function () { return jQuery; } );
}

})( window );
/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
// moment.js
// version : 2.0.0
// author : Tim Wood
// license : MIT
// momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.0.0",
        round = Math.round, i,
        // internal storage for language config files
        languages = {},

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing tokens
        parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenWord = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i, // any word (or two) characters or numbers including two word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO seperator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        // preliminary iso regex
        // 0000-00-00 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000
        isoRegex = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,
        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.S', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Month|Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return ~~(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(~~(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(~~(a / 60), 2) + ":" + leftZeroFill(~~a % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(~~(10 * a / 6), 4);
            },
            X    : function () {
                return this.unix();
            }
        };

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a));
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i]);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var data = this._data = {},
            years = duration.years || duration.year || duration.y || 0,
            months = duration.months || duration.month || duration.M || 0,
            weeks = duration.weeks || duration.week || duration.w || 0,
            days = duration.days || duration.day || duration.d || 0,
            hours = duration.hours || duration.hour || duration.h || 0,
            minutes = duration.minutes || duration.minute || duration.m || 0,
            seconds = duration.seconds || duration.second || duration.s || 0,
            milliseconds = duration.milliseconds || duration.millisecond || duration.ms || 0;

        // representation for dateAddRemove
        this._milliseconds = milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = months +
            years * 12;

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;
        seconds += absRound(milliseconds / 1000);

        data.seconds = seconds % 60;
        minutes += absRound(seconds / 60);

        data.minutes = minutes % 60;
        hours += absRound(minutes / 60);

        data.hours = hours % 24;
        days += absRound(hours / 24);

        days += weeks * 7;
        data.days = days % 30;

        months += absRound(days / 30);

        data.months = months % 12;
        years += absRound(months / 12);

        data.years = years;
    }


    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }
        return a;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding) {
        var ms = duration._milliseconds,
            d = duration._days,
            M = duration._months,
            currentDate;

        if (ms) {
            mom._d.setTime(+mom + ms * isAdding);
        }
        if (d) {
            mom.date(mom.date() + d * isAdding);
        }
        if (M) {
            currentDate = mom.date();
            mom.date(1)
                .month(mom.month() + M * isAdding)
                .date(Math.min(currentDate, mom.daysInMonth()));
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (~~array1[i] !== ~~array2[i]) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }


    /************************************
        Languages
    ************************************/


    Language.prototype = {
        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex, output;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy);
        },
        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        }
    };

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        if (!key) {
            return moment.fn._lang;
        }
        if (!languages[key] && hasModule) {
            require('./lang/' + key);
        }
        return languages[key];
    }


    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[.*\]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += typeof array[i].call === 'function' ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return m.lang().longDateFormat(input) || input;
        }

        while (i-- && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        }

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token) {
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
            return parseTokenFourDigits;
        case 'YYYYY':
            return parseTokenSixDigits;
        case 'S':
        case 'SS':
        case 'SSS':
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'a':
        case 'A':
            return parseTokenWord;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
            return parseTokenOneOrTwoDigits;
        default :
            return new RegExp(token.replace('\\', ''));
        }
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, b,
            datePartArray = config._a;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            datePartArray[1] = (input == null) ? 0 : ~~input - 1;
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[1] = a;
            } else {
                config._isValid = false;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DDDD
        case 'DD' : // fall through to DDDD
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                datePartArray[2] = ~~input;
            }
            break;
        // YEAR
        case 'YY' :
            datePartArray[0] = ~~input + (~~input > 68 ? 1900 : 2000);
            break;
        case 'YYYY' :
        case 'YYYYY' :
            datePartArray[0] = ~~input;
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = ((input + '').toLowerCase() === 'pm');
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[3] = ~~input;
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[4] = ~~input;
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[5] = ~~input;
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
            datePartArray[6] = ~~ (('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            a = (input + '').match(parseTimezoneChunker);
            if (a && a[1]) {
                config._tzh = ~~a[1];
            }
            if (a && a[2]) {
                config._tzm = ~~a[2];
            }
            // reverse offsets
            if (a && a[0] === '+') {
                config._tzh = -config._tzh;
                config._tzm = -config._tzm;
            }
            break;
        }

        // if the input is null, the date is not valid
        if (input == null) {
            config._isValid = false;
        }
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromArray(config) {
        var i, date, input = [];

        if (config._d) {
            return;
        }

        for (i = 0; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[3] += config._tzh || 0;
        input[4] += config._tzm || 0;

        date = new Date(0);

        if (config._useUTC) {
            date.setUTCFullYear(input[0], input[1], input[2]);
            date.setUTCHours(input[3], input[4], input[5], input[6]);
        } else {
            date.setFullYear(input[0], input[1], input[2]);
            date.setHours(input[3], input[4], input[5], input[6]);
        }

        config._d = date;
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var tokens = config._f.match(formattingTokens),
            string = config._i,
            i, parsedInput;

        config._a = [];

        for (i = 0; i < tokens.length; i++) {
            parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
            if (parsedInput) {
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            }
            // don't parse if its not a known token
            if (formatTokenFunctions[tokens[i]]) {
                addTimeToArrayFromToken(tokens[i], parsedInput, config);
            }
        }
        // handle am pm
        if (config._isPm && config._a[3] < 12) {
            config._a[3] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[3] === 12) {
            config._a[3] = 0;
        }
        // return
        dateFromArray(config);
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            tempMoment,
            bestMoment,

            scoreToBeat = 99,
            i,
            currentDate,
            currentScore;

        while (config._f.length) {
            tempConfig = extend({}, config);
            tempConfig._f = config._f.pop();
            makeDateFromStringAndFormat(tempConfig);
            tempMoment = new Moment(tempConfig);

            if (tempMoment.isValid()) {
                bestMoment = tempMoment;
                break;
            }

            currentScore = compareArrays(tempConfig._a, tempMoment.toArray());

            if (currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempMoment;
            }
        }

        extend(config, bestMoment);
    }

    // date from iso format
    function makeDateFromString(config) {
        var i,
            string = config._i;
        if (isoRegex.exec(string)) {
            config._f = 'YYYY-MM-DDT';
            for (i = 0; i < 4; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (parseTokenTimezone.exec(string)) {
                config._f += " Z";
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._d = new Date(string);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromArray(config);
        } else {
            config._d = input instanceof Date ? new Date(+input) : new Date(input);
        }
    }


    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day();


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        return Math.ceil(moment(mom).add('d', daysToDayOfWeek).dayOfYear() / 7);
    }


    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null || input === '') {
            return null;
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = extend({}, input);
            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang) {
        return makeMoment({
            _i : input,
            _f : format,
            _l : lang,
            _isUTC : false
        });
    };

    // creating with utc
    moment.utc = function (input, format, lang) {
        return makeMoment({
            _useUTC : true,
            _isUTC : true,
            _l : lang,
            _i : input,
            _f : format
        });
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var isDuration = moment.isDuration(input),
            isNumber = (typeof input === 'number'),
            duration = (isDuration ? input._data : (isNumber ? {} : input)),
            ret;

        if (isNumber) {
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        }

        ret = new Duration(duration);

        if (isDuration && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var i;

        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(key, values);
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment;
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };


    /************************************
        Moment Prototype
    ************************************/


    moment.fn = Moment.prototype = {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d;
        },

        unix : function () {
            return Math.floor(+this._d / 1000);
        },

        toString : function () {
            return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._d;
        },

        toJSON : function () {
            return moment.utc(this).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            if (this._isValid == null) {
                if (this._a) {
                    this._isValid = !compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray());
                } else {
                    this._isValid = !isNaN(this._d.getTime());
                }
            }
            return !!this._isValid;
        },

        utc : function () {
            this._isUTC = true;
            return this;
        },

        local : function () {
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = this._isUTC ? moment(input).utc() : moment(input).local(),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            if (units) {
                // standardize on singular form
                units = units.replace(/s$/, '');
            }

            if (units === 'year' || units === 'month') {
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                output += ((this - moment(this).startOf('month')) - (that - moment(that).startOf('month'))) / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that) - zoneDiff;
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? diff / 864e5 : // 1000 * 60 * 60 * 24
                    units === 'week' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            var diff = this.diff(moment().startOf('day'), 'days', true),
                format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            var year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        },

        isDST : function () {
            return (this.zone() < moment([this.year()]).zone() ||
                this.zone() < moment([this.year(), 5]).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return input == null ? day :
                this.add({ d : input - day });
        },

        startOf: function (units) {
            units = units.replace(/s$/, '');
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.day(0);
            }

            return this;
        },

        endOf: function (units) {
            return this.startOf(units).add(units.replace(/s?$/, 's'), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) === +moment(input).startOf(units);
        },

        zone : function () {
            return this._isUTC ? 0 : this._d.getTimezoneOffset();
        },

        daysInMonth : function () {
            return moment.utc([this.year(), this.month() + 1, 0]).date();
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    };

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + 's'] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;

    /************************************
        Duration Prototype
    ************************************/


    moment.duration.fn = Duration.prototype = {
        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              this._months * 2592e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        lang : moment.fn.lang
    };

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });


    /************************************
        Exposing Moment
    ************************************/


    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    }
    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        this['moment'] = moment;
    }
    /*global define:false */
    if (typeof define === "function" && define.amd) {
        define("moment", [], function () {
            return moment;
        });
    }
}).call(this);
//
// showdown.js -- A javascript port of Markdown.
//
// Copyright (c) 2007 John Fraser.
//
// Original Markdown Copyright (c) 2004-2005 John Gruber
//   <http://daringfireball.net/projects/markdown/>
//
// Redistributable under a BSD-style open source license.
// See license.txt for more information.
//
// The full source distribution is at:
//
//				A A L
//				T C A
//				T K B
//
//   <http://www.attacklab.net/>
//

//
// Wherever possible, Showdown is a straight, line-by-line port
// of the Perl version of Markdown.
//
// This is not a normal parser design; it's basically just a
// series of string substitutions.  It's hard to read and
// maintain this way,  but keeping Showdown close to the original
// design makes it easier to port new features.
//
// More importantly, Showdown behaves like markdown.pl in most
// edge cases.  So web applications can do client-side preview
// in Javascript, and then build identical HTML on the server.
//
// This port needs the new RegExp functionality of ECMA 262,
// 3rd Edition (i.e. Javascript 1.5).  Most modern web browsers
// should do fine.  Even with the new regular expression features,
// We do a lot of work to emulate Perl's regex functionality.
// The tricky changes in this file mostly have the "attacklab:"
// label.  Major or self-explanatory changes don't.
//
// Smart diff tools like Araxis Merge will be able to match up
// this file with markdown.pl in a useful way.  A little tweaking
// helps: in a copy of markdown.pl, replace "#" with "//" and
// replace "$text" with "text".  Be sure to ignore whitespace
// and line endings.
//


//
// Showdown usage:
//
//   var text = "Markdown *rocks*.";
//
//   var converter = new Showdown.converter();
//   var html = converter.makeHtml(text);
//
//   alert(html);
//
// Note: move the sample code to the bottom of this
// file before uncommenting it.
//


//
// Showdown namespace
//
var Showdown = { extensions: {} };

//
// forEach
//
var forEach = Showdown.forEach = function(obj, callback) {
	if (typeof obj.forEach === 'function') {
		obj.forEach(callback);
	} else {
		var i, len = obj.length;
		for (i = 0; i < len; i++) {
			callback(obj[i], i, obj);
		}
	}
};

//
// Standard extension naming
//
var stdExtName = function(s) {
	return s.replace(/[_-]||\s/g, '').toLowerCase();
};

//
// converter
//
// Wraps all "globals" so that the only thing
// exposed is makeHtml().
//
Showdown.converter = function(converter_options) {

//
// Globals:
//

// Global hashes, used by various utility routines
var g_urls;
var g_titles;
var g_html_blocks;

// Used to track when we're inside an ordered or unordered list
// (see _ProcessListItems() for details):
var g_list_level = 0;

// Global extensions
var g_lang_extensions = [];
var g_output_modifiers = [];


//
// Automatic Extension Loading (node only):
//

if (typeof module !== 'undefind' && typeof exports !== 'undefined' && typeof require !== 'undefind') {
	var fs = require('fs');

	if (fs) {
		// Search extensions folder
		var extensions = fs.readdirSync((__dirname || '.')+'/extensions').filter(function(file){
			return ~file.indexOf('.js');
		}).map(function(file){
			return file.replace(/\.js$/, '');
		});
		// Load extensions into Showdown namespace
		Showdown.forEach(extensions, function(ext){
			var name = stdExtName(ext);
			Showdown.extensions[name] = require('./extensions/' + ext);
		});
	}
}

this.makeHtml = function(text) {
//
// Main function. The order in which other subs are called here is
// essential. Link and image substitutions need to happen before
// _EscapeSpecialCharsWithinTagAttributes(), so that any *'s or _'s in the <a>
// and <img> tags get encoded.
//

	// Clear the global hashes. If we don't clear these, you get conflicts
	// from other articles when generating a page which contains more than
	// one article (e.g. an index page that shows the N most recent
	// articles):
	g_urls = {};
	g_titles = {};
	g_html_blocks = [];

	// attacklab: Replace ~ with ~T
	// This lets us use tilde as an escape char to avoid md5 hashes
	// The choice of character is arbitray; anything that isn't
	// magic in Markdown will work.
	text = text.replace(/~/g,"~T");

	// attacklab: Replace $ with ~D
	// RegExp interprets $ as a special character
	// when it's in a replacement string
	text = text.replace(/\$/g,"~D");

	// Standardize line endings
	text = text.replace(/\r\n/g,"\n"); // DOS to Unix
	text = text.replace(/\r/g,"\n"); // Mac to Unix

	// Make sure text begins and ends with a couple of newlines:
	text = "\n\n" + text + "\n\n";

	// Convert all tabs to spaces.
	text = _Detab(text);

	// Strip any lines consisting only of spaces and tabs.
	// This makes subsequent regexen easier to write, because we can
	// match consecutive blank lines with /\n+/ instead of something
	// contorted like /[ \t]*\n+/ .
	text = text.replace(/^[ \t]+$/mg,"");

	// Run language extensions
	Showdown.forEach(g_lang_extensions, function(x){
		text = _ExecuteExtension(x, text);
	});

	// Handle github codeblocks prior to running HashHTML so that
	// HTML contained within the codeblock gets escaped propertly
	text = _DoGithubCodeBlocks(text);

	// Turn block-level HTML blocks into hash entries
	text = _HashHTMLBlocks(text);

	// Strip link definitions, store in hashes.
	text = _StripLinkDefinitions(text);

	text = _RunBlockGamut(text);

	text = _UnescapeSpecialChars(text);

	// attacklab: Restore dollar signs
	text = text.replace(/~D/g,"$$");

	// attacklab: Restore tildes
	text = text.replace(/~T/g,"~");

	// Run output modifiers
	Showdown.forEach(g_output_modifiers, function(x){
		text = _ExecuteExtension(x, text);
	});

	return text;
};
//
// Options:
//

// Parse extensions options into separate arrays
if (converter_options && converter_options.extensions) {

  var self = this;

	// Iterate over each plugin
	Showdown.forEach(converter_options.extensions, function(plugin){

		// Assume it's a bundled plugin if a string is given
		if (typeof plugin === 'string') {
			plugin = Showdown.extensions[stdExtName(plugin)];
		}

		if (typeof plugin === 'function') {
			// Iterate over each extension within that plugin
			Showdown.forEach(plugin(self), function(ext){
				// Sort extensions by type
				if (ext.type) {
					if (ext.type === 'language' || ext.type === 'lang') {
						g_lang_extensions.push(ext);
					} else if (ext.type === 'output' || ext.type === 'html') {
						g_output_modifiers.push(ext);
					}
				} else {
					// Assume language extension
					g_output_modifiers.push(ext);
				}
			});
		} else {
			throw "Extension '" + plugin + "' could not be loaded.  It was either not found or is not a valid extension.";
		}
	});
}


var _ExecuteExtension = function(ext, text) {
	if (ext.regex) {
		var re = new RegExp(ext.regex, 'g');
		return text.replace(re, ext.replace);
	} else if (ext.filter) {
		return ext.filter(text);
	}
};

var _StripLinkDefinitions = function(text) {
//
// Strips link definitions from text, stores the URLs and titles in
// hash references.
//

	// Link defs are in the form: ^[id]: url "optional title"

	/*
		var text = text.replace(/
				^[ ]{0,3}\[(.+)\]:  // id = $1  attacklab: g_tab_width - 1
				  [ \t]*
				  \n?				// maybe *one* newline
				  [ \t]*
				<?(\S+?)>?			// url = $2
				  [ \t]*
				  \n?				// maybe one newline
				  [ \t]*
				(?:
				  (\n*)				// any lines skipped = $3 attacklab: lookbehind removed
				  ["(]
				  (.+?)				// title = $4
				  [")]
				  [ \t]*
				)?					// title is optional
				(?:\n+|$)
			  /gm,
			  function(){...});
	*/

	// attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
	text += "~0";

	text = text.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|(?=~0))/gm,
		function (wholeMatch,m1,m2,m3,m4) {
			m1 = m1.toLowerCase();
			g_urls[m1] = _EncodeAmpsAndAngles(m2);  // Link IDs are case-insensitive
			if (m3) {
				// Oops, found blank lines, so it's not a title.
				// Put back the parenthetical statement we stole.
				return m3+m4;
			} else if (m4) {
				g_titles[m1] = m4.replace(/"/g,"&quot;");
			}

			// Completely remove the definition from the text
			return "";
		}
	);

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
}


var _HashHTMLBlocks = function(text) {
	// attacklab: Double up blank lines to reduce lookaround
	text = text.replace(/\n/g,"\n\n");

	// Hashify HTML blocks:
	// We only want to do this for block-level HTML tags, such as headers,
	// lists, and tables. That's because we still want to wrap <p>s around
	// "paragraphs" that are wrapped in non-block-level tags, such as anchors,
	// phrase emphasis, and spans. The list of tags we're looking for is
	// hard-coded:
	var block_tags_a = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del|style|section|header|footer|nav|article|aside";
	var block_tags_b = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside";

	// First, look for nested blocks, e.g.:
	//   <div>
	//     <div>
	//     tags for inner block must be indented.
	//     </div>
	//   </div>
	//
	// The outermost tags must start at the left margin for this to match, and
	// the inner nested divs must be indented.
	// We need to do this before the next, more liberal match, because the next
	// match will start at the first `<div>` and stop at the first `</div>`.

	// attacklab: This regex can be expensive when it fails.
	/*
		var text = text.replace(/
		(						// save in $1
			^					// start of line  (with /m)
			<($block_tags_a)	// start tag = $2
			\b					// word break
								// attacklab: hack around khtml/pcre bug...
			[^\r]*?\n			// any number of lines, minimally matching
			</\2>				// the matching end tag
			[ \t]*				// trailing spaces/tabs
			(?=\n+)				// followed by a newline
		)						// attacklab: there are sentinel newlines at end of document
		/gm,function(){...}};
	*/
	text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,hashElement);

	//
	// Now match more liberally, simply from `\n<tag>` to `</tag>\n`
	//

	/*
		var text = text.replace(/
		(						// save in $1
			^					// start of line  (with /m)
			<($block_tags_b)	// start tag = $2
			\b					// word break
								// attacklab: hack around khtml/pcre bug...
			[^\r]*?				// any number of lines, minimally matching
			</\2>				// the matching end tag
			[ \t]*				// trailing spaces/tabs
			(?=\n+)				// followed by a newline
		)						// attacklab: there are sentinel newlines at end of document
		/gm,function(){...}};
	*/
	text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside)\b[^\r]*?<\/\2>[ \t]*(?=\n+)\n)/gm,hashElement);

	// Special case just for <hr />. It was easier to make a special case than
	// to make the other regex more complicated.

	/*
		text = text.replace(/
		(						// save in $1
			\n\n				// Starting after a blank line
			[ ]{0,3}
			(<(hr)				// start tag = $2
			\b					// word break
			([^<>])*?			//
			\/?>)				// the matching end tag
			[ \t]*
			(?=\n{2,})			// followed by a blank line
		)
		/g,hashElement);
	*/
	text = text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,hashElement);

	// Special case for standalone HTML comments:

	/*
		text = text.replace(/
		(						// save in $1
			\n\n				// Starting after a blank line
			[ ]{0,3}			// attacklab: g_tab_width - 1
			<!
			(--[^\r]*?--\s*)+
			>
			[ \t]*
			(?=\n{2,})			// followed by a blank line
		)
		/g,hashElement);
	*/
	text = text.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,hashElement);

	// PHP and ASP-style processor instructions (<?...?> and <%...%>)

	/*
		text = text.replace(/
		(?:
			\n\n				// Starting after a blank line
		)
		(						// save in $1
			[ ]{0,3}			// attacklab: g_tab_width - 1
			(?:
				<([?%])			// $2
				[^\r]*?
				\2>
			)
			[ \t]*
			(?=\n{2,})			// followed by a blank line
		)
		/g,hashElement);
	*/
	text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,hashElement);

	// attacklab: Undo double lines (see comment at top of this function)
	text = text.replace(/\n\n/g,"\n");
	return text;
}

var hashElement = function(wholeMatch,m1) {
	var blockText = m1;

	// Undo double lines
	blockText = blockText.replace(/\n\n/g,"\n");
	blockText = blockText.replace(/^\n/,"");

	// strip trailing blank lines
	blockText = blockText.replace(/\n+$/g,"");

	// Replace the element text with a marker ("~KxK" where x is its key)
	blockText = "\n\n~K" + (g_html_blocks.push(blockText)-1) + "K\n\n";

	return blockText;
};

var _RunBlockGamut = function(text) {
//
// These are all the transformations that form block-level
// tags like paragraphs, headers, and list items.
//
	text = _DoHeaders(text);

	// Do Horizontal Rules:
	var key = hashBlock("<hr />");
	text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,key);
	text = text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,key);
	text = text.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,key);

	text = _DoLists(text);
	text = _DoCodeBlocks(text);
	text = _DoBlockQuotes(text);

	// We already ran _HashHTMLBlocks() before, in Markdown(), but that
	// was to escape raw HTML in the original Markdown source. This time,
	// we're escaping the markup we've just created, so that we don't wrap
	// <p> tags around block-level tags.
	text = _HashHTMLBlocks(text);
	text = _FormParagraphs(text);

	return text;
};


var _RunSpanGamut = function(text) {
//
// These are all the transformations that occur *within* block-level
// tags like paragraphs, headers, and list items.
//

	text = _DoCodeSpans(text);
	text = _EscapeSpecialCharsWithinTagAttributes(text);
	text = _EncodeBackslashEscapes(text);

	// Process anchor and image tags. Images must come first,
	// because ![foo][f] looks like an anchor.
	text = _DoImages(text);
	text = _DoAnchors(text);

	// Make links out of things like `<http://example.com/>`
	// Must come after _DoAnchors(), because you can use < and >
	// delimiters in inline links like [this](<url>).
	text = _DoAutoLinks(text);
	text = _EncodeAmpsAndAngles(text);
	text = _DoItalicsAndBold(text);

	// Do hard breaks:
	text = text.replace(/  +\n/g," <br />\n");

	return text;
}

var _EscapeSpecialCharsWithinTagAttributes = function(text) {
//
// Within tags -- meaning between < and > -- encode [\ ` * _] so they
// don't conflict with their use in Markdown for code, italics and strong.
//

	// Build a regex to find HTML tags and comments.  See Friedl's
	// "Mastering Regular Expressions", 2nd Ed., pp. 200-201.
	var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

	text = text.replace(regex, function(wholeMatch) {
		var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g,"$1`");
		tag = escapeCharacters(tag,"\\`*_");
		return tag;
	});

	return text;
}

var _DoAnchors = function(text) {
//
// Turn Markdown link shortcuts into XHTML <a> tags.
//
	//
	// First, handle reference-style links: [link text] [id]
	//

	/*
		text = text.replace(/
		(							// wrap whole match in $1
			\[
			(
				(?:
					\[[^\]]*\]		// allow brackets nested one level
					|
					[^\[]			// or anything else
				)*
			)
			\]

			[ ]?					// one optional space
			(?:\n[ ]*)?				// one optional newline followed by spaces

			\[
			(.*?)					// id = $3
			\]
		)()()()()					// pad remaining backreferences
		/g,_DoAnchors_callback);
	*/
	text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeAnchorTag);

	//
	// Next, inline-style links: [link text](url "optional title")
	//

	/*
		text = text.replace(/
			(						// wrap whole match in $1
				\[
				(
					(?:
						\[[^\]]*\]	// allow brackets nested one level
					|
					[^\[\]]			// or anything else
				)
			)
			\]
			\(						// literal paren
			[ \t]*
			()						// no id, so leave $3 empty
			<?(.*?)>?				// href = $4
			[ \t]*
			(						// $5
				(['"])				// quote char = $6
				(.*?)				// Title = $7
				\6					// matching quote
				[ \t]*				// ignore any spaces/tabs between closing quote and )
			)?						// title is optional
			\)
		)
		/g,writeAnchorTag);
	*/
	text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeAnchorTag);

	//
	// Last, handle reference-style shortcuts: [link text]
	// These must come last in case you've also got [link test][1]
	// or [link test](/foo)
	//

	/*
		text = text.replace(/
		(		 					// wrap whole match in $1
			\[
			([^\[\]]+)				// link text = $2; can't contain '[' or ']'
			\]
		)()()()()()					// pad rest of backreferences
		/g, writeAnchorTag);
	*/
	text = text.replace(/(\[([^\[\]]+)\])()()()()()/g, writeAnchorTag);

	return text;
}

var writeAnchorTag = function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
	if (m7 == undefined) m7 = "";
	var whole_match = m1;
	var link_text   = m2;
	var link_id	 = m3.toLowerCase();
	var url		= m4;
	var title	= m7;

	if (url == "") {
		if (link_id == "") {
			// lower-case and turn embedded newlines into spaces
			link_id = link_text.toLowerCase().replace(/ ?\n/g," ");
		}
		url = "#"+link_id;

		if (g_urls[link_id] != undefined) {
			url = g_urls[link_id];
			if (g_titles[link_id] != undefined) {
				title = g_titles[link_id];
			}
		}
		else {
			if (whole_match.search(/\(\s*\)$/m)>-1) {
				// Special case for explicit empty url
				url = "";
			} else {
				return whole_match;
			}
		}
	}

	url = escapeCharacters(url,"*_");
	var result = "<a href=\"" + url + "\"";

	if (title != "") {
		title = title.replace(/"/g,"&quot;");
		title = escapeCharacters(title,"*_");
		result +=  " title=\"" + title + "\"";
	}

	result += ">" + link_text + "</a>";

	return result;
}


var _DoImages = function(text) {
//
// Turn Markdown image shortcuts into <img> tags.
//

	//
	// First, handle reference-style labeled images: ![alt text][id]
	//

	/*
		text = text.replace(/
		(						// wrap whole match in $1
			!\[
			(.*?)				// alt text = $2
			\]

			[ ]?				// one optional space
			(?:\n[ ]*)?			// one optional newline followed by spaces

			\[
			(.*?)				// id = $3
			\]
		)()()()()				// pad rest of backreferences
		/g,writeImageTag);
	*/
	text = text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeImageTag);

	//
	// Next, handle inline images:  ![alt text](url "optional title")
	// Don't forget: encode * and _

	/*
		text = text.replace(/
		(						// wrap whole match in $1
			!\[
			(.*?)				// alt text = $2
			\]
			\s?					// One optional whitespace character
			\(					// literal paren
			[ \t]*
			()					// no id, so leave $3 empty
			<?(\S+?)>?			// src url = $4
			[ \t]*
			(					// $5
				(['"])			// quote char = $6
				(.*?)			// title = $7
				\6				// matching quote
				[ \t]*
			)?					// title is optional
		\)
		)
		/g,writeImageTag);
	*/
	text = text.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeImageTag);

	return text;
}

var writeImageTag = function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
	var whole_match = m1;
	var alt_text   = m2;
	var link_id	 = m3.toLowerCase();
	var url		= m4;
	var title	= m7;

	if (!title) title = "";

	if (url == "") {
		if (link_id == "") {
			// lower-case and turn embedded newlines into spaces
			link_id = alt_text.toLowerCase().replace(/ ?\n/g," ");
		}
		url = "#"+link_id;

		if (g_urls[link_id] != undefined) {
			url = g_urls[link_id];
			if (g_titles[link_id] != undefined) {
				title = g_titles[link_id];
			}
		}
		else {
			return whole_match;
		}
	}

	alt_text = alt_text.replace(/"/g,"&quot;");
	url = escapeCharacters(url,"*_");
	var result = "<img src=\"" + url + "\" alt=\"" + alt_text + "\"";

	// attacklab: Markdown.pl adds empty title attributes to images.
	// Replicate this bug.

	//if (title != "") {
		title = title.replace(/"/g,"&quot;");
		title = escapeCharacters(title,"*_");
		result +=  " title=\"" + title + "\"";
	//}

	result += " />";

	return result;
}


var _DoHeaders = function(text) {

	// Setext-style headers:
	//	Header 1
	//	========
	//
	//	Header 2
	//	--------
	//
	text = text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,
		function(wholeMatch,m1){return hashBlock('<h1 id="' + headerId(m1) + '">' + _RunSpanGamut(m1) + "</h1>");});

	text = text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,
		function(matchFound,m1){return hashBlock('<h2 id="' + headerId(m1) + '">' + _RunSpanGamut(m1) + "</h2>");});

	// atx-style headers:
	//  # Header 1
	//  ## Header 2
	//  ## Header 2 with closing hashes ##
	//  ...
	//  ###### Header 6
	//

	/*
		text = text.replace(/
			^(\#{1,6})				// $1 = string of #'s
			[ \t]*
			(.+?)					// $2 = Header text
			[ \t]*
			\#*						// optional closing #'s (not counted)
			\n+
		/gm, function() {...});
	*/

	text = text.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,
		function(wholeMatch,m1,m2) {
			var h_level = m1.length;
			return hashBlock("<h" + h_level + ' id="' + headerId(m2) + '">' + _RunSpanGamut(m2) + "</h" + h_level + ">");
		});

	function headerId(m) {
		return m.replace(/[^\w]/g, '').toLowerCase();
	}
	return text;
}

// This declaration keeps Dojo compressor from outputting garbage:
var _ProcessListItems;

var _DoLists = function(text) {
//
// Form HTML ordered (numbered) and unordered (bulleted) lists.
//

	// attacklab: add sentinel to hack around khtml/safari bug:
	// http://bugs.webkit.org/show_bug.cgi?id=11231
	text += "~0";

	// Re-usable pattern to match any entirel ul or ol list:

	/*
		var whole_list = /
		(									// $1 = whole list
			(								// $2
				[ ]{0,3}					// attacklab: g_tab_width - 1
				([*+-]|\d+[.])				// $3 = first list item marker
				[ \t]+
			)
			[^\r]+?
			(								// $4
				~0							// sentinel for workaround; should be $
			|
				\n{2,}
				(?=\S)
				(?!							// Negative lookahead for another list item marker
					[ \t]*
					(?:[*+-]|\d+[.])[ \t]+
				)
			)
		)/g
	*/
	var whole_list = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;

	if (g_list_level) {
		text = text.replace(whole_list,function(wholeMatch,m1,m2) {
			var list = m1;
			var list_type = (m2.search(/[*+-]/g)>-1) ? "ul" : "ol";

			// Turn double returns into triple returns, so that we can make a
			// paragraph for the last item in a list, if necessary:
			list = list.replace(/\n{2,}/g,"\n\n\n");;
			var result = _ProcessListItems(list);

			// Trim any trailing whitespace, to put the closing `</$list_type>`
			// up on the preceding line, to get it past the current stupid
			// HTML block parser. This is a hack to work around the terrible
			// hack that is the HTML block parser.
			result = result.replace(/\s+$/,"");
			result = "<"+list_type+">" + result + "</"+list_type+">\n";
			return result;
		});
	} else {
		whole_list = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;
		text = text.replace(whole_list,function(wholeMatch,m1,m2,m3) {
			var runup = m1;
			var list = m2;

			var list_type = (m3.search(/[*+-]/g)>-1) ? "ul" : "ol";
			// Turn double returns into triple returns, so that we can make a
			// paragraph for the last item in a list, if necessary:
			var list = list.replace(/\n{2,}/g,"\n\n\n");;
			var result = _ProcessListItems(list);
			result = runup + "<"+list_type+">\n" + result + "</"+list_type+">\n";
			return result;
		});
	}

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
}

_ProcessListItems = function(list_str) {
//
//  Process the contents of a single ordered or unordered list, splitting it
//  into individual list items.
//
	// The $g_list_level global keeps track of when we're inside a list.
	// Each time we enter a list, we increment it; when we leave a list,
	// we decrement. If it's zero, we're not in a list anymore.
	//
	// We do this because when we're not inside a list, we want to treat
	// something like this:
	//
	//    I recommend upgrading to version
	//    8. Oops, now this line is treated
	//    as a sub-list.
	//
	// As a single paragraph, despite the fact that the second line starts
	// with a digit-period-space sequence.
	//
	// Whereas when we're inside a list (or sub-list), that line will be
	// treated as the start of a sub-list. What a kludge, huh? This is
	// an aspect of Markdown's syntax that's hard to parse perfectly
	// without resorting to mind-reading. Perhaps the solution is to
	// change the syntax rules such that sub-lists must start with a
	// starting cardinal number; e.g. "1." or "a.".

	g_list_level++;

	// trim trailing blank lines:
	list_str = list_str.replace(/\n{2,}$/,"\n");

	// attacklab: add sentinel to emulate \z
	list_str += "~0";

	/*
		list_str = list_str.replace(/
			(\n)?							// leading line = $1
			(^[ \t]*)						// leading whitespace = $2
			([*+-]|\d+[.]) [ \t]+			// list marker = $3
			([^\r]+?						// list item text   = $4
			(\n{1,2}))
			(?= \n* (~0 | \2 ([*+-]|\d+[.]) [ \t]+))
		/gm, function(){...});
	*/
	list_str = list_str.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
		function(wholeMatch,m1,m2,m3,m4){
			var item = m4;
			var leading_line = m1;
			var leading_space = m2;

			if (leading_line || (item.search(/\n{2,}/)>-1)) {
				item = _RunBlockGamut(_Outdent(item));
			}
			else {
				// Recursion for sub-lists:
				item = _DoLists(_Outdent(item));
				item = item.replace(/\n$/,""); // chomp(item)
				item = _RunSpanGamut(item);
			}

			return  "<li>" + item + "</li>\n";
		}
	);

	// attacklab: strip sentinel
	list_str = list_str.replace(/~0/g,"");

	g_list_level--;
	return list_str;
}


var _DoCodeBlocks = function(text) {
//
//  Process Markdown `<pre><code>` blocks.
//

	/*
		text = text.replace(text,
			/(?:\n\n|^)
			(								// $1 = the code block -- one or more lines, starting with a space/tab
				(?:
					(?:[ ]{4}|\t)			// Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
					.*\n+
				)+
			)
			(\n*[ ]{0,3}[^ \t\n]|(?=~0))	// attacklab: g_tab_width
		/g,function(){...});
	*/

	// attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
	text += "~0";

	text = text.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,
		function(wholeMatch,m1,m2) {
			var codeblock = m1;
			var nextChar = m2;

			codeblock = _EncodeCode( _Outdent(codeblock));
			codeblock = _Detab(codeblock);
			codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
			codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace

			codeblock = "<pre><code>" + codeblock + "\n</code></pre>";

			return hashBlock(codeblock) + nextChar;
		}
	);

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
};

var _DoGithubCodeBlocks = function(text) {
//
//  Process Github-style code blocks
//  Example:
//  ```ruby
//  def hello_world(x)
//    puts "Hello, #{x}"
//  end
//  ```
//


	// attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
	text += "~0";

	text = text.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g,
		function(wholeMatch,m1,m2) {
			var language = m1;
			var codeblock = m2;

			codeblock = _EncodeCode(codeblock);
			codeblock = _Detab(codeblock);
			codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
			codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace

			codeblock = "<pre><code" + (language ? " class=\"" + language + '"' : "") + ">" + codeblock + "\n</code></pre>";

			return hashBlock(codeblock);
		}
	);

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
}

var hashBlock = function(text) {
	text = text.replace(/(^\n+|\n+$)/g,"");
	return "\n\n~K" + (g_html_blocks.push(text)-1) + "K\n\n";
}

var _DoCodeSpans = function(text) {
//
//   *  Backtick quotes are used for <code></code> spans.
//
//   *  You can use multiple backticks as the delimiters if you want to
//	 include literal backticks in the code span. So, this input:
//
//		 Just type ``foo `bar` baz`` at the prompt.
//
//	   Will translate to:
//
//		 <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
//
//	There's no arbitrary limit to the number of backticks you
//	can use as delimters. If you need three consecutive backticks
//	in your code, use four for delimiters, etc.
//
//  *  You can use spaces to get literal backticks at the edges:
//
//		 ... type `` `bar` `` ...
//
//	   Turns to:
//
//		 ... type <code>`bar`</code> ...
//

	/*
		text = text.replace(/
			(^|[^\\])					// Character before opening ` can't be a backslash
			(`+)						// $2 = Opening run of `
			(							// $3 = The code block
				[^\r]*?
				[^`]					// attacklab: work around lack of lookbehind
			)
			\2							// Matching closer
			(?!`)
		/gm, function(){...});
	*/

	text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
		function(wholeMatch,m1,m2,m3,m4) {
			var c = m3;
			c = c.replace(/^([ \t]*)/g,"");	// leading whitespace
			c = c.replace(/[ \t]*$/g,"");	// trailing whitespace
			c = _EncodeCode(c);
			return m1+"<code>"+c+"</code>";
		});

	return text;
}

var _EncodeCode = function(text) {
//
// Encode/escape certain characters inside Markdown code runs.
// The point is that in code, these characters are literals,
// and lose their special Markdown meanings.
//
	// Encode all ampersands; HTML entities are not
	// entities within a Markdown code span.
	text = text.replace(/&/g,"&amp;");

	// Do the angle bracket song and dance:
	text = text.replace(/</g,"&lt;");
	text = text.replace(/>/g,"&gt;");

	// Now, escape characters that are magic in Markdown:
	text = escapeCharacters(text,"\*_{}[]\\",false);

// jj the line above breaks this:
//---

//* Item

//   1. Subitem

//            special char: *
//---

	return text;
}


var _DoItalicsAndBold = function(text) {

	// <strong> must go first:
	text = text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,
		"<strong>$2</strong>");

	text = text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,
		"<em>$2</em>");

	return text;
}


var _DoBlockQuotes = function(text) {

	/*
		text = text.replace(/
		(								// Wrap whole match in $1
			(
				^[ \t]*>[ \t]?			// '>' at the start of a line
				.+\n					// rest of the first line
				(.+\n)*					// subsequent consecutive lines
				\n*						// blanks
			)+
		)
		/gm, function(){...});
	*/

	text = text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,
		function(wholeMatch,m1) {
			var bq = m1;

			// attacklab: hack around Konqueror 3.5.4 bug:
			// "----------bug".replace(/^-/g,"") == "bug"

			bq = bq.replace(/^[ \t]*>[ \t]?/gm,"~0");	// trim one level of quoting

			// attacklab: clean up hack
			bq = bq.replace(/~0/g,"");

			bq = bq.replace(/^[ \t]+$/gm,"");		// trim whitespace-only lines
			bq = _RunBlockGamut(bq);				// recurse

			bq = bq.replace(/(^|\n)/g,"$1  ");
			// These leading spaces screw with <pre> content, so we need to fix that:
			bq = bq.replace(
					/(\s*<pre>[^\r]+?<\/pre>)/gm,
				function(wholeMatch,m1) {
					var pre = m1;
					// attacklab: hack around Konqueror 3.5.4 bug:
					pre = pre.replace(/^  /mg,"~0");
					pre = pre.replace(/~0/g,"");
					return pre;
				});

			return hashBlock("<blockquote>\n" + bq + "\n</blockquote>");
		});
	return text;
}


var _FormParagraphs = function(text) {
//
//  Params:
//    $text - string to process with html <p> tags
//

	// Strip leading and trailing lines:
	text = text.replace(/^\n+/g,"");
	text = text.replace(/\n+$/g,"");

	var grafs = text.split(/\n{2,}/g);
	var grafsOut = [];

	//
	// Wrap <p> tags.
	//
	var end = grafs.length;
	for (var i=0; i<end; i++) {
		var str = grafs[i];

		// if this is an HTML marker, copy it
		if (str.search(/~K(\d+)K/g) >= 0) {
			grafsOut.push(str);
		}
		else if (str.search(/\S/) >= 0) {
			str = _RunSpanGamut(str);
			str = str.replace(/^([ \t]*)/g,"<p>");
			str += "</p>"
			grafsOut.push(str);
		}

	}

	//
	// Unhashify HTML blocks
	//
	end = grafsOut.length;
	for (var i=0; i<end; i++) {
		// if this is a marker for an html block...
		while (grafsOut[i].search(/~K(\d+)K/) >= 0) {
			var blockText = g_html_blocks[RegExp.$1];
			blockText = blockText.replace(/\$/g,"$$$$"); // Escape any dollar signs
			grafsOut[i] = grafsOut[i].replace(/~K\d+K/,blockText);
		}
	}

	return grafsOut.join("\n\n");
}


var _EncodeAmpsAndAngles = function(text) {
// Smart processing for ampersands and angle brackets that need to be encoded.

	// Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
	//   http://bumppo.net/projects/amputator/
	text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");

	// Encode naked <'s
	text = text.replace(/<(?![a-z\/?\$!])/gi,"&lt;");

	return text;
}


var _EncodeBackslashEscapes = function(text) {
//
//   Parameter:  String.
//   Returns:	The string, with after processing the following backslash
//			   escape sequences.
//

	// attacklab: The polite way to do this is with the new
	// escapeCharacters() function:
	//
	// 	text = escapeCharacters(text,"\\",true);
	// 	text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
	//
	// ...but we're sidestepping its use of the (slow) RegExp constructor
	// as an optimization for Firefox.  This function gets called a LOT.

	text = text.replace(/\\(\\)/g,escapeCharacters_callback);
	text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g,escapeCharacters_callback);
	return text;
}


var _DoAutoLinks = function(text) {

	text = text.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,"<a href=\"$1\">$1</a>");

	// Email addresses: <address@domain.foo>

	/*
		text = text.replace(/
			<
			(?:mailto:)?
			(
				[-.\w]+
				\@
				[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+
			)
			>
		/gi, _DoAutoLinks_callback());
	*/
	text = text.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,
		function(wholeMatch,m1) {
			return _EncodeEmailAddress( _UnescapeSpecialChars(m1) );
		}
	);

	return text;
}


var _EncodeEmailAddress = function(addr) {
//
//  Input: an email address, e.g. "foo@example.com"
//
//  Output: the email address as a mailto link, with each character
//	of the address encoded as either a decimal or hex entity, in
//	the hopes of foiling most address harvesting spam bots. E.g.:
//
//	<a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;
//	   x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;
//	   &#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
//
//  Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
//  mailing list: <http://tinyurl.com/yu7ue>
//

	var encode = [
		function(ch){return "&#"+ch.charCodeAt(0)+";";},
		function(ch){return "&#x"+ch.charCodeAt(0).toString(16)+";";},
		function(ch){return ch;}
	];

	addr = "mailto:" + addr;

	addr = addr.replace(/./g, function(ch) {
		if (ch == "@") {
		   	// this *must* be encoded. I insist.
			ch = encode[Math.floor(Math.random()*2)](ch);
		} else if (ch !=":") {
			// leave ':' alone (to spot mailto: later)
			var r = Math.random();
			// roughly 10% raw, 45% hex, 45% dec
			ch =  (
					r > .9  ?	encode[2](ch)   :
					r > .45 ?	encode[1](ch)   :
								encode[0](ch)
				);
		}
		return ch;
	});

	addr = "<a href=\"" + addr + "\">" + addr + "</a>";
	addr = addr.replace(/">.+:/g,"\">"); // strip the mailto: from the visible part

	return addr;
}


var _UnescapeSpecialChars = function(text) {
//
// Swap back in all the special characters we've hidden.
//
	text = text.replace(/~E(\d+)E/g,
		function(wholeMatch,m1) {
			var charCodeToReplace = parseInt(m1);
			return String.fromCharCode(charCodeToReplace);
		}
	);
	return text;
}


var _Outdent = function(text) {
//
// Remove one level of line-leading tabs or spaces
//

	// attacklab: hack around Konqueror 3.5.4 bug:
	// "----------bug".replace(/^-/g,"") == "bug"

	text = text.replace(/^(\t|[ ]{1,4})/gm,"~0"); // attacklab: g_tab_width

	// attacklab: clean up hack
	text = text.replace(/~0/g,"")

	return text;
}

var _Detab = function(text) {
// attacklab: Detab's completely rewritten for speed.
// In perl we could fix it by anchoring the regexp with \G.
// In javascript we're less fortunate.

	// expand first n-1 tabs
	text = text.replace(/\t(?=\t)/g,"    "); // attacklab: g_tab_width

	// replace the nth with two sentinels
	text = text.replace(/\t/g,"~A~B");

	// use the sentinel to anchor our regex so it doesn't explode
	text = text.replace(/~B(.+?)~A/g,
		function(wholeMatch,m1,m2) {
			var leadingText = m1;
			var numSpaces = 4 - leadingText.length % 4;  // attacklab: g_tab_width

			// there *must* be a better way to do this:
			for (var i=0; i<numSpaces; i++) leadingText+=" ";

			return leadingText;
		}
	);

	// clean up sentinels
	text = text.replace(/~A/g,"    ");  // attacklab: g_tab_width
	text = text.replace(/~B/g,"");

	return text;
}


//
//  attacklab: Utility functions
//


var escapeCharacters = function(text, charsToEscape, afterBackslash) {
	// First we have to escape the escape characters so that
	// we can build a character class out of them
	var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g,"\\$1") + "])";

	if (afterBackslash) {
		regexString = "\\\\" + regexString;
	}

	var regex = new RegExp(regexString,"g");
	text = text.replace(regex,escapeCharacters_callback);

	return text;
}


var escapeCharacters_callback = function(wholeMatch,m1) {
	var charCodeToEscape = m1.charCodeAt(0);
	return "~E"+charCodeToEscape+"E";
}

} // end of Showdown.converter


// export
if (typeof module !== 'undefined') module.exports = Showdown;

// stolen from AMD branch of underscore
// AMD define happens at the end for compatibility with AMD loaders
// that don't enforce next-turn semantics on modules.
if (typeof define === 'function' && define.amd) {
    define('showdown', function() {
        return Showdown;
    });
}
/*global module:true*/
/*
 * Basic table support with re-entrant parsing, where cell content
 * can also specify markdown.
 *
 * Tables
 * ======
 *
 * | Col 1   | Col 2                                              |
 * |======== |====================================================|
 * |**bold** | ![Valid XHTML] (http://w3.org/Icons/valid-xhtml10) |
 * | Plain   | Value                                              |
 *
 */

(function(){
  var table = function(converter) {
    var tables = {}, style = 'text-align:left;', filter; 
    tables.th = function(header){
      if (header.trim() === "") { return "";}
      var id = header.trim().replace(/ /g, '_').toLowerCase();
      return '<th id="' + id + '" style="'+style+'">' + header + '</th>';
    };
    tables.td = function(cell) {
      return '<td style="'+style+'">' + converter.makeHtml(cell) + '</td>';
    };
    tables.ths = function(){
      var out = "", i = 0, hs = [].slice.apply(arguments);
      for (i;i<hs.length;i+=1) {
        out += tables.th(hs[i]) + '\n';
      }
      return out;
    };
    tables.tds = function(){
      var out = "", i = 0, ds = [].slice.apply(arguments);
      for (i;i<ds.length;i+=1) {
        out += tables.td(ds[i]) + '\n';
      }
      return out;
    };
    tables.thead = function() {
      var out, i = 0, hs = [].slice.apply(arguments);
      out = "<thead>\n";
      out += "<tr>\n";
      out += tables.ths.apply(this, hs);
      out += "</tr>\n";
      out += "</thead>\n";
      return out;
    };
    tables.tr = function() {
      var out, i = 0, cs = [].slice.apply(arguments);
      out = "<tr>\n";
      out += tables.tds.apply(this, cs);
      out += "</tr>\n";
      return out;
    };
    filter = function(text) { 
      var i=0, lines = text.split('\n'), tbl = [], line, hs, rows, out = [];
      for (i; i<lines.length;i+=1) {
        line = lines[i];
        // looks like a table heading
        if (line.trim().match(/^[|]{1}.*[|]{1}$/)) {
          line = line.trim();
          tbl.push('<table>');
          hs = line.substring(1, line.length -1).split('|');
          tbl.push(tables.thead.apply(this, hs));
          line = lines[++i];
          if (!line.trim().match(/^[|]{1}[\-=| ]+[|]{1}$/)) {
            // not a table rolling back
            line = lines[--i];
          }
          else {
            line = lines[++i];
            tbl.push('<tbody>');
            while (line.trim().match(/^[|]{1}.*[|]{1}$/)) {
              line = line.trim();
              tbl.push(tables.tr.apply(this, line.substring(1, line.length -1).split('|')));
              line = lines[++i];
            }
            tbl.push('</tbody>');
            tbl.push('</table>');
            // we are done with this table and we move along
            out.push(tbl.join('\n'));
            continue;
          }
        }
        out.push(line);
      }             
      return out.join('\n');
    };
    return [
    { 
      type: 'lang', 
      filter: filter
    }
    ];
  };

  // Client-side export
  if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.table = table; }
  // Server-side export
  if (typeof module !== 'undefined') {
    module.exports = table;
  }
}());
var hljs=new function(){function l(o){return o.replace(/&/gm,"&amp;").replace(/</gm,"&lt;")}function c(q,p,o){return RegExp(p,"m"+(q.cI?"i":"")+(o?"g":""))}function i(q){for(var o=0;o<q.childNodes.length;o++){var p=q.childNodes[o];if(p.nodeName=="CODE"){return p}if(!(p.nodeType==3&&p.nodeValue.match(/\s+/))){break}}}function g(s,r){var q="";for(var p=0;p<s.childNodes.length;p++){if(s.childNodes[p].nodeType==3){var o=s.childNodes[p].nodeValue;if(r){o=o.replace(/\n/g,"")}q+=o}else{if(s.childNodes[p].nodeName=="BR"){q+="\n"}else{q+=g(s.childNodes[p])}}}if(/MSIE [678]/.test(navigator.userAgent)){q=q.replace(/\r/g,"\n")}return q}function a(r){var p=r.className.split(/\s+/);p=p.concat(r.parentNode.className.split(/\s+/));for(var o=0;o<p.length;o++){var q=p[o].replace(/^language-/,"");if(d[q]||q=="no-highlight"){return q}}}function b(o){var p=[];(function(r,s){for(var q=0;q<r.childNodes.length;q++){if(r.childNodes[q].nodeType==3){s+=r.childNodes[q].nodeValue.length}else{if(r.childNodes[q].nodeName=="BR"){s+=1}else{p.push({event:"start",offset:s,node:r.childNodes[q]});s=arguments.callee(r.childNodes[q],s);p.push({event:"stop",offset:s,node:r.childNodes[q]})}}}return s})(o,0);return p}function k(x,y,w){var q=0;var v="";var s=[];function t(){if(x.length&&y.length){if(x[0].offset!=y[0].offset){return(x[0].offset<y[0].offset)?x:y}else{return y[0].event=="start"?x:y}}else{return x.length?x:y}}function r(B){var C="<"+B.nodeName.toLowerCase();for(var z=0;z<B.attributes.length;z++){var A=B.attributes[z];C+=" "+A.nodeName.toLowerCase();if(A.nodeValue!=undefined){C+='="'+l(A.nodeValue)+'"'}}return C+">"}while(x.length||y.length){var u=t().splice(0,1)[0];v+=l(w.substr(q,u.offset-q));q=u.offset;if(u.event=="start"){v+=r(u.node);s.push(u.node)}else{if(u.event=="stop"){var p=s.length;do{p--;var o=s[p];v+=("</"+o.nodeName.toLowerCase()+">")}while(o!=u.node);s.splice(p,1);while(p<s.length){v+=r(s[p]);p++}}}}v+=w.substr(q);return v}function f(I,C){function y(r,L){for(var K=0;K<L.c.length;K++){if(L.c[K].bR.test(r)){return L.c[K]}}}function v(K,r){if(B[K].e&&B[K].eR.test(r)){return 1}if(B[K].eW){var L=v(K-1,r);return L?L+1:0}return 0}function w(r,K){return K.iR&&K.iR.test(r)}function z(N,M){var L=[];for(var K=0;K<N.c.length;K++){L.push(N.c[K].b)}var r=B.length-1;do{if(B[r].e){L.push(B[r].e)}r--}while(B[r+1].eW);if(N.i){L.push(N.i)}return c(M,"("+L.join("|")+")",true)}function q(L,K){var M=B[B.length-1];if(!M.t){M.t=z(M,G)}M.t.lastIndex=K;var r=M.t.exec(L);if(r){return[L.substr(K,r.index-K),r[0],false]}else{return[L.substr(K),"",true]}}function o(N,r){var K=G.cI?r[0].toLowerCase():r[0];for(var M in N.kG){if(!N.kG.hasOwnProperty(M)){continue}var L=N.kG[M].hasOwnProperty(K);if(L){return[M,L]}}return false}function E(L,N){if(!N.k){return l(L)}var M="";var O=0;N.lR.lastIndex=0;var K=N.lR.exec(L);while(K){M+=l(L.substr(O,K.index-O));var r=o(N,K);if(r){s+=r[1];M+='<span class="'+r[0]+'">'+l(K[0])+"</span>"}else{M+=l(K[0])}O=N.lR.lastIndex;K=N.lR.exec(L)}M+=l(L.substr(O,L.length-O));return M}function J(r,L){if(L.sL&&d[L.sL]){var K=f(L.sL,r);s+=K.keyword_count;return K.value}else{return E(r,L)}}function H(L,r){var K=L.cN?'<span class="'+L.cN+'">':"";if(L.rB){p+=K;L.buffer=""}else{if(L.eB){p+=l(r)+K;L.buffer=""}else{p+=K;L.buffer=r}}B.push(L);A+=L.r}function D(N,K,P){var Q=B[B.length-1];if(P){p+=J(Q.buffer+N,Q);return false}var L=y(K,Q);if(L){p+=J(Q.buffer+N,Q);H(L,K);return L.rB}var r=v(B.length-1,K);if(r){var M=Q.cN?"</span>":"";if(Q.rE){p+=J(Q.buffer+N,Q)+M}else{if(Q.eE){p+=J(Q.buffer+N,Q)+M+l(K)}else{p+=J(Q.buffer+N+K,Q)+M}}while(r>1){M=B[B.length-2].cN?"</span>":"";p+=M;r--;B.length--}var O=B[B.length-1];B.length--;B[B.length-1].buffer="";if(O.starts){H(O.starts,"")}return Q.rE}if(w(K,Q)){throw"Illegal"}}var G=d[I];var B=[G.dM];var A=0;var s=0;var p="";try{var u=0;G.dM.buffer="";do{var x=q(C,u);var t=D(x[0],x[1],x[2]);u+=x[0].length;if(!t){u+=x[1].length}}while(!x[2]);if(B.length>1){throw"Illegal"}return{language:I,r:A,keyword_count:s,value:p}}catch(F){if(F=="Illegal"){return{language:null,r:0,keyword_count:0,value:l(C)}}else{throw F}}}function h(){function o(t,s,u){if(t.compiled){return}if(!u){t.bR=c(s,t.b?t.b:"\\B|\\b");if(!t.e&&!t.eW){t.e="\\B|\\b"}if(t.e){t.eR=c(s,t.e)}}if(t.i){t.iR=c(s,t.i)}if(t.r==undefined){t.r=1}if(t.k){t.lR=c(s,t.l||hljs.IR,true)}for(var r in t.k){if(!t.k.hasOwnProperty(r)){continue}if(t.k[r] instanceof Object){t.kG=t.k}else{t.kG={keyword:t.k}}break}if(!t.c){t.c=[]}t.compiled=true;for(var q=0;q<t.c.length;q++){o(t.c[q],s,false)}if(t.starts){o(t.starts,s,false)}}for(var p in d){if(!d.hasOwnProperty(p)){continue}o(d[p].dM,d[p],true)}}function e(){if(e.called){return}e.called=true;h()}function n(t,y,p){e();var A=g(t,p);var r=a(t);if(r=="no-highlight"){return}if(r){var w=f(r,A)}else{var w={language:"",keyword_count:0,r:0,value:l(A)};var x=w;for(var z in d){if(!d.hasOwnProperty(z)){continue}var u=f(z,A);if(u.keyword_count+u.r>x.keyword_count+x.r){x=u}if(u.keyword_count+u.r>w.keyword_count+w.r){x=w;w=u}}}var s=t.className;if(!s.match(w.language)){s=s?(s+" "+w.language):w.language}var o=b(t);if(o.length){var q=document.createElement("pre");q.innerHTML=w.value;w.value=k(o,b(q),A)}if(y){w.value=w.value.replace(/^((<[^>]+>|\t)+)/gm,function(B,E,D,C){return E.replace(/\t/g,y)})}if(p){w.value=w.value.replace(/\n/g,"<br>")}if(/MSIE [678]/.test(navigator.userAgent)&&t.tagName=="CODE"&&t.parentNode.tagName=="PRE"){var q=t.parentNode;var v=document.createElement("div");v.innerHTML="<pre><code>"+w.value+"</code></pre>";t=v.firstChild.firstChild;v.firstChild.cN=q.cN;q.parentNode.replaceChild(v.firstChild,q)}else{t.innerHTML=w.value}t.className=s;t.dataset={};t.dataset.result={language:w.language,kw:w.keyword_count,re:w.r};if(x&&x.language){t.dataset.second_best={language:x.language,kw:x.keyword_count,re:x.r}}}function j(){if(j.called){return}j.called=true;e();var q=document.getElementsByTagName("pre");for(var o=0;o<q.length;o++){var p=i(q[o]);if(p){n(p,hljs.tabReplace)}}}function m(){var o=arguments;var p=function(){j.apply(null,o)};if(window.addEventListener){window.addEventListener("DOMContentLoaded",p,false);window.addEventListener("load",p,false)}else{if(window.attachEvent){window.attachEvent("onload",p)}else{window.onload=p}}}var d={};this.LANGUAGES=d;this.initHighlightingOnLoad=m;this.highlightBlock=n;this.initHighlighting=j;this.IR="[a-zA-Z][a-zA-Z0-9_]*";this.UIR="[a-zA-Z_][a-zA-Z0-9_]*";this.NR="\\b\\d+(\\.\\d+)?";this.CNR="\\b(0x[A-Za-z0-9]+|\\d+(\\.\\d+)?)";this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";this.BE={b:"\\\\.",r:0};this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[this.BE],r:0};this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[this.BE],r:0};this.CLCM={cN:"comment",b:"//",e:"$"};this.CBLCLM={cN:"comment",b:"/\\*",e:"\\*/"};this.HCM={cN:"comment",b:"#",e:"$"};this.NM={cN:"number",b:this.NR,r:0};this.CNM={cN:"number",b:this.CNR,r:0};this.inherit=function(o,r){var q={};for(var p in o){q[p]=o[p]}if(r){for(var p in r){q[p]=r[p]}}return q}}();hljs.LANGUAGES.bash=function(){var d={"true":1,"false":1};var b={cN:"variable",b:"\\$([a-zA-Z0-9_]+)\\b"};var a={cN:"variable",b:"\\$\\{(([^}])|(\\\\}))+\\}",c:[hljs.CNM]};var c={cN:"string",b:'"',e:'"',i:"\\n",c:[hljs.BE,b,a],r:0};var e={cN:"test_condition",b:"",e:"",c:[c,b,a,hljs.CNM],k:{literal:d},r:0};return{dM:{k:{keyword:{"if":1,then:1,"else":1,fi:1,"for":1,"break":1,"continue":1,"while":1,"in":1,"do":1,done:1,echo:1,exit:1,"return":1,set:1,declare:1},literal:d},c:[{cN:"shebang",b:"(#!\\/bin\\/bash)|(#!\\/bin\\/sh)",r:10},hljs.HCM,{cN:"comment",b:"\\/\\/",e:"$",i:"."},hljs.CNM,c,b,a,hljs.inherit(e,{b:"\\[ ",e:" \\]",r:0}),hljs.inherit(e,{b:"\\[\\[ ",e:" \\]\\]"})]}}}();hljs.LANGUAGES.erlang=function(){var g="[a-z'][a-zA-Z0-9_']*";var l="("+g+":"+g+"|"+g+")";var d={keyword:{after:1,and:1,andalso:10,band:1,begin:1,bnot:1,bor:1,bsl:1,bzr:1,bxor:1,"case":1,"catch":1,cond:1,div:1,end:1,fun:1,let:1,not:1,of:1,orelse:10,query:1,receive:1,rem:1,"try":1,when:1,xor:1},literal:{"false":1,"true":1}};var j={cN:"comment",b:"%",e:"$",r:0};var c={b:"fun\\s+"+g+"/\\d+"};var m={b:l+"\\(",e:"\\)",rB:true,r:0,c:[{cN:"function_name",b:l,r:0},{b:"\\(",e:"\\)",eW:true,rE:true,r:0}]};var f={cN:"tuple",b:"{",e:"}",r:0};var a={cN:"variable",b:"\\b_([A-Z][A-Za-z0-9_]*)?",r:0};var k={cN:"variable",b:"[A-Z][a-zA-Z0-9_]*",r:0};var h={b:"#",e:"}",i:".",r:0,rB:true,c:[{cN:"record_name",b:"#"+hljs.UIR,r:0},{b:"{",eW:true,r:0}]};var i={k:d,b:"(fun|receive|if|try|case)",e:"end"};i.c=[j,c,hljs.inherit(hljs.ASM,{cN:""}),i,m,hljs.QSM,hljs.CNM,f,a,k,h];var b=[j,c,i,m,hljs.QSM,hljs.CNM,f,a,k,h];m.c[1].c=b;f.c=b;h.c[1].c=b;var e={cN:"params",b:"\\(",e:"\\)",eW:true,c:b};return{dM:{k:d,i:"(</|\\*=|\\+=|-=|/=|/\\*|\\*/|\\(\\*|\\*\\))",c:[{cN:"function",b:"^"+g+"\\(",e:";|\\.",rB:true,c:[e,{cN:"title",b:g},{k:d,b:"->",eW:true,c:b}]},j,{cN:"pp",b:"^-",e:"\\.",r:0,eE:true,rB:true,l:"-"+hljs.IR,k:{"-module":1,"-record":1,"-undef":1,"-export":1,"-ifdef":1,"-ifndef":1,"-author":1,"-copyright":1,"-doc":1,"-vsn":1,"-import":1,"-include":1,"-include_lib":1,"-compile":1,"-define":1,"-else":1,"-endif":1,"-file":1,"-behaviour":1,"-behavior":1},c:[e]},hljs.CNM,hljs.QSM,h,a,k,f]}}}();hljs.LANGUAGES.cs={dM:{k:{"abstract":1,as:1,base:1,bool:1,"break":1,"byte":1,"case":1,"catch":1,"char":1,checked:1,"class":1,"const":1,"continue":1,decimal:1,"default":1,delegate:1,"do":1,"do":1,"double":1,"else":1,"enum":1,event:1,explicit:1,extern:1,"false":1,"finally":1,fixed:1,"float":1,"for":1,foreach:1,"goto":1,"if":1,implicit:1,"in":1,"int":1,"interface":1,internal:1,is:1,lock:1,"long":1,namespace:1,"new":1,"null":1,object:1,operator:1,out:1,override:1,params:1,"private":1,"protected":1,"public":1,readonly:1,ref:1,"return":1,sbyte:1,sealed:1,"short":1,sizeof:1,stackalloc:1,"static":1,string:1,struct:1,"switch":1,"this":1,"throw":1,"true":1,"try":1,"typeof":1,uint:1,ulong:1,unchecked:1,unsafe:1,ushort:1,using:1,virtual:1,"volatile":1,"void":1,"while":1,ascending:1,descending:1,from:1,get:1,group:1,into:1,join:1,let:1,orderby:1,partial:1,select:1,set:1,value:1,"var":1,where:1,yield:1},c:[{cN:"comment",b:"///",e:"$",rB:true,c:[{cN:"xmlDocTag",b:"///|<!--|-->"},{cN:"xmlDocTag",b:"</?",e:">"}]},hljs.CLCM,hljs.CBLCLM,{cN:"string",b:'@"',e:'"',c:[{b:'""'}]},hljs.ASM,hljs.QSM,hljs.CNM]}};hljs.LANGUAGES.ruby=function(){var g="[a-zA-Z_][a-zA-Z0-9_]*(\\!|\\?)?";var a="[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";var n={keyword:{and:1,"false":1,then:1,defined:1,module:1,"in":1,"return":1,redo:1,"if":1,BEGIN:1,retry:1,end:1,"for":1,"true":1,self:1,when:1,next:1,until:1,"do":1,begin:1,unless:1,END:1,rescue:1,nil:1,"else":1,"break":1,undef:1,not:1,"super":1,"class":1,"case":1,require:1,yield:1,alias:1,"while":1,ensure:1,elsif:1,or:1,def:1},keymethods:{__id__:1,__send__:1,abort:1,abs:1,"all?":1,allocate:1,ancestors:1,"any?":1,arity:1,assoc:1,at:1,at_exit:1,autoload:1,"autoload?":1,"between?":1,binding:1,binmode:1,"block_given?":1,call:1,callcc:1,caller:1,capitalize:1,"capitalize!":1,casecmp:1,"catch":1,ceil:1,center:1,chomp:1,"chomp!":1,chop:1,"chop!":1,chr:1,"class":1,class_eval:1,"class_variable_defined?":1,class_variables:1,clear:1,clone:1,close:1,close_read:1,close_write:1,"closed?":1,coerce:1,collect:1,"collect!":1,compact:1,"compact!":1,concat:1,"const_defined?":1,const_get:1,const_missing:1,const_set:1,constants:1,count:1,crypt:1,"default":1,default_proc:1,"delete":1,"delete!":1,delete_at:1,delete_if:1,detect:1,display:1,div:1,divmod:1,downcase:1,"downcase!":1,downto:1,dump:1,dup:1,each:1,each_byte:1,each_index:1,each_key:1,each_line:1,each_pair:1,each_value:1,each_with_index:1,"empty?":1,entries:1,eof:1,"eof?":1,"eql?":1,"equal?":1,"eval":1,exec:1,exit:1,"exit!":1,extend:1,fail:1,fcntl:1,fetch:1,fileno:1,fill:1,find:1,find_all:1,first:1,flatten:1,"flatten!":1,floor:1,flush:1,for_fd:1,foreach:1,fork:1,format:1,freeze:1,"frozen?":1,fsync:1,getc:1,gets:1,global_variables:1,grep:1,gsub:1,"gsub!":1,"has_key?":1,"has_value?":1,hash:1,hex:1,id:1,include:1,"include?":1,included_modules:1,index:1,indexes:1,indices:1,induced_from:1,inject:1,insert:1,inspect:1,instance_eval:1,instance_method:1,instance_methods:1,"instance_of?":1,"instance_variable_defined?":1,instance_variable_get:1,instance_variable_set:1,instance_variables:1,"integer?":1,intern:1,invert:1,ioctl:1,"is_a?":1,isatty:1,"iterator?":1,join:1,"key?":1,keys:1,"kind_of?":1,lambda:1,last:1,length:1,lineno:1,ljust:1,load:1,local_variables:1,loop:1,lstrip:1,"lstrip!":1,map:1,"map!":1,match:1,max:1,"member?":1,merge:1,"merge!":1,method:1,"method_defined?":1,method_missing:1,methods:1,min:1,module_eval:1,modulo:1,name:1,nesting:1,"new":1,next:1,"next!":1,"nil?":1,nitems:1,"nonzero?":1,object_id:1,oct:1,open:1,pack:1,partition:1,pid:1,pipe:1,pop:1,popen:1,pos:1,prec:1,prec_f:1,prec_i:1,print:1,printf:1,private_class_method:1,private_instance_methods:1,"private_method_defined?":1,private_methods:1,proc:1,protected_instance_methods:1,"protected_method_defined?":1,protected_methods:1,public_class_method:1,public_instance_methods:1,"public_method_defined?":1,public_methods:1,push:1,putc:1,puts:1,quo:1,raise:1,rand:1,rassoc:1,read:1,read_nonblock:1,readchar:1,readline:1,readlines:1,readpartial:1,rehash:1,reject:1,"reject!":1,remainder:1,reopen:1,replace:1,require:1,"respond_to?":1,reverse:1,"reverse!":1,reverse_each:1,rewind:1,rindex:1,rjust:1,round:1,rstrip:1,"rstrip!":1,scan:1,seek:1,select:1,send:1,set_trace_func:1,shift:1,singleton_method_added:1,singleton_methods:1,size:1,sleep:1,slice:1,"slice!":1,sort:1,"sort!":1,sort_by:1,split:1,sprintf:1,squeeze:1,"squeeze!":1,srand:1,stat:1,step:1,store:1,strip:1,"strip!":1,sub:1,"sub!":1,succ:1,"succ!":1,sum:1,superclass:1,swapcase:1,"swapcase!":1,sync:1,syscall:1,sysopen:1,sysread:1,sysseek:1,system:1,syswrite:1,taint:1,"tainted?":1,tell:1,test:1,"throw":1,times:1,to_a:1,to_ary:1,to_f:1,to_hash:1,to_i:1,to_int:1,to_io:1,to_proc:1,to_s:1,to_str:1,to_sym:1,tr:1,"tr!":1,tr_s:1,"tr_s!":1,trace_var:1,transpose:1,trap:1,truncate:1,"tty?":1,type:1,ungetc:1,uniq:1,"uniq!":1,unpack:1,unshift:1,untaint:1,untrace_var:1,upcase:1,"upcase!":1,update:1,upto:1,"value?":1,values:1,values_at:1,warn:1,write:1,write_nonblock:1,"zero?":1,zip:1}};var h={cN:"yardoctag",b:"@[A-Za-z]+"};var d={cN:"comment",b:"#",e:"$",c:[h]};var c={cN:"comment",b:"^\\=begin",e:"^\\=end",c:[h],r:10};var b={cN:"comment",b:"^__END__",e:"\\n$"};var u={cN:"subst",b:"#\\{",e:"}",l:g,k:n};var p=[hljs.BE,u];var s={cN:"string",b:"'",e:"'",c:p,r:0};var r={cN:"string",b:'"',e:'"',c:p,r:0};var q={cN:"string",b:"%[qw]?\\(",e:"\\)",c:p,r:10};var o={cN:"string",b:"%[qw]?\\[",e:"\\]",c:p,r:10};var m={cN:"string",b:"%[qw]?{",e:"}",c:p,r:10};var l={cN:"string",b:"%[qw]?<",e:">",c:p,r:10};var k={cN:"string",b:"%[qw]?/",e:"/",c:p,r:10};var j={cN:"string",b:"%[qw]?%",e:"%",c:p,r:10};var i={cN:"string",b:"%[qw]?-",e:"-",c:p,r:10};var t={cN:"string",b:"%[qw]?\\|",e:"\\|",c:p,r:10};var e={cN:"function",b:"\\bdef\\s+",e:" |$|;",l:g,k:n,c:[{cN:"title",b:a,l:g,k:n},{cN:"params",b:"\\(",e:"\\)",l:g,k:n},d,c,b]};var f={cN:"identifier",b:g,l:g,k:n,r:0};var v=[d,c,b,s,r,q,o,m,l,k,j,i,t,{cN:"class",b:"\\b(class|module)\\b",e:"$|;",k:{"class":1,module:1},c:[{cN:"title",b:"[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?",r:0},{cN:"inheritance",b:"<\\s*",c:[{cN:"parent",b:"("+hljs.IR+"::)?"+hljs.IR}]},d,c,b]},e,{cN:"constant",b:"(::)?([A-Z]\\w*(::)?)+",r:0},{cN:"symbol",b:":",c:[s,r,q,o,m,l,k,j,i,t,f],r:0},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{cN:"number",b:"\\?\\w"},{cN:"variable",b:"(\\$\\W)|((\\$|\\@\\@?)(\\w+))"},f,{b:"("+hljs.RSR+")\\s*",c:[d,c,b,{cN:"regexp",b:"/",e:"/[a-z]*",i:"\\n",c:[hljs.BE]}],r:0}];u.c=v;e.c[1].c=v;return{dM:{l:g,k:n,c:v}}}();hljs.LANGUAGES.diff={cI:true,dM:{c:[{cN:"chunk",b:"^\\@\\@ +\\-\\d+,\\d+ +\\+\\d+,\\d+ +\\@\\@$",r:10},{cN:"chunk",b:"^\\*\\*\\* +\\d+,\\d+ +\\*\\*\\*\\*$",r:10},{cN:"chunk",b:"^\\-\\-\\- +\\d+,\\d+ +\\-\\-\\-\\-$",r:10},{cN:"header",b:"Index: ",e:"$"},{cN:"header",b:"=====",e:"=====$"},{cN:"header",b:"^\\-\\-\\-",e:"$"},{cN:"header",b:"^\\*{3} ",e:"$"},{cN:"header",b:"^\\+\\+\\+",e:"$"},{cN:"header",b:"\\*{5}",e:"\\*{5}$"},{cN:"addition",b:"^\\+",e:"$"},{cN:"deletion",b:"^\\-",e:"$"},{cN:"change",b:"^\\!",e:"$"}]}};hljs.LANGUAGES.rib={dM:{k:{keyword:{ArchiveRecord:1,AreaLightSource:1,Atmosphere:1,Attribute:1,AttributeBegin:1,AttributeEnd:1,Basis:1,Begin:1,Blobby:1,Bound:1,Clipping:1,ClippingPlane:1,Color:1,ColorSamples:1,ConcatTransform:1,Cone:1,CoordinateSystem:1,CoordSysTransform:1,CropWindow:1,Curves:1,Cylinder:1,DepthOfField:1,Detail:1,DetailRange:1,Disk:1,Displacement:1,Display:1,End:1,ErrorHandler:1,Exposure:1,Exterior:1,Format:1,FrameAspectRatio:1,FrameBegin:1,FrameEnd:1,GeneralPolygon:1,GeometricApproximation:1,Geometry:1,Hider:1,Hyperboloid:1,Identity:1,Illuminate:1,Imager:1,Interior:1,LightSource:1,MakeCubeFaceEnvironment:1,MakeLatLongEnvironment:1,MakeShadow:1,MakeTexture:1,Matte:1,MotionBegin:1,MotionEnd:1,NuPatch:1,ObjectBegin:1,ObjectEnd:1,ObjectInstance:1,Opacity:1,Option:1,Orientation:1,Paraboloid:1,Patch:1,PatchMesh:1,Perspective:1,PixelFilter:1,PixelSamples:1,PixelVariance:1,Points:1,PointsGeneralPolygons:1,PointsPolygons:1,Polygon:1,Procedural:1,Projection:1,Quantize:1,ReadArchive:1,RelativeDetail:1,ReverseOrientation:1,Rotate:1,Scale:1,ScreenWindow:1,ShadingInterpolation:1,ShadingRate:1,Shutter:1,Sides:1,Skew:1,SolidBegin:1,SolidEnd:1,Sphere:1,SubdivisionMesh:1,Surface:1,TextureCoordinates:1,Torus:1,Transform:1,TransformBegin:1,TransformEnd:1,TransformPoints:1,Translate:1,TrimCurve:1,WorldBegin:1,WorldEnd:1}},i:"</",c:[hljs.HCM,hljs.CNM,hljs.ASM,hljs.QSM]}};hljs.LANGUAGES.rsl={dM:{k:{keyword:{"float":1,color:1,point:1,normal:1,vector:1,matrix:1,"while":1,"for":1,"if":1,"do":1,"return":1,"else":1,"break":1,extern:1,"continue":1},built_in:{abs:1,acos:1,ambient:1,area:1,asin:1,atan:1,atmosphere:1,attribute:1,calculatenormal:1,ceil:1,cellnoise:1,clamp:1,comp:1,concat:1,cos:1,degrees:1,depth:1,Deriv:1,diffuse:1,distance:1,Du:1,Dv:1,environment:1,exp:1,faceforward:1,filterstep:1,floor:1,format:1,fresnel:1,incident:1,length:1,lightsource:1,log:1,match:1,max:1,min:1,mod:1,noise:1,normalize:1,ntransform:1,opposite:1,option:1,phong:1,pnoise:1,pow:1,printf:1,ptlined:1,radians:1,random:1,reflect:1,refract:1,renderinfo:1,round:1,setcomp:1,setxcomp:1,setycomp:1,setzcomp:1,shadow:1,sign:1,sin:1,smoothstep:1,specular:1,specularbrdf:1,spline:1,sqrt:1,step:1,tan:1,texture:1,textureinfo:1,trace:1,transform:1,vtransform:1,xcomp:1,ycomp:1,zcomp:1}},i:"</",c:[hljs.CLCM,hljs.CBLCLM,hljs.QSM,hljs.ASM,hljs.CNM,{cN:"preprocessor",b:"#",e:"$"},{cN:"shader",b:"surface |displacement |light |volume |imager ",e:"\\(",k:{surface:1,displacement:1,light:1,volume:1,imager:1}},{cN:"shading",b:"illuminate|illuminance|gather",e:"\\(",k:{illuminate:1,illuminance:1,gather:1}}]}};hljs.LANGUAGES.javascript={dM:{k:{keyword:{"in":1,"if":1,"for":1,"while":1,"finally":1,"var":1,"new":1,"function":1,"do":1,"return":1,"void":1,"else":1,"break":1,"catch":1,"instanceof":1,"with":1,"throw":1,"case":1,"default":1,"try":1,"this":1,"switch":1,"continue":1,"typeof":1,"delete":1},literal:{"true":1,"false":1,"null":1}},c:[hljs.ASM,hljs.QSM,hljs.CLCM,hljs.CBLCLM,hljs.CNM,{b:"("+hljs.RSR+"|case|return|throw)\\s*",k:{"return":1,"throw":1,"case":1},c:[hljs.CLCM,hljs.CBLCLM,{cN:"regexp",b:"/.*?[^\\\\/]/[gim]*"}],r:0},{cN:"function",b:"\\bfunction\\b",e:"{",k:{"function":1},c:[{cN:"title",b:"[A-Za-z$_][0-9A-Za-z$_]*"},{cN:"params",b:"\\(",e:"\\)",c:[hljs.ASM,hljs.QSM,hljs.CLCM,hljs.CBLCLM]}]}]}};hljs.LANGUAGES.lua=function(){var b="\\[=*\\[";var e="\\]=*\\]";var a={b:b,e:e};a.c=[a];var d={cN:"comment",b:"--(?!"+b+")",e:"$"};var c={cN:"comment",b:"--"+b,e:e,c:[a],r:10};return{dM:{l:hljs.UIR,k:{keyword:{and:1,"break":1,"do":1,"else":1,elseif:1,end:1,"false":1,"for":1,"if":1,"in":1,local:1,nil:1,not:1,or:1,repeat:1,"return":1,then:1,"true":1,until:1,"while":1},built_in:{_G:1,_VERSION:1,assert:1,collectgarbage:1,dofile:1,error:1,getfenv:1,getmetatable:1,ipairs:1,load:1,loadfile:1,loadstring:1,module:1,next:1,pairs:1,pcall:1,print:1,rawequal:1,rawget:1,rawset:1,require:1,select:1,setfenv:1,setmetatable:1,tonumber:1,tostring:1,type:1,unpack:1,xpcall:1,coroutine:1,debug:1,io:1,math:1,os:1,"package":1,string:1,table:1}},c:[d,c,{cN:"function",b:"\\bfunction\\b",e:"\\)",k:{"function":1},c:[{cN:"title",b:"([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"},{cN:"params",b:"\\(",eW:true,c:[d,c]},d,c]},hljs.CNM,hljs.ASM,hljs.QSM,{cN:"string",b:b,e:e,c:[a],r:10}]}}}();hljs.LANGUAGES.css=function(){var a={cN:"function",b:hljs.IR+"\\(",e:"\\)",c:[{eW:true,eE:true,c:[hljs.NM,hljs.ASM,hljs.QSM]}]};return{cI:true,dM:{i:"[=/|']",c:[hljs.CBLCLM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@font-face",l:"[a-z-]+",k:{"font-face":1}},{cN:"at_rule",b:"@",e:"[{;]",eE:true,k:{"import":1,page:1,media:1,charset:1},c:[a,hljs.ASM,hljs.QSM,hljs.NM]},{cN:"tag",b:hljs.IR,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[hljs.CBLCLM,{cN:"rule",b:"[^\\s]",rB:true,e:";",eW:true,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:true,i:"[^\\s]",starts:{cN:"value",eW:true,eE:true,c:[a,hljs.NM,hljs.QSM,hljs.ASM,hljs.CBLCLM,{cN:"hexcolor",b:"\\#[0-9A-F]+"},{cN:"important",b:"!important"}]}}]}]}]}}}();hljs.LANGUAGES.xml=function(){var b="[A-Za-z0-9\\._:-]+";var a={eW:true,c:[{cN:"attribute",b:b,r:0},{b:'="',rB:true,e:'"',c:[{cN:"value",b:'"',eW:true}]},{b:"='",rB:true,e:"'",c:[{cN:"value",b:"'",eW:true}]},{b:"=",c:[{cN:"value",b:"[^\\s/>]+"}]}]};return{cI:true,dM:{c:[{cN:"pi",b:"<\\?",e:"\\?>",r:10},{cN:"doctype",b:"<!DOCTYPE",e:">",r:10},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style",e:">",k:{title:{style:1}},c:[a],starts:{cN:"css",e:"</style>",rE:true,sL:"css"}},{cN:"tag",b:"<script",e:">",k:{title:{script:1}},c:[a],starts:{cN:"javascript",e:"<\/script>",rE:true,sL:"javascript"}},{cN:"vbscript",b:"<%",e:"%>",sL:"vbscript"},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:"[^ />]+"},a]}]}}}();hljs.LANGUAGES.lisp=function(){var m="[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#]*";var n="(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?";var c={cN:"literal",b:"\\b(t{1}|nil)\\b"};var o={cN:"number",b:n};var p={cN:"number",b:"#b[0-1]+(/[0-1]+)?"};var q={cN:"number",b:"#o[0-7]+(/[0-7]+)?"};var a={cN:"number",b:"#x[0-9a-f]+(/[0-9a-f]+)?"};var b={cN:"number",b:"#c\\("+n+" +"+n,e:"\\)"};var e={cN:"string",b:'"',e:'"',c:[hljs.BE],r:0};var l={cN:"comment",b:";",e:"$"};var d={cN:"variable",b:"\\*",e:"\\*"};var k={cN:"keyword",b:"[:&]"+m};var i={b:"\\(",e:"\\)"};i.c=[i,c,o,p,q,a,b,e];var g={cN:"quoted",b:"['`]\\(",e:"\\)",c:[o,p,q,a,b,e,d,k,i]};var f={cN:"quoted",b:"\\(quote ",e:"\\)",k:{title:{quote:1}},c:[o,p,q,a,b,e,d,k,i]};var j={cN:"list",b:"\\(",e:"\\)"};var h={cN:"body",eW:true,eE:true};j.c=[{cN:"title",b:m},h];h.c=[g,f,j,c,o,p,q,a,b,e,l,d,k];return{cI:true,dM:{i:"[^\\s]",c:[c,o,p,q,a,b,e,l,g,f,j]}}}();hljs.LANGUAGES.profile={dM:{c:[hljs.CNM,{cN:"builtin",b:"{",e:"}$",eB:true,eE:true,c:[hljs.ASM,hljs.QSM],r:0},{cN:"filename",b:"(/w|[a-zA-Z_][\da-zA-Z_]+\\.[\da-zA-Z_]{1,3})",e:":",eE:true},{cN:"header",b:"(ncalls|tottime|cumtime)",e:"$",k:{ncalls:1,tottime:10,cumtime:10,filename:1},r:10},{cN:"summary",b:"function calls",e:"$",c:[hljs.CNM],r:10},hljs.ASM,hljs.QSM,{cN:"function",b:"\\(",e:"\\)$",c:[{cN:"title",b:hljs.UIR,r:0}],r:0}]}};hljs.LANGUAGES.java={dM:{k:{"false":1,"synchronized":1,"int":1,"abstract":1,"float":1,"private":1,"char":1,"interface":1,"boolean":1,"static":1,"null":1,"if":1,"const":1,"for":1,"true":1,"while":1,"long":1,"throw":1,strictfp:1,"finally":1,"protected":1,"extends":1,"import":1,"native":1,"final":1,"implements":1,"return":1,"void":1,"enum":1,"else":1,"break":1,"transient":1,"new":1,"catch":1,"instanceof":1,"byte":1,"super":1,"class":1,"volatile":1,"case":1,assert:1,"short":1,"package":1,"default":1,"double":1,"public":1,"try":1,"this":1,"switch":1,"continue":1,"throws":1},c:[{cN:"javadoc",b:"/\\*\\*",e:"\\*/",c:[{cN:"javadoctag",b:"@[A-Za-z]+"}],r:10},hljs.CLCM,hljs.CBLCLM,hljs.ASM,hljs.QSM,{cN:"class",b:"(class |interface )",e:"{",k:{"class":1,"interface":1},i:":",c:[{b:"(implements|extends)",k:{"extends":1,"implements":1},r:10},{cN:"title",b:hljs.UIR}]},hljs.CNM,{cN:"annotation",b:"@[A-Za-z]+"}]}};hljs.LANGUAGES.php={cI:true,dM:{k:{and:1,include_once:1,list:1,"abstract":1,global:1,"private":1,echo:1,"interface":1,as:1,"static":1,endswitch:1,array:1,"null":1,"if":1,endwhile:1,or:1,"const":1,"for":1,endforeach:1,self:1,"var":1,"while":1,isset:1,"public":1,"protected":1,exit:1,foreach:1,"throw":1,elseif:1,"extends":1,include:1,__FILE__:1,empty:1,require_once:1,"function":1,"do":1,xor:1,"return":1,"implements":1,parent:1,clone:1,use:1,__CLASS__:1,__LINE__:1,"else":1,"break":1,print:1,"eval":1,"new":1,"catch":1,__METHOD__:1,"class":1,"case":1,exception:1,php_user_filter:1,"default":1,die:1,require:1,__FUNCTION__:1,enddeclare:1,"final":1,"try":1,"this":1,"switch":1,"continue":1,endfor:1,endif:1,declare:1,unset:1,"true":1,"false":1,namespace:1},c:[hljs.CLCM,hljs.HCM,{cN:"comment",b:"/\\*",e:"\\*/",c:[{cN:"phpdoc",b:"\\s@[A-Za-z]+",r:10}]},hljs.CNM,hljs.inherit(hljs.ASM,{i:null}),hljs.inherit(hljs.QSM,{i:null}),{cN:"variable",b:"\\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*"},{cN:"preprocessor",b:"<\\?php",r:10},{cN:"preprocessor",b:"\\?>"}]}};hljs.LANGUAGES.haskell=function(){var a={cN:"label",b:"\\b[A-Z][\\w\\']*",r:0};var b={cN:"container",b:"\\(",e:"\\)",c:[{cN:"label",b:"\\b[A-Z][\\w\\(\\)\\.\\']*"},{cN:"title",b:"[_a-z][\\w\\']*"}]};return{dM:{k:{keyword:{let:1,"in":1,"if":1,then:1,"else":1,"case":1,of:1,where:1,"do":1,module:1,"import":1,hiding:1,qualified:1,type:1,data:1,newtype:1,deriving:1,"class":1,instance:1,"null":1,not:1,as:1},built_in:{Bool:1,True:1,False:1,Int:1,Char:1,Maybe:1,Nothing:1,String:1}},c:[{cN:"comment",b:"--",e:"$"},{cN:"comment",b:"{-",e:"-}"},hljs.ASM,hljs.QSM,{cN:"import",b:"\\bimport",e:"$",k:{"import":1,qualified:1,as:1,hiding:1},c:[b]},{cN:"module",b:"\\bmodule",e:"where",k:{module:1,where:1},c:[b]},{cN:"class",b:"\\b(class|instance|data|(new)?type)",e:"(where|$)",k:{"class":1,where:1,instance:1,data:1,type:1,newtype:1,deriving:1},c:[a]},hljs.CNM,{cN:"shebang",b:"#!\\/usr\\/bin\\/env runhaskell",e:"$"},a,{cN:"title",b:"^[_a-z][\\w\\']*"}]}}}();hljs.LANGUAGES["1c"]=function(){var b="[a-zA-Zа-яА-Я][a-zA-Z0-9_а-яА-Я]*";var e={"возврат":1,"дата":1,"для":1,"если":1,"и":1,"или":1,"иначе":1,"иначеесли":1,"исключение":1,"конецесли":1,"конецпопытки":1,"конецпроцедуры":1,"конецфункции":1,"конеццикла":1,"константа":1,"не":1,"перейти":1,"перем":1,"перечисление":1,"по":1,"пока":1,"попытка":1,"прервать":1,"продолжить":1,"процедура":1,"строка":1,"тогда":1,"фс":1,"функция":1,"цикл":1,"число":1,"экспорт":1};var d={ansitooem:1,oemtoansi:1,"ввестивидсубконто":1,"ввестидату":1,"ввестизначение":1,"ввестиперечисление":1,"ввестипериод":1,"ввестиплансчетов":1,"ввестистроку":1,"ввестичисло":1,"вопрос":1,"восстановитьзначение":1,"врег":1,"выбранныйплансчетов":1,"вызватьисключение":1,"датагод":1,"датамесяц":1,"датачисло":1,"добавитьмесяц":1,"завершитьработусистемы":1,"заголовоксистемы":1,"записьжурналарегистрации":1,"запуститьприложение":1,"зафиксироватьтранзакцию":1,"значениевстроку":1,"значениевстрокувнутр":1,"значениевфайл":1,"значениеизстроки":1,"значениеизстрокивнутр":1,"значениеизфайла":1,"имякомпьютера":1,"имяпользователя":1,"каталогвременныхфайлов":1,"каталогиб":1,"каталогпользователя":1,"каталогпрограммы":1,"кодсимв":1,"командасистемы":1,"конгода":1,"конецпериодаби":1,"конецрассчитанногопериодаби":1,"конецстандартногоинтервала":1,"конквартала":1,"конмесяца":1,"коннедели":1,"лев":1,"лог":1,"лог10":1,"макс":1,"максимальноеколичествосубконто":1,"мин":1,"монопольныйрежим":1,"названиеинтерфейса":1,"названиенабораправ":1,"назначитьвид":1,"назначитьсчет":1,"найти":1,"найтипомеченныенаудаление":1,"найтиссылки":1,"началопериодаби":1,"началостандартногоинтервала":1,"начатьтранзакцию":1,"начгода":1,"начквартала":1,"начмесяца":1,"начнедели":1,"номерднягода":1,"номерднянедели":1,"номернеделигода":1,"нрег":1,"обработкаожидания":1,"окр":1,"описаниеошибки":1,"основнойжурналрасчетов":1,"основнойплансчетов":1,"основнойязык":1,"открытьформу":1,"открытьформумодально":1,"отменитьтранзакцию":1,"очиститьокносообщений":1,"периодстр":1,"полноеимяпользователя":1,"получитьвремята":1,"получитьдатута":1,"получитьдокументта":1,"получитьзначенияотбора":1,"получитьпозициюта":1,"получитьпустоезначение":1,"получитьта":1,"прав":1,"праводоступа":1,"предупреждение":1,"префиксавтонумерации":1,"пустаястрока":1,"пустоезначение":1,"рабочаядаттьпустоезначение":1,"получитьта":1,"прав":1,"праводоступа":1,"предупреждение":1,"префиксавтонумерации":1,"пустаястрока":1,"пустоезначение":1,"рабочаядата":1,"разделительстраниц":1,"разделительстрок":1,"разм":1,"разобратьпозициюдокумента":1,"рассчитатьрегистрына":1,"рассчитатьрегистрыпо":1,"сигнал":1,"симв":1,"символтабуляции":1,"создатьобъект":1,"сокрл":1,"сокрлп":1,"сокрп":1," сообщить":1,"состояние":1,"сохранитьзначение":1,"сред":1,"статусвозврата":1,"стрдлина":1,"стрзаменить":1,"стрколичествострок":1,"стрполучитьстроку":1," стрчисловхождений":1,"сформироватьпозициюдокумента":1,"счетпокоду":1,"текущаядата":1,"текущеевремя":1,"типзначения":1,"типзначениястр":1,"удалитьобъекты":1,"установитьтана":1,"установитьтапо":1,"фиксшаблон":1,"формат":1,"цел":1,"шаблон":1};var a={cN:"dquote",b:'""'};var c={cN:"string",b:'"',e:'"|$',c:[a],r:0};var f={cN:"string",b:"\\|",e:'"|$',c:[a]};return{cI:true,dM:{l:b,k:{keyword:e,built_in:d},c:[hljs.CLCM,hljs.NM,c,f,{cN:"function",b:"(процедура|функция)",e:"$",l:b,k:{"процедура":1,"экспорт":1,"функция":1},c:[{cN:"title",b:b},{cN:"tail",eW:true,c:[{cN:"params",b:"\\(",e:"\\)",l:b,k:{"знач":1},c:[c,f]},{cN:"export",b:"экспорт",eW:true,l:b,k:{"экспорт":1},c:[hljs.CLCM]}]},hljs.CLCM]},{cN:"preprocessor",b:"#",e:"$"},{cN:"date",b:"'\\d{2}\\.\\d{2}\\.(\\d{2}|\\d{4})'"}]}}}();hljs.LANGUAGES.python=function(){var c={cN:"string",b:"u?r?'''",e:"'''",r:10};var b={cN:"string",b:'u?r?"""',e:'"""',r:10};var a={cN:"string",b:"(u|r|ur)'",e:"'",c:[hljs.BE],r:10};var f={cN:"string",b:'(u|r|ur)"',e:'"',c:[hljs.BE],r:10};var d={cN:"title",b:hljs.UIR};var e={cN:"params",b:"\\(",e:"\\)",c:[c,b,a,f,hljs.ASM,hljs.QSM]};return{dM:{k:{keyword:{and:1,elif:1,is:1,global:1,as:1,"in":1,"if":1,from:1,raise:1,"for":1,except:1,"finally":1,print:1,"import":1,pass:1,"return":1,exec:1,"else":1,"break":1,not:1,"with":1,"class":1,assert:1,yield:1,"try":1,"while":1,"continue":1,del:1,or:1,def:1,lambda:1,nonlocal:10},built_in:{None:1,True:1,False:1,Ellipsis:1,NotImplemented:1}},i:"(</|->|\\?)",c:[hljs.HCM,c,b,a,f,hljs.ASM,hljs.QSM,{cN:"function",b:"\\bdef ",e:":",i:"$",k:{def:1},c:[d,e],r:10},{cN:"class",b:"\\bclass ",e:":",i:"[${]",k:{"class":1},c:[d,e],r:10},hljs.CNM,{cN:"decorator",b:"@",e:"$"}]}}}();hljs.LANGUAGES.smalltalk=function(){var b="[a-z][a-zA-Z0-9_]*";var c={cN:"char",b:"\\$.{1}"};var a={cN:"symbol",b:"#"+hljs.UIR};return{dM:{k:{self:1,"super":1,nil:1,"true":1,"false":1,thisContext:1},c:[{cN:"comment",b:'"',e:'"',r:0},hljs.ASM,{cN:"class",b:"\\b[A-Z][A-Za-z0-9_]*",r:0},{cN:"method",b:b+":"},hljs.CNM,a,c,{cN:"localvars",b:"\\|\\s*(("+b+")\\s*)+\\|"},{cN:"array",b:"\\#\\(",e:"\\)",c:[hljs.ASM,c,hljs.CNM,a]}]}}}();hljs.LANGUAGES.tex=function(){var c={cN:"command",b:"\\\\[a-zA-Zа-яА-я]+[\\*]?",r:10};var b={cN:"command",b:"\\\\[^a-zA-Zа-яА-я0-9]",r:0};var a={cN:"special",b:"[{}\\[\\]\\&#~]",r:0};return{dM:{c:[{b:"\\\\[a-zA-Zа-яА-я]+[\\*]? *= *-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",rB:true,c:[c,b,{cN:"number",b:" *=",e:"-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?",eB:true}],r:10},c,b,a,{cN:"formula",b:"\\$\\$",e:"\\$\\$",c:[c,b,a],r:0},{cN:"formula",b:"\\$",e:"\\$",c:[c,b,a],r:0},{cN:"comment",b:"%",e:"$",r:0}]}}}();hljs.LANGUAGES.sql={cI:true,dM:{i:"[^\\s]",c:[{cN:"operator",b:"(begin|start|commit|rollback|savepoint|lock|alter|create|drop|rename|call|delete|do|handler|insert|load|replace|select|truncate|update|set|show|pragma)\\b",e:";|$",k:{keyword:{all:1,partial:1,global:1,month:1,current_timestamp:1,using:1,go:1,revoke:1,smallint:1,indicator:1,"end-exec":1,disconnect:1,zone:1,"with":1,character:1,assertion:1,to:1,add:1,current_user:1,usage:1,input:1,local:1,alter:1,match:1,collate:1,real:1,then:1,rollback:1,get:1,read:1,timestamp:1,session_user:1,not:1,integer:1,bit:1,unique:1,day:1,minute:1,desc:1,insert:1,execute:1,like:1,ilike:2,level:1,decimal:1,drop:1,"continue":1,isolation:1,found:1,where:1,constraints:1,domain:1,right:1,national:1,some:1,module:1,transaction:1,relative:1,second:1,connect:1,escape:1,close:1,system_user:1,"for":1,deferred:1,section:1,cast:1,current:1,sqlstate:1,allocate:1,intersect:1,deallocate:1,numeric:1,"public":1,preserve:1,full:1,"goto":1,initially:1,asc:1,no:1,key:1,output:1,collation:1,group:1,by:1,union:1,session:1,both:1,last:1,language:1,constraint:1,column:1,of:1,space:1,foreign:1,deferrable:1,prior:1,connection:1,unknown:1,action:1,commit:1,view:1,or:1,first:1,into:1,"float":1,year:1,primary:1,cascaded:1,except:1,restrict:1,set:1,references:1,names:1,table:1,outer:1,open:1,select:1,size:1,are:1,rows:1,from:1,prepare:1,distinct:1,leading:1,create:1,only:1,next:1,inner:1,authorization:1,schema:1,corresponding:1,option:1,declare:1,precision:1,immediate:1,"else":1,timezone_minute:1,external:1,varying:1,translation:1,"true":1,"case":1,exception:1,join:1,hour:1,"default":1,"double":1,scroll:1,value:1,cursor:1,descriptor:1,values:1,dec:1,fetch:1,procedure:1,"delete":1,and:1,"false":1,"int":1,is:1,describe:1,"char":1,as:1,at:1,"in":1,varchar:1,"null":1,trailing:1,any:1,absolute:1,current_time:1,end:1,grant:1,privileges:1,when:1,cross:1,check:1,write:1,current_date:1,pad:1,begin:1,temporary:1,exec:1,time:1,update:1,catalog:1,user:1,sql:1,date:1,on:1,identity:1,timezone_hour:1,natural:1,whenever:1,interval:1,work:1,order:1,cascade:1,diagnostics:1,nchar:1,having:1,left:1,call:1,"do":1,handler:1,load:1,replace:1,truncate:1,start:1,lock:1,show:1,pragma:1},aggregate:{count:1,sum:1,min:1,max:1,avg:1}},c:[{cN:"string",b:"'",e:"'",c:[hljs.BE,{b:"''"}],r:0},{cN:"string",b:'"',e:'"',c:[hljs.BE,{b:'""'}],r:0},{cN:"string",b:"`",e:"`",c:[hljs.BE]},hljs.CNM,{b:"\\n"}]},hljs.CBLCLM,{cN:"comment",b:"--",e:"$"}]}};hljs.LANGUAGES.vala={dM:{k:{keyword:{"char":1,uchar:1,unichar:1,"int":1,uint:1,"long":1,ulong:1,"short":1,ushort:1,int8:1,int16:1,int32:1,int64:1,uint8:1,uint16:1,uint32:1,uint64:1,"float":1,"double":1,bool:1,struct:1,"enum":1,string:1,"void":1,weak:5,unowned:5,owned:5,async:5,signal:5,"static":1,"abstract":1,"interface":1,override:1,"while":1,"do":1,"for":1,foreach:1,"else":1,"switch":1,"case":1,"break":1,"default":1,"return":1,"try":1,"catch":1,"public":1,"private":1,"protected":1,internal:1,using:1,"new":1,"this":1,get:1,set:1,"const":1,stdout:1,stdin:1,stderr:1,"var":1,DBus:2,GLib:2,CCode:10,Gee:10,Object:1},literal:{"false":1,"true":1,"null":1}},c:[{cN:"class",b:"(class |interface |delegate |namespace )",e:"{",k:{"class":1,"interface":1},c:[{b:"(implements|extends)",e:hljs.IMMEDIATE_RE,k:{"extends":1,"implements":1},r:1},{cN:"title",b:hljs.UIR,e:hljs.IMMEDIATE_RE}]},hljs.CLCM,hljs.CBLCLM,{cN:"string",b:'"""',e:'"""',r:5},hljs.ASM,hljs.QSM,hljs.CNM,{cN:"preprocessor",b:"^#",e:"$",r:2},{cN:"constant",b:" [A-Z_]+ ",e:hljs.IMMEDIATE_RE,r:0}]}};hljs.LANGUAGES.ini={cI:true,dM:{i:"[^\\s]",c:[{cN:"comment",b:";",e:"$"},{cN:"title",b:"^\\[",e:"\\]"},{cN:"setting",b:"^[a-z0-9_\\[\\]]+[ \\t]*=[ \\t]*",e:"$",c:[{cN:"value",eW:true,k:{on:1,off:1,"true":1,"false":1,yes:1,no:1},c:[hljs.QSM,hljs.NM]}]}]}};hljs.LANGUAGES.axapta={dM:{k:{"false":1,"int":1,"abstract":1,"private":1,"char":1,"interface":1,"boolean":1,"static":1,"null":1,"if":1,"for":1,"true":1,"while":1,"long":1,"throw":1,"finally":1,"protected":1,"extends":1,"final":1,"implements":1,"return":1,"void":1,"enum":1,"else":1,"break":1,"new":1,"catch":1,"byte":1,"super":1,"class":1,"case":1,"short":1,"default":1,"double":1,"public":1,"try":1,"this":1,"switch":1,"continue":1,reverse:1,firstfast:1,firstonly:1,forupdate:1,nofetch:1,sum:1,avg:1,minof:1,maxof:1,count:1,order:1,group:1,by:1,asc:1,desc:1,index:1,hint:1,like:1,dispaly:1,edit:1,client:1,server:1,ttsbegin:1,ttscommit:1,str:1,real:1,date:1,container:1,anytype:1,common:1,div:1,mod:1},c:[hljs.CLCM,hljs.CBLCLM,hljs.ASM,hljs.QSM,hljs.CNM,{cN:"preprocessor",b:"#",e:"$"},{cN:"class",b:"(class |interface )",e:"{",i:":",k:{"class":1,"interface":1},c:[{cN:"inheritance",b:"(implements|extends)",k:{"extends":1,"implements":1},r:10},{cN:"title",b:hljs.UIR}]}]}};hljs.LANGUAGES.perl=function(){var c={getpwent:1,getservent:1,quotemeta:1,msgrcv:1,scalar:1,kill:1,dbmclose:1,undef:1,lc:1,ma:1,syswrite:1,tr:1,send:1,umask:1,sysopen:1,shmwrite:1,vec:1,qx:1,utime:1,local:1,oct:1,semctl:1,localtime:1,readpipe:1,"do":1,"return":1,format:1,read:1,sprintf:1,dbmopen:1,pop:1,getpgrp:1,not:1,getpwnam:1,rewinddir:1,qq:1,fileno:1,qw:1,endprotoent:1,wait:1,sethostent:1,bless:1,s:1,opendir:1,"continue":1,each:1,sleep:1,endgrent:1,shutdown:1,dump:1,chomp:1,connect:1,getsockname:1,die:1,socketpair:1,close:1,flock:1,exists:1,index:1,shmget:1,sub:1,"for":1,endpwent:1,redo:1,lstat:1,msgctl:1,setpgrp:1,abs:1,exit:1,select:1,print:1,ref:1,gethostbyaddr:1,unshift:1,fcntl:1,syscall:1,"goto":1,getnetbyaddr:1,join:1,gmtime:1,symlink:1,semget:1,splice:1,x:1,getpeername:1,recv:1,log:1,setsockopt:1,cos:1,last:1,reverse:1,gethostbyname:1,getgrnam:1,study:1,formline:1,endhostent:1,times:1,chop:1,length:1,gethostent:1,getnetent:1,pack:1,getprotoent:1,getservbyname:1,rand:1,mkdir:1,pos:1,chmod:1,y:1,substr:1,endnetent:1,printf:1,next:1,open:1,msgsnd:1,readdir:1,use:1,unlink:1,getsockopt:1,getpriority:1,rindex:1,wantarray:1,hex:1,system:1,getservbyport:1,endservent:1,"int":1,chr:1,untie:1,rmdir:1,prototype:1,tell:1,listen:1,fork:1,shmread:1,ucfirst:1,setprotoent:1,"else":1,sysseek:1,link:1,getgrgid:1,shmctl:1,waitpid:1,unpack:1,getnetbyname:1,reset:1,chdir:1,grep:1,split:1,require:1,caller:1,lcfirst:1,until:1,warn:1,"while":1,values:1,shift:1,telldir:1,getpwuid:1,my:1,getprotobynumber:1,"delete":1,and:1,sort:1,uc:1,defined:1,srand:1,accept:1,"package":1,seekdir:1,getprotobyname:1,semop:1,our:1,rename:1,seek:1,"if":1,q:1,chroot:1,sysread:1,setpwent:1,no:1,crypt:1,getc:1,chown:1,sqrt:1,write:1,setnetent:1,setpriority:1,foreach:1,tie:1,sin:1,msgget:1,map:1,stat:1,getlogin:1,unless:1,elsif:1,truncate:1,exec:1,keys:1,glob:1,tied:1,closedir:1,ioctl:1,socket:1,readlink:1,"eval":1,xor:1,readline:1,binmode:1,setservent:1,eof:1,ord:1,bind:1,alarm:1,pipe:1,atan2:1,getgrent:1,exp:1,time:1,push:1,setgrent:1,gt:1,lt:1,or:1,ne:1,m:1};var d={cN:"subst",b:"[$@]\\{",e:"}",k:c,r:10};var b={cN:"variable",b:"\\$\\d"};var a={cN:"variable",b:"[\\$\\%\\@\\*](\\^\\w\\b|#\\w+(\\:\\:\\w+)*|[^\\s\\w{]|{\\w+}|\\w+(\\:\\:\\w*)*)"};var f=[hljs.BE,d,b,a];var e=[hljs.HCM,{cN:"comment",b:"^(__END__|__DATA__)",e:"\\n$",r:5},{cN:"string",b:"q[qwxr]?\\s*\\(",e:"\\)",c:f,r:5},{cN:"string",b:"q[qwxr]?\\s*\\[",e:"\\]",c:f,r:5},{cN:"string",b:"q[qwxr]?\\s*\\{",e:"\\}",c:f,r:5},{cN:"string",b:"q[qwxr]?\\s*\\|",e:"\\|",c:f,r:5},{cN:"string",b:"q[qwxr]?\\s*\\<",e:"\\>",c:f,r:5},{cN:"string",b:"qw\\s+q",e:"q",c:f,r:5},{cN:"string",b:"'",e:"'",c:[hljs.BE],r:0},{cN:"string",b:'"',e:'"',c:f,r:0},{cN:"string",b:"`",e:"`",c:[hljs.BE]},{cN:"string",b:"{\\w+}",r:0},{cN:"string",b:"-?\\w+\\s*\\=\\>",r:0},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{cN:"regexp",b:"(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",r:10},{cN:"regexp",b:"(m|qr)?/",e:"/[a-z]*",c:[hljs.BE],r:0},{cN:"sub",b:"\\bsub\\b",e:"(\\s*\\(.*?\\))?[;{]",k:{sub:1},r:5},b,a,{cN:"operator",b:"-\\w\\b",r:0},{cN:"pod",b:"\\=\\w",e:"\\=cut"}];d.c=e;return{dM:{k:c,c:e}}}();hljs.LANGUAGES.scala=function(){var a={cN:"annotation",b:"@[A-Za-z]+"};var b={cN:"string",b:'u?r?"""',e:'"""',r:10};return{dM:{k:{type:1,yield:1,lazy:1,override:1,def:1,"with":1,val:1,"var":1,"false":1,"true":1,sealed:1,"abstract":1,"private":1,trait:1,object:1,"null":1,"if":1,"for":1,"while":1,"throw":1,"finally":1,"protected":1,"extends":1,"import":1,"final":1,"return":1,"else":1,"break":1,"new":1,"catch":1,"super":1,"class":1,"case":1,"package":1,"default":1,"try":1,"this":1,match:1,"continue":1,"throws":1},c:[{cN:"javadoc",b:"/\\*\\*",e:"\\*/",c:[{cN:"javadoctag",b:"@[A-Za-z]+"}],r:10},hljs.CLCM,hljs.CBLCLM,hljs.ASM,hljs.QSM,b,{cN:"class",b:"((case )?class |object |trait )",e:"({|$)",i:":",k:{"case":1,"class":1,trait:1,object:1},c:[{b:"(extends|with)",k:{"extends":1,"with":1},r:10},{cN:"title",b:hljs.UIR},{cN:"params",b:"\\(",e:"\\)",c:[hljs.ASM,hljs.QSM,b,a]}]},hljs.CNM,a]}}}();hljs.LANGUAGES.cmake={cI:true,dM:{k:{add_custom_command:2,add_custom_target:2,add_definitions:2,add_dependencies:2,add_executable:2,add_library:2,add_subdirectory:2,add_executable:2,add_library:2,add_subdirectory:2,add_test:2,aux_source_directory:2,"break":1,build_command:2,cmake_minimum_required:3,cmake_policy:3,configure_file:1,create_test_sourcelist:1,define_property:1,"else":1,elseif:1,enable_language:2,enable_testing:2,endforeach:1,endfunction:1,endif:1,endmacro:1,endwhile:1,execute_process:2,"export":1,find_file:1,find_library:2,find_package:2,find_path:1,find_program:1,fltk_wrap_ui:2,foreach:1,"function":1,get_cmake_property:3,get_directory_property:1,get_filename_component:1,get_property:1,get_source_file_property:1,get_target_property:1,get_test_property:1,"if":1,include:1,include_directories:2,include_external_msproject:1,include_regular_expression:2,install:1,link_directories:1,load_cache:1,load_command:1,macro:1,mark_as_advanced:1,message:1,option:1,output_required_files:1,project:1,qt_wrap_cpp:2,qt_wrap_ui:2,remove_definitions:2,"return":1,separate_arguments:1,set:1,set_directory_properties:1,set_property:1,set_source_files_properties:1,set_target_properties:1,set_tests_properties:1,site_name:1,source_group:1,string:1,target_link_libraries:2,try_compile:2,try_run:2,unset:1,variable_watch:2,"while":1,build_name:1,exec_program:1,export_library_dependencies:1,install_files:1,install_programs:1,install_targets:1,link_libraries:1,make_directory:1,remove:1,subdir_depends:1,subdirs:1,use_mangled_mesa:1,utility_source:1,variable_requires:1,write_file:1},c:[{cN:"envvar",b:"\\${",e:"}"},hljs.HCM,hljs.QSM,hljs.NM]}};hljs.LANGUAGES.objectivec=function(){var a={keyword:{"false":1,"int":1,"float":1,"while":1,"private":1,"char":1,"catch":1,"export":1,sizeof:2,typedef:2,"const":1,struct:1,"for":1,union:1,unsigned:1,"long":1,"volatile":2,"static":1,"protected":1,bool:1,mutable:1,"if":1,"public":1,"do":1,"return":1,"goto":1,"void":2,"enum":1,"else":1,"break":1,extern:1,"true":1,"class":1,asm:1,"case":1,"short":1,"default":1,"double":1,"throw":1,register:1,explicit:1,signed:1,typename:1,"try":1,"this":1,"switch":1,"continue":1,wchar_t:1,inline:1,readonly:1,assign:1,property:1,protocol:10,self:1,"synchronized":1,end:1,synthesize:50,id:1,optional:1,required:1,implementation:10,nonatomic:1,"interface":1,"super":1,unichar:1,"finally":2,dynamic:2,nil:1},built_in:{YES:5,NO:5,NULL:1,IBOutlet:50,IBAction:50,NSString:50,NSDictionary:50,CGRect:50,CGPoint:50,NSRange:50,release:1,retain:1,autorelease:50,UIButton:50,UILabel:50,UITextView:50,UIWebView:50,MKMapView:50,UISegmentedControl:50,NSObject:50,UITableViewDelegate:50,UITableViewDataSource:50,NSThread:50,UIActivityIndicator:50,UITabbar:50,UIToolBar:50,UIBarButtonItem:50,UIImageView:50,NSAutoreleasePool:50,UITableView:50,BOOL:1,NSInteger:20,CGFloat:20,NSException:50,NSLog:50,NSMutableString:50,NSMutableArray:50,NSMutableDictionary:50,NSURL:50}};return{dM:{k:a,i:"</",c:[hljs.CLCM,hljs.CBLCLM,hljs.CNM,hljs.QSM,{cN:"string",b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"},{cN:"preprocessor",b:"#import",e:"$",c:[{cN:"title",b:'"',e:'"'},{cN:"title",b:"<",e:">"}]},{cN:"preprocessor",b:"#",e:"$"},{cN:"class",b:"interface|class|protocol|implementation",e:"({|$)",k:{"interface":1,"class":1,protocol:5,implementation:5},c:[{cN:"id",b:hljs.UIR}]}]}}}();hljs.LANGUAGES.avrasm={cI:true,dM:{k:{keyword:{adc:1,add:1,adiw:1,and:1,andi:1,asr:1,bclr:1,bld:1,brbc:1,brbs:1,brcc:1,brcs:1,"break":1,breq:1,brge:1,brhc:1,brhs:1,brid:1,brie:1,brlo:1,brlt:1,brmi:1,brne:1,brpl:1,brsh:1,brtc:1,brts:1,brvc:1,brvs:1,bset:1,bst:1,call:1,cbi:1,cbr:1,clc:1,clh:1,cli:1,cln:1,clr:1,cls:1,clt:1,clv:1,clz:1,com:1,cp:1,cpc:1,cpi:1,cpse:1,dec:1,eicall:1,eijmp:1,elpm:1,eor:1,fmul:1,fmuls:1,fmulsu:1,icall:1,ijmp:1,"in":1,inc:1,jmp:1,ld:1,ldd:1,ldi:1,lds:1,lpm:1,lsl:1,lsr:1,mov:1,movw:1,mul:1,muls:1,mulsu:1,neg:1,nop:1,or:1,ori:1,out:1,pop:1,push:1,rcall:1,ret:1,reti:1,rjmp:1,rol:1,ror:1,sbc:1,sbr:1,sbrc:1,sbrs:1,sec:1,seh:1,sbi:1,sbci:1,sbic:1,sbis:1,sbiw:1,sei:1,sen:1,ser:1,ses:1,set:1,sev:1,sez:1,sleep:1,spm:1,st:1,std:1,sts:1,sub:1,subi:1,swap:1,tst:1,wdr:1},built_in:{r0:1,r1:1,r2:1,r3:1,r4:1,r5:1,r6:1,r7:1,r8:1,r9:1,r10:1,r11:1,r12:1,r13:1,r14:1,r15:1,r16:1,r17:1,r18:1,r19:1,r20:1,r21:1,r22:1,r23:1,r24:1,r25:1,r26:1,r27:1,r28:1,r29:1,r30:1,r31:1,x:1,xh:1,xl:1,y:1,yh:1,yl:1,z:1,zh:1,zl:1,ucsr1c:1,udr1:1,ucsr1a:1,ucsr1b:1,ubrr1l:1,ubrr1h:1,ucsr0c:1,ubrr0h:1,tccr3c:1,tccr3a:1,tccr3b:1,tcnt3h:1,tcnt3l:1,ocr3ah:1,ocr3al:1,ocr3bh:1,ocr3bl:1,ocr3ch:1,ocr3cl:1,icr3h:1,icr3l:1,etimsk:1,etifr:1,tccr1c:1,ocr1ch:1,ocr1cl:1,twcr:1,twdr:1,twar:1,twsr:1,twbr:1,osccal:1,xmcra:1,xmcrb:1,eicra:1,spmcsr:1,spmcr:1,portg:1,ddrg:1,ping:1,portf:1,ddrf:1,sreg:1,sph:1,spl:1,xdiv:1,rampz:1,eicrb:1,eimsk:1,gimsk:1,gicr:1,eifr:1,gifr:1,timsk:1,tifr:1,mcucr:1,mcucsr:1,tccr0:1,tcnt0:1,ocr0:1,assr:1,tccr1a:1,tccr1b:1,tcnt1h:1,tcnt1l:1,ocr1ah:1,ocr1al:1,ocr1bh:1,ocr1bl:1,icr1h:1,icr1l:1,tccr2:1,tcnt2:1,ocr2:1,ocdr:1,wdtcr:1,sfior:1,eearh:1,eearl:1,eedr:1,eecr:1,porta:1,ddra:1,pina:1,portb:1,ddrb:1,pinb:1,portc:1,ddrc:1,pinc:1,portd:1,ddrd:1,pind:1,spdr:1,spsr:1,spcr:1,udr0:1,ucsr0a:1,ucsr0b:1,ubrr0l:1,acsr:1,admux:1,adcsr:1,adch:1,adcl:1,porte:1,ddre:1,pine:1,pinf:1}},c:[hljs.CBLCLM,{cN:"comment",b:";",e:"$"},hljs.CNM,hljs.QSM,{cN:"string",b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"},{cN:"label",b:"^[A-Za-z0-9_.$]+:"},{cN:"preprocessor",b:"#",e:"$"},{cN:"preprocessor",b:"\\.[a-zA-Z]+"},{cN:"localvars",b:"@[0-9]+"}]}};hljs.LANGUAGES.vhdl={cI:true,dM:{k:{keyword:{abs:1,access:1,after:1,alias:1,all:1,and:1,architecture:2,array:1,assert:1,attribute:1,begin:1,block:1,body:1,buffer:1,bus:1,"case":1,component:2,configuration:1,constant:1,disconnect:2,downto:2,"else":1,elsif:1,end:1,entity:2,exit:1,file:1,"for":1,"function":1,generate:2,generic:2,group:1,guarded:2,"if":0,impure:2,"in":1,inertial:1,inout:1,is:1,label:1,library:1,linkage:1,literal:1,loop:1,map:1,mod:1,nand:1,"new":1,next:1,nor:1,not:1,"null":1,of:1,on:1,open:1,or:1,others:1,out:1,"package":1,port:2,postponed:1,procedure:1,process:1,pure:2,range:1,record:1,register:1,reject:1,"return":1,rol:1,ror:1,select:1,severity:1,signal:1,shared:1,sla:1,sli:1,sra:1,srl:1,subtype:2,then:1,to:1,transport:1,type:1,units:1,until:1,use:1,variable:1,wait:1,when:1,"while":1,"with":1,xnor:1,xor:1},type:{"boolean":1,bit:1,character:1,severity_level:2,integer:1,time:1,delay_length:2,natural:1,positive:1,string:1,bit_vector:2,file_open_kind:2,file_open_status:2,std_ulogic:2,std_ulogic_vector:2,std_logic:2,std_logic_vector:2}},c:[{cN:"comment",b:"--",e:"$"},hljs.QSM,hljs.CNM,{cN:"literal",b:"'(U|X|0|1|Z|W|L|H|-)",e:"'",c:[hljs.BE],r:5}]}};hljs.LANGUAGES.nginx=function(){var c={cN:"variable",b:"\\$\\d+"};var b={cN:"variable",b:"\\${",e:"}"};var a={cN:"variable",b:"[\\$\\@]"+hljs.UIR};return{dM:{c:[hljs.HCM,{b:hljs.UIR,e:";|{",rE:true,k:{accept_mutex:1,accept_mutex_delay:1,access_log:1,add_after_body:1,add_before_body:1,add_header:1,addition_types:1,alias:1,allow:1,ancient_browser:1,ancient_browser:1,ancient_browser_value:1,ancient_browser_value:1,auth_basic:1,auth_basic_user_file:1,autoindex:1,autoindex_exact_size:1,autoindex_localtime:1,"break":1,charset:1,charset:1,charset_map:1,charset_map:1,charset_types:1,charset_types:1,client_body_buffer_size:1,client_body_in_file_only:1,client_body_in_single_buffer:1,client_body_temp_path:1,client_body_timeout:1,client_header_buffer_size:1,client_header_timeout:1,client_max_body_size:1,connection_pool_size:1,connections:1,create_full_put_path:1,daemon:1,dav_access:1,dav_methods:1,debug_connection:1,debug_points:1,default_type:1,deny:1,directio:1,directio_alignment:1,echo:1,echo_after_body:1,echo_before_body:1,echo_blocking_sleep:1,echo_duplicate:1,echo_end:1,echo_exec:1,echo_flush:1,echo_foreach_split:1,echo_location:1,echo_location_async:1,echo_read_request_body:1,echo_request_body:1,echo_reset_timer:1,echo_sleep:1,echo_subrequest:1,echo_subrequest_async:1,empty_gif:1,empty_gif:1,env:1,error_log:1,error_log:1,error_page:1,events:1,expires:1,fastcgi_bind:1,fastcgi_buffer_size:1,fastcgi_buffers:1,fastcgi_busy_buffers_size:1,fastcgi_cache:1,fastcgi_cache_key:1,fastcgi_cache_methods:1,fastcgi_cache_min_uses:1,fastcgi_cache_path:1,fastcgi_cache_use_stale:1,fastcgi_cache_valid:1,fastcgi_catch_stderr:1,fastcgi_connect_timeout:1,fastcgi_hide_header:1,fastcgi_ignore_client_abort:1,fastcgi_ignore_headers:1,fastcgi_index:1,fastcgi_intercept_errors:1,fastcgi_max_temp_file_size:1,fastcgi_next_upstream:1,fastcgi_param:1,fastcgi_pass:1,fastcgi_pass_header:1,fastcgi_pass_request_body:1,fastcgi_pass_request_headers:1,fastcgi_read_timeout:1,fastcgi_send_lowat:1,fastcgi_send_timeout:1,fastcgi_split_path_info:1,fastcgi_store:1,fastcgi_store_access:1,fastcgi_temp_file_write_size:1,fastcgi_temp_path:1,fastcgi_upstream_fail_timeout:1,fastcgi_upstream_max_fails:1,flv:1,geo:1,geo:1,geoip_city:1,geoip_country:1,gzip:1,gzip_buffers:1,gzip_comp_level:1,gzip_disable:1,gzip_hash:1,gzip_http_version:1,gzip_min_length:1,gzip_no_buffer:1,gzip_proxied:1,gzip_static:1,gzip_types:1,gzip_vary:1,gzip_window:1,http:1,"if":1,if_modified_since:1,ignore_invalid_headers:1,image_filter:1,image_filter_buffer:1,image_filter_jpeg_quality:1,image_filter_transparency:1,include:1,index:1,internal:1,ip_hash:1,js:1,js_load:1,js_require:1,js_utf8:1,keepalive_requests:1,keepalive_timeout:1,kqueue_changes:1,kqueue_events:1,large_client_header_buffers:1,limit_conn:1,limit_conn_log_level:1,limit_except:1,limit_rate:1,limit_rate_after:1,limit_req:1,limit_req_log_level:1,limit_req_zone:1,limit_zone:1,lingering_time:1,lingering_timeout:1,listen:1,location:1,lock_file:1,log_format:1,log_not_found:1,log_subrequest:1,map:1,map_hash_bucket_size:1,map_hash_max_size:1,master_process:1,memcached_bind:1,memcached_buffer_size:1,memcached_connect_timeout:1,memcached_next_upstream:1,memcached_pass:1,memcached_read_timeout:1,memcached_send_timeout:1,memcached_upstream_fail_timeout:1,memcached_upstream_max_fails:1,merge_slashes:1,min_delete_depth:1,modern_browser:1,modern_browser:1,modern_browser_value:1,modern_browser_value:1,more_clear_headers:1,more_clear_input_headers:1,more_set_headers:1,more_set_input_headers:1,msie_padding:1,msie_refresh:1,multi_accept:1,open_file_cache:1,open_file_cache_errors:1,open_file_cache_events:1,open_file_cache_min_uses:1,open_file_cache_retest:1,open_file_cache_valid:1,open_log_file_cache:1,optimize_server_names:1,output_buffers:1,override_charset:1,override_charset:1,perl:1,perl_modules:1,perl_require:1,perl_set:1,pid:1,port_in_redirect:1,post_action:1,postpone_gzipping:1,postpone_output:1,proxy_bind:1,proxy_buffer_size:1,proxy_buffering:1,proxy_buffers:1,proxy_busy_buffers_size:1,proxy_cache:1,proxy_cache_key:1,proxy_cache_methods:1,proxy_cache_min_uses:1,proxy_cache_path:1,proxy_cache_use_stale:1,proxy_cache_valid:1,proxy_connect_timeout:1,proxy_headers_hash_bucket_size:1,proxy_headers_hash_max_size:1,proxy_hide_header:1,proxy_ignore_client_abort:1,proxy_ignore_headers:1,proxy_intercept_errors:1,proxy_max_temp_file_size:1,proxy_method:1,proxy_next_upstream:1,proxy_pass:1,proxy_pass_header:1,proxy_pass_request_body:1,proxy_pass_request_headers:1,proxy_read_timeout:1,proxy_redirect:1,proxy_send_lowat:1,proxy_send_timeout:1,proxy_set_body:1,proxy_set_header:1,proxy_store:1,proxy_store_access:1,proxy_temp_file_write_size:1,proxy_temp_path:1,proxy_upstream_fail_timeout:1,proxy_upstream_max_fails:1,push_authorized_channels_only:1,push_channel_group:1,push_max_channel_id_length:1,push_max_channel_subscribers:1,push_max_message_buffer_length:1,push_max_reserved_memory:1,push_message_buffer_length:1,push_message_timeout:1,push_min_message_buffer_length:1,push_min_message_recipients:1,push_publisher:1,push_store_messages:1,push_subscriber:1,push_subscriber_concurrency:1,random_index:1,read_ahead:1,real_ip_header:1,recursive_error_pages:1,request_pool_size:1,reset_timedout_connection:1,resolver:1,resolver_timeout:1,"return":1,rewrite:1,rewrite_log:1,root:1,satisfy:1,satisfy_any:1,send_lowat:1,send_timeout:1,sendfile:1,sendfile_max_chunk:1,server:1,server:1,server_name:1,server_name_in_redirect:1,server_names_hash_bucket_size:1,server_names_hash_max_size:1,server_tokens:1,set:1,set_real_ip_from:1,source_charset:1,source_charset:1,ssi:1,ssi_ignore_recycled_buffers:1,ssi_min_file_chunk:1,ssi_silent_errors:1,ssi_types:1,ssi_value_length:1,ssl:1,ssl_certificate:1,ssl_certificate_key:1,ssl_ciphers:1,ssl_client_certificate:1,ssl_crl:1,ssl_dhparam:1,ssl_prefer_server_ciphers:1,ssl_protocols:1,ssl_session_cache:1,ssl_session_timeout:1,ssl_verify_client:1,ssl_verify_depth:1,sub_filter:1,sub_filter_once:1,sub_filter_types:1,tcp_nodelay:1,tcp_nopush:1,timer_resolution:1,try_files:1,types:1,types_hash_bucket_size:1,types_hash_max_size:1,underscores_in_headers:1,uninitialized_variable_warn:1,upstream:1,use:1,user:1,userid:1,userid:1,userid_domain:1,userid_domain:1,userid_expires:1,userid_expires:1,userid_mark:1,userid_name:1,userid_name:1,userid_p3p:1,userid_p3p:1,userid_path:1,userid_path:1,userid_service:1,userid_service:1,valid_referers:1,variables_hash_bucket_size:1,variables_hash_max_size:1,worker_connections:1,worker_cpu_affinity:1,worker_priority:1,worker_processes:1,worker_rlimit_core:1,worker_rlimit_nofile:1,worker_rlimit_sigpending:1,working_directory:1,xml_entities:1,xslt_stylesheet:1,xslt_types:1},r:0,c:[hljs.HCM,{b:"\\s",e:"[;{]",rB:true,rE:true,l:"[a-z/]+",k:{built_in:{on:1,off:1,yes:1,no:1,"true":1,"false":1,none:1,blocked:1,debug:1,info:1,notice:1,warn:1,error:1,crit:1,select:1,permanent:1,redirect:1,kqueue:1,rtsig:1,epoll:1,poll:1,"/dev/poll":1}},r:0,c:[hljs.HCM,{cN:"string",b:'"',e:'"',c:[hljs.BE,c,b,a],r:0},{cN:"string",b:"'",e:"'",c:[hljs.BE,c,b,a],r:0},{cN:"string",b:"([a-z]+):/",e:"[;\\s]",rE:true},{cN:"regexp",b:"\\s\\^",e:"\\s|{|;",rE:true,c:[hljs.BE,c,b,a]},{cN:"regexp",b:"~\\*?\\s+",e:"\\s|{|;",rE:true,c:[hljs.BE,c,b,a]},{cN:"regexp",b:"\\*(\\.[a-z\\-]+)+",c:[hljs.BE,c,b,a]},{cN:"regexp",b:"([a-z\\-]+\\.)+\\*",c:[hljs.BE,c,b,a]},{cN:"number",b:"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b"},{cN:"number",b:"\\s\\d+[kKmMgGdshdwy]*\\b",r:0},c,b,a]}]}]}}}();hljs.LANGUAGES.erlang_repl={dM:{k:{special_functions:{spawn:10,spawn_link:10,self:2},reserved:{after:1,and:1,andalso:5,band:1,begin:1,bnot:1,bor:1,bsl:1,bsr:1,bxor:1,"case":1,"catch":0,cond:1,div:1,end:1,fun:0,"if":0,let:1,not:0,of:1,or:1,orelse:5,query:1,receive:0,rem:1,"try":0,when:1,xor:1}},c:[{cN:"input_number",b:"^[0-9]+> ",r:10},{cN:"comment",b:"%",e:"$"},hljs.NM,hljs.ASM,hljs.QSM,{cN:"constant",b:"\\?(::)?([A-Z]\\w*(::)?)+"},{cN:"arrow",b:"->"},{cN:"ok",b:"ok"},{cN:"exclamation_mark",b:"!"},{cN:"function_or_atom",b:"(\\b[a-z'][a-zA-Z0-9_']*:[a-z'][a-zA-Z0-9_']*)|(\\b[a-z'][a-zA-Z0-9_']*)",r:0},{cN:"variable",b:"[A-Z][a-zA-Z0-9_']*",r:0}]}};hljs.LANGUAGES.django=function(){function c(f,e){return(e==undefined||(!f.cN&&e.cN=="tag")||f.cN=="value")}function d(j,e){var h={};for(var g in j){if(g!="contains"){h[g]=j[g]}var k=[];for(var f=0;j.c&&f<j.c.length;f++){k.push(d(j.c[f],j))}if(c(j,e)){k=b.concat(k)}if(k.length){h.c=k}}return h}var a={cN:"filter",b:"\\|[A-Za-z]+\\:?",eE:true,k:{truncatewords:1,removetags:1,linebreaksbr:1,yesno:1,get_digit:1,timesince:1,random:1,striptags:1,filesizeformat:1,escape:1,linebreaks:1,length_is:1,ljust:1,rjust:1,cut:1,urlize:1,fix_ampersands:1,title:1,floatformat:1,capfirst:1,pprint:1,divisibleby:1,add:1,make_list:1,unordered_list:1,urlencode:1,timeuntil:1,urlizetrunc:1,wordcount:1,stringformat:1,linenumbers:1,slice:1,date:1,dictsort:1,dictsortreversed:1,default_if_none:1,pluralize:1,lower:1,join:1,center:1,"default":1,truncatewords_html:1,upper:1,length:1,phone2numeric:1,wordwrap:1,time:1,addslashes:1,slugify:1,first:1},c:[{cN:"argument",b:'"',e:'"'}]};var b=[{cN:"template_comment",b:"{%\\s*comment\\s*%}",e:"{%\\s*endcomment\\s*%}"},{cN:"template_comment",b:"{#",e:"#}"},{cN:"template_tag",b:"{%",e:"%}",k:{comment:1,endcomment:1,load:1,templatetag:1,ifchanged:1,endifchanged:1,"if":1,endif:1,firstof:1,"for":1,endfor:1,"in":1,ifnotequal:1,endifnotequal:1,widthratio:1,"extends":1,include:1,spaceless:1,endspaceless:1,regroup:1,by:1,as:1,ifequal:1,endifequal:1,ssi:1,now:1,"with":1,cycle:1,url:1,filter:1,endfilter:1,debug:1,block:1,endblock:1,"else":1},c:[a]},{cN:"variable",b:"{{",e:"}}",c:[a]}];return{cI:true,dM:d(hljs.LANGUAGES.xml.dM)}}();hljs.LANGUAGES.delphi=function(){var a={and:1,safecall:1,cdecl:1,then:1,string:1,exports:1,library:1,not:1,pascal:1,set:1,virtual:1,file:1,"in":1,array:1,label:1,packed:1,"end.":1,index:1,"while":1,"const":1,raise:1,"for":1,to:1,implementation:1,"with":1,except:1,overload:1,destructor:1,downto:1,"finally":1,program:1,exit:1,unit:1,inherited:1,override:1,"if":1,type:1,until:1,"function":1,"do":1,begin:1,repeat:1,"goto":1,nil:1,far:1,initialization:1,object:1,"else":1,"var":1,uses:1,external:1,resourcestring:1,"interface":1,end:1,finalization:1,"class":1,asm:1,mod:1,"case":1,on:1,shr:1,shl:1,of:1,register:1,xorwrite:1,threadvar:1,"try":1,record:1,near:1,stored:1,constructor:1,stdcall:1,inline:1,div:1,out:1,or:1,procedure:1};var c={safecall:1,stdcall:1,pascal:1,stored:1,"const":1,implementation:1,finalization:1,except:1,to:1,"finally":1,program:1,inherited:1,override:1,then:1,exports:1,string:1,read:1,not:1,mod:1,shr:1,"try":1,div:1,shl:1,set:1,library:1,message:1,packed:1,index:1,"for":1,near:1,overload:1,label:1,downto:1,exit:1,"public":1,"goto":1,"interface":1,asm:1,on:1,of:1,constructor:1,or:1,"private":1,array:1,unit:1,raise:1,destructor:1,"var":1,type:1,until:1,"function":1,"else":1,external:1,"with":1,"case":1,"default":1,record:1,"while":1,"protected":1,property:1,procedure:1,published:1,and:1,cdecl:1,"do":1,threadvar:1,file:1,"in":1,"if":1,end:1,virtual:1,write:1,far:1,out:1,begin:1,repeat:1,nil:1,initialization:1,object:1,uses:1,resourcestring:1,"class":1,register:1,xorwrite:1,inline:1,"static":1};var f={cN:"comment",b:"{",e:"}",r:0};var e={cN:"comment",b:"\\(\\*",e:"\\*\\)",r:10};var d={cN:"string",b:"'",e:"'",c:[{b:"''"}],r:0};var b={cN:"string",b:"(#\\d+)+"};var g={cN:"function",b:"(procedure|constructor|destructor|function)\\b",e:"[:;]",k:{"function":1,constructor:10,destructor:10,procedure:10},c:[{cN:"title",b:hljs.IR},{cN:"params",b:"\\(",e:"\\)",k:a,c:[d,b]},f,e]};return{cI:true,dM:{k:a,i:'("|\\$[G-Zg-z]|\\/\\*|</)',c:[f,e,hljs.CLCM,d,b,hljs.NM,g,{cN:"class",b:"=\\bclass\\b",e:"end;",k:c,c:[d,b,f,e,g]}]},m:[]}}();hljs.LANGUAGES.vbscript={cI:true,dM:{k:{keyword:{call:1,"class":1,"const":1,dim:1,"do":1,loop:1,erase:1,execute:1,executeglobal:1,exit:1,"for":1,each:1,next:1,"function":1,"if":1,then:1,"else":1,on:1,error:1,option:1,explicit:1,"new":1,"private":1,property:1,let:1,get:1,"public":1,randomize:1,redim:1,rem:1,select:1,"case":1,set:1,stop:1,sub:1,"while":1,wend:1,"with":1,end:1,to:1,elseif:1,is:1,or:1,xor:1,and:1,not:1,class_initialize:1,class_terminate:1,"default":1,preserve:1,"in":1,me:1,byval:1,byref:1,step:1,resume:1,"goto":1},built_in:{lcase:1,month:1,vartype:1,instrrev:1,ubound:1,setlocale:1,getobject:1,rgb:1,getref:1,string:1,weekdayname:1,rnd:1,dateadd:1,monthname:1,now:1,day:1,minute:1,isarray:1,cbool:1,round:1,formatcurrency:1,conversions:1,csng:1,timevalue:1,second:1,year:1,space:1,abs:1,clng:1,timeserial:1,fixs:1,len:1,asc:1,isempty:1,maths:1,dateserial:1,atn:1,timer:1,isobject:1,filter:1,weekday:1,datevalue:1,ccur:1,isdate:1,instr:1,datediff:1,formatdatetime:1,replace:1,isnull:1,right:1,sgn:1,array:1,snumeric:1,log:1,cdbl:1,hex:1,chr:1,lbound:1,msgbox:1,ucase:1,getlocale:1,cos:1,cdate:1,cbyte:1,rtrim:1,join:1,hour:1,oct:1,typename:1,trim:1,strcomp:1,"int":1,createobject:1,loadpicture:1,tan:1,formatnumber:1,mid:1,scriptenginebuildversion:1,scriptengine:1,split:1,scriptengineminorversion:1,cint:1,sin:1,datepart:1,ltrim:1,sqr:1,scriptenginemajorversion:1,time:1,derived:1,"eval":1,date:1,formatpercent:1,exp:1,inputbox:1,left:1,ascw:1,chrw:1,regexp:1,server:1,response:1,request:1,cstr:1,err:1},literal:{"true":1,"false":1,"null":1,nothing:1,empty:1}},c:[{cN:"string",b:'"',e:'"',i:"\\n",c:[{b:'""'}],r:0},{cN:"comment",b:"'",e:"$"},hljs.CNM]}};hljs.LANGUAGES.mel={dM:{k:{"int":1,"float":1,string:1,"float":1,vector:1,matrix:1,"if":1,"else":1,"switch":1,"case":1,"default":1,"while":1,"do":1,"for":1,"in":1,"break":1,"continue":1,exists:1,objExists:1,attributeExists:1,global:1,proc:1,"return":1,error:1,warning:1,trace:1,"catch":1,about:1,abs:1,addAttr:1,addAttributeEditorNodeHelp:1,addDynamic:1,addNewShelfTab:1,addPP:1,addPanelCategory:1,addPrefixToName:1,advanceToNextDrivenKey:1,affectedNet:1,affects:1,aimConstraint:1,air:1,alias:1,aliasAttr:1,align:1,alignCtx:1,alignCurve:1,alignSurface:1,allViewFit:1,ambientLight:1,angle:1,angleBetween:1,animCone:1,animCurveEditor:1,animDisplay:1,animView:1,annotate:1,appendStringArray:1,applicationName:1,applyAttrPreset:1,applyTake:1,arcLenDimContext:1,arcLengthDimension:1,arclen:1,arrayMapper:1,art3dPaintCtx:1,artAttrCtx:1,artAttrPaintVertexCtx:1,artAttrSkinPaintCtx:1,artAttrTool:1,artBuildPaintMenu:1,artFluidAttrCtx:1,artPuttyCtx:1,artSelectCtx:1,artSetPaintCtx:1,artUserPaintCtx:1,assignCommand:1,assignInputDevice:1,assignViewportFactories:1,attachCurve:1,attachDeviceAttr:1,attachSurface:1,attrColorSliderGrp:1,attrCompatibility:1,attrControlGrp:1,attrEnumOptionMenu:1,attrEnumOptionMenuGrp:1,attrFieldGrp:1,attrFieldSliderGrp:1,attrNavigationControlGrp:1,attrPresetEditWin:1,attributeExists:1,attributeInfo:1,attributeMenu:1,attributeQuery:1,autoKeyframe:1,autoPlace:1,bakeClip:1,bakeFluidShading:1,bakePartialHistory:1,bakeResults:1,bakeSimulation:1,basename:1,basenameEx:1,batchRender:1,bessel:1,bevel:1,bevelPlus:1,binMembership:1,bindSkin:1,blend2:1,blendShape:1,blendShapeEditor:1,blendShapePanel:1,blendTwoAttr:1,blindDataType:1,boneLattice:1,boundary:1,boxDollyCtx:1,boxZoomCtx:1,bufferCurve:1,buildBookmarkMenu:1,buildKeyframeMenu:1,button:1,buttonManip:1,CBG:1,cacheFile:1,cacheFileCombine:1,cacheFileMerge:1,cacheFileTrack:1,camera:1,cameraView:1,canCreateManip:1,canvas:1,capitalizeString:1,"catch":1,catchQuiet:1,ceil:1,changeSubdivComponentDisplayLevel:1,changeSubdivRegion:1,channelBox:1,character:1,characterMap:1,characterOutlineEditor:1,characterize:1,chdir:1,checkBox:1,checkBoxGrp:1,checkDefaultRenderGlobals:1,choice:1,circle:1,circularFillet:1,clamp:1,clear:1,clearCache:1,clip:1,clipEditor:1,clipEditorCurrentTimeCtx:1,clipSchedule:1,clipSchedulerOutliner:1,clipTrimBefore:1,closeCurve:1,closeSurface:1,cluster:1,cmdFileOutput:1,cmdScrollFieldExecuter:1,cmdScrollFieldReporter:1,cmdShell:1,coarsenSubdivSelectionList:1,collision:1,color:1,colorAtPoint:1,colorEditor:1,colorIndex:1,colorIndexSliderGrp:1,colorSliderButtonGrp:1,colorSliderGrp:1,columnLayout:1,commandEcho:1,commandLine:1,commandPort:1,compactHairSystem:1,componentEditor:1,compositingInterop:1,computePolysetVolume:1,condition:1,cone:1,confirmDialog:1,connectAttr:1,connectControl:1,connectDynamic:1,connectJoint:1,connectionInfo:1,constrain:1,constrainValue:1,constructionHistory:1,container:1,containsMultibyte:1,contextInfo:1,control:1,convertFromOldLayers:1,convertIffToPsd:1,convertLightmap:1,convertSolidTx:1,convertTessellation:1,convertUnit:1,copyArray:1,copyFlexor:1,copyKey:1,copySkinWeights:1,cos:1,cpButton:1,cpCache:1,cpClothSet:1,cpCollision:1,cpConstraint:1,cpConvClothToMesh:1,cpForces:1,cpGetSolverAttr:1,cpPanel:1,cpProperty:1,cpRigidCollisionFilter:1,cpSeam:1,cpSetEdit:1,cpSetSolverAttr:1,cpSolver:1,cpSolverTypes:1,cpTool:1,cpUpdateClothUVs:1,createDisplayLayer:1,createDrawCtx:1,createEditor:1,createLayeredPsdFile:1,createMotionField:1,createNewShelf:1,createNode:1,createRenderLayer:1,createSubdivRegion:1,cross:1,crossProduct:1,ctxAbort:1,ctxCompletion:1,ctxEditMode:1,ctxTraverse:1,currentCtx:1,currentTime:1,currentTimeCtx:1,currentUnit:1,currentUnit:1,curve:1,curveAddPtCtx:1,curveCVCtx:1,curveEPCtx:1,curveEditorCtx:1,curveIntersect:1,curveMoveEPCtx:1,curveOnSurface:1,curveSketchCtx:1,cutKey:1,cycleCheck:1,cylinder:1,dagPose:1,date:1,defaultLightListCheckBox:1,defaultNavigation:1,defineDataServer:1,defineVirtualDevice:1,deformer:1,deg_to_rad:1,"delete":1,deleteAttr:1,deleteShadingGroupsAndMaterials:1,deleteShelfTab:1,deleteUI:1,deleteUnusedBrushes:1,delrandstr:1,detachCurve:1,detachDeviceAttr:1,detachSurface:1,deviceEditor:1,devicePanel:1,dgInfo:1,dgdirty:1,dgeval:1,dgtimer:1,dimWhen:1,directKeyCtx:1,directionalLight:1,dirmap:1,dirname:1,disable:1,disconnectAttr:1,disconnectJoint:1,diskCache:1,displacementToPoly:1,displayAffected:1,displayColor:1,displayCull:1,displayLevelOfDetail:1,displayPref:1,displayRGBColor:1,displaySmoothness:1,displayStats:1,displayString:1,displaySurface:1,distanceDimContext:1,distanceDimension:1,doBlur:1,dolly:1,dollyCtx:1,dopeSheetEditor:1,dot:1,dotProduct:1,doubleProfileBirailSurface:1,drag:1,dragAttrContext:1,draggerContext:1,dropoffLocator:1,duplicate:1,duplicateCurve:1,duplicateSurface:1,dynCache:1,dynControl:1,dynExport:1,dynExpression:1,dynGlobals:1,dynPaintEditor:1,dynParticleCtx:1,dynPref:1,dynRelEdPanel:1,dynRelEditor:1,dynamicLoad:1,editAttrLimits:1,editDisplayLayerGlobals:1,editDisplayLayerMembers:1,editRenderLayerAdjustment:1,editRenderLayerGlobals:1,editRenderLayerMembers:1,editor:1,editorTemplate:1,effector:1,emit:1,emitter:1,enableDevice:1,encodeString:1,endString:1,endsWith:1,env:1,equivalent:1,equivalentTol:1,erf:1,error:1,"eval":1,"eval":1,evalDeferred:1,evalEcho:1,event:1,exactWorldBoundingBox:1,exclusiveLightCheckBox:1,exec:1,executeForEachObject:1,exists:1,exp:1,expression:1,expressionEditorListen:1,extendCurve:1,extendSurface:1,extrude:1,fcheck:1,fclose:1,feof:1,fflush:1,fgetline:1,fgetword:1,file:1,fileBrowserDialog:1,fileDialog:1,fileExtension:1,fileInfo:1,filetest:1,filletCurve:1,filter:1,filterCurve:1,filterExpand:1,filterStudioImport:1,findAllIntersections:1,findAnimCurves:1,findKeyframe:1,findMenuItem:1,findRelatedSkinCluster:1,finder:1,firstParentOf:1,fitBspline:1,flexor:1,floatEq:1,floatField:1,floatFieldGrp:1,floatScrollBar:1,floatSlider:1,floatSlider2:1,floatSliderButtonGrp:1,floatSliderGrp:1,floor:1,flow:1,fluidCacheInfo:1,fluidEmitter:1,fluidVoxelInfo:1,flushUndo:1,fmod:1,fontDialog:1,fopen:1,formLayout:1,format:1,fprint:1,frameLayout:1,fread:1,freeFormFillet:1,frewind:1,fromNativePath:1,fwrite:1,gamma:1,gauss:1,geometryConstraint:1,getApplicationVersionAsFloat:1,getAttr:1,getClassification:1,getDefaultBrush:1,getFileList:1,getFluidAttr:1,getInputDeviceRange:1,getMayaPanelTypes:1,getModifiers:1,getPanel:1,getParticleAttr:1,getPluginResource:1,getenv:1,getpid:1,glRender:1,glRenderEditor:1,globalStitch:1,gmatch:1,goal:1,gotoBindPose:1,grabColor:1,gradientControl:1,gradientControlNoAttr:1,graphDollyCtx:1,graphSelectContext:1,graphTrackCtx:1,gravity:1,grid:1,gridLayout:1,group:1,groupObjectsByName:1,HfAddAttractorToAS:1,HfAssignAS:1,HfBuildEqualMap:1,HfBuildFurFiles:1,HfBuildFurImages:1,HfCancelAFR:1,HfConnectASToHF:1,HfCreateAttractor:1,HfDeleteAS:1,HfEditAS:1,HfPerformCreateAS:1,HfRemoveAttractorFromAS:1,HfSelectAttached:1,HfSelectAttractors:1,HfUnAssignAS:1,hardenPointCurve:1,hardware:1,hardwareRenderPanel:1,headsUpDisplay:1,headsUpMessage:1,help:1,helpLine:1,hermite:1,hide:1,hilite:1,hitTest:1,hotBox:1,hotkey:1,hotkeyCheck:1,hsv_to_rgb:1,hudButton:1,hudSlider:1,hudSliderButton:1,hwReflectionMap:1,hwRender:1,hwRenderLoad:1,hyperGraph:1,hyperPanel:1,hyperShade:1,hypot:1,iconTextButton:1,iconTextCheckBox:1,iconTextRadioButton:1,iconTextRadioCollection:1,iconTextScrollList:1,iconTextStaticLabel:1,ikHandle:1,ikHandleCtx:1,ikHandleDisplayScale:1,ikSolver:1,ikSplineHandleCtx:1,ikSystem:1,ikSystemInfo:1,ikfkDisplayMethod:1,illustratorCurves:1,image:1,imfPlugins:1,inheritTransform:1,insertJoint:1,insertJointCtx:1,insertKeyCtx:1,insertKnotCurve:1,insertKnotSurface:1,instance:1,instanceable:1,instancer:1,intField:1,intFieldGrp:1,intScrollBar:1,intSlider:1,intSliderGrp:1,interToUI:1,internalVar:1,intersect:1,iprEngine:1,isAnimCurve:1,isConnected:1,isDirty:1,isParentOf:1,isSameObject:1,isTrue:1,isValidObjectName:1,isValidString:1,isValidUiName:1,isolateSelect:1,itemFilter:1,itemFilterAttr:1,itemFilterRender:1,itemFilterType:1,joint:1,jointCluster:1,jointCtx:1,jointDisplayScale:1,jointLattice:1,keyTangent:1,keyframe:1,keyframeOutliner:1,keyframeRegionCurrentTimeCtx:1,keyframeRegionDirectKeyCtx:1,keyframeRegionDollyCtx:1,keyframeRegionInsertKeyCtx:1,keyframeRegionMoveKeyCtx:1,keyframeRegionScaleKeyCtx:1,keyframeRegionSelectKeyCtx:1,keyframeRegionSetKeyCtx:1,keyframeRegionTrackCtx:1,keyframeStats:1,lassoContext:1,lattice:1,latticeDeformKeyCtx:1,launch:1,launchImageEditor:1,layerButton:1,layeredShaderPort:1,layeredTexturePort:1,layout:1,layoutDialog:1,lightList:1,lightListEditor:1,lightListPanel:1,lightlink:1,lineIntersection:1,linearPrecision:1,linstep:1,listAnimatable:1,listAttr:1,listCameras:1,listConnections:1,listDeviceAttachments:1,listHistory:1,listInputDeviceAxes:1,listInputDeviceButtons:1,listInputDevices:1,listMenuAnnotation:1,listNodeTypes:1,listPanelCategories:1,listRelatives:1,listSets:1,listTransforms:1,listUnselected:1,listerEditor:1,loadFluid:1,loadNewShelf:1,loadPlugin:1,loadPluginLanguageResources:1,loadPrefObjects:1,localizedPanelLabel:1,lockNode:1,loft:1,log:1,longNameOf:1,lookThru:1,ls:1,lsThroughFilter:1,lsType:1,lsUI:1,Mayatomr:1,mag:1,makeIdentity:1,makeLive:1,makePaintable:1,makeRoll:1,makeSingleSurface:1,makeTubeOn:1,makebot:1,manipMoveContext:1,manipMoveLimitsCtx:1,manipOptions:1,manipRotateContext:1,manipRotateLimitsCtx:1,manipScaleContext:1,manipScaleLimitsCtx:1,marker:1,match:1,max:1,memory:1,menu:1,menuBarLayout:1,menuEditor:1,menuItem:1,menuItemToShelf:1,menuSet:1,menuSetPref:1,messageLine:1,min:1,minimizeApp:1,mirrorJoint:1,modelCurrentTimeCtx:1,modelEditor:1,modelPanel:1,mouse:1,movIn:1,movOut:1,move:1,moveIKtoFK:1,moveKeyCtx:1,moveVertexAlongDirection:1,multiProfileBirailSurface:1,mute:1,nParticle:1,nameCommand:1,nameField:1,namespace:1,namespaceInfo:1,newPanelItems:1,newton:1,nodeCast:1,nodeIconButton:1,nodeOutliner:1,nodePreset:1,nodeType:1,noise:1,nonLinear:1,normalConstraint:1,normalize:1,nurbsBoolean:1,nurbsCopyUVSet:1,nurbsCube:1,nurbsEditUV:1,nurbsPlane:1,nurbsSelect:1,nurbsSquare:1,nurbsToPoly:1,nurbsToPolygonsPref:1,nurbsToSubdiv:1,nurbsToSubdivPref:1,nurbsUVSet:1,nurbsViewDirectionVector:1,objExists:1,objectCenter:1,objectLayer:1,objectType:1,objectTypeUI:1,obsoleteProc:1,oceanNurbsPreviewPlane:1,offsetCurve:1,offsetCurveOnSurface:1,offsetSurface:1,openGLExtension:1,openMayaPref:1,optionMenu:1,optionMenuGrp:1,optionVar:1,orbit:1,orbitCtx:1,orientConstraint:1,outlinerEditor:1,outlinerPanel:1,overrideModifier:1,paintEffectsDisplay:1,pairBlend:1,palettePort:1,paneLayout:1,panel:1,panelConfiguration:1,panelHistory:1,paramDimContext:1,paramDimension:1,paramLocator:1,parent:1,parentConstraint:1,particle:1,particleExists:1,particleInstancer:1,particleRenderInfo:1,partition:1,pasteKey:1,pathAnimation:1,pause:1,pclose:1,percent:1,performanceOptions:1,pfxstrokes:1,pickWalk:1,picture:1,pixelMove:1,planarSrf:1,plane:1,play:1,playbackOptions:1,playblast:1,plugAttr:1,plugNode:1,pluginInfo:1,pluginResourceUtil:1,pointConstraint:1,pointCurveConstraint:1,pointLight:1,pointMatrixMult:1,pointOnCurve:1,pointOnSurface:1,pointPosition:1,poleVectorConstraint:1,polyAppend:1,polyAppendFacetCtx:1,polyAppendVertex:1,polyAutoProjection:1,polyAverageNormal:1,polyAverageVertex:1,polyBevel:1,polyBlendColor:1,polyBlindData:1,polyBoolOp:1,polyBridgeEdge:1,polyCacheMonitor:1,polyCheck:1,polyChipOff:1,polyClipboard:1,polyCloseBorder:1,polyCollapseEdge:1,polyCollapseFacet:1,polyColorBlindData:1,polyColorDel:1,polyColorPerVertex:1,polyColorSet:1,polyCompare:1,polyCone:1,polyCopyUV:1,polyCrease:1,polyCreaseCtx:1,polyCreateFacet:1,polyCreateFacetCtx:1,polyCube:1,polyCut:1,polyCutCtx:1,polyCylinder:1,polyCylindricalProjection:1,polyDelEdge:1,polyDelFacet:1,polyDelVertex:1,polyDuplicateAndConnect:1,polyDuplicateEdge:1,polyEditUV:1,polyEditUVShell:1,polyEvaluate:1,polyExtrudeEdge:1,polyExtrudeFacet:1,polyExtrudeVertex:1,polyFlipEdge:1,polyFlipUV:1,polyForceUV:1,polyGeoSampler:1,polyHelix:1,polyInfo:1,polyInstallAction:1,polyLayoutUV:1,polyListComponentConversion:1,polyMapCut:1,polyMapDel:1,polyMapSew:1,polyMapSewMove:1,polyMergeEdge:1,polyMergeEdgeCtx:1,polyMergeFacet:1,polyMergeFacetCtx:1,polyMergeUV:1,polyMergeVertex:1,polyMirrorFace:1,polyMoveEdge:1,polyMoveFacet:1,polyMoveFacetUV:1,polyMoveUV:1,polyMoveVertex:1,polyNormal:1,polyNormalPerVertex:1,polyNormalizeUV:1,polyOptUvs:1,polyOptions:1,polyOutput:1,polyPipe:1,polyPlanarProjection:1,polyPlane:1,polyPlatonicSolid:1,polyPoke:1,polyPrimitive:1,polyPrism:1,polyProjection:1,polyPyramid:1,polyQuad:1,polyQueryBlindData:1,polyReduce:1,polySelect:1,polySelectConstraint:1,polySelectConstraintMonitor:1,polySelectCtx:1,polySelectEditCtx:1,polySeparate:1,polySetToFaceNormal:1,polySewEdge:1,polyShortestPathCtx:1,polySmooth:1,polySoftEdge:1,polySphere:1,polySphericalProjection:1,polySplit:1,polySplitCtx:1,polySplitEdge:1,polySplitRing:1,polySplitVertex:1,polyStraightenUVBorder:1,polySubdivideEdge:1,polySubdivideFacet:1,polyToSubdiv:1,polyTorus:1,polyTransfer:1,polyTriangulate:1,polyUVSet:1,polyUnite:1,polyWedgeFace:1,popen:1,popupMenu:1,pose:1,pow:1,preloadRefEd:1,print:1,progressBar:1,progressWindow:1,projFileViewer:1,projectCurve:1,projectTangent:1,projectionContext:1,projectionManip:1,promptDialog:1,propModCtx:1,propMove:1,psdChannelOutliner:1,psdEditTextureFile:1,psdExport:1,psdTextureFile:1,putenv:1,pwd:1,python:1,querySubdiv:1,quit:1,rad_to_deg:1,radial:1,radioButton:1,radioButtonGrp:1,radioCollection:1,radioMenuItemCollection:1,rampColorPort:1,rand:1,randomizeFollicles:1,randstate:1,rangeControl:1,readTake:1,rebuildCurve:1,rebuildSurface:1,recordAttr:1,recordDevice:1,redo:1,reference:1,referenceEdit:1,referenceQuery:1,refineSubdivSelectionList:1,refresh:1,refreshAE:1,registerPluginResource:1,rehash:1,reloadImage:1,removeJoint:1,removeMultiInstance:1,removePanelCategory:1,rename:1,renameAttr:1,renameSelectionList:1,renameUI:1,render:1,renderGlobalsNode:1,renderInfo:1,renderLayerButton:1,renderLayerParent:1,renderLayerPostProcess:1,renderLayerUnparent:1,renderManip:1,renderPartition:1,renderQualityNode:1,renderSettings:1,renderThumbnailUpdate:1,renderWindowEditor:1,renderWindowSelectContext:1,renderer:1,reorder:1,reorderDeformers:1,requires:1,reroot:1,resampleFluid:1,resetAE:1,resetPfxToPolyCamera:1,resetTool:1,resolutionNode:1,retarget:1,reverseCurve:1,reverseSurface:1,revolve:1,rgb_to_hsv:1,rigidBody:1,rigidSolver:1,roll:1,rollCtx:1,rootOf:1,rot:1,rotate:1,rotationInterpolation:1,roundConstantRadius:1,rowColumnLayout:1,rowLayout:1,runTimeCommand:1,runup:1,sampleImage:1,saveAllShelves:1,saveAttrPreset:1,saveFluid:1,saveImage:1,saveInitialState:1,saveMenu:1,savePrefObjects:1,savePrefs:1,saveShelf:1,saveToolSettings:1,scale:1,scaleBrushBrightness:1,scaleComponents:1,scaleConstraint:1,scaleKey:1,scaleKeyCtx:1,sceneEditor:1,sceneUIReplacement:1,scmh:1,scriptCtx:1,scriptEditorInfo:1,scriptJob:1,scriptNode:1,scriptTable:1,scriptToShelf:1,scriptedPanel:1,scriptedPanelType:1,scrollField:1,scrollLayout:1,sculpt:1,searchPathArray:1,seed:1,selLoadSettings:1,select:1,selectContext:1,selectCurveCV:1,selectKey:1,selectKeyCtx:1,selectKeyframeRegionCtx:1,selectMode:1,selectPref:1,selectPriority:1,selectType:1,selectedNodes:1,selectionConnection:1,separator:1,setAttr:1,setAttrEnumResource:1,setAttrMapping:1,setAttrNiceNameResource:1,setConstraintRestPosition:1,setDefaultShadingGroup:1,setDrivenKeyframe:1,setDynamic:1,setEditCtx:1,setEditor:1,setFluidAttr:1,setFocus:1,setInfinity:1,setInputDeviceMapping:1,setKeyCtx:1,setKeyPath:1,setKeyframe:1,setKeyframeBlendshapeTargetWts:1,setMenuMode:1,setNodeNiceNameResource:1,setNodeTypeFlag:1,setParent:1,setParticleAttr:1,setPfxToPolyCamera:1,setPluginResource:1,setProject:1,setStampDensity:1,setStartupMessage:1,setState:1,setToolTo:1,setUITemplate:1,setXformManip:1,sets:1,shadingConnection:1,shadingGeometryRelCtx:1,shadingLightRelCtx:1,shadingNetworkCompare:1,shadingNode:1,shapeCompare:1,shelfButton:1,shelfLayout:1,shelfTabLayout:1,shellField:1,shortNameOf:1,showHelp:1,showHidden:1,showManipCtx:1,showSelectionInTitle:1,showShadingGroupAttrEditor:1,showWindow:1,sign:1,simplify:1,sin:1,singleProfileBirailSurface:1,size:1,sizeBytes:1,skinCluster:1,skinPercent:1,smoothCurve:1,smoothTangentSurface:1,smoothstep:1,snap2to2:1,snapKey:1,snapMode:1,snapTogetherCtx:1,snapshot:1,soft:1,softMod:1,softModCtx:1,sort:1,sound:1,soundControl:1,source:1,spaceLocator:1,sphere:1,sphrand:1,spotLight:1,spotLightPreviewPort:1,spreadSheetEditor:1,spring:1,sqrt:1,squareSurface:1,srtContext:1,stackTrace:1,startString:1,startsWith:1,stitchAndExplodeShell:1,stitchSurface:1,stitchSurfacePoints:1,strcmp:1,stringArrayCatenate:1,stringArrayContains:1,stringArrayCount:1,stringArrayInsertAtIndex:1,stringArrayIntersector:1,stringArrayRemove:1,stringArrayRemoveAtIndex:1,stringArrayRemoveDuplicates:1,stringArrayRemoveExact:1,stringArrayToString:1,stringToStringArray:1,strip:1,stripPrefixFromName:1,stroke:1,subdAutoProjection:1,subdCleanTopology:1,subdCollapse:1,subdDuplicateAndConnect:1,subdEditUV:1,subdListComponentConversion:1,subdMapCut:1,subdMapSewMove:1,subdMatchTopology:1,subdMirror:1,subdToBlind:1,subdToPoly:1,subdTransferUVsToCache:1,subdiv:1,subdivCrease:1,subdivDisplaySmoothness:1,substitute:1,substituteAllString:1,substituteGeometry:1,substring:1,surface:1,surfaceSampler:1,surfaceShaderList:1,swatchDisplayPort:1,switchTable:1,symbolButton:1,symbolCheckBox:1,sysFile:1,system:1,tabLayout:1,tan:1,tangentConstraint:1,texLatticeDeformContext:1,texManipContext:1,texMoveContext:1,texMoveUVShellContext:1,texRotateContext:1,texScaleContext:1,texSelectContext:1,texSelectShortestPathCtx:1,texSmudgeUVContext:1,texWinToolCtx:1,text:1,textCurves:1,textField:1,textFieldButtonGrp:1,textFieldGrp:1,textManip:1,textScrollList:1,textToShelf:1,textureDisplacePlane:1,textureHairColor:1,texturePlacementContext:1,textureWindow:1,threadCount:1,threePointArcCtx:1,timeControl:1,timePort:1,timerX:1,toNativePath:1,toggle:1,toggleAxis:1,toggleWindowVisibility:1,tokenize:1,tokenizeList:1,tolerance:1,tolower:1,toolButton:1,toolCollection:1,toolDropped:1,toolHasOptions:1,toolPropertyWindow:1,torus:1,toupper:1,trace:1,track:1,trackCtx:1,transferAttributes:1,transformCompare:1,transformLimits:1,translator:1,trim:1,trunc:1,truncateFluidCache:1,truncateHairCache:1,tumble:1,tumbleCtx:1,turbulence:1,twoPointArcCtx:1,uiRes:1,uiTemplate:1,unassignInputDevice:1,undo:1,undoInfo:1,ungroup:1,uniform:1,unit:1,unloadPlugin:1,untangleUV:1,untitledFileName:1,untrim:1,upAxis:1,updateAE:1,userCtx:1,uvLink:1,uvSnapshot:1,validateShelfName:1,vectorize:1,view2dToolCtx:1,viewCamera:1,viewClipPlane:1,viewFit:1,viewHeadOn:1,viewLookAt:1,viewManip:1,viewPlace:1,viewSet:1,visor:1,volumeAxis:1,vortex:1,waitCursor:1,warning:1,webBrowser:1,webBrowserPrefs:1,whatIs:1,window:1,windowPref:1,wire:1,wireContext:1,workspace:1,wrinkle:1,wrinkleContext:1,writeTake:1,xbmLangPathList:1,xform:1},i:"</",c:[hljs.CNM,hljs.ASM,hljs.QSM,{cN:"string",b:"`",e:"`",c:[hljs.BE]},{cN:"variable",b:"\\$\\d",r:5},{cN:"variable",b:"[\\$\\%\\@\\*](\\^\\w\\b|#\\w+|[^\\s\\w{]|{\\w+}|\\w+)"},hljs.CLCM,hljs.CBLCLM]}};hljs.LANGUAGES.dos={cI:true,dM:{k:{flow:{"if":1,"else":1,"goto":1,"for":1,"in":1,"do":1,call:1,exit:1,not:1,exist:1,errorlevel:1,defined:1,equ:1,neq:1,lss:1,leq:1,gtr:1,geq:1},keyword:{shift:1,cd:1,dir:1,echo:1,setlocal:1,endlocal:1,set:1,pause:1,copy:1},stream:{prn:1,nul:1,lpt3:1,lpt2:1,lpt1:1,con:1,com4:1,com3:1,com2:1,com1:1,aux:1},winutils:{ping:1,net:1,ipconfig:1,taskkill:1,xcopy:1,ren:1,del:1}},c:[{cN:"envvar",b:"%[^ ]+?%"},{cN:"number",b:"\\b\\d+",r:0},{cN:"comment",b:"@?rem",e:"$"}]}};hljs.LANGUAGES.apache=function(){var b={cN:"number",b:"[\\$%]\\d+"};var a={cN:"cbracket",b:"[\\$%]\\{",e:"\\}"};a.c=[a,b];return{cI:true,dM:{k:{keyword:{acceptfilter:1,acceptmutex:1,acceptpathinfo:1,accessfilename:1,action:1,addalt:1,addaltbyencoding:1,addaltbytype:1,addcharset:1,adddefaultcharset:1,adddescription:1,addencoding:1,addhandler:1,addicon:1,addiconbyencoding:1,addiconbytype:1,addinputfilter:1,addlanguage:1,addmoduleinfo:1,addoutputfilter:1,addoutputfilterbytype:1,addtype:1,alias:1,aliasmatch:1,allow:1,allowconnect:1,allowencodedslashes:1,allowoverride:1,anonymous:1,anonymous_logemail:1,anonymous_mustgiveemail:1,anonymous_nouserid:1,anonymous_verifyemail:1,authbasicauthoritative:1,authbasicprovider:1,authdbduserpwquery:1,authdbduserrealmquery:1,authdbmgroupfile:1,authdbmtype:1,authdbmuserfile:1,authdefaultauthoritative:1,authdigestalgorithm:1,authdigestdomain:1,authdigestnccheck:1,authdigestnonceformat:1,authdigestnoncelifetime:1,authdigestprovider:1,authdigestqop:1,authdigestshmemsize:1,authgroupfile:1,authldapbinddn:1,authldapbindpassword:1,authldapcharsetconfig:1,authldapcomparednonserver:1,authldapdereferencealiases:1,authldapgroupattribute:1,authldapgroupattributeisdn:1,authldapremoteuserattribute:1,authldapremoteuserisdn:1,authldapurl:1,authname:1,authnprovideralias:1,authtype:1,authuserfile:1,authzdbmauthoritative:1,authzdbmtype:1,authzdefaultauthoritative:1,authzgroupfileauthoritative:1,authzldapauthoritative:1,authzownerauthoritative:1,authzuserauthoritative:1,balancermember:1,browsermatch:1,browsermatchnocase:1,bufferedlogs:1,cachedefaultexpire:1,cachedirlength:1,cachedirlevels:1,cachedisable:1,cacheenable:1,cachefile:1,cacheignorecachecontrol:1,cacheignoreheaders:1,cacheignorenolastmod:1,cacheignorequerystring:1,cachelastmodifiedfactor:1,cachemaxexpire:1,cachemaxfilesize:1,cacheminfilesize:1,cachenegotiateddocs:1,cacheroot:1,cachestorenostore:1,cachestoreprivate:1,cgimapextension:1,charsetdefault:1,charsetoptions:1,charsetsourceenc:1,checkcaseonly:1,checkspelling:1,chrootdir:1,contentdigest:1,cookiedomain:1,cookieexpires:1,cookielog:1,cookiename:1,cookiestyle:1,cookietracking:1,coredumpdirectory:1,customlog:1,dav:1,davdepthinfinity:1,davgenericlockdb:1,davlockdb:1,davmintimeout:1,dbdexptime:1,dbdkeep:1,dbdmax:1,dbdmin:1,dbdparams:1,dbdpersist:1,dbdpreparesql:1,dbdriver:1,defaulticon:1,defaultlanguage:1,defaulttype:1,deflatebuffersize:1,deflatecompressionlevel:1,deflatefilternote:1,deflatememlevel:1,deflatewindowsize:1,deny:1,directoryindex:1,directorymatch:1,directoryslash:1,documentroot:1,dumpioinput:1,dumpiologlevel:1,dumpiooutput:1,enableexceptionhook:1,enablemmap:1,enablesendfile:1,errordocument:1,errorlog:1,example:1,expiresactive:1,expiresbytype:1,expiresdefault:1,extendedstatus:1,extfilterdefine:1,extfilteroptions:1,fileetag:1,filterchain:1,filterdeclare:1,filterprotocol:1,filterprovider:1,filtertrace:1,forcelanguagepriority:1,forcetype:1,forensiclog:1,gracefulshutdowntimeout:1,group:1,header:1,headername:1,hostnamelookups:1,identitycheck:1,identitychecktimeout:1,imapbase:1,imapdefault:1,imapmenu:1,include:1,indexheadinsert:1,indexignore:1,indexoptions:1,indexorderdefault:1,indexstylesheet:1,isapiappendlogtoerrors:1,isapiappendlogtoquery:1,isapicachefile:1,isapifakeasync:1,isapilognotsupported:1,isapireadaheadbuffer:1,keepalive:1,keepalivetimeout:1,languagepriority:1,ldapcacheentries:1,ldapcachettl:1,ldapconnectiontimeout:1,ldapopcacheentries:1,ldapopcachettl:1,ldapsharedcachefile:1,ldapsharedcachesize:1,ldaptrustedclientcert:1,ldaptrustedglobalcert:1,ldaptrustedmode:1,ldapverifyservercert:1,limitinternalrecursion:1,limitrequestbody:1,limitrequestfields:1,limitrequestfieldsize:1,limitrequestline:1,limitxmlrequestbody:1,listen:1,listenbacklog:1,loadfile:1,loadmodule:1,lockfile:1,logformat:1,loglevel:1,maxclients:1,maxkeepaliverequests:1,maxmemfree:1,maxrequestsperchild:1,maxrequestsperthread:1,maxspareservers:1,maxsparethreads:1,maxthreads:1,mcachemaxobjectcount:1,mcachemaxobjectsize:1,mcachemaxstreamingbuffer:1,mcacheminobjectsize:1,mcacheremovalalgorithm:1,mcachesize:1,metadir:1,metafiles:1,metasuffix:1,mimemagicfile:1,minspareservers:1,minsparethreads:1,mmapfile:1,mod_gzip_on:1,mod_gzip_add_header_count:1,mod_gzip_keep_workfiles:1,mod_gzip_dechunk:1,mod_gzip_min_http:1,mod_gzip_minimum_file_size:1,mod_gzip_maximum_file_size:1,mod_gzip_maximum_inmem_size:1,mod_gzip_temp_dir:1,mod_gzip_item_include:1,mod_gzip_item_exclude:1,mod_gzip_command_version:1,mod_gzip_can_negotiate:1,mod_gzip_handle_methods:1,mod_gzip_static_suffix:1,mod_gzip_send_vary:1,mod_gzip_update_static:1,modmimeusepathinfo:1,multiviewsmatch:1,namevirtualhost:1,noproxy:1,nwssltrustedcerts:1,nwsslupgradeable:1,options:1,order:1,passenv:1,pidfile:1,protocolecho:1,proxybadheader:1,proxyblock:1,proxydomain:1,proxyerroroverride:1,proxyftpdircharset:1,proxyiobuffersize:1,proxymaxforwards:1,proxypass:1,proxypassinterpolateenv:1,proxypassmatch:1,proxypassreverse:1,proxypassreversecookiedomain:1,proxypassreversecookiepath:1,proxypreservehost:1,proxyreceivebuffersize:1,proxyremote:1,proxyremotematch:1,proxyrequests:1,proxyset:1,proxystatus:1,proxytimeout:1,proxyvia:1,readmename:1,receivebuffersize:1,redirect:1,redirectmatch:1,redirectpermanent:1,redirecttemp:1,removecharset:1,removeencoding:1,removehandler:1,removeinputfilter:1,removelanguage:1,removeoutputfilter:1,removetype:1,requestheader:1,require:2,rewritebase:1,rewritecond:10,rewriteengine:1,rewritelock:1,rewritelog:1,rewriteloglevel:1,rewritemap:1,rewriteoptions:1,rewriterule:10,rlimitcpu:1,rlimitmem:1,rlimitnproc:1,satisfy:1,scoreboardfile:1,script:1,scriptalias:1,scriptaliasmatch:1,scriptinterpretersource:1,scriptlog:1,scriptlogbuffer:1,scriptloglength:1,scriptsock:1,securelisten:1,seerequesttail:1,sendbuffersize:1,serveradmin:1,serveralias:1,serverlimit:1,servername:1,serverpath:1,serverroot:1,serversignature:1,servertokens:1,setenv:1,setenvif:1,setenvifnocase:1,sethandler:1,setinputfilter:1,setoutputfilter:1,ssienableaccess:1,ssiendtag:1,ssierrormsg:1,ssistarttag:1,ssitimeformat:1,ssiundefinedecho:1,sslcacertificatefile:1,sslcacertificatepath:1,sslcadnrequestfile:1,sslcadnrequestpath:1,sslcarevocationfile:1,sslcarevocationpath:1,sslcertificatechainfile:1,sslcertificatefile:1,sslcertificatekeyfile:1,sslciphersuite:1,sslcryptodevice:1,sslengine:1,sslhonorciperorder:1,sslmutex:1,ssloptions:1,sslpassphrasedialog:1,sslprotocol:1,sslproxycacertificatefile:1,sslproxycacertificatepath:1,sslproxycarevocationfile:1,sslproxycarevocationpath:1,sslproxyciphersuite:1,sslproxyengine:1,sslproxymachinecertificatefile:1,sslproxymachinecertificatepath:1,sslproxyprotocol:1,sslproxyverify:1,sslproxyverifydepth:1,sslrandomseed:1,sslrequire:1,sslrequiressl:1,sslsessioncache:1,sslsessioncachetimeout:1,sslusername:1,sslverifyclient:1,sslverifydepth:1,startservers:1,startthreads:1,substitute:1,suexecusergroup:1,threadlimit:1,threadsperchild:1,threadstacksize:1,timeout:1,traceenable:1,transferlog:1,typesconfig:1,unsetenv:1,usecanonicalname:1,usecanonicalphysicalport:1,user:1,userdir:1,virtualdocumentroot:1,virtualdocumentrootip:1,virtualscriptalias:1,virtualscriptaliasip:1,win32disableacceptex:1,xbithack:1},literal:{on:1,off:1}},c:[hljs.HCM,{cN:"sqbracket",b:"\\s\\[",e:"\\]$"},a,b,{cN:"tag",b:"</?",e:">"},hljs.QSM]}}}();hljs.LANGUAGES.cpp=function(){var b={keyword:{"false":1,"int":1,"float":1,"while":1,"private":1,"char":1,"catch":1,"export":1,virtual:1,operator:2,sizeof:2,dynamic_cast:2,typedef:2,const_cast:2,"const":1,struct:1,"for":1,static_cast:2,union:1,namespace:1,unsigned:1,"long":1,"throw":1,"volatile":2,"static":1,"protected":1,bool:1,template:1,mutable:1,"if":1,"public":1,friend:2,"do":1,"return":1,"goto":1,auto:1,"void":2,"enum":1,"else":1,"break":1,"new":1,extern:1,using:1,"true":1,"class":1,asm:1,"case":1,typeid:1,"short":1,reinterpret_cast:2,"default":1,"double":1,register:1,explicit:1,signed:1,typename:1,"try":1,"this":1,"switch":1,"continue":1,wchar_t:1,inline:1,"delete":1,alignof:1,char16_t:1,char32_t:1,constexpr:1,decltype:1,noexcept:1,nullptr:1,static_assert:1,thread_local:1},built_in:{std:1,string:1,cin:1,cout:1,cerr:1,clog:1,stringstream:1,istringstream:1,ostringstream:1,auto_ptr:1,deque:1,list:1,queue:1,stack:1,vector:1,map:1,set:1,bitset:1,multiset:1,multimap:1,unordered_set:1,unordered_map:1,unordered_multiset:1,unordered_multimap:1,array:1,shared_ptr:1}};var a={cN:"stl_container",b:"\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",e:">",k:b.built_in,r:10};a.c=[a];return{dM:{k:b,i:"</",c:[hljs.CLCM,hljs.CBLCLM,hljs.QSM,{cN:"string",b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"},hljs.CNM,{cN:"preprocessor",b:"#",e:"$"},a]}}}();hljs.LANGUAGES.parser3=function(){var a={b:"{",e:"}"};a.c=[a];return{dM:{sL:"html",c:[{cN:"comment",b:"^#",e:"$"},{cN:"comment",c:[a],b:"\\^rem{",e:"}",r:10},{cN:"preprocessor",b:"^@(?:BASE|USE|CLASS|OPTIONS)$",r:10},{cN:"title",b:"@[\\w\\-]+\\[[\\w^;\\-]*\\](?:\\[[\\w^;\\-]*\\])?(?:.*)$"},{cN:"variable",b:"\\$\\{?[\\w\\-\\.\\:]+\\}?"},{cN:"keyword",b:"\\^[\\w\\-\\.\\:]+"},{cN:"number",b:"\\^#[0-9a-fA-F]+"},hljs.CNM]}}}();hljs.LANGUAGES.go=function(){var a={keyword:{"break":1,"default":1,func:1,"interface":1,select:1,"case":1,map:1,struct:1,chan:1,"else":1,"goto":1,"package":1,"switch":1,"const":1,fallthrough:1,"if":1,range:1,type:1,"continue":1,"for":1,"import":1,"return":1,"var":1,go:1,defer:1},constant:{"true":1,"false":1,iota:1,nil:1},typename:{bool:1,"byte":1,complex64:1,complex128:1,float32:1,float64:1,int8:1,int16:1,int32:1,int64:1,string:1,uint8:1,uint16:1,uint32:1,uint64:1,"int":1,uint:1,uintptr:1},built_in:{append:1,cap:1,close:1,complex:1,copy:1,imag:1,len:1,make:1,"new":1,panic:1,print:1,println:1,real:1,recover:1}};return{dM:{k:a,i:"</",c:[hljs.CLCM,hljs.CBLCLM,hljs.QSM,{cN:"string",b:"'",e:"[^\\\\]'"},{cN:"string",b:"`",e:"[^\\\\]`"},{cN:"number",b:"[^a-zA-Z_0-9](\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?"},hljs.CNM]}}}();//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.1'

!function(root, String){
  'use strict';

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;
  var nativeTrimRight = String.prototype.trimRight;
  var nativeTrimLeft = String.prototype.trimLeft;

  var parseNumber = function(source) { return source * 1 || 0; };

  var strRepeat = function(str, qty){
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
      if (qty & 1) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  var slice = [].slice;

  var defaultToWhiteSpace = function(characters) {
    if (characters == null)
      return '\\s';
    else if (characters.source)
      return characters.source;
    else
      return '[' + _s.escapeRegExp(characters) + ']';
  };

  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  var reversedEscapeChars = {};
  for(var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
  reversedEscapeChars["'"] = '#39';

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          } else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
          }
          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw new Error('[_.sprintf] huh?');
                }
              }
            }
            else {
              throw new Error('[_.sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw new Error('[_.sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();



  // Defining underscore.string

  var _s = {

    VERSION: '2.3.1',

    isBlank: function(str){
      if (str == null) str = '';
      return (/^\s*$/).test(str);
    },

    stripTags: function(str){
      if (str == null) return '';
      return String(str).replace(/<\/?[^>]+>/g, '');
    },

    capitalize : function(str){
      str = str == null ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    chop: function(str, step){
      if (str == null) return [];
      str = String(str);
      step = ~~step;
      return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
    },

    clean: function(str){
      return _s.strip(str).replace(/\s+/g, ' ');
    },

    count: function(str, substr){
      if (str == null || substr == null) return 0;

      str = String(str);
      substr = String(substr);

      var count = 0,
        pos = 0,
        length = substr.length;

      while (true) {
        pos = str.indexOf(substr, pos);
        if (pos === -1) break;
        count++;
        pos += length;
      }

      return count;
    },

    chars: function(str) {
      if (str == null) return [];
      return String(str).split('');
    },

    swapCase: function(str) {
      if (str == null) return '';
      return String(str).replace(/\S/g, function(c){
        return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      });
    },

    escapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
    },

    unescapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      });
    },

    escapeRegExp: function(str){
      if (str == null) return '';
      return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    },

    splice: function(str, i, howmany, substr){
      var arr = _s.chars(str);
      arr.splice(~~i, ~~howmany, substr);
      return arr.join('');
    },

    insert: function(str, i, substr){
      return _s.splice(str, i, 0, substr);
    },

    include: function(str, needle){
      if (needle === '') return true;
      if (str == null) return false;
      return String(str).indexOf(needle) !== -1;
    },

    join: function() {
      var args = slice.call(arguments),
        separator = args.shift();

      if (separator == null) separator = '';

      return args.join(separator);
    },

    lines: function(str) {
      if (str == null) return [];
      return String(str).split("\n");
    },

    reverse: function(str){
      return _s.chars(str).reverse().join('');
    },

    startsWith: function(str, starts){
      if (starts === '') return true;
      if (str == null || starts == null) return false;
      str = String(str); starts = String(starts);
      return str.length >= starts.length && str.slice(0, starts.length) === starts;
    },

    endsWith: function(str, ends){
      if (ends === '') return true;
      if (str == null || ends == null) return false;
      str = String(str); ends = String(ends);
      return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
    },

    succ: function(str){
      if (str == null) return '';
      str = String(str);
      return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length-1) + 1);
    },

    titleize: function(str){
      if (str == null) return '';
      return String(str).replace(/(?:^|\s)\S/g, function(c){ return c.toUpperCase(); });
    },

    camelize: function(str){
      return _s.trim(str).replace(/[-_\s]+(.)?/g, function(match, c){ return c.toUpperCase(); });
    },

    underscored: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },

    dasherize: function(str){
      return _s.trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    classify: function(str){
      return _s.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
    },

    humanize: function(str){
      return _s.capitalize(_s.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
    },

    trim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrim) return nativeTrim.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
    },

    ltrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('^' + characters + '+'), '');
    },

    rtrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp(characters + '+$'), '');
    },

    truncate: function(str, length, truncateStr){
      if (str == null) return '';
      str = String(str); truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice(0, length) + truncateStr : str;
    },

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/rwz
     */
    prune: function(str, length, pruneStr){
      if (str == null) return '';

      str = String(str); length = ~~length;
      pruneStr = pruneStr != null ? String(pruneStr) : '...';

      if (str.length <= length) return str;

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = _s.rtrim(template.slice(0, template.length-1));

      return (template+pruneStr).length > str.length ? str : str.slice(0, template.length)+pruneStr;
    },

    words: function(str, delimiter) {
      if (_s.isBlank(str)) return [];
      return _s.trim(str, delimiter).split(delimiter || /\s+/);
    },

    pad: function(str, length, padStr, type) {
      str = str == null ? '' : String(str);
      length = ~~length;

      var padlen  = 0;

      if (!padStr)
        padStr = ' ';
      else if (padStr.length > 1)
        padStr = padStr.charAt(0);

      switch(type) {
        case 'right':
          padlen = length - str.length;
          return str + strRepeat(padStr, padlen);
        case 'both':
          padlen = length - str.length;
          return strRepeat(padStr, Math.ceil(padlen/2)) + str
                  + strRepeat(padStr, Math.floor(padlen/2));
        default: // 'left'
          padlen = length - str.length;
          return strRepeat(padStr, padlen) + str;
        }
    },

    lpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr);
    },

    rpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'right');
    },

    lrpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'both');
    },

    sprintf: sprintf,

    vsprintf: function(fmt, argv){
      argv.unshift(fmt);
      return sprintf.apply(null, argv);
    },

    toNumber: function(str, decimals) {
      if (!str) return 0;
      str = _s.trim(str);
      if (!str.match(/^-?\d+(?:\.\d+)?$/)) return NaN;
      return parseNumber(parseNumber(str).toFixed(~~decimals));
    },

    numberFormat : function(number, dec, dsep, tsep) {
      if (isNaN(number) || number == null) return '';

      number = number.toFixed(~~dec);
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split('.'), fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';

      return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    },

    strRight: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strRightBack: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.lastIndexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strLeft: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    strLeftBack: function(str, sep){
      if (str == null) return '';
      str += ''; sep = sep != null ? ''+sep : sep;
      var pos = str.lastIndexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    toSentence: function(array, separator, lastSeparator, serial) {
      separator = separator || ', '
      lastSeparator = lastSeparator || ' and '
      var a = array.slice(), lastMember = a.pop();

      if (array.length > 2 && serial) lastSeparator = _s.rtrim(separator) + lastSeparator;

      return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
    },

    toSentenceSerial: function() {
      var args = slice.call(arguments);
      args[3] = true;
      return _s.toSentence.apply(_s, args);
    },

    slugify: function(str) {
      if (str == null) return '';

      var from  = "ąàáäâãåæćęèéëêìíïîłńòóöôõøùúüûñçżź",
          to    = "aaaaaaaaceeeeeiiiilnoooooouuuunczz",
          regex = new RegExp(defaultToWhiteSpace(from), 'g');

      str = String(str).toLowerCase().replace(regex, function(c){
        var index = from.indexOf(c);
        return to.charAt(index) || '-';
      });

      return _s.dasherize(str.replace(/[^\w\s-]/g, ''));
    },

    surround: function(str, wrapper) {
      return [wrapper, str, wrapper].join('');
    },

    quote: function(str) {
      return _s.surround(str, '"');
    },

    exports: function() {
      var result = {};

      for (var prop in this) {
        if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse)$/)) continue;
        result[prop] = this[prop];
      }

      return result;
    },

    repeat: function(str, qty, separator){
      if (str == null) return '';

      qty = ~~qty;

      // using faster implementation if separator is not needed;
      if (separator == null) return strRepeat(String(str), qty);

      // this one is about 300x slower in Google Chrome
      for (var repeat = []; qty > 0; repeat[--qty] = str) {}
      return repeat.join(separator);
    },

    levenshtein: function(str1, str2) {
      if (str1 == null && str2 == null) return 0;
      if (str1 == null) return String(str2).length;
      if (str2 == null) return String(str1).length;

      str1 = String(str1); str2 = String(str2);

      var current = [], prev, value;

      for (var i = 0; i <= str2.length; i++)
        for (var j = 0; j <= str1.length; j++) {
          if (i && j)
            if (str1.charAt(j - 1) === str2.charAt(i - 1))
              value = prev;
            else
              value = Math.min(current[j], current[j - 1], prev) + 1;
          else
            value = i + j;

          prev = current[j];
          current[j] = value;
        }

      return current.pop();
    }
  };

  // Aliases

  _s.strip    = _s.trim;
  _s.lstrip   = _s.ltrim;
  _s.rstrip   = _s.rtrim;
  _s.center   = _s.lrpad;
  _s.rjust    = _s.lpad;
  _s.ljust    = _s.rpad;
  _s.contains = _s.include;
  _s.q        = _s.quote;

  // Exporting

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _s;

    exports._s = _s;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.string', [], function(){ return _s; });


  // Integrate with Underscore.js if defined
  // or create our own underscore object.
  root._ = root._ || {};
  root._.string = root._.str = _s;
}(this, String);
// showtty.js - a building block for viewing tty animations
// Copyright 2008 Jack Christopher Kastorff
//
// Changes:
// ========          
// Mon Aug  8 13:59:40 CEST 2011 Coder of Salvation: added callback in showTTYURL
// Mon Aug  8 14:33:01 CEST 2011 Coder of Salvation: added callback in showTTY 
// Mon Aug  8 14:33:01 CEST 2011 Coder of Salvation: added 'instance' property in holder obj (to enable play/pause)
// Mon Aug  8 14:33:01 CEST 2011 Coder of Salvation: moved wild variables clut & t to top of file
// Mon Aug  8 14:33:01 CEST 2011 Coder of Salvation: added keyframes array  to holder object
// Mon Aug  8 13:59:40 CEST 2011 Coder of Salvation: ttyplayer now has unique id, and accesible by global 'window' object
//                                                                                                   access it by: var ttyplay = window[ "showtty_"+ yourelement_id_name ]
//
(function(){

console.log("Begin!")

var clut = { 0: "#000", 1: "#D00", 2: "#0D0", 3: "#DD0", 4: "#00D", 5: "#D0D", 6: "#0DD", 7: "#DDD" };
var t = 0;
var playing = false;

var repeatString = function (str, rep) {
    var outstr = '';
    for (var i = 0; i < rep; i++) {
        outstr += str;
    }
    return outstr;
};

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
        row.style.height = '1.3em';
        for (var i = 1; i <= width; i++) {
            var charelem = document.createElement("pre");
            charelem.style.backgroundColor = '#000';
            charelem.style.color = '#FFF';
            charelem.style.display = 'inline';
            charelem.style.fontWeight = 'normal';
            charelem.style.fontSize = '12px';
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

var setTextChunk = function (tb, r, index, stx) {
    for (var i = 0; i < r.length; i++) {
      var c = r.charAt(i);
      tb.arr[index][i+stx].firstChild.replaceData(0, 1, c );
    }
};

var setBoldChunk = function (tb, r, index, stx) {
    for (var i = 0; i < r.length; i++) {
        tb.arr[index][i+stx].style.fontWeight = r.charAt(i) == 0 ? 'normal' : 'bold';
    }
};

var setUnderlineChunk = function (tb, r, index, stx) {
    for (var i = 0; i < r.length; i++) {
        tb.arr[index][i+stx].style.textDecoration = r.charAt(i) == 0 ? 'none' : 'underline';
    }
};

var setFcolorChunk = function (tb, r, index, stx) {
    for (var i = 0; i < r.length; i++) {
        tb.arr[index][i+stx].style.color = clut[r.charAt(i)];
    }
};

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
}

stop = function( holder ){
  playing = false;
    clearTimeout( holder.idTimeout );
}

play = function( holder ){
  playing = true;
    // we re-initialize the timeadd-value so all the framerelated calculations are correct again
  holder.timeadd   = (new Date).getTime()/1000-holder.timeline[holder.nextframe].t;
    animateNextFrame( holder );
}

animateNextFrame = function (holder) { with (holder) {
    var fr = timeline[nextframe];
    if ( fr.i ) {
        loadIFrame(table, rowcaches, fr, width, height);
    } else {
        loadPFrame(table, rowcaches, fr, width, height);
    }
    handleCursor(table, rowcaches.b, curpos, fr.x, fr.y);
    nextframe++;
    if ( ( timeline.length > nextframe ) && playing ) {
        var wait = timeadd + timeline[nextframe].t - (new Date).getTime()/1000;
        if ( wait < 0 ) {
            // we're out of date! try to catch up.
            return animateNextFrame(holder);
        } else {
            holder.idTimeout = setTimeout(function(){animateNextFrame(holder);}, wait*750);
        }
    }
}};

var makeCache = function (ch, wid, hei) {
    var c = [];
    for (var y = 0; y < hei; y++) {
        c.push( repeatString(ch, wid) );
    }
    return c;
};

/** 
 * scrubTTY - scrubs back/forward to the nearest keyframe 
 */ 
scrubTTY = function( frame, holder ){
    var keyframe = false;
    for( var i = 0; i < holder.keyframes.length ;i++ ){
        if( holder.keyframes[i] > frame && i != holder.keyframes.length-1 ){
            keyframe = holder.keyframes[i];
          break;
        }
  }
    if( !keyframe ) console.log("no keyframe data within acceptable range found");
  else holder.instance.nextframe = keyframe;
}

resetTTY   = function(holder){
  holder.time      = 0;
  holder.nextframe = 0;
  holder.curpos    = [1,1];
  holder.timeadd   = (new Date).getTime()/1000-holder.timeline[0].t;
}
showTTY = function (elem, data, onLoadCallBack ) {
    while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
    }
    
    var width = data.width;
    var height = data.height;
    var timeline = data.timeline;
        var keyframes = [];

    // *FIXME* possible attempt to retrieve keyframes 
    // the idea was to search for y==1 occurences, but 
    // this does definately not assure a total redraw 
    // possible solution: find 'total redraw' (key)frames
        for( var i = 0; i < data.timeline.length ;i++ )
            if( data.timeline[i].y == 1 ) keyframes.push( i );

    var table = makeTable(width, height);
    elem.appendChild(table.elem);

    var holder = {
                'instance': this,
        'width': width,
        'height': height,
        'timeline': timeline,
                'keyframes': keyframes,
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
        'timeadd': (new Date).getTime()/1000-timeline[0].t,
      };
    resetTTY( holder ); // just to be sure 
      var uid = "showtty_"+elem.id;
    window[uid] = holder;
        if( onLoadCallBack ) onLoadCallBack( true );
    play(holder);
}

showTTYURL = function (elem, url, onLoadCallBack) {
    var showText = function (text) {
        while ( elem.firstChild ) {
            elem.removeChild( elem.firstChild );
        }
        elem.appendChild( document.createTextNode( text ) );
    };

    showText("Loading terminal session..");// + url);

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
                        if( onLoadCallBack ) onLoadCallBack( true );
            showTTY(elem, data);
        } else if ( req.readyState == 4 && req.status != 200 ) {
                        if( onLoadCallBack ) onLoadCallBack( false );
            showText("Error: couldn't retrieve " + url + ", got status code " + this.status);
            req = null;
        }
    };
    req.send(null);
}

}());
/** 
 * File:        playterm.js 
 * Author:      Leon van Kammen | The Coder of Salvation <info@leon.vankammen.eu>
 * Date:        Thu Aug 18 12:56:32 2011
 *
 * player frontend
 * 
 * Changelog:
 *
 *  [Thu Aug 18 12:56:32 2011] 
 *      refactored online version to standalone version
 *
 * @todo description
 *  - get scrubbing to work (this is hard since terminalcharacters are not 'videoframes')
 *  - get bigger viewing modes like 120x35 stable & working
 *
 * Usage example: 
 * <code>  
 *   // some code
 * </code>
 *
 * @package PLAYTERM
 * @version 1.0.1
 * @copyright 2011 Coder of Salvation
 * @author Coder of Salvation, sqz <info@leon.vankammen.eu>
 * @license PLAYTERM-WALLIX-001
 *
%license%
 */

(function(){

  var tracelevel = 3;
  function ___trace(msg, alert ){ if( tracelevel > 1 ) _trace(msg, alert ); }
  function  __trace(msg, alert ){ if( tracelevel > 1 ) _trace(msg, alert ); }
  function   _trace(msg, alert ){
    if (window && window.location.hash != undefined && window.location.hash != "#debug") return;
    if( tracelevel && alert ) window.alert(msg);
    if( tracelevel && window.console != undefined ) console.log(msg);
    return msg;
  }

  function _assert( expr, msg, alert ){
    if( !expr ) _trace( msg, alert );
    return expr;
  }

  var playterm_player = window.playterm_player = {
    
    //******** the recording data
    data: eval( {"width":"80","height":"24","timeline":[{"d":[["r","leon@dev:/tmp/xdebug$                                                           "],["a"," "],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"x":23,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":1,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337588.00801,"i":1},{"y":1,"d":[[0,22,"h"]],"x":24,"t":1330337588.5411},{"y":1,"d":[[0,23,"i"]],"x":25,"t":1330337588.57557},{"y":1,"d":[[0,24,"!"]],"x":26,"t":1330337588.87967},{"y":1,"d":[[0,24," "]],"x":25,"t":1330337589.39171},{"y":1,"d":[[0,23," "]],"x":24,"t":1330337589.54368},{"y":1,"d":[[0,22," "]],"x":23,"t":1330337589.70823},{"y":1,"d":[[0,22,"p"]],"x":24,"t":1330337590.13204},{"y":1,"d":[[0,23,"h"]],"x":25,"t":1330337590.2529},{"y":1,"d":[[0,24,"p"]],"x":26,"t":1330337590.35298},{"y":1,"x":27,"t":1330337590.41693},{"y":1,"d":[[0,26,"d"]],"x":28,"t":1330337590.56083},{"y":1,"d":[[0,27,"e"]],"x":29,"t":1330337590.72087},{"y":1,"d":[[0,28,"v"]],"x":30,"t":1330337590.87238},{"y":1,"d":[[0,29,"e"]],"x":31,"t":1330337590.93694},{"y":1,"d":[[0,30,"l"]],"x":32,"t":1330337590.97276},{"y":1,"d":[[0,31,"o"]],"x":33,"t":1330337591.18496},{"y":1,"d":[[0,32,"p"]],"x":34,"t":1330337591.24497},{"y":1,"d":[[0,33,"i"]],"x":35,"t":1330337591.44513},{"y":1,"d":[[0,34,"n"]],"x":36,"t":1330337591.72122},{"y":1,"d":[[0,35,"g"]],"x":38,"t":1330337591.74501},{"y":1,"d":[[0,37,"i"]],"x":39,"t":1330337591.91691},{"y":1,"d":[[0,38,"s"]],"x":40,"t":1330337592.04497},{"y":1,"x":41,"t":1330337592.11719},{"y":1,"d":[[0,40,"f"]],"x":42,"t":1330337592.25734},{"y":1,"d":[[0,41,"u"]],"x":43,"t":1330337592.32105},{"y":1,"d":[[0,42,"n"]],"x":44,"t":1330337592.39303},{"y":1,"d":[[0,43,"!"]],"x":45,"t":1330337592.64532},{"y":1,"d":[[0,44,45,"^C"]],"x":47,"t":1330337593.38661},{"y":2,"d":[[1,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337593.38696},{"y":2,"d":[[1,22,"p"]],"x":24,"t":1330337594.25677},{"y":2,"d":[[1,23,"h"]],"x":25,"t":1330337594.39306},{"y":2,"d":[[1,24,"p"]],"x":26,"t":1330337594.58553},{"y":2,"x":27,"t":1330337595.29801},{"y":2,"d":[[1,26,"b"]],"x":28,"t":1330337595.49798},{"y":2,"d":[[1,27,"u"]],"x":29,"t":1330337595.57812},{"y":2,"d":[[1,28,"g"]],"x":30,"t":1330337595.6301},{"y":2,"d":[[1,29,"s"]],"x":31,"t":1330337595.73834},{"y":2,"x":32,"t":1330337595.8303},{"y":2,"d":[[1,31,"i"]],"x":33,"t":1330337595.97451},{"y":2,"d":[[1,32,"f"]],"x":34,"t":1330337596.0905},{"y":2,"x":35,"t":1330337596.17057},{"y":2,"d":[[1,34,"n"]],"x":36,"t":1330337596.38681},{"y":2,"d":[[1,35,"o"]],"x":37,"t":1330337596.3906},{"y":2,"d":[[1,36,"t"]],"x":38,"t":1330337596.4945},{"y":2,"x":39,"t":1330337596.56675},{"y":2,"d":[[1,38,"f"]],"x":40,"t":1330337596.7948},{"y":2,"d":[[1,39,"u"]],"x":41,"t":1330337596.85453},{"y":2,"d":[[1,40,"n"]],"x":42,"t":1330337596.91882},{"y":2,"d":[[1,41,"!"]],"x":43,"t":1330337597.17899},{"y":2,"d":[[1,42,43,"^C"]],"x":45,"t":1330337597.74332},{"y":3,"d":[[2,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337597.74363},{"y":3,"d":[[2,22,"p"]],"x":24,"t":1330337598.54382},{"y":3,"d":[[2,23,"h"]],"x":25,"t":1330337598.63963},{"y":3,"d":[[2,24,"p"]],"x":26,"t":1330337598.73149},{"y":3,"x":27,"t":1330337598.82773},{"y":3,"d":[[2,26,"x"]],"x":28,"t":1330337598.96853},{"y":3,"d":[[2,27,"d"]],"x":29,"t":1330337599.13864},{"y":3,"d":[[2,28,"e"]],"x":30,"t":1330337599.87617},{"y":3,"d":[[2,29,"b"]],"x":31,"t":1330337600.04791},{"y":3,"d":[[2,30,"u"]],"x":32,"t":1330337600.33203},{"y":3,"d":[[2,31,"g"]],"x":33,"t":1330337600.33366},{"y":3,"x":34,"t":1330337600.59186},{"y":3,"d":[[2,33,"i"]],"x":35,"t":1330337600.5919},{"y":3,"d":[[2,34,"s"]],"x":36,"t":1330337600.71632},{"y":3,"x":37,"t":1330337600.80502},{"y":3,"d":[[2,36,"a"]],"x":38,"t":1330337601.94929},{"y":3,"x":39,"t":1330337602.0574},{"y":3,"d":[[2,38,"f"]],"x":40,"t":1330337602.16136},{"y":3,"d":[[2,39,"u"]],"x":41,"t":1330337602.27323},{"y":3,"d":[[2,40,"n"]],"x":42,"t":1330337602.39722},{"y":3,"x":43,"t":1330337602.4251},{"y":3,"d":[[2,42,"m"]],"x":44,"t":1330337602.62923},{"y":3,"d":[[2,43,"o"]],"x":45,"t":1330337602.70925},{"y":3,"d":[[2,44,"d"]],"x":46,"t":1330337602.80128},{"y":3,"d":[[2,45,"u"]],"x":47,"t":1330337602.9934},{"y":3,"d":[[2,46,"l"]],"x":48,"t":1330337603.04506},{"y":3,"d":[[2,47,"e"]],"x":49,"t":1330337603.2219},{"y":3,"x":50,"t":1330337603.96222},{"y":3,"d":[[2,49,"f"]],"x":51,"t":1330337604.0739},{"y":3,"d":[[2,50,"o"]],"x":52,"t":1330337604.16988},{"y":3,"d":[[2,51,"r"]],"x":53,"t":1330337604.25409},{"y":3,"x":54,"t":1330337604.3221},{"y":3,"d":[[2,53,"p"]],"x":55,"t":1330337604.43402},{"y":3,"d":[[2,54,"h"]],"x":56,"t":1330337604.52193},{"y":3,"d":[[2,55,"p"]],"x":57,"t":1330337604.61808},{"y":3,"d":[[2,56,"!"]],"x":58,"t":1330337604.84626},{"y":3,"d":[[2,57,58,"^C"]],"x":60,"t":1330337605.34255},{"y":4,"d":[[3,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337605.34404},{"y":4,"d":[[3,22,"h"]],"x":24,"t":1330337605.95588},{"y":4,"d":[[3,23,"o"]],"x":25,"t":1330337606.00766},{"y":4,"d":[[3,24,"w"]],"x":26,"t":1330337606.07161},{"y":4,"d":[[3,25,"e"]],"x":27,"t":1330337606.23675},{"y":4,"d":[[3,26,"v"]],"x":28,"t":1330337606.33237},{"y":4,"d":[[3,27,"e"]],"x":29,"t":1330337606.4974},{"y":4,"d":[[3,28,"r"]],"x":30,"t":1330337606.50923},{"y":4,"d":[[3,29,"."]],"x":31,"t":1330337606.60913},{"y":4,"d":[[3,30,"."]],"x":32,"t":1330337606.78118},{"y":4,"d":[[3,31,"o"]],"x":33,"t":1330337606.96553},{"y":4,"d":[[3,32,"n"]],"x":34,"t":1330337607.04511},{"d":[["r","leon@dev:/tmp/xdebug$ php developing is fun!^C                                  "],["r","leon@dev:/tmp/xdebug$ php bugs if not fun!^C                                    "],["r","leon@dev:/tmp/xdebug$ php xdebug is a fun module for php!^C                     "],["r","leon@dev:/tmp/xdebug$ however..on                                               "],["a"," "],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"x":35,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":4,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337607.11317,"i":1},{"y":4,"d":[[3,34,"t"]],"x":36,"t":1330337607.43855},{"y":4,"d":[[3,35,36,"he"]],"x":39,"t":1330337607.4387},{"y":4,"d":[[3,38,"c"]],"x":40,"t":1330337607.57404},{"y":4,"d":[[3,39,"m"]],"x":41,"t":1330337607.91898},{"y":4,"d":[[3,40,"d"]],"x":42,"t":1330337608.01874},{"y":4,"d":[[3,41,"l"]],"x":43,"t":1330337608.19479},{"y":4,"d":[[3,42,"i"]],"x":44,"t":1330337608.27461},{"y":4,"d":[[3,43,"n"]],"x":45,"t":1330337608.35073},{"y":4,"d":[[3,44,"e"]],"x":46,"t":1330337608.41492},{"y":4,"d":[[3,45,"."]],"x":47,"t":1330337608.58256},{"y":4,"d":[[3,46,"."]],"x":48,"t":1330337608.73858},{"y":4,"d":[[3,47,"t"]],"x":49,"t":1330337608.85478},{"y":4,"d":[[3,48,"h"]],"x":50,"t":1330337608.97895},{"y":4,"d":[[3,49,"e"]],"x":51,"t":1330337609.03085},{"y":4,"d":[[3,50,"r"]],"x":52,"t":1330337609.09923},{"y":4,"d":[[3,51,"e"]],"x":53,"t":1330337609.22707},{"y":4,"d":[[3,52,"'"]],"x":54,"t":1330337609.4711},{"y":4,"d":[[3,53,"s"]],"x":55,"t":1330337609.55896},{"y":4,"x":56,"t":1330337609.76368},{"y":4,"d":[[3,55,"a"]],"x":57,"t":1330337610.15175},{"y":4,"x":58,"t":1330337610.31589},{"y":4,"d":[[3,57,"g"]],"x":59,"t":1330337610.44787},{"y":4,"d":[[3,58,"r"]],"x":60,"t":1330337610.53161},{"y":4,"d":[[3,59,"e"]],"x":61,"t":1330337610.57579},{"y":4,"d":[[3,60,"a"]],"x":62,"t":1330337610.74082},{"y":4,"d":[[3,61,"t"]],"x":63,"t":1330337610.86352},{"y":4,"x":64,"t":1330337610.92359},{"y":4,"d":[[3,63,"u"]],"x":65,"t":1330337611.04764},{"y":4,"d":[[3,64,"t"]],"x":66,"t":1330337611.50545},{"y":4,"d":[[3,65,"i"]],"x":67,"t":1330337611.56533},{"y":4,"d":[[3,66,"l"]],"x":68,"t":1330337611.68923},{"y":4,"d":[[3,67,"i"]],"x":69,"t":1330337611.76509},{"y":4,"d":[[3,68,"t"]],"x":70,"t":1330337611.85324},{"y":4,"d":[[3,69,"y"]],"x":71,"t":1330337611.96515},{"y":4,"d":[[3,70,71,"^C"]],"x":73,"t":1330337612.23803},{"y":5,"d":[[4,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337612.23835},{"y":5,"d":[[4,22,"c"]],"x":24,"t":1330337612.45392},{"y":5,"d":[[4,23,"a"]],"x":25,"t":1330337612.57028},{"y":5,"d":[[4,24,"l"]],"x":26,"t":1330337612.6821},{"y":5,"d":[[4,25,"l"]],"x":27,"t":1330337612.83044},{"y":5,"d":[[4,26,"e"]],"x":28,"t":1330337612.89856},{"y":5,"d":[[4,27,"d"]],"x":29,"t":1330337613.05437},{"y":5,"x":30,"t":1330337613.18646},{"y":5,"d":[[4,29,"'"]],"x":31,"t":1330337613.78681},{"y":5,"d":[[4,30,"x"]],"x":32,"t":1330337614.01504},{"y":5,"d":[[4,31,"d"]],"x":33,"t":1330337614.17542},{"y":5,"d":[[4,32,"e"]],"x":34,"t":1330337614.3281},{"y":5,"d":[[4,33,"b"]],"x":35,"t":1330337614.38411},{"y":5,"d":[[4,34,"u"]],"x":36,"t":1330337614.46797},{"y":5,"d":[[4,35,"g"]],"x":37,"t":1330337614.55588},{"y":5,"d":[[4,36,"'"]],"x":38,"t":1330337614.6881},{"y":5,"x":39,"t":1330337614.77602},{"y":5,"d":[[4,38,"!"]],"x":40,"t":1330337615.47394},{"y":5,"d":[[4,39,40,"^C"]],"x":42,"t":1330337616.29879},{"y":6,"d":[[5,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337616.2991},{"y":6,"d":[[5,22,"*"]],"x":24,"t":1330337617.36799},{"y":6,"d":[[5,23,"D"]],"x":25,"t":1330337617.54134},{"y":6,"d":[[5,24,"I"]],"x":26,"t":1330337617.65995},{"y":6,"d":[[5,25,"S"]],"x":27,"t":1330337617.74939},{"y":6,"d":[[5,26,"C"]],"x":28,"t":1330337617.86556},{"y":6,"d":[[5,27,"A"]],"x":29,"t":1330337618.0933},{"y":6,"d":[[5,27," "]],"x":28,"t":1330337618.70253},{"y":6,"d":[[5,27,"L"]],"x":29,"t":1330337618.96441},{"y":6,"d":[[5,28,"A"]],"x":30,"t":1330337619.0845},{"y":6,"d":[[5,29,"I"]],"x":31,"t":1330337619.21751},{"y":6,"d":[[5,30,"M"]],"x":32,"t":1330337619.43086},{"y":6,"d":[[5,31,"E"]],"x":33,"t":1330337619.5148},{"y":6,"d":[[5,32,"R"]],"x":34,"t":1330337619.59484},{"y":6,"d":[[5,33,"*"]],"x":35,"t":1330337619.85479},{"y":6,"x":36,"t":1330337620.0312},{"y":6,"d":[[5,35,"I"]],"x":37,"t":1330337620.33902},{"y":6,"x":38,"t":1330337620.41481},{"y":6,"d":[[5,37,"m"]],"x":39,"t":1330337620.61539},{"y":6,"d":[[5,38,39,"na"]],"x":41,"t":1330337620.66337},{"y":6,"d":[[5,40,"d"]],"x":42,"t":1330337620.73534},{"y":6,"d":[[5,40," "]],"x":41,"t":1330337621.16344},{"y":6,"d":[[5,39," "]],"x":40,"t":1330337621.30741},{"y":6,"d":[[5,38," "]],"x":39,"t":1330337621.46723},{"y":6,"d":[[5,38,"a"]],"x":40,"t":1330337621.55949},{"y":6,"d":[[5,39,"d"]],"x":41,"t":1330337621.65942},{"y":6,"d":[[5,40,"e"]],"x":42,"t":1330337621.72744},{"y":6,"x":43,"t":1330337621.88338},{"y":6,"d":[[5,42,"t"]],"x":44,"t":1330337621.95136},{"y":6,"d":[[5,43,"h"]],"x":45,"t":1330337622.03575},{"y":6,"d":[[5,44,"i"]],"x":46,"t":1330337622.09974},{"y":6,"d":[[5,45,"s"]],"x":47,"t":1330337622.19567},{"y":6,"x":48,"t":1330337622.26771},{"y":6,"d":[[5,47,"u"]],"x":49,"t":1330337623.47615},{"y":6,"d":[[5,48,"t"]],"x":50,"t":1330337623.56425},{"y":6,"d":[[5,49,"i"]],"x":51,"t":1330337623.67228},{"y":6,"d":[[5,50,"l"]],"x":52,"t":1330337623.76836},{"y":6,"d":[[5,51,"i"]],"x":53,"t":1330337623.85245},{"y":6,"d":[[5,52,"t"]],"x":54,"t":1330337623.94144},{"y":6,"d":[[5,53,"y"]],"x":55,"t":1330337624.07647},{"y":6,"x":56,"t":1330337624.15759},{"y":6,"d":[[5,55,":"]],"x":57,"t":1330337624.43776},{"y":6,"d":[[5,56,")"]],"x":58,"t":1330337624.67791},{"y":7,"d":[[5,57,58,"^C"],[6,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337624.95027},{"y":7,"d":[[6,22,"o"]],"x":24,"t":1330337625.51029},{"d":[["r","leon@dev:/tmp/xdebug$ php developing is fun!^C                                  "],["r","leon@dev:/tmp/xdebug$ php bugs if not fun!^C                                    "],["r","leon@dev:/tmp/xdebug$ php xdebug is a fun module for php!^C                     "],["r","leon@dev:/tmp/xdebug$ however..on the cmdline..there's a great utility^C        "],["r","leon@dev:/tmp/xdebug$ called 'xdebug' !^C                                       "],["r","leon@dev:/tmp/xdebug$ *DISCLAIMER* I made this utility :)^C                     "],["r","leon@dev:/tmp/xdebug$ ok                                                        "],["a"," "],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"x":25,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":7,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337625.56617,"i":1},{"y":7,"d":[[6,24,"."]],"x":26,"t":1330337625.76638},{"y":7,"d":[[6,25,"."]],"x":27,"t":1330337625.91015},{"y":8,"d":[[6,26,27,"^C"],[7,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337626.78778},{"y":8,"d":[[7,22,"c"]],"x":24,"t":1330337627.98162},{"y":8,"d":[[7,23,"h"]],"x":25,"t":1330337628.06567},{"y":8,"d":[[7,24,"e"]],"x":26,"t":1330337628.12998},{"y":8,"d":[[7,25,"c"]],"x":27,"t":1330337628.23812},{"y":8,"d":[[7,26,"k"]],"x":28,"t":1330337628.25006},{"y":8,"x":29,"t":1330337628.31001},{"y":8,"d":[[7,28,"t"]],"x":30,"t":1330337628.47428},{"y":8,"d":[[7,29,"h"]],"x":31,"t":1330337628.53798},{"y":8,"d":[[7,30,"i"]],"x":32,"t":1330337628.58987},{"y":8,"d":[[7,31,"s"]],"x":33,"t":1330337628.67394},{"y":8,"x":34,"t":1330337628.77424},{"y":8,"d":[[7,33,"o"]],"x":35,"t":1330337628.94212},{"y":8,"d":[[7,34,"u"]],"x":36,"t":1330337629.01386},{"y":8,"d":[[7,35,"t"]],"x":37,"t":1330337629.07806},{"y":8,"d":[[7,36,"."]],"x":38,"t":1330337629.23449},{"y":8,"d":[[7,37,"."]],"x":39,"t":1330337629.32213},{"y":8,"d":[[7,38,"w"]],"x":40,"t":1330337629.45401},{"y":8,"d":[[7,39,"e"]],"x":41,"t":1330337629.52601},{"y":8,"x":42,"t":1330337629.60589},{"y":8,"d":[[7,41,"h"]],"x":43,"t":1330337629.89424},{"y":8,"d":[[7,42,"a"]],"x":44,"t":1330337629.95022},{"y":8,"d":[[7,43,"v"]],"x":45,"t":1330337630.06618},{"y":8,"d":[[7,44,"e"]],"x":46,"t":1330337630.13822},{"y":8,"x":47,"t":1330337630.21501},{"y":8,"d":[[7,46,"s"]],"x":48,"t":1330337630.45552},{"y":8,"d":[[7,47,"o"]],"x":49,"t":1330337630.50729},{"y":8,"d":[[7,48,"m"]],"x":50,"t":1330337630.55949},{"y":8,"d":[[7,49,"e"]],"x":51,"t":1330337630.63552},{"y":8,"x":52,"t":1330337630.73942},{"y":8,"d":[[7,51,"p"]],"x":53,"t":1330337630.8915},{"y":8,"d":[[7,52,"h"]],"x":54,"t":1330337630.96339},{"y":8,"d":[[7,53,"p"]],"x":55,"t":1330337631.06798},{"y":8,"x":56,"t":1330337631.16801},{"y":8,"d":[[7,55,"c"]],"x":57,"t":1330337631.29593},{"y":8,"d":[[7,56,"o"]],"x":58,"t":1330337631.40831},{"y":8,"d":[[7,57,"d"]],"x":59,"t":1330337631.50796},{"y":8,"d":[[7,58,"e"]],"x":60,"t":1330337631.61649},{"y":8,"d":[[7,59,60,"^C"]],"x":62,"t":1330337631.98858},{"y":9,"d":[[8,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337631.98988},{"y":9,"d":[[8,22,"v"]],"x":24,"t":1330337632.24882},{"y":9,"d":[[8,23,"i"]],"x":25,"t":1330337632.32842},{"y":9,"x":26,"t":1330337632.38443},{"y":9,"d":[[8,25,"t"]],"x":27,"t":1330337632.5325},{"y":9,"d":[[8,26,"e"]],"x":28,"t":1330337632.58038},{"y":9,"d":[[8,27,32,"st.php"]],"x":35,"t":1330337633.04775},{"y":10,"x":1,"t":1330337633.52191},{"y":24,"x":1,"t":1330337633.57379},{"y":24,"x":1,"t":1330337633.582},{"y":24,"d":[["cp",9,0],["cp",0,1],["cp",0,2],["cp",0,3],["cp",0,4],["cp",0,5],["cp",0,6],["cp",0,7],["cp",0,8],[23,0,9,"\"test.php\""]],"x":11,"t":1330337633.67292},{"y":7,"b":[[22,["a","4"]]],"d":[[0,0,1,"<?"],[2,0,79,"+--  9 lines: class flap{-------------------------------------------------------"],[4,0,79,"+--  5 lines: class flop{-------------------------------------------------------"],[6,0,79,"+--  8 lines: $f = new flop();--------------------------------------------------"],[8,0,1,"?>"],[9,0,"~"],["cp",9,10],["cp",9,11],["cp",9,12],["cp",9,13],["cp",9,14],["cp",9,15],["cp",9,16],["cp",9,17],["cp",9,18],["cp",9,19],["cp",9,20],["cp",9,21],[22,0,64,"/tmp/xdebug/test.php [unix][036][24][0019,0001][67%][ mapping 1 ]"],[23,11,20,"28L, 265Cc"]],"x":1,"f":[[0,0,1,["a","6"]],["cp",0,8],[9,["a","4"]],["cp",9,10],["cp",9,11],["cp",9,12],["cp",9,13],["cp",9,14],["cp",9,15],["cp",9,16],["cp",9,17],["cp",9,18],["cp",9,19],["cp",9,20],["cp",9,21]],"B":[[0,0,1,["a","1"]],[2,["a","1"]],["cp",2,4],["cp",2,6],["cp",0,8],["cp",2,9],["cp",2,10],["cp",2,11],["cp",2,12],["cp",2,13],["cp",2,14],["cp",2,15],["cp",2,16],["cp",2,17],["cp",2,18],["cp",2,19],["cp",2,20],["cp",2,21],["cp",2,22]],"t":1330337633.70523},{"y":7,"b":[[6,0,59,["a","4"]]],"d":[[6,1,59,"q436f+q6b75+q6b64+q6b72+q6b6c+q2332+q2334+q2569+q2a37+q6b31"]],"x":61,"t":1330337634.04375},{"y":6,"d":[[22,29,34,"00][00"],[22,40,"8"],[22,49,"4"]],"x":1,"t":1330337634.38826},{"y":5,"d":[[22,29,34,"99][63"],[22,40,"3"],[22,48,49,"46"]],"x":1,"t":1330337634.53638},{"y":4,"d":[[22,29,34,"00][00"],[22,40,"2"],[22,49,"2"]],"x":1,"t":1330337634.69625},{"y":3,"d":[[22,29,34,"99][63"],[22,39,40,"03"],[22,48,49,"10"]],"x":1,"t":1330337634.85588},{"y":2,"d":[[22,29,34,"00][00"],[22,40,"2"],[22,48,64,"7%][ mapping 1 ] "]],"x":1,"t":1330337635.02419},{"y":3,"d":[[22,29,34,"99][63"],[22,40,"3"],[22,48,64,"10%][ mapping 1 ]"]],"x":1,"t":1330337635.30514},{"y":3,"b":[["cp",0,6]],"d":[[2,0,79,"class flap{                                                                     "],[4,0,79,"  public $f;                                                                    "],[6,0,79,"  function foo(){                                                               "],[7,4,19,"print(\"flip\\n\");"],[8,0,19,"    $this->f->foo();"],[9,0,2,"  }"],[10,0,"}"],["cp",1,11],[12,0,79,"+--  5 lines: class flop{-------------------------------------------------------"],["cp",1,13],[14,0,79,"+--  8 lines: $f = new flop();--------------------------------------------------"],["cp",1,15],[16,0,1,"?>"],[22,28,34,"108][6C"],[22,45,"2"]],"x":2,"f":[[2,0,4,["a","6"]],[2,10,"6"],[4,2,7,["a","6"]],[6,14,16,["a","6"]],[7,9,"6"],[7,15,18,"6676"],[8,0,1,["a","7"]],[8,9,18,"6676677766"],[9,0,79,"77677777777777777777777777777777777777777777777777777777777777777777777777777777"],[10,0,79,"67777777777777777777777777777777777777777777777777777777777777777777777777777777"],["cp",1,11],["cp",1,12],["cp",1,13],["cp",1,14],["cp",1,15],["cp",0,16]],"B":[[2,5,79,"000001000000000000000000000000000000000000000000000000000000000000000000000"],[4,0,1,["a","0"]],[4,8,79,["a","0"]],[6,0,1,["a","0"]],[6,10,79,"0000111000000000000000000000000000000000000000000000000000000000000000"],[7,4,18,"111111011111101"],[8,0,1,["a","0"]],[8,9,18,"1101100011"],[9,0,79,"00100000000000000000000000000000000000000000000000000000000000000000000000000000"],[10,1,79,["a","0"]],["cp",1,11],["cp",1,13],["cp",1,15],["cp",0,16]],"t":1330337635.8041},{"y":4,"d":[[22,28,34,"000][00"],[22,40,"4"],[22,45,49,"1][14"]],"x":1,"t":1330337636.57931},{"y":5,"d":[[22,29,33,"32][2"],[22,40,"5"],[22,45,49,"2][17"]],"x":2,"t":1330337637.05543},{"y":6,"d":[[22,29,33,"00][0"],[22,40,"6"],[22,45,49,"1][21"]],"x":1,"t":1330337637.10738},{"y":7,"d":[[22,29,33,"32][2"],[22,40,"7"],[22,45,49,"2][25"]],"x":2,"t":1330337637.15924},{"y":8,"d":[[22,40,"8"],[22,49,"8"]],"x":2,"t":1330337637.20717},{"y":9,"d":[[22,40,"9"],[22,48,49,"32"]],"x":2,"t":1330337637.25516},{"y":10,"d":[[22,39,40,"10"],[22,49,"5"]],"x":2,"t":1330337637.30719},{"y":11,"b":[[2,10,"6"],[10,0,"6"]],"d":[[22,28,34,"125][7D"],[22,40,"1"],[22,45,49,"1][39"]],"x":1,"t":1330337638.07577},{"y":12,"b":[["cp",0,2],["cp",0,10]],"d":[[22,28,34,"000][00"],[22,40,"2"],[22,48,49,"42"]],"x":1,"t":1330337639.17365},{"y":13,"d":[[22,28,34,"108][6C"],[22,40,"3"],[22,49,"6"]],"x":1,"t":1330337639.27141},{"y":13,"d":[[12,0,79,"class flop{                                                                     "],["cp",6,13],[14,0,79,"    print(\"flop\\n\");                                                            "],["cp",9,15],["cp",10,16],["cp",1,17],[18,0,79,"+--  8 lines: $f = new flop();--------------------------------------------------"],["cp",1,19],[20,0,1,"?>"],[22,28,34,"097][61"],[22,45,"3"]],"x":3,"f":[["cp",2,12],["cp",6,13],["cp",7,14],["cp",9,15],["cp",10,16],["cp",1,17],["cp",1,18],["cp",1,19],["cp",0,20]],"B":[["cp",2,12],["cp",6,13],["cp",7,14],["cp",9,15],["cp",10,16],["cp",1,17],["cp",1,19],["cp",0,20]],"t":1330337639.8192},{"y":14,"d":[[22,28,34,"102][66"],[22,40,"4"],[22,48,49,"50"]],"x":3,"t":1330337640.15303},{"y":15,"d":[[22,28,34,"032][20"],[22,40,"5"],[22,49,"3"]],"x":3,"t":1330337640.42102},{"y":16,"b":[[13,16,"6"],[15,2,"6"]],"d":[[22,28,34,"125][7D"],[22,40,"6"],[22,49,"7"]],"x":3,"t":1330337640.6059},{"y":17,"b":[[12,10,"6"],["cp",0,13],["cp",0,15],[16,0,"6"]],"d":[[22,40,"7"],[22,45,49,"1][60"]],"x":1,"t":1330337640.77398},{"y":17,"x":1,"t":1330337641.11116},{"y":17,"d":[[22,28,34,"000][00"],[22,45,"2"],[23,0,20,"-- INSERT --         "]],"x":2,"B":[[23,0,11,["a","1"]]],"t":1330337641.11147},{"y":23,"d":[["cp",1,18],[19,0,79,"+--  8 lines: $f = new flop();--------------------------------------------------"],["cp",1,20],[22,22,67,"+][unix][000][00][0018,0001][62%][ mapping 1 ]"]],"x":69,"f":[["cp",1,20]],"B":[["cp",1,18],["cp",21,19],["cp",1,20]],"t":1330337641.24679},{"y":18,"b":[["cp",0,12],["cp",0,16]],"x":1,"t":1330337641.2505},{"y":19,"d":[["cp",1,19],[20,0,79,"+--  8 lines: $f = new flop();--------------------------------------------------"]],"x":1,"B":[["cp",1,19],["cp",21,20]],"t":1330337641.42237},{"y":19,"d":[[22,43,"9"],[22,52,"3"]],"x":1,"t":1330337641.42308},{"y":19,"d":[[18,0,"j"],[22,48,"2"]],"x":2,"t":1330337641.79112},{"y":19,"d":[[18,1,"u"],[22,48,"3"]],"x":3,"t":1330337641.95869},{"y":19,"d":[[18,2,"s"],[22,48,"4"]],"x":4,"t":1330337641.99478},{"y":19,"d":[[18,3,"t"],[22,48,"5"]],"x":5,"t":1330337642.08271},{"y":19,"d":[[22,48,"6"]],"x":6,"t":1330337642.131},{"y":19,"d":[[18,5,"s"],[22,48,"7"]],"x":7,"t":1330337642.25605},{"y":19,"d":[[18,6,"o"],[22,48,"8"]],"x":8,"t":1330337642.48839},{"y":19,"d":[[18,7,"m"],[22,48,"9"]],"x":9,"t":1330337642.52074},{"y":19,"d":[[18,8,"e"],[22,47,48,"10"]],"x":10,"t":1330337642.61736},{"y":19,"d":[[22,48,"1"]],"x":11,"t":1330337642.76128},{"y":19,"d":[[18,10,"s"],[22,48,"2"]],"x":12,"t":1330337642.8573},{"y":19,"d":[[18,11,"i"]],"x":13,"t":1330337642.92968},{"y":19,"d":[[22,48,"3"]],"x":13,"t":1330337642.93799},{"y":19,"d":[[18,12,"m"],[22,48,"4"]],"x":14,"t":1330337642.98911},{"y":19,"d":[[18,13,"p"],[22,48,"5"]],"x":15,"t":1330337643.12125},{"y":19,"d":[[18,14,"l"],[22,48,"6"]],"x":16,"t":1330337643.18536},{"y":19,"d":[[18,15,"e"],[22,48,"7"]],"x":17,"t":1330337643.2655},{"d":[["r","<?                                                                              "],["a"," "],["r","class flap{                                                                     "],["a"," "],["r","  public $f;                                                                    "],["a"," "],["r","  function foo(){                                                               "],["r","    print(\"flip\\n\");                                                            "],["r","    $this->f->foo();                                                            "],["r","  }                                                                             "],["r","}                                                                               "],["a"," "],["r","class flop{                                                                     "],["r","  function foo(){                                                               "],["r","    print(\"flop\\n\");                                                            "],["r","  }                                                                             "],["r","}                                                                               "],["a"," "],["r","just some simple                                                                "],["a"," "],["r","+--  8 lines: $f = new flop();--------------------------------------------------"],["r","~                                                                               "],["r","/tmp/xdebug/test.php [+][unix][000][00][0019,0018][63%][ mapping 1 ]            "],["r","-- INSERT --                                                                    "]],"x":18,"B":[["r","11000000000000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],["r","11111000001000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],["r","00111111000000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],["r","00111111110000111000000000000000000000000000000000000000000000000000000000000000"],["r","00001111110111111010000000000000000000000000000000000000000000000000000000000000"],["r","00000000011011000110000000000000000000000000000000000000000000000000000000000000"],["r","00100000000000000000000000000000000000000000000000000000000000000000000000000000"],["r","10000000000000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],["r","11111000001000000000000000000000000000000000000000000000000000000000000000000000"],["r","00111111110000111000000000000000000000000000000000000000000000000000000000000000"],["r","00001111110111111010000000000000000000000000000000000000000000000000000000000000"],["r","00100000000000000000000000000000000000000000000000000000000000000000000000000000"],["r","10000000000000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],"d","d",["a","1"],"d","d",["r","11111111111100000000000000000000000000000000000000000000000000000000000000000000"]],"y":19,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d",["a","4"],["a","0"]],"f":[["r","66777777777777777777777777777777777777777777777777777777777777777777777777777777"],["a","7"],["r","66666777776777777777777777777777777777777777777777777777777777777777777777777777"],["a","7"],["r","77666666777777777777777777777777777777777777777777777777777777777777777777777777"],["a","7"],["r","77777777777777666777777777777777777777777777777777777777777777777777777777777777"],["r","77777777767777766767777777777777777777777777777777777777777777777777777777777777"],["r","77777777766766777667777777777777777777777777777777777777777777777777777777777777"],["r","77677777777777777777777777777777777777777777777777777777777777777777777777777777"],["r","67777777777777777777777777777777777777777777777777777777777777777777777777777777"],["a","7"],["r","66666777776777777777777777777777777777777777777777777777777777777777777777777777"],["r","77777777777777666777777777777777777777777777777777777777777777777777777777777777"],["r","77777777767777766767777777777777777777777777777777777777777777777777777777777777"],["r","77677777777777777777777777777777777777777777777777777777777777777777777777777777"],["r","67777777777777777777777777777777777777777777777777777777777777777777777777777777"],["a","7"],"d","d","d",["a","4"],["a","7"],"d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337643.36129,"i":1},{"y":19,"d":[[18,17,"c"],[22,48,"9"]],"x":19,"t":1330337643.4814},{"y":19,"d":[[18,18,"l"]],"x":20,"t":1330337643.6015},{"y":19,"b":[[19,16,31,["a","7"]]],"d":[[19,17,21,"class"],[23,3,42,"Keyword completion (^N^P) The only match"]],"x":20,"f":[[19,16,31,["a","0"]]],"B":[[23,12,42,["a","1"]]],"t":1330337643.60562},{"y":20,"b":[["cp",0,19]],"d":[[18,19,"a"],["cp",1,19]],"x":17,"f":[["cp",1,19]],"t":1330337643.69622},{"y":19,"b":[[19,16,31,["a","7"]]],"d":[[19,17,21,"class"],[22,47,48,"20"]],"x":21,"f":[[19,16,31,["a","0"]]],"t":1330337643.69637},{"y":20,"b":[["cp",0,19]],"d":[[18,20,"s"],["cp",1,19]],"x":17,"f":[["cp",1,19]],"t":1330337643.85206},{"y":19,"b":[[19,16,31,["a","7"]]],"d":[[19,17,21,"class"],[22,48,"1"]],"x":22,"f":[[19,16,31,["a","0"]]],"t":1330337643.85224},{"y":20,"b":[["cp",0,19]],"d":[[18,21,"s"],["cp",1,19]],"x":17,"f":[[18,17,21,["a","6"]],["cp",1,19]],"B":[[18,17,21,["a","1"]]],"t":1330337643.96028},{"y":19,"b":[[19,16,31,["a","7"]]],"d":[[19,17,21,"class"],[22,48,"2"]],"x":23,"f":[[19,16,31,["a","0"]]],"t":1330337643.96049},{"y":20,"b":[["cp",0,19]],"d":[[18,22,"e"],["cp",1,19]],"x":17,"f":[["cp",1,18],["cp",1,19]],"B":[["cp",1,18]],"t":1330337644.06412},{"y":19,"d":[[22,48,"4"]],"x":24,"t":1330337644.06792},{"y":19,"d":[[18,23,"s"]],"x":25,"t":1330337644.17288},{"y":19,"d":[[22,48,"5"],[23,3,42,"INSERT --                               "]],"x":25,"B":[[23,12,42,["a","0"]]],"t":1330337644.18146},{"y":19,"d":[[18,24,"."],[22,48,"6"]],"x":26,"t":1330337644.32556},{"y":19,"d":[[18,25,"."],[22,48,"7"]],"x":27,"t":1330337644.47767},{"y":19,"d":[[18,26,"."],[22,48,"8"]],"x":28,"t":1330337644.61358},{"y":19,"d":[[18,27,"a"],[22,48,"9"]],"x":29,"t":1330337644.98322},{"y":19,"d":[[18,28,"n"]],"x":30,"t":1330337645.06327},{"y":19,"d":[[22,47,48,"30"]],"x":30,"t":1330337645.07157},{"y":19,"d":[[18,29,"d"],[22,48,"1"]],"x":31,"t":1330337645.14303},{"y":19,"d":[[22,48,"2"]],"x":32,"t":1330337645.24706},{"y":19,"d":[[18,31,"o"],[22,48,"3"]],"x":33,"t":1330337645.48004},{"y":19,"d":[[18,32,33,"ms"],[22,48,"5"]],"x":35,"t":1330337645.50408},{"y":19,"d":[[18,34,"e"],[22,48,"6"]],"x":36,"t":1330337645.85626},{"y":19,"d":[[22,48,"7"]],"x":37,"t":1330337645.88802},{"y":19,"x":37,"t":1330337646.20437},{"y":19,"d":[[22,48,"6"]],"x":36,"t":1330337646.21285},{"y":19,"d":[[18,34," "]],"x":35,"t":1330337646.33613},{"y":19,"d":[[22,48,"5"]],"x":35,"t":1330337646.34453},{"y":19,"d":[[18,33," "]],"x":34,"t":1330337646.50019},{"y":19,"d":[[22,48,"4"]],"x":34,"t":1330337646.50856},{"y":19,"d":[[18,32," "],[22,48,"3"]],"x":33,"t":1330337646.65199},{"y":19,"d":[[18,31," "],[22,48,"2"]],"x":32,"t":1330337646.81229},{"y":19,"d":[[18,31,"s"],[22,48,"3"]],"x":33,"t":1330337646.92806},{"y":19,"d":[[18,32,"o"]],"x":34,"t":1330337647.04841},{"y":19,"b":[[19,30,45,["a","7"]]],"d":[[18,33,"m"],[19,31,34,"some"],[22,48,"4"],[23,3,42,"Keyword completion (^N^P) The only match"]],"x":35,"f":[[19,30,45,["a","0"]]],"B":[[23,12,42,["a","1"]]],"t":1330337647.08314},{"y":20,"b":[["cp",0,19]],"d":[[18,34,"e"],["cp",1,19]],"x":31,"f":[["cp",1,19]],"t":1330337647.16699},{"y":19,"b":[[19,30,45,["a","7"]]],"d":[[19,31,34,"some"],[22,48,"5"]],"x":36,"f":[[19,30,45,["a","0"]]],"t":1330337647.1858},{"y":19,"x":36,"t":1330337647.26291},{"y":19,"b":[["cp",0,19]],"d":[["cp",1,19],[22,48,"7"],[23,3,42,"INSERT --                               "]],"x":37,"f":[["cp",1,19]],"B":[[23,12,42,["a","0"]]],"t":1330337647.271},{"y":19,"d":[[18,36,"m"],[22,48,"8"]],"x":38,"t":1330337647.62085},{"y":19,"d":[[18,37,"a"]],"x":39,"t":1330337647.6724},{"y":19,"d":[[22,48,"9"]],"x":39,"t":1330337647.68094},{"y":19,"d":[[18,38,"i"],[22,47,48,"40"]],"x":40,"t":1330337647.80089},{"y":19,"d":[[18,39,"n"],[22,48,"1"]],"x":41,"t":1330337647.86091},{"y":19,"d":[[18,40,"c"],[22,48,"2"]],"x":42,"t":1330337647.96486},{"y":19,"d":[[18,41,"o"],[22,48,"3"]],"x":43,"t":1330337648.08091},{"y":19,"d":[[18,42,"d"],[22,48,"4"]],"x":44,"t":1330337648.15647},{"y":19,"d":[[18,43,"e"],[22,48,"5"]],"x":45,"t":1330337648.30104},{"y":19,"d":[["cp",1,23]],"x":44,"B":[["cp",1,23]],"t":1330337648.63241},{"y":19,"x":44,"t":1330337648.98456},{"y":19,"d":[[22,31,37,"101][65"],[22,48,"4"]],"x":44,"t":1330337648.9898},{"y":19,"d":[["cp",1,18],["cp",20,19],["cp",21,20],[21,0,1,"?>"],[22,31,37,"000][00"],[22,47,52,"01][65"]],"x":1,"f":[["cp",21,20],["cp",0,21]],"B":[["cp",20,19],["cp",0,21]],"t":1330337649.12161},{"y":19,"x":1,"t":1330337649.1228},{"y":19,"d":[["cp",19,18],["cp",20,19],["cp",21,20],["cp",19,21],[22,32,37,"36][24"],[22,52,"7"]],"x":1,"f":[["cp",20,19],["cp",0,20],["cp",19,21]],"B":[["cp",19,18],["cp",0,20],["cp",18,21]],"t":1330337649.59348},{"y":19,"x":1,"t":1330337649.59466},{"y":19,"d":[[18,0,79,"$f = new flop();                                                                "],[19,0,15,"$a = new flap();"],[20,0,10,"$a->f = $f;"],["cp",1,21],[22,31,37,"102][66"],[22,48,"2"]],"x":2,"f":[[18,13,14,["a","6"]],[19,0,15,"7777777777777667"],[20,0,3,"7766"],["cp",1,21]],"B":[[18,0,79,"00000111000001100000000000000000000000000000000000000000000000000000000000000000"],[19,0,15,"0000011100000110"],[20,0,3,"0011"],["cp",1,21]],"t":1330337650.00515},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",0,2],["cp",4,3],["cp",0,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",0,10],["cp",12,11],["cp",5,12],["cp",14,13],["cp",8,14],["cp",9,15],["cp",0,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",0,20],[21,0,28,"for( $i = 0; $i < 10; $i++ ){"],[22,31,37,"097][61"],[22,42,43,"20"],[22,51,52,"71"]],"x":2,"f":[["cp",1,0],["cp",2,1],["cp",0,2],["cp",4,3],["cp",0,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",0,10],["cp",1,11],["cp",5,12],["cp",6,13],["cp",8,14],["cp",9,15],["cp",0,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",0,20],[21,3,"6"],[21,27,28,["a","6"]]],"B":[["cp",1,0],["cp",2,1],["cp",0,2],["cp",4,3],["cp",0,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",0,10],["cp",1,11],["cp",5,12],["cp",6,13],["cp",8,14],["cp",9,15],["cp",0,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",0,20],[21,3,"1"],[21,10,"1"],[21,18,19,["a","1"]],[21,27,28,["a","1"]]],"t":1330337650.6498},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",1,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",1,9],["cp",11,10],["cp",4,11],["cp",13,12],["cp",7,13],["cp",8,14],["cp",1,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",1,19],["cp",21,20],[21,0,28,"  $f->foo();                 "],[22,43,"1"],[22,52,"5"]],"x":2,"f":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",1,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",1,9],["cp",0,10],["cp",4,11],["cp",5,12],["cp",7,13],["cp",8,14],["cp",1,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",1,19],["cp",21,20],[21,3,10,"76677766"],[21,27,28,["a","7"]]],"B":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",1,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",1,9],["cp",0,10],["cp",4,11],["cp",5,12],["cp",7,13],["cp",8,14],["cp",1,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",1,19],["cp",21,20],[21,3,9,"0110001"],[21,18,19,["a","0"]],[21,27,28,["a","0"]]],"t":1330337650.80152},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",0,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",0,8],["cp",10,9],["cp",3,10],["cp",12,11],["cp",6,12],["cp",7,13],["cp",0,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",0,18],["cp",20,19],["cp",21,20],[21,3,"a"],[22,32,37,"00][00"],[22,43,"2"],[22,48,52,"1][78"]],"x":1,"f":[["cp",1,0],["cp",2,1],["cp",0,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",0,8],["cp",10,9],["cp",3,10],["cp",4,11],["cp",6,12],["cp",7,13],["cp",0,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",0,18],["cp",20,19],["cp",21,20]],"B":[["cp",1,0],["cp",2,1],["cp",0,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",0,8],["cp",10,9],["cp",3,10],["cp",4,11],["cp",6,12],["cp",7,13],["cp",0,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",0,18],["cp",20,19],["cp",21,20]],"t":1330337650.95726},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",1,7],["cp",9,8],["cp",2,9],["cp",11,10],["cp",5,11],["cp",6,12],["cp",1,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",1,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",6,21],[22,31,37,"111][6F"],[22,43,"3"],[22,48,52,"2][82"]],"x":2,"f":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",1,7],["cp",9,8],["cp",2,9],["cp",3,10],["cp",5,11],["cp",6,12],["cp",1,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",1,17],["cp",19,18],["cp",20,19],["cp",6,21]],"B":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",1,7],["cp",9,8],["cp",2,9],["cp",3,10],["cp",5,11],["cp",6,12],["cp",1,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",1,17],["cp",19,18],["cp",20,19],["cp",6,21]],"t":1330337651.12113},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",0,6],["cp",8,7],["cp",1,8],["cp",10,9],["cp",4,10],["cp",5,11],["cp",0,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",0,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",5,20],["cp",0,21],[22,31,37,"032][20"],[22,43,"4"],[22,52,"5"]],"x":2,"f":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",0,6],["cp",8,7],["cp",1,8],["cp",2,9],["cp",4,10],["cp",5,11],["cp",0,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",0,16],["cp",18,17],["cp",19,18],["cp",5,20],["cp",0,21]],"B":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",0,6],["cp",8,7],["cp",1,8],["cp",2,9],["cp",4,10],["cp",5,11],["cp",0,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",0,16],["cp",18,17],["cp",19,18],["cp",5,20],["cp",0,21]],"t":1330337651.29714},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",0,7],["cp",9,8],["cp",3,9],["cp",4,10],["cp",5,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",5,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",4,19],["cp",5,20],[21,0,1,"?>"],[22,43,"5"],[22,52,"9"]],"x":2,"f":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",0,7],["cp",1,8],["cp",3,9],["cp",4,10],["cp",5,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",5,15],["cp",17,16],["cp",18,17],["cp",4,19],["cp",5,20],[21,0,1,["a","6"]]],"B":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",0,7],["cp",1,8],["cp",3,9],["cp",4,10],["cp",5,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",5,15],["cp",17,16],["cp",18,17],["cp",4,19],["cp",5,20],[21,0,1,["a","1"]]],"t":1330337651.48108},{"y":20,"b":[[16,28,"6"],[19,0,"6"]],"d":[[22,31,37,"125][7D"],[22,43,"6"],[22,48,52,"1][92"]],"x":1,"t":1330337651.64714},{"y":21,"b":[["cp",0,16],["cp",0,19]],"d":[[22,31,37,"000][00"],[22,43,"7"],[22,52,"6"]],"x":1,"t":1330337651.90605},{"y":24,"d":[[23,0,":"]],"x":2,"t":1330337652.90113},{"y":24,"x":2,"t":1330337652.9013},{"y":24,"d":[[23,1,"w"]],"x":2,"t":1330337653.02195},{"y":24,"d":[[23,2,"q"]],"x":4,"t":1330337653.10591},{"y":24,"x":1,"t":1330337653.23005},{"y":24,"b":[["cp",22,21],["cp",0,22]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",2,8],["cp",3,9],["cp",4,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",4,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",3,18],["cp",4,19],["cp",21,20],["cp",22,21],[22,0,67,"\"test.php\" 28L, 265C written                                        "],[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"f":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",0,7],["cp",2,8],["cp",3,9],["cp",4,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",4,14],["cp",16,15],["cp",17,16],["cp",3,18],["cp",4,19],["cp",21,20],["cp",4,21]],"B":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",0,7],["cp",2,8],["cp",3,9],["cp",4,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",4,14],["cp",16,15],["cp",17,16],["cp",3,18],["cp",4,19],["cp",21,20],["cp",22,21],["cp",4,22]],"t":1330337653.24357},{"y":24,"d":[[23,22,"n"]],"x":24,"t":1330337653.69853},{"y":24,"d":[[23,23,"o"]],"x":25,"t":1330337653.75484},{"y":24,"d":[[23,24,"t"]],"x":26,"t":1330337653.83515},{"y":24,"x":27,"t":1330337654.00734},{"y":24,"d":[[23,26,"v"]],"x":28,"t":1330337654.40347},{"y":24,"d":[[23,27,29,"ery"]],"x":31,"t":1330337654.43175},{"y":24,"x":32,"t":1330337654.49149},{"y":24,"d":[[23,31,"e"]],"x":33,"t":1330337654.9761},{"y":24,"d":[[23,32,"x"]],"x":34,"t":1330337655.17599},{"y":24,"d":[[23,33,"c"]],"x":35,"t":1330337655.43251},{"y":24,"d":[[23,34,"i"]],"x":36,"t":1330337655.58467},{"y":24,"d":[[23,35,"t"]],"x":37,"t":1330337655.93325},{"y":24,"d":[[23,36,38,"ing"]],"x":40,"t":1330337655.96207},{"y":24,"d":[[23,39,"."]],"x":41,"t":1330337656.09786},{"y":24,"d":[[23,40,"."]],"x":42,"t":1330337656.24213},{"y":24,"d":[[23,41,42,"^C"]],"x":44,"t":1330337657.23021},{"y":24,"b":[["cp",21,20],["cp",0,21]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",1,7],["cp",2,8],["cp",3,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",3,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",2,17],["cp",3,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,22,42,["a"," "]]],"x":23,"f":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",1,7],["cp",2,8],["cp",3,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",3,13],["cp",15,14],["cp",16,15],["cp",2,17],["cp",3,18],["cp",20,19],["cp",3,20]],"B":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",1,7],["cp",2,8],["cp",3,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",3,13],["cp",15,14],["cp",16,15],["cp",2,17],["cp",3,18],["cp",20,19],["cp",21,20],["cp",3,21]],"t":1330337657.23077},{"y":24,"d":[[23,22,"p"]],"x":24,"t":1330337657.68275},{"y":24,"d":[[23,23,"h"]],"x":25,"t":1330337657.79057},{"y":24,"d":[[23,24,"p"]],"x":26,"t":1330337657.88256},{"y":24,"x":27,"t":1330337657.93457},{"y":24,"d":[[23,26,"t"]],"x":28,"t":1330337658.15071},{"y":24,"d":[[23,27,"e"]],"x":29,"t":1330337658.22267},{"y":24,"d":[[23,28,33,"st.php"]],"x":36,"t":1330337658.43492},{"y":24,"b":[["cp",20,19],["cp",0,20]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",0,6],["cp",1,7],["cp",2,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",2,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",1,16],["cp",2,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],["cp",2,23]],"x":1,"f":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",0,6],["cp",1,7],["cp",2,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",2,12],["cp",14,13],["cp",15,14],["cp",1,16],["cp",2,17],["cp",19,18],["cp",2,19]],"B":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",0,6],["cp",1,7],["cp",2,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",2,12],["cp",14,13],["cp",15,14],["cp",1,16],["cp",2,17],["cp",19,18],["cp",20,19],["cp",2,20]],"t":1330337658.84683},{"y":24,"b":[["cp",0,19]],"d":[[0,0,3,"flip"],[1,0,3,"flop"],["cp",1,2],["cp",0,3],["cp",1,4],["cp",1,5],["cp",0,6],["cp",1,7],["cp",1,8],["cp",0,9],["cp",1,10],["cp",1,11],["cp",0,12],["cp",1,13],["cp",1,14],["cp",0,15],["cp",1,16],["cp",1,17],["cp",0,18],["cp",1,19],["cp",1,20],["cp",0,21],["cp",1,22],[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"f":[["cp",2,0],["cp",0,1],["cp",0,3],["cp",0,4],["cp",0,5],["cp",0,6],["cp",0,7],["cp",0,9],["cp",0,10],["cp",0,11],["cp",0,13],["cp",0,14],["cp",0,15],["cp",0,16],["cp",0,18]],"B":[["cp",2,0],["cp",0,1],["cp",0,3],["cp",0,4],["cp",0,5],["cp",0,6],["cp",0,7],["cp",0,9],["cp",0,10],["cp",0,11],["cp",0,13],["cp",0,14],["cp",0,15],["cp",0,16],["cp",0,18],["cp",0,19]],"t":1330337658.89286},{"y":24,"d":[[23,22,"a"]],"x":24,"t":1330337660.07099},{"y":24,"d":[[23,23,"n"]],"x":25,"t":1330337660.23105},{"d":[["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],["r","leon@dev:/tmp/xdebug$ and                                                       "]],"x":26,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337660.327,"i":1},{"y":24,"x":27,"t":1330337660.49922},{"y":24,"d":[[23,26,"i"]],"x":28,"t":1330337660.5433},{"y":24,"d":[[23,27,"t"]],"x":29,"t":1330337660.62763},{"y":24,"x":30,"t":1330337660.72362},{"y":24,"d":[[23,29,"w"]],"x":31,"t":1330337660.87179},{"y":24,"d":[[23,30,"o"]],"x":32,"t":1330337660.93601},{"y":24,"d":[[23,31,"r"]],"x":33,"t":1330337661.29185},{"y":24,"d":[[23,32,33,"ks"]],"x":35,"t":1330337661.29216},{"y":24,"d":[[23,34,"."]],"x":36,"t":1330337661.36544},{"y":24,"d":[[23,35,"."]],"x":37,"t":1330337661.50527},{"y":24,"d":[[23,36,37,"^C"]],"x":39,"t":1330337661.95115},{"y":24,"d":[["cp",1,0],["cp",3,2],["cp",0,3],["cp",2,5],["cp",0,6],["cp",2,8],["cp",0,9],["cp",2,11],["cp",0,12],["cp",2,14],["cp",0,15],["cp",2,17],["cp",0,18],["cp",2,20],["cp",0,21],["cp",23,22],[23,22,37,["a"," "]]],"x":23,"t":1330337661.95172},{"y":24,"d":[[23,22,"o"]],"x":24,"t":1330337662.37922},{"y":24,"d":[[23,23,"k"]],"x":25,"t":1330337662.42731},{"y":24,"d":[[23,24,"."]],"x":26,"t":1330337662.66336},{"y":24,"d":[[23,25,"."]],"x":27,"t":1330337662.81578},{"y":24,"d":[[23,26,"s"]],"x":28,"t":1330337663.28007},{"y":24,"d":[[23,27,"u"]],"x":29,"t":1330337663.42796},{"y":24,"d":[[23,28,"p"]],"x":30,"t":1330337663.60391},{"y":24,"d":[[23,29,"p"]],"x":31,"t":1330337663.72798},{"y":24,"d":[[23,30,"o"]],"x":32,"t":1330337663.77608},{"y":24,"d":[[23,31,"s"]],"x":33,"t":1330337663.86376},{"y":24,"d":[[23,32,"e"]],"x":34,"t":1330337664.16001},{"y":24,"x":35,"t":1330337664.1602},{"y":24,"d":[[23,34,"w"]],"x":36,"t":1330337664.32799},{"y":24,"d":[[23,35,"e"]],"x":37,"t":1330337664.43593},{"y":24,"x":38,"t":1330337664.56802},{"y":24,"d":[[23,37,"w"]],"x":39,"t":1330337664.87203},{"y":24,"d":[[23,38,"a"]],"x":40,"t":1330337665.25296},{"y":24,"d":[[23,39,40,"nt"]],"x":43,"t":1330337665.28475},{"y":24,"d":[[23,42,"s"]],"x":44,"t":1330337665.49299},{"y":24,"d":[[23,43,"o"]],"x":45,"t":1330337665.55278},{"y":24,"d":[[23,44,"m"]],"x":46,"t":1330337665.58477},{"y":24,"d":[[23,45,"e"]],"x":47,"t":1330337665.70095},{"y":24,"x":48,"t":1330337665.81682},{"y":24,"d":[[23,47,"s"]],"x":49,"t":1330337666.95108},{"y":24,"d":[[23,48,"t"]],"x":50,"t":1330337667.05899},{"y":24,"d":[[23,49,"a"]],"x":51,"t":1330337667.15105},{"y":24,"d":[[23,50,"t"]],"x":52,"t":1330337667.28292},{"y":24,"d":[[23,51,"s"]],"x":53,"t":1330337667.71531},{"y":24,"d":[[23,52,"!"]],"x":54,"t":1330337667.87917},{"y":24,"d":[[23,53,54,"^C"]],"x":56,"t":1330337668.43923},{"y":24,"d":[["cp",2,1],["cp",0,2],["cp",1,4],["cp",0,5],["cp",1,7],["cp",0,8],["cp",1,10],["cp",0,11],["cp",1,13],["cp",0,14],["cp",1,16],["cp",0,17],["cp",1,19],["cp",0,20],["cp",22,21],["cp",23,22],[23,22,54,["a"," "]]],"x":23,"t":1330337668.43977},{"y":24,"d":[[23,22,"x"]],"x":24,"t":1330337669.0036},{"y":24,"d":[[23,23,"d"]],"x":25,"t":1330337669.2033},{"y":24,"d":[[23,24,"e"]],"x":26,"t":1330337669.36749},{"y":24,"d":[[23,25,"b"]],"x":27,"t":1330337669.52345},{"y":24,"d":[[23,26,"u"]],"x":28,"t":1330337669.60351},{"y":24,"d":[[23,27,"g"]],"x":29,"t":1330337669.69523},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",0,3],["cp",1,4],["cp",0,6],["cp",1,7],["cp",0,9],["cp",1,10],["cp",0,12],["cp",1,13],["cp",0,15],["cp",1,16],["cp",0,18],["cp",1,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,["a"," "]]],"x":1,"t":1330337670.17973},{"y":24,"d":[["cp",1,0],["cp",3,2],["cp",0,3],["cp",2,5],["cp",0,6],["cp",2,8],["cp",0,9],["cp",2,11],["cp",0,12],["cp",2,14],["cp",0,15],["cp",2,17],["cp",0,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,0,27,"Usage:                      "]],"x":1,"t":1330337670.19203},{"y":24,"d":[["cp",2,1],["cp",0,2],["cp",1,4],["cp",0,5],["cp",1,7],["cp",0,8],["cp",1,10],["cp",0,11],["cp",1,13],["cp",0,14],["cp",1,16],["cp",0,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,0,15,"    xdebug start"]],"x":1,"t":1330337670.26431},{"y":24,"d":[["cp",0,1],["cp",4,2],["cp",0,4],["cp",2,5],["cp",0,7],["cp",2,8],["cp",0,10],["cp",2,11],["cp",0,13],["cp",2,14],["cp",18,16],["cp",19,17],["cp",20,18],["cp",21,19],["cp",22,20],[21,0,17,"    xdebug profile"],[22,11,15,"trace"]],"x":1,"t":1330337670.29865},{"y":24,"d":[["cp",2,1],["cp",0,2],["cp",1,4],["cp",0,5],["cp",1,7],["cp",0,8],["cp",1,10],["cp",0,11],["cp",16,12],["cp",17,13],["cp",18,14],["cp",19,15],["cp",20,16],["cp",21,17],["cp",22,18],[19,0,19,"    xdebug summarize"],["cp",23,20],[21,0,50,"type 'xdebug --manual' to see the manual + examples"],["cp",20,22],[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337670.33631},{"y":24,"d":[[23,22,"t"]],"x":24,"t":1330337671.13609},{"y":24,"d":[[23,23,"h"]],"x":25,"t":1330337671.2526},{"y":24,"d":[[23,24,"i"]],"x":26,"t":1330337671.30042},{"y":24,"d":[[23,25,"s"]],"x":27,"t":1330337671.38845},{"y":24,"x":28,"t":1330337671.48044},{"y":24,"d":[[23,27,"i"]],"x":29,"t":1330337671.62044},{"y":24,"d":[[23,28,"s"]],"x":30,"t":1330337671.72442},{"y":24,"x":31,"t":1330337671.84073},{"y":24,"d":[[23,30,"t"]],"x":32,"t":1330337671.95274},{"y":24,"d":[[23,31,"h"]],"x":33,"t":1330337672.03265},{"y":24,"d":[[23,32,"e"]],"x":34,"t":1330337672.1647},{"y":24,"x":35,"t":1330337672.21268},{"y":24,"d":[[23,34,"c"]],"x":36,"t":1330337672.34203},{"y":24,"d":[[23,35,"o"]],"x":37,"t":1330337672.44897},{"y":24,"d":[[23,36,"m"]],"x":38,"t":1330337672.57344},{"y":24,"d":[[23,37,"m"]],"x":39,"t":1330337672.705},{"y":24,"d":[[23,38,"a"]],"x":40,"t":1330337672.86892},{"y":24,"d":[[23,39,"n"]],"x":41,"t":1330337672.93297},{"y":24,"d":[[23,40,"d"]],"x":42,"t":1330337673.07688},{"y":24,"d":[[23,41,"."]],"x":43,"t":1330337673.18491},{"y":24,"d":[[23,42,"."]],"x":44,"t":1330337673.34218},{"y":24,"d":[[23,43,44,"^C"]],"x":46,"t":1330337674.92261},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",0,3],["cp",1,4],["cp",0,6],["cp",1,7],["cp",0,9],["cp",1,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",19,21],["cp",23,22],[23,22,44,["a"," "]]],"x":23,"t":1330337674.92316},{"y":24,"d":[[23,22,"x"]],"x":24,"t":1330337675.63592},{"y":24,"d":[[23,23,"d"]],"x":25,"t":1330337675.92778},{"y":24,"d":[[23,24,"e"]],"x":26,"t":1330337676.15676},{"y":24,"d":[[23,25,"b"]],"x":27,"t":1330337676.30141},{"y":24,"d":[[23,26,"u"]],"x":28,"t":1330337676.36517},{"y":24,"d":[["cp",13,23]],"x":29,"t":1330337676.42517},{"y":24,"x":30,"t":1330337676.54506},{"y":24,"d":[[23,29,"s"]],"x":31,"t":1330337676.64903},{"y":24,"d":[[23,30,"t"]],"x":32,"t":1330337676.78905},{"y":24,"d":[[23,31,"a"]],"x":33,"t":1330337676.88519},{"y":24,"d":[[23,32,"r"]],"x":34,"t":1330337676.97319},{"y":24,"d":[[23,33,"t"]],"x":35,"t":1330337677.05783},{"y":24,"x":36,"t":1330337678.06248},{"y":24,"d":[[23,35,"i"]],"x":37,"t":1330337679.33178},{"y":24,"d":[[23,36,"s"]],"x":38,"t":1330337679.44763},{"y":24,"x":39,"t":1330337679.52761},{"y":24,"d":[[23,38,"t"]],"x":40,"t":1330337679.69958},{"y":24,"d":[[23,39,"o"]],"x":41,"t":1330337679.76346},{"y":24,"x":42,"t":1330337679.84362},{"y":24,"d":[[23,41,"t"]],"x":43,"t":1330337680.19653},{"y":24,"d":[[23,42,"r"]],"x":44,"t":1330337680.26856},{"y":24,"d":[[23,43,"i"]],"x":45,"t":1330337680.3566},{"d":[["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],["r","leon@dev:/tmp/xdebug$ and it works..^C                                          "],["r","leon@dev:/tmp/xdebug$ ok..suppose we want some stats!^C                         "],["r","leon@dev:/tmp/xdebug$ xdebug                                                    "],["r","Usage:                                                                          "],["r","    xdebug start                                                                "],["r","    xdebug profile                                                              "],["r","    xdebug trace                                                                "],["r","    xdebug summarize                                                            "],["a"," "],["r","type 'xdebug --manual' to see the manual + examples                             "],["a"," "],["r","leon@dev:/tmp/xdebug$ this is the command..^C                                   "],["r","leon@dev:/tmp/xdebug$ xdebug start is to trig                                   "]],"x":46,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337680.4645,"i":1},{"y":24,"d":[[23,45,"g"]],"x":47,"t":1330337680.62468},{"y":24,"d":[[23,46,"e"]],"x":48,"t":1330337680.67257},{"y":24,"d":[[23,47,"r"]],"x":49,"t":1330337680.74855},{"y":24,"x":50,"t":1330337680.85667},{"y":24,"d":[[23,49,"a"]],"x":51,"t":1330337681.23272},{"y":24,"x":52,"t":1330337681.23292},{"y":24,"d":[[23,51,"d"]],"x":53,"t":1330337681.35255},{"y":24,"d":[[23,52,"e"]],"x":54,"t":1330337681.55302},{"y":24,"d":[[23,53,"b"]],"x":55,"t":1330337681.65715},{"y":24,"d":[[23,54,"u"]],"x":56,"t":1330337681.71692},{"y":24,"d":[[23,55,"g"]],"x":57,"t":1330337681.833},{"y":24,"d":[[23,56,"g"]],"x":58,"t":1330337681.94081},{"y":24,"d":[[23,57,"i"]],"x":59,"t":1330337682.04132},{"y":24,"d":[[23,58,"n"]],"x":60,"t":1330337682.11339},{"y":24,"d":[[23,59,"g"]],"x":61,"t":1330337682.1906},{"y":24,"x":62,"t":1330337682.39976},{"y":24,"d":[[23,61,"s"]],"x":63,"t":1330337682.70356},{"y":24,"d":[[23,62,"e"]],"x":64,"t":1330337682.86407},{"y":24,"d":[[23,63,"s"]],"x":65,"t":1330337682.98388},{"y":24,"d":[[23,64,"s"]],"x":66,"t":1330337683.17588},{"y":24,"d":[[23,65,"i"]],"x":67,"t":1330337683.19169},{"y":24,"d":[[23,66,"o"]],"x":68,"t":1330337683.28003},{"y":24,"d":[[23,67,"n"]],"x":69,"t":1330337683.38786},{"y":24,"x":70,"t":1330337683.43988},{"y":24,"d":[[23,69,"i"]],"x":71,"t":1330337684.58291},{"y":24,"d":[[23,70,"n"]],"x":72,"t":1330337684.64101},{"y":24,"x":73,"t":1330337684.72325},{"y":24,"d":[[23,72,"v"]],"x":74,"t":1330337686.07869},{"y":24,"d":[[23,73,"i"]],"x":75,"t":1330337686.14268},{"y":24,"d":[[23,74,"m"]],"x":76,"t":1330337686.18658},{"y":24,"d":[["cp",1,0],["cp",3,2],["cp",0,3],["cp",2,5],["cp",0,6],["cp",2,8],["cp",0,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",18,20],["cp",22,21],[22,22,76,"xdebug start is to trigger a debugging session in vim^C"],[23,22,74,["a"," "]]],"x":23,"t":1330337686.90741},{"y":24,"d":[[23,22,"o"]],"x":24,"t":1330337687.29519},{"y":24,"d":[[23,23,"r"]],"x":25,"t":1330337687.36405},{"y":24,"x":26,"t":1330337687.47207},{"y":24,"d":[[23,25,"a"]],"x":27,"t":1330337687.8765},{"y":24,"d":[[23,26,"n"]],"x":28,"t":1330337687.96409},{"y":24,"d":[[23,27,"o"]],"x":29,"t":1330337688.0718},{"y":24,"d":[[23,28,"t"]],"x":30,"t":1330337688.13624},{"y":24,"d":[[23,29,"h"]],"x":31,"t":1330337688.24794},{"y":24,"d":[[23,30,"e"]],"x":32,"t":1330337688.34822},{"y":24,"d":[[23,31,"r"]],"x":33,"t":1330337688.39588},{"y":24,"x":34,"t":1330337688.48789},{"y":24,"d":[[23,33,"I"]],"x":35,"t":1330337689.3132},{"y":24,"d":[[23,34,"D"]],"x":36,"t":1330337689.35708},{"y":24,"d":[[23,35,"E"]],"x":37,"t":1330337689.55296},{"y":24,"x":38,"t":1330337689.74496},{"y":24,"d":[[23,37,"l"]],"x":39,"t":1330337689.89696},{"y":24,"d":[[23,38,"i"]],"x":40,"t":1330337689.95294},{"y":24,"d":[[23,39,"k"]],"x":41,"t":1330337690.12542},{"y":24,"d":[[23,40,"e"]],"x":42,"t":1330337690.19746},{"y":24,"x":43,"t":1330337690.29323},{"y":24,"d":[[23,42,"Z"]],"x":44,"t":1330337690.66573},{"y":24,"d":[[23,43,"e"]],"x":45,"t":1330337690.91116},{"y":24,"d":[[23,44,45,"nd"]],"x":47,"t":1330337691.2733},{"y":24,"d":[[23,46,"/"]],"x":48,"t":1330337691.31726},{"y":24,"d":[[23,47,"E"]],"x":49,"t":1330337691.84772},{"y":24,"d":[[23,48,"c"]],"x":50,"t":1330337692.03587},{"y":24,"d":[[23,49,"l"]],"x":51,"t":1330337692.13179},{"y":24,"d":[[23,50,"i"]],"x":52,"t":1330337692.28797},{"y":24,"d":[[23,51,"p"]],"x":53,"t":1330337692.35173},{"y":24,"d":[[23,52,"s"]],"x":54,"t":1330337692.42378},{"y":24,"d":[[23,53,"e"]],"x":55,"t":1330337692.55176},{"y":24,"x":56,"t":1330337692.6517},{"y":24,"d":[[23,55,"e"]],"x":57,"t":1330337692.88381},{"y":24,"d":[[23,56,"t"]],"x":58,"t":1330337693.02786},{"y":24,"d":[[23,57,"c"]],"x":59,"t":1330337693.25619},{"y":24,"d":[[23,58,"."]],"x":60,"t":1330337693.40424},{"y":24,"d":[[23,59,"."]],"x":61,"t":1330337693.54861},{"y":24,"d":[["cp",2,1],["cp",0,2],["cp",1,4],["cp",0,5],["cp",1,7],["cp",0,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",17,19],["cp",21,20],["cp",22,21],[22,22,76,"or another IDE like Zend/Eclipse etc..^C               "],[23,22,59,["a"," "]]],"x":23,"t":1330337693.97274},{"y":24,"d":[[23,22,"p"]],"x":24,"t":1330337695.37399},{"y":24,"d":[[23,23,"r"]],"x":25,"t":1330337695.44191},{"y":24,"d":[[23,24,"o"]],"x":26,"t":1330337695.55486},{"y":24,"d":[[23,25,"f"]],"x":27,"t":1330337695.64679},{"y":24,"d":[[23,26,"i"]],"x":28,"t":1330337695.72665},{"y":24,"d":[[23,27,"l"]],"x":29,"t":1330337695.89874},{"y":24,"d":[[23,28,"e"]],"x":30,"t":1330337695.90296},{"y":24,"x":31,"t":1330337695.96428},{"y":24,"d":[[23,30,"a"]],"x":32,"t":1330337696.0926},{"y":24,"d":[[23,31,"n"]],"x":33,"t":1330337696.1647},{"y":24,"d":[[23,32,"d"]],"x":34,"t":1330337696.26882},{"y":24,"x":35,"t":1330337696.36878},{"y":24,"d":[[23,34,"t"]],"x":36,"t":1330337696.56486},{"y":24,"d":[[23,35,"r"]],"x":37,"t":1330337696.62884},{"y":24,"d":[[23,36,"a"]],"x":38,"t":1330337696.84276},{"y":24,"d":[[23,37,"c"]],"x":39,"t":1330337696.95858},{"y":24,"d":[[23,38,"e"]],"x":40,"t":1330337697.09999},{"y":24,"x":41,"t":1330337697.22811},{"y":24,"d":[[23,40,"a"]],"x":42,"t":1330337697.58126},{"y":24,"d":[[23,41,"r"]],"x":43,"t":1330337697.71733},{"y":24,"d":[[23,42,"e"]],"x":44,"t":1330337697.77715},{"y":24,"x":45,"t":1330337697.84518},{"y":24,"d":[[23,44,"m"]],"x":46,"t":1330337697.96091},{"y":24,"d":[[23,45,"o"]],"x":47,"t":1330337698.00099},{"y":24,"d":[[23,46,"r"]],"x":48,"t":1330337698.12924},{"y":24,"d":[[23,47,"e"]],"x":49,"t":1330337698.13288},{"y":24,"x":50,"t":1330337698.23312},{"y":24,"d":[[23,49,"i"]],"x":51,"t":1330337700.70516},{"y":24,"d":[[23,50,"n"]],"x":52,"t":1330337700.8054},{"y":24,"d":[[23,51,"f"]],"x":53,"t":1330337700.82544},{"d":[["r","flop                                                                            "],["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],["r","leon@dev:/tmp/xdebug$ and it works..^C                                          "],["r","leon@dev:/tmp/xdebug$ ok..suppose we want some stats!^C                         "],["r","leon@dev:/tmp/xdebug$ xdebug                                                    "],["r","Usage:                                                                          "],["r","    xdebug start                                                                "],["r","    xdebug profile                                                              "],["r","    xdebug trace                                                                "],["r","    xdebug summarize                                                            "],["a"," "],["r","type 'xdebug --manual' to see the manual + examples                             "],["a"," "],["r","leon@dev:/tmp/xdebug$ this is the command..^C                                   "],["r","leon@dev:/tmp/xdebug$ xdebug start is to trigger a debugging session in vim^C   "],["r","leon@dev:/tmp/xdebug$ or another IDE like Zend/Eclipse etc..^C                  "],["r","leon@dev:/tmp/xdebug$ profile and trace are more info                           "]],"x":54,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337700.96143,"i":1},{"y":24,"d":[[23,53,"r"]],"x":55,"t":1330337701.03351},{"y":24,"d":[[23,54,"m"]],"x":56,"t":1330337701.14277},{"y":24,"d":[[23,55,"a"]],"x":57,"t":1330337701.27756},{"y":24,"d":[[23,56,"t"]],"x":58,"t":1330337701.36577},{"y":24,"d":[[23,57,"i"]],"x":59,"t":1330337701.42946},{"y":24,"d":[[23,58,"o"]],"x":60,"t":1330337702.31793},{"y":24,"d":[[23,59,"n"]],"x":62,"t":1330337703.15551},{"y":24,"d":[[23,61,"f"]],"x":63,"t":1330337703.4716},{"y":24,"d":[[23,62,"o"]],"x":64,"t":1330337703.55205},{"y":24,"d":[[23,63,"c"]],"x":65,"t":1330337703.68018},{"y":24,"d":[[23,64,"u"]],"x":66,"t":1330337703.7766},{"y":24,"d":[[23,65,"s"]],"x":67,"t":1330337703.90018},{"y":24,"d":[[23,66,"e"]],"x":68,"t":1330337703.9763},{"y":24,"d":[[23,67,"d"]],"x":69,"t":1330337704.16483},{"y":24,"x":70,"t":1330337704.77324},{"y":24,"d":[[23,69,"c"]],"x":71,"t":1330337706.39549},{"y":24,"d":[[23,70,"o"]],"x":72,"t":1330337706.48737},{"y":24,"d":[[23,71,"m"]],"x":73,"t":1330337706.72322},{"y":24,"d":[[23,72,"d"]],"x":74,"t":1330337706.82088},{"y":24,"d":[[23,73,"s"]],"x":75,"t":1330337706.94453},{"y":24,"d":[[23,73," "]],"x":74,"t":1330337707.5091},{"y":24,"d":[[23,72," "]],"x":73,"t":1330337707.66103},{"y":24,"d":[[23,71," "]],"x":72,"t":1330337707.83361},{"y":24,"d":[[23,70," "]],"x":71,"t":1330337707.98152},{"y":24,"d":[[23,70,"m"]],"x":72,"t":1330337708.18549},{"y":24,"d":[[23,71,"d"]],"x":73,"t":1330337708.25382},{"y":24,"d":[[23,72,"s"]],"x":74,"t":1330337708.29334},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",0,3],["cp",1,4],["cp",0,6],["cp",1,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",16,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,22,74,"profile and trace are more information focused cmds^C"],[23,22,72,["a"," "]]],"x":23,"t":1330337708.74592},{"y":24,"d":[[23,22,"x"]],"x":24,"t":1330337710.30341},{"y":24,"d":[[23,23,"d"]],"x":25,"t":1330337710.47097},{"y":24,"d":[[23,24,"e"]],"x":26,"t":1330337710.61913},{"y":24,"d":[[23,25,"b"]],"x":27,"t":1330337710.69928},{"y":24,"d":[[23,26,"u"]],"x":28,"t":1330337710.76064},{"y":24,"d":[["cp",10,23]],"x":29,"t":1330337710.87247},{"y":24,"x":30,"t":1330337710.94468},{"y":24,"d":[[23,29,"p"]],"x":31,"t":1330337712.65914},{"y":24,"d":[[23,30,"r"]],"x":32,"t":1330337712.71929},{"y":24,"d":[[23,31,"o"]],"x":33,"t":1330337712.81119},{"y":24,"d":[[23,32,"f"]],"x":34,"t":1330337712.92297},{"y":24,"d":[[23,33,"i"]],"x":35,"t":1330337713.01111},{"y":24,"d":[[23,34,"l"]],"x":36,"t":1330337713.0589},{"y":24,"d":[[23,35,"e"]],"x":37,"t":1330337713.15173},{"y":24,"x":38,"t":1330337713.27613},{"y":24,"d":[[23,37,"t"]],"x":39,"t":1330337715.30738},{"y":24,"d":[[23,38,"e"]],"x":40,"t":1330337715.37515},{"y":24,"d":[[23,39,44,"st.php"]],"x":47,"t":1330337715.5674},{"y":24,"d":[[23,46,"o"]],"x":48,"t":1330337717.12324},{"y":24,"d":[[23,47,"u"]],"x":49,"t":1330337717.18316},{"y":24,"d":[[23,48,"t"]],"x":50,"t":1330337717.26578},{"y":24,"d":[["cp",1,0],["cp",3,2],["cp",0,3],["cp",2,5],["cp",0,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",15,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],["cp",15,23]],"x":1,"t":1330337718.3346},{"y":24,"d":[["cp",7,4],["cp",8,5],["cp",9,6],["cp",10,7],["cp",11,8],["cp",12,9],["cp",13,10],["cp",14,11],["cp",15,12],["cp",16,13],["cp",12,14],["cp",18,15],["cp",19,16],["cp",20,17],["cp",21,18],["cp",22,19],[20,0,61,"[x] starting xdebug session with options:                     "],[21,0,74,"[x]   idekey                    : leon                                     "],[22,0,48,"[x]   remote_host               : localhost      "]],"x":1,"t":1330337718.38106},{"y":24,"d":[["cp",4,0],["cp",5,1],["cp",6,2],["cp",7,3],["cp",8,4],["cp",9,5],["cp",10,6],["cp",11,7],["cp",12,8],["cp",13,9],["cp",8,10],["cp",15,11],["cp",16,12],["cp",17,13],["cp",18,14],["cp",19,15],["cp",20,16],["cp",21,17],["cp",22,18],[19,0,48,"[x]   show_exception_trace      : 0              "],[20,4,40,"  show_local_vars           : 0      "],[21,6,19,"show_mem_delta"],[21,34,37,"1   "],[22,6,17,"trace_format"],[22,34,42,"0        "]],"x":1,"t":1330337718.42534},{"y":24,"d":[["cp",4,0],["cp",5,1],["cp",6,2],["cp",7,3],["cp",8,4],["cp",9,5],["cp",4,6],["cp",11,7],["cp",12,8],["cp",13,9],["cp",14,10],["cp",15,11],["cp",16,12],["cp",17,13],["cp",18,14],["cp",19,15],["cp",20,16],["cp",21,17],["cp",22,18],[19,6,25,"trace_options       "],[20,6,29,"var_display_max_children"],[20,34,35,"10"],[21,6,25,"var_display_max_data"],[21,34,36,"512"],[22,6,26,"var_display_max_depth"],[22,34,"3"]],"x":1,"t":1330337718.46957},{"y":24,"d":[["cp",4,0],["cp",5,1],["cp",0,2],["cp",7,3],["cp",8,4],["cp",9,5],["cp",10,6],["cp",11,7],["cp",12,8],["cp",13,9],["cp",14,10],["cp",15,11],["cp",16,12],["cp",17,13],["cp",18,14],["cp",19,15],["cp",20,16],["cp",21,17],["cp",22,18],[19,6,20,"profiler_enable"],[19,34,"1"],[20,6,29,"profiler_output_dir     "],[20,34,35,". "],[21,6,25,"profiler_output_name"],[21,34,39,"out.cg"],["cp",0,22]],"x":1,"t":1330337718.50284},{"y":24,"d":[[0,0,3,"flip"],[1,0,50,"flop                                               "],["cp",1,2],["cp",0,3],["cp",1,4],["cp",1,5],["cp",0,6],["cp",1,7],["cp",1,8],["cp",0,9],["cp",1,10],["cp",1,11],["cp",0,12],["cp",1,13],["cp",1,14],["cp",0,15],["cp",1,16],["cp",1,17],["cp",0,18],["cp",1,19],["cp",1,20],["cp",0,21],["cp",1,22],[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337718.54486},{"y":24,"d":[[23,22,"l"]],"x":24,"t":1330337720.45172},{"y":24,"d":[[23,23,"s"]],"x":25,"t":1330337720.51529},{"y":24,"d":[["cp",1,0],["cp",3,2],["cp",0,3],["cp",2,5],["cp",0,6],["cp",2,8],["cp",0,9],["cp",2,11],["cp",0,12],["cp",2,14],["cp",0,15],["cp",2,17],["cp",0,18],["cp",2,20],["cp",0,21],["cp",23,22],[23,["a"," "]]],"x":1,"t":1330337720.61515},{"y":24,"d":[["cp",2,1],["cp",0,2],["cp",1,4],["cp",0,5],["cp",1,7],["cp",0,8],["cp",1,10],["cp",0,11],["cp",1,13],["cp",0,14],["cp",1,16],["cp",0,17],["cp",1,19],["cp",0,20],["cp",22,21],[22,0,23,"out.cg  test.php  xdebug"],[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337720.62153},{"y":24,"d":[[23,22,"o"]],"x":24,"t":1330337722.4964},{"y":24,"d":[[23,23,"u"]],"x":25,"t":1330337722.79806},{"y":24,"d":[[23,24,25,"t."]],"x":27,"t":1330337722.7982},{"y":24,"d":[[23,26,"c"]],"x":28,"t":1330337722.89382},{"y":24,"d":[[23,27,"g"]],"x":29,"t":1330337723.11413},{"y":24,"x":30,"t":1330337723.51533},{"y":24,"d":[[23,29,"i"]],"x":31,"t":1330337723.5391},{"y":24,"d":[[23,30,"s"]],"x":32,"t":1330337723.61542},{"y":24,"x":33,"t":1330337723.71138},{"y":24,"d":[[23,32,"g"]],"x":34,"t":1330337723.99217},{"y":24,"d":[[23,33,"e"]],"x":35,"t":1330337724.07959},{"y":24,"d":[[23,34,"n"]],"x":36,"t":1330337724.20793},{"y":24,"d":[[23,35,"e"]],"x":37,"t":1330337724.53588},{"y":24,"d":[[23,36,37,"ra"]],"x":39,"t":1330337724.55955},{"y":24,"d":[[23,38,"t"]],"x":40,"t":1330337724.71986},{"y":24,"d":[[23,39,"e"]],"x":41,"t":1330337724.79172},{"y":24,"d":[[23,40,"d"]],"x":42,"t":1330337724.94817},{"y":24,"d":[[23,41,"."]],"x":43,"t":1330337725.09633},{"y":24,"d":[[23,42,"."]],"x":44,"t":1330337725.24443},{"y":24,"d":[[23,43,"y"]],"x":45,"t":1330337725.62559},{"y":24,"d":[[23,44,"o"]],"x":46,"t":1330337725.71359},{"y":24,"d":[[23,45,"u"]],"x":47,"t":1330337726.03773},{"y":24,"d":[[23,47,48,"ca"]],"x":50,"t":1330337726.06156},{"y":24,"d":[[23,49,"n"]],"x":51,"t":1330337726.12155},{"y":24,"x":52,"t":1330337726.21353},{"y":24,"d":[[23,51,"l"]],"x":53,"t":1330337726.68969},{"y":24,"d":[[23,52,"o"]],"x":54,"t":1330337726.85397},{"y":24,"d":[[23,53,"a"]],"x":55,"t":1330337726.92178},{"y":24,"d":[[23,54,"d"]],"x":56,"t":1330337727.04624},{"y":24,"x":57,"t":1330337727.05018},{"y":24,"d":[[23,56,"t"]],"x":58,"t":1330337727.41823},{"y":24,"d":[[23,57,"h"]],"x":59,"t":1330337727.49394},{"y":24,"d":[[23,58,"i"]],"x":60,"t":1330337727.52608},{"y":24,"d":[[23,59,"s"]],"x":61,"t":1330337727.63024},{"y":24,"x":62,"t":1330337727.6977},{"y":24,"d":[[23,61,"i"]],"x":63,"t":1330337727.91016},{"y":24,"d":[[23,62,"n"]],"x":64,"t":1330337728.01},{"y":24,"d":[[23,63,"t"]],"x":65,"t":1330337728.17414},{"y":24,"d":[[23,64,"o"]],"x":66,"t":1330337728.28223},{"y":24,"x":67,"t":1330337728.35146},{"d":[["r","flop                                                                            "],["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],["r","leon@dev:/tmp/xdebug$ ls                                                        "],["r","out.cg  test.php  xdebug                                                        "],["r","leon@dev:/tmp/xdebug$ out.cg is generated..you can load this into ^C            "]],"x":69,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337728.73149,"i":1},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",0,3],["cp",1,4],["cp",0,6],["cp",1,7],["cp",0,9],["cp",1,10],["cp",0,12],["cp",1,13],["cp",0,15],["cp",1,16],["cp",0,18],["cp",1,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,22,67,["a"," "]]],"x":23,"t":1330337728.7318},{"y":24,"d":[[23,22,"c"]],"x":24,"t":1330337729.08343},{"y":24,"d":[[23,23,"a"]],"x":25,"t":1330337729.20733},{"y":24,"d":[[23,24,"c"]],"x":26,"t":1330337729.60349},{"y":24,"d":[[23,25,"h"]],"x":27,"t":1330337729.82372},{"y":24,"d":[[23,26,"e"]],"x":28,"t":1330337730.30352},{"y":24,"d":[[23,27,"g"]],"x":29,"t":1330337730.53998},{"y":24,"d":[[23,28,"r"]],"x":30,"t":1330337730.62385},{"y":24,"d":[[23,29,"i"]],"x":31,"t":1330337730.75285},{"y":24,"d":[[23,30,"n"]],"x":32,"t":1330337730.82078},{"y":24,"d":[[23,31,"d"]],"x":33,"t":1330337730.92109},{"y":24,"d":[[23,32,"."]],"x":34,"t":1330337731.04504},{"y":24,"d":[[23,33,"."]],"x":35,"t":1330337731.19313},{"y":24,"d":[[23,34,"o"]],"x":36,"t":1330337731.35766},{"y":24,"d":[[23,35,"r"]],"x":37,"t":1330337731.46175},{"y":24,"x":38,"t":1330337731.57769},{"y":24,"d":[[23,37,"g"]],"x":39,"t":1330337731.87763},{"y":24,"d":[[23,38,"e"]],"x":40,"t":1330337731.95351},{"y":24,"d":[[23,39,"n"]],"x":41,"t":1330337732.0616},{"y":24,"d":[[23,40,"e"]],"x":42,"t":1330337732.14153},{"y":24,"d":[[23,41,"r"]],"x":43,"t":1330337732.42986},{"y":24,"d":[[23,42,43,"at"]],"x":45,"t":1330337732.42995},{"y":24,"d":[[23,44,"e"]],"x":46,"t":1330337732.52177},{"y":24,"x":47,"t":1330337732.71792},{"y":24,"d":[[23,46,"p"]],"x":48,"t":1330337732.9179},{"y":24,"d":[[23,47,"n"]],"x":49,"t":1330337733.0938},{"y":24,"d":[[23,47," "]],"x":48,"t":1330337733.41803},{"y":24,"d":[[23,46," "]],"x":47,"t":1330337733.57813},{"y":24,"d":[[23,46,"."]],"x":48,"t":1330337733.79823},{"y":24,"d":[[23,47,"p"]],"x":49,"t":1330337734.01388},{"y":24,"d":[[23,48,"n"]],"x":50,"t":1330337734.10174},{"y":24,"d":[[23,49,"g"]],"x":51,"t":1330337734.21001},{"y":24,"d":[[23,50,"s"]],"x":52,"t":1330337735.19039},{"y":24,"x":53,"t":1330337735.30656},{"y":24,"d":[[23,52,"w"]],"x":54,"t":1330337735.51451},{"y":24,"d":[[23,53,"i"]],"x":55,"t":1330337735.61845},{"y":24,"d":[[23,54,"t"]],"x":56,"t":1330337735.7461},{"y":24,"d":[[23,55,"h"]],"x":57,"t":1330337735.82626},{"y":24,"x":58,"t":1330337735.91405},{"y":24,"d":[[23,57,"x"]],"x":59,"t":1330337736.52818},{"y":24,"d":[[23,58,"d"]],"x":60,"t":1330337736.69258},{"y":24,"d":[[23,59,"e"]],"x":61,"t":1330337736.84057},{"y":24,"d":[[23,60,"b"]],"x":62,"t":1330337736.95241},{"y":24,"d":[[23,61,"u"]],"x":63,"t":1330337737.10473},{"y":24,"d":[[23,62,"g"]],"x":64,"t":1330337737.10478},{"y":24,"d":[[23,63,"t"]],"x":65,"t":1330337737.60512},{"y":24,"d":[[23,64,"o"]],"x":66,"t":1330337737.71706},{"y":24,"d":[[23,65,"o"]],"x":67,"t":1330337737.86551},{"y":24,"d":[[23,66,"l"]],"x":68,"t":1330337738.03913},{"y":24,"d":[[23,67,"k"]],"x":69,"t":1330337738.26148},{"y":24,"d":[[23,68,"i"]],"x":70,"t":1330337738.49471},{"y":24,"d":[[23,69,"t"]],"x":71,"t":1330337738.71447},{"y":24,"d":[[23,70,71,"^C"]],"x":73,"t":1330337739.30788},{"y":24,"d":[["cp",1,0],["cp",3,2],["cp",0,3],["cp",2,5],["cp",0,6],["cp",2,8],["cp",0,9],["cp",2,11],["cp",0,12],["cp",2,14],["cp",0,15],["cp",2,17],["cp",0,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,22,71,["a"," "]]],"x":23,"t":1330337739.30928},{"y":24,"d":[[23,22,"o"]],"x":24,"t":1330337739.96384},{"y":24,"d":[[23,23,"r"]],"x":25,"t":1330337740.11209},{"y":24,"d":[[23,24,"."]],"x":26,"t":1330337740.26141},{"y":24,"d":[[23,25,"."]],"x":27,"t":1330337740.38951},{"y":24,"d":[[23,26,"."]],"x":28,"t":1330337740.5228},{"y":24,"d":[[23,27,"j"]],"x":29,"t":1330337740.75572},{"y":24,"d":[[23,28,"u"]],"x":30,"t":1330337740.91549},{"y":24,"d":[[23,29,"s"]],"x":31,"t":1330337740.96759},{"y":24,"d":[[23,30,"t"]],"x":32,"t":1330337741.03992},{"y":24,"x":33,"t":1330337741.35577},{"y":24,"d":[[23,32,"d"]],"x":34,"t":1330337741.39963},{"y":24,"d":[[23,33,"o"]],"x":35,"t":1330337741.49958},{"y":24,"x":36,"t":1330337741.55169},{"y":24,"d":[[23,35,"t"]],"x":37,"t":1330337741.69566},{"y":24,"d":[[23,36,"h"]],"x":38,"t":1330337741.81562},{"y":24,"d":[[23,37,"i"]],"x":39,"t":1330337741.81951},{"y":24,"d":[[23,38,"s"]],"x":40,"t":1330337741.90778},{"y":24,"d":[[23,39,":"]],"x":41,"t":1330337742.65049},{"y":24,"d":[[23,40,41,"^C"]],"x":43,"t":1330337742.96383},{"y":24,"d":[["cp",2,1],["cp",0,2],["cp",1,4],["cp",0,5],["cp",1,7],["cp",0,8],["cp",1,10],["cp",0,11],["cp",1,13],["cp",0,14],["cp",1,16],["cp",0,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,22,41,["a"," "]]],"x":23,"t":1330337742.96413},{"y":24,"d":[[23,22,"x"]],"x":24,"t":1330337744.75771},{"y":24,"d":[[23,23,"d"]],"x":25,"t":1330337744.86176},{"y":24,"d":[[23,24,"e"]],"x":26,"t":1330337745.07407},{"y":24,"d":[[23,25,"b"]],"x":27,"t":1330337745.07785},{"y":24,"d":[[23,26,"u"]],"x":28,"t":1330337745.15386},{"y":24,"d":[[23,27,"g"]],"x":29,"t":1330337745.19408},{"y":24,"x":30,"t":1330337745.28992},{"y":24,"d":[[23,29,"s"]],"x":31,"t":1330337745.50202},{"y":24,"d":[[23,30,"u"]],"x":32,"t":1330337745.50587},{"y":24,"d":[[23,31,"m"]],"x":33,"t":1330337745.67812},{"y":24,"d":[[23,32,"m"]],"x":34,"t":1330337745.82211},{"y":24,"d":[[23,33,"a"]],"x":35,"t":1330337746.14629},{"y":24,"d":[[23,34,"r"]],"x":36,"t":1330337746.32194},{"y":24,"d":[[23,35,"i"]],"x":37,"t":1330337746.47396},{"y":24,"d":[[23,36,"z"]],"x":38,"t":1330337746.60611},{"y":24,"d":[[23,37,"e"]],"x":39,"t":1330337746.88618},{"y":24,"x":40,"t":1330337747.468},{"y":24,"d":[[23,39,"o"]],"x":41,"t":1330337748.12386},{"y":24,"d":[[23,40,"u"]],"x":42,"t":1330337748.18765},{"y":24,"d":[[23,41,"t"]],"x":43,"t":1330337748.29973},{"y":24,"d":[[23,42,"."]],"x":44,"t":1330337748.40784},{"y":24,"d":[[23,43,"c"]],"x":45,"t":1330337748.59171},{"y":24,"d":[[23,44,"f"]],"x":46,"t":1330337748.82777},{"y":24,"d":[[23,45,"g"]],"x":47,"t":1330337749.05189},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",0,3],["cp",1,4],["cp",0,6],["cp",1,7],["cp",0,9],["cp",1,10],["cp",0,12],["cp",1,13],["cp",0,15],["cp",1,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,["a"," "]]],"x":1,"t":1330337749.90166},{"d":[["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],["r","leon@dev:/tmp/xdebug$ ls                                                        "],["r","out.cg  test.php  xdebug                                                        "],["r","leon@dev:/tmp/xdebug$ out.cg is generated..you can load this into ^C            "],["r","leon@dev:/tmp/xdebug$ cachegrind..or generate .pngs with xdebugtoolkit^C        "],["r","leon@dev:/tmp/xdebug$ or...just do this:^C                                      "],["r","leon@dev:/tmp/xdebug$ xdebug summarize out.cfg                                  "],["r","cat: out.cfg: No such file or directory                                         "],["r","times    call                                                                   "],["r","========================================================                        "],["r","(please wait..summarizing)                                                      "],["r","leon@dev:/tmp/xdebug$                                                           "]],"x":23,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337749.93057,"i":1},{"y":24,"d":[["cp",18,23]],"x":47,"t":1330337752.34036},{"y":24,"d":[[23,45," "]],"x":46,"t":1330337753.04568},{"y":24,"d":[[23,44," "]],"x":45,"t":1330337753.20552},{"y":24,"d":[[23,44,"g"]],"x":46,"t":1330337753.71763},{"y":24,"d":[["cp",2,1],["cp",0,2],["cp",1,4],["cp",0,5],["cp",1,7],["cp",0,8],["cp",1,10],["cp",0,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,["a"," "]]],"x":1,"t":1330337754.11764},{"y":24,"d":[["cp",12,9],["cp",13,10],["cp",14,11],["cp",15,12],["cp",16,13],["cp",17,14],["cp",18,15],["cp",19,16],["cp",20,17],["cp",21,18],["cp",22,19],["cp",16,20],["cp",17,21],["cp",18,22]],"x":1,"t":1330337754.1364},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",0,3],["cp",1,4],["cp",0,6],["cp",1,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",15,19],["cp",16,20],["cp",17,21],[22,0,30,"40         test.php:flop->foo()"]],"x":1,"t":1330337754.2064},{"y":24,"d":[["cp",1,0],["cp",3,1],["cp",0,3],["cp",1,4],["cp",8,6],["cp",9,7],["cp",10,8],["cp",11,9],["cp",12,10],["cp",13,11],["cp",14,12],["cp",15,13],["cp",16,14],["cp",17,15],["cp",18,16],["cp",13,17],["cp",14,18],["cp",15,19],["cp",22,20],[21,0,30,"20         test.php:flap->foo()"],[22,0,1,"1 "],[22,20,30,"{main}()   "],[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337754.20836},{"y":24,"d":[[23,22,"h"]],"x":24,"t":1330337755.86217},{"y":24,"d":[[23,23,"e"]],"x":25,"t":1330337755.94997},{"y":24,"d":[[23,24,"r"]],"x":26,"t":1330337756.09823},{"y":24,"d":[[23,25,"e"]],"x":27,"t":1330337756.28224},{"y":24,"x":28,"t":1330337757.22237},{"y":24,"d":[[23,27,"y"]],"x":29,"t":1330337757.40634},{"y":24,"d":[[23,28,"o"]],"x":30,"t":1330337757.48613},{"y":24,"d":[[23,29,"u"]],"x":31,"t":1330337757.57823},{"y":24,"x":32,"t":1330337757.67019},{"y":24,"d":[[23,31,"c"]],"x":33,"t":1330337757.89036},{"y":24,"d":[[23,32,"a"]],"x":34,"t":1330337757.9502},{"y":24,"d":[[23,33,"n"]],"x":35,"t":1330337758.03012},{"y":24,"x":36,"t":1330337758.11043},{"y":24,"d":[[23,35,"s"]],"x":37,"t":1330337758.47435},{"y":24,"d":[[23,36,"e"]],"x":38,"t":1330337758.67445},{"y":24,"d":[[23,37,"e"]],"x":39,"t":1330337758.83436},{"y":24,"x":40,"t":1330337759.94625},{"y":24,"d":[[23,39,"f"]],"x":41,"t":1330337760.10254},{"y":24,"d":[[23,40,"l"]],"x":42,"t":1330337760.21469},{"y":24,"d":[[23,41,"o"]],"x":43,"t":1330337760.37858},{"y":24,"d":[[23,42,"p"]],"x":44,"t":1330337760.44272},{"y":24,"x":45,"t":1330337760.75049},{"y":24,"x":44,"t":1330337760.92655},{"y":24,"d":[[23,43,"("]],"x":45,"t":1330337761.3708},{"y":24,"d":[[23,44,")"]],"x":46,"t":1330337761.43855},{"y":24,"x":47,"t":1330337761.58645},{"y":24,"d":[[23,46,"w"]],"x":48,"t":1330337761.75847},{"y":24,"d":[[23,47,"a"]],"x":49,"t":1330337761.87459},{"y":24,"d":[[23,48,"s"]],"x":50,"t":1330337761.93053},{"y":24,"x":51,"t":1330337762.01909},{"y":24,"d":[[23,50,"c"]],"x":52,"t":1330337762.18656},{"y":24,"d":[[23,51,"a"]],"x":53,"t":1330337762.36252},{"y":24,"d":[[23,52,"l"]],"x":54,"t":1330337762.40257},{"y":24,"d":[[23,53,55,"led"]],"x":57,"t":1330337762.78671},{"y":24,"x":58,"t":1330337762.88281},{"y":24,"d":[[23,57,"4"]],"x":59,"t":1330337763.15603},{"y":24,"d":[[23,58,"0"]],"x":60,"t":1330337763.29613},{"y":24,"x":61,"t":1330337763.46879},{"y":24,"d":[[23,60,"t"]],"x":62,"t":1330337763.74495},{"y":24,"d":[[23,61,"i"]],"x":63,"t":1330337763.75281},{"y":24,"d":[[23,62,"m"]],"x":64,"t":1330337763.91278},{"y":24,"d":[[23,63,"e"]],"x":65,"t":1330337763.98885},{"y":24,"d":[[23,64,"s"]],"x":66,"t":1330337764.15694},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",0,3],["cp",1,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",12,16],["cp",13,17],["cp",14,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,0,66,"leon@dev:/tmp/xdebug$ here you can see flop() was called 40 times^C"],[23,22,64,["a"," "]]],"x":23,"t":1330337764.60194},{"y":24,"d":[[23,22,"w"]],"x":24,"t":1330337764.90245},{"y":24,"d":[[23,23,"i"]],"x":25,"t":1330337765.01462},{"y":24,"d":[[23,24,"t"]],"x":26,"t":1330337765.1307},{"y":24,"d":[[23,25,"h"]],"x":27,"t":1330337765.19462},{"y":24,"x":28,"t":1330337765.25072},{"y":24,"d":[[23,27,"c"]],"x":29,"t":1330337765.41872},{"y":24,"d":[[23,28,"o"]],"x":30,"t":1330337765.47838},{"y":24,"d":[[23,29,"m"]],"x":31,"t":1330337765.64662},{"y":24,"d":[[23,30,"p"]],"x":32,"t":1330337765.80654},{"y":24,"d":[[23,31,"l"]],"x":33,"t":1330337765.95836},{"y":24,"d":[[23,32,33,"ex"]],"x":35,"t":1330337766.25484},{"y":24,"x":36,"t":1330337766.34644},{"y":24,"d":[[23,35,"a"]],"x":37,"t":1330337767.81871},{"y":24,"d":[[23,36,"p"]],"x":38,"t":1330337767.90636},{"y":24,"d":[[23,37,"p"]],"x":39,"t":1330337768.31049},{"y":24,"d":[[23,38,"l"]],"x":40,"t":1330337768.78659},{"y":24,"d":[[23,39,"i"]],"x":41,"t":1330337768.94667},{"y":24,"d":[[23,40,"c"]],"x":42,"t":1330337769.05048},{"y":24,"d":[[23,41,"a"]],"x":43,"t":1330337769.11047},{"y":24,"d":[[23,42,45,"tion"]],"x":47,"t":1330337769.479},{"y":24,"d":[[23,46,"s"]],"x":48,"t":1330337769.59066},{"y":24,"x":49,"t":1330337769.73093},{"y":24,"d":[[23,48,"t"]],"x":50,"t":1330337770.31108},{"y":24,"d":[[23,49,"h"]],"x":51,"t":1330337770.80866},{"y":24,"d":[[23,50,"e"]],"x":52,"t":1330337770.92053},{"y":24,"d":[[23,51,"s"]],"x":53,"t":1330337771.10865},{"y":24,"d":[[23,52,"e"]],"x":55,"t":1330337771.44485},{"y":24,"d":[[23,54,"n"]],"x":56,"t":1330337771.46854},{"y":24,"d":[[23,55,"u"]],"x":57,"t":1330337771.54046},{"y":24,"d":[[23,56,"m"]],"x":58,"t":1330337771.75246},{"y":24,"d":[[23,57,"b"]],"x":59,"t":1330337771.91681},{"y":24,"d":[[23,58,"e"]],"x":60,"t":1330337771.97654},{"y":24,"d":[[23,59,"r"]],"x":61,"t":1330337772.14474},{"y":24,"d":[[23,60,"s"]],"x":62,"t":1330337772.20445},{"y":24,"x":63,"t":1330337772.30459},{"y":24,"d":[[23,62,"c"]],"x":64,"t":1330337772.45255},{"y":24,"d":[[23,63,"a"]],"x":65,"t":1330337772.52068},{"y":24,"d":[[23,64,"n"]],"x":66,"t":1330337772.58059},{"y":24,"x":67,"t":1330337772.65269},{"y":24,"d":[[23,66,"b"]],"x":68,"t":1330337772.83282},{"y":24,"d":[[23,67,"e"]],"x":69,"t":1330337772.88881},{"y":24,"d":[[23,68,"c"]],"x":70,"t":1330337773.01676},{"y":24,"d":[[23,69,"o"]],"x":71,"t":1330337773.10472},{"y":24,"d":[[23,70,"m"]],"x":72,"t":1330337773.15655},{"y":24,"d":[[23,71,"e"]],"x":73,"t":1330337773.22933},{"y":24,"d":[["cp",1,0],["cp",3,2],["cp",0,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",11,15],["cp",12,16],["cp",13,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,22,73,"with complex applications these numbers can become^C"],[23,22,71,["a"," "]]],"x":23,"t":1330337773.58648},{"y":24,"d":[[23,22,"q"]],"x":24,"t":1330337773.87776},{"d":[["r","flop                                                                            "],"d",["r","flip                                                                            "],["r","flop                                                                            "],["r","leon@dev:/tmp/xdebug$ ls                                                        "],["r","out.cg  test.php  xdebug                                                        "],["r","leon@dev:/tmp/xdebug$ out.cg is generated..you can load this into ^C            "],["r","leon@dev:/tmp/xdebug$ cachegrind..or generate .pngs with xdebugtoolkit^C        "],["r","leon@dev:/tmp/xdebug$ or...just do this:^C                                      "],["r","leon@dev:/tmp/xdebug$ xdebug summarize out.cfg                                  "],["r","cat: out.cfg: No such file or directory                                         "],["r","times    call                                                                   "],["r","========================================================                        "],["r","(please wait..summarizing)                                                      "],["r","leon@dev:/tmp/xdebug$ xdebug summarize out.cg                                   "],["r","times    call                                                                   "],["r","========================================================                        "],["r","(please wait..summarizing)                                                      "],["r","40         test.php:flop->foo()                                                 "],["r","20         test.php:flap->foo()                                                 "],["r","1          test.php:{main}()                                                    "],["r","leon@dev:/tmp/xdebug$ here you can see flop() was called 40 times^C             "],["r","leon@dev:/tmp/xdebug$ with complex applications these numbers can become^C      "],["r","leon@dev:/tmp/xdebug$ qu                                                        "]],"x":25,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337773.98969,"i":1},{"y":24,"d":[[23,24,"i"]],"x":26,"t":1330337774.04575},{"y":24,"d":[[23,25,"t"]],"x":27,"t":1330337774.15773},{"y":24,"d":[[23,26,"e"]],"x":28,"t":1330337774.22978},{"y":24,"x":29,"t":1330337774.43035},{"y":24,"d":[[23,28,"i"]],"x":30,"t":1330337774.74254},{"y":24,"d":[[23,29,"m"]],"x":31,"t":1330337774.86238},{"y":24,"d":[[23,30,"p"]],"x":32,"t":1330337775.00697},{"y":24,"d":[[23,31,"o"]],"x":33,"t":1330337775.05085},{"y":24,"d":[[23,32,"r"]],"x":34,"t":1330337775.11506},{"y":24,"d":[[23,33,"t"]],"x":35,"t":1330337775.25097},{"y":24,"d":[[23,34,"a"]],"x":36,"t":1330337775.78705},{"y":24,"d":[[23,35,"n"]],"x":37,"t":1330337775.93486},{"y":24,"d":[[23,36,"t"]],"x":38,"t":1330337776.03506},{"y":24,"d":[[23,37,"."]],"x":39,"t":1330337776.19629},{"y":24,"d":[[23,38,"."]],"x":40,"t":1330337776.3402},{"y":24,"d":[["cp",2,1],["cp",0,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",10,14],["cp",11,15],["cp",12,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,22,73,"quite important..^C                                 "],[23,22,38,["a"," "]]],"x":23,"t":1330337776.85248},{"y":24,"d":[[23,22,"o"]],"x":24,"t":1330337777.20034},{"y":24,"d":[[23,23,"k"]],"x":25,"t":1330337777.27627},{"y":24,"d":[[23,24,"."]],"x":26,"t":1330337777.64821},{"y":24,"d":[[23,25,"."]],"x":27,"t":1330337777.79627},{"y":24,"d":[[23,26,"w"]],"x":28,"t":1330337777.97625},{"y":24,"d":[[23,27,"h"]],"x":29,"t":1330337778.09625},{"y":24,"d":[[23,28,"a"]],"x":30,"t":1330337778.14849},{"y":24,"d":[[23,29,"t"]],"x":31,"t":1330337778.30039},{"y":24,"d":[[23,30,"s"]],"x":32,"t":1330337778.4816},{"y":24,"x":33,"t":1330337778.68998},{"y":24,"d":[[23,32,"e"]],"x":34,"t":1330337778.85013},{"y":24,"d":[[23,33,"n"]],"x":35,"t":1330337778.8696},{"y":24,"d":[[23,34,"x"]],"x":36,"t":1330337779.05763},{"y":24,"d":[[23,34," "]],"x":35,"t":1330337779.48566},{"y":24,"d":[[23,33," "]],"x":34,"t":1330337779.64161},{"y":24,"d":[[23,32," "]],"x":33,"t":1330337779.78972},{"y":24,"d":[[23,32,"n"]],"x":34,"t":1330337780.03758},{"y":24,"d":[[23,33,"e"]],"x":35,"t":1330337780.09368},{"y":24,"d":[[23,34,"x"]],"x":36,"t":1330337780.29365},{"y":24,"d":[[23,35,"t"]],"x":37,"t":1330337780.49785},{"y":24,"d":[[23,36,"."]],"x":38,"t":1330337780.60155},{"y":24,"d":[[23,37,"."]],"x":39,"t":1330337780.74178},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",9,13],["cp",10,14],["cp",11,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,22,40,"ok..whats next..^C "],[23,22,37,["a"," "]]],"x":23,"t":1330337780.97003},{"y":24,"d":[[23,22,"x"]],"x":24,"t":1330337781.48963},{"y":24,"d":[[23,23,"d"]],"x":25,"t":1330337781.67753},{"y":24,"d":[[23,24,"e"]],"x":26,"t":1330337781.8257},{"y":24,"d":[[23,25,"b"]],"x":27,"t":1330337781.9137},{"y":24,"d":[[23,26,"u"]],"x":28,"t":1330337781.9696},{"y":24,"d":[[23,27,"g"]],"x":29,"t":1330337782.04546},{"y":24,"x":30,"t":1330337782.15365},{"y":24,"d":[[23,29,"t"]],"x":31,"t":1330337782.36569},{"y":24,"d":[[23,30,"r"]],"x":32,"t":1330337782.36965},{"y":24,"d":[[23,31,"a"]],"x":33,"t":1330337782.53771},{"y":24,"d":[[23,32,"c"]],"x":34,"t":1330337782.61766},{"y":24,"d":[[23,33,"e"]],"x":35,"t":1330337782.71786},{"y":24,"x":36,"t":1330337782.86198},{"y":24,"d":[[23,35,"t"]],"x":37,"t":1330337785.61857},{"y":24,"d":[[23,36,"e"]],"x":38,"t":1330337785.67429},{"y":24,"d":[[23,37,42,"st.php"]],"x":45,"t":1330337785.871},{"y":24,"d":[[23,44,46,"out"]],"x":48,"t":1330337787.05058},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",8,12],["cp",9,13],["cp",10,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,["a"," "]]],"x":1,"t":1330337790.75689},{"y":24,"d":[["cp",2,0],["cp",3,1],["cp",4,2],["cp",5,3],["cp",6,4],["cp",7,5],["cp",8,6],["cp",9,7],["cp",10,8],["cp",11,9],["cp",6,10],["cp",7,11],["cp",8,12],["cp",15,13],["cp",16,14],["cp",17,15],["cp",18,16],["cp",19,17],["cp",20,18],["cp",21,19],["cp",22,20],[21,0,40,"[x] starting xdebug session with options:"],[22,0,46,"[x]   idekey                    : leon         "]],"x":1,"t":1330337790.79798},{"y":24,"d":[["cp",4,0],["cp",5,1],["cp",6,2],["cp",7,3],["cp",8,4],["cp",9,5],["cp",13,9],["cp",14,10],["cp",15,11],["cp",16,12],["cp",17,13],["cp",18,14],["cp",19,15],["cp",20,16],["cp",21,17],["cp",22,18],[19,0,42,"[x]   remote_host               : localhost"],[20,0,46,"[x]   show_exception_trace      : 0            "],[21,4,40,"  show_local_vars           : 0      "],[22,6,19,"show_mem_delta"],[22,34,37,"1   "]],"x":1,"t":1330337790.8432},{"y":24,"d":[["cp",4,0],["cp",5,1],["cp",9,5],["cp",10,6],["cp",11,7],["cp",12,8],["cp",13,9],["cp",14,10],["cp",15,11],["cp",16,12],["cp",17,13],["cp",18,14],["cp",19,15],["cp",20,16],["cp",21,17],["cp",22,18],[19,6,17,"trace_format"],[19,34,42,"0        "],[20,6,25,"trace_options       "],[21,6,29,"var_display_max_children"],[21,34,35,"10"],[22,6,25,"var_display_max_data"],[22,34,36,"512"]],"x":1,"t":1330337790.88772},{"y":24,"d":[["cp",5,1],["cp",6,2],["cp",7,3],["cp",8,4],["cp",9,5],["cp",10,6],["cp",11,7],["cp",12,8],["cp",13,9],["cp",14,10],["cp",15,11],["cp",16,12],["cp",17,13],["cp",18,14],["cp",19,15],["cp",20,16],["cp",21,17],["cp",22,18],[19,6,26,"var_display_max_depth"],[19,34,"3"],[20,13,22,"utput_name"],[20,34,36,"out"],[21,6,29,"trace_output_dir        "],[21,34,35,". "],["cp",23,22]],"x":1,"t":1330337790.9207},{"y":24,"d":[[0,0,25,"flip                      "],[1,0,3,"flop"],[1,11,30,["a"," "]],["cp",1,2],["cp",0,3],["cp",1,4],["cp",1,5],["cp",0,6],["cp",1,7],["cp",1,8],["cp",0,9],["cp",1,10],["cp",1,11],["cp",0,12],["cp",1,13],["cp",1,14],["cp",0,15],["cp",1,16],["cp",1,17],["cp",0,18],["cp",1,19],["cp",1,20],["cp",0,21],["cp",1,22],[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337790.96604},{"y":24,"d":[[23,22,"l"]],"x":24,"t":1330337792.47463},{"y":24,"d":[[23,23,"s"]],"x":25,"t":1330337792.53844},{"y":24,"d":[["cp",1,0],["cp",3,2],["cp",0,3],["cp",2,5],["cp",0,6],["cp",2,8],["cp",0,9],["cp",2,11],["cp",0,12],["cp",2,14],["cp",0,15],["cp",2,17],["cp",0,18],["cp",2,20],["cp",0,21],["cp",23,22],[23,["a"," "]]],"x":1,"t":1330337792.64653},{"y":24,"d":[["cp",2,1],["cp",0,2],["cp",1,4],["cp",0,5],["cp",1,7],["cp",0,8],["cp",1,10],["cp",0,11],["cp",1,13],["cp",0,14],["cp",1,16],["cp",0,17],["cp",1,19],["cp",0,20],["cp",22,21],[22,0,37,"out.cg  out.trace.xt  test.php  xdebug"],[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337792.65317},{"y":24,"d":[[23,22,"v"]],"x":24,"t":1330337794.57497},{"y":24,"d":[[23,23,"i"]],"x":25,"t":1330337794.63492},{"y":24,"x":26,"t":1330337794.73905},{"y":24,"d":[[23,25,"o"]],"x":27,"t":1330337794.89904},{"y":24,"d":[[23,26,"u"]],"x":28,"t":1330337794.98296},{"y":24,"x":28,"t":1330337795.13416},{"y":24,"d":[[23,27,28,"t."]],"x":30,"t":1330337795.13443},{"y":24,"d":[[23,29,"t"]],"x":31,"t":1330337795.7709},{"y":24,"d":[[23,30,"r"]],"x":32,"t":1330337795.85903},{"y":24,"d":[[23,31,36,"ace.xt"]],"x":39,"t":1330337796.08148},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",0,3],["cp",1,4],["cp",0,6],["cp",1,7],["cp",0,9],["cp",1,10],["cp",0,12],["cp",1,13],["cp",0,15],["cp",1,16],["cp",0,18],["cp",1,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,["a"," "]]],"x":1,"t":1330337796.55106},{"y":24,"x":1,"t":1330337796.60303},{"y":24,"x":1,"t":1330337796.61137},{"y":24,"d":[["cp",23,0],["cp",0,1],["cp",0,2],["cp",0,3],["cp",0,4],["cp",0,5],["cp",0,6],["cp",0,7],["cp",0,8],["cp",0,9],["cp",0,10],["cp",0,11],["cp",0,12],["cp",0,13],["cp",0,14],["cp",0,15],["cp",0,16],["cp",0,17],["cp",0,18],["cp",0,19],["cp",0,20],["cp",0,21],["cp",0,22],[23,0,13,"\"out.trace.xt\""]],"x":15,"t":1330337796.6993},{"y":1,"b":[[0,0,59,["a","4"]],[22,["a","4"]]],"d":[[0,0,59,"+q436f+q6b75+q6b64+q6b72+q6b6c+q2332+q2334+q2569+q2a37+q6b31"],[1,4,9,"0.0012"],[1,15,29,"638744   +13264"],[1,35,79,"-> include(/tmp/xdebug/test.php) Command line"],[2,1,6,"code:1"],[3,4,9,"0.0013"],[3,15,20,"640104"],[3,25,29,"+1360"],[3,37,74,"-> flop->foo() /tmp/xdebug/test.php:24"],[4,4,9,"0.0016"],[4,15,20,"640104"],[4,28,29,"+0"],[4,37,74,"-> flap->foo() /tmp/xdebug/test.php:25"],[5,4,9,"0.0018"],[5,15,20,"640104"],[5,28,29,"+0"],[5,39,75,"-> flop->foo() /tmp/xdebug/test.php:9"],[6,4,9,"0.0019"],[6,15,20,"640104"],[6,28,29,"+0"],[6,37,74,"-> flop->foo() /tmp/xdebug/test.php:24"],[7,4,9,"0.0020"],[7,15,20,"640104"],[7,28,29,"+0"],[7,37,74,"-> flap->foo() /tmp/xdebug/test.php:25"],[8,4,9,"0.0021"],[8,15,20,"640104"],[8,28,29,"+0"],[8,39,75,"-> flop->foo() /tmp/xdebug/test.php:9"],[9,4,9,"0.0023"],[9,15,20,"640104"],[9,28,29,"+0"],[9,37,74,"-> flop->foo() /tmp/xdebug/test.php:24"],[10,4,9,"0.0024"],[10,15,20,"640104"],[10,28,29,"+0"],[10,37,74,"-> flap->foo() /tmp/xdebug/test.php:25"],[11,4,9,"0.0025"],[11,15,20,"640104"],[11,28,29,"+0"],[11,39,75,"-> flop->foo() /tmp/xdebug/test.php:9"],[12,4,9,"0.0026"],[12,15,20,"640104"],[12,28,29,"+0"],[12,37,74,"-> flop->foo() /tmp/xdebug/test.php:24"],[13,4,9,"0.0028"],[13,15,20,"640104"],[13,28,29,"+0"],[13,37,74,"-> flap->foo() /tmp/xdebug/test.php:25"],[14,4,9,"0.0029"],[14,15,20,"640104"],[14,28,29,"+0"],[14,39,75,"-> flop->foo() /tmp/xdebug/test.php:9"],[15,4,9,"0.0030"],[15,15,20,"640104"],[15,28,29,"+0"],[15,37,74,"-> flop->foo() /tmp/xdebug/test.php:24"],[16,4,9,"0.0031"],[16,15,20,"640104"],[16,28,29,"+0"],[16,37,74,"-> flap->foo() /tmp/xdebug/test.php:25"],[17,4,9,"0.0032"],[17,15,20,"640104"],[17,28,29,"+0"],[17,39,75,"-> flop->foo() /tmp/xdebug/test.php:9"],[18,4,9,"0.0034"],[18,15,20,"640104"],[18,28,29,"+0"],[18,37,74,"-> flop->foo() /tmp/xdebug/test.php:24"],[19,4,9,"0.0035"],[19,15,20,"640104"],[19,28,29,"+0"],[19,37,74,"-> flap->foo() /tmp/xdebug/test.php:25"],[20,4,9,"0.0036"],[20,15,20,"640104"],[20,28,29,"+0"],[20,39,75,"-> flop->foo() /tmp/xdebug/test.php:9"],[21,4,9,"0.0037"],[21,15,20,"640104"],[21,28,29,"+0"],[21,37,74,"-> flop->foo() /tmp/xdebug/test.php:24"],[22,0,67,"/tmp/xdebug/out.trace.xt [unix][084][54][0001,0001][2%][ mapping 1 ]"],[23,15,25,"36L, 2547Cc"]],"x":61,"B":[[0,0,59,["a","1"]],[22,["a","1"]]],"t":1330337796.73527},{"y":2,"d":[[22,33,38,"32][20"],[22,44,"2"],[22,52,"5"]],"x":1,"t":1330337798.54499},{"y":4,"d":[[22,44,"3"],[22,52,"8"]],"x":1,"t":1330337799.0489},{"y":5,"d":[[22,44,"4"],[22,52,68,"11%][ mapping 1 ]"]],"x":1,"t":1330337799.14868},{"y":7,"d":[[22,44,"6"],[22,53,"6"]],"x":1,"t":1330337799.19673},{"y":8,"d":[[22,44,"7"],[22,53,"9"]],"x":1,"t":1330337799.24873},{"y":9,"d":[[22,44,"8"],[22,52,53,["a","2"]]],"x":1,"t":1330337799.29687},{"y":10,"d":[[22,44,"9"],[22,53,"5"]],"x":1,"t":1330337799.36477},{"y":11,"d":[[22,43,44,"10"],[22,53,"7"]],"x":1,"t":1330337799.42472},{"y":12,"d":[[22,44,"1"],[22,52,53,"30"]],"x":1,"t":1330337799.48086},{"y":13,"d":[[22,44,"2"],[22,53,"3"]],"x":1,"t":1330337799.52496},{"y":14,"d":[[22,44,"3"],[22,53,"6"]],"x":1,"t":1330337799.5732},{"y":15,"d":[[22,44,"4"],[22,53,"8"]],"x":1,"t":1330337799.62498},{"y":19,"d":[[22,44,"8"],[22,52,53,"50"]],"x":1,"t":1330337799.84936},{"y":19,"b":[["cp",1,0]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,9,"8"],[21,42,"a"],[21,74,"5"],[22,44,"9"],[22,53,"2"],[23,["a"," "]]],"x":1,"B":[["cp",1,0]],"t":1330337799.87691},{"y":18,"d":[["cp",2,0],["cp",3,1],["cp",4,2],["cp",5,3],["cp",6,4],["cp",7,5],["cp",8,6],["cp",9,7],["cp",10,8],["cp",11,9],["cp",12,10],["cp",13,11],["cp",14,12],["cp",15,13],["cp",16,14],["cp",17,15],["cp",18,16],["cp",19,17],["cp",20,18],["cp",21,19],[20,8,9,"40"],[20,37,75,"  -> flop->foo() /tmp/xdebug/test.php:9"],[21,8,9,"41"],[21,42,"o"],[21,74,"4"],[22,43,44,"20"],[22,53,"5"]],"x":1,"t":1330337799.92481},{"y":19,"d":[[22,44,"1"],[22,53,"8"]],"x":1,"t":1330337799.98108},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,9,"2"],[21,42,"a"],[21,74,"5"],[22,44,"2"],[22,52,53,"61"]],"x":1,"t":1330337800.02883},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,9,"3"],[21,37,75,"  -> flop->foo() /tmp/xdebug/test.php:9"],[22,44,"3"],[22,53,"3"]],"x":1,"t":1330337800.07675},{"d":[["r","    0.0019     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0020     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0021     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0023     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0024     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0025     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0026     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0028     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0029     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0030     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0031     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0032     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0034     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0035     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0036     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0037     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0038     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0040     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0041     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0042     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0043     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0044     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","/tmp/xdebug/out.trace.xt [unix][032][20][0024,0001][66%][ mapping 1 ]           "],["a"," "]],"x":1,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d",["a","1"],["a","0"]],"y":19,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d",["a","4"],["a","0"]],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337800.12868,"i":1},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,9,"6"],[21,42,"a"],[21,74,"5"],[22,44,"5"],[22,53,"9"]],"x":1,"t":1330337800.17685},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,9,"7"],[21,37,75,"  -> flop->foo() /tmp/xdebug/test.php:9"],[22,44,"6"],[22,52,53,"72"]],"x":1,"t":1330337800.2251},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,9,"8"],[21,37,75,"-> flop->foo() /tmp/xdebug/test.php:24 "],[22,44,"7"],[22,53,"5"]],"x":1,"t":1330337800.27673},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,9,"9"],[21,42,"a"],[21,74,"5"],[22,44,"8"],[22,53,"7"]],"x":1,"t":1330337800.3292},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,8,9,"51"],[21,37,75,"  -> flop->foo() /tmp/xdebug/test.php:9"],[22,44,"9"],[22,52,53,"80"]],"x":1,"t":1330337800.38069},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,9,"2"],[21,16,20,"33816"],[21,25,29,"-6288"],[21,35,76,"-> xdebug_stop_trace() Command line code:1"],[22,43,44,"30"],[22,53,"3"]],"x":1,"t":1330337800.43673},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,19,20,"80"],[21,25,29,["a"," "]],[21,35,76,["a"," "]],[22,44,"1"],[22,53,"6"]],"x":1,"t":1330337800.48506},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],[21,0,32,"TRACE END   [2012-02-27 10:16:30]"],[22,44,"2"],[22,53,"8"]],"x":1,"t":1330337800.53333},{"y":19,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",23,21],[22,44,"3"],[22,52,53,"91"]],"x":1,"t":1330337800.58515},{"y":20,"d":[[22,44,"4"],[22,53,"4"]],"x":1,"t":1330337800.63295},{"y":21,"d":[[22,33,38,"84][54"],[22,44,"5"],[22,53,"7"]],"x":1,"t":1330337800.68466},{"y":22,"d":[[22,33,38,"00][00"],[22,44,"6"],[22,52,69,"100%][ mapping 1 ]"]],"x":1,"t":1330337800.73672},{"y":21,"d":[[22,33,38,"84][54"],[22,44,"5"],[22,52,69,"97%][ mapping 1 ] "]],"x":1,"t":1330337801.66111},{"y":17,"d":[[0,0,32,"TRACE START [2012-02-27 10:16:30]"],[0,37,74,["a"," "]],[1,8,9,"12"],[1,16,19,"3874"],[1,24,29,"+13264"],[1,35,79,"-> include(/tmp/xdebug/test.php) Command line"],[2,1,9,"code:1   "],[2,15,20,["a"," "]],[2,28,29,["a"," "]],[2,39,75,["a"," "]],[3,8,9,"13"],[3,25,28,"+136"],[4,8,9,"16"],[5,8,9,"18"],[6,8,9,"19"],[7,8,9,"20"],[8,8,9,"21"],[9,8,9,"23"],[10,8,9,"24"],[11,8,9,"25"],[12,8,9,"26"],[13,8,9,"28"],[14,8,9,"29"],[22,33,38,"48][30"],[22,43,44,"16"],[22,49,53,"5][44"]],"x":5,"t":1330337802.48126},{"y":17,"x":5,"t":1330337802.61659},{"y":24,"d":[[23,0,":"]],"x":2,"t":1330337803.44899},{"y":24,"x":2,"t":1330337803.44907},{"y":24,"d":[[23,1,"q"]],"x":3,"t":1330337803.55668},{"y":24,"x":1,"t":1330337803.65284},{"y":24,"d":[[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337803.66238},{"y":24,"d":[[23,22,"n"]],"x":24,"t":1330337804.13288},{"y":24,"d":[[23,23,"i"]],"x":25,"t":1330337804.20047},{"y":24,"d":[[23,24,"c"]],"x":26,"t":1330337804.28086},{"y":24,"d":[[23,25,"e"]],"x":27,"t":1330337804.3528},{"y":24,"d":[[23,26,"."]],"x":28,"t":1330337804.42488},{"y":24,"d":[[23,27,"."]],"x":29,"t":1330337804.57276},{"y":24,"d":[[23,28,"h"]],"x":30,"t":1330337804.77679},{"y":24,"d":[[23,29,"e"]],"x":31,"t":1330337804.90465},{"y":24,"d":[[23,30,"r"]],"x":32,"t":1330337804.92457},{"y":24,"d":[[23,31,"e"]],"x":33,"t":1330337804.98863},{"y":24,"x":34,"t":1330337805.0806},{"y":24,"d":[[23,33,"w"]],"x":35,"t":1330337805.23274},{"y":24,"d":[[23,34,"e"]],"x":36,"t":1330337805.42092},{"y":24,"x":37,"t":1330337805.62477},{"y":24,"d":[[23,36,"c"]],"x":38,"t":1330337805.91271},{"y":24,"d":[[23,37,"a"]],"x":39,"t":1330337806.00064},{"y":24,"d":[[23,38,"n"]],"x":40,"t":1330337806.06057},{"y":24,"x":41,"t":1330337806.36904},{"y":24,"d":[[23,40,"s"]],"x":42,"t":1330337806.41696},{"y":24,"d":[[23,41,"e"]],"x":43,"t":1330337806.56479},{"y":24,"d":[[23,42,"e"]],"x":44,"t":1330337806.72075},{"y":24,"x":45,"t":1330337806.80885},{"y":24,"d":[[23,44,"t"]],"x":46,"t":1330337806.92864},{"y":24,"d":[[23,45,"h"]],"x":47,"t":1330337807.04086},{"y":24,"d":[[23,46,"e"]],"x":48,"t":1330337807.12462},{"y":24,"x":49,"t":1330337807.26479},{"y":24,"d":[[23,48,"w"]],"x":50,"t":1330337807.54099},{"y":24,"d":[[23,49,"o"]],"x":51,"t":1330337807.6486},{"y":24,"d":[[23,50,"r"]],"x":52,"t":1330337807.73672},{"y":24,"d":[[23,51,"k"]],"x":53,"t":1330337807.82473},{"y":24,"d":[[23,52,"f"]],"x":54,"t":1330337807.92088},{"y":24,"d":[[23,53,"l"]],"x":55,"t":1330337808.0287},{"y":24,"d":[[23,54,"o"]],"x":56,"t":1330337808.21016},{"y":24,"d":[[23,55,"w"]],"x":57,"t":1330337808.32174},{"y":24,"x":58,"t":1330337808.58749},{"y":24,"d":[[23,57,"a"]],"x":59,"t":1330337808.71911},{"y":24,"d":[[23,58,"n"]],"x":60,"t":1330337808.79929},{"y":24,"d":[[23,59,"d"]],"x":61,"t":1330337808.88736},{"y":24,"x":62,"t":1330337808.98717},{"y":24,"d":[[23,61,"o"]],"x":63,"t":1330337809.12724},{"y":24,"d":[[23,62,"r"]],"x":64,"t":1330337809.18331},{"y":24,"d":[[23,63,"d"]],"x":65,"t":1330337809.32348},{"y":24,"d":[[23,64,"e"]],"x":66,"t":1330337809.48741},{"y":24,"d":[[23,65,"r"]],"x":67,"t":1330337809.59128},{"y":24,"x":68,"t":1330337809.61922},{"y":24,"d":[[23,67,"o"]],"x":69,"t":1330337809.82727},{"y":24,"d":[[23,68,"f"]],"x":70,"t":1330337809.92319},{"y":24,"x":71,"t":1330337810.01523},{"y":24,"d":[[23,70,"a"]],"x":72,"t":1330337810.41135},{"y":24,"d":[[23,71,"l"]],"x":73,"t":1330337810.50723},{"y":24,"d":[[23,72,"l"]],"x":74,"t":1330337810.64352},{"y":24,"b":[["cp",22,21],["cp",0,22]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,0,74,"leon@dev:/tmp/xdebug$ nice..here we can see the workflow and order of all^C"],[23,22,72,["a"," "]]],"x":23,"B":[["cp",22,21],["cp",0,22]],"t":1330337810.94489},{"y":24,"d":[[23,22,"c"]],"x":24,"t":1330337811.18734},{"y":24,"d":[[23,23,"a"]],"x":25,"t":1330337811.28766},{"y":24,"d":[[23,24,"l"]],"x":26,"t":1330337811.42339},{"y":24,"d":[[23,25,"l"]],"x":27,"t":1330337811.57534},{"y":24,"d":[[23,26,"s"]],"x":28,"t":1330337811.65132},{"y":24,"d":[[23,27,"."]],"x":29,"t":1330337811.88336},{"y":24,"d":[[23,28,"."]],"x":30,"t":1330337812.03533},{"y":24,"d":[[23,29,"g"]],"x":31,"t":1330337812.5553},{"y":24,"d":[[23,30,"r"]],"x":32,"t":1330337812.66337},{"y":24,"d":[[23,31,"e"]],"x":33,"t":1330337812.72728},{"y":24,"d":[[23,32,"a"]],"x":34,"t":1330337812.87137},{"y":24,"d":[[23,33,"t"]],"x":35,"t":1330337813.00323},{"y":24,"x":36,"t":1330337813.08341},{"y":24,"d":[[23,35,"f"]],"x":37,"t":1330337813.25158},{"y":24,"d":[[23,36,"o"]],"x":38,"t":1330337813.39633},{"y":24,"d":[[23,37,"r"]],"x":39,"t":1330337813.42756},{"y":24,"x":40,"t":1330337813.51134},{"y":24,"d":[[23,39,"i"]],"x":41,"t":1330337813.75171},{"y":24,"d":[[23,40,"n"]],"x":42,"t":1330337813.83555},{"y":24,"d":[[23,41,"s"]],"x":43,"t":1330337813.93129},{"y":24,"d":[[23,42,"p"]],"x":44,"t":1330337814.06343},{"y":24,"d":[[23,43,"e"]],"x":45,"t":1330337814.38733},{"y":24,"d":[[23,44,"c"]],"x":46,"t":1330337814.52325},{"y":24,"d":[[23,45,"t"]],"x":47,"t":1330337814.7154},{"y":24,"d":[[23,46,"i"]],"x":48,"t":1330337814.79148},{"y":24,"d":[[23,47,"o"]],"x":49,"t":1330337814.87152},{"y":24,"d":[[23,48,"n"]],"x":50,"t":1330337814.96742},{"d":[["r","    0.0012     638744   +13264     -> include(/tmp/xdebug/test.php) Command line"],["r"," code:1                                                                         "],["r","    0.0013     640104    +1360       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0016     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0018     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0019     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0020     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0021     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0023     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0024     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0025     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0026     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0028     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0029     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0048     640104       +0       -> flop->foo() /tmp/xdebug/test.php:24     "],["r","    0.0049     640104       +0       -> flap->foo() /tmp/xdebug/test.php:25     "],["r","    0.0051     640104       +0         -> flop->foo() /tmp/xdebug/test.php:9    "],["r","    0.0052     633816    -6288     -> xdebug_stop_trace() Command line code:1   "],["r","    0.0052     633880                                                           "],["r","TRACE END   [2012-02-27 10:16:30]                                               "],["a"," "],["r","/tmp/xdebug/out.trace.xt [unix][048][30][0016,0005][44%][ mapping 1 ]           "],["r","leon@dev:/tmp/xdebug$ nice..here we can see the workflow and order of all^C     "],["r","leon@dev:/tmp/xdebug$ calls..great for inspection.                              "]],"x":51,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d",["a","1"],["a","0"],"d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d",["a","4"],["a","0"],"d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337815.20346,"i":1},{"y":24,"d":[[23,50,"."]],"x":52,"t":1330337815.35933},{"y":24,"d":[[23,51,52,"^C"]],"x":54,"t":1330337815.67152},{"y":24,"b":[["cp",21,20],["cp",0,21]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,22,52,["a"," "]]],"x":23,"B":[["cp",21,20],["cp",0,21]],"t":1330337815.67181},{"y":24,"d":[[23,22,"t"]],"x":24,"t":1330337818.11972},{"y":24,"d":[[23,23,"h"]],"x":25,"t":1330337818.23538},{"y":24,"d":[[23,24,"e"]],"x":26,"t":1330337818.32352},{"y":24,"d":[[23,25,"r"]],"x":27,"t":1330337818.43525},{"y":24,"d":[[23,26,"e"]],"x":28,"t":1330337818.49933},{"y":24,"x":29,"t":1330337818.77541},{"y":24,"d":[[23,28,"a"]],"x":30,"t":1330337818.89136},{"y":24,"d":[[23,29,"r"]],"x":31,"t":1330337819.01167},{"y":24,"d":[[23,30,"e"]],"x":32,"t":1330337819.07554},{"y":24,"x":33,"t":1330337819.13922},{"y":24,"d":[[23,32,"l"]],"x":34,"t":1330337819.28339},{"y":24,"d":[[23,33,"o"]],"x":35,"t":1330337819.45144},{"y":24,"d":[[23,34,"t"]],"x":36,"t":1330337819.51927},{"y":24,"x":37,"t":1330337819.61958},{"y":24,"d":[[23,36,"o"]],"x":38,"t":1330337819.75939},{"y":24,"d":[[23,37,"f"]],"x":39,"t":1330337819.85944},{"y":24,"x":40,"t":1330337819.93958},{"y":24,"d":[[23,39,"w"]],"x":41,"t":1330337820.15949},{"y":24,"d":[[23,40,"a"]],"x":42,"t":1330337820.29527},{"y":24,"d":[[23,41,"y"]],"x":43,"t":1330337820.41987},{"y":24,"d":[[23,42,"s"]],"x":44,"t":1330337820.75147},{"y":24,"x":45,"t":1330337820.75151},{"y":24,"d":[[23,44,"t"]],"x":46,"t":1330337820.88347},{"y":24,"d":[[23,45,"o"]],"x":47,"t":1330337820.91148},{"y":24,"x":48,"t":1330337821.03542},{"y":24,"d":[[23,47,"a"]],"x":49,"t":1330337821.1913},{"y":24,"d":[[23,48,"l"]],"x":50,"t":1330337821.29538},{"y":24,"d":[[23,49,"t"]],"x":51,"t":1330337821.55542},{"y":24,"d":[[23,50,"e"]],"x":52,"t":1330337821.71151},{"y":24,"d":[[23,51,"r"]],"x":53,"t":1330337821.7874},{"y":24,"x":54,"t":1330337821.88754},{"y":24,"d":[[23,53,"t"]],"x":55,"t":1330337821.99541},{"y":24,"d":[[23,54,"h"]],"x":56,"t":1330337822.0756},{"y":24,"d":[[23,55,"e"]],"x":57,"t":1330337822.17957},{"y":24,"x":58,"t":1330337822.28742},{"y":24,"d":[[23,57,"o"]],"x":59,"t":1330337822.38762},{"y":24,"d":[[23,58,"u"]],"x":60,"t":1330337822.45555},{"y":24,"d":[[23,59,"t"]],"x":61,"t":1330337822.50738},{"y":24,"d":[[23,60,"p"]],"x":62,"t":1330337822.6077},{"y":24,"d":[[23,61,"u"]],"x":63,"t":1330337822.68744},{"y":24,"d":[[23,62,"t"]],"x":64,"t":1330337822.77944},{"y":24,"x":65,"t":1330337822.90769},{"y":24,"d":[[23,64,"f"]],"x":66,"t":1330337823.17167},{"y":24,"d":[[23,65,"o"]],"x":67,"t":1330337823.23547},{"y":24,"d":[[23,65," "]],"x":66,"t":1330337823.62343},{"y":24,"d":[[23,64," "]],"x":65,"t":1330337823.71546},{"y":24,"d":[[23,64,"o"]],"x":66,"t":1330337824.16762},{"y":24,"d":[[23,65,"f"]],"x":67,"t":1330337824.2594},{"y":24,"x":68,"t":1330337824.35151},{"y":24,"d":[[23,67,"t"]],"x":69,"t":1330337824.47573},{"y":24,"d":[[23,68,"h"]],"x":70,"t":1330337824.54519},{"y":24,"d":[[23,69,"i"]],"x":71,"t":1330337824.5971},{"y":24,"d":[[23,70,"s"]],"x":72,"t":1330337824.92505},{"y":24,"b":[["cp",20,19],["cp",0,20]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,22,72,"there are lot of ways to alter the output of this^C"],[23,22,70,["a"," "]]],"x":23,"B":[["cp",20,19],["cp",0,20]],"t":1330337825.06218},{"y":24,"d":[[23,22,"x"]],"x":24,"t":1330337825.75796},{"y":24,"d":[[23,23,"d"]],"x":25,"t":1330337825.9339},{"y":24,"d":[[23,24,"e"]],"x":26,"t":1330337826.11799},{"y":24,"d":[[23,25,"b"]],"x":27,"t":1330337826.25008},{"y":24,"d":[[23,26,"u"]],"x":28,"t":1330337826.32616},{"y":24,"d":[[23,27,"g"]],"x":29,"t":1330337826.41417},{"y":24,"x":30,"t":1330337826.56211},{"y":24,"d":[[23,29,"u"]],"x":31,"t":1330337826.90613},{"y":24,"d":[[23,30,"t"]],"x":32,"t":1330337827.01007},{"y":24,"d":[[23,31,"l"]],"x":33,"t":1330337827.1941},{"y":24,"d":[[23,31," "]],"x":32,"t":1330337827.92202},{"y":24,"d":[[23,31,"i"]],"x":33,"t":1330337828.17019},{"y":24,"d":[[23,32,"l"]],"x":34,"t":1330337828.30612},{"y":24,"d":[[23,33,"i"]],"x":35,"t":1330337828.40603},{"y":24,"d":[[23,34,"t"]],"x":36,"t":1330337828.52997},{"y":24,"d":[[23,35,"y"]],"x":37,"t":1330337828.6745},{"y":24,"b":[["cp",19,18],["cp",0,19]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],["cp",17,23]],"x":1,"B":[["cp",19,18],["cp",0,19]],"t":1330337829.08442},{"y":24,"b":[["cp",18,17],["cp",0,18]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,0,35,"Usage:                              "]],"x":1,"B":[["cp",18,17],["cp",0,18]],"t":1330337829.09406},{"y":24,"b":[["cp",17,16],["cp",0,17]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,0,15,"    xdebug start"]],"x":1,"B":[["cp",17,16],["cp",0,17]],"t":1330337829.16734},{"y":24,"b":[["cp",16,14],["cp",0,16]],"d":[["cp",2,0],["cp",3,1],["cp",4,2],["cp",5,3],["cp",6,4],["cp",7,5],["cp",8,6],["cp",9,7],["cp",10,8],["cp",11,9],["cp",12,10],["cp",13,11],["cp",14,12],["cp",15,13],["cp",16,14],["cp",17,15],["cp",18,16],["cp",19,17],["cp",20,18],["cp",21,19],["cp",22,20],[21,0,17,"    xdebug profile"],[22,11,15,"trace"]],"x":1,"B":[["cp",16,14],["cp",0,16]],"t":1330337829.20226},{"y":24,"b":[["cp",14,10],["cp",0,14]],"d":[["cp",4,0],["cp",5,1],["cp",6,2],["cp",7,3],["cp",8,4],["cp",9,5],["cp",10,6],["cp",11,7],["cp",12,8],["cp",13,9],["cp",14,10],["cp",15,11],["cp",16,12],["cp",17,13],["cp",18,14],["cp",19,15],["cp",20,16],["cp",21,17],["cp",22,18],[19,0,19,"    xdebug summarize"],["cp",9,20],[21,0,50,"type 'xdebug --manual' to see the manual + examples"],["cp",9,22],[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"B":[["cp",14,10],["cp",0,14]],"t":1330337829.23906},{"y":24,"d":[[23,22,"x"]],"x":24,"t":1330337830.691},{"y":24,"d":[[23,23,"d"]],"x":25,"t":1330337830.92685},{"y":24,"d":[[23,24,"e"]],"x":26,"t":1330337831.08716},{"y":24,"d":[[23,25,"b"]],"x":27,"t":1330337831.23929},{"y":24,"d":[[23,26,"u"]],"x":28,"t":1330337831.29878},{"y":24,"d":[[23,27,"g"]],"x":29,"t":1330337831.37899},{"y":24,"x":30,"t":1330337831.51911},{"y":24,"d":[[23,29,"-"]],"x":31,"t":1330337831.66691},{"y":24,"d":[[23,30,"-"]],"x":32,"t":1330337831.8189},{"y":24,"d":[[23,31,"m"]],"x":33,"t":1330337832.03491},{"y":24,"d":[[23,32,"a"]],"x":34,"t":1330337832.17107},{"y":24,"d":[[23,33,"n"]],"x":35,"t":1330337832.24712},{"y":24,"d":[[23,34,"u"]],"x":36,"t":1330337832.33497},{"y":24,"d":[[23,35,"a"]],"x":37,"t":1330337832.51139},{"y":24,"d":[[23,36,"l"]],"x":38,"t":1330337832.67901},{"y":24,"b":[["cp",10,9],["cp",0,10]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",8,19],["cp",21,20],["cp",8,21],["cp",23,22],["cp",8,23]],"x":1,"B":[["cp",10,9],["cp",0,10]],"t":1330337833.06305},{"y":24,"b":[["cp",9,8],["cp",0,9]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",7,18],["cp",20,19],["cp",7,20],["cp",22,21],[22,0,36,"(please wait..)                      "]],"x":1,"B":[["cp",9,8],["cp",0,9]],"t":1330337833.07779},{"y":1,"b":[["cp",0,8]],"d":[["cp",7,0],["cp",0,1],["cp",0,2],["cp",0,3],["cp",0,4],["cp",0,5],["cp",0,6],["cp",0,8],["cp",0,9],["cp",0,10],["cp",0,11],["cp",0,12],["cp",0,13],["cp",0,14],["cp",0,15],["cp",0,16],["cp",0,17],["cp",0,19],["cp",0,21],["cp",0,22]],"x":1,"B":[["cp",0,8]],"t":1330337833.16843},{"y":24,"b":[[23,0,59,["a","7"]]],"d":[[0,0,8,"XDEBUG(1)"],[0,22,56,"User Contributed Perl Documentation"],[0,69,77,"XDEBUG(1)"],[2,0,3,"NAME"],[3,10,76,"xdebug - a cmdline utility to easify developing/testing with xdebug"],[5,0,7,"SYNOPSIS"],[6,10,78,"This utility demystifies the wonderfull world of XDebug's commandline"],[7,0,5,"usage,"],[8,10,67,"and requires no fiddling with php.ini configuration files."],[10,0,10,"DESCRIPTION"],[11,7,71,"This XDebug utility easifies (automated) multi-user profiling and"],[12,7,74,"tracing of php code. It also lets you configure XDebug's settings on"],[13,7,14,"the fly."],[15,0,2,"WHY"],[16,7,62,"Quickly outputting stats on the cmdline is always handy."],[18,0,7,"EXAMPLES"],[19,7,38,"Examples: xdebug start index.php"],[20,17,71,"xdebug start index.php out-%%p remote_host=84.34.34.23\""],[21,17,76,"xdebug start index.php out-%%p remote_host=`echo $SSH_CLIENT"],[22,7,22,"| sed s/ .*//g`\""],[23,1,59,"Manual page xdebug.1 line 1 (press h for help or q to quit)"]],"x":61,"f":[[23,0,59,["a","0"]]],"B":[[2,0,3,["a","1"]],[5,0,7,["a","1"]],[10,0,10,["a","1"]],[15,0,2,["a","1"]],["cp",5,18]],"t":1330337833.21778},{"y":24,"b":[["cp",0,23]],"d":[[23,1,59,"ESC                                                        "]],"x":5,"f":[["cp",0,23]],"t":1330337834.64711},{"y":24,"b":[[23,0,59,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",0,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",0,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",0,13],["cp",15,14],["cp",16,15],["cp",0,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,7,61,"          xdebug trace index.php trace collect_params=4"],[23,1,59,"Manual page xdebug.1 line 2 (press h for help or q to quit)"]],"x":61,"f":[[23,0,59,["a","0"]]],"B":[["cp",2,1],["cp",0,2],["cp",5,4],["cp",0,5],["cp",10,9],["cp",0,10],["cp",15,14],["cp",0,15],["cp",4,17],["cp",0,18]],"t":1330337834.64849},{"d":[["a"," "],["r","NAME                                                                            "],["r","          xdebug - a cmdline utility to easify developing/testing with xdebug   "],["a"," "],["r","SYNOPSIS                                                                        "],["r","          This utility demystifies the wonderfull world of XDebug's commandline "],["r","usage,                                                                          "],["r","          and requires no fiddling with php.ini configuration files.            "],["a"," "],["r","DESCRIPTION                                                                     "],["r","       This XDebug utility easifies (automated) multi-user profiling and        "],["r","       tracing of php code. It also lets you configure XDebug's settings on     "],["r","       the fly.                                                                 "],["a"," "],["r","WHY                                                                             "],["r","       Quickly outputting stats on the cmdline is always handy.                 "],["a"," "],["r","EXAMPLES                                                                        "],["r","       Examples: xdebug start index.php                                         "],["r","                 xdebug start index.php out-%%p remote_host=84.34.34.23\"        "],["r","                 xdebug start index.php out-%%p remote_host=`echo $SSH_CLIENT   "],["r","       | sed s/ .*//g`\"                                                         "],["r","                 xdebug trace index.php trace collect_params=4                  "],["r"," ESC                                                                            "]],"x":5,"B":[["a","0"],["r","11110000000000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],"d",["r","11111111000000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],"d","d","d",["r","11111111111000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],"d","d","d",["r","11100000000000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],"d",["r","11111111000000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],"d","d","d","d","d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337835.02706,"i":1},{"y":24,"b":[[23,0,59,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",2,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",2,12],["cp",14,13],["cp",15,14],["cp",2,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,7,61,"show_mem_delta=1\"                                      "],[23,1,59,"Manual page xdebug.1 line 5 (press h for help or q to quit)"]],"x":61,"f":[[23,0,59,["a","0"]]],"B":[["cp",1,0],["cp",2,1],["cp",4,3],["cp",1,4],["cp",9,8],["cp",1,9],["cp",14,13],["cp",1,14],["cp",3,16],["cp",1,17]],"t":1330337835.02715},{"y":24,"b":[["cp",0,23]],"d":[[23,1,59,"ESC                                                        "]],"x":5,"f":[["cp",0,23]],"t":1330337835.24715},{"y":24,"b":[[23,0,59,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",1,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",1,11],["cp",13,12],["cp",14,13],["cp",1,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,7,49,"          xdebug profile index.php out-%%p\""],[23,1,59,"Manual page xdebug.1 line 6 (press h for help or q to quit)"]],"x":61,"f":[[23,0,59,["a","0"]]],"B":[["cp",1,0],["cp",3,2],["cp",0,3],["cp",8,7],["cp",0,8],["cp",13,12],["cp",0,13],["cp",2,15],["cp",0,16]],"t":1330337835.24727},{"y":24,"b":[["cp",0,23]],"d":[[23,1,59,"ESCO                                                       "]],"x":6,"f":[["cp",0,23]],"t":1330337835.543},{"y":24,"b":[[23,0,59,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",0,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",0,10],["cp",12,11],["cp",13,12],["cp",0,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,42,70,"tmp; xdebug summarize tmp.cg\""],[23,1,59,"Manual page xdebug.1 line 7 (press h for help or q to quit)"]],"x":61,"f":[[23,0,59,["a","0"]]],"B":[["cp",2,1],["cp",0,2],["cp",7,6],["cp",0,7],["cp",12,11],["cp",0,12],["cp",1,14],["cp",0,15]],"t":1330337835.5431},{"y":24,"b":[["cp",0,23]],"d":[[23,1,59,"ESC                                                        "]],"x":5,"f":[["cp",0,23]],"t":1330337835.77905},{"y":24,"b":[[23,0,59,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",4,9],["cp",11,10],["cp",12,11],["cp",4,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,17,70,"ARGV=\"http://foo.com/slug?name=value\" xdebug trace    "],[23,1,59,"Manual page xdebug.1 line 8 (press h for help or q to quit)"]],"x":61,"f":[[23,0,59,["a","0"]]],"B":[["cp",1,0],["cp",2,1],["cp",6,5],["cp",1,6],["cp",11,10],["cp",1,11],["cp",0,13],["cp",1,14]],"t":1330337835.77915},{"y":24,"b":[["cp",0,23]],"d":[[23,1,59,"ESCO                                                       "]],"x":6,"f":[["cp",0,23]],"t":1330337835.96303},{"y":24,"b":[[23,0,59,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",3,8],["cp",10,9],["cp",11,10],["cp",3,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,7,66,"src/index.php out-%%p\"                                      "],[23,1,59,"Manual page xdebug.1 line 9 (press h for help or q to quit)"]],"x":61,"f":[[23,0,59,["a","0"]]],"B":[["cp",1,0],["cp",5,4],["cp",0,5],["cp",10,9],["cp",0,10],["cp",13,12],["cp",0,13]],"t":1330337835.96309},{"y":24,"b":[["cp",0,23]],"d":[[23,1,59,"ESC                                                        "]],"x":5,"f":[["cp",0,23]],"t":1330337836.16297},{"y":24,"b":[[23,0,59,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",2,7],["cp",9,8],["cp",10,9],["cp",2,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",2,22],[23,1,59,"Manual page xdebug.1 line 9 (press h for help or q to quit)"]],"x":61,"f":[[23,0,59,["a","0"]]],"B":[["cp",4,3],["cp",0,4],["cp",9,8],["cp",0,9],["cp",12,11],["cp",0,12]],"t":1330337836.16313},{"y":24,"b":[["cp",0,23]],"d":[[23,1,59,"ESCO                                                       "]],"x":6,"f":[["cp",0,23]],"t":1330337836.35111},{"y":24,"b":[[23,0,60,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",1,6],["cp",8,7],["cp",9,8],["cp",1,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",1,21],[22,22,79,"^-- hint: to emulate webrequests: in php parse $argv[0] in"],[23,1,60,"Manual page xdebug.1 line 10 (press h for help or q to quit)"]],"x":62,"f":[[23,0,60,["a","0"]]],"B":[["cp",3,2],["cp",0,3],["cp",8,7],["cp",0,8],["cp",11,10],["cp",0,11]],"t":1330337836.35128},{"y":24,"b":[["cp",0,23]],"d":[[23,1,60,"ESC                                                         "]],"x":5,"f":[["cp",0,23]],"t":1330337836.53089},{"y":24,"b":[[23,0,60,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",0,5],["cp",7,6],["cp",8,7],["cp",0,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",0,20],["cp",22,21],[22,0,79,"to your $_SERVER variable                                                       "],[23,1,60,"Manual page xdebug.1 line 11 (press h for help or q to quit)"]],"x":62,"f":[[23,0,60,["a","0"]]],"B":[["cp",2,1],["cp",0,2],["cp",7,6],["cp",0,7],["cp",10,9],["cp",0,10]],"t":1330337836.531},{"y":24,"b":[["cp",0,23]],"d":[[23,1,60,"ESC                                                         "]],"x":5,"f":[["cp",0,23]],"t":1330337836.76318},{"y":24,"b":[[23,0,60,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",4,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",4,19],["cp",21,20],["cp",22,21],["cp",4,22],[23,1,60,"Manual page xdebug.1 line 12 (press h for help or q to quit)"]],"x":62,"f":[[23,0,60,["a","0"]]],"B":[["cp",1,0],["cp",2,1],["cp",6,5],["cp",1,6],["cp",9,8],["cp",1,9]],"t":1330337836.76324},{"y":24,"b":[["cp",0,23]],"d":[[23,1,60,"ESC                                                         "]],"x":5,"f":[["cp",0,23]],"t":1330337837.46712},{"y":24,"b":[[23,0,60,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",3,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",3,18],["cp",20,19],["cp",21,20],["cp",3,21],[22,7,26,"Some XDebug options:"],[23,1,60,"Manual page xdebug.1 line 13 (press h for help or q to quit)"]],"x":62,"f":[[23,0,60,["a","0"]]],"B":[["cp",1,0],["cp",5,4],["cp",0,5],["cp",8,7],["cp",0,8]],"t":1330337837.4673},{"y":24,"b":[["cp",0,23]],"d":[[23,1,60,"ESC                                                         "]],"x":5,"f":[["cp",0,23]],"t":1330337837.891},{"y":24,"b":[[23,0,60,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",2,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",2,17],["cp",19,18],["cp",20,19],["cp",2,20],["cp",22,21],[22,7,44,"          - show_exception_trace=[0|1]"],[23,1,60,"Manual page xdebug.1 line 14 (press h for help or q to quit)"]],"x":62,"f":[[23,0,60,["a","0"]]],"B":[["cp",4,3],["cp",0,4],["cp",7,6],["cp",0,7]],"t":1330337837.89111},{"y":24,"b":[["cp",0,23]],"d":[[23,1,60,"ESCO                                                        "]],"x":6,"f":[["cp",0,23]],"t":1330337838.83921},{"y":24,"b":[[23,0,60,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",1,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",1,16],["cp",18,17],["cp",19,18],["cp",1,19],["cp",21,20],["cp",22,21],[22,24,44,"local_vars=[0|1]     "],[23,1,60,"Manual page xdebug.1 line 15 (press h for help or q to quit)"]],"x":62,"f":[[23,0,60,["a","0"]]],"B":[["cp",3,2],["cp",0,3],["cp",6,5],["cp",0,6]],"t":1330337838.83929},{"y":24,"b":[["cp",0,23]],"d":[[23,1,60,"ESC                                                         "]],"x":5,"f":[["cp",0,23]],"t":1330337839.27526},{"y":24,"b":[[23,0,60,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",0,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",0,15],["cp",17,16],["cp",18,17],["cp",0,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,24,39,"mem_delta=[0|1] "],[23,1,60,"Manual page xdebug.1 line 16 (press h for help or q to quit)"]],"x":62,"f":[[23,0,60,["a","0"]]],"B":[["cp",2,1],["cp",0,2],["cp",5,4],["cp",0,5]],"t":1330337839.27544},{"y":24,"b":[["cp",0,23]],"d":[[23,1,60,"ESCO                                                        "]],"x":6,"f":[["cp",0,23]],"t":1330337839.47919},{"y":24,"b":[[23,0,60,["a","7"]]],"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",2,14],["cp",16,15],["cp",17,16],["cp",2,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,19,38,["a"," "]],[23,1,60,"Manual page xdebug.1 line 17 (press h for help or q to quit)"]],"x":62,"f":[[23,0,60,["a","0"]]],"B":[["cp",1,0],["cp",2,1],["cp",4,3],["cp",1,4]],"t":1330337839.47926},{"y":24,"b":[["cp",0,23]],"d":[["cp",2,23]],"x":1,"f":[["cp",0,23]],"t":1330337840.17909},{"y":24,"d":[[23,0,20,"leon@dev:/tmp/xdebug$"]],"x":23,"t":1330337840.18489},{"y":24,"d":[[23,22,"j"]],"x":24,"t":1330337842.6871},{"y":24,"d":[[23,23,"u"]],"x":25,"t":1330337842.87924},{"y":24,"d":[[23,24,"s"]],"x":26,"t":1330337842.96308},{"y":24,"d":[[23,25,"t"]],"x":27,"t":1330337843.05515},{"y":24,"x":28,"t":1330337843.12287},{"y":24,"d":[[23,27,"f"]],"x":29,"t":1330337843.33919},{"y":24,"d":[[23,28,"i"]],"x":30,"t":1330337843.44728},{"y":24,"d":[[23,29,"f"]],"x":31,"t":1330337843.77523},{"y":24,"d":[[23,29," "]],"x":30,"t":1330337844.10707},{"y":24,"d":[[23,29,"d"]],"x":31,"t":1330337844.20716},{"y":24,"d":[[23,30,"d"]],"x":32,"t":1330337844.34319},{"y":24,"d":[[23,31,"l"]],"x":33,"t":1330337844.41945},{"y":24,"d":[[23,32,"e"]],"x":34,"t":1330337844.53556},{"y":24,"x":35,"t":1330337844.64346},{"y":24,"d":[[23,34,"a"]],"x":36,"t":1330337845.08355},{"y":24,"x":37,"t":1330337845.15938},{"y":24,"d":[[23,36,"b"]],"x":38,"t":1330337845.33596},{"y":24,"d":[[23,37,"i"]],"x":39,"t":1330337845.45168},{"y":24,"d":[[23,38,"t"]],"x":40,"t":1330337845.47552},{"y":24,"x":41,"t":1330337845.56354},{"y":24,"d":[[23,40,"w"]],"x":42,"t":1330337845.82332},{"y":24,"d":[[23,41,"i"]],"x":43,"t":1330337845.8993},{"y":24,"d":[[23,42,"t"]],"x":44,"t":1330337846.04395},{"y":24,"d":[[23,43,"h"]],"x":45,"t":1330337846.12355},{"y":24,"x":46,"t":1330337846.1438},{"y":24,"d":[[23,45,"i"]],"x":47,"t":1330337846.33976},{"y":24,"d":[[23,46,"t"]],"x":48,"t":1330337846.44},{"y":24,"d":[[23,47,"."]],"x":49,"t":1330337846.60417},{"y":24,"d":[[23,48,"."]],"x":50,"t":1330337846.75219},{"y":24,"d":[[23,49,"I"]],"x":51,"t":1330337847.14539},{"y":24,"x":52,"t":1330337847.22557},{"y":24,"d":[[23,51,"f"]],"x":53,"t":1330337847.40554},{"y":24,"d":[[23,52,"i"]],"x":54,"t":1330337847.4814},{"y":24,"d":[[23,53,"n"]],"x":55,"t":1330337847.53356},{"y":24,"d":[[23,54,"d"]],"x":56,"t":1330337847.64146},{"y":24,"x":57,"t":1330337847.72957},{"y":24,"d":[[23,56,"i"]],"x":58,"t":1330337847.92965},{"y":24,"d":[[23,57,"t"]],"x":59,"t":1330337848.1376},{"y":24,"x":60,"t":1330337848.26159},{"y":24,"d":[[23,59,"v"]],"x":61,"t":1330337848.44152},{"y":24,"d":[[23,60,"e"]],"x":62,"t":1330337848.52954},{"y":24,"d":[[23,61,"r"]],"x":63,"t":1330337848.57754},{"y":24,"d":[[23,62,"y"]],"x":64,"t":1330337848.65757},{"y":24,"x":65,"t":1330337848.73757},{"y":24,"d":[[23,64,"u"]],"x":66,"t":1330337849.15355},{"y":24,"d":[[23,65,"s"]],"x":67,"t":1330337849.24938},{"y":24,"d":[[23,66,"e"]],"x":68,"t":1330337849.34563},{"y":24,"d":[[23,67,"f"]],"x":69,"t":1330337849.51335},{"y":24,"d":[[23,68,"u"]],"x":70,"t":1330337849.59755},{"y":24,"d":[[23,69,"l"]],"x":71,"t":1330337849.75364},{"y":24,"d":[[23,70,"l"]],"x":72,"t":1330337849.90953},{"y":24,"d":[[23,71,72,"^C"]],"x":74,"t":1330337850.13759},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",1,13],["cp",15,14],["cp",16,15],["cp",1,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,22,72,["a"," "]]],"x":23,"B":[["cp",1,0],["cp",3,2],["cp",0,3]],"t":1330337850.13791},{"y":24,"d":[[23,22,"I"]],"x":24,"t":1330337850.98574},{"y":24,"x":25,"t":1330337851.04944},{"y":24,"d":[[23,24,"c"]],"x":26,"t":1330337851.53363},{"y":24,"d":[[23,25,"a"]],"x":27,"t":1330337851.58964},{"y":24,"d":[[23,26,"n"]],"x":28,"t":1330337851.66575},{"y":24,"x":29,"t":1330337851.73371},{"y":24,"d":[[23,28,"e"]],"x":30,"t":1330337851.92961},{"y":24,"d":[[23,29,"a"]],"x":31,"t":1330337852.06158},{"y":24,"d":[[23,30,"s"]],"x":32,"t":1330337852.19769},{"y":24,"d":[[23,31,"i"]],"x":33,"t":1330337852.34565},{"y":24,"d":[[23,32,"l"]],"x":34,"t":1330337852.42161},{"y":24,"d":[[23,33,"y"]],"x":35,"t":1330337852.59385},{"y":24,"x":36,"t":1330337852.67375},{"y":24,"d":[[23,35,"a"]],"x":37,"t":1330337853.07376},{"y":24,"d":[[23,36,37,"lt"]],"x":39,"t":1330337853.07385},{"y":24,"d":[[23,38,"e"]],"x":40,"t":1330337853.13777},{"y":24,"d":[[23,39,"r"]],"x":41,"t":1330337853.2136},{"d":[["r","       Quickly outputting stats on the cmdline is always handy.                 "],["a"," "],["r","EXAMPLES                                                                        "],["r","       Examples: xdebug start index.php                                         "],["r","                 xdebug start index.php out-%%p remote_host=84.34.34.23\"        "],["r","                 xdebug start index.php out-%%p remote_host=`echo $SSH_CLIENT   "],["r","       | sed s/ .*//g`\"                                                         "],["r","                 xdebug trace index.php trace collect_params=4                  "],["r","       show_mem_delta=1\"                                                        "],["r","                 xdebug profile index.php out-%%p\"                              "],["r","                 xdebug profile index.php tmp; xdebug summarize tmp.cg\"         "],["r","                 ARGV=\"http://foo.com/slug?name=value\" xdebug trace             "],["r","       src/index.php out-%%p\"                                                   "],["a"," "],["r","                      ^-- hint: to emulate webrequests: in php parse $argv[0] in"],["r","to your $_SERVER variable                                                       "],["a"," "],["r","       Some XDebug options:                                                     "],["r","                 - show_exception_trace=[0|1]                                   "],["r","                 - show_local_vars=[0|1]                                        "],["r","                 - show_mem_delta=[0|1]                                         "],["r","                 -                                                              "],["r","leon@dev:/tmp/xdebug$ just fiddle a bit with it..I find it very usefull^C       "],["r","leon@dev:/tmp/xdebug$ I can easily alter                                        "]],"x":42,"B":[["a","0"],"d",["r","11111111000000000000000000000000000000000000000000000000000000000000000000000000"],["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337853.32155,"i":1},{"y":24,"d":[[23,41,"x"]],"x":43,"t":1330337854.52305},{"y":24,"d":[[23,42,"d"]],"x":44,"t":1330337854.59497},{"y":24,"d":[[23,43,"e"]],"x":45,"t":1330337854.73919},{"y":24,"d":[[23,44,"b"]],"x":46,"t":1330337854.79914},{"y":24,"d":[[23,45,"u"]],"x":47,"t":1330337854.85099},{"y":24,"d":[[23,46,"g"]],"x":48,"t":1330337854.94279},{"y":24,"x":49,"t":1330337855.01483},{"y":24,"d":[[23,48,"s"]],"x":50,"t":1330337855.1508},{"y":24,"d":[[23,49,"e"]],"x":51,"t":1330337855.37514},{"y":24,"d":[[23,50,"t"]],"x":52,"t":1330337855.59917},{"y":24,"d":[[23,51,"t"]],"x":53,"t":1330337855.75518},{"y":24,"d":[[23,52,"i"]],"x":54,"t":1330337855.84316},{"y":24,"d":[[23,53,"n"]],"x":55,"t":1330337855.93895},{"y":24,"d":[[23,54,"g"]],"x":56,"t":1330337855.95903},{"y":24,"d":[[23,55,"s"]],"x":57,"t":1330337856.14286},{"y":24,"x":58,"t":1330337856.28708},{"y":24,"d":[[23,57,"w"]],"x":59,"t":1330337856.52707},{"y":24,"d":[[23,58,"i"]],"x":60,"t":1330337856.61892},{"y":24,"d":[[23,59,"t"]],"x":61,"t":1330337856.72362},{"y":24,"d":[[23,60,"h"]],"x":62,"t":1330337856.94336},{"y":24,"d":[[23,61,62,"ou"]],"x":64,"t":1330337856.955},{"y":24,"d":[[23,63,"t"]],"x":65,"t":1330337857.04079},{"y":24,"x":66,"t":1330337857.33917},{"y":24,"d":[[23,65,66,"^C"]],"x":68,"t":1330337857.71919},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",0,12],["cp",14,13],["cp",15,14],["cp",0,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,22,66,["a"," "]]],"x":23,"B":[["cp",2,1],["cp",0,2]],"t":1330337857.7195},{"y":24,"d":[[23,22,"f"]],"x":24,"t":1330337859.015},{"y":24,"d":[[23,23,"i"]],"x":25,"t":1330337859.11905},{"y":24,"d":[[23,24,"d"]],"x":26,"t":1330337859.25109},{"y":24,"d":[[23,25,"d"]],"x":27,"t":1330337859.35519},{"y":24,"d":[[23,26,"l"]],"x":28,"t":1330337859.56718},{"y":24,"d":[[23,27,"i"]],"x":29,"t":1330337859.58699},{"y":24,"d":[[23,28,"n"]],"x":30,"t":1330337859.67497},{"y":24,"d":[[23,29,"g"]],"x":31,"t":1330337859.75516},{"y":24,"x":32,"t":1330337859.94773},{"y":24,"d":[[23,31,"w"]],"x":33,"t":1330337860.36363},{"y":24,"d":[[23,32,"i"]],"x":34,"t":1330337860.47565},{"y":24,"d":[[23,33,"t"]],"x":35,"t":1330337860.58368},{"y":24,"d":[[23,34,"h"]],"x":36,"t":1330337860.7037},{"y":24,"x":37,"t":1330337860.72374},{"y":24,"d":[[23,36,"p"]],"x":38,"t":1330337860.8759},{"y":24,"d":[[23,37,"h"]],"x":39,"t":1330337860.99152},{"y":24,"d":[[23,38,"p"]],"x":40,"t":1330337861.1156},{"y":24,"d":[[23,39,"."]],"x":41,"t":1330337861.52368},{"y":24,"d":[[23,40,"i"]],"x":42,"t":1330337861.80785},{"y":24,"d":[[23,41,"n"]],"x":43,"t":1330337861.88759},{"y":24,"d":[[23,42,"i"]],"x":44,"t":1330337862.06797},{"y":24,"x":45,"t":1330337862.57585},{"y":24,"d":[[23,44,"("]],"x":46,"t":1330337862.79968},{"y":24,"d":[[23,45,"y"]],"x":47,"t":1330337863.03569},{"y":24,"d":[[23,46,"o"]],"x":48,"t":1330337863.11168},{"y":24,"d":[[23,47,"u"]],"x":49,"t":1330337863.21181},{"y":24,"x":50,"t":1330337863.26354},{"y":24,"d":[[23,49,"d"]],"x":51,"t":1330337863.66379},{"y":24,"d":[[23,50,52,"ont"]],"x":54,"t":1330337863.70757},{"y":24,"x":55,"t":1330337863.83174},{"y":24,"d":[[23,54,"w"]],"x":56,"t":1330337863.96368},{"y":24,"d":[[23,55,"a"]],"x":57,"t":1330337864.08765},{"y":24,"d":[[23,56,"n"]],"x":58,"t":1330337864.17576},{"y":24,"d":[[23,57,"t"]],"x":59,"t":1330337864.30376},{"y":24,"x":60,"t":1330337864.37212},{"y":24,"d":[[23,59,"t"]],"x":61,"t":1330337864.50777},{"y":24,"d":[[23,60,"h"]],"x":62,"t":1330337864.62759},{"y":24,"d":[[23,61,"a"]],"x":63,"t":1330337864.7076},{"y":24,"d":[[23,62,"t"]],"x":64,"t":1330337864.8196},{"y":24,"x":65,"t":1330337864.90377},{"y":24,"d":[[23,64,"o"]],"x":66,"t":1330337865.0518},{"y":24,"d":[[23,65,"n"]],"x":67,"t":1330337865.13968},{"y":24,"x":68,"t":1330337865.19565},{"y":24,"d":[[23,67,"a"]],"x":69,"t":1330337865.59584},{"y":24,"x":70,"t":1330337865.71185},{"y":24,"d":[[23,69,"l"]],"x":71,"t":1330337865.84828},{"y":24,"d":[[23,70,"i"]],"x":72,"t":1330337865.93573},{"y":24,"d":[[23,71,"v"]],"x":73,"t":1330337866.0037},{"y":24,"d":[[23,72,"e"]],"x":74,"t":1330337866.07571},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",11,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,22,74,"fiddling with php.ini (you dont want that on a live^C"],[23,22,72,["a"," "]]],"x":23,"B":[["cp",1,0],["cp",2,1]],"t":1330337866.50812},{"y":24,"d":[[23,22,"d"]],"x":24,"t":1330337867.22387},{"y":24,"d":[[23,22," "]],"x":23,"t":1330337867.74391},{"y":24,"d":[[23,22,"s"]],"x":24,"t":1330337867.83576},{"y":24,"d":[[23,23,"e"]],"x":25,"t":1330337868.00791},{"y":24,"d":[[23,24,27,"rver"]],"x":29,"t":1330337868.32821},{"y":24,"d":[[23,28,")"]],"x":30,"t":1330337868.75204},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",13,12],["cp",10,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,22,74,"server)^C                                            "],[23,22,28,["a"," "]]],"x":23,"B":[["cp",1,0]],"t":1330337869.38435},{"y":24,"d":[[23,22,23,"al"]],"x":25,"t":1330337870.05277},{"y":24,"d":[[23,24,"s"]],"x":26,"t":1330337870.08027},{"y":24,"d":[[23,25,"o"]],"x":27,"t":1330337870.22033},{"y":24,"d":[[23,26,"."]],"x":28,"t":1330337870.84458},{"y":24,"d":[[23,27,"."]],"x":29,"t":1330337870.98446},{"y":24,"d":[[23,28,"i"]],"x":30,"t":1330337871.19716},{"y":24,"d":[[23,29,"t"]],"x":31,"t":1330337871.2845},{"y":24,"x":32,"t":1330337871.36851},{"y":24,"d":[[23,31,"w"]],"x":33,"t":1330337871.51673},{"y":24,"d":[[23,32,"o"]],"x":34,"t":1330337871.61235},{"y":24,"d":[[23,33,"r"]],"x":35,"t":1330337871.71644},{"y":24,"d":[[23,34,"k"]],"x":36,"t":1330337871.77239},{"y":24,"d":[[23,35,"s"]],"x":37,"t":1330337871.89293},{"y":24,"x":38,"t":1330337872.02028},{"y":24,"d":[[23,37,"p"]],"x":39,"t":1330337872.32469},{"y":24,"d":[[23,38,"e"]],"x":40,"t":1330337872.38452},{"y":24,"d":[[23,39,"r"]],"x":41,"t":1330337872.44465},{"d":[["r","       Examples: xdebug start index.php                                         "],["r","                 xdebug start index.php out-%%p remote_host=84.34.34.23\"        "],["r","                 xdebug start index.php out-%%p remote_host=`echo $SSH_CLIENT   "],["r","       | sed s/ .*//g`\"                                                         "],["r","                 xdebug trace index.php trace collect_params=4                  "],["r","       show_mem_delta=1\"                                                        "],["r","                 xdebug profile index.php out-%%p\"                              "],["r","                 xdebug profile index.php tmp; xdebug summarize tmp.cg\"         "],["r","                 ARGV=\"http://foo.com/slug?name=value\" xdebug trace             "],["r","       src/index.php out-%%p\"                                                   "],["a"," "],["r","                      ^-- hint: to emulate webrequests: in php parse $argv[0] in"],["r","to your $_SERVER variable                                                       "],["a"," "],["r","       Some XDebug options:                                                     "],["r","                 - show_exception_trace=[0|1]                                   "],["r","                 - show_local_vars=[0|1]                                        "],["r","                 - show_mem_delta=[0|1]                                         "],["r","                 -                                                              "],["r","leon@dev:/tmp/xdebug$ just fiddle a bit with it..I find it very usefull^C       "],["r","leon@dev:/tmp/xdebug$ I can easily alter xdebug settings without ^C             "],["r","leon@dev:/tmp/xdebug$ fiddling with php.ini (you dont want that on a live^C     "],["r","leon@dev:/tmp/xdebug$ server)^C                                                 "],["r","leon@dev:/tmp/xdebug$ also..it works perf                                       "]],"x":42,"B":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"y":24,"b":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"f":[["a","7"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"U":[["a","0"],"d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"],"t":1330337872.59814,"i":1},{"y":24,"d":[[23,41,42,"ec"]],"x":44,"t":1330337873.39408},{"y":24,"d":[[23,43,"t"]],"x":45,"t":1330337873.57382},{"y":24,"d":[[23,44,"l"]],"x":46,"t":1330337873.68987},{"y":24,"d":[[23,45,"y"]],"x":47,"t":1330337873.79796},{"y":24,"x":48,"t":1330337873.974},{"y":24,"d":[[23,47,"i"]],"x":49,"t":1330337874.29029},{"y":24,"d":[[23,48,"f"]],"x":50,"t":1330337874.37799},{"y":24,"x":51,"t":1330337874.46999},{"y":24,"d":[[23,50,"y"]],"x":52,"t":1330337874.59384},{"y":24,"d":[[23,51,"o"]],"x":53,"t":1330337874.66593},{"y":24,"d":[[23,52,"u"]],"x":54,"t":1330337874.74595},{"y":24,"x":55,"t":1330337874.84214},{"y":24,"d":[[23,54,"w"]],"x":56,"t":1330337875.23409},{"y":24,"d":[[23,55,"a"]],"x":57,"t":1330337875.40613},{"y":24,"d":[[23,56,"n"]],"x":58,"t":1330337875.49814},{"y":24,"d":[[23,57,"t"]],"x":59,"t":1330337875.62185},{"y":24,"x":60,"t":1330337875.69399},{"y":24,"d":[[23,59,"t"]],"x":61,"t":1330337875.81009},{"y":24,"d":[[23,60,"o"]],"x":62,"t":1330337875.90192},{"y":24,"x":63,"t":1330337875.96216},{"y":24,"d":[[23,62,"t"]],"x":64,"t":1330337876.51406},{"y":24,"d":[[23,63,65,"rig"]],"x":67,"t":1330337876.54184},{"y":24,"d":[[23,66,"g"]],"x":68,"t":1330337876.6901},{"y":24,"d":[[23,67,"e"]],"x":69,"t":1330337876.73409},{"y":24,"d":[[23,68,"r"]],"x":70,"t":1330337876.80216},{"y":24,"d":[[23,69,70,"^C"]],"x":72,"t":1330337877.35018},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",12,11],["cp",9,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],["cp",23,22],[23,22,70,["a"," "]]],"x":23,"t":1330337877.35048},{"y":24,"d":[[23,22,"r"]],"x":24,"t":1330337878.49005},{"y":24,"d":[[23,23,"e"]],"x":25,"t":1330337878.54614},{"y":24,"d":[[23,24,"m"]],"x":26,"t":1330337878.60196},{"y":24,"d":[[23,25,"o"]],"x":27,"t":1330337878.67403},{"y":24,"d":[[23,26,"t"]],"x":28,"t":1330337878.75786},{"y":24,"d":[[23,27,"e"]],"x":29,"t":1330337878.80989},{"y":24,"x":30,"t":1330337880.14206},{"y":24,"d":[[23,29,"s"]],"x":31,"t":1330337880.42215},{"y":24,"d":[[23,30,"e"]],"x":32,"t":1330337881.03406},{"y":24,"d":[[23,31,"s"]],"x":33,"t":1330337881.23399},{"y":24,"d":[[23,32,"s"]],"x":34,"t":1330337881.37015},{"y":24,"d":[[23,33,"i"]],"x":35,"t":1330337881.52221},{"y":24,"d":[[23,34,"o"]],"x":36,"t":1330337881.60611},{"y":24,"d":[[23,35,"n"]],"x":37,"t":1330337881.72207},{"y":24,"d":[[23,36,"s"]],"x":38,"t":1330337881.85434},{"y":24,"d":[[23,37,","]],"x":39,"t":1330337883.91136},{"y":24,"x":40,"t":1330337883.99902},{"y":24,"d":[[23,39,"o"]],"x":41,"t":1330337884.18727},{"y":24,"d":[[23,40,"r"]],"x":42,"t":1330337884.27116},{"y":24,"x":43,"t":1330337884.37113},{"y":24,"d":[[23,42,"m"]],"x":44,"t":1330337884.51528},{"y":24,"d":[[23,43,"u"]],"x":45,"t":1330337884.70732},{"y":24,"d":[[23,44,"l"]],"x":46,"t":1330337884.85161},{"y":24,"d":[[23,45,"t"]],"x":47,"t":1330337885.07937},{"y":24,"d":[[23,46,"i"]],"x":48,"t":1330337885.21112},{"y":24,"d":[[23,47,"-"]],"x":49,"t":1330337885.45135},{"y":24,"d":[[23,48,"u"]],"x":50,"t":1330337885.73146},{"y":24,"d":[[23,49,"s"]],"x":51,"t":1330337885.80726},{"y":24,"d":[[23,50,"e"]],"x":52,"t":1330337885.8594},{"y":24,"d":[[23,51,"r"]],"x":53,"t":1330337885.91915},{"y":24,"x":54,"t":1330337886.37143},{"y":24,"d":[[23,53,54,"se"]],"x":56,"t":1330337886.75552},{"y":24,"d":[[23,55,"s"]],"x":57,"t":1330337886.81535},{"y":24,"d":[[23,56,"s"]],"x":58,"t":1330337886.97133},{"y":24,"d":[[23,57,"i"]],"x":59,"t":1330337887.06724},{"y":24,"d":[[23,58,"o"]],"x":60,"t":1330337887.15925},{"y":24,"d":[[23,59,"n"]],"x":61,"t":1330337887.26751},{"y":24,"d":[[23,60,"s"]],"x":62,"t":1330337887.87945},{"y":24,"d":[[23,61,"."]],"x":63,"t":1330337888.07522},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",11,10],["cp",8,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,22,70,"remote sessions, or multi-user sessions.^C       "],[23,22,61,["a"," "]]],"x":23,"t":1330337888.49178},{"y":24,"d":[[23,22,"e"]],"x":24,"t":1330337889.28746},{"y":24,"d":[[23,23,"n"]],"x":25,"t":1330337889.37554},{"y":24,"d":[[23,24,"j"]],"x":26,"t":1330337889.57947},{"y":24,"d":[[23,25,"o"]],"x":27,"t":1330337889.65939},{"y":24,"d":[[23,26,"y"]],"x":28,"t":1330337889.89156},{"y":24,"d":[[23,27,"!"]],"x":29,"t":1330337890.33956},{"y":24,"d":[["cp",1,0],["cp",2,1],["cp",3,2],["cp",4,3],["cp",5,4],["cp",6,5],["cp",7,6],["cp",8,7],["cp",9,8],["cp",10,9],["cp",7,10],["cp",12,11],["cp",13,12],["cp",14,13],["cp",15,14],["cp",16,15],["cp",17,16],["cp",18,17],["cp",19,18],["cp",20,19],["cp",21,20],["cp",22,21],[22,22,63,"enjoy!^C                                  "],[23,22,27,["a"," "]]],"x":23,"t":1330337890.95571},{"y":24,"d":[[23,22,"e"]],"x":24,"t":1330337891.22336},{"y":24,"d":[[23,23,"x"]],"x":25,"t":1330337891.56334},{"y":24,"d":[[23,24,"i"]],"x":26,"t":1330337891.71932},{"y":24,"d":[[23,25,"t"]],"x":27,"t":1330337891.84352},{"y":24,"d":[["cp",2,0],["cp",3,1],["cp",4,2],["cp",5,3],["cp",6,4],["cp",7,5],["cp",8,6],["cp",9,7],["cp",5,8],["cp",11,9],["cp",12,10],["cp",13,11],["cp",14,12],["cp",15,13],["cp",16,14],["cp",17,15],["cp",18,16],["cp",19,17],["cp",20,18],["cp",21,19],["cp",22,20],["cp",23,21],[22,0,29,"exit                          "],["cp",5,23]],"x":1,"t":1330337892.0692}]} ),
    // eval( {$data} ),
    datafile: false,
    // styles: ".playterm { overflow:hidden; font-size:12px;font-family:monospace,Courier New; line-height:15px; background-color:#000000; border:1px solid #555; padding:10px 10px 10px 10px;border-radius: 8px; -moz-border-radius: 8px; -webkit-border-radius: 8px; -khtml-border-radius: 8px; -moz-box-shadow: 5px 6px 21px #DDD; -webkit-box-shadow: 5px 6px 21px #DDD; box-shadow: 5px 6px 21px #DDD; -ms-filter: \"progid:DXImageTransform.Microsoft.Shadow(Strength=21, Direction=110, Color='#DDDDDD')\"; filter: progid:DXImageTransform.Microsoft.Shadow(Strength=21, Direction=110, Color='#DDDDDD'); }.playterm pre {font-family:monospace,Courier New,Courier,Arial; }.playterm_button {position:absolute;cursor:pointer;overflow:hidden}.playterm_transport{height:27px; overflow:hidden; position:absolute;}.playterm_skin{height:27px}.playterm_transportbar{background-color:#ff5a4b;height:20px;width:0px; position:absolute;margin:382px 10px 0px 10px }.playterm_embed{font-family:Verdana,Arial; font-size:10px; position:absolute; width:482px; height:68px; text-align:center; color:#555}.playterm_more{height:18px;line-height:0px;padding:0;position:absolute;text-indent:15px;width:99px;cursor:pointer}.playterm_more a:link, .playterm_more a:visited, .playterm a:hover, .playterm a:active {text-decoration:none;line-height:8px;font-family:Verdana,Arial; font-size:10px; color:#ff5a4b;font-weight:bold;margin:0;padding:0}.playterm_embed:hover{color:#FFF} .pluginbutton { width:49px; height:41px; padding:16px; text-align:center; background-color:#444;font-family:Verdana,Arial; color:#777; font-size:12px;line-height:19px; font-weight:bold; float:right; position:absolute} .pluginbutton:hover{ background-color:#666; color:#FFF; } .playtermcurved { border-radius: 8px; -moz-border-radius: 8px; -webkit-border-radius: 8px; -khtml-border-radius: 8px; }",
    styles: "",
    //********* global conf
        parent:false,
    uid: false,
    args: { "playtermpath": false, 
            "embed": false,
            "file": false,
            "size": "80x24"
          },

    //********* states
        buttons: 0, // number of buttons
    loaded: false,
    state: { playing: false, pause: false },
    idUpdate: -1,
    
    //********** etc
    // div element containing jsttyplay
    terminal: false, 
    sizes: { "80x24": { 
                        // width: "560px",
                        height: "430px"
                        // marginTop: "0px",
                        // // marginTop: "430px",dd
                        // playbutton: "84px 10px 10px 170px",
                        // moreMargin: "438px 0px 0px 0px",
                        // embedMargin: "319px 0px 0px 45px",
                        // buttonMargin: "10px 0px 0px 200px",
                        // transport: { width: "582px", 
                                     // skin: "url({$playtermpath}/gfx/playterm.skin.gif) no-repeat"
                                   // },
                        // transportbar: { range: [105,566], 
                                        // width: 460,
                                        // margin: "430px 0px 0px 10px",
                                        // start: 109 }
                      },
             "120x35":{ width: "851px",
                        height: "589px",
                        marginTop: "599px",
                        playbutton: "177px 10px 10px 326px",
                        embedMargin: "434px 0px 0px 190px",
                        moreMargin: "607px 0px 0px 0px",
                        transport: { width: "873px", 
                                     skin: "url({$playtermpath}/gfx/playterm.skin-120.gif) no-repeat"
                                   },
                        transportbar: { range: [105,761],           
                                        margin: "603px 0px 0px 10px",
                                        width: 740,
                                        start: 109 }          
                       }
            },

    //********** onliner shortcuts for getElementById() and pseudo smarty template engine
    $ :           function ( id ){ var el   = document.getElementById( id ); var tags = ["div","img","span","form","b","a","i","u","td","table"]; if( el && el.id != id && el.name == id ){ for( i in tags ){ var els = document.getElementsByTagName( tags[i] ); for( j in els ) if( els[j].id == id ) return els[j]; } } return el;},
    tplVars:      {},
    smartyAssign: function ( varname, value )  { this.tplVars[ varname ] = value; },
    smartyFetch:  function ( content )          { for( key in this.tplVars ){ reg = new RegExp( "\\{\\$"+key+"\\}", 'g' ); content = content.replace( reg, this.tplVars[key] ); } reg = new RegExp( "\\{\\$[A-Za-z0-9_-]*\\}", 'g' ); content = content.replace( reg, "" ); return content; },

    init: function(id){
      // var parent         = this.getParentDOMId();
      var parent = document.getElementById(id)
      this.uid           = (new Date()).getTime();
      // mark scripttag as inited 
      if( !_assert( parent != undefined, "parent is null") ) return;
      if( !_assert( this.getArguments(parent), "something is wrong with the class-attribute which prevents further loading") ) return;
      if( !_assert( parent.parentNode != undefined, "PLAYTERM PLAYER could not be initialized", true ) ) return;
      // we are ready to go, set extra mark in classname to prevent double scan on uninitialized script-tags by getParentDOMId()
      parent.className = "inited_"+parent.className;
      // draw the player canvas 
      if( !_assert( String(parent.parentNode.tagName).toLowerCase() == "div", "javascript is not embedded in div", true ) ) return;
      this.initLayout(parent.parentNode );
      console.log("just initialized");
    },

    getArguments: function(parent){
      // set default playtermpath
      this.args.playtermpath  = document.location.href.substr( 0,document.location.href.lastIndexOf("/") )+"/";
      // lets set static playtermpath if we are not local
      if( String( parent.id ).match("playterm-") != null )
        this.args.playtermpath = window.baseurl != undefined ? baseurl+"/lib/playterm/js" : "http://www.playterm.org/lib/playterm/js";

      parent.className = parent.className.replace(/^\s+/,'').replace(/\s+$/,'');  // poor man's trim() function 
      var args = parent.className.split(" ");
      for( var i = 0; i < args.length; i++ ){
        var keyvalue = args[i].split(":");
        if( !_assert( keyvalue.length == 2, "key/value pair not correctly formatted in class-attribute 'key:value key:value'" ) ){
          this.args.playtermpath = "http://www.playterm.org/lib/playterm/js";
          this.args.size         = "80x24";
        }
        __trace( keyvalue );
        switch( keyvalue[0] ){
          // set path to playterm-source
          case "playtermpath":      this.args.playtermpath = this.args.playtermpath+keyvalue[1];
                                    break;
          case "file":              this.args.file = keyvalue[1];
                                    break;
          case "embed":             this.args.embed = (keyvalue[1] != "false");
                                    break;
          case "size":              if( _assert( keyvalue[1] == "80x24" || keyvalue[1] == "120x35", "size-value can only by 80x24 or 120x35" ) )
                                      this.args.size = keyvalue[1];
                                    break;
        }
      }
      this.smartyAssign("playtermpath", this.args.playtermpath );
      _trace( this.args );
      return true;
    },

    initLayout: function(parent){
      if( !_assert( parent, "initLayout got no parent") ) return;
            playterm_player.parent = parent;
      var css          = document.createElement('style');
      var terminal     = this.terminal = document.createElement('div');
      var playbutton   = document.createElement('img');
      var skin         = document.createElement('div');
      var transport    = document.createElement('div');
      var more         = document.createElement('div');
      var embed        = document.createElement('div');
      var moreLink     = document.createElement("a");
      var moreText     = document.createTextNode("more!  |  ");
      var liveLink     = document.createElement("a");
      var liveText     = document.createTextNode("live!");
      var transportbar = document.createElement('div');
      var cleardiv     = document.createElement('div');
      var IE6          = navigator.userAgent.toLowerCase().indexOf('msie 6') != -1;

      // webservice feature: if not processed by smarty, set playtermpatha
      this.styles = this.smartyFetch( this.styles );

      _trace( this.sizes);

      cleardiv.style.clear = "both";
      cleardiv.style.marginBottom = "28px";
      css.setAttribute("type", "text/css")
      if( css.styleSheet ) // IE
        css.styleSheet.cssText = this.styles;
      else // WORLD
        css.appendChild( document.createTextNode( this.styles ) );
      var playbutton_img       = "/img/512Px-478.png";
      // webservice feature: if not processed by smarty, set playtermpath
      // playbutton_img = this.smartyFetch( playbutton_img );

      // playbutton.src           = playbutton_img;
      // playbutton.className     = "playterm_button";
      // playbutton.id            = "playterm_button_player_"+this.uid;
      // playbutton.onclick       = this.togglePlay;
      transport.className      = "playterm_transport";
      transport.id             = "playterm_transport_player_"+this.uid;
      transportbar.className   = "playterm_transportbar";
      transportbar.id          = "playterm_transportbar_player_"+this.uid;
    
      if( this.args.embed ){
        moreLink.appendChild( moreText );
        liveLink.appendChild( liveText );
        more.className = "playterm_more";
        moreLink.setAttribute('href', "http://www.playterm.org" );
        moreLink.setAttribute('target', "_blank" );
        liveLink.setAttribute('href', "http://www.playterm.org/live" );
        liveLink.setAttribute('target', "_blank" );
        more.appendChild( moreLink );
        more.appendChild( liveLink );
        embed.className = "playterm_embed";
        embed.id        = "playterm-embed-"+this.uid;
        // do not change line below, or it will break the online search/replace engine
        embed.innerHTML = "<b>EMBED:</b> "+this.hex2str('0a266c743b6469762667743b266c743b7363726970742069643d2671756f743b706c61797465726d2d4d6a41784d6930774d6939345a4756696457643064486c795a574d744d544d7a4d444d7a4e7a6b344e4877344d4867794e413d3d2671756f743b20747970653d2671756f743b746578742f6a6176617363726970742671756f743b207372633d2671756f743b687474703a2f2f706c61797465726d2e6f72672f6a732f3f686173683d4d6a41784d6930774d6939345a4756696457643064486c795a574d744d544d7a4d444d7a4e7a6b344e4877344d4867794e413d3d2671756f743b20636c6173733d2671756f743b73697a653a38307832342671756f743b2667743b266c743b2f7363726970742667743b266c743b2f6469762667743b0a');
      }
      skin.className  = "playterm_skin";
      skin.id         = "playterm_skin_player";
      transport.appendChild( skin );
      transport.onclick = this.onScrub;
      terminal.className   = "playterm";

      // set sizespecific properties
      var profile               = this.args.size;
      // skin.style.background     = this.smartyFetch( this.sizes[ profile ].transport.skin );
      terminal.style.width      = this.sizes[ profile ].width;
      terminal.style.height     = this.sizes[ profile ].height;
      // if( this.args.embed ){
      //   embed.style.margin        = this.sizes[ profile ].embedMargin;
      //   more.style.margin         = this.sizes[ profile ].moreMargin;
      // }
      //if( navigator.userAgent.toLowerCase().indexOf('msie') != -1 ){
      //  terminal.style.width      = ( parseInt( String(terminal.style.width).replace('px') ) + 22 ) +"px"
      //  terminal.style.height      = ( parseInt( String(terminal.style.height).replace('px') ) + 20 ) +"px"
      //}
      // transport.style.width     = this.sizes[ profile ].transport.width;
      // transport.style.marginTop = this.sizes[ profile ].marginTop;
      // transportbar.style.margin = this.sizes[ profile ].transportbar.margin;
      // playbutton.style.margin   = this.sizes[ profile ].playbutton;

      terminal.id          = "playterm-instance-"+this.uid;
      terminal.onmousedown = false;
      // terminal.onmouseover = this.showTransport;
      // parent.appendChild( transportbar );
      // parent.appendChild( transport );
      // parent.appendChild( more );
      // parent.appendChild( playbutton );
      // if( this.args.embed ) parent.appendChild( embed );
      parent.appendChild( css );
      parent.appendChild( terminal );
      parent.appendChild( cleardiv );
      
    },

    getParentDOMId : function(){ 
      var scripts = document.getElementsByTagName( 'script' );
      for( i in scripts ){
        var matchId   = ( String( scripts[i].id ).match("playterm-")     !=  null );
        var matchFile = ( String( scripts[i].className ).match("file:")  !=  null );
        var inited    = ( String( scripts[i].className ).match("inited") !=  null );
        if( ( matchId || matchFile ) && !inited ) return scripts[i];
      }
    },

    showTransport: function(){
      var me = playterm_player;
      me.$( 'playterm_transport_player_'+me.uid ).style.display = "block";
      me.$( 'playterm_transportbar_player_'+me.uid ).style.display = "block";
    },

    togglePlay: function(e){
      __trace("togglePlay()");
      var me = playterm_player;
      var rightclick;
      if( !me.state.playing ){
        if( !_assert( me.args.file || me.data, "no data" ) ) return;
        var tty = window[ "showtty_"+ me.terminal.id ];
        player_reached_end = ( tty && tty.timeline.length == tty.nextframe );
        if( player_reached_end ){
          __trace("player reached end, resetting");
          tty.instance.resetTTY( tty );
        }
        // load or continue recording
        if( !me.state.pause && !player_reached_end ) me.loadRecording();
        else tty.instance.play( tty );
        // handle states and hide/show button
        // me.$( 'playterm_button_player_'+me.uid ).style.display = "none";
        // if( me.args.embed ) me.$( 'playterm-embed-'+me.uid ).style.display = "none";
        me.idUpdate = setInterval( me.update, 300 );
        me.state.playing = true;
        me.state.pause   = false;
                me.terminal.onmousedown = me.togglePlay;
      }else{
        me.reset(true);
                me.terminal.onmousedown = false;
      }
      // handle if rightclick
      me.onRightClick(e);
    },

    loadRecording: function(){
      __trace("loadRecording()");
      /* determine whether to load external recording or integrated recording */
      var me = playterm_player;
      var onLoadedTTYURL = function(e){ playterm_player.onLoaded(e,true); }
      var onLoadedTTY    = function(e){ playterm_player.onLoaded(e); }
      if( me.args.file && !me.loaded ) return showTTYURL( me.$( "playterm-instance-"+me.uid ), me.args.file, onLoadedTTYURL );
      if( me.data ) showTTY( me.$( "playterm-instance-"+me.uid ), me.data, onLoadedTTY ); 
    },

    onRightClick: function(e){
      if (!e) var e = window.event;
      if (e ){
        var rightclick = false;
        if (e.which) rightclick = (e.which == 3);
        else if (e.button) rightclick = (e.button == 2);
        if( rightclick ) return alert("PLAYTERM.ORG\n===========\n\nServing the community to share knowledge\n\n( powered by jsttyplay )\n( http://encryptio.com/code/jsttyplay )");
      }
    },

    hex2str: function (h) {
      var r = "";
      for (var i= (h.substr(0, 2)=="0x")?2:0; i<h.length; i+=2) {r += String.fromCharCode (parseInt (h.substr (i, 2), 16));}
      return r;
    },

    update: function(){
      var me = playterm_player;
      var tty = window[ "showtty_"+ me.terminal.id ];
      if( !_assert( tty, "no tty") ) return;
      // move transport bar
      // var o = (me.sizes[ me.args.size ].transportbar.width / tty.timeline.length) * tty.nextframe;
      // me.$( "playterm_transportbar_player_"+me.uid ).style.width = me.sizes[ me.args.size ].transportbar.start + o +"px";
      if( tty.timeline.length == tty.nextframe ) me.reset();
      // __trace("update() "+ tty.nextframe );
    },

        addButton: function(html,callback){},
            // create buttondiv
      // var me = playterm_player;
            // var div        = document.createElement("div"); 
            // var playerid   = "playterm-instance-"+window.playterm_player.uid;
            // div.className  = "ptbutton playtermcurved";
            // div.innerHTML  = "raw text";
            // div.onclick    = callback;
//       var profile               = me.args.size;
// //          div.style.margin    = me.sizes[ profile ].buttonMargin;
//             //div.style.marginTop =  (me.buttons*85) + "px";
//             // add to buttoncontainer   
//             me.parent.appendChild(div);
//             me.buttons++;
//         },

    reset:function( pause ){
      __trace("reset()");
      var me = playterm_player;
      var tty = window[ "showtty_"+ me.terminal.id ];
            tty.instance.stop( tty );
      if( !_assert( tty, "no tty") ) return;
      // me.$( 'playterm_button_player_'+me.uid ).style.display = "block";
      // if( me.args.embed ) me.$( 'playterm-embed-'+me.uid ).style.display = "block";
      me.state.playing = false;
      me.state.pause   = pause;
      clearInterval( me.idUpdate );
    },

    onScrub: function(e){
      _trace("scrub disabled");
      //if( !playterm_player.state.playing || !tty ) return _trace("not playing..no tty..no scrub..returning");
      //var tty = window[ "showtty_"+ playterm_player.terminal.id ];
      //if( !_assert( e.target, "no target with mouseevent") ) return;
      //if( !tty ) return _trace("no tty no scrub..returning");
      //var offset    = e.offsetX;
      //var range     = playterm_player.sizes[ playterm_player.args.size ].transportbar.range[ "80x24" ];
      //var roffset   = offset - range[0];
      //roffset       = roffset > range[1] ? range[1] : roffset;
      //var maxoffset = range[1]-range[0];
      //var frames    = tty.timeline.length-1;
      //var frame     = parseInt( (frames/maxoffset) * roffset );
      //playterm_player.reset(true);
      //tty.instance.scrubTTY( frame, tty );
      //_trace( "offset = "+offset+" frames = "+frames+" roffset = "+roffset+" new frame:"+frame); 
    },

    onLoaded: function( succes, autoplay ){
      __trace( "onLoaded()");
      var me = playterm_player;
      if( succes ){
        me.loaded = true;
        if( autoplay ) me.togglePlay();
      }else _trace("could not load recording..please come back later. Sorry!", true);
    }

  };

  window.playterm_player = playterm_player
  

}());
