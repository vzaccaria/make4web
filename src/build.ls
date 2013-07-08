require! 'request'
require! 'shelljs'

github-hooks-url = (project-name, user-name, user-password) ->'https://'+user-name+':'+user-password+'@api.github.com/repos/'+project-name+'/hooks';


setup-github-hooks = (project-name, user-name, this-server-url, this-server-port) ~>
   payload = 
        name: 'web' 
        +active, 
        events: [ \push ]
        config: 
            url: "http://#this-server-url:#this-server-port"
            content_type: \json}
   err, res, body <~ request.post url: github-hooks-url(), json: payload 
   if err?
        console.log "Failed to setup hooks"
   else
      console.log "OK."
    