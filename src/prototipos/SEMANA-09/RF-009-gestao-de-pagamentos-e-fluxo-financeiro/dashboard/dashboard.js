/**
 * BarberFlow - Dashboard & Gestão de Pagamentos (SEMANA-09 / RF-009)
 * Regra de Repasse 70% / 30% (Lei do Salão-Parceiro)
 * Conciliação Financeira: Receita Prevista vs. Receita Efetivada
 * Sincronização em tempo real de Barbeiros (Supabase + Local)
 * RBAC Rigoroso:
 *   - Administrador: Faturamento Geral (100%), Cota Salão (30%), Repasses (70%), Gestão Completa.
 *   - Barbeiro: Apenas sua comissão individual (70%), seus atendimentos e checkout.
 *   - Cliente: Apenas seus agendamentos e histórico (Métricas de receita totalmente ocultas).
 * Protocolo v14.3 (Interface 100% sem popup bloqueante, acessível e segura)
 */

const SUPABASE_URL = "https://qqxntkifbvzcneaqbhae.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FjIQ8xTPK0Y7TrMxlknn-A_48rvJyeD";

let supabaseClient = null;
try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn("Supabase não carregado no dashboard:", e);
}

let usuarioLogado = null;
let agendamentoEmCheckout = null;

// Inicialização da Página
document.addEventListener("DOMContentLoaded", () => {
    verificarAutenticacao();
    carregarDadosSistema();
    configurarPerfilRBAC();
    popularSelectsFormulario();
    mostrarAgendamentos();
    atualizarMetricasFinanceiras();
    atualizarTabelaRepasseBarbeiros();
    buscarBarbeirosDoBanco();
});

// 1. Verificação de Sessão & RBAC
function verificarAutenticacao() {
    try {
        const sessao = sessionStorage.getItem("usuarioLogado");
        if (!sessao) {
            window.location.href = "../app/login.html";
            return;
        }
        usuarioLogado = JSON.parse(sessao);
        const infoEl = document.getElementById("infoUsuario");
        if (infoEl) {
            const rotuloPerfil = usuarioLogado.perfil === "admin" ? "Administrador" :
                                (usuarioLogado.perfil === "barbeiro" ? "Barbeiro" : "Cliente");
            infoEl.textContent = `${usuarioLogado.nome} (${rotuloPerfil})`;
        }
    } catch (e) {
        window.location.href = "../app/login.html";
    }
}

function configurarPerfilRBAC() {
    if (!usuarioLogado) return;

    const linkBarbeiros = document.getElementById("linkBarbeiros");
    const botaoNovo = document.getElementById("botaoNovo");
    const painelMetricas = document.getElementById("painelMetricas");
    const cartaoRepasse = document.getElementById("cartaoRepasseBarbeiros");
    const cardDivisao = document.getElementById("cardDivisaoSalao");
    const rotuloEfetivado = document.getElementById("rotuloEfetivado");
    const subtextoEfetivado = document.getElementById("subtextoEfetivado");
    const rotuloPrevisto = document.getElementById("rotuloPrevisto");
    const subtextoPrevisto = document.getElementById("subtextoPrevisto");
    const tituloPagina = document.getElementById("tituloPagina");

    // ==========================================
    // PERFIL CLIENTE:
    // O Cliente NUNCA deve ver dados financeiros,
    // faturamento da empresa ou tabelas de repasse!
    // ==========================================
    if (usuarioLogado.perfil === "cliente") {
        if (painelMetricas) painelMetricas.style.display = "none";
        if (cartaoRepasse) cartaoRepasse.style.display = "none";
        if (linkBarbeiros) linkBarbeiros.style.display = "none";
        if (tituloPagina) tituloPagina.textContent = "Meus Agendamentos";
        if (botaoNovo) botaoNovo.textContent = "+ Agendar Horário";
        return;
    }

    // ==========================================
    // PERFIL BARBEIRO:
    // Vê apenas seus próprios atendimentos e sua
    // comissão individual de 70%.
    // ==========================================
    if (usuarioLogado.perfil === "barbeiro") {
        if (painelMetricas) painelMetricas.style.display = "flex";
        if (linkBarbeiros) linkBarbeiros.style.display = "none";
        if (cardDivisao) cardDivisao.style.display = "none";
        if (rotuloEfetivado) rotuloEfetivado.textContent = "Minha Comissão Recebida (70%)";
        if (subtextoEfetivado) subtextoEfetivado.textContent = "Total dos seus serviços pagos";
        if (rotuloPrevisto) rotuloPrevisto.textContent = "Minha Previsão a Receber (70%)";
        if (subtextoPrevisto) subtextoPrevisto.textContent = "Comissão prevista dos próximos agendamentos";
        if (tituloPagina) tituloPagina.textContent = "Meus Atendimentos na Barbearia";
        return;
    }

    // ==========================================
    // PERFIL ADMINISTRADOR:
    // Controle total e visão macro do negócio.
    // ==========================================
    if (usuarioLogado.perfil === "admin") {
        if (painelMetricas) painelMetricas.style.display = "flex";
        if (cartaoRepasse) cartaoRepasse.style.display = "block";
        if (cardDivisao) cardDivisao.style.display = "flex";
        if (linkBarbeiros) linkBarbeiros.style.display = "inline-block";
        if (rotuloEfetivado) rotuloEfetivado.textContent = "Receita Efetivada (Caixa Real)";
        if (subtextoEfetivado) subtextoEfetivado.textContent = "Soma dos serviços já pagos (100%)";
        if (rotuloPrevisto) rotuloPrevisto.textContent = "Receita Prevista (A Receber)";
        if (subtextoPrevisto) subtextoPrevisto.textContent = "Agendamentos pendentes e confirmados";
        if (tituloPagina) tituloPagina.textContent = "Agenda de Atendimentos & Caixa";
    }
}

function sair() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "../app/login.html";
}

// 2. Carregamento e Persistência de Dados
function carregarDadosSistema() {
    if (!localStorage.getItem("servicos")) {
        const servicosPadrao = [
            { id: 1, nome: "Corte Degradê", descricao: "Acabamento na máquina e tesoura", duracao: 30, preco: 45.00, status: "Ativo" },
            { id: 2, nome: "Barba Completa", descricao: "Toalha quente e navalha", duracao: 30, preco: 35.00, status: "Ativo" },
            { id: 3, nome: "Combo Corte + Barba", descricao: "Serviço completo premium", duracao: 60, preco: 70.00, status: "Ativo" },
            { id: 4, nome: "Platinado / Nevou", descricao: "Descoloração global", duracao: 90, preco: 120.00, status: "Ativo" }
        ];
        localStorage.setItem("servicos", JSON.stringify(servicosPadrao));
    }

    let barbeirosExistentes = [];
    try {
        barbeirosExistentes = JSON.parse(localStorage.getItem("barbeiros")) || [];
    } catch (e) {
        barbeirosExistentes = [];
    }

    // Barbeiros padrão oficiais, incluindo Testezada (teste@email.com)
    const barbeirosPadrao = [
        { id: 6, nome: "Testezada", email: "teste@email.com", especialidade: "Corte Degradê e Navalha", status: "Ativo" },
        { id: 1, nome: "Gabriel Barbeiro", email: "barbeiro@barberflow.com", especialidade: "Degradê e Barba", status: "Ativo" },
        { id: 2, nome: "Cauê Barber", email: "caue@barberflow.com", especialidade: "Corte Clássico e Navalha", status: "Ativo" },
        { id: 3, nome: "Braynt Stylist", email: "braynt@barberflow.com", especialidade: "Platinado e Barba Terapia", status: "Ativo" }
    ];

    // Garante que todos os barbeiros padrão estejam registrados
    barbeirosPadrao.forEach(bp => {
        const idx = barbeirosExistentes.findIndex(b =>
            (b.email && b.email.toLowerCase() === bp.email.toLowerCase()) ||
            b.nome.toLowerCase() === bp.nome.toLowerCase()
        );
        if (idx === -1) {
            barbeirosExistentes.push(bp);
        } else {
            // Atualiza para garantir status ativo e email correto
            barbeirosExistentes[idx].email = bp.email;
            barbeirosExistentes[idx].status = "Ativo";
        }
    });

    localStorage.setItem("barbeiros", JSON.stringify(barbeirosExistentes));

    if (!localStorage.getItem("agendamentos")) {
        const hoje = new Date().toISOString().split("T")[0];
        const agendamentosPadrao = [
            {
                id: 101,
                cliente: "Kauan Souza",
                servico: "Corte Degradê",
                preco: 45.00,
                barbeiro: "Gabriel Barbeiro",
                data: hoje,
                hora: "09:30",
                formaPagamento: "Pix",
                status: "Pago",
                dataPagamento: hoje + " 09:55"
            },
            {
                id: 102,
                cliente: "Lucas Pereira",
                servico: "Combo Corte + Barba",
                preco: 70.00,
                barbeiro: "Testezada",
                data: hoje,
                hora: "10:30",
                formaPagamento: "Cartão de Crédito",
                status: "Pago",
                dataPagamento: hoje + " 11:20"
            },
            {
                id: 103,
                cliente: "Marcos Vinicius",
                servico: "Barba Completa",
                preco: 35.00,
                barbeiro: "Cauê Barber",
                data: hoje,
                hora: "14:00",
                formaPagamento: "Dinheiro",
                status: "Confirmado",
                dataPagamento: null
            },
            {
                id: 104,
                cliente: "Rodrigo Silva",
                servico: "Platinado / Nevou",
                preco: 120.00,
                barbeiro: "Braynt Stylist",
                data: hoje,
                hora: "16:00",
                formaPagamento: "Pix",
                status: "Pendente",
                dataPagamento: null
            }
        ];
        localStorage.setItem("agendamentos", JSON.stringify(agendamentosPadrao));
    }
}

// Sincroniza barbeiros cadastrados no banco Supabase
async function buscarBarbeirosDoBanco() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from("usuarios")
            .select("id, nome, email, perfil");

        if (!error && Array.isArray(data)) {
            let barbeirosLocais = obterBarbeiros();
            let alterou = false;

            data.forEach(u => {
                if (u.perfil === "barbeiro") {
                    const nome = u.nome ? u.nome.trim() : (u.email ? u.email.split("@")[0] : "Barbeiro");
                    const email = (u.email || "").toLowerCase();
                    const existe = barbeirosLocais.find(b =>
                        (b.email && b.email.toLowerCase() === email) ||
                        b.nome.toLowerCase() === nome.toLowerCase()
                    );
                    if (!existe) {
                        barbeirosLocais.push({
                            id: u.id,
                            nome: nome,
                            email: email,
                            especialidade: "Corte e Barba",
                            status: "Ativo"
                        });
                        alterou = true;
                    }
                }
            });

            if (alterou) {
                localStorage.setItem("barbeiros", JSON.stringify(barbeirosLocais));
                popularSelectsFormulario();
                atualizarTabelaRepasseBarbeiros();
            }
        }
    } catch (e) {
        console.warn("Erro ao sincronizar barbeiros do banco:", e);
    }
}

function obterAgendamentos() {
    try {
        return JSON.parse(localStorage.getItem("agendamentos")) || [];
    } catch (e) {
        return [];
    }
}

function salvarListaAgendamentos(lista) {
    localStorage.setItem("agendamentos", JSON.stringify(lista));
    mostrarAgendamentos();
    atualizarMetricasFinanceiras();
    atualizarTabelaRepasseBarbeiros();
}

function obterServicos() {
    try {
        return JSON.parse(localStorage.getItem("servicos")) || [];
    } catch (e) {
        return [];
    }
}

function obterBarbeiros() {
    let barbeiros = [];
    try {
        barbeiros = JSON.parse(localStorage.getItem("barbeiros")) || [];
    } catch (e) {
        barbeiros = [];
    }

    // Mescla usuários cadastrados como barbeiros no localStorage
    let usuariosLocais = [];
    try {
        usuariosLocais = JSON.parse(localStorage.getItem("usuariosBarberFlow")) || [];
    } catch (e) {
        usuariosLocais = [];
    }

    usuariosLocais.forEach(u => {
        if (u.perfil === "barbeiro") {
            const email = (u.email || "").toLowerCase();
            const nome = u.nome || email.split("@")[0];
            if (!barbeiros.some(b => (b.email && b.email.toLowerCase() === email) || b.nome.toLowerCase() === nome.toLowerCase())) {
                barbeiros.push({
                    id: u.id,
                    nome: nome,
                    email: email,
                    especialidade: u.especialidade || "Corte e Barba",
                    status: "Ativo"
                });
            }
        }
    });

    return barbeiros;
}

// 3. Métricas Financeiras (Previsão vs. Efetivado & Regra 70/30)
function atualizarMetricasFinanceiras() {
    if (!usuarioLogado || usuarioLogado.perfil === "cliente") {
        return;
    }

    const lista = obterAgendamentos();
    let totalEfetivado = 0;
    let totalPrevisto = 0;
    let qtdPagos = 0;
    let qtdConfirmados = 0;
    let qtdPendentes = 0;

    const isBarbeiro = (usuarioLogado.perfil === "barbeiro");
    const nomeBarbeiroLogado = isBarbeiro ? (usuarioLogado.nome || "").toLowerCase() : "";
    const emailBarbeiroLogado = isBarbeiro ? (usuarioLogado.email || "").toLowerCase() : "";

    lista.forEach(ag => {
        if (isBarbeiro) {
            const agBarb = (ag.barbeiro || "").toLowerCase();
            const matchNome = nomeBarbeiroLogado && agBarb.includes(nomeBarbeiroLogado);
            const matchEmail = emailBarbeiroLogado && agBarb.includes(emailBarbeiroLogado.split("@")[0]);
            if (!matchNome && !matchEmail) {
                return;
            }
        }

        const preco = parseFloat(ag.preco) || 0;

        if (ag.status === "Pago") {
            totalEfetivado += preco;
            qtdPagos++;
        } else if (ag.status === "Confirmado") {
            totalPrevisto += preco;
            qtdConfirmados++;
        } else if (ag.status === "Pendente") {
            totalPrevisto += preco;
            qtdPendentes++;
        }
    });

    const repasseBarbeiros70 = totalEfetivado * 0.70;
    const parteSalao30 = totalEfetivado * 0.30;
    const previstoBarbeiro70 = totalPrevisto * 0.70;

    const elEfetivado = document.getElementById("valorEfetivado");
    const elPrevisto = document.getElementById("valorPrevisto");
    const elParteSalao = document.getElementById("valorParteSalao");
    const elDetalheRepasse = document.getElementById("detalheRepasseBarbeiro");

    if (elEfetivado) {
        elEfetivado.textContent = isBarbeiro ? formatarMoeda(repasseBarbeiros70) : formatarMoeda(totalEfetivado);
    }
    if (elPrevisto) {
        elPrevisto.textContent = isBarbeiro ? formatarMoeda(previstoBarbeiro70) : formatarMoeda(totalPrevisto);
    }
    if (elParteSalao) {
        elParteSalao.textContent = formatarMoeda(parteSalao30);
    }
    if (elDetalheRepasse) {
        elDetalheRepasse.textContent = `Repasse Barbeiros (70%): ${formatarMoeda(repasseBarbeiros70)}`;
    }

    const elQtdPagos = document.getElementById("qtdPagos");
    const elQtdConfirmados = document.getElementById("qtdConfirmados");
    const elQtdPendentes = document.getElementById("qtdPendentes");

    if (elQtdPagos) elQtdPagos.textContent = qtdPagos;
    if (elQtdConfirmados) elQtdConfirmados.textContent = qtdConfirmados;
    if (elQtdPendentes) elQtdPendentes.textContent = qtdPendentes;
}

// 4. Tabela de Repasse de Comissões por Barbeiro (70% / 30%)
function atualizarTabelaRepasseBarbeiros() {
    const corpo = document.getElementById("corpoTabelaBarbeiros");
    if (!corpo) return;

    if (!usuarioLogado || usuarioLogado.perfil === "cliente") {
        corpo.innerHTML = "";
        return;
    }

    corpo.innerHTML = "";
    const agendamentos = obterAgendamentos();
    const barbeiros = obterBarbeiros();

    const isBarbeiro = (usuarioLogado.perfil === "barbeiro");
    const nomeBarbeiroLogado = isBarbeiro ? (usuarioLogado.nome || "").toLowerCase() : "";
    const emailBarbeiroLogado = isBarbeiro ? (usuarioLogado.email || "").toLowerCase() : "";

    barbeiros.forEach(b => {
        if (isBarbeiro) {
            const bNome = (b.nome || "").toLowerCase();
            const bEmail = (b.email || "").toLowerCase();
            const matchNome = nomeBarbeiroLogado && bNome.includes(nomeBarbeiroLogado);
            const matchEmail = emailBarbeiroLogado && bEmail === emailBarbeiroLogado;
            if (!matchNome && !matchEmail) {
                return;
            }
        }

        const pagosDoBarbeiro = agendamentos.filter(ag => {
            const agB = (ag.barbeiro || "").toLowerCase();
            return agB.includes(b.nome.toLowerCase()) && ag.status === "Pago";
        });

        const qtdCortes = pagosDoBarbeiro.length;
        const totalFaturado = pagosDoBarbeiro.reduce((acc, curr) => acc + (parseFloat(curr.preco) || 0), 0);
        const comissao70 = totalFaturado * 0.70;
        const retencao30 = totalFaturado * 0.30;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Profissional"><strong>${b.nome}</strong> ${b.email ? `<small style="color:#64748b; display:block;">${b.email}</small>` : ''}</td>
            <td data-label="Serviços Pagos">${qtdCortes} atendimento(s)</td>
            <td data-label="Faturamento Realizado">${formatarMoeda(totalFaturado)}</td>
            <td data-label="Comissão Barbeiro (70%)"><strong class="status_confirmado">${formatarMoeda(comissao70)}</strong></td>
            <td data-label="Retenção Salão (30%)" class="status_info">${formatarMoeda(retencao30)}</td>
        `;
        corpo.appendChild(tr);
    });
}

// 5. Renderização da Tabela de Agendamentos & Caixa
function mostrarAgendamentos() {
    const corpo = document.getElementById("corpoTabela");
    const msgVazia = document.getElementById("mensagemVazia");
    const busca = document.getElementById("busca") ? document.getElementById("busca").value.toLowerCase().trim() : "";
    const filtroStatus = document.getElementById("filtroStatus") ? document.getElementById("filtroStatus").value : "todos";

    if (!corpo) return;
    corpo.innerHTML = "";

    let lista = obterAgendamentos();

    if (usuarioLogado && usuarioLogado.perfil === "barbeiro") {
        const nomeBarbeiro = (usuarioLogado.nome || "").toLowerCase();
        const emailBarbeiro = (usuarioLogado.email || "").toLowerCase();
        lista = lista.filter(ag => {
            const agB = (ag.barbeiro || "").toLowerCase();
            return agB.includes(nomeBarbeiro) || (emailBarbeiro && agB.includes(emailBarbeiro.split("@")[0]));
        });
    } else if (usuarioLogado && usuarioLogado.perfil === "cliente") {
        const nomeCli = (usuarioLogado.nome || "").toLowerCase();
        const emailCli = (usuarioLogado.email || "").toLowerCase();
        lista = lista.filter(ag => {
            const agCli = (ag.cliente || "").toLowerCase();
            return agCli.includes(nomeCli) || (emailCli && agCli.includes(emailCli.split("@")[0]));
        });
    }

    if (busca) {
        lista = lista.filter(ag =>
            (ag.cliente || "").toLowerCase().includes(busca) ||
            (ag.servico || "").toLowerCase().includes(busca) ||
            (ag.barbeiro || "").toLowerCase().includes(busca)
        );
    }

    if (filtroStatus !== "todos") {
        lista = lista.filter(ag => ag.status === filtroStatus);
    }

    if (lista.length === 0) {
        if (msgVazia) {
            msgVazia.style.display = "block";
            if (usuarioLogado && usuarioLogado.perfil === "cliente") {
                msgVazia.textContent = "Você não possui agendamentos no momento. Clique em '+ Agendar Horário' para marcar seu corte!";
            } else {
                msgVazia.textContent = "Nenhum agendamento encontrado no período.";
            }
        }
        return;
    } else {
        if (msgVazia) msgVazia.style.display = "none";
    }

    lista.forEach(ag => {
        const tr = document.createElement("tr");

        let badgeClasse = "badge_pendente";
        if (ag.status === "Pago") badgeClasse = "badge_pago";
        else if (ag.status === "Confirmado") badgeClasse = "badge_confirmado";
        else if (ag.status === "Cancelado") badgeClasse = "badge_cancelado";

        let botoesAcao = "";

        if (usuarioLogado.perfil === "cliente") {
            if (ag.status !== "Pago" && ag.status !== "Cancelado") {
                botoesAcao = `<button class="btn_tabela btn_excluir" onclick="cancelarAgendamentoCliente(${ag.id})" title="Cancelar meu agendamento">Cancelar</button>`;
            } else if (ag.status === "Pago") {
                botoesAcao = `<span class="status_confirmado" style="font-weight: 700; font-size: 0.82rem;">✓ Pago</span>`;
            } else {
                botoesAcao = `<span class="status_cancelado" style="font-size: 0.82rem;">Cancelado</span>`;
            }
        } else {
            const podeDarBaixa = (usuarioLogado.perfil === "admin" || usuarioLogado.perfil === "barbeiro");

            if (ag.status !== "Pago" && ag.status !== "Cancelado" && podeDarBaixa) {
                botoesAcao += `<button class="btn_tabela btn_pagar" onclick="abrirModalCheckout(${ag.id})" title="Efetuar Pagamento do Atendimento">Efetuar Pagamento / Checkout</button>`;
            } else if (ag.status === "Pago") {
                botoesAcao += `<span class="status_confirmado" style="font-weight: 700; font-size: 0.82rem;">✓ Pago (${ag.formaPagamento || "Liquidado"})</span>`;
            }

            if (usuarioLogado.perfil === "admin") {
                botoesAcao += ` <button class="btn_tabela btn_excluir" onclick="removerAgendamento(${ag.id})" title="Excluir">Excluir</button>`;
            }
        }

        tr.innerHTML = `
            <td data-label="Cliente"><strong>${ag.cliente}</strong></td>
            <td data-label="Serviço">${ag.servico}</td>
            <td data-label="Valor (R$)"><strong>${formatarMoeda(ag.preco)}</strong></td>
            <td data-label="Barbeiro">${ag.barbeiro}</td>
            <td data-label="Data">${formatarDataBR(ag.data)}</td>
            <td data-label="Hora">${ag.hora}</td>
            <td data-label="Pagamento"><span class="forma_pagamento_tag">${ag.formaPagamento || "A Definir"}</span></td>
            <td data-label="Situação"><span class="badge_status ${badgeClasse}">${ag.status}</span></td>
            <td data-label="Ações" class="coluna_acoes">${botoesAcao || "-"}</td>
        `;

        corpo.appendChild(tr);
    });
}

// 6. Modal de Checkout & Liquidação Financeira (RF-009)
function abrirModalCheckout(id) {
    if (usuarioLogado && usuarioLogado.perfil === "cliente") return;

    const lista = obterAgendamentos();
    const agendamento = lista.find(item => item.id === id);
    if (!agendamento) return;

    agendamentoEmCheckout = agendamento;

    document.getElementById("checkoutAgendamentoId").value = agendamento.id;
    document.getElementById("checkoutCliente").textContent = agendamento.cliente;
    document.getElementById("checkoutBarbeiro").textContent = agendamento.barbeiro;
    document.getElementById("checkoutServico").textContent = agendamento.servico;
    document.getElementById("checkoutValorTotal").textContent = formatarMoeda(agendamento.preco);

    const valor = parseFloat(agendamento.preco) || 0;
    const splitBarbeiro = valor * 0.70;
    const splitSalao = valor * 0.30;
    document.getElementById("checkoutSplitBarbeiro").textContent = formatarMoeda(splitBarbeiro);
    document.getElementById("checkoutSplitSalao").textContent = formatarMoeda(splitSalao);

    document.getElementById("checkoutFormaPagamento").value = agendamento.formaPagamento || "Pix";
    if (document.getElementById("checkoutValorEntregue")) {
        document.getElementById("checkoutValorEntregue").value = "";
    }
    document.getElementById("checkoutTroco").textContent = "R$ 0,00";
    ocultarErroCheckout();

    alternarCamposMeioPagamento();

    document.getElementById("modalCheckout").style.display = "flex";
}

function fecharModalCheckout() {
    document.getElementById("modalCheckout").style.display = "none";
    agendamentoEmCheckout = null;
}

function alternarCamposMeioPagamento() {
    const meio = document.getElementById("checkoutFormaPagamento").value;
    const painelPix = document.getElementById("painelPix");
    const painelDinheiro = document.getElementById("painelDinheiro");

    if (meio === "Pix") {
        if (painelPix) painelPix.style.display = "block";
        if (painelDinheiro) painelDinheiro.style.display = "none";
    } else if (meio === "Dinheiro") {
        if (painelPix) painelPix.style.display = "none";
        if (painelDinheiro) painelDinheiro.style.display = "block";
    } else {
        if (painelPix) painelPix.style.display = "none";
        if (painelDinheiro) painelDinheiro.style.display = "none";
    }
}

function calcularTroco() {
    if (!agendamentoEmCheckout) return;
    const preco = parseFloat(agendamentoEmCheckout.preco) || 0;
    const entregue = parseFloat(document.getElementById("checkoutValorEntregue").value) || 0;

    const elTroco = document.getElementById("checkoutTroco");
    if (entregue < preco) {
        elTroco.textContent = "Valor insuficiente";
        elTroco.style.color = "#dc2626";
    } else {
        const troco = entregue - preco;
        elTroco.textContent = formatarMoeda(troco);
        elTroco.style.color = "#059669";
    }
}

function confirmarLiquidacaoPagamento() {
    if (!agendamentoEmCheckout) return;

    const forma = document.getElementById("checkoutFormaPagamento").value;
    const preco = parseFloat(agendamentoEmCheckout.preco) || 0;

    if (forma === "Dinheiro") {
        const entregue = parseFloat(document.getElementById("checkoutValorEntregue").value) || 0;
        if (entregue < preco) {
            exibirErroCheckout("O valor entregue em dinheiro é menor que o valor total do serviço.");
            return;
        }
    }

    const lista = obterAgendamentos();
    const index = lista.findIndex(ag => ag.id === agendamentoEmCheckout.id);
    if (index !== -1) {
        lista[index].status = "Pago";
        lista[index].formaPagamento = forma;
        lista[index].dataPagamento = new Date().toLocaleString("pt-BR");

        salvarListaAgendamentos(lista);
        fecharModalCheckout();
    }
}

function exibirErroCheckout(msg) {
    const el = document.getElementById("checkoutMsgFeedback");
    if (el) {
        el.textContent = msg;
        el.style.display = "block";
    }
}

function ocultarErroCheckout() {
    const el = document.getElementById("checkoutMsgFeedback");
    if (el) {
        el.textContent = "";
        el.style.display = "none";
    }
}

// 7. Ações de Formulário de Agendamento
function abrirFormularioNovo() {
    document.getElementById("caixaFormulario").style.display = "block";
    document.getElementById("tituloFormulario").textContent = (usuarioLogado && usuarioLogado.perfil === "cliente") ? "Agendar Meu Horário" : "Novo Agendamento";
    limparFormulario();

    const hoje = new Date().toISOString().split("T")[0];
    const campoData = document.getElementById("campoData");
    if (campoData) campoData.value = hoje;

    const campoCliente = document.getElementById("campoCliente");
    const labelStatus = document.getElementById("labelStatus");
    const campoStatus = document.getElementById("campoStatus");

    if (usuarioLogado && usuarioLogado.perfil === "cliente") {
        if (campoCliente) {
            campoCliente.value = usuarioLogado.nome;
            campoCliente.readOnly = true;
        }
        if (labelStatus) labelStatus.style.display = "none";
        if (campoStatus) {
            campoStatus.value = "Confirmado";
            campoStatus.style.display = "none";
        }
    } else {
        if (campoCliente) {
            campoCliente.value = "";
            campoCliente.readOnly = false;
        }
        if (labelStatus) labelStatus.style.display = "block";
        if (campoStatus) {
            campoStatus.value = "Confirmado";
            campoStatus.style.display = "block";
        }
    }

    popularSelectsFormulario();
    atualizarPrecoServicoSelecionado();
    atualizarTabelaHorarios();
}

function fecharFormulario() {
    document.getElementById("caixaFormulario").style.display = "none";
    limparFormulario();
}

function limparFormulario() {
    const campoCliente = document.getElementById("campoCliente");
    if (campoCliente && (!usuarioLogado || usuarioLogado.perfil !== "cliente")) {
        campoCliente.value = "";
    }
    const msgErro = document.getElementById("mensagemErro");
    if (msgErro) msgErro.style.display = "none";
}

function popularSelectsFormulario() {
    const selectServicos = document.getElementById("campoServico");
    const selectBarbeiros = document.getElementById("campoBarbeiro");
    const selectHora = document.getElementById("campoHora");

    if (selectServicos) {
        selectServicos.innerHTML = "";
        const servicos = obterServicos().filter(s => s.status === "Ativo");
        servicos.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.nome;
            opt.textContent = `${s.nome} - ${formatarMoeda(s.preco)}`;
            opt.dataset.preco = s.preco;
            selectServicos.appendChild(opt);
        });
    }

    if (selectBarbeiros) {
        selectBarbeiros.innerHTML = "";
        const barbeiros = obterBarbeiros().filter(b => b.status === "Ativo");
        barbeiros.forEach(b => {
            const opt = document.createElement("option");
            opt.value = b.nome;
            opt.textContent = b.email ? `${b.nome} (${b.email})` : b.nome;
            selectBarbeiros.appendChild(opt);
        });
    }

    if (selectHora) {
        selectHora.innerHTML = "";
        const horariosComerciais = [
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
            "16:00", "16:30", "17:00", "17:30"
        ];
        horariosComerciais.forEach(h => {
            const opt = document.createElement("option");
            opt.value = h;
            opt.textContent = h;
            selectHora.appendChild(opt);
        });
    }
}

function atualizarPrecoServicoSelecionado() {
    const select = document.getElementById("campoServico");
    const exibicao = document.getElementById("valorServicoExibicao");
    if (!select || !exibicao) return;

    const opt = select.options[select.selectedIndex];
    if (opt && opt.dataset.preco) {
        exibicao.textContent = formatarMoeda(parseFloat(opt.dataset.preco));
    }
}

function atualizarTabelaHorarios() {
    const corpo = document.getElementById("corpoTabelaHorarios");
    if (!corpo) return;
    corpo.innerHTML = "";

    const data = document.getElementById("campoData").value;
    const barbeiro = document.getElementById("campoBarbeiro").value;
    const horaSelecionada = document.getElementById("campoHora").value;

    const agendamentos = obterAgendamentos();
    const ocupados = agendamentos
        .filter(ag => ag.data === data && ag.barbeiro === barbeiro && ag.status !== "Cancelado")
        .map(ag => ag.hora);

    const grade = [
        ["09:00", "09:30", "10:00", "10:30"],
        ["11:00", "11:30", "13:00", "13:30"],
        ["14:00", "14:30", "15:00", "15:30"],
        ["16:00", "16:30", "17:00", "17:30"]
    ];

    grade.forEach(linha => {
        const tr = document.createElement("tr");
        linha.forEach(hora => {
            const td = document.createElement("td");
            td.className = "slot_horario";
            td.textContent = hora;

            if (ocupados.includes(hora)) {
                td.classList.add("slot_ocupado");
                td.title = "Horário já reservado";
            } else {
                if (hora === horaSelecionada) {
                    td.classList.add("slot_selecionado");
                }
                td.onclick = () => {
                    document.getElementById("campoHora").value = hora;
                    atualizarTabelaHorarios();
                };
            }
            tr.appendChild(td);
        });
        corpo.appendChild(tr);
    });
}

function destacarHorarioSelecionado() {
    atualizarTabelaHorarios();
}

function salvarAgendamento() {
    let cliente = "";
    if (usuarioLogado && usuarioLogado.perfil === "cliente") {
        cliente = usuarioLogado.nome;
    } else {
        cliente = document.getElementById("campoCliente").value.trim();
    }

    const servicoSelect = document.getElementById("campoServico");
    const servico = servicoSelect.value;
    const preco = parseFloat(servicoSelect.options[servicoSelect.selectedIndex].dataset.preco) || 45.00;
    const barbeiro = document.getElementById("campoBarbeiro").value;
    const data = document.getElementById("campoData").value;
    const hora = document.getElementById("campoHora").value;
    const formaPagamento = document.getElementById("campoPagamento").value;
    
    let status = "Confirmado";
    if (usuarioLogado && usuarioLogado.perfil !== "cliente") {
        status = document.getElementById("campoStatus").value;
    }

    const elErro = document.getElementById("mensagemErro");

    if (!cliente) {
        elErro.textContent = "Por favor, digite o nome do cliente.";
        elErro.style.display = "block";
        return;
    }
    if (!data) {
        elErro.textContent = "Por favor, selecione uma data válida.";
        elErro.style.display = "block";
        return;
    }

    const agendamentos = obterAgendamentos();
    const conflito = agendamentos.some(ag =>
        ag.data === data && ag.barbeiro === barbeiro && ag.hora === hora && ag.status !== "Cancelado"
    );

    if (conflito) {
        elErro.textContent = `O horário ${hora} para o profissional ${barbeiro} já está ocupado nesta data.`;
        elErro.style.display = "block";
        return;
    }

    const novo = {
        id: Date.now(),
        cliente: cliente,
        servico: servico,
        preco: preco,
        barbeiro: barbeiro,
        data: data,
        hora: hora,
        formaPagamento: formaPagamento,
        status: status,
        dataPagamento: status === "Pago" ? new Date().toLocaleString("pt-BR") : null
    };

    agendamentos.push(novo);
    salvarListaAgendamentos(agendamentos);
    fecharFormulario();
}

function cancelarAgendamentoCliente(id) {
    let lista = obterAgendamentos();
    const index = lista.findIndex(ag => ag.id === id);
    if (index !== -1) {
        lista[index].status = "Cancelado";
        salvarListaAgendamentos(lista);
    }
}

function removerAgendamento(id) {
    let lista = obterAgendamentos();
    lista = lista.filter(ag => ag.id !== id);
    salvarListaAgendamentos(lista);
}

// 8. Gestão de Barbeiros (Exclusivo Administrador)
function alternarAbaMenu(aba) {
    if (usuarioLogado && usuarioLogado.perfil !== "admin") return;

    const abaAgendamentos = document.getElementById("abaAgendamentos");
    const abaBarbeiros = document.getElementById("abaGestaoBarbeiros");
    const linkAg = document.getElementById("linkAgendamentos");
    const linkBarb = document.getElementById("linkBarbeiros");

    if (aba === "agendamentos") {
        abaAgendamentos.style.display = "block";
        abaBarbeiros.style.display = "none";
        linkAg.classList.add("link_ativo");
        linkBarb.classList.remove("link_ativo");
    } else {
        abaAgendamentos.style.display = "none";
        abaBarbeiros.style.display = "block";
        linkAg.classList.remove("link_ativo");
        linkBarb.classList.add("link_ativo");
        mostrarBarbeirosAdmin();
    }
}

function mostrarBarbeirosAdmin() {
    const corpo = document.getElementById("corpoTabelaGestaoBarbeiros");
    const msg = document.getElementById("mensagemSemBarbeiros");
    if (!corpo) return;

    corpo.innerHTML = "";
    const barbeiros = obterBarbeiros();

    if (barbeiros.length === 0) {
        if (msg) msg.style.display = "block";
        return;
    } else {
        if (msg) msg.style.display = "none";
    }

    barbeiros.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Profissional"><strong>${b.nome}</strong></td>
            <td data-label="E-mail">${b.email || "-"}</td>
            <td data-label="Especialidade">${b.especialidade}</td>
            <td data-label="Situação"><span class="badge_status ${b.status === 'Ativo' ? 'badge_pago' : 'badge_cancelado'}">${b.status}</span></td>
            <td data-label="Ações">
                <button class="btn_tabela btn_excluir" onclick="removerBarbeiroAdmin(${b.id})">Remover</button>
            </td>
        `;
        corpo.appendChild(tr);
    });
}

function abrirFormularioBarbeiroNovo() {
    document.getElementById("caixaFormularioBarbeiro").style.display = "block";
}

function fecharFormularioBarbeiro() {
    document.getElementById("caixaFormularioBarbeiro").style.display = "none";
}

function salvarBarbeiroAdmin() {
    const nome = document.getElementById("campoNomeBarbeiro").value.trim();
    const email = document.getElementById("campoEmailBarbeiro").value.trim();
    const esp = document.getElementById("campoEspecialidadeBarbeiro").value.trim();
    const status = document.getElementById("campoStatusBarbeiro").value;
    const elErro = document.getElementById("mensagemErroBarbeiro");

    if (!nome) {
        elErro.textContent = "Preencha o nome do profissional.";
        elErro.style.display = "block";
        return;
    }

    const barbeiros = obterBarbeiros();
    barbeiros.push({
        id: Date.now(),
        nome: nome,
        email: email,
        especialidade: esp || "Corte e Barba",
        status: status
    });

    localStorage.setItem("barbeiros", JSON.stringify(barbeiros));
    popularSelectsFormulario();
    mostrarBarbeirosAdmin();
    atualizarTabelaRepasseBarbeiros();
    fecharFormularioBarbeiro();
}

function removerBarbeiroAdmin(id) {
    let barbeiros = obterBarbeiros();
    barbeiros = barbeiros.filter(b => b.id !== id);
    localStorage.setItem("barbeiros", JSON.stringify(barbeiros));
    popularSelectsFormulario();
    mostrarBarbeirosAdmin();
    atualizarTabelaRepasseBarbeiros();
}

// 9. Formatadores Utilitários
function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarDataBR(dataISO) {
    if (!dataISO) return "-";
    const partes = dataISO.split("-");
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataISO;
}
