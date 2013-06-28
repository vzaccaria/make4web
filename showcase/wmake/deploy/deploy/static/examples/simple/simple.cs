#!/usr/bin/env coffee

{simpleMake} = require 'wmake'

myJavascriptFiles = [
    { name: "src/myCoffee.coffee", type: "coffee" }
    ]

myHTML = [ 
    { name: "./assets/index.jade", type: "jade", root: true, serve: true } 
    ] 

simpleMake(clientJs: myJavascriptFiles, clientHtml: myHTML)