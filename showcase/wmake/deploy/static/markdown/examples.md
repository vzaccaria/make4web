
## Example

This is the livescript program used to create this very website.

Let's just start from the basics and include `wmake`
---

```makefile
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
```

---

---
