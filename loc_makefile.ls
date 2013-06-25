#!/usr/bin/env lsc 

require! './src/lakefile'.w-make

w-make({ deploy-dir: 'lib', local-server-dir: '.', local-client-dir: '.'}, {server-js: [ { name: "./src/lakefile.ls", type: \ls }] } )

