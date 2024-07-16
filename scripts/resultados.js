async function carregar_resultados() {
    let podio = await carregarPodio();
    let tabela = document.createElement("table");
    tabela.id = "tabela_resultados"

    const linha_titulo = tabela.insertRow();

    let celula_hora = linha_titulo.insertCell();
    let celula_nome = linha_titulo.insertCell();
    let celula_pontuacao = linha_titulo.insertCell();
    let celula_quantidade_perguntas = linha_titulo.insertCell();
    

    celula_hora.outerHTML = "<th>Hora</th>"
    celula_nome.outerHTML = "<th>Nome</th>"
    celula_pontuacao.outerHTML = "<th>Pontuacao</th>"
    celula_quantidade_perguntas.outerHTML = "<th>Quantidade perguntas</th>"

    for (let i = 0; i < 10; i++) {
        if(!podio[i]) {
            break;
        }
        let linha = tabela.insertRow();
        usuario = JSON.parse(podio[i]);

        let celula_usuario_hora = linha.insertCell();
        let celula_usuario_nome = linha.insertCell();
        let celula_usuario_pontuacao = linha.insertCell();
        let celula_usuario_quantidade_perguntas = linha.insertCell();  

        celula_usuario_hora.outerHTML = `<td>${usuario["data"]}</td>`
        celula_usuario_nome.outerHTML = `<td>${usuario["nome_usuario"]}</td>`
        celula_usuario_pontuacao.outerHTML = `<td>${usuario["pontuacao"]}</td>`
        celula_usuario_quantidade_perguntas.outerHTML = `<td>${usuario["quantidade_perguntas_acertadas"]}</td>`
        
    }


    document.getElementById("resultados").appendChild(tabela);
}

function reiniciar_tabela() {
    if(confirm("Essa acao ira apagar todos os registros de resultados. Deseja prosseguir?")) {
        const options = {
            method: "DELETE"
        }

        fetch("http://localhost:8000/podium", options);

        document.getElementById("resultados").removeChild()
    }
}

async function carregarPodio() {
    return fetch("http://localhost:8000/placar.json").then(data => {
        return data.json();
    })
}