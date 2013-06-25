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
    "@watchman -w #file \'#{command}\' 1>&2 > /dev/null & " + 'echo "$$!" >> "./.watches.pid"'
    
nodemon = (file, command) ->
    "@nodemon -q #file & " + 'echo "$$!" >> "./.watches.pid"'

watch-w-rate = (file, command, rate) ->
    "@watchman -r #rate -w #file \'#{command}\' 1>&2 > /dev/null & " + 'echo "$$!" >> "./.watches.pid"'

serve = (directory) ->
    

echo =  (stepname, level=0) ->
    lvs = [ ' ' for e from 1 to level*2 ] * ''
    "\t @echo \' #{lvs}#{mprint(stepname)}\' 1>&2"
    
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
            { name: "reverse",  description: "stops continuous build"}
        ]
    }
    {
        category: 'other', targets: [
            { name: "test", description: "run mocha tests"}
        ]
    }
    {
        category: 'release management', targets: [
            { name: "git-{patch, minor, major}",            description: "Commits, tags and pushes the current branch" }
            { name: "npm-{patch, minor, major}",            description: "As git-*, but it does publish on npm"}
            { name: "npm-install",      description: "install a global link to this package, to use it: #{'npm link pkgname' |> cd} in the target dir"}
            { name: "npm-prepare-x",    description: "prepare npm version update and gittag it - x={ patch, minor, major }"}
            { name: "npm-commit",       description: "commit version change"}
            { name: "npm-finalize",     description: "merge development branch into master and publish npm"}
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
    #{echo "Warning - This is going to tag the current dev. branch and merge it to master."}
    #{echo "The tag will be brought to the master branch."}
    #{echo "After this action, do `make npm-commit` and `make npm-finalize` to "}
    #{echo "Publish to the npm repository."}
    \t git checkout development
    \t npm version #action 

    npm-#action:
    #{echo "Warning - This is going to tag the current dev. branch and merge it to master."}
    #{echo "The tag will be brought to the master branch and the package will be published on npm."}
    \t git checkout development
    \t npm version #action 
    \t make npm-commit
    \t make npm-finalize
    """

git-action = (action) ->
    """
    git-#action:
    #{echo "Update version, commit and tag the current branch"}
    #{echo "Does not publish to the npm repository."}
    \t npm version #action 
    \t git push
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
    
    # for i in _.str.lines(JSON.stringify(path-system, null, 2))
    #     console.log "\# #i"

    for k,v of path-system
        o "#{makeify k}=#v"
        
    generate-makefile-ext(path-system,s)

task = ({with-name, step-list}) ->
   
    task-name = with-name
   
    it "runs task #with-name", {with-target: task-name}, ->
        for s in step-list 
            x "make #s"
        
        o ""

pretty = (x) ->
    if x? then x else ""



class hooks-data
   
    -> 
        @hooks = []
        @big-list-of-files = []
    
    init-hooks-data: (cf, sf, vf, cs, ch, im, fo) ~>
        for l in [cf, sf, vf, cs, ch ]
            @big-list-of-files = @big-list-of-files.concat(l)
    
    add-hook: (phase, predicate, action) ~>
        @hooks.push {phase: phase, predicate: predicate, action: action}
        
    execute-hooks: (phase) ~>
        for h in @hooks
            if h.predicate?
                if h.phase == phase
                    for file in @big-list-of-files 
                        if h.predicate(file)
                            h.action(file, path-system)
            else
                if h.phase == phase
                    h.action(path-system)
        
    get-watch-names: ~>
        @big-list-of-files |> filter (-> it?.watch-name?) |> map (.watch-name)
   
    get-source-dirs: ~>
        @big-list-of-files |> filter (-> it?.watch-name?) |> map (.dir-name)

hooks = new hooks-data()
                    
hooks.add-hook '_deploy', -> (it?.root? and it.root), (file, path-system) ->
    x "install -m 555 #{file.build-name} #{path-system.client-dir}"

hooks.add-hook 'server',  -> (it?.main? and it.main), (file, path-system) ->
    x nodemon("#{path-system.server-dir}/#{file.dst-name |> trim }")

hooks.add-hook 'server',  -> (it?.test? and it.test), (file, path-system) ->
    x watch-w-rate('./.client-changed', "make test", "3s")
   
hooks.add-hook 'server',  -> (it?.serve? and it.serve), (file, path-system) ->
    x serve(path-system.client-dir)

hooks.add-hook 'test', -> (it?.test? and it.test), (file, path-system) ->
    x "mocha #{path-system.server-dir}/#{file.dst-name |> trim} --reporter spec"
    

class translation-plugins
    
    ->
        @plugins = []
        
    output-translation: (s-ext, d-ext, command, path-system) ~~>
       
        p "Converting from #{s-ext} to #{d-ext}"  
        o "#{path-system.build-dir}/%.#{d-ext}: %.#{s-ext}"
        x "#{command('$<', '$@', '$^', '$(BUILD_DIR)')}"
 
    output-specific-translation: (s-name, d-name, dependencies, command, path-system) ~~>
       
        p "Converting from #{s-name} to #{d-name}"  
        o "#{d-name}: #s-name #dependencies"
        x "#{command('$<', '$@', '$^', '$(BUILD_DIR)')}"       
    
    add-translation: (s-ext, d-ext, command) ~>
        @plugins.push(@output-translation(s-ext, d-ext, command))
  
    add-specific-translation: (s-name, d-name, dependencies, command) ~>
        @plugins.push(@output-specific-translation(s-name, d-name, dependencies, command))
        
    output-default-translations: ~>
        plugins.add-translation(\ls,     \js,   (source-name, dest-name, depencencies, build-dir) -> "lsc --output #{build-dir} -c #{source-name}")      
        plugins.add-translation(\coffee, \js,   (source-name, dest-name, depencencies, build-dir) -> "coffee -b -l --output #{build-dir} #{source-name}")      
        plugins.add-translation(\jade,   \html, (source-name, dest-name, depencencies, build-dir) -> "@jade -P --out #{build-dir} #{source-name}")      
        plugins.add-translation(\styl,   \css,  (source-name, dest-name, depencencies, build-dir) -> "stylus $< -o #{build-dir}")     
        plugins.add-translation(\less,   \css,  (source-name, dest-name, depencencies, build-dir) -> "lessc --verbose #{source-name} > #{dest-name}" )
        
        for c in [ \js \css \svg ]
            plugins.add-translation(c, c, (source-name, dest-name, depencencies, build-dir) -> "cp #{source-name} #{dest-name}")   
    
    output-translations: (path-system) ~>
        @output-default-translations()
        for p in @plugins 
            p(path-system)
        

plugins = new translation-plugins()

hooks.add-hook '_build', -> (it?.include? and it.include), (file, path-system) ->
    plugins.add-specific-translation(file.name, file.build-name, file.deps,  (source-name, dest-name, depencencies, build-dir) -> 
        "lessc --verbose --include-path=#{file.include} #{source-name} > #{dest-name}")
    
    
generate-makefile-ext = ( path-system-options, files ) ->

    { build-dir, deploy-dir, server-dir, client-dir, client-dir-img, client-dir-fonts } = path-system-options
    { client-js: cf, vendor-js: vf, server-js: sf, client-css: cs }                     = files
    { client-html: ch, client-img: im, client-fonts: fo, depth: dp }                    = files 
    { trigger-files:  trigger-files, additional-commands: additional-commands }         = files

    it 'deploy all targets', {with-target: \all }, -> 
        x 'make deploy'   
    
    reset-targets()
    hooks.init-hooks-data(cf, sf, vf, cs, ch)
   
    collect-targets(from-source-list: cf, into-target-variable: "client sources",       build-dir: build-dir,  final-type: \js,   into-file:       "#build-dir/client.js" )
    collect-targets(from-source-list: sf, into-target-variable: "server sources",       build-dir: build-dir,  final-type: \js)
    collect-targets(from-source-list: vf, into-target-variable: "vendor client sources",build-dir: build-dir,  final-type: \js,   into-file:       "#build-dir/vendor.js")
    collect-targets(from-source-list: cs, into-target-variable: "client css",           build-dir: build-dir,  final-type: \css,  into-file:       "#build-dir/client.css")
    collect-targets(from-source-list: ch, into-target-variable: "client html",          build-dir: build-dir,  final-type: \html)
  
    it 'create temporary directories', {with-target: "pre-build"}, ->
        x "mkdir -p #build-dir"
   
   
    it 'create deploy directories', {with-target: "pre-deploy"}, ->
        x "mkdir -p #deploy-dir" 
        x "mkdir -p #server-dir"        unless not sf?
        x "mkdir -p #client-dir"        unless not cf? and not cs? and not im? and not fo? and not ch?
        x "mkdir -p #client-dir/js"     unless not cf?
        x "mkdir -p #client-dir/css"    unless not cs?
        x "mkdir -p #client-dir-img"    unless not im?
        x "mkdir -p #client-dir-fonts"  unless not fo?
        x "mkdir -p #client-dir/html"   unless not ch?

    it 'deploy files', {with-target: "_deploy"}, ->
        foreach-file-in("server sources",   (file) -> "install -m 555 #file #{server-dir}") unless not sf?
        foreach-file-in("client html",      (file) -> "install -m 555 #file #{client-dir}/html") unless not ch?
        
        install-file name: "#{build-dir}/client.js",    derived-from-list: cf, final-directory: "#client-dir/js" 
        install-file name: "#{build-dir}/vendor.js",    derived-from-list: vf, final-directory: "#client-dir/js" 
        install-file name: "#{build-dir}/client.css",   derived-from-list: cs, final-directory: "#client-dir/css"
        copy-targets from-source-list: im, copy-into-dir: client-dir-img 
        copy-targets from-source-list: fo, copy-into-dir: client-dir-fonts
        hooks.execute-hooks("_deploy")
        m "Deployed" 
    
    it 'post deploy files', {with-target: "post-deploy"}, ->
        hooks.execute-hooks("post-deploy")

    it 'build completed', {with-target: '_build', dependencies: get-targets()}, ->
        hooks.execute-hooks("_build")

    assets-targets ="#{getvar('client img') unless not im?} #{getvar('client fonts') unless not im?} "
   
    task with-name: "deploy",  step-list: ["pre-deploy", "build", "_deploy", "post-deploy"]
    task with-name: "build",   step-list: ["pre-build", "_build"]
 
    p "VPATH definition"    
    o "VPATH = #{ce}"
    
    for path in hooks.get-source-dirs() 
        o "#bt #path #ce"
       
    it 'start continuous build', {with-target: \server}, ->
        x "@touch ./.client-changed"
        x "@touch ./.recompile-all"
        x "echo '' > ./.watches.pid"
        
        if not dp?
            dp = 2
            
        to-be-watched = sensitive-dirs(hooks.get-watch-names(), dp)
        
        for path in to-be-watched
            x watch(path, 'touch ./.client-changed')
        
        x watch './.client-changed', 'make deploy; chromereload;'
        x watch './.recompile-all',  'make clean && make deploy; chromereload;'
        
        hooks.execute-hooks("server")
        
        map (-> x watch(it, 'touch ./recompile-all')) trigger-files unless not trigger-files?

   
    it 'stops the continuous build', (with-target: \reverse), ->
        x "cat ./.watches.pid | xargs -n 1 kill -9"
    
    it 'tests server files', { with-target: \test }, ->
        hooks.execute-hooks("test")
        
   
    plugins.output-translations(path-system-options)

    o help()
    
    it 'Installs a link globally on this machine', { with-target: "npm-install" }, ->
        m "Remember to do a `npm link pkg_name` in the"
        m "directory of the modules that are going to use this."
        x "npm link ."

    p "npm patch"
    o npm-git-action('patch')
    
    p "npm minor"
    o npm-git-action('minor')
    
    p "npm major"
    o npm-git-action('major')
    
    p "git patch"
    o git-action('patch')
    
    p "git minor"
    o git-action('minor')
    
    p "git major"
    o git-action('major')
    
    it 'Commits changes to git', { with-target: "npm-commit"}, ->
        x "git commit -a"
    
    it 'merges changes into master and publish', { with-target: "npm-finalize"}, ->
        x "git checkout master"
        x "git merge development"
        x "npm publish ."

    it 'cleanup all files in build and deploy', {with-target: "distclean"}, ->
        x "-rm -rf #{build-dir}"
        x "-rm -rf #{deploy-dir}"
        x "-rm -f ./.client-changed"
        x "-rm -f ./.recompile-all"
        x "-rm -f ./.watches.pid"
    
    it 'cleanup ', {with-target: "clean"}, ->
        x "-rm -rf #{build-dir}"
        x "-rm -rf #{deploy-dir}"
 
   
exports.wMake      = generate-makefile-config-ps
exports.simpleMake = generate-makefile-config-ps({})
exports.all        = all 
exports.plugins    = plugins
exports.hooks      = hooks
exports.x          = x









