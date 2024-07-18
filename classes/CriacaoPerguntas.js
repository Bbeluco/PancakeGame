const fs = require('fs');

//Private methods (this is priv bc the js do not exports this XD)
function prepareQuestionStructure(perguntasAtuais, novaPergunta) {
    if(!perguntasAtuais[novaPergunta["categoria"]]) {
        perguntasAtuais[novaPergunta["categoria"]] = [];
    }
    
    perguntasAtuais[novaPergunta["categoria"]].push({ 
        "questao": novaPergunta["questao"],
        "imagem": novaPergunta["imagem"],
        "alternativas": novaPergunta["alternativas"],
        "resposta": novaPergunta["resposta"],
        "dificuldade": novaPergunta["dificuldade"]
    })
    
    return perguntasAtuais;
}

module.exports = class CriacaoPerguntas {
    fileName;
    res;
    constructor(fileName, res) {
        this.fileName = fileName;
        this.res = res;
    }

    createQuestion(req) {
      let body = "";
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', () => {
        body = JSON.parse(body);
        fs.readFile("./" + this.fileName, (error, content) => {
          if(error) {
            this.res.writeHead(500);
            this.res.end('Erro ao tentar ler o arquivo ' + fileName)
            return;
          }
          let perguntas = JSON.parse(content);
          perguntas = prepareQuestionStructure(perguntas, body);
          this.saveQuestion(perguntas)
        })
    
        this.res.writeHead(200);
        this.res.end();
      });
    }
    
    saveQuestion(perguntas) {
        fs.writeFile("./" + this.fileName, JSON.stringify(perguntas), err => {
            if(err) {
                this.res.writeHead(500);
                this.res.end('Erro ao escrever no arquivo ' + this.fileName);
                return;
            }
        })
    }
}
