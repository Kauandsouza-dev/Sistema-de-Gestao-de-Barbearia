var servicos = [];
var idSendoEditado = null;
var usuarioLogado = null;

function verificarSessaoEAdaptarTela() {
    var sessaoSalva = sessionStorage.getItem("usuarioLogado");

    if (sessaoSalva != null) {
        try {
            usuarioLogado = JSON.parse(sessaoSalva);
        } catch (erro) {
            usuarioLogado = null;
        }
    }

    if (usuarioLogado == null || !usuarioLogado.perfil) {
        window.location.href = "../../app/login.html";
        return false;
    }

    if (usuarioLogado.perfil == "cliente") {
        window.location.href = "../RF-008-painel-de-metricas-financeiras.html";
        return false;
    }

    var infoUsuario = document.getElementById("infoUsuario");
    if (infoUsuario) {
        var nomePerfil = (usuarioLogado.perfil == "admin") ? "Admin" : "Barbeiro";
        infoUsuario.innerText = usuarioLogado.nome + " (" + nomePerfil + ")";
    }

    var linkBarbeiros = document.getElementById("linkBarbeiros");

    if (usuarioLogado.perfil == "barbeiro") {
        var botaoNovo = document.getElementById("botaoNovo");
        var colunaAcoes = document.getElementById("colunaAcoes");
        if (botaoNovo) botaoNovo.style.display = "none";
        if (colunaAcoes) colunaAcoes.style.display = "none";
        if (linkBarbeiros) linkBarbeiros.style.display = "none";
    } else if (usuarioLogado.perfil == "admin") {
        if (linkBarbeiros) linkBarbeiros.style.display = "";
    }

    return true;
}

function iniciar() {
    var acessoLiberado = verificarSessaoEAdaptarTela();
    if (!acessoLiberado) {
        return;
    }

    var dadosSalvos = localStorage.getItem("servicos");
    var listaLida = null;

    if (dadosSalvos != null) {
        try {
            listaLida = JSON.parse(dadosSalvos);
        } catch (erro) {
            listaLida = null;
        }
    }

    if (!Array.isArray(listaLida)) {
        servicos = [
            { id: 1, nome: "Corte Masculino", descricao: "Corte com acabamento na tesoura e máquina", duracao: 30, preco: 35.00, status: "Ativo" },
            { id: 2, nome: "Barba", descricao: "Alinhamento com navalha e toalha quente", duracao: 25, preco: 25.00, status: "Ativo" },
            { id: 3, nome: "Corte + Barba", descricao: "Combo completo de cabelo e barba", duracao: 50, preco: 55.00, status: "Ativo" },
            { id: 4, nome: "Sobrancelha", descricao: "Limpeza e alinhamento na navalha", duracao: 15, preco: 15.00, status: "Ativo" },
            { id: 5, nome: "Nevou / Platinado", descricao: "Descoloração global e matização platinada", duracao: 90, preco: 120.00, status: "Ativo" }
        ];
        salvarNoLocalStorage();
    } else {
        servicos = listaLida;
    }

    mostrarServicos();
}

function salvarNoLocalStorage() {
    localStorage.setItem("servicos", JSON.stringify(servicos));
}

function pegarClasseDoStatus(status) {
    if (status == "Ativo") {
        return "status_ativo";
    }
    return "status_inativo";
}

function formatarMoeda(valor) {
    var num = Number(valor);
    if (isNaN(num)) num = 0;
    return "R$ " + num.toFixed(2).replace(".", ",");
}

function mostrarServicos() {
    var tabela = document.getElementById("tabela");
    var corpoTabela = document.getElementById("corpoTabela");
    var textoBusca = document.getElementById("busca").value.toLowerCase();

    while (corpoTabela.rows.length > 0) {
        corpoTabela.deleteRow(0);
    }

    var quantidadeMostrada = 0;

    for (var i = 0; i < servicos.length; i++) {
        var s = servicos[i];

        var nomeMinusculo = s.nome.toLowerCase();
        var descMinusculo = (s.descricao || "").toLowerCase();

        if (textoBusca != "" && nomeMinusculo.indexOf(textoBusca) == -1 && descMinusculo.indexOf(textoBusca) == -1) {
            continue;
        }

        var linha = corpoTabela.insertRow();

        var celulaNome = linha.insertCell(0);
        celulaNome.innerText = s.nome;
        celulaNome.setAttribute("data-label", "Serviço");

        var celulaDescricao = linha.insertCell(1);
        celulaDescricao.innerText = s.descricao ? s.descricao : "-";
        celulaDescricao.setAttribute("data-label", "Descrição");

        var celulaDuracao = linha.insertCell(2);
        celulaDuracao.innerText = s.duracao + " min";
        celulaDuracao.setAttribute("data-label", "Duração");

        var celulaPreco = linha.insertCell(3);
        celulaPreco.innerText = formatarMoeda(s.preco);
        celulaPreco.setAttribute("data-label", "Preço (R$)");

        var celulaStatus = linha.insertCell(4);
        celulaStatus.innerText = s.status;
        celulaStatus.className = pegarClasseDoStatus(s.status);
        celulaStatus.setAttribute("data-label", "Status");

        if (!usuarioLogado || usuarioLogado.perfil == "admin") {
            var celulaAcoes = linha.insertCell(5);
            celulaAcoes.setAttribute("data-label", "Ações");

            var botaoEditar = document.createElement("button");
            botaoEditar.innerText = "Editar";
            botaoEditar.className = "btn_tabela";
            botaoEditar.onclick = (function (idClicado) {
                return function () {
                    abrirFormularioEdicao(idClicado);
                };
            })(s.id);
            celulaAcoes.appendChild(botaoEditar);

            var botaoStatus = document.createElement("button");
            botaoStatus.innerText = s.status == "Ativo" ? "Desativar" : "Ativar";
            botaoStatus.className = "btn_tabela btn_status";
            botaoStatus.onclick = (function (idClicado) {
                return function () {
                    alternarStatusServico(idClicado);
                };
            })(s.id);
            celulaAcoes.appendChild(botaoStatus);

            var botaoExcluir = document.createElement("button");
            botaoExcluir.innerText = "Excluir";
            botaoExcluir.className = "btn_tabela btn_excluir";
            botaoExcluir.onclick = (function (idClicado) {
                return function () {
                    excluirServico(idClicado);
                };
            })(s.id);
            celulaAcoes.appendChild(botaoExcluir);
        }

        quantidadeMostrada++;
    }

    if (quantidadeMostrada == 0) {
        document.getElementById("mensagemVazia").style.display = "block";
        tabela.style.display = "none";
    } else {
        document.getElementById("mensagemVazia").style.display = "none";
        tabela.style.display = "table";
    }
}

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

function limparErroFormulario() {
    var caixaErro = document.getElementById("mensagemErro");
    if (caixaErro) {
        caixaErro.hidden = true;
    }

    var campos = document.querySelectorAll("#caixaFormulario .input_invalido");
    for (var i = 0; i < campos.length; i++) {
        campos[i].classList.remove("input_invalido");
        campos[i].removeAttribute("aria-invalid");
    }
}

function abrirFormularioNovo() {
    if (usuarioLogado && usuarioLogado.perfil != "admin") {
        return;
    }

    idSendoEditado = null;
    limparErroFormulario();

    document.getElementById("tituloFormulario").innerText = "Novo Serviço";
    document.getElementById("campoNome").value = "";
    document.getElementById("campoDescricao").value = "";
    document.getElementById("campoDuracao").value = "";
    document.getElementById("campoPreco").value = "";
    document.getElementById("campoStatus").value = "Ativo";

    document.getElementById("caixaFormulario").style.display = "block";
    document.getElementById("campoNome").focus();
}

function abrirFormularioEdicao(id) {
    if (usuarioLogado && usuarioLogado.perfil != "admin") {
        return;
    }

    var servico = null;

    for (var i = 0; i < servicos.length; i++) {
        if (servicos[i].id == id) {
            servico = servicos[i];
            break;
        }
    }

    if (servico == null) return;

    idSendoEditado = id;
    limparErroFormulario();

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
    limparErroFormulario();
    document.getElementById("caixaFormulario").style.display = "none";
}

function salvarServico() {
    if (usuarioLogado && usuarioLogado.perfil != "admin") {
        return;
    }

    var nome = document.getElementById("campoNome").value.trim();
    var descricao = document.getElementById("campoDescricao").value.trim();
    var duracaoStr = document.getElementById("campoDuracao").value.trim();
    var precoStr = document.getElementById("campoPreco").value.trim();
    var status = document.getElementById("campoStatus").value;

    if (nome == "") {
        mostrarErroFormulario("Por favor, preencha o nome do serviço.", "campoNome");
        return;
    }

    var duracao = Number(duracaoStr);
    if (duracaoStr == "" || isNaN(duracao) || duracao <= 0) {
        mostrarErroFormulario("Informe uma duração válida em minutos (maior que zero).", "campoDuracao");
        return;
    }

    var preco = Number(precoStr);
    if (precoStr == "" || isNaN(preco) || preco < 0) {
        mostrarErroFormulario("Informe um preço válido (número maior ou igual a 0).", "campoPreco");
        return;
    }

    if (idSendoEditado == null) {
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

function alternarStatusServico(id) {
    if (usuarioLogado && usuarioLogado.perfil != "admin") {
        return;
    }

    for (var i = 0; i < servicos.length; i++) {
        if (servicos[i].id == id) {
            servicos[i].status = (servicos[i].status == "Ativo") ? "Inativo" : "Ativo";
            break;
        }
    }

    salvarNoLocalStorage();
    mostrarServicos();
}

function excluirServico(id) {
    if (usuarioLogado && usuarioLogado.perfil != "admin") {
        return;
    }

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
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "../../app/login.html";
}

iniciar();
