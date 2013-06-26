
<img src="/img/512Px-161.png" />

## It just works

No dependencies (except for the tools you really need).
No need to install any `*-contrib-*` package to use it. 
Only GNU Make is required.

---
<img src="/img/512Px-161.png" />

## Choose your style

You can use declarative style for common tasks and fine-tune your makefile with Javascript code by hooking into the build phases. 

---

<img src="/img/512Px-161.png" />

## Free yourself

From simple websites to medium complexity webapps, leave **web-make** do the bolerplate work for you by following a rational project organization. 

---

## Example

This Coffeescript program creates a **makefile** for building a single page website written in `jade` with some fancy `coffee` script.

The `root=true` property specifies that `index.html` should be installed as the root of our website. The `serve=true` property is used by the makefile to setup and start a live preview of your site with `serve`.

---

```json
#!/usr/bin/env coffee

{simpleMake} = require 'wmake'

myJavascriptFiles = [
    { name: "src/myCoffee.coffee", type: "coffee" }
    ]

myHTML = [ 
    { name: "./assets/index.jade", type: "jade", root: true, serve: true } 
    ] 

simpleMake(clientJs: myJavascriptFiles, clientHtml: myHTML)
```