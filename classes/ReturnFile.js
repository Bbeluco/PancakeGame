const fs = require('fs')

const possibleExtensions = {
    'js': "text/javascript",
    'css': "text/css",
    'json': "application/json",
    'html': "text/html",
    "b64": "text/html"
}

function validateFilePath(url) {
    let filePath = '.' + url;
    if(filePath == "./") {
        filePath = "./index.html"
    }

    return filePath;
}

module.exports = class ReturnFile {
    constructor(res) {
        this.res = res;
    }

    returnFile(url) {
        let filePath = validateFilePath(url);
      
        let extname = filePath.split('.').at(-1);
        fs.readFile(filePath, (error, content) => this.retrieveFile(error, content, extname));
      }

      retrieveFile(error, content, extname) {
        if(error) {
            this.res.writeHead(500);
            this.res.end('Ocorreu um problema ao procurar pelo arquivo, favor entrar em contato com o Bebas')
            return;
        }
        
        this.res.writeHead(200, { 'Content-Type': possibleExtensions[extname] });
        this.res.end(content, 'utf-8');
      }
}