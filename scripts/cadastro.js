function createAlternative() {
    let alternativasDisponiveis = document.getElementById("respostas");

    let divAlternativa = document.createElement("div");
    divAlternativa.id = "div_alternativa";
    
    let labelAlternativa = document.createElement("label");
    labelAlternativa.textContent = `Alternativa ${alternativasDisponiveis.children.length + 1}: `;

    let inputAlternativa = document.createElement("input");
    inputAlternativa.type = "text";

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
    document.getElementById("respostas").appendChild(createAlternative())
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

    tipoRespostaMulti.ariaChecked = true;
    tipoRespostaMulti.addEventListener("change", () => {
        document.getElementById("respostas").innerHTML = "";
        document.getElementById("respostas").appendChild(createAlternative())
    })

    tipoRespostaTexto.addEventListener("change", () => {
        document.getElementById("respostas").innerHTML = `<div><label>Resposta correta: </label><input type="text"></div>`
    })
})