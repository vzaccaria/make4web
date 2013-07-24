
exports.augment-plugins = (wmake) ->
   
        # SRC -> BUILD translations used for all the common targets
        wmake.add-translation(\ls,     \js,        (source-name, dest-name, depencencies, build-dir)  -> "lsc --output #{build-dir} -c #{source-name}")      
        wmake.add-translation(\coffee, \js,        (source-name, dest-name, depencencies, build-dir)  -> "coffee -b --output #{build-dir} #{source-name}")      
        wmake.add-translation(\jade,   \html,      (source-name, dest-name, depencencies, build-dir)  -> "@jade -P --out #{build-dir} #{source-name}")      
        wmake.add-translation(\styl,   \css,       (source-name, dest-name, depencencies, build-dir)  -> "stylus $< -o #{build-dir}")     
        wmake.add-translation(\less,   \css,       (source-name, dest-name, depencencies, build-dir)  -> "lessc --verbose #{source-name} > #{dest-name}" )
        wmake.add-translation(\sass,   \css,       (source-name, dest-name, depencencies, build-dir)  -> "sass #{source-name} #{dest-name}" )
        wmake.add-translation(\scss,   \css,       (source-name, dest-name, depencencies, build-dir)  -> "sass --scss #{source-name} #{dest-name}" )

       
        # BUILD -> BUILD translations used to build minified js. Modify the options here.
        wmake.add-build-translation('js',    'min.js',          (source-name, dest-name, depencencies, build-dir)  -> "uglifyjs  #{source-name} > #{dest-name}" )
        wmake.add-build-translation('css',   'min.css',         (source-name, dest-name, depencencies, build-dir)  -> "uglifycss #{source-name} > #{dest-name}" )
        wmake.add-build-translation('js',    'min.js.gz',       (source-name, dest-name, depencencies, build-dir)  -> "uglifyjs  #{source-name} | gzip -c > #{dest-name}" )
        wmake.add-build-translation('css',   'min.css.gz',      (source-name, dest-name, depencencies, build-dir)  -> "uglifycss #{source-name} | gzip -c > #{dest-name}" )        
        
        for c in [ \js \css \html ]
            wmake.add-translation(c, c, (source-name, dest-name, depencencies, build-dir) -> "cp #{source-name} #{dest-name}")   
       
