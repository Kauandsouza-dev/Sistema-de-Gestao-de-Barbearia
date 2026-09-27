// lista de agendamentos, fica guardada aqui na memória
var agendamentos = [];

// guarda se estamos editando algum agendamento (id) ou criando um novo (null)
var idSendoEditado = null;

// quando a página carrega, pega os dados salvos ou cria uns exemplos
function iniciar() {
    var dadosSalvos = localStorage.getItem("agendamentos");

    if (dadosSalvos == null) {
        agendamentos.push({ id: 1, cliente: "Kauan Souza", servico: "Corte + Barba", barbeiro: "Carlos Silva", data: "2025-09-15", hora: "14:30", status: "Confirmado" });
        agendamentos.push({ id: 2, cliente: "Pedro Santos", servico: "Corte Masculino", barbeiro: "João Silva", data: "2025-09-16", hora: "09:00", status: "Pendente" });
        agendamentos.push({ id: 3, cliente: "Bryant Lima", servico: "Barba", barbeiro: "Carlos Silva", data: "2025-09-16", hora: "11:15", status: "Cancelado" });
        salvarNoLocalStorage();
    } else {
        agendamentos = JSON.parse(dadosSalvos);
    }

    mostrarAgendamentos();
}

// salva a lista atual no localStorage
function salvarNoLocalStorage() {
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
}

// descobre a classe de cor certa pro status
function pegarClasseDoStatus(status) {
    if (status == "Confirmado") {
        return "status_confirmado";
    }
    if (status == "Pendente") {
        return "status_pendente";
    }
    return "status_cancelado";
}

// READ - monta a tabela na tela
function mostrarAgendamentos() {
    var tabela = document.getElementById("tabela");
    var textoBusca = document.getElementById("busca").value;
    textoBusca = textoBusca.toLowerCase();

    // apaga todas as linhas, menos o cabeçalho (linha 0)
    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }

    var quantidadeMostrada = 0;

    for (var i = 0; i < agendamentos.length; i++) {
        var ag = agendamentos[i];

        var nomeClienteMinusculo = ag.cliente.toLowerCase();
        if (textoBusca != "" && nomeClienteMinusculo.indexOf(textoBusca) == -1) {
            continue; // não bate com a busca, pula esse
        }

        var linha = tabela.insertRow();

        linha.insertCell(0).innerText = ag.cliente;
        linha.insertCell(1).innerText = ag.servico;
        linha.insertCell(2).innerText = ag.barbeiro;
        linha.insertCell(3).innerText = ag.data;
        linha.insertCell(4).innerText = ag.hora;

        var celulaStatus = linha.insertCell(5);
        celulaStatus.innerText = ag.status;
        celulaStatus.className = pegarClasseDoStatus(ag.status);

        var celulaAcoes = linha.insertCell(6);

        var botaoEditar = document.createElement("button");
        botaoEditar.innerText = "Editar";
        botaoEditar.className = "btn_tabela";
        botaoEditar.onclick = function (idClicado) {
            return function () {
                abrirFormularioEdicao(idClicado);
            };
        }(ag.id);
        celulaAcoes.appendChild(botaoEditar);

        var botaoExcluir = document.createElement("button");
        botaoExcluir.innerText = "Excluir";
        botaoExcluir.className = "btn_tabela btn_excluir";
        botaoExcluir.onclick = function (idClicado) {
            return function () {
                excluirAgendamento(idClicado);
            };
        }(ag.id);
        celulaAcoes.appendChild(botaoExcluir);

        quantidadeMostrada = quantidadeMostrada + 1;
    }

    // mostra a mensagem de "nada encontrado" se precisar
    if (quantidadeMostrada == 0) {
        document.getElementById("mensagemVazia").style.display = "block";
        tabela.style.display = "none";
    } else {
        document.getElementById("mensagemVazia").style.display = "none";
        tabela.style.display = "table";
    }
}

// abre o formulário vazio, pra criar um agendamento novo
function abrirFormularioNovo() {
    idSendoEditado = null;

    document.getElementById("tituloFormulario").innerText = "Novo Agendamento";
    document.getElementById("campoCliente").value = "";
    document.getElementById("campoServico").value = "Corte Masculino";
    document.getElementById("campoBarbeiro").value = "";
    document.getElementById("campoData").value = "";
    document.getElementById("campoHora").value = "";
    document.getElementById("campoStatus").value = "Confirmado";

    document.getElementById("caixaFormulario").style.display = "block";
}

// abre o formulário já preenchido, pra editar
function abrirFormularioEdicao(id) {
    var agendamento = null;

    for (var i = 0; i < agendamentos.length; i++) {
        if (agendamentos[i].id == id) {
            agendamento = agendamentos[i];
        }
    }

    if (agendamento == null) {
        return;
    }

    idSendoEditado = id;

    document.getElementById("tituloFormulario").innerText = "Editar Agendamento";
    document.getElementById("campoCliente").value = agendamento.cliente;
    document.getElementById("campoServico").value = agendamento.servico;
    document.getElementById("campoBarbeiro").value = agendamento.barbeiro;
    document.getElementById("campoData").value = agendamento.data;
    document.getElementById("campoHora").value = agendamento.hora;
    document.getElementById("campoStatus").value = agendamento.status;

    document.getElementById("caixaFormulario").style.display = "block";
}

function fecharFormulario() {
    document.getElementById("caixaFormulario").style.display = "none";
}

// CREATE e UPDATE - salva o que tiver no formulário
function salvarAgendamento() {
    var cliente = document.getElementById("campoCliente").value;
    var servico = document.getElementById("campoServico").value;
    var barbeiro = document.getElementById("campoBarbeiro").value;
    var data = document.getElementById("campoData").value;
    var hora = document.getElementById("campoHora").value;
    var status = document.getElementById("campoStatus").value;

    // validação bem simples, só confere se preencheu tudo
    if (cliente == "" || barbeiro == "" || data == "" || hora == "") {
        alert("Preencha todos os campos!");
        return;
    }

    if (idSendoEditado == null) {
        // CREATE - cria um id novo pegando o maior + 1
        var maiorId = 0;
        for (var i = 0; i < agendamentos.length; i++) {
            if (agendamentos[i].id > maiorId) {
                maiorId = agendamentos[i].id;
            }
        }

        var novoAgendamento = {
            id: maiorId + 1,
            cliente: cliente,
            servico: servico,
            barbeiro: barbeiro,
            data: data,
            hora: hora,
            status: status
        };

        agendamentos.push(novoAgendamento);

    } else {
        // UPDATE - acha o agendamento pelo id e troca os campos
        for (var j = 0; j < agendamentos.length; j++) {
            if (agendamentos[j].id == idSendoEditado) {
                agendamentos[j].cliente = cliente;
                agendamentos[j].servico = servico;
                agendamentos[j].barbeiro = barbeiro;
                agendamentos[j].data = data;
                agendamentos[j].hora = hora;
                agendamentos[j].status = status;
            }
        }
    }

    salvarNoLocalStorage();
    mostrarAgendamentos();
    fecharFormulario();
}

// DELETE - remove o agendamento da lista
function excluirAgendamento(id) {
    var confirmou = confirm("Tem certeza que quer excluir esse agendamento?");
    if (confirmou == false) {
        return;
    }

    var novaLista = [];
    for (var i = 0; i < agendamentos.length; i++) {
        if (agendamentos[i].id != id) {
            novaLista.push(agendamentos[i]);
        }
    }
    agendamentos = novaLista;

    salvarNoLocalStorage();
    mostrarAgendamentos();
}

// chama a função de iniciar assim que o JS carrega
iniciar();
