
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