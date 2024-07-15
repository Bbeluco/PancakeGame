const fs = require('fs');


function findLowerPointsPosition(podioAtual) {
    let menorPontuacao = 0;
    for (let i = 1; i < podioAtual.length; i++) {
        if(podioAtual[menorPontuacao]['pontuacao'] > podioAtual[i]['pontuacao']) {
            menorPontuacao = i;
        }
    }

    return menorPontuacao;
}

module.exports = class Podium {
    constructor(fileName, res) {
        this.fileName = fileName;
        this.res = res;
    }

    updatePodium(req) {
        let body = "";
        req.on('data', (chunk) => {
          body += chunk;
        }).on('end', () => {
            fs.readFile("./" + this.fileName, (error, content) => {
                if(error) {
                    this.res.writeHead(500);
                    this.res.end("Erro ao tentar abrir o arquivo de podio");
                    return;
                }
    
                let podioAtual = JSON.parse(content);
                if(podioAtual.length < 10) {
                    podioAtual.push(body);
                    this.saveNewInfoInPodium(podioAtual)
                    this.res.writeHead(200);
                    this.res.end("OK");
                    return;
                }
    
                let menorPontuacao = findLowerPointsPosition(podioAtual)
    
                if(body["pontuacao"] > podioAtual[menorPontuacao]['pontuacao']) {
                    podioAtual[menorPontuacao] = body;
                    this.saveNewInfoInPodium(podioAtual, body)
                }
    
                this.res.writeHead(200);
                this.res.end("OK");
            })
        })
    }

    resetPodium() {
        this.saveNewInfoInPodium([]);
        this.res.writeHead(200);
        this.res.end("OK");
    }

    saveNewInfoInPodium(podio) {
        fs.writeFile("./" + this.fileName, JSON.stringify(podio), (error) => {
            if(error) {
                this.res.writeHead(500);
                this.res.end("Erro ao salvar novo dado no podio");
                return;
            }
        })
    }
}