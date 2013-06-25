#!/usr/bin/env lsc

_                = require('underscore')
_.str            = require('underscore.string');
color            = require("ansi-color").set
moment           = require('moment')
{filter, map}    = require 'prelude-ls'


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
        { name: \deploy,    description: "(default). Complete deal, create directories, build and install; eventually install assets"}
        { name: \build,     description: "compile all files into build directory" }
        ]
    }
    {
        category: 'continuous build', targets: [
            { name: "server",   description: "starts continuous build"}
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

reset-targets = ~>
   @ft = ""
   
add-to-targets = (x) ~>
   @ft = "#{@ft} #x"

get-targets = ~>
   @ft
   
o = (x) ->
    console.log x
    
m = (x) ->
    o echo-step "#{_.str.humanize(x)}"

x = (y) ->
    o "\t #y"

p = (z) ->
    if not z?
        o ""
    else 
        o "\n\# #{_.str.humanize(z)}"

it = (description, {with-target, dependencies, not-phony}, cb) ->
    
    p "#description"
    if not not-phony?
        o ".PHONY: #{with-target}"
    o "#{with-target}: #{dependencies |> pretty}"
    m "#description"
    cb()
    
foreach-file-in = (variable-name, cb) ->
    o   """
        \t for i in #{getvar variable-name}; do \\
        \t\t #{cb('$$i')}; \\
        \t done 
        """ 

foreach-file-in-expression = (expression, cb) ->
    o   """
        \t for i in #{expression}; do \\
        \t\t #{cb('$$i')}; \\
        \t done 
        """ 
   
collect-targets = ({build-dir, from-source-list, into-target-variable, into-file, final-type, description}) ->
  
       if from-source-list?
        
           if description? then p description
           else p ""
           
           str = "#{makeify into-target-variable}="
            
           for src in from-source-list 
                if src.name? 
                    src.dst-name    = src.name |> take-name |> change-type(src.type, final-type)
                    src.watch-name  = src.name 
                    src.dir-name    = src.name |> take-dir
                         
                if src.files-of-type?
                    src.dst-name    = (all(files-of-type: src.files-of-type, in: src.in) |> change-type( src.files-of-type, final-type) |> take-name)
                    src.watch-name  = (src.in)
                    src.dir-name    = (src.in)
                
                src.build-name  = src.dst-name  |> rebase-to(build-dir)
                str             = str + ct + src.build-name
                        
           if not into-file? 
                add-to-targets(getvar into-target-variable)
           else
                add-to-targets into-file 
                
           o str
           
           if into-file? 
                join-targets from-variable: into-target-variable, into-file: into-file
           
join-targets = ({from-variable, into-file, original-source-list}) ->
   
            it "merges file list into #{into-file}", {with-target: into-file, dependencies: getvar(from-variable), +not-phony} ->
                o "\t cat $^ > $@"
                
           
copy-targets = ({from-source-list, copy-into-dir}) ->
    
        if from-source-list?
            for src in from-source-list
                 
                if src.name? 
                    x "install -m 555 #{src.name} #{copy-into-dir}"
                         
                if src.files-of-type?
                    foreach-file-in-expression all(files-of-type: src.files-of-type, in: src.in), (file) ->
                       "install -m 555 #{file} #{copy-into-dir}" 

install-variable = ( variable-name, final-directory ) ->
    
install-file = ( {name, derived-from-list, final-directory } ) ->
    if derived-from-list?
        x "install -m 555 #name #final-directory" 
    
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
    o "\n\# Current configuration: "
    
    for i in _.str.lines(JSON.stringify(path-system, null, 2))
        console.log "\# #i"
        
    generate-makefile-ext(path-system,s)

task = ({with-name, step-list}) ->
   
    task-name = with-name
   
    it "runs task #with-name", {with-target: task-name}, ->
        for s in step-list 
            x "make #s"
        
        o ""

pretty = (x) ->
    if x? then x else ""


add-hook = (phase, predicate, action) ~>
    @hooks = []
    @hooks.push {phase: phase, predicate: predicate, action: action}
     
   
init-hooks-data = (cf, sf, vf, cs, ch, im, fo) ~>
    @big-list-of-files = []
    for l in [cf, sf, vf, cs, ch ]
        @big-list-of-files = @big-list-of-files.concat(l)
    
execute-hooks = (phase) ~>
    for h in @hooks
        if h.phase == phase
            for file in @big-list-of-files 
                if h.predicate(file)
                    h.action(file, path-system)
                    
add-hook '_deploy', -> (it?.root? and it.root), (file, path-system) ->
    x "install -m 555 #{file.final-name} #{path-system.client-dir}"

add-hook 'server',  -> (it?.main? and it.main), (file, path-system) ->
    x nodemon("#{path-system.server-dir}/#{file.dst-name}")

add-hook 'server',  -> (it?.test? and it.test), (file, path-system) ->
    x "watchman -r 3s -w ./client-changed 'mocha #{path-system.server-dir}/#{file.dst-name} --reporter spec' &"

get-watch-names = ~>
    @big-list-of-files |> filter (-> it?) |> (.watch-name)
    
get-source-dirs = ~>
    @big-list-of-files |> filter (-> it?) |> (.dir-name)
   
 
generate-makefile-ext = ( path-system-options, files ) ->

    { build-dir, deploy-dir, server-dir, client-dir, client-dir-img, client-dir-fonts } = path-system-options
    { client-js: cf, vendor-js: vf, server-js: sf, client-css: cs }                     = files
    { client-html: ch, client-img: im, client-fonts: fo, depth: dp }                    = files 
    { trigger-files:  trigger-files, additional-commands: additional-commands }         = files
   
    
    reset-targets()
    init-hooks-data(cf, sf, vf, cs, ch)
   
    collect-targets(from-source-list: cf, into-target-variable: "client sources",       build-dir: build-dir,  final-type: \js,   into-file:       "#build-dir/client.js" )
    collect-targets(from-source-list: sf, into-target-variable: "server sources",       build-dir: build-dir,  final-type: \js)
    collect-targets(from-source-list: vf, into-target-variable: "vendor client sources",build-dir: build-dir,  final-type: \js,   into-file:       "#build-dir/vendor.js")
    collect-targets(from-source-list: cs, into-target-variable: "client css",           build-dir: build-dir,  final-type: \css,  into-file:       "#build-dir/client.css")
    collect-targets(from-source-list: ch, into-target-variable: "client html",          build-dir: build-dir,  final-type: \html)
  
  
    it 'deploys all targets', {with-target: \all }, -> 
        x 'make deploy'
     
    task with-name: "deploy",  step-list: ["pre-deploy", "build", "_deploy", "post-deploy"]
    task with-name: "build",   step-list: ["pre-build", "_build"]

    it 'creates temporary directories', {with-target: "pre-build"}, ->
        x "mkdir -p #build-dir"
   
   
    it 'creates deploy directories', {with-target: "pre-deploy"}, ->
        x "mkdir -p #deploy-dir" 
        x "mkdir -p #server-dir"        unless not sf?
        x "mkdir -p #client-dir"        unless not cf? and not cs? and not im? and not fo? and not ch?
        x "mkdir -p #client-dir/js"     unless not cf?
        x "mkdir -p #client-dir/css"    unless not cs?
        x "mkdir -p #client-dir-img"    unless not im?
        x "mkdir -p #client-dir-fonts"  unless not fo?
        x "mkdir -p #client-dir/html"   unless not ch?

    it 'deploys files', {with-target: "_deploy"}, ->
        foreach-file-in("server sources",   (file) -> "install -m 555 #file #{server-dir}") unless not sf?
        foreach-file-in("client html",      (file) -> "install -m 555 #file #{client-dir}/html") unless not ch?
        
        install-file name: "#{build-dir}/client.js",    derived-from-list: cf, final-directory: "#client-dir/js" 
        install-file name: "#{build-dir}/vendor.js",    derived-from-list: vf, final-directory: "#client-dir/js" 
        install-file name: "#{build-dir}/client.css",   derived-from-list: cs, final-directory: "#client-dir/css"
        copy-targets from-source-list: im, copy-into-dir: client-dir-img 
        copy-targets from-source-list: fo, copy-into-dir: client-dir-fonts
        execute-hooks("_deploy")
        m "Deployed" 
    
    it 'post deploys files', {with-target: "post-deploy"}, ->
        m "nothing to do in post-deploy"

    it 'completes build', {with-target: '_build', dependencies: get-targets()}, ->

    assets-targets ="#{getvar('client img') unless not im?} #{getvar('client fonts') unless not im?} "
    
    p "VPATH definition"    
    o "VPATH = #{ce}"
    
    for path in get-source-dirs() 
        o "#bt #path #ce"
       
    # it 'starts continuous build', {with-target: \server}, ->
    #     x "@touch ./.client-changed"
    #     x "@touch ./.recompile-all"
        
    #     if not dp?
    #         dp = 2
            
    #     to-be-watched = sensitive-dirs(get-watch-names(), dp)
        
    #     for path in to-be-watched
    #         x watch(path, 'touch ./.client-changed')
        
    #     x watch './.client-changed', 'make deploy; chromereload;'
    #     x watch './.recompile-all',  'make clean && make deploy; chromereload;'
        
    #     execute-hooks("server")
    
#     if ch?
#         for s in ch 
#             if s.root? and s.root and (s.serve? and s.serve)
#                 console.log bt + "@serve #{client-dir} &" 
    
#     if trigger-files?
#         for t in trigger-files
#              console.log bt + watch(t, 'touch ./recompile-all')
    
#     if sf?
#         for s in sf
#             if s.test? and s.test then
#                 console.log "#{ht} Tests"
#                 console.log ".PHONY: test"
#                 console.log ""
#                 console.log "test:"
#                 console.log "\t mocha #{server-dir}/#{s.name |> take-name |> change-type(s.type, \js) |> trim } --reporter spec" 
     
    
#     console.log "#{ht} Stop Continuous Build" 
#     console.log "stop-cb:" 
#     console.log "\t -killall node"

#     common-targets = """
# #{build-dir}/%.js: %.ls
# #{echo-step "compiling $^"}
# \t lsc --output #{build-dir} -c $<

# #{build-dir}/%.js: %.js
# \t cp $< $@
    
# #{build-dir}/%.js: %.coffee
# #{echo-step "compiling $^"}
# \t coffee -b -l --output #{build-dir} -c $<
    
# #{build-dir}/%.html: %.jade
# #{echo-step "compiling $^"}
# \t @jade -P --out #{build-dir} $<

# #{build-dir}/%.css: %.css
# \t cp $< $@

# #{build-dir}/%.html: %.html
# \t cp $< $@

# #{build-dir}/%.html: %.svg
# \t cp $< $@

# #{build-dir}/%.css: %.styl
# #{echo-step "compiling $^"}
# \t stylus $< -o #{build-dir}

# #{client-dir-img}/%: %
# \t cp $< $@

# #{client-dir-fonts}/%: %
# \t cp $< $@

# makefile: makefile.ls
# #{echo-step "compiling $^"}
# \t ./makefile.ls > makefile 

# npm-install:
# #{echo-step "Installing a link globally on this machine."}
# #{echo-step "Remember to do a `npm link pkg_name` in the"}
# #{echo-step "directory of the modules that are going to use this."}
# \t npm link .

# #{npm-git-action('patch')}

# #{npm-git-action('minor')}

# #{npm-git-action('major')}
    
# npm-commit:
# \t git commit -a 

# npm-finalize:
# \t git checkout master
# \t git merge development
# \t npm publish .

# distclean:
# \t -rm -rf #{build-dir} 
# \t -rm -rf #{deploy-dir} 
    
# #{build-dir}/%.css: %.less 
# #{echo-step "compiling $^"}
# \t lessc --verbose $< > $@

# #{help()}
# """

   
#     console.log "#{ht} Common targets"
#     console.log common-targets 
    
#     console.log "#{ht} Clean up"
#     console.log "clean:"
#     console.log "\t  -rm -rf #{deploy-dir}/*"
#     console.log "\t  -rm -rf #{build-dir}/*"
#     console.log "\t  -rm -f ./client-changed"
#     console.log "\t  -rm -f ./recompile-all"
   
#     if im? or fo? 
#         console.log "#{ht} Install assets"
#         console.log echo-step "installing assets"
#         console.log "install-assets: #{if im? then getvar('client img') else ''} #{if fo? then getvar('client fonts') else ''}"
        
# generate-makefile                   = generate-makefile-ext(path-system.build-dir, path-system.deploy-dir, path-system.server-dir, path-system.client-dir, path-system.client-dir-img, path-system.client-dir-fonts)
# exports.generate-makefile           = generate-makefile
# exports.generate-makefile-ext       = generate-makefile-ext
# exports.generate-makefile-config    = generate-makefile-config
exports.make-ps                     = generate-makefile-config-ps
exports.all                         = all 









