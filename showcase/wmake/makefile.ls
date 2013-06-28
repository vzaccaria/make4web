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
    "./assets/components/highlightjs/highlight.pack.js"
    "./assets/js/highlight.js/highlight.pack.js" 
    "./assets/components/underscore.string/lib/underscore.string.js"
    "./js/player/player.js"
]

pre-vendor-coffee-files = [
    "./js/player/player-vanilla.js.coffee"
]
 
vendor-files      = [ { name: s, type: \js } for s in pre-vendor-files ]
# vendor-files      = vendor-files.concat([ { name: s, type: \coffee } for s in pre-vendor-coffee-files ])

css-files         = [ { name: "./assets/components/bootstrap/less/bootstrap.less", type: \less } 
                      { name: "./assets/components/bootstrap/less/responsive.less", type: \less } 
                      ]
img-files         = [ { files-of-type: \png,  in: "./assets/img/backgrounds"} 
                      { files-of-type: \png,  in: "./assets/img/my-icons"}]


project-name      = "wmake"
remote-site-path  = "./#project-name"

# plugins.add-specific-translation('js/init-page.ls.template', 'build/temp-sources/init-page.ls', './README.md', 
#     (source-name, dest-name, depencencies, build-dir) -> "./tools/insert.ls #{source-name} -s ./README.md > #{dest-name}")

    
plugins.add-translation('tty', 'tty.json', 
    (source-name, dest-name, depencencies, build-dir) -> "perl -Itools/jsttyplay-master tools/jsttyplay-master/preprocess.pl #{source-name} #{dest-name}")

plugins.deploy-extension-into('tty.json', (path-system) -> "#{path-system.client-dir}/termcasts")

hooks.add-hook '_deploy', null, (path-system) ->
    x "cp -R ./examples/* #{path-system.client-dir}/examples"

hooks.add-hook 'pre-deploy', null, (path-system) ->
    x "@mkdir -p #{path-system.client-dir}/markdown"
       
plugins.copy-extension(\md, (path-system) -> "#{path-system.client-dir}/markdown")

    # x "cp js/player/player.js #{path-system.client-dir}/js"
    
# hooks.add-hook 'post-deploy', null, (path-system) ->
#     x "rm -rf #{path-system.client-dir}/examples"
#     x "cp -R ./examples #{path-system.client-dir}/examples"

# hooks.add-hook 'post-deploy', null, (path-system) ->
    # x "./tools/deploy.coffee -s ./deploy/static -c #{__dirname} -w #{remote-site-path} deploy -v -e"
    
# other-targets = '''
# js/init-page.ls: js/init-page.ls.template ./README.md
# \t ./tools/insert.ls ./js/init-page.ls.template -s ./README.md > ./js/init-page.ls
# '''


files = 
        client-js:  my-files
        vendor-js:  vendor-files, 
        client-css: css-files, 
        client-img: img-files,
        silent: false,
        client-html: [ { name: "./assets/views/index.jade", type: \jade, +root, +serve}
                       { name: "./assets/views/examples.jade", type: \jade, +root     } ] 
        
        other: [ { name: "./examples/simple/recordings/simple.tty", type: \tty }
                 { name: "./docs/README.md",        type: \md } 
                 { name: "./docs/examples.md",      type: \md }]
        
        trigger-files: [ "./assets/components/bootstrap/less",
                         "./assets/views/default.jade"
                         "./assets/css/final-touches.less" ]
                     
simple-make( files )





