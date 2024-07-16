let http = require('http');
const CriacaoPerguntas = require('./classes/CriacaoPerguntas');
const Podium = require('./classes/Podium');
const ReturnFile = require('./classes/ReturnFile');
const SalvaImagens = require('./classes/SalvaImagens');

const PORT = 8000;

function saveQuestionMiddleware(req, res) {
  if(req.method != "POST") {
    return;
  }
  const criacaoPerguntas = new CriacaoPerguntas("perguntas.json", res);
  criacaoPerguntas.createQuestion(req);
}

function saveImagemMiddleware(req, res) {
  if(req.method != "POST") {
    return;
  }
  
  const salvaImagem = new SalvaImagens(res);
  salvaImagem.process(req);
}

function podiumMiddleware(req, res) {
  const podium = new Podium("placar.json", res);
  if(req.method == "DELETE") {
    podium.resetPodium(req)
  } else if(req.method == "POST") {
    podium.updatePodium(req)
  }
}

function returnFileMiddleware(req, res) {
  const returnFiles = new ReturnFile(res);
  returnFiles.returnFile(req.url)
}

http.createServer((req, res) => {
  switch(req.url) {
    case "/save":
      saveQuestionMiddleware(req, res);
      break;
    case "/saveImage":
      saveImagemMiddleware(req, res);
      break;
    case "/podium":
      podiumMiddleware(req, res)
      break;
    default:
      returnFileMiddleware(req, res)
  }
}).listen(PORT);
console.log(`Server running in http://localhost:${PORT}`)