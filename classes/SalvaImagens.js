const fs = require('fs');

module.exports = class SalvaImagens {
    constructor(res) {
        this.res = res;
    }

    process(req) {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk;
        }).on('end', async () => {
            const b64Image = JSON.parse(body)
            this.save(b64Image["imagemB64"]);
        })
    }

    save(imagem) {
        const fileName = "b64_imagem_" + Math.random() * 1000000 + ".b64";
        fs.writeFile("./imagens/" + fileName, imagem, (err) => {
            if(err) {
                this.res.writeHead(500);
                this.res.end('Erro ao tentar salvar imagem ' + fileName);
                return;
            }

            this.res.writeHead(200, {'Content-Type': 'application/json'});
            this.res.end(JSON.stringify({ "imagem": fileName }));
        })
    }
}