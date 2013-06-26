(function(){
  var splitAtSeparator, renderText;
  splitAtSeparator = function(text){
    return window._.string.words(text, '---');
  };
  renderText = function(text){
    var converter, textBoxes, index, txt, ht, results$ = [];
    converter = new Showdown.converter({
      extensions: ['prettify']
    });
    textBoxes = splitAtSeparator(text);
    for (index in textBoxes) {
      txt = textBoxes[index];
      console.log("Rendering " + txt);
      ht = converter.makeHtml(txt);
      results$.push($(ht).appendTo("#text" + index));
    }
    return results$;
  };
  window.renderText = renderText;
}).call(this);
(function(){
  var text;
  text = '\n<img src="/img/512Px-161.png" />\n\n## It just works\n\nNo dependencies (except for the tools you really need).\nNo need to install any `*-contrib-*` package to use it. \nOnly GNU Make is required.\n\n---\n<img src="/img/512Px-161.png" />\n\n## Choose your style\n\nYou can use declarative style for common tasks and fine-tune your makefile with Javascript code by hooking into the build phases. \n\n---\n\n<img src="/img/512Px-161.png" />\n\n## Free yourself\n\nFrom simple websites to medium complexity webapps, leave **web-make** do the bolerplate work for you by following a rational project organization. \n\n---\n\n## Example\n\nThis Coffeescript program creates a **makefile** for building a single page website written in `jade` with some fancy `coffee` script.\n\nThe `root=true` property specifies that `index.html` should be installed as the root of our website. The `serve=true` property is used by the makefile to setup and start a live preview of your site with `serve`.\n\n---\n\n```json\n#!/usr/bin/env coffee\n\n{simpleMake} = require \'wmake\'\n\nmyJavascriptFiles = [\n    { name: "src/myCoffee.coffee", type: "coffee" }\n    ]\n\nmyHTML = [ \n    { name: "./assets/index.jade", type: "jade", root: true, serve: true } \n    ] \n\nsimpleMake(clientJs: myJavascriptFiles, clientHtml: myHTML)\n```';
  window.renderText(text);
}).call(this);
