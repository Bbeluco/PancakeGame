let perguntaAtual = 0;
let jogo_atual;
const shuffle = (arr) => {
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function iniciar() {
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
    
    let opcoes_embaralhadas = shuffle(buscar_perguntas(categorias));
    opcoes_embaralhadas = opcoes_embaralhadas.slice(0, quantidade_de_perguntas);
    carregar_pergunta(opcoes_embaralhadas, quantidade_de_perguntas);
    document.getElementById("btn_iniciar_jogo").disabled = true;
}

function buscar_perguntas(categorias) {
    let perguntas_disponiveis = JSON.parse(localStorage.getItem("perguntas"))
    let opcoes_possiveis = []
    categorias.forEach(el => {
        opcoes_possiveis = [...opcoes_possiveis, ...perguntas_disponiveis[el.label]]
    });

    return opcoes_possiveis;
}

function carregar_pergunta(opcoes_embaralhadas, quantidade_de_perguntas) {
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
    
    
    if(pergunta_atual["alternativas"].length > 0) {
        pergunta_atual["alternativas"].forEach(alt => {
            criar_resposta_multi(titulo_questao, alt, questao_atual)
        })
    } else {
        criar_resposta_texto(titulo_questao, questao_atual)
    }

    criar_btn_proxima_questao(questao_atual, opcoes_embaralhadas, quantidade_de_perguntas)

    jogo.appendChild(questao_atual)
}

function criar_resposta_multi(titulo_questao, alternativa, questao_atual) {
    let input_resposta = document.createElement("input");
    input_resposta.name = titulo_questao.textContent.substring(0, 10).replace(" ", "_");
    input_resposta.type = "radio";
    input_resposta.id = alternativa.replace(" ", "_");
    input_resposta.required = true;

    let label_resposta = document.createElement("label");
    label_resposta.for = input_resposta.name
    label_resposta.textContent = alternativa;
    questao_atual.appendChild(input_resposta);
    questao_atual.appendChild(label_resposta);
}

function criar_resposta_texto(titulo_questao, questao_atual) {
    let input_resposta = document.createElement("input");
    input_resposta.name = titulo_questao.textContent.substring(0, 10).replace(" ", "_");
    input_resposta.type = "text";
    input_resposta.required = true;

    let label_resposta = document.createElement("label");
    label_resposta.for = input_resposta.name
    label_resposta.textContent = "Resposta: "

    questao_atual.appendChild(label_resposta);
    questao_atual.appendChild(input_resposta);
}

function criar_btn_proxima_questao(questao_atual, opcoes_embaralhadas, quantidade_de_perguntas) {
    let botao_proxima_questao = document.createElement("button");
    botao_proxima_questao.textContent = "Proxima questao";
    botao_proxima_questao.addEventListener("click", function(){
        proxima_pergunta(opcoes_embaralhadas, quantidade_de_perguntas)
    })

    questao_atual.appendChild(document.createElement("br"))
    questao_atual.appendChild(botao_proxima_questao);
}

function proxima_pergunta(opcoes_embaralhadas, quantidade_de_perguntas) {
    let resposta_dada = conferir_pergunta_respondida();
    if(!resposta_dada) {
        return;
    }

    let resposta_correta = opcoes_embaralhadas[perguntaAtual]['resposta'];
    if(resposta_dada.toLowerCase() == resposta_correta.toLowerCase()) {
        atualizar_status_jogo_atual(opcoes_embaralhadas[perguntaAtual]['dificuldade']);
    }

    perguntaAtual += 1;
    if(!deve_finalizar_jogo(opcoes_embaralhadas)) {
        carregar_pergunta(opcoes_embaralhadas, quantidade_de_perguntas);
    }
}

function deve_finalizar_jogo(opcoes_disponiveis) {
    let acabaram_perguntas = perguntaAtual >= Number(quantidade_de_perguntas) || perguntaAtual >= opcoes_disponiveis.length
    if(acabaram_perguntas) {
        let pergunta_atual = document.getElementById('questao_atual');
        document.getElementById('jogo').removeChild(pergunta_atual);
        salvar_jogo_usuario()
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
    
    let podio_atual = JSON.parse(localStorage.getItem("podio"))
    if(podio_atual == null) {
        localStorage.setItem("podio", JSON.stringify([ jogo_atual ]))
        return;
    }

    if(podio_atual.length < 10) {
        localStorage.setItem("podio", JSON.stringify([ ...podio_atual, jogo_atual ]))
        return;
    }

    let menor_pontuacao = 0;
    for (let i = 1; i < array.length; i++) {
        if(podio_atual[menor_pontuacao]['pontuacao'] > podio_atual[i]['pontuacao']) {
            menor_pontuacao = i;
        }
    }

    if(jogo_atual['pontuacao'] > podio_atual[menor_pontuacao]['pontuacao']) {
        podio_atual[menor_pontuacao] = jogo_atual;
        localStorage.setItem("podio", JSON.stringify([ ...podio_atual ]))
    }
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