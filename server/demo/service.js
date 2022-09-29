const http = require('http')
const fs = require('fs')
const server = http.createServer((req,res)=>{
    res.setHeader('Content-Type','text/html;charset=utf-8')
    if(req.url === '/'){
        res.write(`
            <html>
                <body><h1>简简单单</h1>
                    <form action="/message" method="POST">
                        <input type="text" name="message"/>
                        <button type="submit">提交</button>
                    </form>
                </body>
            </html>
        `)
        return res.end()
    }
    if(req.url === '/message' && req.method === 'POST'){
        const body = []
        req.on('data',(chunk)=>{
            body.push(chunk)
        })
        req.on('end',()=>{
            const parseBody = Buffer.concat(body).toString()
            let message = parseBody.split('=')[1]
            fs.writeFile('./index.txt',message,(data)=>{})
        })
        res.statusCode = 302
        res.setHeader('location','/')
        return res.end()
    }
    return res.end()
})
server.listen(3000);