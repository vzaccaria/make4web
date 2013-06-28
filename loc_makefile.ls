#!/usr/bin/env lsc 

require! './src/lakefile'.w-make

regular-system = {
    deploy-dir: 'lib'
    local-server-dir: '.'
    local-client-dir: '.'
}

lib-files = [
   { name: "./src/lakefile.ls", type: \ls }
   { name: "./src/plugins.ls",  type: \ls}
]
    

w-make(regular-system, { server-js: lib-files } )

