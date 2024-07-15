let http = require('http');
let fs = require('fs');
const { connect } = require('http2');

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

function createQuestion(req, res) {
  let body = "";
  req.on('data', (chunk) => {
    body += chunk;
  }).on('end', () => {
    body = JSON.parse(body);
    let fileName = "perguntas.json"
    fs.readFile("./" + fileName, (error, content) => {
      if(error) {
        res.writeHead(500);
        res.end('Erro ao tentar ler o arquivo ' + fileName)
        return;
      }

      let perguntasAtuais = JSON.parse(content);
      if(!perguntasAtuais[body["categoria"]]) {
        perguntasAtuais[body["categoria"]] = [];
      }

      perguntasAtuais[body["categoria"]].push({ 
        "questao": body["questao"],
        "alternativas": body["alternativas"],
        "resposta": body["resposta"],
        "dificuldade": body["dificuldade"]
      })
      
      fs.writeFile("./" + fileName, JSON.stringify(perguntasAtuais), err => {
        if(err) {
          res.writeHead(500);
          res.end('Erro ao escrever no arquivo ' + fileName);
          return;
        }
      })
    })

  });

  
  res.writeHead(200);
  res.end();
}

http.createServer((req, res) => {
  if(req.method == "POST" && req.url == "/save") {
    createQuestion(req, res);
  } else {
    returnFile(req.url, res);
  }
  
  
}).listen(PORT);
console.log(`Server running in http://localhost:${PORT}`)