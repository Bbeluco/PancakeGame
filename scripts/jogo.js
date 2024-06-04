let perguntaAtual = 0;

const shuffle = (arr) => {
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function iniciar() {
    let categorias = document.querySelectorAll("input[id='categoria_disponivel']:checked");
    let quantidade_de_perguntas = document.getElementById("quantidade_de_perguntas").value;
    if(categorias.length == 0) {
        alert("Por favor, selecione no minimo uma categoria");
        return;
    }
    
    // let perguntas_disponiveis = JSON.parse(localStorage.getItem("perguntas"))
    // let opcoes_possiveis = []
    // categorias.forEach(el => {
    //     opcoes_possiveis = [...opcoes_possiveis, ...perguntas_disponiveis[el.label]]
    // });



    let opcoes_embaralhadas = shuffle(buscar_perguntas(categorias));
    opcoes_embaralhadas = opcoes_embaralhadas.slice(0, quantidade_de_perguntas)
    carregar_pergunta(opcoes_embaralhadas);
}

function buscar_perguntas(categorias) {
    let perguntas_disponiveis = JSON.parse(localStorage.getItem("perguntas"))
    let opcoes_possiveis = []
    categorias.forEach(el => {
        opcoes_possiveis = [...opcoes_possiveis, ...perguntas_disponiveis[el.label]]
    });

    return opcoes_possiveis;
}

function carregar_pergunta(opcoes_embaralhadas) {
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

    criar_btn_proxima_questao(questao_atual, opcoes_embaralhadas)

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

function criar_btn_proxima_questao(questao_atual, opcoes_embaralhadas) {
    let botao_proxima_questao = document.createElement("button");
    botao_proxima_questao.textContent = "Proxima questao";
    botao_proxima_questao.addEventListener("click", function(){
        proxima_pergunta(opcoes_embaralhadas)
    })

    questao_atual.appendChild(document.createElement("br"))
    questao_atual.appendChild(botao_proxima_questao);
}

function proxima_pergunta(opcoes_embaralhadas) {
    perguntaAtual += 1;
    carregar_pergunta(opcoes_embaralhadas);
}