#!/usr/bin/env lsc

# options are accessed as argv.option

require! 'optimist'
require! 'fs'

argv     = optimist.usage('replace.\nSubstitute _source_ to @text@ in _inputfile_.\nUsage: $0 --option=V | -o V [ inputfile ]\n',
              source:
                alias: 's', description: 'file containing the string to be substituted'
                         ).argv

if(argv.help)
  optimist.showHelp()
  return

command = argv._

if command.length == 0 or not (argv.source?)
  optimist.showHelp()
  return

expression = /__text__/gi

fs.read-file command[0], (err, data) ->
    fs.read-file argv.source, (err, sdata) ->
        d = data.toString().replace(expression, sdata)
        console.log d
