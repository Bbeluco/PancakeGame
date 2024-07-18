function createAlternative() {
    let alternativasDisponiveis = document.getElementById("alternativas");

    let divAlternativa = document.createElement("div");
    divAlternativa.id = "div_alternativa";
    
    let labelAlternativa = document.createElement("label");
    labelAlternativa.textContent = `Alternativa ${alternativasDisponiveis.children.length + 1}: `;

    let inputAlternativa = document.createElement("input");
    inputAlternativa.type = "text";
    inputAlternativa.id = "texto_alternativa"

    divAlternativa.appendChild(labelAlternativa);
    divAlternativa.appendChild(inputAlternativa);
    divAlternativa.appendChild(createAddAlternativeButton());

    if(alternativasDisponiveis.children.length > 0) {
        divAlternativa.appendChild(createRemoveAlternativeButton());
    }

    return divAlternativa;
}

function createAddAlternativeButton() {
    let btnAddAlternativa = document.createElement("button");
    btnAddAlternativa.textContent = "+";
    btnAddAlternativa.onclick = addMoreAlternatives;
    btnAddAlternativa.id = "btn_add_alternativa"

    return btnAddAlternativa;
}

function createRemoveAlternativeButton() {
    let btnRemoverAlternativa = document.createElement("button");
    btnRemoverAlternativa.textContent = "-";
    btnRemoverAlternativa.onclick = removeAlternative;
    btnRemoverAlternativa.id = "btn_remove_alternativa"

    return btnRemoverAlternativa;
}

function addMoreAlternatives() {
    let alternativasDisponiveis = document.querySelectorAll("div[id='div_alternativa']");
    let ultimaAlternativaDisponivel = alternativasDisponiveis[alternativasDisponiveis.length - 1];
    let btnAddAlternativa = ultimaAlternativaDisponivel.querySelector("button[id='btn_add_alternativa']");
    ultimaAlternativaDisponivel.removeChild(btnAddAlternativa);

    if(alternativasDisponiveis.length > 1) {
        let btnRemoveAlternativa = ultimaAlternativaDisponivel.querySelector("button[id='btn_remove_alternativa']");
        ultimaAlternativaDisponivel.removeChild(btnRemoveAlternativa);
    }
    document.getElementById("alternativas").appendChild(createAlternative())
}

function removeAlternative() {
    let alternativasCriadas = document.querySelectorAll('div[id="div_alternativa"]');
    alternativasCriadas[alternativasCriadas.length - 1].remove();
    let novasAlternativas = document.querySelectorAll('div[id="div_alternativa"]');

    novasAlternativas[novasAlternativas.length - 1].appendChild(createAddAlternativeButton())

    if(novasAlternativas.length > 1) {
        novasAlternativas[novasAlternativas.length - 1].appendChild(createRemoveAlternativeButton());
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let tipoRespostaMulti = document.getElementById("tipoMultipla")
    let tipoRespostaTexto = document.getElementById("tipoTexto")
    let respostas = document.getElementById("respostas");

    tipoRespostaMulti.addEventListener("change", () => {
        let alternativas = document.getElementById("alternativas");

        alternativas.innerHTML = "";
        alternativas.appendChild(createAlternative())
        alternativas.appendChild(divRespostaCorreta)
    })

    tipoRespostaTexto.addEventListener("change", () => {
        document.getElementById("alternativas").innerHTML = "";
    })

    respostas.appendChild(createInputRespostaCorreta());
})

function createInputRespostaCorreta() {
    let divRespostaCorreta = document.createElement("div");
    let labelRespostaCorreta = document.createElement("label");
    labelRespostaCorreta.textContent = "Resposta correta: ";
    let inputRespostaCorreta = document.createElement("input");
    inputRespostaCorreta.type = "text";
    inputRespostaCorreta.id = "resposta_correta";

    divRespostaCorreta.appendChild(labelRespostaCorreta);
    divRespostaCorreta.appendChild(inputRespostaCorreta);

    return divRespostaCorreta;
}

async function appendQuestionToList() {
    let categoriaQuestao = document.getElementById("categoria").value.toLowerCase();
    let textoQuestao = document.getElementById("pergunta").value;
    let respostaQuestao = document.getElementById("resposta_correta").value;
    let nivelQuestao = document.getElementById("nivel_dificuldade").value;
    let alternativasQuestao = document.querySelectorAll("input[id='texto_alternativa']");
    let fileImagemQuestao = document.getElementById("img").files[0];

    let mensagemDeErro = validacaoDePreenchimento(categoriaQuestao, textoQuestao, respostaQuestao, alternativasQuestao);

    if(mensagemDeErro) {
        alert(mensagemDeErro);
        return;
    }

    const imagem = await getImageContentPath(fileImagemQuestao)
    const nova_pergunta = {
        "categoria": categoriaQuestao,
        "questao": textoQuestao,
        "imagem": imagem,
        "alternativas": getTextFromAllAlternatives(alternativasQuestao),
        "resposta": respostaQuestao,
        "dificuldade": nivelQuestao
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nova_pergunta)
    }

    fetch("http://localhost:8000/save", options).then(() => {
        resetTodosCampos();
    }).catch(err => {
        alert("Erro ao cadastrar pergunta, consulte os logs para saber mais");
        console.error(err);
    })
}

function validacaoDePreenchimento(categoriaQuestao, textoQuestao, respostaQuestao, alternativasQuestao) {
    let mensagemDeErro = "";
    
    for (let i = 0; i < alternativasQuestao.length; i++) {
        if(!alternativasQuestao[i].value) {
            mensagemDeErro += "Ha alternativas vazias, por favor verifique as alternativas cadastradas\n"
            break;
        }
    }

    if(!categoriaQuestao) {
        mensagemDeErro += "A categoria da questao nao esta preenchida, favor verificar\n"
    }

    if(!textoQuestao) {
        mensagemDeErro += "A pergunta nao esta preenchida, favor verificar\n"
    }

    if(!respostaQuestao) {
        mensagemDeErro += "A resposta nao esta preenchida, favor verificar\n"
    }

    return mensagemDeErro;
}

function getTextFromAllAlternatives(alternativesAvailable) {
    let alternativesText = []
    for (let i = 0; i < alternativesAvailable.length; i++) {
        alternativesText.push(alternativesAvailable[i].value);
    }

    return alternativesText;
}

async function getImageContentPath(fileImagemQuestao) {
    if(fileImagemQuestao == undefined) {
        return "";
    }

    const b64Image = await toBase64(fileImagemQuestao);

    const options = {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify({ "imagemB64": b64Image })
    }

    return fetch("http://localhost:8000/saveImage", options).then(data => {
        return data.json()
    }).then(infoPath => {
        return infoPath["imagem"]
    })
}

function resetTodosCampos() {
    document.getElementById("categoria").value = ""
    document.getElementById("pergunta").value = "";
    document.getElementById("resposta_correta").value = "";
    document.getElementById("nivel_dificuldade").value = "";
    document.getElementById("img").value = "";
    document.getElementById("tipoTexto").click()
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});