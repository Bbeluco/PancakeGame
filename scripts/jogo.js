// const fs = require('fs')

let perguntaAtual = 0;
let jogo_atual;
const shuffle = (arr) => {
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

async function iniciar() {
    perguntaAtual = 0;
    let date = new Date();
    let categorias = document.querySelectorAll("input[id='categoria_disponivel']:checked");
    let quantidade_de_perguntas = document.getElementById("quantidade_de_perguntas").value;
    let nome_usuario = document.getElementById("nome_usuario").value;

    jogo_atual = {
        data: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        nome_usuario,
        pontuacao: 0,
        quantidade_perguntas_acertadas: 0
    };

    if(nome_usuario.length < 3) {
        alert("Favor digitar um nome de usuario com no minimo 3 caracteres");
        return;
    }

    if(categorias.length == 0) {
        alert("Por favor, selecione no minimo uma categoria");
        return;
    }
    
    let opcoes_embaralhadas = shuffle(await buscar_perguntas(categorias));
    opcoes_embaralhadas = opcoes_embaralhadas.slice(0, quantidade_de_perguntas);
    carregar_pergunta(opcoes_embaralhadas, quantidade_de_perguntas);
    document.getElementById("btn_iniciar_jogo").disabled = true;
}

async function buscar_perguntas(categorias) {
    return fetch("http://localhost:8000/perguntas.json").then(data => {
        return data.json();
    }).then(perguntas => {
        let opcoes_possiveis = []
        categorias.forEach(el => {
            opcoes_possiveis.push(...perguntas[el.label]);
        });

        return opcoes_possiveis;
    })
}

async function carregar_pergunta(opcoes_embaralhadas, quantidade_de_perguntas) {
    let jogo = document.getElementById("jogo");
    if(document.getElementById("questao_atual")) {
        jogo.removeChild(document.getElementById("questao_atual"))
    }

    let questao_atual = document.createElement("div");
    questao_atual.id = "questao_atual";

    let titulo_questao = document.createElement("h3");

    let pergunta_atual = opcoes_embaralhadas[perguntaAtual];
    titulo_questao.textContent = pergunta_atual["questao"];

    questao_atual.appendChild(titulo_questao);

    if(pergunta_atual["imagem"] != "") {
        const b64Image = await getImageContent(pergunta_atual["imagem"]);
        let imagem_pergunta = document.createElement("img");
        
        imagem_pergunta.src = b64Image;
        imagem_pergunta.style.maxWidth = "90%"
        imagem_pergunta.style.maxHeight = "200px"
        imagem_pergunta.onclick ="window.open(this.src)"
        questao_atual.appendChild(imagem_pergunta);
        questao_atual.appendChild(document.createElement("br"));
    }
    
    
    if(pergunta_atual["alternativas"].length > 0) {
        let possiveis_respostas = document.createElement('div');
        possiveis_respostas.className = "possiveis_respostas"
        pergunta_atual["alternativas"].forEach(alt => {
            criar_resposta_multi(titulo_questao, alt, possiveis_respostas)
        })
        questao_atual.appendChild(possiveis_respostas)
    } else {
        criar_resposta_texto(titulo_questao, questao_atual)
    }

    criar_btn_responder(questao_atual, opcoes_embaralhadas, quantidade_de_perguntas)

    jogo.appendChild(questao_atual)
}

async function getImageContent(imageFileName) {
    return await fetch("http://localhost:8000/imagens/" + imageFileName).then(data => {
        return data.text();
    })
}

function criar_resposta_multi(titulo_questao, alternativa, questao_atual) {
    let resposta = document.createElement("div");
    resposta.className = "opcao";
    let input_resposta = document.createElement("input");
    input_resposta.name = titulo_questao.textContent.substring(0, 10).replace(" ", "_");
    input_resposta.type = "radio";
    input_resposta.id = alternativa.replace(" ", "_");
    input_resposta.required = true;

    let label_resposta = document.createElement("label");
    label_resposta.id = input_resposta.id;
    label_resposta.textContent = alternativa;
    resposta.appendChild(input_resposta);
    resposta.appendChild(label_resposta);

    questao_atual.appendChild(resposta);
}

function criar_resposta_texto(titulo_questao, questao_atual) {
    let input_resposta = document.createElement("input");
    input_resposta.name = titulo_questao.textContent.substring(0, 10).replace(" ", "_");
    input_resposta.type = "text";
    input_resposta.required = true;

    let label_resposta = document.createElement("label");
    label_resposta.for = input_resposta.name
    label_resposta.textContent = "Resposta: "

    let p_resposta_correta = document.createElement("p");
    p_resposta_correta.style.color = "#ffbf00";
    p_resposta_correta.id = "resposta_correta"
    p_resposta_correta.style.fontWeight = "bold"

    questao_atual.appendChild(label_resposta);
    questao_atual.appendChild(input_resposta);
    questao_atual.appendChild(p_resposta_correta);
}

function criar_btn_responder(questao_atual, opcoes_embaralhadas, quantidade_de_perguntas) {
    let btn_responder = document.createElement("button");
    btn_responder.id = "responder"
    btn_responder.className = "responder"
    btn_responder.textContent = "Responder";
    btn_responder.addEventListener("click", function(){
        proxima_pergunta(opcoes_embaralhadas, quantidade_de_perguntas, questao_atual)
    })

    questao_atual.appendChild(btn_responder);
}

function proxima_pergunta(opcoes_embaralhadas, quantidade_de_perguntas, questao_atual) {
    let resposta_dada = conferir_pergunta_respondida();
    if(!resposta_dada) {
        return;
    }
    let pergunta_atual = opcoes_embaralhadas[perguntaAtual];
    let resposta_correta = pergunta_atual['resposta'];
    if(resposta_dada.toLowerCase() == resposta_correta.toLowerCase()) {
        atualizar_status_jogo_atual(pergunta_atual['dificuldade']);
    } else {
        mostrar_resposta_correta(pergunta_atual, resposta_correta);
        
        criar_botao_continuar(opcoes_embaralhadas, quantidade_de_perguntas, questao_atual);
        return;
    }

    perguntaAtual += 1;
    if(!deve_finalizar_jogo(opcoes_embaralhadas)) {
        carregar_pergunta(opcoes_embaralhadas, quantidade_de_perguntas);
    }
}

function mostrar_resposta_correta(pergunta_atual, resposta_correta) {
    if(pergunta_atual['alternativas'].length == 0) {
        let p_resposta_correta = document.getElementById("resposta_correta");
        p_resposta_correta.textContent = resposta_correta;
    } else {
        let id_resposta_correta = document.querySelectorAll('input[type="radio"]')[Number(resposta_correta) - 1].id
        document.querySelector(`label[id='${id_resposta_correta}']`).style.color = 'red';
    }
}

function criar_botao_continuar(opcoes_embaralhadas, quantidade_de_perguntas, questao_atual) {
    document.getElementById("questao_atual").removeChild(document.getElementById("responder"));

    let btn_continuar = document.createElement("button");
    btn_continuar.textContent = "Continuar";
    btn_continuar.addEventListener("click", function(){
        perguntaAtual += 1;
        if(!deve_finalizar_jogo(opcoes_embaralhadas)) {
            carregar_pergunta(opcoes_embaralhadas, quantidade_de_perguntas);
        }
    })

    questao_atual.appendChild(btn_continuar)
}

function deve_finalizar_jogo(opcoes_disponiveis) {
    let acabaram_perguntas = perguntaAtual >= Number(quantidade_de_perguntas) || perguntaAtual >= opcoes_disponiveis.length
    if(acabaram_perguntas) {
        let pergunta_atual = document.getElementById('questao_atual');
        document.getElementById('jogo').removeChild(pergunta_atual);
        salvar_jogo_usuario();
        alert("Fim de jogo");
        document.getElementById("btn_iniciar_jogo").disabled = false;
        
        return true;
    }

    return false;
}

function salvar_jogo_usuario() {
    if(jogo_atual['pontuacao'] == 0) {
        return;
    }

    const options = {
        method: "POST",
        "Content-Type": "application/json",
        "body": JSON.stringify(jogo_atual)
    }

    fetch("http://localhost:8000/podium", options);
}

function atualizar_status_jogo_atual(dificuldade) {
    let pontuacao;
    switch(dificuldade) {
        case 'facil':
            pontuacao = 100;
            break;
        case 'medio':
            pontuacao = 200;
            break;
        case 'dificil':
            pontuacao = 300;
            break;
    }

    jogo_atual['pontuacao'] += pontuacao;
    jogo_atual['quantidade_perguntas_acertadas'] += 1;
}

function conferir_pergunta_respondida() {
    let is_pergunta_respondida = "";
    let respostas_disponiveis = document.querySelectorAll("[required]");
    for (let i = 0; i < respostas_disponiveis.length; i++) {
        const campo_resposta = respostas_disponiveis[i];
        is_pergunta_respondida = campo_resposta.type == "radio" 
        ? campo_resposta.checked 
        : campo_resposta.value != "";

        if(is_pergunta_respondida) {
            if(campo_resposta.type == "radio") {
                return i + 1 + "";
            } else {
                return campo_resposta.value
            }
        }
    }
    return is_pergunta_respondida;
}