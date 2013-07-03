## Usage and options

To print to `stdout` your makefile, you can invoke:

```
simpleMake(config);
```

where `config` is a hash that supports the attributes listed on the right.



---
Name

---
Description




---
clientJs     

---
List of files that should be compiled to javascript, e.g.: 

```json
clientJs: [ 
  { name: "js/render.coffee", type: "coffee" } 
  { name: "js/myFancyLivescript.ls", type: "ls" } 
  { name: "js/justPlainJs.js", type: "js" } 
  ...
]
```

All these files will be concatenated and optionally minified into `client.js`. 


---
serverJs     

---
List of files that should be compiled to javascript and should run server-side with Node, e.g.: 

```
serverJs: [
  { name: "./src/srv-session/main.ls",           type: "ls", main: true }
  { name: "./src/srv-api/rest_api.ls" ,          type: "ls" }
  { name: "./test/test-sim.ls",                  type: "ls", test: true } 
  ...
]
```

These files will be stored in the `deploy/server` directory, once compiled. The following options are supported:

* `main`: when `make server` is run, this file will run and watched for changes with `nodemon`.
* `test`: this file will be run with `mocha` at every change of the codebase and a specific `test` target will be created in the makefile.

---
vendorJs     

---
All these files will be concatenated and optionally minified into `vendor.js`.





---
clientCss

---
Files that should be compiled to CSS. e.g.: 

```json
clientCss: [ 
  { name: "./assets/components/bootstrap/less/bootstrap.less", type: "less" } 
  ...
]
```

---
clientImg

---
Image files to be copied in site's `img` directory, e.g.: 

```json
clientImg: [ 
  { filesOfType: "png",  in: "./assets/img/backgrounds"} 
  ...
] 
```

---
clientHtml

---
HTML files to be generated (e.g. with `jade`):

```json
clientHtml:   [ 
  { name: "./assets/views/index.jade", type: "jade", root: true, serve: true } 
  ...
]
```

Each file can have the following additional attributes:

* `root`: the will be stored in the website root (`deploy/static`)
* `serve`: this file will be the root of the preview server launched with `make server`.

---

other

---
Files that have to be translated with custom rules (see the API)

```json
other: [
  { name: "./docs/README.md", type: \md }                               
  ...
]
```

---
triggerFiles

---
Directories that, when modified, should trigger a recompilation and reload of the complete package, e.g.:

```json
triggerFiles: [ 
    "./assets/components/bootstrap/less" 
    ...
]
```

---

options

---

Options impacting the whole build process.

* `minifyClientJs`: if `true` invoke `uglifyjs` on `client.js` 
* `minifyVendorJs`: as above but act on `vendor.js`
* `minifyCSS`: if `true` invoke `uglifycss` on `client.css`
* `withGzip`: if `true` invoke `gzip` after `uglify*`


