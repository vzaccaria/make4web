

split-at-separator = (text) ->
    window._.string.words(text, '---')
    
render-text = (text) ->
    converter   = new Showdown.converter(extensions: ['prettify'])
    text-boxes  = split-at-separator(text)
    for index, txt of text-boxes
        console.log "Rendering #txt"
        ht = converter.makeHtml(txt)
        $(ht).appendTo("\#text#{index}") 
    
window.render-text = render-text