(function(){
  exports.augmentPlugins = function(wmake){
    var i$, ref$, len$, c;
    wmake.addTranslation('ls', 'js', function(sourceName, destName, depencencies, buildDir){
      return "lsc --output " + buildDir + " -c " + sourceName;
    });
    wmake.addTranslation('coffee', 'js', function(sourceName, destName, depencencies, buildDir){
      return "coffee -b --output " + buildDir + " " + sourceName;
    });
    wmake.addTranslation('jade', 'html', function(sourceName, destName, depencencies, buildDir){
      return "@jade -P --out " + buildDir + " " + sourceName;
    });
    wmake.addTranslation('styl', 'css', function(sourceName, destName, depencencies, buildDir){
      return "stylus $< -o " + buildDir;
    });
    wmake.addTranslation('less', 'css', function(sourceName, destName, depencencies, buildDir){
      return "lessc --verbose " + sourceName + " > " + destName;
    });
    wmake.addTranslation('sass', 'css', function(sourceName, destName, depencencies, buildDir){
      return "sass " + sourceName + " " + destName;
    });
    wmake.addTranslation('scss', 'css', function(sourceName, destName, depencencies, buildDir){
      return "sass --scss " + sourceName + " " + destName;
    });
    wmake.addBuildTranslation('js', 'min.js', function(sourceName, destName, depencencies, buildDir){
      return "uglifyjs      " + sourceName + " > " + destName;
    });
    wmake.addBuildTranslation('css', 'min.css', function(sourceName, destName, depencencies, buildDir){
      return "uglifycss     " + sourceName + " > " + destName;
    });
    for (i$ = 0, len$ = (ref$ = ['js', 'css']).length; i$ < len$; ++i$) {
      c = ref$[i$];
      wmake.addTranslation(c, c, fn$);
    }
    return wmake.copyExtension('svg', function(pathSystem){
      return pathSystem.clientDir + "/svg";
    });
    function fn$(sourceName, destName, depencencies, buildDir){
      return "cp " + sourceName + " " + destName;
    }
  };
}).call(this);
