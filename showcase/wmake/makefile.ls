#!/usr/bin/env lsc

{ simple-make, all, x, hooks, plugins} = require 'wmake'

my-files = [
    { name: "js/render.ls", type: \ls }
]

pre-vendor-files = [
    "./assets/components/jquery/jquery.js"
    "./assets/components/bootstrap/js/bootstrap-transition.js"
    "./assets/components/bootstrap/js/bootstrap-alert.js"
    "./assets/components/bootstrap/js/bootstrap-modal.js"
    "./assets/components/bootstrap/js/bootstrap-dropdown.js"
    "./assets/components/bootstrap/js/bootstrap-scrollspy.js"
    "./assets/components/bootstrap/js/bootstrap-tab.js"
    "./assets/components/bootstrap/js/bootstrap-tooltip.js"
    "./assets/components/bootstrap/js/bootstrap-popover.js"
    "./assets/components/bootstrap/js/bootstrap-button.js"
    "./assets/components/bootstrap/js/bootstrap-collapse.js"
    "./assets/components/bootstrap/js/bootstrap-carousel.js"
    "./assets/components/bootstrap/js/bootstrap-typeahead.js"
    "./assets/components/moment/moment.js"
    "./assets/components/showdown/src/showdown.js"
    "./assets/components/showdown/src/extensions/table.js"
    "./assets/components/highlightjs/highlight.pack.js"
    "./assets/js/highlight.js/highlight.pack.js" 
    "./assets/components/underscore.string/lib/underscore.string.js"
    "./js/player/player.js"
]

 
vendor-files      = [ { name: s, type: \js } for s in pre-vendor-files ]

css-files         = [ { name: "./assets/components/bootstrap/less/bootstrap.less", type: \less } 
                      { name: "./assets/components/bootstrap/less/responsive.less", type: \less } 
                      ]
img-files         = [ { files-of-type: \png,  in: "./assets/img/backgrounds"} 
                      { files-of-type: \png,  in: "./assets/img/my-icons"}
                      { files-of-type: \jpg,  in: "./assets/img/carousel"} 
                      { files-of-type: \png,  in: "./assets/img/carousel"}
                      { files-of-type: \png,  in: "./assets/components/bootstrap/img"} ]


project-name      = "wmake"
remote-site-path  = "./#project-name"

    
plugins.add-translation('tty', 'tty.json', 
    (source-name, dest-name, depencencies, build-dir) -> 
      "perl -Itools/jsttyplay-master tools/jsttyplay-master/preprocess.pl #{source-name} #{dest-name}")

plugins.deploy-extension-into 'tty.json', (path-system) -> 
    "#{path-system.client-dir}/termcasts"

plugins.copy-subtree-into './examples', (path-system) -> 
    "#{path-system.client-dir}/examples"
    
plugins.copy-extension \md, (path-system) -> 
  "#{path-system.client-dir}/markdown"

hooks.add-hook 'post-deploy', null, (path-system) ->
    x "./tools/deploy.coffee -s ./deploy/static -c #{__dirname} -w #{remote-site-path} deploy -v -e "
    



files = 
        client-js:  my-files
        vendor-js:  vendor-files, 
        client-css: css-files, 
        client-img: img-files,
        
        client-html: [ { name: "./assets/views/index.jade", type: \jade, +root, +serve}
                       { name: "./assets/views/examples.jade", type: \jade, +root     } 
                       { name: "./assets/views/api.jade", type: \jade, +root     }  
                       { name: "./assets/views/release-notes.jade", type: \jade, +root     } ] 
        
        other: [ { name: "./examples/simple/recordings/simple.tty", type: \tty }
                 { name: "./docs/README.md",   type: \md } 
                 { name: "./docs/examples.md", type: \md }
                 { name: "./docs/options.md",  type: \md }
                 { name: "./docs/release-notes.md",  type: \md }]
        
        trigger-files: [ "./assets/components/bootstrap/less",
                         "./assets/views/default.jade"
                         "./assets/css/final-touches.less" 
                         "./assets/css/ttyrec.less" ]
                         
        options: { +minify-js, +minify-css }
                     
simple-make( files )





