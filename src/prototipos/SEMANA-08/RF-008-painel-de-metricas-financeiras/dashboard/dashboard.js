var SUPABASE_URL = "https://qqxntkifbvzcneaqbhae.supabase.co";
var SUPABASE_ANON_KEY = "sb_publishable_FjIQ8xTPK0Y7TrMxlknn-A_48rvJyeD";
var supabaseClient = (typeof window !== "undefined" && window.supabase && window.supabase.createClient)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

var agendamentos = [];
var barbeirosDoBanco = [];
var equipeBarbeiros = [];
var idSendoEditado = null;
var idBarbeiroSendoEditado = null;
var usuarioLogado = null;
var abaAtiva = "agendamentos";
var PERCENTUAL_BARBEIRO = 0.70;
var PERCENTUAL_SALAO = 0.30;

var HORARIOS_COMERCIAIS = [
    "09:00", "09:30",
    "10:00", "10:30",
    "11:00", "11:30",
    "12:00", "12:30",
    "13:00", "13:30",
    "14:00", "14:30",
    "15:00", "15:30",
    "16:00", "16:30",
    "17:00", "17:30",
    "18:00"
];

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
        window.location.href = "../app/login.html";
        return false;
    }

    var infoUsuario = document.getElementById("infoUsuario");
    if (infoUsuario) {
        var nomePerfil = "Cliente";
        if (usuarioLogado.perfil == "admin") {
            nomePerfil = "Admin";
        } else if (usuarioLogado.perfil == "barbeiro") {
            nomePerfil = "Barbeiro";
        }
        infoUsuario.innerText = usuarioLogado.nome + " (" + nomePerfil + ")";
    }

    var painelMetricas = document.getElementById("painelMetricas");
    var cartaoRepasseBarbeiros = document.getElementById("cartaoRepasseBarbeiros");
    var linkServicos = document.getElementById("linkServicos");
    var linkBarbeiros = document.getElementById("linkBarbeiros");
    var abaGestaoBarbeiros = document.getElementById("abaGestaoBarbeiros");
    var tituloPagina = document.getElementById("tituloPagina");
    var campoBusca = document.getElementById("busca");

    if (usuarioLogado.perfil == "admin") {
        if (painelMetricas) painelMetricas.style.display = "flex";
        if (cartaoRepasseBarbeiros) cartaoRepasseBarbeiros.style.display = "block";
        if (linkServicos) linkServicos.style.display = "";
        if (linkBarbeiros) linkBarbeiros.style.display = "";
        if (tituloPagina) tituloPagina.innerText = "Agendamentos e Controle de Caixa";
    } else if (usuarioLogado.perfil == "barbeiro") {
        if (painelMetricas) painelMetricas.style.display = "flex";
        if (cartaoRepasseBarbeiros) cartaoRepasseBarbeiros.style.display = "none";
        if (linkServicos) linkServicos.style.display = "";
        if (linkBarbeiros) linkBarbeiros.style.display = "none";
        if (abaGestaoBarbeiros) abaGestaoBarbeiros.style.display = "none";
        if (tituloPagina) tituloPagina.innerText = "Minha Agenda Diária (" + usuarioLogado.nome + ")";
    } else if (usuarioLogado.perfil == "cliente") {
        if (painelMetricas) painelMetricas.style.display = "none";
        if (cartaoRepasseBarbeiros) cartaoRepasseBarbeiros.style.display = "none";
        if (linkServicos) linkServicos.style.display = "none";
        if (linkBarbeiros) linkBarbeiros.style.display = "none";
        if (abaGestaoBarbeiros) abaGestaoBarbeiros.style.display = "none";
        if (campoBusca) campoBusca.style.display = "none";
        if (tituloPagina) tituloPagina.innerText = "Meus Agendamentos";
    }

    return true;
}

function alternarAbaMenu(nomeAba) {
    var abaAgendamentos = document.getElementById("abaAgendamentos");
    var abaGestaoBarbeiros = document.getElementById("abaGestaoBarbeiros");
    var linkAgendamentos = document.getElementById("linkAgendamentos");
    var linkBarbeiros = document.getElementById("linkBarbeiros");

    if (nomeAba == "barbeiros" && (!usuarioLogado || usuarioLogado.perfil != "admin")) {
        nomeAba = "agendamentos";
    }

    abaAtiva = nomeAba;

    if (nomeAba == "barbeiros") {
        if (abaAgendamentos) abaAgendamentos.style.display = "none";
        if (abaGestaoBarbeiros) abaGestaoBarbeiros.style.display = "block";
        if (linkAgendamentos) linkAgendamentos.className = "link_menu";
        if (linkBarbeiros) linkBarbeiros.className = "link_menu link_ativo";
        mostrarEquipeBarbeiros();
    } else {
        if (abaGestaoBarbeiros) abaGestaoBarbeiros.style.display = "none";
        if (abaAgendamentos) abaAgendamentos.style.display = "block";
        if (linkBarbeiros) linkBarbeiros.className = "link_menu";
        if (linkAgendamentos) linkAgendamentos.className = "link_menu link_ativo";
        mostrarAgendamentos();
    }
}

function limparBarbeirosLegadosInexistentes() {
    try {
        localStorage.removeItem("barbeirosCadastrados");
    } catch (e) {}

    var nomesLegados = ["carlos silva", "joão silva", "joao silva", "cleber machado"];

    var novaEquipe = [];
    for (var i = 0; i < equipeBarbeiros.length; i++) {
        var nomeMembro = equipeBarbeiros[i].nome ? String(equipeBarbeiros[i].nome).toLowerCase().trim() : "";
        var ehLegado = false;
        for (var j = 0; j < nomesLegados.length; j++) {
            if (nomeMembro == nomesLegados[j]) {
                ehLegado = true;
                break;
            }
        }
        if (!ehLegado) {
            novaEquipe.push(equipeBarbeiros[i]);
        }
    }
    equipeBarbeiros = novaEquipe;
    salvarEquipeBarbeirosLocal();

    var alterouAgendamentos = false;
    for (var k = 0; k < agendamentos.length; k++) {
        var nomeAg = agendamentos[k].barbeiro ? String(agendamentos[k].barbeiro).toLowerCase().trim() : "";
        for (var m = 0; m < nomesLegados.length; m++) {
            if (nomeAg == nomesLegados[m]) {
                agendamentos[k].barbeiro = "Gabriel Cavalheiro";
                alterouAgendamentos = true;
                break;
            }
        }
    }
    if (alterouAgendamentos) {
        salvarNoLocalStorage();
    }
}

function iniciar() {
    var acessoLiberado = verificarSessaoEAdaptarTela();
    if (!acessoLiberado) {
        return;
    }

    carregarEquipeBarbeirosLocal();

    var dadosSalvos = localStorage.getItem("agendamentos");
    var listaLida = null;

    if (dadosSalvos != null) {
        try {
            listaLida = JSON.parse(dadosSalvos);
        } catch (erro) {
            listaLida = null;
        }
    }

    if (Array.isArray(listaLida)) {
        agendamentos = listaLida;
        for (var i = 0; i < agendamentos.length; i++) {
            if (!agendamentos[i].pagamento) {
                agendamentos[i].pagamento = "Pix";
            }
        }
    } else {
        agendamentos = [];
        agendamentos.push({ id: 1, cliente: "Kauan Souza", servico: "Corte + Barba", barbeiro: "Gabriel Cavalheiro", data: "2026-10-20", hora: "14:30", pagamento: "Pix", status: "Confirmado" });
        agendamentos.push({ id: 2, cliente: "Pedro Santos", servico: "Corte Masculino", barbeiro: "Gabriel Cavalheiro", data: "2026-10-21", hora: "09:00", pagamento: "Cartão", status: "Pendente" });
        agendamentos.push({ id: 3, cliente: "Bryant Lima", servico: "Barba", barbeiro: "Gabriel Cavalheiro", data: "2026-10-21", hora: "11:30", pagamento: "Dinheiro", status: "Cancelado" });
        salvarNoLocalStorage();
    }

    limparBarbeirosLegadosInexistentes();

    carregarSelectServicos();
    carregarSelectBarbeiros();
    carregarSelectHorarios();
    mostrarEquipeBarbeiros();
    mostrarAgendamentos();

    if (window.location && window.location.hash == "#barbeiros" && usuarioLogado && usuarioLogado.perfil == "admin") {
        alternarAbaMenu("barbeiros");
    } else {
        alternarAbaMenu("agendamentos");
    }

    buscarBarbeirosDoBanco();
}

function carregarEquipeBarbeirosLocal() {
    var salvo = localStorage.getItem("equipeBarbeiros");
    var lista = null;
    if (salvo != null) {
        try {
            lista = JSON.parse(salvo);
        } catch (e) {
            lista = null;
        }
    }

    if (Array.isArray(lista)) {
        equipeBarbeiros = lista;
    } else {
        equipeBarbeiros = [];
    }

    salvarEquipeBarbeirosLocal();
}

function salvarEquipeBarbeirosLocal() {
    localStorage.setItem("equipeBarbeiros", JSON.stringify(equipeBarbeiros));

    var nomesAtivos = [];
    for (var i = 0; i < equipeBarbeiros.length; i++) {
        if (equipeBarbeiros[i].status == "Ativo") {
            adicionarBarbeiroSeNaoExistir(nomesAtivos, equipeBarbeiros[i].nome);
        }
    }
    barbeirosDoBanco = nomesAtivos;
    localStorage.setItem("barbeirosCadastrados", JSON.stringify(nomesAtivos));
}

function sincronizarMembroNaEquipe(membroNovo, sobrescreverStatus) {
    if (!membroNovo || !membroNovo.nome) return;
    var nomeLimpo = String(membroNovo.nome).trim();
    if (nomeLimpo == "") return;
    var emailLimpo = membroNovo.email ? String(membroNovo.email).trim() : "";

    var existente = null;
    for (var i = 0; i < equipeBarbeiros.length; i++) {
        var item = equipeBarbeiros[i];
        var mesmoEmail = (emailLimpo != "" && item.email && item.email.toLowerCase() == emailLimpo.toLowerCase());
        var mesmoNome = (item.nome && item.nome.toLowerCase() == nomeLimpo.toLowerCase());
        if (mesmoEmail || mesmoNome) {
            existente = item;
            break;
        }
    }

    if (existente != null) {
        existente.nome = nomeLimpo;
        if (emailLimpo != "") {
            existente.email = emailLimpo;
        }
        if (membroNovo.especialidade && (!existente.especialidade || sobrescreverStatus)) {
            existente.especialidade = membroNovo.especialidade;
        }
        if (sobrescreverStatus && membroNovo.status) {
            existente.status = membroNovo.status;
        }
    } else {
        var maiorId = 0;
        for (var j = 0; j < equipeBarbeiros.length; j++) {
            if (equipeBarbeiros[j].id > maiorId) {
                maiorId = equipeBarbeiros[j].id;
            }
        }
        equipeBarbeiros.push({
            id: membroNovo.id ? membroNovo.id : (maiorId + 1),
            nome: nomeLimpo,
            email: emailLimpo,
            especialidade: membroNovo.especialidade ? membroNovo.especialidade : "Corte e Barba",
            status: membroNovo.status ? membroNovo.status : "Ativo"
        });
    }
}

function salvarNoLocalStorage() {
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
}

function pegarClasseDoStatus(status) {
    if (status == "Confirmado" || status == "Ativo") {
        return "status_confirmado";
    }
    if (status == "Pendente") {
        return "status_pendente";
    }
    return "status_cancelado";
}

function formatarMoeda(valor) {
    var num = Number(valor);
    if (isNaN(num)) num = 0;
    return "R$ " + num.toFixed(2).replace(".", ",");
}

function obterListaServicos() {
    var dadosSalvos = localStorage.getItem("servicos");
    var listaLidaServicos = null;

    if (dadosSalvos != null) {
        try {
            listaLidaServicos = JSON.parse(dadosSalvos);
        } catch (erro) {
            listaLidaServicos = null;
        }
    }

    if (!Array.isArray(listaLidaServicos)) {
        var padrao = [
            { id: 1, nome: "Corte Masculino", descricao: "Corte com acabamento na tesoura e máquina", duracao: 30, preco: 35.00, status: "Ativo" },
            { id: 2, nome: "Barba", descricao: "Alinhamento com navalha e toalha quente", duracao: 25, preco: 25.00, status: "Ativo" },
            { id: 3, nome: "Corte + Barba", descricao: "Combo completo de cabelo e barba", duracao: 50, preco: 55.00, status: "Ativo" },
            { id: 4, nome: "Sobrancelha", descricao: "Limpeza e alinhamento na navalha", duracao: 15, preco: 15.00, status: "Ativo" },
            { id: 5, nome: "Nevou / Platinado", descricao: "Descoloração global e matização platinada", duracao: 90, preco: 120.00, status: "Ativo" }
        ];
        localStorage.setItem("servicos", JSON.stringify(padrao));
        return padrao;
    }

    return listaLidaServicos;
}

async function buscarBarbeirosDoBanco() {
    if (!supabaseClient) {
        return;
    }

    try {
        var resposta = await supabaseClient
            .from("usuarios")
            .select("id, nome, email, perfil");

        if (!resposta.error && Array.isArray(resposta.data)) {
            for (var i = 0; i < resposta.data.length; i++) {
                var usuario = resposta.data[i];
                var nomeProfissional = usuario.nome ? usuario.nome.trim() : "";
                if (nomeProfissional == "" && usuario.email) {
                    nomeProfissional = usuario.email.split("@")[0];
                }

                if (usuario.perfil == "barbeiro" && nomeProfissional != "") {
                    sincronizarMembroNaEquipe({
                        id: usuario.id,
                        nome: nomeProfissional,
                        email: usuario.email || "",
                        especialidade: "Corte e Barba",
                        status: "Ativo"
                    }, false);
                } else if (usuario.perfil == "candidato_barbeiro" && nomeProfissional != "") {
                    sincronizarMembroNaEquipe({
                        id: usuario.id,
                        nome: nomeProfissional,
                        email: usuario.email || "",
                        especialidade: "Corte e Barba",
                        status: "Pendente"
                    }, false);
                }
            }

            salvarEquipeBarbeirosLocal();

            var selectBarbeiro = document.getElementById("campoBarbeiro");
            var selecionadoAtual = selectBarbeiro ? selectBarbeiro.value : "";
            carregarSelectBarbeiros(selecionadoAtual);
            mostrarEquipeBarbeiros();
            atualizarTabelaRepasseBarbeiros();
            atualizarTabelaHorarios();
        }
    } catch (erro) {
    }
}

function obterListaBarbeiros() {
    var lista = [];

    for (var i = 0; i < equipeBarbeiros.length; i++) {
        if (equipeBarbeiros[i].status == "Ativo") {
            adicionarBarbeiroSeNaoExistir(lista, equipeBarbeiros[i].nome);
        }
    }

    for (var j = 0; j < barbeirosDoBanco.length; j++) {
        var nomeBanco = barbeirosDoBanco[j];
        var inativoLocal = false;
        for (var k = 0; k < equipeBarbeiros.length; k++) {
            if (equipeBarbeiros[k].nome.toLowerCase() == nomeBanco.toLowerCase() && equipeBarbeiros[k].status != "Ativo") {
                inativoLocal = true;
                break;
            }
        }
        if (!inativoLocal) {
            adicionarBarbeiroSeNaoExistir(lista, nomeBanco);
        }
    }

    if (usuarioLogado && usuarioLogado.perfil == "barbeiro" && usuarioLogado.nome) {
        adicionarBarbeiroSeNaoExistir(lista, usuarioLogado.nome);
    }

    return lista;
}

function adicionarBarbeiroSeNaoExistir(lista, nomeBarbeiro) {
    if (!nomeBarbeiro) return;
    var nomeLimpo = String(nomeBarbeiro).trim();
    if (nomeLimpo == "") return;

    var existe = false;
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].toLowerCase() == nomeLimpo.toLowerCase()) {
            existe = true;
            break;
        }
    }
    if (!existe) {
        lista.push(nomeLimpo);
    }
}

function mostrarEquipeBarbeiros() {
    var tabelaGestao = document.getElementById("tabelaGestaoBarbeiros");
    var corpoGestao = document.getElementById("corpoTabelaGestaoBarbeiros");
    var msgSemBarbeiros = document.getElementById("mensagemSemBarbeiros");

    if (!corpoGestao || !tabelaGestao) return;

    while (corpoGestao.rows.length > 0) {
        corpoGestao.deleteRow(0);
    }

    if (equipeBarbeiros.length == 0) {
        tabelaGestao.style.display = "none";
        if (msgSemBarbeiros) msgSemBarbeiros.style.display = "block";
        return;
    }

    tabelaGestao.style.display = "";
    if (msgSemBarbeiros) msgSemBarbeiros.style.display = "none";

    for (var i = 0; i < equipeBarbeiros.length; i++) {
        var membro = equipeBarbeiros[i];
        var linha = corpoGestao.insertRow();

        var celNome = linha.insertCell(0);
        celNome.innerText = membro.nome;
        celNome.setAttribute("data-label", "Profissional");

        var celEmail = linha.insertCell(1);
        celEmail.innerText = membro.email ? membro.email : "-";
        celEmail.setAttribute("data-label", "E-mail");

        var celEsp = linha.insertCell(2);
        celEsp.innerText = membro.especialidade ? membro.especialidade : "Corte e Barba";
        celEsp.setAttribute("data-label", "Especialidade");

        var celStatus = linha.insertCell(3);
        if (membro.status == "Ativo") {
            celStatus.innerText = "Barbeiro Ativo";
            celStatus.className = "status_confirmado";
        } else if (membro.status == "Pendente") {
            celStatus.innerText = "Pendente de Aprovação";
            celStatus.className = "status_pendente";
        } else {
            celStatus.innerText = "Inativo";
            celStatus.className = "status_cancelado";
        }
        celStatus.setAttribute("data-label", "Situação");

        var celAcoes = linha.insertCell(4);
        celAcoes.setAttribute("data-label", "Ações");

        if (membro.status == "Pendente") {
            var btnAprovar = document.createElement("button");
            btnAprovar.type = "button";
            btnAprovar.innerText = "Aprovar";
            btnAprovar.className = "btn_tabela btn_aprovar";
            btnAprovar.onclick = (function (idMembro) {
                return function () {
                    aprovarCandidatoBarbeiro(idMembro);
                };
            })(membro.id);
            celAcoes.appendChild(btnAprovar);
        }

        var btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.innerText = "Editar";
        btnEditar.className = "btn_tabela";
        btnEditar.onclick = (function (idMembro) {
            return function () {
                abrirFormularioBarbeiroEdicao(idMembro);
            };
        })(membro.id);
        celAcoes.appendChild(btnEditar);

        if (membro.status != "Inativo") {
            var btnDesativar = document.createElement("button");
            btnDesativar.type = "button";
            btnDesativar.innerText = membro.status == "Pendente" ? "Recusar" : "Desativar";
            btnDesativar.className = "btn_tabela btn_excluir";
            btnDesativar.onclick = (function (idMembro) {
                return function () {
                    desativarBarbeiroAdmin(idMembro);
                };
            })(membro.id);
            celAcoes.appendChild(btnDesativar);
        }
    }
}

function abrirFormularioBarbeiroNovo() {
    if (!usuarioLogado || usuarioLogado.perfil != "admin") return;

    idBarbeiroSendoEditado = null;
    var erroEl = document.getElementById("mensagemErroBarbeiro");
    if (erroEl) erroEl.hidden = true;

    document.getElementById("tituloFormularioBarbeiro").innerText = "Cadastrar Novo Barbeiro";
    document.getElementById("campoNomeBarbeiro").value = "";
    document.getElementById("campoEmailBarbeiro").value = "";
    document.getElementById("campoEspecialidadeBarbeiro").value = "";
    document.getElementById("campoStatusBarbeiro").value = "Ativo";
    document.getElementById("caixaFormularioBarbeiro").style.display = "flex";
}

function abrirFormularioBarbeiroEdicao(idMembro) {
    if (!usuarioLogado || usuarioLogado.perfil != "admin") return;

    var membro = null;
    for (var i = 0; i < equipeBarbeiros.length; i++) {
        if (equipeBarbeiros[i].id == idMembro) {
            membro = equipeBarbeiros[i];
            break;
        }
    }
    if (!membro) return;

    idBarbeiroSendoEditado = idMembro;
    var erroEl = document.getElementById("mensagemErroBarbeiro");
    if (erroEl) erroEl.hidden = true;

    document.getElementById("tituloFormularioBarbeiro").innerText = "Editar Profissional da Equipe";
    document.getElementById("campoNomeBarbeiro").value = membro.nome;
    document.getElementById("campoEmailBarbeiro").value = membro.email || "";
    document.getElementById("campoEspecialidadeBarbeiro").value = membro.especialidade || "Corte e Barba";
    document.getElementById("campoStatusBarbeiro").value = membro.status || "Ativo";
    document.getElementById("caixaFormularioBarbeiro").style.display = "flex";
}

function fecharFormularioBarbeiro() {
    idBarbeiroSendoEditado = null;
    var erroEl = document.getElementById("mensagemErroBarbeiro");
    if (erroEl) erroEl.hidden = true;
    var caixa = document.getElementById("caixaFormularioBarbeiro");
    if (caixa) caixa.style.display = "none";
}

async function sincronizarPerfilBarbeiroNoSupabase(nomeProfissional, emailProfissional, statusEquipe) {
    if (!supabaseClient || !emailProfissional) return;
    var novoPerfil = statusEquipe == "Ativo" ? "barbeiro" : "cliente";

    try {
        await supabaseClient
            .from("usuarios")
            .update({ nome: nomeProfissional, perfil: novoPerfil })
            .eq("email", emailProfissional);
    } catch (e) {
    }
}

function salvarBarbeiroAdmin() {
    if (!usuarioLogado || usuarioLogado.perfil != "admin") return;

    var nome = document.getElementById("campoNomeBarbeiro").value.trim();
    var email = document.getElementById("campoEmailBarbeiro").value.trim();
    var especialidade = document.getElementById("campoEspecialidadeBarbeiro").value.trim();
    var status = document.getElementById("campoStatusBarbeiro").value;
    var erroEl = document.getElementById("mensagemErroBarbeiro");

    if (nome == "") {
        if (erroEl) {
            erroEl.innerText = "Informe o nome do barbeiro.";
            erroEl.hidden = false;
        }
        return;
    }

    if (email != "" && (email.indexOf("@") == -1 || email.indexOf(".") == -1)) {
        if (erroEl) {
            erroEl.innerText = "Informe um e-mail válido para o barbeiro.";
            erroEl.hidden = false;
        }
        return;
    }

    if (especialidade == "") {
        especialidade = "Corte e Barba";
    }

    if (idBarbeiroSendoEditado == null) {
        var maiorId = 0;
        for (var i = 0; i < equipeBarbeiros.length; i++) {
            if (equipeBarbeiros[i].id > maiorId) {
                maiorId = equipeBarbeiros[i].id;
            }
        }
        equipeBarbeiros.push({
            id: maiorId + 1,
            nome: nome,
            email: email,
            especialidade: especialidade,
            status: status
        });
    } else {
        for (var j = 0; j < equipeBarbeiros.length; j++) {
            if (equipeBarbeiros[j].id == idBarbeiroSendoEditado) {
                var nomeAntigo = equipeBarbeiros[j].nome;
                equipeBarbeiros[j].nome = nome;
                equipeBarbeiros[j].email = email;
                equipeBarbeiros[j].especialidade = especialidade;
                equipeBarbeiros[j].status = status;

                if (nomeAntigo && nomeAntigo != nome) {
                    for (var a = 0; a < agendamentos.length; a++) {
                        if (agendamentos[a].barbeiro.toLowerCase() == nomeAntigo.toLowerCase()) {
                            agendamentos[a].barbeiro = nome;
                        }
                    }
                    salvarNoLocalStorage();
                }
                break;
            }
        }
    }

    salvarEquipeBarbeirosLocal();
    sincronizarPerfilBarbeiroNoSupabase(nome, email, status);

    carregarSelectBarbeiros();
    mostrarEquipeBarbeiros();
    mostrarAgendamentos();
    fecharFormularioBarbeiro();
}

function aprovarCandidatoBarbeiro(idMembro) {
    if (!usuarioLogado || usuarioLogado.perfil != "admin") return;

    for (var i = 0; i < equipeBarbeiros.length; i++) {
        if (equipeBarbeiros[i].id == idMembro) {
            equipeBarbeiros[i].status = "Ativo";
            sincronizarPerfilBarbeiroNoSupabase(equipeBarbeiros[i].nome, equipeBarbeiros[i].email, "Ativo");
            break;
        }
    }

    salvarEquipeBarbeirosLocal();
    carregarSelectBarbeiros();
    mostrarEquipeBarbeiros();
    atualizarMetricas();
}

function desativarBarbeiroAdmin(idMembro) {
    if (!usuarioLogado || usuarioLogado.perfil != "admin") return;

    for (var i = 0; i < equipeBarbeiros.length; i++) {
        if (equipeBarbeiros[i].id == idMembro) {
            equipeBarbeiros[i].status = "Inativo";
            sincronizarPerfilBarbeiroNoSupabase(equipeBarbeiros[i].nome, equipeBarbeiros[i].email, "Inativo");
            break;
        }
    }

    salvarEquipeBarbeirosLocal();
    carregarSelectBarbeiros();
    mostrarEquipeBarbeiros();
    atualizarMetricas();
}

function carregarSelectBarbeiros(barbeiroSelecionado) {
    var select = document.getElementById("campoBarbeiro");
    if (!select) return;

    select.innerHTML = "";

    var listaBarbeiros = obterListaBarbeiros();
    var achou = false;

    if (listaBarbeiros.length == 0 && !barbeiroSelecionado) {
        var opcaoVazia = document.createElement("option");
        opcaoVazia.value = "";
        opcaoVazia.innerText = "Selecione um barbeiro cadastrado";
        select.appendChild(opcaoVazia);
        return;
    }

    for (var i = 0; i < listaBarbeiros.length; i++) {
        var nome = listaBarbeiros[i];
        var opcao = document.createElement("option");
        opcao.value = nome;
        opcao.innerText = nome;
        if (barbeiroSelecionado && nome.toLowerCase() == barbeiroSelecionado.toLowerCase()) {
            opcao.selected = true;
            achou = true;
        }
        select.appendChild(opcao);
    }

    if (barbeiroSelecionado && !achou) {
        var opcaoExtra = document.createElement("option");
        opcaoExtra.value = barbeiroSelecionado;
        opcaoExtra.innerText = barbeiroSelecionado;
        opcaoExtra.selected = true;
        select.appendChild(opcaoExtra);
    }
}

function carregarSelectHorarios(horaSelecionada) {
    var select = document.getElementById("campoHora");
    if (!select) return;

    select.innerHTML = "";

    var opcaoVazia = document.createElement("option");
    opcaoVazia.value = "";
    opcaoVazia.innerText = "Selecione um horário (09:00 às 18:00)";
    select.appendChild(opcaoVazia);

    var achou = false;

    for (var i = 0; i < HORARIOS_COMERCIAIS.length; i++) {
        var h = HORARIOS_COMERCIAIS[i];
        var opcao = document.createElement("option");
        opcao.value = h;
        opcao.innerText = h;
        if (horaSelecionada && h == horaSelecionada) {
            opcao.selected = true;
            achou = true;
        }
        select.appendChild(opcao);
    }

    if (horaSelecionada && !achou) {
        var opcaoLegada = document.createElement("option");
        opcaoLegada.value = horaSelecionada;
        opcaoLegada.innerText = horaSelecionada;
        opcaoLegada.selected = true;
        select.appendChild(opcaoLegada);
    }
}

function atualizarTabelaHorarios() {
    var corpoHorarios = document.getElementById("corpoTabelaHorarios");
    if (!corpoHorarios) return;

    while (corpoHorarios.rows.length > 0) {
        corpoHorarios.deleteRow(0);
    }

    var barbeiro = document.getElementById("campoBarbeiro").value;
    var data = document.getElementById("campoData").value;
    var horaAtual = document.getElementById("campoHora").value;

    var colunasPorLinha = 4;
    var linhaAtual = null;

    for (var i = 0; i < HORARIOS_COMERCIAIS.length; i++) {
        if (i % colunasPorLinha == 0) {
            linhaAtual = corpoHorarios.insertRow();
        }

        var horario = HORARIOS_COMERCIAIS[i];
        var celula = linhaAtual.insertCell();

        var ocupado = false;
        if (barbeiro != "" && data != "") {
            ocupado = existeConflitoDeHorario(barbeiro, data, horario, idSendoEditado);
        }

        var botaoHorario = document.createElement("button");
        botaoHorario.type = "button";
        botaoHorario.className = "btn_horario";

        if (ocupado) {
            botaoHorario.innerText = horario + " (Ocupado)";
            botaoHorario.className = "btn_horario horario_ocupado";
            botaoHorario.disabled = true;
        } else {
            botaoHorario.innerText = horario;
            if (horario == horaAtual) {
                botaoHorario.className = "btn_horario horario_selecionado";
            }
            botaoHorario.onclick = (function (horaClicada) {
                return function () {
                    selecionarHorarioNaTabela(horaClicada);
                };
            })(horario);
        }

        celula.appendChild(botaoHorario);
    }
}

function selecionarHorarioNaTabela(horario) {
    var selectHora = document.getElementById("campoHora");
    if (selectHora) {
        selectHora.value = horario;
    }
    atualizarTabelaHorarios();
}

function destacarHorarioSelecionado() {
    atualizarTabelaHorarios();
}

function pegarPrecoDoServico(nomeServico) {
    var listaServicos = obterListaServicos();
    for (var i = 0; i < listaServicos.length; i++) {
        if (listaServicos[i].nome == nomeServico) {
            var valor = Number(listaServicos[i].preco);
            if (!isNaN(valor)) {
                return valor;
            }
        }
    }
    return 0;
}

function atualizarTabelaRepasseBarbeiros() {
    var corpoBarbeiros = document.getElementById("corpoTabelaBarbeiros");
    if (!corpoBarbeiros) return;

    while (corpoBarbeiros.rows.length > 0) {
        corpoBarbeiros.deleteRow(0);
    }

    var resumoPorBarbeiro = [];
    var barbeirosConhecidos = obterListaBarbeiros();

    for (var bIdx = 0; bIdx < barbeirosConhecidos.length; bIdx++) {
        resumoPorBarbeiro.push({
            barbeiro: barbeirosConhecidos[bIdx],
            cortesConfirmados: 0,
            totalBruto: 0
        });
    }

    for (var i = 0; i < agendamentos.length; i++) {
        var ag = agendamentos[i];
        var nomeBarb = ag.barbeiro;

        var itemBarbeiro = null;
        for (var j = 0; j < resumoPorBarbeiro.length; j++) {
            if (resumoPorBarbeiro[j].barbeiro.toLowerCase() == nomeBarb.toLowerCase()) {
                itemBarbeiro = resumoPorBarbeiro[j];
                break;
            }
        }

        if (itemBarbeiro != null && ag.status == "Confirmado") {
            itemBarbeiro.cortesConfirmados = itemBarbeiro.cortesConfirmados + 1;
            itemBarbeiro.totalBruto = itemBarbeiro.totalBruto + pegarPrecoDoServico(ag.servico);
        }
    }

    for (var k = 0; k < resumoPorBarbeiro.length; k++) {
        var b = resumoPorBarbeiro[k];
        var ganhoBarbeiro = b.totalBruto * PERCENTUAL_BARBEIRO;
        var parteSalao = b.totalBruto * PERCENTUAL_SALAO;

        var linha = corpoBarbeiros.insertRow();

        var celNome = linha.insertCell(0);
        celNome.innerText = b.barbeiro;
        celNome.setAttribute("data-label", "Barbeiro");

        var celQtd = linha.insertCell(1);
        celQtd.innerText = b.cortesConfirmados;
        celQtd.setAttribute("data-label", "Cortes Confirmados");

        var celBruto = linha.insertCell(2);
        celBruto.innerText = formatarMoeda(b.totalBruto);
        celBruto.setAttribute("data-label", "Total Bruto (100%)");

        var celComissao = linha.insertCell(3);
        celComissao.innerText = formatarMoeda(ganhoBarbeiro);
        celComissao.className = "status_confirmado";
        celComissao.setAttribute("data-label", "Comissão Barbeiro (70%)");

        var celSalao = linha.insertCell(4);
        celSalao.innerText = formatarMoeda(parteSalao);
        celSalao.setAttribute("data-label", "Parte do Salão (30%)");
    }
}

function atualizarMetricas() {
    var faturamentoTotal = 0;
    var qtdConfirmados = 0;
    var qtdPendentes = 0;
    var qtdCancelados = 0;
    var totalAtendimentosConsiderados = 0;

    for (var i = 0; i < agendamentos.length; i++) {
        var ag = agendamentos[i];

        if (usuarioLogado && usuarioLogado.perfil == "barbeiro") {
            if (ag.barbeiro.toLowerCase() != usuarioLogado.nome.toLowerCase()) {
                continue;
            }
        }

        totalAtendimentosConsiderados = totalAtendimentosConsiderados + 1;

        if (ag.status == "Confirmado") {
            qtdConfirmados = qtdConfirmados + 1;
            faturamentoTotal = faturamentoTotal + pegarPrecoDoServico(ag.servico);
        } else if (ag.status == "Pendente") {
            qtdPendentes = qtdPendentes + 1;
        } else if (ag.status == "Cancelado") {
            qtdCancelados = qtdCancelados + 1;
        }
    }

    var valorSalao30 = faturamentoTotal * PERCENTUAL_SALAO;
    var valorBarbeiro70 = faturamentoTotal * PERCENTUAL_BARBEIRO;

    var taxaConversao = 0;
    var taxaCancelamento = 0;

    if (totalAtendimentosConsiderados > 0) {
        taxaConversao = Math.round((qtdConfirmados / totalAtendimentosConsiderados) * 100);
        taxaCancelamento = Math.round((qtdCancelados / totalAtendimentosConsiderados) * 100);
    }

    var elRotuloFat = document.getElementById("rotuloFaturamento");
    var elFaturamento = document.getElementById("valorFaturamento");
    var elRotuloDivisao = document.getElementById("rotuloDivisao");
    var elParteSalao = document.getElementById("valorParteSalao");
    var elDetalheRepasse = document.getElementById("detalheRepasseBarbeiro");
    var elConversao = document.getElementById("valorConversao");
    var elCancelamento = document.getElementById("detalheCancelamento");
    var elConfirmados = document.getElementById("qtdConfirmados");
    var elPendentes = document.getElementById("qtdPendentes");
    var elCancelados = document.getElementById("qtdCancelados");

    if (elFaturamento) {
        elFaturamento.innerText = formatarMoeda(faturamentoTotal);
    }

    if (usuarioLogado && usuarioLogado.perfil == "barbeiro") {
        if (elRotuloFat) elRotuloFat.innerText = "Minha Produção Bruta (100%)";
        if (elRotuloDivisao) elRotuloDivisao.innerText = "Meu Ganho Líquido (70%)";
        if (elParteSalao) elParteSalao.innerText = formatarMoeda(valorBarbeiro70);
        if (elDetalheRepasse) elDetalheRepasse.innerText = "Repasse ao Salão (30%): " + formatarMoeda(valorSalao30);
    } else {
        if (elRotuloFat) elRotuloFat.innerText = "Faturamento Bruto (100%)";
        if (elRotuloDivisao) elRotuloDivisao.innerText = "Receita do Salão (30%)";
        if (elParteSalao) elParteSalao.innerText = formatarMoeda(valorSalao30);
        if (elDetalheRepasse) elDetalheRepasse.innerText = "Comissão Barbeiros (70%): " + formatarMoeda(valorBarbeiro70);
    }

    if (elConversao) {
        elConversao.innerText = taxaConversao + "%";
    }
    if (elCancelamento) {
        elCancelamento.innerText = "Cancelamento: " + taxaCancelamento + "%";
    }
    if (elConfirmados) {
        elConfirmados.innerText = qtdConfirmados;
    }
    if (elPendentes) {
        elPendentes.innerText = qtdPendentes;
    }
    if (elCancelados) {
        elCancelados.innerText = qtdCancelados;
    }

    atualizarTabelaRepasseBarbeiros();
}

function mostrarAgendamentos() {
    var tabela = document.getElementById("tabela");
    var corpoTabela = document.getElementById("corpoTabela");
    var textoBusca = document.getElementById("busca").value;
    textoBusca = textoBusca.toLowerCase();

    while (corpoTabela.rows.length > 0) {
        corpoTabela.deleteRow(0);
    }

    var quantidadeMostrada = 0;

    for (var i = 0; i < agendamentos.length; i++) {
        var ag = agendamentos[i];

        if (usuarioLogado && usuarioLogado.perfil == "barbeiro") {
            if (ag.barbeiro.toLowerCase() != usuarioLogado.nome.toLowerCase()) {
                continue;
            }
        } else if (usuarioLogado && usuarioLogado.perfil == "cliente") {
            if (ag.cliente.toLowerCase() != usuarioLogado.nome.toLowerCase()) {
                continue;
            }
        }

        var nomeClienteMinusculo = ag.cliente.toLowerCase();
        if (textoBusca != "" && nomeClienteMinusculo.indexOf(textoBusca) == -1) {
            continue;
        }

        var linha = corpoTabela.insertRow();

        var celulaCliente = linha.insertCell(0);
        celulaCliente.innerText = ag.cliente;
        celulaCliente.setAttribute("data-label", "Cliente");

        var precoServico = pegarPrecoDoServico(ag.servico);
        var celulaServico = linha.insertCell(1);
        celulaServico.innerText = ag.servico + " (" + formatarMoeda(precoServico) + ")";
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

        var celulaPagamento = linha.insertCell(5);
        celulaPagamento.innerText = ag.pagamento ? ag.pagamento : "Pix";
        celulaPagamento.setAttribute("data-label", "Pagamento");

        var celulaStatus = linha.insertCell(6);
        celulaStatus.innerText = ag.status;
        celulaStatus.className = pegarClasseDoStatus(ag.status);
        celulaStatus.setAttribute("data-label", "Status");

        var celulaAcoes = linha.insertCell(7);
        celulaAcoes.setAttribute("data-label", "Ações");

        if (usuarioLogado && usuarioLogado.perfil == "cliente") {
            if (ag.status != "Cancelado") {
                var botaoCancelar = document.createElement("button");
                botaoCancelar.innerText = "Cancelar";
                botaoCancelar.className = "btn_tabela btn_excluir";
                botaoCancelar.onclick = function (idClicado) {
                    return function () {
                        cancelarAgendamentoCliente(idClicado);
                    };
                }(ag.id);
                celulaAcoes.appendChild(botaoCancelar);
            } else {
                celulaAcoes.innerText = "-";
            }
        } else {
            var botaoEditar = document.createElement("button");
            botaoEditar.innerText = "Editar";
            botaoEditar.className = "btn_tabela";
            botaoEditar.onclick = function (idClicado) {
                return function () {
                    abrirFormularioEdicao(idClicado);
                };
            }(ag.id);
            celulaAcoes.appendChild(botaoEditar);

            if (!usuarioLogado || usuarioLogado.perfil == "admin") {
                var botaoExcluir = document.createElement("button");
                botaoExcluir.innerText = "Excluir";
                botaoExcluir.className = "btn_tabela btn_excluir";
                botaoExcluir.onclick = function (idClicado) {
                    return function () {
                        excluirAgendamento(idClicado);
                    };
                }(ag.id);
                celulaAcoes.appendChild(botaoExcluir);
            }
        }

        quantidadeMostrada = quantidadeMostrada + 1;
    }

    if (quantidadeMostrada == 0) {
        document.getElementById("mensagemVazia").style.display = "block";
        tabela.style.display = "none";
    } else {
        document.getElementById("mensagemVazia").style.display = "none";
        tabela.style.display = "";
    }

    atualizarMetricas();
}

function carregarSelectServicos(servicoSelecionado) {
    var select = document.getElementById("campoServico");
    if (!select) return;

    select.innerHTML = "";

    var listaServicos = obterListaServicos();
    var achouSelecionado = false;

    for (var i = 0; i < listaServicos.length; i++) {
        var s = listaServicos[i];
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

    if (servicoSelecionado && !achouSelecionado) {
        var opcaoExtra = document.createElement("option");
        opcaoExtra.value = servicoSelecionado;
        opcaoExtra.innerText = servicoSelecionado;
        opcaoExtra.selected = true;
        select.appendChild(opcaoExtra);
    }
}

function abrirFormularioNovo() {
    idSendoEditado = null;
    limparErroFormulario();

    carregarSelectServicos();
    carregarSelectBarbeiros();
    carregarSelectHorarios();
    buscarBarbeirosDoBanco();

    var campoCliente = document.getElementById("campoCliente");
    var campoBarbeiro = document.getElementById("campoBarbeiro");
    var campoPagamento = document.getElementById("campoPagamento");
    var campoStatus = document.getElementById("campoStatus");

    document.getElementById("tituloFormulario").innerText = "Novo Agendamento";
    campoCliente.value = "";
    document.getElementById("campoData").value = "";
    document.getElementById("campoHora").value = "";
    campoPagamento.value = "Pix";
    campoStatus.value = "Confirmado";

    campoCliente.disabled = false;
    campoBarbeiro.disabled = false;
    campoStatus.disabled = false;

    if (usuarioLogado && usuarioLogado.perfil == "barbeiro") {
        carregarSelectBarbeiros(usuarioLogado.nome);
        campoBarbeiro.disabled = true;
        campoStatus.value = "Pendente";
        campoStatus.disabled = true;
    } else if (usuarioLogado && usuarioLogado.perfil == "cliente") {
        campoCliente.value = usuarioLogado.nome;
        campoCliente.disabled = true;
        campoStatus.value = "Pendente";
        campoStatus.disabled = true;
    }

    atualizarTabelaHorarios();
    document.getElementById("caixaFormulario").style.display = "block";
}

function abrirFormularioEdicao(id) {
    if (usuarioLogado && usuarioLogado.perfil == "cliente") {
        return;
    }

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
    carregarSelectBarbeiros(agendamento.barbeiro);
    carregarSelectHorarios(agendamento.hora);

    var campoCliente = document.getElementById("campoCliente");
    var campoBarbeiro = document.getElementById("campoBarbeiro");
    var campoPagamento = document.getElementById("campoPagamento");
    var campoStatus = document.getElementById("campoStatus");

    document.getElementById("tituloFormulario").innerText = "Editar Agendamento";
    campoCliente.value = agendamento.cliente;
    document.getElementById("campoData").value = agendamento.data;
    campoPagamento.value = agendamento.pagamento ? agendamento.pagamento : "Pix";
    campoStatus.value = agendamento.status;

    campoCliente.disabled = false;
    campoBarbeiro.disabled = false;
    campoStatus.disabled = false;

    if (usuarioLogado && usuarioLogado.perfil == "barbeiro") {
        campoBarbeiro.disabled = true;
    }

    atualizarTabelaHorarios();
    document.getElementById("caixaFormulario").style.display = "block";
}

function fecharFormulario() {
    limparErroFormulario();
    document.getElementById("caixaFormulario").style.display = "none";
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
    document.getElementById("mensagemErro").hidden = true;

    var campos = document.querySelectorAll("#caixaFormulario .input_invalido");
    for (var i = 0; i < campos.length; i++) {
        campos[i].classList.remove("input_invalido");
        campos[i].removeAttribute("aria-invalid");
    }
}

function existeConflitoDeHorario(barbeiro, data, hora, idIgnorado) {
    for (var i = 0; i < agendamentos.length; i++) {
        var outro = agendamentos[i];

        if (outro.id == idIgnorado) {
            continue;
        }
        if (outro.status == "Cancelado") {
            continue;
        }
        if (outro.barbeiro.toLowerCase() == barbeiro.toLowerCase() && outro.data == data && outro.hora == hora) {
            return true;
        }
    }
    return false;
}

function salvarAgendamento() {
    var cliente = document.getElementById("campoCliente").value.trim();
    var servico = document.getElementById("campoServico").value;
    var barbeiro = document.getElementById("campoBarbeiro").value.trim();
    var data = document.getElementById("campoData").value;
    var hora = document.getElementById("campoHora").value;
    var pagamento = document.getElementById("campoPagamento").value;
    var status = document.getElementById("campoStatus").value;

    if (usuarioLogado && usuarioLogado.perfil == "cliente") {
        cliente = usuarioLogado.nome;
        status = "Pendente";
    } else if (usuarioLogado && usuarioLogado.perfil == "barbeiro") {
        barbeiro = usuarioLogado.nome;
        if (idSendoEditado == null) {
            status = "Pendente";
        }
    }

    if (cliente == "") {
        mostrarErroFormulario("Informe o nome do cliente.", "campoCliente");
        return;
    }
    if (barbeiro == "") {
        mostrarErroFormulario("Escolha o barbeiro do atendimento.", "campoBarbeiro");
        return;
    }
    if (data == "") {
        mostrarErroFormulario("Escolha a data do agendamento.", "campoData");
        return;
    }
    if (hora == "") {
        mostrarErroFormulario("Escolha um horário comercial entre 09:00 e 18:00.", "campoHora");
        return;
    }

    if (status != "Cancelado" && existeConflitoDeHorario(barbeiro, data, hora, idSendoEditado)) {
        mostrarErroFormulario("Este barbeiro já tem um agendamento nesse dia e horário. Escolha outro horário.", "campoHora");
        return;
    }

    if (idSendoEditado == null) {
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
            pagamento: pagamento,
            status: status
        };

        agendamentos.push(novoAgendamento);

    } else {
        for (var j = 0; j < agendamentos.length; j++) {
            if (agendamentos[j].id == idSendoEditado) {
                agendamentos[j].cliente = cliente;
                agendamentos[j].servico = servico;
                agendamentos[j].barbeiro = barbeiro;
                agendamentos[j].data = data;
                agendamentos[j].hora = hora;
                agendamentos[j].pagamento = pagamento;
                agendamentos[j].status = status;
            }
        }
    }

    salvarNoLocalStorage();
    mostrarAgendamentos();
    fecharFormulario();
}

function cancelarAgendamentoCliente(id) {
    var confirmou = confirm("Tem certeza que deseja cancelar este agendamento?");
    if (confirmou == false) {
        return;
    }

    for (var i = 0; i < agendamentos.length; i++) {
        if (agendamentos[i].id == id) {
            agendamentos[i].status = "Cancelado";
        }
    }

    salvarNoLocalStorage();
    mostrarAgendamentos();
}

function excluirAgendamento(id) {
    if (usuarioLogado && usuarioLogado.perfil != "admin") {
        return;
    }

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

function sair() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "../app/login.html";
}

iniciar();
