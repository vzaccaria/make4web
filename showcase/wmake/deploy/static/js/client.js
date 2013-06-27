(function(){
  var rg, replaceMarkdownLinkAt, splitAtSeparator, checkThisIndex, renderText;
  rg = /(\[[\t]*read((?:\[[^\]]*\]|[^\[\]])*)\]\([\t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[\t]*((['"])(.*?)\6[\t]*)?\))/;
  replaceMarkdownLinkAt = function(text, cb){
    var mt, type, link, this$ = this;
    mt = rg.exec(text);
    if (mt != null) {
      console.log(JSON.stringify(mt, null, 4));
      type = window._.string.trim(mt[2]);
      link = window._.string.trim(mt[4]);
      console.log("`" + type + "`");
      return $.get(link, function(data){
        var newText, toBeReplaced;
        newText = "```" + type + "\n" + data + "\n```";
        toBeReplaced = text.replace(rg, newText);
        return cb(toBeReplaced, true);
      });
    } else {
      return cb(text, false);
    }
  };
  splitAtSeparator = function(text){
    return window._.string.words(text, '---');
  };
  checkThisIndex = function(converter, index, txt){
    return (function(index, txt){
      return replaceMarkdownLinkAt(txt, function(txt, isCode){
        var ht;
        ht = converter.makeHtml(txt);
        console.log("#text" + index);
        $(ht).appendTo("#text" + index);
        if (isCode) {
          return $("#text" + index).each(function(i, e){
            return hljs.highlightBlock(e, '    ');
          });
        }
      });
    }.call(this, index, txt));
  };
  renderText = function(text){
    var converter, textBoxes, index, txt, results$ = [];
    converter = new Showdown.converter();
    textBoxes = splitAtSeparator(text);
    for (index in textBoxes) {
      txt = textBoxes[index];
      results$.push(checkThisIndex(converter, index, txt));
    }
    return results$;
  };
  window.renderText = renderText;
}).call(this);
(function(){
  var text;
  text = '\n<img src="/img/512Px-161.png" />\n\n## It just works\n\nNo dependencies (except for the tools you really need).\nNo need to install any `*-contrib-*` package to use it. \nOnly GNU Make is required.\n\n---\n<img src="/img/512Px-263.png" />\n\n## Choose your style\n\nYou can use declarative style for common tasks and fine-tune your makefile with Javascript code by hooking into the build phases. \n\n---\n\n<img src="/img/512Px-478.png" />\n\n## Free yourself\n\nFrom simple websites to medium complexity webapps, leave **web-make** do the boilerplate work for you by following a rational project organization. \n\n---\n\n## Example\n\nThis Coffeescript program creates a **makefile** for building a single page website written in `jade` with some fancy `coffee` script.\n\nThe `root=true` property specifies that `index.html` should be installed as the root of our website. The `serve=true` property is used by the makefile to setup and start a live preview of your site with `serve`.\n\nThe makefile is printed on standard output.\n\n---\n[read coffeescript](/examples/simple/simple.cs)\n---\n[read makefile](/examples/simple/makefile)\n---\n\n## Installation\n\nYou can either download the project from GitHub or use npm:\n\n```bash\nnpm install wmake\n```\n\n---\n\n## Adding features\n\nIf you need any features that are not in the current version such as:\n\n* Support for new file formats\n* Support for new asset pipeline stages (e.g., minify, compress, zip)\n\njust drop me a message or send me a pull request and I will release a new version of the tool within 1 or 2 days.\n\n\n---';
  window.renderText(text);
}).call(this);
