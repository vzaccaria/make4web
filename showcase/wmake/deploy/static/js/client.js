(function(){
  var rg, renderTextAt, replaceMarkdownLinkAt, splitAtSeparator, convertIndex, renderText, loadTtyRecording;
  rg = /(\[[\t]*read((?:\[[^\]]*\]|[^\[\]])*)\]\([\t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[\t]*((['"])(.*?)\6[\t]*)?\))/;
  renderTextAt = function(url, suffix, cb){
    var this$ = this;
    return $.get(url, function(data){
      renderText(data, suffix);
      if (cb != null) {
        return cb();
      }
    });
  };
  replaceMarkdownLinkAt = function(text, cb){
    var mt, type, link, this$ = this;
    mt = rg.exec(text);
    if (mt != null) {
      type = window._.string.trim(mt[2]);
      link = window._.string.trim(mt[4]);
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
  convertIndex = function(converter, index, txt, suffix){
    return (function(index, txt){
      return replaceMarkdownLinkAt(txt, function(txt, isCode){
        var ht;
        ht = converter.makeHtml(txt);
        $(ht).appendTo("#" + suffix + index);
        return $("table").attr('class', 'table table-bordered');
      });
    }.call(this, index, txt));
  };
  renderText = function(text, suffix){
    var converter, textBoxes, index, txt, results$ = [];
    converter = new Showdown.converter({
      extensions: ['table']
    });
    textBoxes = splitAtSeparator(text);
    for (index in textBoxes) {
      txt = textBoxes[index];
      results$.push(convertIndex(converter, index, txt, suffix));
    }
    return results$;
  };
  loadTtyRecording = function(url, id){
    var this$ = this;
    return $.getJSON(url, function(data){
      playterm_player.data = data;
      return playterm_player.init(id);
    });
  };
  window.renderText = renderText;
  window.loadTtyRecording = loadTtyRecording;
  window.renderTextAt = renderTextAt;
}).call(this);
