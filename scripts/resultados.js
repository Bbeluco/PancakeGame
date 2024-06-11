function carregar_resultados() {
    let podio = JSON.parse(localStorage.getItem("podio"))

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

        let celula_usuario_hora = linha.insertCell();
        let celula_usuario_nome = linha.insertCell();
        let celula_usuario_pontuacao = linha.insertCell();
        let celula_usuario_quantidade_perguntas = linha.insertCell();  

        celula_usuario_hora.outerHTML = `<td>${podio[i]["data"]}</td>`
        celula_usuario_nome.outerHTML = `<td>${podio[i]["nome_usuario"]}</td>`
        celula_usuario_pontuacao.outerHTML = `<td>${podio[i]["pontuacao"]}</td>`
        celula_usuario_quantidade_perguntas.outerHTML = `<td>${podio[i]["quantidade_perguntas_acertadas"]}</td>`
        
    }


    document.getElementById("resultados").appendChild(tabela);
}

function reiniciar_tabela() {
    if(confirm("Essa acao ira apagar todos os registros de resultados. Deseja prosseguir?")) {
        localStorage.setItem("podio", JSON.stringify([]));
        document.getElementById("resultados").removeChild()
    }


}