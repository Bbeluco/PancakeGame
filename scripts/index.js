document.addEventListener("DOMContentLoaded", () => {
    let div_escolha_categorias = document.getElementById("escolha_categorias");

    let perguntas = JSON.parse(localStorage.getItem("perguntas"));
    let arrPerguntas = Object.keys(perguntas);
    
    arrPerguntas.forEach(element => {
        
        let inputOpt = document.createElement("input");
        inputOpt.type = "checkbox";
        inputOpt.id = element;
        inputOpt.label = element;

        let labelOpt = document.createElement("label");
        labelOpt.htmlFor = element
        labelOpt.textContent = element;

        div_escolha_categorias.appendChild(inputOpt);
        div_escolha_categorias.appendChild(labelOpt);
    });
})