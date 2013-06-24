#!/usr/bin/env lsc

_                = require('underscore')
_.str            = require('underscore.string');
color            = require("ansi-color").set
moment           = require('moment')


# Useful functions to print
bbo = (s) ->
  color(s, "bold")

ita = (s) ->
  color(s, "italic")

cl = (c, s) -->
    color(s, c)
    
cd = (s) ->
    color(s, 'underline')

mprint = (s)->
  color(_.str.humanize(s), "blue")
  
pd = (amount, what) -->
    _.str.rpad(what, amount)

mok = (s)->
  color(s, "green")

merr = (s)->
  color("red")+s
  
path-system = 

    build-dir        : "./build"
    deploy-dir       : "./deploy"
    local-server-dir : "server"
    local-client-dir : "static"

recompute-paths = (p) ->
    p.server-dir       = "#{p.deploy-dir}/#{p.local-server-dir}"
    p.client-dir       = "#{p.deploy-dir}/#{p.local-client-dir}"
    p.client-dir-img   = "#{p.client-dir}/img"
    p.client-dir-fonts = "#{p.client-dir}/font"

recompute-paths(path-system)

    
silent = (command) ->
    "@#command"

sensitive-dirs = (files, n) ->
        hs = {}
        for e in [ _.first(_.str.words(f, '/'), n) for f in files ]
            hs[_.str.toSentence(e, '/', '/')] = true
        
        return [k for k,v of hs]
# watch = (file, command) ->
#     "@watchman -w #file \'#{command}' 2> >(grep '#{tag}') > /dev/null &"

tag = 'lake'

watch = (file, command) ->
    "watchman -w #file \'#{command}\' &" 
    
nodemon = (file, command) ->
    "nodemon -q #file" 

echo-step = (stepname, level=0) ->
    lvs = [ ' ' for e from 1 to level*2 ] * ''
    "\t @echo '' \n\t @echo \' #{lvs}#{mprint(stepname)}\' 1>&2"

echo-ok = (stepname, level=0) ->
    lvs = [ ' ' for e from 1 to level*2 ] * ''
    "\t @echo '' \n\t @echo \' #{lvs}#{mok(stepname)}\' 1>&2"

ct = " \\\n\t"
ce = " \\"
bt = "\t"
ht = "\n\#"
le = "\n\t"

targets = [
    { category: 'common', targets: [
        { name: \deploy,    description: "complete, create build dir, build and install; eventually install assets"}
        { name: \build,     description: "compile all files into build directory" }
        { name: \install,   description: "compile all files and install them in deploy, no assets installed"}
        ]
    }
    {
        category: 'continuous build', targets: [
            { name: "start-cb", description: "starts continuous build"}
            { name: "stop-cb",  description: "stops continuous build"}
        ]
    }
    {
        category: 'other', targets: [
            { name: "test", description: "run mocha tests"}
        ]
    }
    {
        category: 'release management', targets: [
            { name: "npm-install",      description: "install a global link to this package, to use it: #{'npm link pkgname' |> cd} in the target dir"}
            { name: "npm-prepare-x",    description: "prepare npm version update and gittag it - x={ patch, minor, major }"}
            { name: "npm-commit",       description: "commit version change"}
            { name: "npm-finalize",     description: "merge development branch into master and publish npm"}
            { name: "npm-x",            description: "prepare action x={ patch, minor, major }"}
        ]
    }


]

help = ->
    
    s = """
        help:
        \t @echo 'Makefile targets'
        
        """
       
    for c in targets  
        s = s + "\t @echo ''\n"
        s = s + "\t @echo '    #{c.category |> _.str.humanize |> cl('red')}:' \n"
        for e in c.targets
            s = s + "\t @echo '        #{e.name |> pd(15) |> bbo}: #{e.description |> _.str.humanize}.' \n" 
    
    return s+"\t @echo ''\n"

npm-git-action = (action) ->
    """
    npm-prepare-#action:
    #{echo-step "Warning - This is going to tag the current dev. branch and merge it to master."}
    #{echo-step "The tag will be brought to the master branch."}
    #{echo-step "After this action, do `make npm-commit` and `make npm-finalize` to "}
    #{echo-step "Publish to the npm repository."}
    \t git checkout development
    \t npm version #action 

    npm-#action:
    #{echo-step "Warning - This is going to tag the current dev. branch and merge it to master."}
    #{echo-step "The tag will be brought to the master branch and the package will be published on npm."}
    \t git checkout development
    \t npm version #action 
    \t make npm-commit
    \t make npm-finalize
    """

makeify = (s) ->
    _.str.underscored(_.str.dasherize(s)).toUpperCase()
    
getvar = (s) ->
    "$(#{makeify(s)})"

all = ({files-of-type: x, in: dir}) ->
    "$(shell find #{dir} -name '*.#{x}')"
    
join = (l1, l2) ->
    "$(join #l1 #l2)"
    
change-type = (fr, tto, list) -->
    "$(patsubst %.#fr, %.#tto, #list)"

rebase-to = (dir, list) -->
    "$(patsubst %, #{dir}/%, #list)" |> trim
    
take-name = (list) -->
    "$(notdir #list)"

take-dir = (list) -->
    "$(dir #list)"
    
trim = (list) ->
    "$(strip #list)"
    
reduce-to = (name, list) ->
    "#{makeify(name)} = #{ct}" + (list * "#{ct}")
    
now = -> moment().format('MMMM Do YYYY, h:mm:ss a');

reset-targets = ->
   ft = ""
   
add-to-targets = (x) ->
    ft = "#ft #x"
    
collect-targets = ({from-source-list, into-target-variable, into-file, final-type}) ->
  
       if from-source-list?
           tv = 
            |  into-target-variable? => makeify into-target-variable
            |  otherwise             => into-file
            
           str = tv
            
           for src in from-source-list 
            
                if src.name? 
                    str = str + ct +
                         src.name |> take-name |> change-type(l.type, final-type) |> rebase-to(build-dir)
                         
                if src.files-of-type?
                    str = str + ct + all(files-of-type: src.files-of-type, in: src.in) 
                        |> change-type( src.files-of-type, final-type) 
                        |> take-name 
                        |> rebase-to(build-dir)
                         
           add-to-targets tv 

o = (x) ->
    console.log x
    
generate-makefile-config-ps = ({  
                                build-dir:              _build-dir
                                deploy-dir:             _deploy-dir
                                local-server-dir:       _local-server-dir
                                local-client-dir:       _local-client-dir}, s) -->
        
    if _build-dir?        then path-system.build-dir        =  _build-dir          
    if _deploy-dir?       then path-system.deploy-dir       =  _deploy-dir          
    if _local-server-dir? then path-system.local-server-dir =  _local-server-dir          
    if _local-client-dir? then path-system.local-client-dir =  _local-client-dir        
    
    recompute-paths(path-system)
    
    o "\# Makefile generated automatically on #{now()}"
    o "\# (c) 2013 - Vittorio Zaccaria, all rights reserved"
    o "\n\# Current variables: "
    
    for i in _.str.lines(JSON.stringify(path-system, null, 2))
        console.log "\# #i"
        
    generate-makefile-config-ext(path-system,s)

    
generate-makefile-ext = ( { build-dir, 
                            deploy-dir, 
                            server-dir, 
                            client-dir,
                            client-dir-img, 
                            client-dir-fonts } , 
                          { client-js:      cf,
                            vendor-js:      vf, 
                            server-js:      sf,
                            client-css:     cs, 
                            client-html:    ch,
                            client-img:     im,
                            client-fonts:   fo,
                            silent:         sil,
                            depth:          dp,                                            
                            trigger-files:  trigger-files,
                            additional-commands: additional-commands } ) --> 

    
    o '# main target'
    o 'all: '
    o '\t make deploy'
    
    # console.log "#{ht} main target"
    # console.log "all: makefile"
    # console.log "\t make deploy #{if sil? and sil then '--silent' else ''}"
    
   
    collect-targets from-source-list: cf, into-file: "#build-dir/client.js", final-type: \js 
    
    collect-targets from-source-list: sf, into-target-variable: "#build-dir/client.js", final-type: \js 
 
  
    if vf? 
        console.log "#{ht} Vendor sources (javascript), client side"
        console.log reduce-to "client vendor sources", 
            [ l.name |> take-name |> change-type(l.type, \js)  |> rebase-to(build-dir) for l in vf]
        ft = "#ft #build-dir/vendor.js"

            
    if cs?                                    
        console.log "#{ht} Client sources (css)"
        console.log reduce-to "client css sources", 
            [ l.name |> take-name |> change-type(l.type, \css) |> rebase-to(build-dir) for l in cs]
        ft = "#ft #build-dir/client.css"

        
    if ch?                                         
        console.log "#{ht} Client html"
        console.log reduce-to "client html", 
            [ l.name |> take-name |> change-type(l.type, \html) |> rebase-to(build-dir) for l in ch]
        ft = "#ft #{getvar('client html')}"
    
    less-include = ""  
    if cs?
        console.log "#{ht} Client dependencies (css)"
        for l in cs
            if l.deps?
                build-name =  l.name |> take-name |> change-type(l.type, \css) |> rebase-to(build-dir)
                console.log "#build-name: #{l.name} #{l.deps}"
                console.log echo-step "compiling $<"
                if l.type == \less
                    console.log "\t lessc --verbose --include-path=#{if l.include? then l.include else '.'} $< > $@"
                    
   
    if im? 
        console.log "#{ht} Assets (images)"
        console.log reduce-to "client img",
            [ all(files-of-type: f.files-of-type, in: f.in) 
              |> take-name 
              |> rebase-to(client-dir-img) for f in im ]
    
    if fo? 
        console.log "#{ht} Assets (Font)"
        console.log reduce-to "client fonts",
            [ all(files-of-type: f.files-of-type, in: f.in) 
              |> take-name 
              |> rebase-to(client-dir-fonts) for f in fo ]

    if cf?  
        console.log "#{ht} Build up client.js"
        console.log "#{build-dir}/client.js: #{getvar('client sources')}"
        console.log "\tcat $^ > $@"
        
    
    if vf?     
        console.log "#{ht} Build up vendor.js"
        console.log "#{build-dir}/vendor.js: #{getvar('client vendor sources')}"
        console.log "\tcat $^ > $@"
        
    if cs?
        csdep = [ s.deps for s in cs ] * ' '
        console.log "#{ht} Build up client.css"
        console.log "#{build-dir}/client.css: #{getvar('client css sources')} "
        console.log "\tcat  #{getvar('client css sources')} > $@"
       
    console.log "#{ht} Install server files"
    console.log ".PHONY: install"
    console.log "install: build" 
    console.log(echo-step "installing into #deploy-dir")
    console.log "\t mkdir -p #deploy-dir" 
    console.log "\t mkdir -p #server-dir" 
    console.log "\t mkdir -p #client-dir" 
    console.log "\t mkdir -p #client-dir/js" 
    console.log "\t mkdir -p #client-dir/css" 
    console.log "\t mkdir -p #client-dir-img" 
    console.log "\t mkdir -p #client-dir-fonts" 
    console.log "\t mkdir -p #client-dir/html"
    if sf? 
        for f in sf
            nn = f.name |> take-name |> change-type f.type, \js |> rebase-to build-dir
            console.log "\t install -m 555 #{nn} #{server-dir}"

    if ch?
        for f in ch 
            nn = f.name |> take-name |> change-type f.type, \html |> rebase-to build-dir
            if not f.root
                console.log "\t install -m 555 #{nn} #{client-dir}/html/"
            else console.log "\t install -m 555 #{nn} #{client-dir}/"
         
    if cf? then console.log "\t install -m 555 #{build-dir}/client.js #client-dir/js"
    if vf? then console.log "\t install -m 555 #{build-dir}/vendor.js #client-dir/js"
    if cs? then console.log "\t install -m 555 #{build-dir}/client.css #client-dir/css"
    if additional-commands?
        console.log additional-commands
    console.log(echo-step "installed")

    console.log "#{ht} Prepare build directory"
    console.log "prepare-build: "
    console.log "\t mkdir -p #build-dir"
    
    console.log "#{ht} Build files"
    console.log ".PHONY: build"
    console.log "build: #ft"
   
    console.log "#{ht} Deploy files" 
    console.log ".PHONY: deploy"
    console.log "deploy:"
    console.log echo-step "deploying... fails if not OK at the end"
    console.log "\t make prepare-build"
    console.log "\t make install"
    if im? or fo? 
        console.log "\t make install-assets"
    console.log echo-ok "OK"
        
        
        
    console.log "#{ht} VPATH definition"
    console.log "VPATH = #{ce}" 
    if cf? then console.log bt + ([ s.in for s in cf ] * "#{ct}" + ce)  
    if im? then console.log bt + ([ s.in for s in im ] * "#{ct}" + ce)  
    if fo? then console.log bt + ([ s.in for s in fo ] * "#{ct}" + ce)  
    if ch? then console.log bt + ([ "$(dir #{s.name})" for s in ch ] * "#{ct}" + ce) 
    if sf? then console.log bt + ([ "$(dir #{s.name})" for s in sf ] * "#{ct}" + ce) 
    if cs? then console.log bt + ([ "$(dir #{s.name})" for s in cs ] * "#{ct}" + ce) 
    if vf? then console.log bt + ([ "$(dir #{s.name})" for s in vf ] * "#{ct}" + ce)

    console.log "#{ht} Start Continuous Build"
    console.log "start-cb: "
    console.log echo-step "starting continuous build"
    console.log bt + "@touch ./client-changed"
    console.log bt + "@touch ./recompile-all"
    
    all-files = [] 
    if cf? then all-files = all-files.concat( [ s.in   for s in cf ] )
    if im? then all-files = all-files.concat( [ s.in   for s in im ] )
    if fo? then all-files = all-files.concat( [ s.in   for s in fo ] )
    if ch? then all-files = all-files.concat( [ s.name for s in ch ] )
    if sf? then all-files = all-files.concat( [ s.name for s in sf ] )
    if cs? then all-files = all-files.concat( [ s.name for s in cs ] )
    if vf? then all-files = all-files.concat( [ s.name for s in vf ] )

    # console.log "\# watching: #all-files"
    if not dp?
        dp = 2
    to-be-watched = sensitive-dirs(all-files, dp)
    # console.log "\# to be watched: #to-be-watched"
    console.log bt + ( [watch(file, 'touch ./client-changed') for file in to-be-watched ] * "#{le}") 
    console.log bt + watch("./client-changed",'make deploy; chromereload;')
    console.log bt + watch("./recompile-all",'make clean && make deploy; chromereload;')
    if sf?
        for s in sf
            if s.main? and s.main then
                console.log bt + nodemon("#{server-dir}/#{s.name |> take-name |> change-type(s.type, \js) |> trim }")
            if s.test? and s.test then
                console.log bt + "watchman -r 3s -w ./client-changed 'mocha #{server-dir}/#{s.name |> take-name |> change-type(s.type, \js) |> trim } --reporter spec' &" 
    if ch?
        for s in ch 
            if s.root? and s.root and (s.serve? and s.serve)
                console.log bt + "@serve #{client-dir} &" 
    
    if trigger-files?
        for t in trigger-files
             console.log bt + watch(t, 'touch ./recompile-all')
    
    if sf?
        for s in sf
            if s.test? and s.test then
                console.log "#{ht} Tests"
                console.log ".PHONY: test"
                console.log ""
                console.log "test:"
                console.log "\t mocha #{server-dir}/#{s.name |> take-name |> change-type(s.type, \js) |> trim } --reporter spec" 
     
    
    console.log "#{ht} Stop Continuous Build" 
    console.log "stop-cb:" 
    console.log "\t -killall node"

    common-targets = """
#{build-dir}/%.js: %.ls
#{echo-step "compiling $^"}
\t lsc --output #{build-dir} -c $<

#{build-dir}/%.js: %.js
\t cp $< $@
    
#{build-dir}/%.js: %.coffee
#{echo-step "compiling $^"}
\t coffee -b -l --output #{build-dir} -c $<
    
#{build-dir}/%.html: %.jade
#{echo-step "compiling $^"}
\t @jade -P --out #{build-dir} $<

#{build-dir}/%.css: %.css
\t cp $< $@

#{build-dir}/%.html: %.html
\t cp $< $@

#{build-dir}/%.html: %.svg
\t cp $< $@

#{build-dir}/%.css: %.styl
#{echo-step "compiling $^"}
\t stylus $< -o #{build-dir}

#{client-dir-img}/%: %
\t cp $< $@

#{client-dir-fonts}/%: %
\t cp $< $@

makefile: makefile.ls
#{echo-step "compiling $^"}
\t ./makefile.ls > makefile 

npm-install:
#{echo-step "Installing a link globally on this machine."}
#{echo-step "Remember to do a `npm link pkg_name` in the"}
#{echo-step "directory of the modules that are going to use this."}
\t npm link .

#{npm-git-action('patch')}

#{npm-git-action('minor')}

#{npm-git-action('major')}
    
npm-commit:
\t git commit -a 

npm-finalize:
\t git checkout master
\t git merge development
\t npm publish .

distclean:
\t -rm -rf #{build-dir} 
\t -rm -rf #{deploy-dir} 
    
#{build-dir}/%.css: %.less 
#{echo-step "compiling $^"}
\t lessc --verbose $< > $@

#{help()}
"""

   
    console.log "#{ht} Common targets"
    console.log common-targets 
    
    console.log "#{ht} Clean up"
    console.log "clean:"
    console.log "\t  -rm -rf #{deploy-dir}/*"
    console.log "\t  -rm -rf #{build-dir}/*"
    console.log "\t  -rm -f ./client-changed"
    console.log "\t  -rm -f ./recompile-all"
   
    if im? or fo? 
        console.log "#{ht} Install assets"
        console.log echo-step "installing assets"
        console.log "install-assets: #{if im? then getvar('client img') else ''} #{if fo? then getvar('client fonts') else ''}"
        
generate-makefile                   = generate-makefile-ext(path-system.build-dir, path-system.deploy-dir, path-system.server-dir, path-system.client-dir, path-system.client-dir-img, path-system.client-dir-fonts)
exports.generate-makefile           = generate-makefile
exports.generate-makefile-ext       = generate-makefile-ext
exports.generate-makefile-config    = generate-makefile-config
exports.make-ps                     = generate-makefile-config-ps
exports.all                         = all 









