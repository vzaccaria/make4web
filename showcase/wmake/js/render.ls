
rg =    //
        (                           # wrap whole match in $1
            \[
                [ \t]*
                read
            (
                (?:
                    \[[^\]]*\]      # allow brackets nested one level
                    |
                    [^\[\]]         # or anything else
                )*
            )
            \]
            \(                      # literal paren
            [ \t]*
            ()                      # no id, so leave $3 empty
            <?(                     # href = $4
                (?:
                    \([^)]*\)       # allow one level of (correctly nested) parens (think MSDN)
                    |
                    [^()\s]
                )*?
            )>?                
            [ \t]*
            (                       # $5
                (['"])              # quote char = $6
                (.*?)               # Title = $7
                \6                  # matching quote
                [ \t]*              # ignore any spaces/tabs between closing quote and )
            )?                      # title is optional
            \)
        )
        //

render-text-at = (url, cb) ->
    data <~ $.get(url)
    render-text(data)
    if cb? then cb()

replace-markdown-link-at = (text, cb) ->
    mt = rg.exec(text)
    if mt?
        # console.log JSON.stringify(mt, null, 4)
        type = window._.string.trim(mt[2])
        link = window._.string.trim(mt[4])
        # console.log "`#type`"
        data <~ $.get(link)
        new-text = """
        ```#{type}
        #{data}
        ```
        """
        to-be-replaced = text.replace(rg, new-text) 
        cb(to-be-replaced, true)
    else 
        cb(text, false)


split-at-separator = (text) ->
    window._.string.words(text, '---')

check-this-index = (converter, index, txt) -> 
    # console.log txt
    let index,txt 
        replace-markdown-link-at txt, (txt, is-code) ->
            ht = converter.makeHtml(txt)
            # console.log  "\#text#{index}"
            $(ht).appendTo("\#text#{index}") 
            if is-code
                $("\#text#{index}").each( (i, e) ->
                 hljs.highlightBlock(e, '    '))
   
render-text = (text) ->
    converter   = new Showdown.converter()
    text-boxes  = split-at-separator(text)
    for index, txt of text-boxes
        check-this-index(converter, index, txt)

load-tty-recording = (url, id) ->
    data <~ $.get(url)
    playterm_player.data = data 
    playterm_player.init id 
    
window.render-text = render-text
window.load-tty-recording = load-tty-recording
window.render-text-at = render-text-at