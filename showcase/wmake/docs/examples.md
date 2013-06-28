
### Prologue
This is the livescript program used to create this very website.

Let's just start from the basics and include `wmake`. We start by collecting our own `livescript` file in the `my-files` array.

Of course, here you can put as many front-end javascript files as you want. These will be collected into a single minified `client.js`.

---

```makefile
{ simple-make, x, plugins} = require 'wmake'

my-files = [
    { name: "js/render.ls", type: \ls }
]
```

---

### Vendor files (stuff you didn't write)
We then collect the front-end vendor files such as bootstrap components and other stuff.

---

```coffeescript
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

vendor-files      = [ { name: s, type: \js } for s in pre-vendor-files ]
```

---

### CSS and other assets
We then collect css and image asset files.
Note that we can specify all files of a certain type within the `in` directory with the key `files-of-type`.


---
```
css-files = [ { name: "./assets/components/bootstrap/less/bootstrap.less", type: \less } 
              { name: "./assets/components/bootstrap/less/responsive.less", type: \less } ]
            
img-files  = [ { files-of-type: \png,  in: "./assets/img/backgrounds"} 
               { files-of-type: \png,  in: "./assets/img/my-icons"}
               { files-of-type: \jpg,  in: "./assets/img/carousel"} 
               { files-of-type: \png,  in: "./assets/img/carousel"} ]
```

---

### If you need more
Let's define procedurally some custom targets and some additional deploy actions.

The `add-translation` API function allows to register a callback to process a specific type of source and destination pair. In this case, I am converting the `ttyrec` recording of the landing page into a json file.

The `deploy-extension-into` function specifies where a certain extension, when generated, should be stored.

The `copy-subtree-into` function allows to copy entire trees in the deploy sub-directory.

The `copy-extension` function allows to copy a specific extension into the deploy directory.

---

```
plugins.add-translation('tty', 'tty.json', 
    (source-name, dest-name, depencencies, build-dir) -> 
      "perl -Itools/jsttyplay-master tools/jsttyplay-master/preprocess.pl #{source-name} #{dest-name}")

plugins.deploy-extension-into 'tty.json', (path-system) -> 
    "#{path-system.client-dir}/termcasts"

plugins.copy-subtree-into './examples', (path-system) -> 
    "#{path-system.client-dir}/examples"
    
plugins.copy-extension \md, (path-system) -> 
  "#{path-system.client-dir}/markdown"
```

---


### Let's finalize

Finally, lets build up our makefile by constructing the final configuration. 

The keys `client-js`, `vendor-js`, `client-css`, `client-img` have already been specified above and can be used in the configuration as they are. 

The key `client-html` is used to specify the source of the html files to be stored into the static root of our site (`+root`). 

The `other` keyword allows to specify the files impacted by the custom rules as defined above. 

Since there are some hidden dependencies, we can specify the additional files that should trigger the site rebuild. In this case, whenever a less file changes in the bootstrap dir, or the default jade template changes, we trigger a site rebuild (when `make server` is used).

---
```
configuration = 
        client-js:  my-files
        vendor-js:  vendor-files, 
        client-css: css-files, 
        client-img: img-files,
        
        client-html: [ { name: "./assets/views/index.jade", type: \jade, +root, +serve}
                       { name: "./assets/views/examples.jade", type: \jade, +root     } ] 
        
        other: [ { name: "./examples/simple/recordings/simple.tty", type: \tty }
                 { name: "./docs/README.md",        type: \md } 
                 { name: "./docs/examples.md",      type: \md }]
        
        trigger-files: [ "./assets/components/bootstrap/less",
                         "./assets/views/default.jade"
                         "./assets/css/final-touches.less" ]
        options: { +minify-js }
```
---

### The end

That's it! The simple-make function generates on standard out our shiny makefile!

---
```                     
simple-make( configuration )
```