let http = require('http');
let fs = require('fs');
const CriacaoPerguntas = require('./classes/CriacaoPerguntas');

const PORT = 8000;

function returnFile(url, res) {
  let filePath = '.' + url;
  if(filePath == "./") {
    filePath = "./index.html"
  }

  let extname = filePath.split('.').at(-1);

  fs.readFile(filePath, function(error, content) {
    if(error) {
      res.writeHead(500);
      res.end('Ocorreu um problema ao procurar pelo arquivo, favor entrar em contato com o Bebas')
      return;
    }

    const possibleExtensions = {
      'js': "text/javascript",
      'css': "text/css",
      'json': "application/json",
      'html': "text/html"
    }

    res.writeHead(200, { 'Content-Type': possibleExtensions[extname] });
    res.end(content, 'utf-8');
  });
}

http.createServer((req, res) => {
  if(req.method == "POST" && req.url == "/save") {
    const criacaoPerguntas = new CriacaoPerguntas("perguntas.json", res);
    criacaoPerguntas.createQuestion(req);
  } else {
    returnFile(req.url, res);
  }
  
  
}).listen(PORT);
console.log(`Server running in http://localhost:${PORT}`)