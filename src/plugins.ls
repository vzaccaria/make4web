
exports.augment-plugins = (wmake) ->
   
        # SRC -> BUILD translations 
        wmake.add-translation(\ls,     \js,        (source-name, dest-name, depencencies, build-dir)  -> "lsc --output #{build-dir} -c #{source-name}")      
        wmake.add-translation(\coffee, \js,        (source-name, dest-name, depencencies, build-dir)  -> "coffee -b -l --output #{build-dir} #{source-name}")      
        wmake.add-translation(\jade,   \html,      (source-name, dest-name, depencencies, build-dir)  -> "@jade -P --out #{build-dir} #{source-name}")      
        wmake.add-translation(\styl,   \css,       (source-name, dest-name, depencencies, build-dir)  -> "stylus $< -o #{build-dir}")     
        wmake.add-translation(\less,   \css,       (source-name, dest-name, depencencies, build-dir)  -> "lessc --verbose #{source-name} > #{dest-name}" )
       
        # BUILD -> BUILD translations
         
        wmake.add-build-translation('js',    'min.js',   (source-name, dest-name, depencencies, build-dir)  -> "uglifyjs      #{source-name} > #{dest-name}" )
        wmake.add-build-translation('css',   'min.css',  (source-name, dest-name, depencencies, build-dir)  -> "uglifycss     #{source-name} > #{dest-name}" )
        
        for c in [ \js \css \svg ]
            wmake.add-translation(c, c, (source-name, dest-name, depencencies, build-dir) -> "cp #{source-name} #{dest-name}")   