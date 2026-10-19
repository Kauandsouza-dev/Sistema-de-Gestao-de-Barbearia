// lista de agendamentos, fica guardada aqui na memória
var agendamentos = [];

// guarda se estamos editando algum agendamento (id) ou criando um novo (null)
var idSendoEditado = null;

// quando a página carrega, pega os dados salvos ou cria uns exemplos
function iniciar() {
    var dadosSalvos = localStorage.getItem("agendamentos");
    var listaLida = null;

    // se o dado salvo estiver corrompido, o JSON.parse lança erro e a página inteira quebraria
    if (dadosSalvos != null) {
        try {
            listaLida = JSON.parse(dadosSalvos);
        } catch (erro) {
            listaLida = null;
        }
    }

    if (Array.isArray(listaLida)) {
        agendamentos = listaLida;
    } else {
        agendamentos = [];
        agendamentos.push({ id: 1, cliente: "Kauan Souza", servico: "Corte + Barba", barbeiro: "Carlos Silva", data: "2026-10-20", hora: "14:30", status: "Confirmado" });
        agendamentos.push({ id: 2, cliente: "Pedro Santos", servico: "Corte Masculino", barbeiro: "João Silva", data: "2026-10-21", hora: "09:00", status: "Pendente" });
        agendamentos.push({ id: 3, cliente: "Bryant Lima", servico: "Barba", barbeiro: "Carlos Silva", data: "2026-10-21", hora: "11:15", status: "Cancelado" });
        salvarNoLocalStorage();
    }

    mostrarAgendamentos();
    carregarSelectServicos();
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
    var corpoTabela = document.getElementById("corpoTabela");
    var textoBusca = document.getElementById("busca").value;
    textoBusca = textoBusca.toLowerCase();

    // apaga todas as linhas do corpo da tabela (o cabeçalho fica no thead e não é mexido)
    while (corpoTabela.rows.length > 0) {
        corpoTabela.deleteRow(0);
    }

    var quantidadeMostrada = 0;

    for (var i = 0; i < agendamentos.length; i++) {
        var ag = agendamentos[i];

        var nomeClienteMinusculo = ag.cliente.toLowerCase();
        if (textoBusca != "" && nomeClienteMinusculo.indexOf(textoBusca) == -1) {
            continue; // não bate com a busca, pula esse
        }

        // insere no tbody (se fosse na tabela direto, a linha cairia dentro do thead)
        var linha = corpoTabela.insertRow();

        // data-label = nome da coluna, usado pelo CSS pra montar o cartão no celular
        var celulaCliente = linha.insertCell(0);
        celulaCliente.innerText = ag.cliente;
        celulaCliente.setAttribute("data-label", "Cliente");

        var celulaServico = linha.insertCell(1);
        celulaServico.innerText = ag.servico;
        celulaServico.setAttribute("data-label", "Serviço");

        var celulaBarbeiro = linha.insertCell(2);
        celulaBarbeiro.innerText = ag.barbeiro;
        celulaBarbeiro.setAttribute("data-label", "Barbeiro");

        var celulaData = linha.insertCell(3);
        celulaData.innerText = ag.data;
        celulaData.setAttribute("data-label", "Data");

        var celulaHora = linha.insertCell(4);
        celulaHora.innerText = ag.hora;
        celulaHora.setAttribute("data-label", "Hora");

        var celulaStatus = linha.insertCell(5);
        celulaStatus.innerText = ag.status;
        celulaStatus.className = pegarClasseDoStatus(ag.status);
        celulaStatus.setAttribute("data-label", "Status");

        var celulaAcoes = linha.insertCell(6);
        celulaAcoes.setAttribute("data-label", "Ações");

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
        tabela.style.display = "";
    }
}

// Popula dinamicamente o select de serviços com base nos serviços ativos salvos no localStorage (RF-004)
function carregarSelectServicos(servicoSelecionado) {
    var select = document.getElementById("campoServico");
    if (!select) return;

    select.innerHTML = "";

    var dadosSalvos = localStorage.getItem("servicos");
    var listaServicos = [];

    // mesma proteção: dado ausente ou corrompido cai na lista padrão
    var listaLidaServicos = null;
    if (dadosSalvos != null) {
        try {
            listaLidaServicos = JSON.parse(dadosSalvos);
        } catch (erro) {
            listaLidaServicos = null;
        }
    }

    if (!Array.isArray(listaLidaServicos)) {
        listaServicos = [
            { id: 1, nome: "Corte Masculino", duracao: 30, preco: 35.00, status: "Ativo" },
            { id: 2, nome: "Barba", duracao: 25, preco: 25.00, status: "Ativo" },
            { id: 3, nome: "Corte + Barba", duracao: 50, preco: 55.00, status: "Ativo" },
            { id: 4, nome: "Sobrancelha", duracao: 15, preco: 15.00, status: "Ativo" },
            { id: 5, nome: "Nevou / Platinado", duracao: 90, preco: 120.00, status: "Ativo" }
        ];
        localStorage.setItem("servicos", JSON.stringify(listaServicos));
    } else {
        listaServicos = listaLidaServicos;
    }

    var achouSelecionado = false;

    for (var i = 0; i < listaServicos.length; i++) {
        var s = listaServicos[i];
        // Permite exibir apenas serviços ativos ou o que já estava vinculado à edição
        if (s.status == "Ativo" || s.nome == servicoSelecionado) {
            var opcao = document.createElement("option");
            opcao.value = s.nome;
            var precoFormatado = Number(s.preco).toFixed(2).replace(".", ",");
            opcao.innerText = s.nome + " (R$ " + precoFormatado + " - " + s.duracao + " min)";
            if (s.nome == servicoSelecionado) {
                opcao.selected = true;
                achouSelecionado = true;
            }
            select.appendChild(opcao);
        }
    }

    // Se o serviço do agendamento não foi encontrado na lista, mantém opção para compatibilidade
    if (servicoSelecionado && !achouSelecionado) {
        var opcaoExtra = document.createElement("option");
        opcaoExtra.value = servicoSelecionado;
        opcaoExtra.innerText = servicoSelecionado;
        opcaoExtra.selected = true;
        select.appendChild(opcaoExtra);
    }
}

// abre o formulário vazio, pra criar um agendamento novo
function abrirFormularioNovo() {
    idSendoEditado = null;
    limparErroFormulario();

    carregarSelectServicos();

    document.getElementById("tituloFormulario").innerText = "Novo Agendamento";
    document.getElementById("campoCliente").value = "";
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
    limparErroFormulario();

    carregarSelectServicos(agendamento.servico);

    document.getElementById("tituloFormulario").innerText = "Editar Agendamento";
    document.getElementById("campoCliente").value = agendamento.cliente;
    document.getElementById("campoBarbeiro").value = agendamento.barbeiro;
    document.getElementById("campoData").value = agendamento.data;
    document.getElementById("campoHora").value = agendamento.hora;
    document.getElementById("campoStatus").value = agendamento.status;

    document.getElementById("caixaFormulario").style.display = "block";
}

function fecharFormulario() {
    limparErroFormulario();
    document.getElementById("caixaFormulario").style.display = "none";
}

// mostra a mensagem de erro dentro do formulário e destaca o campo com problema (substitui o alert)
function mostrarErroFormulario(mensagem, idCampo) {
    limparErroFormulario();

    var caixaErro = document.getElementById("mensagemErro");
    caixaErro.innerText = mensagem;
    caixaErro.hidden = false;

    if (idCampo) {
        var campo = document.getElementById(idCampo);
        campo.classList.add("input_invalido");
        campo.setAttribute("aria-invalid", "true");
        campo.focus();
    }
}

// tira a mensagem e o destaque vermelho de todos os campos
function limparErroFormulario() {
    document.getElementById("mensagemErro").hidden = true;

    var campos = document.querySelectorAll("#caixaFormulario .input_invalido");
    for (var i = 0; i < campos.length; i++) {
        campos[i].classList.remove("input_invalido");
        campos[i].removeAttribute("aria-invalid");
    }
}

// true se já existe outro agendamento (não cancelado) com o mesmo barbeiro, data e hora
function existeConflitoDeHorario(barbeiro, data, hora, idIgnorado) {
    for (var i = 0; i < agendamentos.length; i++) {
        var outro = agendamentos[i];

        if (outro.id == idIgnorado) {
            continue; // é o próprio agendamento que está sendo editado
        }
        if (outro.status == "Cancelado") {
            continue; // horário cancelado volta a ficar livre
        }
        if (outro.barbeiro.toLowerCase() == barbeiro.toLowerCase() && outro.data == data && outro.hora == hora) {
            return true;
        }
    }
    return false;
}

// CREATE e UPDATE - salva o que tiver no formulário
function salvarAgendamento() {
    // trim() tira espaços das pontas, assim "   " conta como campo vazio
    var cliente = document.getElementById("campoCliente").value.trim();
    var servico = document.getElementById("campoServico").value;
    var barbeiro = document.getElementById("campoBarbeiro").value.trim();
    var data = document.getElementById("campoData").value;
    var hora = document.getElementById("campoHora").value;
    var status = document.getElementById("campoStatus").value;

    // validação: mostra o erro no próprio formulário, no primeiro campo problemático
    if (cliente == "") {
        mostrarErroFormulario("Informe o nome do cliente.", "campoCliente");
        return;
    }
    if (barbeiro == "") {
        mostrarErroFormulario("Informe o nome do barbeiro.", "campoBarbeiro");
        return;
    }
    if (data == "") {
        mostrarErroFormulario("Escolha a data do agendamento.", "campoData");
        return;
    }
    if (hora == "") {
        mostrarErroFormulario("Escolha o horário do agendamento.", "campoHora");
        return;
    }

    // regra de negócio: o mesmo barbeiro não pode ter dois clientes no mesmo horário
    if (status != "Cancelado" && existeConflitoDeHorario(barbeiro, data, hora, idSendoEditado)) {
        mostrarErroFormulario("Este barbeiro já tem um agendamento nesse dia e horário. Escolha outro horário.", "campoHora");
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

function sair() {
    window.location.href = "../app/RF-004-catalogo-de-servicos.html";
}