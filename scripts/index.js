document.addEventListener("DOMContentLoaded", async () => {
    let div_escolha_categorias = document.getElementById("escolha_categorias");

    let perguntas = await getPerguntas();
    let arrPerguntas = Object.keys(perguntas);
    
    arrPerguntas.forEach(element => {
        
        let inputOpt = document.createElement("input");
        inputOpt.type = "checkbox";
        inputOpt.id = "categoria_disponivel";
        inputOpt.label = element;

        let labelOpt = document.createElement("label");
        labelOpt.htmlFor = element
        labelOpt.textContent = element;

        div_escolha_categorias.appendChild(inputOpt);
        div_escolha_categorias.appendChild(labelOpt);
    });
})

async function getPerguntas() {
    return fetch("http://localhost:8000/perguntas.json").then(data => {
        return data.json();
    })
}