(function(){
  var _, color, moment, ref$, filter, map, bbo, ita, cl, cd, mprint, pd, mok, merr, pathSystem, recomputePaths, silent, sensitiveDirs, tag, savePid, watch, nodemon, watchWRate, serve, echo, echoStep, echoOk, ct, ce, bt, ht, le, targets, help, npmGitAction, gitAction, makeify, getvar, all, join, changeType, rebaseTo, takeName, takeDir, trim, reduceTo, now, resetTargets, addToTargets, getTargets, o, cc, m, x, p, it, foreachFileIn, foreachFileInExpression, getDestinationTargets, getSourceDirOfTarget, getWatchNameOfTarget, getFinalTypeOfTarget, collectTargets, joinTargets, copyTargets, installVariable, installFile, generateMakefileConfigPs, task, pretty, hooksData, hooks, translationPlugins, plugins, generateMakefileExt, join$ = [].join, this$ = this;
  _ = require('underscore');
  _.str = require('underscore.string');
  color = require("ansi-color").set;
  moment = require('moment');
  ref$ = require('prelude-ls'), filter = ref$.filter, map = ref$.map;
  bbo = function(s){
    return color(s, "bold");
  };
  ita = function(s){
    return color(s, "italic");
  };
  cl = curry$(function(c, s){
    return color(s, c);
  });
  cd = function(s){
    return color(s, 'underline');
  };
  mprint = function(s){
    return color(_.str.humanize(s), "blue");
  };
  pd = curry$(function(amount, what){
    return _.str.rpad(what, amount);
  });
  mok = function(s){
    return color(s, "green");
  };
  merr = function(s){
    return color("red") + s;
  };
  pathSystem = {
    buildDir: "./build",
    deployDir: "./deploy",
    localServerDir: "server",
    localClientDir: "static"
  };
  recomputePaths = function(p){
    p.serverDir = p.deployDir + "/" + p.localServerDir;
    p.clientDir = p.deployDir + "/" + p.localClientDir;
    p.clientDirImg = p.clientDir + "/img";
    return p.clientDirFonts = p.clientDir + "/font";
  };
  recomputePaths(pathSystem);
  silent = function(command){
    return "@" + command;
  };
  sensitiveDirs = function(files, n){
    var hs, i$, ref$, f, len$, e, k, v;
    hs = {};
    for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
      e = ref$[i$];
      hs[_.str.toSentence(e, '/', '/')] = true;
    }
    return (function(){
      var ref$, results$ = [];
      for (k in ref$ = hs) {
        v = ref$[k];
        results$.push(k);
      }
      return results$;
    }());
    function fn$(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = files).length; i$ < len$; ++i$) {
        f = ref$[i$];
        results$.push(_.first(_.str.words(f, '/'), n));
      }
      return results$;
    }
  };
  tag = 'lake';
  savePid = 'echo "$$!" >> "./.watches.pid"';
  watch = function(file, command){
    return "@watchman -w " + file + " '" + command + "' & " + savePid + " ";
  };
  nodemon = function(file, command){
    return "@nodemon -q " + file + " & " + savePid;
  };
  watchWRate = function(file, command, rate){
    return "@watchman -r " + rate + " -w " + file + " '" + command + "' & " + savePid;
  };
  serve = function(directory){
    return "@pushserve -P " + directory + " & " + savePid;
  };
  echo = function(stepname, level){
    var lvs, e;
    level == null && (level = 0);
    lvs = (function(){
      var i$, to$, results$ = [];
      for (i$ = 1, to$ = level * 2; i$ <= to$; ++i$) {
        e = i$;
        results$.push(' ');
      }
      return results$;
    }()).join('');
    return "\t @echo ' " + lvs + mprint(stepname) + "' 1>&2";
  };
  echoStep = function(stepname, level){
    var lvs, e;
    level == null && (level = 0);
    lvs = (function(){
      var i$, to$, results$ = [];
      for (i$ = 1, to$ = level * 2; i$ <= to$; ++i$) {
        e = i$;
        results$.push(' ');
      }
      return results$;
    }()).join('');
    return "\t @echo '' \n\t @echo ' " + lvs + mprint(stepname) + "' 1>&2";
  };
  echoOk = function(stepname, level){
    var lvs, e;
    level == null && (level = 0);
    lvs = (function(){
      var i$, to$, results$ = [];
      for (i$ = 1, to$ = level * 2; i$ <= to$; ++i$) {
        e = i$;
        results$.push(' ');
      }
      return results$;
    }()).join('');
    return "\t @echo '' \n\t @echo ' " + lvs + mok(stepname) + "' 1>&2";
  };
  ct = " \\\n\t";
  ce = " \\";
  bt = "\t";
  ht = "\n#";
  le = "\n\t";
  targets = [
    {
      category: 'common',
      targets: [
        {
          name: 'deploy',
          description: "(default). Complete deal, create directories, build and install; eventually install assets"
        }, {
          name: 'build',
          description: "compile all files into build directory"
        }
      ]
    }, {
      category: 'continuous build',
      targets: [
        {
          name: "server",
          description: "starts continuous build"
        }, {
          name: "reverse",
          description: "stops continuous build"
        }
      ]
    }, {
      category: 'other',
      targets: [{
        name: "test",
        description: "run mocha tests"
      }]
    }, {
      category: 'release management',
      targets: [
        {
          name: "git-{patch, minor, major}",
          description: "Commits, tags and pushes the current branch"
        }, {
          name: "npm-{patch, minor, major}",
          description: "As git-*, but it does publish on npm"
        }, {
          name: "npm-install",
          description: "install a global link to this package, to use it: " + cd(
          'npm link pkgname') + " in the target dir"
        }, {
          name: "npm-prepare-x",
          description: "prepare npm version update and gittag it - x={ patch, minor, major }"
        }, {
          name: "npm-commit",
          description: "commit version change"
        }, {
          name: "npm-finalize",
          description: "merge development branch into master and publish npm"
        }
      ]
    }
  ];
  help = function(){
    var s, i$, ref$, len$, c, j$, ref1$, len1$, e;
    s = "help:\n\t @echo 'Makefile targets'\n";
    for (i$ = 0, len$ = (ref$ = targets).length; i$ < len$; ++i$) {
      c = ref$[i$];
      s = s + "\t @echo ''\n";
      s = s + ("\t @echo '    " + cl('red')(
      _.str.humanize(
      c.category)) + ":' \n");
      for (j$ = 0, len1$ = (ref1$ = c.targets).length; j$ < len1$; ++j$) {
        e = ref1$[j$];
        s = s + ("\t @echo '        " + bbo(
        pd(15)(
        e.name)) + ": " + _.str.humanize(
        e.description) + ".' \n");
      }
    }
    return s + "\t @echo ''\n";
  };
  npmGitAction = function(action){
    return "npm-prepare-" + action + ":\n" + echo("Warning - This is going to tag the current dev. branch and merge it to master.") + "\n" + echo("The tag will be brought to the master branch.") + "\n" + echo("After this action, do `make npm-commit` and `make npm-finalize` to ") + "\n" + echo("Publish to the npm repository.") + "\n\t git checkout development\n\t npm version " + action + " \n\nnpm-" + action + ":\n" + echo("Warning - This is going to tag the current dev. branch and merge it to master.") + "\n" + echo("The tag will be brought to the master branch and the package will be published on npm.") + "\n\t git checkout development\n\t npm version " + action + " \n\t make npm-finalize";
  };
  gitAction = function(action){
    return "git-" + action + ":\n" + echo("Update version, commit and tag the current branch") + "\n" + echo("Does not publish to the npm repository.") + "\n\t npm version " + action + " \n\t git push";
  };
  makeify = function(s){
    return _.str.underscored(_.str.dasherize(s)).toUpperCase();
  };
  getvar = function(s){
    return "$(" + makeify(s) + ")";
  };
  all = function(arg$){
    var x, dir;
    x = arg$.filesOfType, dir = arg$['in'];
    return "$(shell find " + dir + " -name '*." + x + "')";
  };
  join = function(l1, l2){
    return "$(join " + l1 + " " + l2 + ")";
  };
  changeType = curry$(function(fr, tto, list){
    return "$(patsubst %." + fr + ", %." + tto + ", " + list + ")";
  });
  rebaseTo = curry$(function(dir, list){
    return trim(
    "$(patsubst %, " + dir + "/%, " + list + ")");
  });
  takeName = curry$(function(list){
    return "$(notdir " + list + ")";
  });
  takeDir = curry$(function(list){
    return "$(dir " + list + ")";
  });
  trim = function(list){
    return "$(strip " + list + ")";
  };
  reduceTo = function(name, list){
    return (makeify(name) + " = " + ct) + join$.call(list, ct + "");
  };
  now = function(){
    return moment().format('MMMM Do YYYY, h:mm:ss a');
  };
  resetTargets = function(){
    return this$.ft = "";
  };
  addToTargets = function(x){
    return this$.ft = this$.ft + " " + bt + " " + x + " " + ce + "\n";
  };
  getTargets = function(){
    return this$.ft;
  };
  o = function(x){
    return console.log(x);
  };
  cc = function(x){
    return o("# " + x);
  };
  m = function(x){
    o(echo("└─(" + _.str.humanize(x) + "."));
    return o(echo(""));
  };
  x = function(y){
    return o("\t " + y);
  };
  p = function(z){
    if (z == null) {
      return o("");
    } else {
      return o("\n# " + _.str.humanize(z));
    }
  };
  it = function(description, arg$, cb){
    var withTarget, dependencies, notPhony;
    withTarget = arg$.withTarget, dependencies = arg$.dependencies, notPhony = arg$.notPhony;
    p(description + "");
    if (notPhony == null) {
      o(".PHONY: " + withTarget);
    }
    o(withTarget + ": " + pretty(
    dependencies));
    return cb();
  };
  foreachFileIn = function(variableName, cb){
    return o("\t @for i in " + getvar(variableName) + "; do \\\n\t\t " + cb('$$i') + "; \\\n\t done ");
  };
  foreachFileInExpression = function(expression, cb){
    return o("\t @for i in " + expression + "; do \\\n\t\t " + cb('$$i') + "; \\\n\t done ");
  };
  getDestinationTargets = function(src, finalType){
    if (src.name != null) {
      return changeType(src.type, finalType)(
      takeName(
      src.name));
    } else {
      return takeName(
      changeType(src.filesOfType, finalType)(
      all({
        filesOfType: src.filesOfType,
        'in': src['in']
      })));
    }
  };
  getSourceDirOfTarget = function(src){
    if (src.name != null) {
      return takeDir(
      src.name);
    } else {
      return src['in'];
    }
  };
  getWatchNameOfTarget = function(src){
    if (src.name != null) {
      return src.name;
    } else {
      return src['in'];
    }
  };
  getFinalTypeOfTarget = function(customType, finalType, plugins, src){
    if (src.name != null) {
      if (customType != null && customType && plugins.translationPairs[src.type]) {
        return plugins.translationPairs[src.type];
      }
    }
    if (src.filesOfType != null) {
      if (customType != null && customType && plugins.translationPairs[src.filesOfType]) {
        return plugins.translationPairs[src.filesOfType];
      }
    }
    return finalType;
  };
  collectTargets = function(arg$){
    var buildDir, fromSourceList, intoTargetVariable, intoFile, customType, finalType, description, str, i$, len$, src;
    buildDir = arg$.buildDir, fromSourceList = arg$.fromSourceList, intoTargetVariable = arg$.intoTargetVariable, intoFile = arg$.intoFile, customType = arg$.customType, finalType = arg$.finalType, description = arg$.description;
    if (fromSourceList != null) {
      if (description != null) {
        p(description);
      } else {
        p("");
      }
      str = makeify(intoTargetVariable) + "=";
      for (i$ = 0, len$ = fromSourceList.length; i$ < len$; ++i$) {
        src = fromSourceList[i$];
        finalType = getFinalTypeOfTarget(customType, finalType, plugins, src);
        src.watchName = getWatchNameOfTarget(src);
        src.dirName = getSourceDirOfTarget(src);
        src.dstName = getDestinationTargets(src, finalType);
        src.buildName = rebaseTo(buildDir)(
        src.dstName);
        str = str + ct + src.buildName;
      }
      if (intoFile == null) {
        addToTargets(getvar(intoTargetVariable));
      } else {
        addToTargets(intoFile);
      }
      o(str);
      if (intoFile != null) {
        return joinTargets({
          fromVariable: intoTargetVariable,
          intoFile: intoFile
        });
      }
    }
  };
  joinTargets = function(arg$){
    var fromVariable, intoFile, originalSourceList;
    fromVariable = arg$.fromVariable, intoFile = arg$.intoFile, originalSourceList = arg$.originalSourceList;
    return it("merges file list into " + intoFile, {
      withTarget: intoFile,
      dependencies: getvar(fromVariable),
      notPhony: true
    }, function(){
      return o("\t cat $^ > $@");
    });
  };
  copyTargets = function(arg$){
    var fromSourceList, copyIntoDir, i$, len$, src, results$ = [];
    fromSourceList = arg$.fromSourceList, copyIntoDir = arg$.copyIntoDir;
    if (fromSourceList != null) {
      for (i$ = 0, len$ = fromSourceList.length; i$ < len$; ++i$) {
        src = fromSourceList[i$];
        if (src.name != null) {
          x("install -m 555 " + src.name + " " + copyIntoDir);
        }
        if (src.filesOfType != null) {
          results$.push(foreachFileInExpression(all({
            filesOfType: src.filesOfType,
            'in': src['in']
          }), fn$));
        }
      }
      return results$;
    }
    function fn$(file){
      return "install -m 555 " + file + " " + copyIntoDir;
    }
  };
  installVariable = function(variableName, finalDirectory){};
  installFile = function(arg$){
    var name, derivedFromList, finalDirectory;
    name = arg$.name, derivedFromList = arg$.derivedFromList, finalDirectory = arg$.finalDirectory;
    if (derivedFromList != null) {
      return x("install -m 555 " + name + " " + finalDirectory);
    }
  };
  generateMakefileConfigPs = curry$(function(arg$, s){
    var _buildDir, _deployDir, _localServerDir, _localClientDir, k, ref$, v;
    _buildDir = arg$.buildDir, _deployDir = arg$.deployDir, _localServerDir = arg$.localServerDir, _localClientDir = arg$.localClientDir;
    if (_buildDir != null) {
      pathSystem.buildDir = _buildDir;
    }
    if (_deployDir != null) {
      pathSystem.deployDir = _deployDir;
    }
    if (_localServerDir != null) {
      pathSystem.localServerDir = _localServerDir;
    }
    if (_localClientDir != null) {
      pathSystem.localClientDir = _localClientDir;
    }
    recomputePaths(pathSystem);
    o("# Makefile generated automatically on " + now());
    o("# (c) 2013 - Vittorio Zaccaria, all rights reserved");
    o("\n# Current configuration: ");
    for (k in ref$ = pathSystem) {
      v = ref$[k];
      o(makeify(k) + "=" + v);
    }
    return generateMakefileExt(pathSystem, s);
  });
  task = function(arg$){
    var withName, stepList, taskName;
    withName = arg$.withName, stepList = arg$.stepList;
    taskName = withName;
    return it("runs task " + withName, {
      withTarget: taskName
    }, function(){
      var i$, ref$, len$, s;
      for (i$ = 0, len$ = (ref$ = stepList).length; i$ < len$; ++i$) {
        s = ref$[i$];
        x("@make " + s);
      }
      return o("");
    });
  };
  pretty = function(x){
    if (x != null) {
      return x;
    } else {
      return "";
    }
  };
  hooksData = (function(){
    hooksData.displayName = 'hooksData';
    var prototype = hooksData.prototype, constructor = hooksData;
    function hooksData(){
      this.getSourceDirs = bind$(this, 'getSourceDirs', prototype);
      this.getWatchNames = bind$(this, 'getWatchNames', prototype);
      this.executeHooks = bind$(this, 'executeHooks', prototype);
      this.addHook = bind$(this, 'addHook', prototype);
      this.initHooksData = bind$(this, 'initHooksData', prototype);
      this.hooks = [];
      this.bigListOfFiles = [];
    }
    prototype.initHooksData = function(cf, sf, vf, cs, ch, ot, im){
      var i$, ref$, len$, l, results$ = [];
      for (i$ = 0, len$ = (ref$ = [ot, ch, cs, cf, sf, vf, im]).length; i$ < len$; ++i$) {
        l = ref$[i$];
        results$.push(this.bigListOfFiles = this.bigListOfFiles.concat(l));
      }
      return results$;
    };
    prototype.addHook = function(phase, predicate, action){
      return this.hooks.push({
        phase: phase,
        predicate: predicate,
        action: action
      });
    };
    prototype.executeHooks = function(phase){
      var i$, ref$, len$, h, lresult$, j$, ref1$, len1$, file, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.hooks).length; i$ < len$; ++i$) {
        h = ref$[i$];
        lresult$ = [];
        if (h.predicate != null) {
          if (h.phase === phase) {
            for (j$ = 0, len1$ = (ref1$ = this.bigListOfFiles).length; j$ < len1$; ++j$) {
              file = ref1$[j$];
              if (h.predicate(file)) {
                lresult$.push(h.action(file, pathSystem));
              }
            }
          }
        } else {
          if (h.phase === phase) {
            lresult$.push(h.action(pathSystem));
          }
        }
        results$.push(lresult$);
      }
      return results$;
    };
    prototype.getWatchNames = function(){
      return map(function(it){
        return it.watchName;
      })(
      filter(function(it){
        return (it != null ? it.watchName : void 8) != null;
      })(
      this.bigListOfFiles));
    };
    prototype.getSourceDirs = function(){
      return map(function(it){
        return it.dirName;
      })(
      filter(function(it){
        return (it != null ? it.dirName : void 8) != null;
      })(
      this.bigListOfFiles));
    };
    return hooksData;
  }());
  hooks = new hooksData();
  hooks.addHook('_deploy', function(it){
    return (it != null ? it.root : void 8) != null && it.root;
  }, function(file, pathSystem){
    return x("install -m 555 " + file.buildName + " " + pathSystem.clientDir);
  });
  hooks.addHook('server', function(it){
    return (it != null ? it.main : void 8) != null && it.main;
  }, function(file, pathSystem){
    return x(nodemon(pathSystem.serverDir + "/" + trim(
    file.dstName)));
  });
  hooks.addHook('server', function(it){
    return (it != null ? it.test : void 8) != null && it.test;
  }, function(file, pathSystem){
    return x(watchWRate('./.client-changed', "make test", "3s"));
  });
  hooks.addHook('server', function(it){
    return (it != null ? it.serve : void 8) != null && it.serve;
  }, function(file, pathSystem){
    return x(serve(pathSystem.clientDir));
  });
  hooks.addHook('test', function(it){
    return (it != null ? it.test : void 8) != null && it.test;
  }, function(file, pathSystem){
    return x("mocha " + pathSystem.serverDir + "/" + trim(
    file.dstName) + " --reporter spec");
  });
  translationPlugins = (function(){
    translationPlugins.displayName = 'translationPlugins';
    var prototype = translationPlugins.prototype, constructor = translationPlugins;
    function translationPlugins(hooks){
      this.hooks = hooks;
      this.processExtension = bind$(this, 'processExtension', prototype);
      this.copyExtension = bind$(this, 'copyExtension', prototype);
      this.copySubtreeInto = bind$(this, 'copySubtreeInto', prototype);
      this.deployExtensionInto = bind$(this, 'deployExtensionInto', prototype);
      this.outputTranslations = bind$(this, 'outputTranslations', prototype);
      this.addDefaultTranslations = bind$(this, 'addDefaultTranslations', prototype);
      this.addSpecificTranslation = bind$(this, 'addSpecificTranslation', prototype);
      this.addBuildTranslation = bind$(this, 'addBuildTranslation', prototype);
      this.addTranslation = bind$(this, 'addTranslation', prototype);
      this.outputBuildTranslation = bind$(this, 'outputBuildTranslation', prototype);
      this.outputSpecificTranslation = bind$(this, 'outputSpecificTranslation', prototype);
      this.outputTranslation = bind$(this, 'outputTranslation', prototype);
      this.plugins = [];
      this.translationPairs = {};
      this.addDefaultTranslations();
      this.addToVpath = [];
    }
    prototype.outputTranslation = curry$(function(sExt, dExt, command, pathSystem){
      p("Converting from " + sExt + " to " + dExt);
      o(pathSystem.buildDir + "/%." + dExt + ": %." + sExt);
      return x(command('$<', '$@', '$^', '$(BUILD_DIR)') + "");
    });
    prototype.outputSpecificTranslation = curry$(function(sName, dName, dependencies, command, pathSystem){
      p("Converting from " + sName + " to " + dName);
      o(dName + ": " + sName + " " + dependencies);
      return x(command('$<', '$@', '$^', '$(BUILD_DIR)') + "");
    });
    prototype.outputBuildTranslation = curry$(function(sExt, dExt, command, pathSystem){
      p("Converting from " + sExt + " to " + dExt);
      o(pathSystem.buildDir + "/%." + dExt + ": " + pathSystem.buildDir + "/%." + sExt);
      return x(command('$<', '$@', '$^', '$(BUILD_DIR)') + "");
    });
    prototype.addTranslation = function(sExt, dExt, command){
      this.plugins.push(this.outputTranslation(sExt, dExt, command));
      return this.translationPairs[sExt] = dExt;
    };
    prototype.addBuildTranslation = function(sExt, dExt, command){
      this.plugins.push(this.outputBuildTranslation(sExt, dExt, command));
      return this.translationPairs[sExt] = dExt;
    };
    prototype.addSpecificTranslation = function(sName, dName, dependencies, command){
      return this.plugins.push(this.outputSpecificTranslation(sName, dName, dependencies, command));
    };
    prototype.addDefaultTranslations = function(){
      var augmentPlugins;
      augmentPlugins = require('./plugins').augmentPlugins;
      return augmentPlugins(this);
    };
    prototype.outputTranslations = function(pathSystem){
      var i$, ref$, len$, p, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.plugins).length; i$ < len$; ++i$) {
        p = ref$[i$];
        results$.push(p(pathSystem));
      }
      return results$;
    };
    prototype.deployExtensionInto = function(ext, intoDir){
      var this$ = this;
      console.log("# Adding extension for " + ext);
      return this.hooks.addHook('_deploy', null, function(pathSystem){
        x("@mkdir -p " + intoDir(pathSystem));
        return foreachFileInExpression(all({
          filesOfType: ext,
          'in': pathSystem.buildDir
        }), function(file){
          return "install -m 555 " + file + " " + intoDir(pathSystem);
        });
      });
    };
    prototype.copySubtreeInto = function(subtree, intoDir){
      return hooks.addHook('_deploy', null, function(pathSystem){
        x("@mkdir -p " + intoDir(pathSystem));
        return x("cp -R " + subtree + "/* " + intoDir(pathSystem));
      });
    };
    prototype.copyExtension = function(ext, intoDir){
      var this$ = this;
      this.addTranslation(ext, ext, function(sourceName, destName, depencencies, buildDir){
        return "cp " + sourceName + " " + destName;
      });
      return this.deployExtensionInto(ext, intoDir);
    };
    prototype.processExtension = function(list, ext, suffix, intoDir, command){
      var i$, len$, element, results$ = [];
      this.addTranslation(ext, suffix + "." + ext, command);
      this.deployExtensionInto(suffix + "." + ext, intoDir);
      for (i$ = 0, len$ = list.length; i$ < len$; ++i$) {
        element = list[i$];
        if ((element.type != null && element.type === ext) || (element.filesOfType != null && element.filesOfType === ext)) {
          hooks.addHook('pre-build', null, (fn$.call(this, element)));
          results$.push(this.addToVpath.push(getSourceDirOfTarget(element)));
        }
      }
      return results$;
      function fn$(element){
        var this$ = this;
        return function(pathSystem){
          return addToTargets(rebaseTo(pathSystem.buildDir)(
          getDestinationTargets(element, suffix + "." + ext)));
        };
      }
    };
    return translationPlugins;
  }());
  plugins = new translationPlugins(hooks);
  hooks.addHook('_build', function(it){
    return (it != null ? it.include : void 8) != null && it.include;
  }, function(file, pathSystem){
    return plugins.addSpecificTranslation(file.name, file.buildName, file.deps, function(sourceName, destName, depencencies, buildDir){
      return "lessc --verbose --include-path=" + file.include + " " + sourceName + " > " + destName;
    });
  });
  generateMakefileExt = function(pathSystemOptions, files){
    var buildDir, deployDir, serverDir, clientDir, clientDirImg, clientDirFonts, cf, vf, sf, cs, ch, im, fo, opt, ot, triggerFiles, additionalCommands, additionalDependencies, i$, ref$, len$, path;
    buildDir = pathSystemOptions.buildDir, deployDir = pathSystemOptions.deployDir, serverDir = pathSystemOptions.serverDir, clientDir = pathSystemOptions.clientDir, clientDirImg = pathSystemOptions.clientDirImg, clientDirFonts = pathSystemOptions.clientDirFonts;
    cf = files.clientJs, vf = files.vendorJs, sf = files.serverJs, cs = files.clientCss;
    ch = files.clientHtml, im = files.clientImg, fo = files.clientFonts, opt = files.options, ot = files.other;
    triggerFiles = files.triggerFiles, additionalCommands = files.additionalCommands;
    it('deploy all targets', {
      withTarget: 'all'
    }, function(){
      return x('make deploy');
    });
    resetTargets();
    hooks.initHooksData(cf, sf, vf, cs, ch, ot, im);
    collectTargets({
      fromSourceList: ot,
      intoTargetVariable: "other",
      buildDir: buildDir,
      customType: true
    });
    collectTargets({
      fromSourceList: ch,
      intoTargetVariable: "client html",
      buildDir: buildDir,
      finalType: 'html'
    });
    collectTargets({
      fromSourceList: cs,
      intoTargetVariable: "client css",
      buildDir: buildDir,
      finalType: 'css',
      intoFile: buildDir + "/client.css"
    });
    collectTargets({
      fromSourceList: cf,
      intoTargetVariable: "client sources",
      buildDir: buildDir,
      finalType: 'js',
      intoFile: buildDir + "/client.js"
    });
    collectTargets({
      fromSourceList: sf,
      intoTargetVariable: "server sources",
      buildDir: buildDir,
      finalType: 'js'
    });
    collectTargets({
      fromSourceList: vf,
      intoTargetVariable: "vendor client sources",
      buildDir: buildDir,
      finalType: 'js',
      intoFile: buildDir + "/vendor.js"
    });
    if ((opt != null ? opt.optimizeImg : void 8) != null && im != null) {
      plugins.processExtension(im, 'jpg', "thumb", function(pathSystem){
        return pathSystem.clientDirImg;
      }, function(sourceName, destName, depencencies, buildDir){
        return "convert -thumbnail 150 " + sourceName + " " + destName;
      });
      plugins.processExtension(im, 'jpg', "medium", function(pathSystem){
        return pathSystem.clientDirImg;
      }, function(sourceName, destName, depencencies, buildDir){
        return "convert " + sourceName + " -resize 500 " + destName;
      });
      plugins.processExtension(im, 'png', "min", function(pathSystem){
        return pathSystem.clientDirImg;
      }, function(sourceName, destName, depencencies, buildDir){
        return "optipng " + sourceName + " -out " + destName;
      });
    }
    it('create temporary directories', {
      withTarget: "pre-build"
    }, function(){
      x("@mkdir -p " + buildDir);
      return hooks.executeHooks("pre-build");
    });
    it('create deploy directories', {
      withTarget: "pre-deploy"
    }, function(){
      x("@mkdir -p " + deployDir);
      if (sf != null) {
        x("@mkdir -p " + serverDir);
      }
      if (!(cf == null && cs == null && im == null && fo == null && ch == null)) {
        x("@mkdir -p " + clientDir);
      }
      if (!(cf == null && vf == null)) {
        x("@mkdir -p " + clientDir + "/js");
      }
      if (cs != null) {
        x("@mkdir -p " + clientDir + "/css");
      }
      if (im != null) {
        x("@mkdir -p " + clientDirImg);
      }
      if (fo != null) {
        x("@mkdir -p " + clientDirFonts);
      }
      if (ch != null) {
        x("@mkdir -p " + clientDir + "/html");
      }
      return hooks.executeHooks("pre-deploy");
    });
    it('deploy files', {
      withTarget: "_deploy"
    }, function(){
      if (sf != null) {
        foreachFileIn("server sources", function(file){
          return "install -m 555 " + file + " " + serverDir;
        });
      }
      if (ch != null) {
        foreachFileIn("client html", function(file){
          return "install -m 555 " + file + " " + clientDir + "/html";
        });
      }
      installFile({
        name: buildDir + "/client.js",
        derivedFromList: cf,
        finalDirectory: clientDir + "/js"
      });
      installFile({
        name: buildDir + "/client.css",
        derivedFromList: cs,
        finalDirectory: clientDir + "/css"
      });
      installFile({
        name: buildDir + "/vendor.js",
        derivedFromList: vf,
        finalDirectory: clientDir + "/js"
      });
      if ((opt != null ? opt.minifyJs : void 8) != null || (opt != null ? opt.minifyClientJs : void 8) != null) {
        installFile({
          name: buildDir + "/client.min.js",
          derivedFromList: cf,
          finalDirectory: clientDir + "/js"
        });
      }
      if ((opt != null ? opt.minifyJs : void 8) != null || (opt != null ? opt.minifyVendorJs : void 8) != null) {
        installFile({
          name: buildDir + "/vendor.min.js",
          derivedFromList: vf,
          finalDirectory: clientDir + "/js"
        });
      }
      if ((opt != null ? opt.minifyCss : void 8) != null) {
        installFile({
          name: buildDir + "/client.min.css",
          derivedFromList: cs,
          finalDirectory: clientDir + "/css"
        });
      }
      if (((opt != null ? opt.minifyJs : void 8) != null || (opt != null ? opt.minifyClientJs : void 8) != null) && (opt != null ? opt.withGzip : void 8) != null) {
        installFile({
          name: buildDir + "/client.min.js.gz",
          derivedFromList: cf,
          finalDirectory: clientDir + "/js"
        });
      }
      if (((opt != null ? opt.minifyJs : void 8) != null || (opt != null ? opt.minifyVendorJs : void 8) != null) && (opt != null ? opt.withGzip : void 8) != null) {
        installFile({
          name: buildDir + "/vendor.min.js.gz",
          derivedFromList: vf,
          finalDirectory: clientDir + "/js"
        });
      }
      if ((opt != null ? opt.minifyCss : void 8) != null && (opt != null ? opt.withGzip : void 8) != null) {
        installFile({
          name: buildDir + "/client.min.css.gz",
          derivedFromList: cs,
          finalDirectory: clientDir + "/css"
        });
      }
      copyTargets({
        fromSourceList: im,
        copyIntoDir: clientDirImg
      });
      copyTargets({
        fromSourceList: fo,
        copyIntoDir: clientDirFonts
      });
      hooks.executeHooks("_deploy");
      return m("Deployed");
    });
    it('post deploy files', {
      withTarget: "post-deploy"
    }, function(){
      hooks.executeHooks("post-deploy");
      return m("post deploy done");
    });
    additionalDependencies = "";
    if ((opt != null ? opt.minifyJs : void 8) != null || (opt != null ? opt.minifyClientJs : void 8) != null) {
      additionalDependencies = buildDir + "/client.min.js ";
      if ((opt != null ? opt.withGzip : void 8) != null) {
        additionalDependencies = additionalDependencies + " " + buildDir + "/client.min.js.gz ";
      }
    }
    if ((opt != null ? opt.minifyJs : void 8) != null || (opt != null ? opt.minifyVendorJs : void 8) != null) {
      additionalDependencies = additionalDependencies + " " + buildDir + "/vendor.min.js";
      if ((opt != null ? opt.withGzip : void 8) != null) {
        additionalDependencies = additionalDependencies + " " + buildDir + "/vendor.min.js.gz ";
      }
    }
    if ((opt != null ? opt.minifyCss : void 8) != null) {
      additionalDependencies = additionalDependencies + " " + buildDir + "/client.min.css";
      if ((opt != null ? opt.withGzip : void 8) != null) {
        additionalDependencies = additionalDependencies + " " + buildDir + "/client.min.css.gz ";
      }
    }
    it('build completed', {
      withTarget: '_build',
      dependencies: getTargets() + (" " + additionalDependencies)
    }, function(){
      hooks.executeHooks("_build");
      return m("build completed");
    });
    task({
      withName: "deploy",
      stepList: ["pre-deploy", "build", "_deploy", "post-deploy"]
    });
    task({
      withName: "build",
      stepList: ["pre-build", "_build"]
    });
    p("VPATH definition");
    o("VPATH = " + ce);
    for (i$ = 0, len$ = (ref$ = hooks.getSourceDirs()).length; i$ < len$; ++i$) {
      path = ref$[i$];
      o(bt + " " + path + " " + ce);
    }
    for (i$ = 0, len$ = (ref$ = plugins.addToVpath).length; i$ < len$; ++i$) {
      path = ref$[i$];
      o(bt + " " + path + " " + ce);
    }
    it('start continuous build', {
      withTarget: 'server'
    }, function(){
      var opt, toBeWatched, i$, len$, path;
      x("@touch ./.client-changed");
      x("@touch ./.recompile-all");
      x("echo '' > ./.watches.pid");
      opt == null && (opt = {});
      opt.depth == null && (opt.depth = 2);
      toBeWatched = sensitiveDirs(hooks.getWatchNames(), opt.depth);
      for (i$ = 0, len$ = toBeWatched.length; i$ < len$; ++i$) {
        path = toBeWatched[i$];
        x(watch(path, 'touch ./.client-changed'));
      }
      x(watch('./.client-changed', 'make deploy; chromereload;'));
      x(watch('./.recompile-all', 'make clean && make deploy; chromereload;'));
      hooks.executeHooks("server");
      if (triggerFiles != null) {
        return map(function(it){
          return x(watch(it, 'touch ./.recompile-all'));
        }, triggerFiles);
      }
    });
    it('stops the continuous build', {
      withTarget: 'reverse'
    }, function(){
      return x("cat ./.watches.pid | xargs -n 1 kill -9");
    });
    it('tests server files', {
      withTarget: 'test'
    }, function(){
      return hooks.executeHooks("test");
    });
    plugins.outputTranslations(pathSystemOptions);
    o(help());
    it('Installs a link globally on this machine', {
      withTarget: "npm-install"
    }, function(){
      m("Remember to do a `npm link pkg_name` in the");
      m("directory of the modules that are going to use this.");
      return x("npm link .");
    });
    p("npm patch");
    o(npmGitAction('patch'));
    p("npm minor");
    o(npmGitAction('minor'));
    p("npm major");
    o(npmGitAction('major'));
    p("git patch");
    o(gitAction('patch'));
    p("git minor");
    o(gitAction('minor'));
    p("git major");
    o(gitAction('major'));
    it('Commits changes to git', {
      withTarget: "npm-commit"
    }, function(){
      return x("git commit -a");
    });
    it('merges changes into master and publish', {
      withTarget: "npm-finalize"
    }, function(){
      x("git checkout master");
      x("git merge development");
      x("npm publish .");
      x("git push");
      x("git push --tags");
      return x("git checkout development");
    });
    it('cleanup all files in build and deploy', {
      withTarget: "distclean"
    }, function(){
      x("-rm -rf " + buildDir);
      x("-rm -rf " + deployDir);
      x("-rm -f ./.client-changed");
      x("-rm -f ./.recompile-all");
      return x("-rm -f ./.watches.pid");
    });
    return it('cleanup ', {
      withTarget: "clean"
    }, function(){
      x("-rm -rf " + buildDir);
      return x("-rm -rf " + deployDir);
    });
  };
  exports.wMake = generateMakefileConfigPs;
  exports.wmake = generateMakefileConfigPs;
  exports.simpleMake = generateMakefileConfigPs({});
  exports.all = all;
  exports.plugins = plugins;
  exports.hooks = hooks;
  exports.x = x;
  function curry$(f, args){
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      return params.push.apply(params, arguments) < f.length && arguments.length ?
        curry$.call(this, f, params) : f.apply(this, params);
    } : f;
  }
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
