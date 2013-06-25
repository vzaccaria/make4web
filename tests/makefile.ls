#!/usr/bin/env lsc

{ simple-make, all, hooks, x } = require '../src/lakefile'

## Lakefile starts here.
my-files = [ { files-of-type: \coffee,  in: "./html/app" }
             { files-of-type: \ls,      in: "./html/app/scripts" }
             { files-of-type: \coffee,  in: "./html/app/scripts" } 
             { files-of-type: \js,      in: "./html/app/scripts" }
             { name: "./src/common/format.ls", type: \ls } ]

vendor-src-dir = "./html/vendor/scripts"


common-files = [ { name: "./src/common/format.ls",          type: \ls }
                 { name: "./src/common/session.ls" ,        type: \ls } 
                 { name: "./src/common/econsole.ls",        type: \ls }]
 
vendor-files = [ { name: "#vendor-src-dir/humanize.js", type: \js } 
                 { name: "#vendor-src-dir/underscore.js", type: \js } 
                 { name: "#vendor-src-dir/underscore.string.js", type: \js }  
                 { name: "#vendor-src-dir/moment.min.pretty.js", type: \js } 
                 { name: "./src/common/format.ls",          type: \ls }
                 { name: "./src/common/econsole.ls",        type: \ls } 
                 { name: "./src/common/session.ls" ,        type: \ls } 
                 { name: "#vendor-src-dir/console-helper.js", type: \js }
                 { name: "#vendor-src-dir/jquery-1.7.2.js", type: \js } 
                 { name: "#vendor-src-dir/d3.v2.js", type: \js } 
                 { name: "#vendor-src-dir/highstock.js", type: \js } 
                 { name: "#vendor-src-dir/showdown.js", type: \js } 
                 { name: "#vendor-src-dir/angular/angular.js", type: \js } 
                 { name: "#vendor-src-dir/angular/angular-loader.js", type: \js } 
                 { name: "#vendor-src-dir/angular/angular-resource.js", type: \js } 
                 { name: "#vendor-src-dir/angular/angular-cookies.js", type: \js } 
                 { name: "#vendor-src-dir/angular/angular-sanitize.js", type: \js } 
                 { name: "#vendor-src-dir/codemirror/codemirror.js", type: \js } 
                 { name: "#vendor-src-dir/codemirror/coffeescript.js", type: \js } 
                 { name: "#vendor-src-dir/codemirror/javascript.js", type: \js } 
                 { name: "#vendor-src-dir/codemirror/vim.js", type: \js } 
                 { name: "#vendor-src-dir/bootstrap/bootstrap.js", type: \js } 
                 { name: "#vendor-src-dir/date-range-parser.js", type: \js } 
                 { name: "#vendor-src-dir/angular-ui.js", type: \js } 
                 { name: "#vendor-src-dir/bootstrap-select.js", type: \js }]


server-files = [ { name: "./src/srv-session/broker.ls",         type: \ls}
                 { name: "./src/srv-session/backtest.ls",       type: \ls}
                 { name: "./src/srv-session/main.ls",           type: \ls}
                 { name: "./src/srv-api/rest_api.ls" ,          type: \ls }
                 { name: "./src/srv-api/compile_api.ls",        type: \ls } 
                 { name: "./src/srv-api/test/test_db_api.ls",   type: \ls } 
                 { name: "./test/test.ls",                      type: \ls } 
                 { name: "./test/test-sim.ls",                  type: \ls, +test } 
                 { name: "./test/debug-sim.ls",                 type: \ls }]
                 
server-files = common-files.concat server-files

css-files   = [  { 
                   name: "./html/app/styles/app.less", 
                   type: \less , deps: all(files-of-type: \less, in: './html/vendor/styles/bootstrap'), include: './html' }
                   
                 { name: "./html/vendor/styles/codemirror/codemirror.css", type: \css  }
                 { name: "./html/vendor/styles/codemirror/ambiance.css",   type: \css  }
                 { name: "./html/vendor/styles/angular-ui.min.css",        type: \css  }
                 { name: "./html/vendor/styles/bootstrap-select.css",      type: \css  }]

img-files = [   { files-of-type: \png,  in: "./html/app/assets/img"}
                { files-of-type: \gif,  in: "./html/app/assets/img"} ]
                
font-files = [  { files-of-type: \woff, in: "./html/app/assets/font" } 
                { files-of-type: \otf,  in: "./html/app/assets/font" }
                { files-of-type: \eot,  in: "./html/app/assets/font" }
                { files-of-type: \svg,  in: "./html/app/assets/font" }
                { files-of-type: \ttf,  in: "./html/app/assets/font" } ]

hooks.add-hook 'post-deploy', null, (path-system) ->
    x "-mkdir -p #{path-system.client-dir}/data"
    x "cp data/*.json #{path-system.client-dir}/data" 

files = 
        client-js: my-files, 
        server-js: server-files, 
        vendor-js: vendor-files, 
        client-css: css-files, 
        client-img: img-files,
        client-fonts: font-files
        client-html: [ { name: "./html/app/index.jade", type: \jade, +root, -serve } ]
        depth: 3
                     
simple-make( files )





