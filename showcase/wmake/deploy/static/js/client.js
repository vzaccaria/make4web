(function(){
  var text, converter, ht;
  text = '## README ##\n\nFix the pointers to local directories! ';
  converter = new Showdown.converter();
  ht = converter.makeHtml(text);
  $(ht).appendTo("#text");
}).call(this);
