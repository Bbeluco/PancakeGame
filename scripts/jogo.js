const shuffle = (arr) => {
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], [arr[i]]];
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

    
    let perguntas_disponiveis = JSON.parse(localStorage.getItem("perguntas"))
    let opcoes_possiveis = []
    categorias.forEach(el => {
        opcoes_possiveis = [...opcoes_possiveis, ...perguntas_disponiveis[el.label]]
    });

    let opcoes_embaralhadas = shuffle(opcoes_possiveis);
    if(opcoes_embaralhadas.length > quantidade_de_perguntas) {
        // Cenario que eu tenho que renderizar todas as perguntas
    } else {
        // Cenario que eu tenho mais perguntas disponiveis do que o usuario pediu
    }
}