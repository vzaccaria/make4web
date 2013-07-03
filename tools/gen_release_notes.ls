#!/usr/bin/env lsc 

require! 'shelljs'

shelljs.exec 'git log-json master | perl -pe \'BEGIN{print "exports.log = {"}; s/}/},/; END{print "};\n"}\' > /var/tmp/jsonlog.txt', ->
    mylog = require('/var/tmp/jsonlog.txt').log
    for k,v of mylog 
        mymatch = /\d+\.\d+.\d+/.exec(v.message)
        if mymatch?
            console.log ""
            console.log "\#\#\# Release #{v.message}"
            console.log ""
        else
            console.log "* #{v.message}"