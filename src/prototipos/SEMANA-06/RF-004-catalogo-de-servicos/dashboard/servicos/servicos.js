// Lista de serviços, persistida no localStorage
var servicos = [];

// Guarda se estamos editando algum serviço (id) ou criando um novo (null)
var idSendoEditado = null;

// Quando a página carrega, busca os serviços salvos ou inicializa serviços padrão
function iniciar() {
    var dadosSalvos = localStorage.getItem("servicos");

    if (dadosSalvos == null) {
        servicos = [
            { id: 1, nome: "Corte Masculino", descricao: "Corte com acabamento na tesoura e máquina", duracao: 30, preco: 35.00, status: "Ativo" },
            { id: 2, nome: "Barba", descricao: "Alinhamento com navalha e toalha quente", duracao: 25, preco: 25.00, status: "Ativo" },
            { id: 3, nome: "Corte + Barba", descricao: "Combo completo de cabelo e barba", duracao: 50, preco: 55.00, status: "Ativo" },
            { id: 4, nome: "Sobrancelha", descricao: "Limpeza e alinhamento na navalha", duracao: 15, preco: 15.00, status: "Ativo" },
            { id: 5, nome: "Nevou / Platinado", descricao: "Descoloração global e matização platinada", duracao: 90, preco: 120.00, status: "Ativo" }
        ];
        salvarNoLocalStorage();
    } else {
        servicos = JSON.parse(dadosSalvos);
    }

    mostrarServicos();
}

// Salva a lista atual de serviços no localStorage
function salvarNoLocalStorage() {
    localStorage.setItem("servicos", JSON.stringify(servicos));
}

// Retorna classe CSS para o status
function pegarClasseDoStatus(status) {
    if (status == "Ativo") {
        return "status_ativo";
    }
    return "status_inativo";
}

// Formata valor para moeda brasileira
function formatarMoeda(valor) {
    var num = Number(valor);
    if (isNaN(num)) num = 0;
    return "R$ " + num.toFixed(2).replace(".", ",");
}

// READ - Renderiza a tabela de serviços
function mostrarServicos() {
    var tabela = document.getElementById("tabela");
    var textoBusca = document.getElementById("busca").value.toLowerCase();

    // Remove linhas anteriores, exceto o cabeçalho
    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }

    var quantidadeMostrada = 0;

    for (var i = 0; i < servicos.length; i++) {
        var s = servicos[i];

        var nomeMinusculo = s.nome.toLowerCase();
        var descMinusculo = (s.descricao || "").toLowerCase();

        // Filtro de busca por nome ou descrição
        if (textoBusca != "" && nomeMinusculo.indexOf(textoBusca) == -1 && descMinusculo.indexOf(textoBusca) == -1) {
            continue;
        }

        var linha = tabela.insertRow();

        linha.insertCell(0).innerText = s.nome;
        linha.insertCell(1).innerText = s.descricao ? s.descricao : "-";
        linha.insertCell(2).innerText = s.duracao + " min";

        linha.insertCell(3).innerText = formatarMoeda(s.preco);

        var celulaStatus = linha.insertCell(4);
        celulaStatus.innerText = s.status;
        celulaStatus.className = pegarClasseDoStatus(s.status);

        var celulaAcoes = linha.insertCell(5);

        // Botão Editar
        var botaoEditar = document.createElement("button");
        botaoEditar.innerText = "Editar";
        botaoEditar.className = "btn_tabela";
        botaoEditar.onclick = (function (idClicado) {
            return function () {
                abrirFormularioEdicao(idClicado);
            };
        })(s.id);
        celulaAcoes.appendChild(botaoEditar);

        // Botão Alternar Status (Ativar / Desativar)
        var botaoStatus = document.createElement("button");
        botaoStatus.innerText = s.status == "Ativo" ? "Desativar" : "Ativar";
        botaoStatus.className = "btn_tabela btn_status";
        botaoStatus.onclick = (function (idClicado) {
            return function () {
                alternarStatusServico(idClicado);
            };
        })(s.id);
        celulaAcoes.appendChild(botaoStatus);

        // Botão Excluir
        var botaoExcluir = document.createElement("button");
        botaoExcluir.innerText = "Excluir";
        botaoExcluir.className = "btn_tabela btn_excluir";
        botaoExcluir.onclick = (function (idClicado) {
            return function () {
                excluirServico(idClicado);
            };
        })(s.id);
        celulaAcoes.appendChild(botaoExcluir);

        quantidadeMostrada++;
    }

    // Exibe ou oculta aviso de nenhum serviço
    if (quantidadeMostrada == 0) {
        document.getElementById("mensagemVazia").style.display = "block";
        tabela.style.display = "none";
    } else {
        document.getElementById("mensagemVazia").style.display = "none";
        tabela.style.display = "table";
    }
}

// Abre o formulário vazio para cadastrar novo serviço
function abrirFormularioNovo() {
    idSendoEditado = null;

    document.getElementById("tituloFormulario").innerText = "Novo Serviço";
    document.getElementById("campoNome").value = "";
    document.getElementById("campoDescricao").value = "";
    document.getElementById("campoDuracao").value = "";
    document.getElementById("campoPreco").value = "";
    document.getElementById("campoStatus").value = "Ativo";

    document.getElementById("caixaFormulario").style.display = "block";
    document.getElementById("campoNome").focus();
}

// Abre formulário populado para edição
function abrirFormularioEdicao(id) {
    var servico = null;

    for (var i = 0; i < servicos.length; i++) {
        if (servicos[i].id == id) {
            servico = servicos[i];
            break;
        }
    }

    if (servico == null) return;

    idSendoEditado = id;

    document.getElementById("tituloFormulario").innerText = "Editar Serviço";
    document.getElementById("campoNome").value = servico.nome;
    document.getElementById("campoDescricao").value = servico.descricao || "";
    document.getElementById("campoDuracao").value = servico.duracao;
    document.getElementById("campoPreco").value = servico.preco;
    document.getElementById("campoStatus").value = servico.status;

    document.getElementById("caixaFormulario").style.display = "block";
    document.getElementById("campoNome").focus();
}

function fecharFormulario() {
    document.getElementById("caixaFormulario").style.display = "none";
}

// CREATE e UPDATE - Validações e persistência
function salvarServico() {
    var nome = document.getElementById("campoNome").value.trim();
    var descricao = document.getElementById("campoDescricao").value.trim();
    var duracaoStr = document.getElementById("campoDuracao").value.trim();
    var precoStr = document.getElementById("campoPreco").value.trim();
    var status = document.getElementById("campoStatus").value;

    // Validação 1: Nome preenchido
    if (nome == "") {
        alert("Por favor, preencha o nome do serviço!");
        document.getElementById("campoNome").focus();
        return;
    }

    // Validação 2: Duração válida em minutos
    var duracao = Number(duracaoStr);
    if (duracaoStr == "" || isNaN(duracao) || duracao <= 0) {
        alert("Por favor, informe uma duração válida em minutos (maior que zero)!");
        document.getElementById("campoDuracao").focus();
        return;
    }

    // Validação 3: Preço válido
    var preco = Number(precoStr);
    if (precoStr == "" || isNaN(preco) || preco < 0) {
        alert("Por favor, informe um preço válido (número maior ou igual a 0)!");
        document.getElementById("campoPreco").focus();
        return;
    }

    if (idSendoEditado == null) {
        // CREATE - Maior ID + 1
        var maiorId = 0;
        for (var i = 0; i < servicos.length; i++) {
            if (servicos[i].id > maiorId) {
                maiorId = servicos[i].id;
            }
        }

        var novoServico = {
            id: maiorId + 1,
            nome: nome,
            descricao: descricao,
            duracao: duracao,
            preco: preco,
            status: status
        };

        servicos.push(novoServico);
    } else {
        // UPDATE - Atualiza o serviço existente
        for (var j = 0; j < servicos.length; j++) {
            if (servicos[j].id == idSendoEditado) {
                servicos[j].nome = nome;
                servicos[j].descricao = descricao;
                servicos[j].duracao = duracao;
                servicos[j].preco = preco;
                servicos[j].status = status;
                break;
            }
        }
    }

    salvarNoLocalStorage();
    mostrarServicos();
    fecharFormulario();
}

// Alterna o status entre Ativo e Inativo diretamente
function alternarStatusServico(id) {
    for (var i = 0; i < servicos.length; i++) {
        if (servicos[i].id == id) {
            servicos[i].status = (servicos[i].status == "Ativo") ? "Inativo" : "Ativo";
            break;
        }
    }

    salvarNoLocalStorage();
    mostrarServicos();
}

// DELETE - Remove serviço com confirmação
function excluirServico(id) {
    var confirmou = confirm("Tem certeza que deseja excluir este serviço?");
    if (!confirmou) {
        return;
    }

    var novaLista = [];
    for (var i = 0; i < servicos.length; i++) {
        if (servicos[i].id != id) {
            novaLista.push(servicos[i]);
        }
    }
    servicos = novaLista;

    salvarNoLocalStorage();
    mostrarServicos();
}

function sair() {
    window.location.href = "../../app/RF-03.html";
}

// Inicializa ao carregar o script
iniciar();