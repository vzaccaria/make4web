#!/usr/bin/env lsc

require! 'lakefile'.make-ps

make-ps({ deploy-dir: 'lib', local-server-dir: '.', local-client-dir: '.'}, {server-js: [ { name: "./src/lakefile.ls", type: \ls }] } )



