
<img src="/img/512Px-161.png" />

## It just works

No dependencies (except for the tools you really need).
No need to install any `*-contrib-*` package to use it. 
Only GNU Make is required.

---
<img src="/img/512Px-204.png" />

## Choose your style

You can use declarative style for common tasks and fine-tune your makefile with Javascript code by hooking into the build phases. 

---

<img src="/img/512Px-478.png" />

## Free yourself

From simple websites to medium complexity webapps, leave **web-make** do the boilerplate work for you by following a rational project organization. 

---

## Example

This Coffeescript program creates a **makefile** for building a single page website written in `jade` with some fancy `coffee` script.

The `root=true` property specifies that `index.html` should be installed as the root of our website. The `serve=true` property is used by the makefile to setup and start a live preview of your site with `serve`.

The following targets are supported:

* `make help    ` Prints help on the available targets
* `make build   ` Compiles all the project files
* `make deploy  ` (default) installs all the files in the deploy directory 
* `make clean   ` Cleans up space 
* `make server  ` Similar to `grunt server` (it watches all files for changes)
* `make reverse ` Stops the server started with the previous command

---
[read coffeescript](/examples/simple/simple.cs)
---
[read makefile](/examples/simple/makefile)
---

## Installation

You can either download the project from GitHub or use npm:

```bash
npm install wmake
```

---

## Adding features

If you need any features that are not in the current version such as:

* Support for new file formats
* Support for new asset pipeline stages (e.g., minify, compress, zip)

just drop me a message or send me a pull request and I will release a new version of the tool within 1 or 2 days.


