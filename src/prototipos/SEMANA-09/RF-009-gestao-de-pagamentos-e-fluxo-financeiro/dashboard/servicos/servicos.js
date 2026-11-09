/**
 * BarberFlow - Catálogo de Serviços (SEMANA-09 / RF-009)
 * Conformidade com Protocolo v14.3
 * RBAC Estrito: Leitura para Barbeiro e Cliente; CRUD Completo para Administrador
 */

let servicos = [];
let idSendoEditado = null;
let usuarioLogado = null;

document.addEventListener("DOMContentLoaded", () => {
    iniciar();
});

function verificarSessaoEAdaptarTela() {
    const sessaoSalva = sessionStorage.getItem("usuarioLogado");

    if (sessaoSalva) {
        try {
            usuarioLogado = JSON.parse(sessaoSalva);
        } catch (e) {
            usuarioLogado = null;
        }
    }

    if (!usuarioLogado || !usuarioLogado.perfil) {
        window.location.href = "../../app/login.html";
        return false;
    }

    const infoUsuario = document.getElementById("infoUsuario");
    if (infoUsuario) {
        const nomePerfil = (usuarioLogado.perfil === "admin") ? "Administrador" :
                           (usuarioLogado.perfil === "barbeiro" ? "Barbeiro" : "Cliente");
        infoUsuario.textContent = `${usuarioLogado.nome} (${nomePerfil})`;
    }

    const botaoNovo = document.getElementById("botaoNovo");
    const colunaAcoes = document.getElementById("colunaAcoes");
    const linkBarbeiros = document.getElementById("linkBarbeiros");

    // Barbeiro e Cliente têm acesso em MODO LEITURA no Catálogo
    if (usuarioLogado.perfil === "barbeiro" || usuarioLogado.perfil === "cliente") {
        if (botaoNovo) botaoNovo.style.display = "none";
        if (colunaAcoes) colunaAcoes.style.display = "none";
        if (linkBarbeiros) linkBarbeiros.style.display = "none";
    } else if (usuarioLogado.perfil === "admin") {
        if (botaoNovo) botaoNovo.style.display = "inline-block";
        if (colunaAcoes) colunaAcoes.style.display = "table-cell";
        if (linkBarbeiros) linkBarbeiros.style.display = "inline-block";
    }

    return true;
}

function iniciar() {
    if (!verificarSessaoEAdaptarTela()) return;

    const dadosSalvos = localStorage.getItem("servicos");
    if (dadosSalvos) {
        try {
            servicos = JSON.parse(dadosSalvos);
        } catch (e) {
            servicos = [];
        }
    }

    if (!Array.isArray(servicos) || servicos.length === 0) {
        servicos = [
            { id: 1, nome: "Corte Degradê", descricao: "Acabamento na máquina e tesoura", duracao: 30, preco: 45.00, status: "Ativo" },
            { id: 2, nome: "Barba Completa", descricao: "Toalha quente e navalha", duracao: 30, preco: 35.00, status: "Ativo" },
            { id: 3, Combo: "Combo Corte + Barba", nome: "Combo Corte + Barba", descricao: "Serviço completo premium", duracao: 60, preco: 70.00, status: "Ativo" },
            { id: 4, nome: "Platinado / Nevou", descricao: "Descoloração global e matização", duracao: 90, preco: 120.00, status: "Ativo" }
        ];
        salvarNoLocalStorage();
    }

    mostrarServicos();
}

function salvarNoLocalStorage() {
    localStorage.setItem("servicos", JSON.stringify(servicos));
}

function mostrarServicos() {
    const corpoTabela = document.getElementById("corpoTabela");
    const mensagemVazia = document.getElementById("mensagemVazia");
    const campoBusca = document.getElementById("busca");
    const termo = campoBusca ? campoBusca.value.toLowerCase().trim() : "";

    if (!corpoTabela) return;
    corpoTabela.innerHTML = "";

    const filtrados = servicos.filter(s =>
        s.nome.toLowerCase().includes(termo) ||
        (s.descricao && s.descricao.toLowerCase().includes(termo))
    );

    if (filtrados.length === 0) {
        if (mensagemVazia) mensagemVazia.style.display = "block";
        return;
    } else {
        if (mensagemVazia) mensagemVazia.style.display = "none";
    }

    const podeEditar = usuarioLogado && usuarioLogado.perfil === "admin";

    filtrados.forEach(s => {
        const tr = document.createElement("tr");

        let acoesHtml = "";
        if (podeEditar) {
            acoesHtml = `
                <button class="btn_tabela btn_editar" onclick="editarServico(${s.id})">Editar</button>
                <button class="btn_tabela btn_excluir" onclick="removerServico(${s.id})">Excluir</button>
            `;
        }

        tr.innerHTML = `
            <td data-label="Serviço"><strong>${s.nome}</strong></td>
            <td data-label="Descrição">${s.descricao || "-"}</td>
            <td data-label="Duração">${s.duracao} min</td>
            <td data-label="Preço (R$)"><strong>${formatarMoeda(s.preco)}</strong></td>
            <td data-label="Situação">
                <span class="badge_status ${s.status === 'Ativo' ? 'badge_ativo' : 'badge_inativo'}">${s.status}</span>
            </td>
            ${podeEditar ? `<td data-label="Ações" class="coluna_acoes">${acoesHtml}</td>` : ''}
        `;

        corpoTabela.appendChild(tr);
    });
}

function abrirFormularioNovo() {
    idSendoEditado = null;
    document.getElementById("tituloFormulario").textContent = "Novo Serviço";
    limparFormulario();
    document.getElementById("caixaFormulario").style.display = "block";
}

function fecharFormulario() {
    document.getElementById("caixaFormulario").style.display = "none";
    limparFormulario();
}

function limparFormulario() {
    document.getElementById("campoNome").value = "";
    document.getElementById("campoDescricao").value = "";
    document.getElementById("campoDuracao").value = "";
    document.getElementById("campoPreco").value = "";
    document.getElementById("campoStatus").value = "Ativo";
    ocultarErro();
}

function editarServico(id) {
    const s = servicos.find(item => item.id === id);
    if (!s) return;

    idSendoEditado = id;
    document.getElementById("tituloFormulario").textContent = "Editar Serviço";
    document.getElementById("campoNome").value = s.nome;
    document.getElementById("campoDescricao").value = s.descricao || "";
    document.getElementById("campoDuracao").value = s.duracao;
    document.getElementById("campoPreco").value = s.preco;
    document.getElementById("campoStatus").value = s.status;

    ocultarErro();
    document.getElementById("caixaFormulario").style.display = "block";
}

function salvarServico() {
    const nome = document.getElementById("campoNome").value.trim();
    const descricao = document.getElementById("campoDescricao").value.trim();
    const duracao = parseInt(document.getElementById("campoDuracao").value, 10);
    const preco = parseFloat(document.getElementById("campoPreco").value);
    const status = document.getElementById("campoStatus").value;

    if (!nome) {
        exibirErro("Por favor, preencha o nome do serviço.");
        return;
    }
    if (isNaN(duracao) || duracao <= 0) {
        exibirErro("A duração deve ser um número maior que zero.");
        return;
    }
    if (isNaN(preco) || preco < 0) {
        exibirErro("O preço deve ser um valor válido (ex: 35.00).");
        return;
    }

    if (idSendoEditado !== null) {
        const index = servicos.findIndex(s => s.id === idSendoEditado);
        if (index !== -1) {
            servicos[index].nome = nome;
            servicos[index].descricao = descricao;
            servicos[index].duracao = duracao;
            servicos[index].preco = preco;
            servicos[index].status = status;
        }
    } else {
        servicos.push({
            id: Date.now(),
            nome: nome,
            descricao: descricao,
            duracao: duracao,
            preco: preco,
            status: status
        });
    }

    salvarNoLocalStorage();
    fecharFormulario();
    mostrarServicos();
}

function removerServico(id) {
    servicos = servicos.filter(s => s.id !== id);
    salvarNoLocalStorage();
    mostrarServicos();
}

function exibirErro(msg) {
    const el = document.getElementById("mensagemErro");
    if (el) {
        el.textContent = msg;
        el.style.display = "block";
    }
}

function ocultarErro() {
    const el = document.getElementById("mensagemErro");
    if (el) {
        el.textContent = "";
        el.style.display = "none";
    }
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function sair() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "../../app/login.html";
}
