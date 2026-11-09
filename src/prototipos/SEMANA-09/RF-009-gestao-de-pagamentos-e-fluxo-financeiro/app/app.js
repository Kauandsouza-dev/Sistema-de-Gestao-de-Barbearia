/**
 * BarberFlow - Autenticação & Cadastro (SEMANA-09 / RF-009)
 * Suporte a Criptografia de Senhas com Bcrypt e Banco de Dados Supabase
 * Conformidade com Protocolo v14.3 (Zero alert(), interface acessível)
 */

const SUPABASE_URL = "https://qqxntkifbvzcneaqbhae.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FjIQ8xTPK0Y7TrMxlknn-A_48rvJyeD";

let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Elementos da interface
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");
const linkCriar = document.querySelector(".link_criar");
const linkVoltarLogin = document.querySelector(".link_voltar_login");
const lembrarCheckbox = document.getElementById("lembrar");
const msgErroLogin = document.getElementById("msgErroLogin");
const msgErroCadastro = document.getElementById("msgErroCadastro");
const btnTema = document.getElementById("toggle_tema");

// Recupera email lembrado anteriormente
const emailSalvoNoNavegador = localStorage.getItem("emailLembrado");
if (emailSalvoNoNavegador && document.getElementById("email_login")) {
    document.getElementById("email_login").value = emailSalvoNoNavegador;
    if (lembrarCheckbox) lembrarCheckbox.checked = true;
}

// Alternar entre Login e Cadastro
if (linkCriar) {
    linkCriar.addEventListener("click", (e) => {
        e.preventDefault();
        limparMensagens();
        if (formLogin) formLogin.style.display = "none";
        if (formCadastro) formCadastro.style.display = "flex";
    });
}

if (linkVoltarLogin) {
    linkVoltarLogin.addEventListener("click", (e) => {
        e.preventDefault();
        limparMensagens();
        if (formCadastro) formCadastro.style.display = "none";
        if (formLogin) formLogin.style.display = "flex";
    });
}

// Alternar campos se for barbeiro
function alternarCamposCandidatoBarbeiro() {
    const selectPerfil = document.getElementById("perfil_cadastro");
    const blocoInteresse = document.getElementById("blocoInteresseBarbeiro");
    if (!selectPerfil || !blocoInteresse) return;

    if (selectPerfil.value === "barbeiro") {
        blocoInteresse.style.display = "flex";
    } else {
        blocoInteresse.style.display = "none";
    }
}

function exibirErroLogin(msg) {
    if (msgErroLogin) {
        msgErroLogin.textContent = msg;
        msgErroLogin.style.display = "block";
    }
}

function exibirErroCadastro(msg) {
    if (msgErroCadastro) {
        msgErroCadastro.textContent = msg;
        msgErroCadastro.style.display = "block";
    }
}

function limparMensagens() {
    if (msgErroLogin) {
        msgErroLogin.textContent = "";
        msgErroLogin.style.display = "none";
    }
    if (msgErroCadastro) {
        msgErroCadastro.textContent = "";
        msgErroCadastro.style.display = "none";
    }
}

// Alternar tema
if (btnTema) {
    btnTema.addEventListener("click", () => {
        document.body.classList.toggle("tema_claro");
        const isClaro = document.body.classList.contains("tema_claro");
        btnTema.textContent = isClaro ? "☀️" : "🌙";
        localStorage.setItem("temaBarberFlow", isClaro ? "claro" : "escuro");
    });
    if (localStorage.getItem("temaBarberFlow") === "claro") {
        document.body.classList.add("tema_claro");
        btnTema.textContent = "☀️";
    }
}

// Validação e cadastro de novo usuário
async function cadastrarUsuario() {
    limparMensagens();

    const nome = document.getElementById("nome_cadastro").value.trim();
    const email = document.getElementById("email_cadastro").value.trim();
    const perfil = document.getElementById("perfil_cadastro").value;
    const especialidade = document.getElementById("especialidade_cadastro") ? document.getElementById("especialidade_cadastro").value.trim() : "";
    const senha = document.getElementById("senha_cadastro").value;
    const confirmaSenha = document.getElementById("confirma_senha").value;

    if (!nome) {
        exibirErroCadastro("Por favor, preencha seu nome completo.");
        return;
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
        exibirErroCadastro("Por favor, insira um e-mail válido.");
        return;
    }
    if (senha.length < 6) {
        exibirErroCadastro("A senha deve conter no mínimo 6 caracteres.");
        return;
    }
    if (senha !== confirmaSenha) {
        exibirErroCadastro("As senhas não coincidem. Digite novamente.");
        return;
    }

    try {
        let bcrypt = window.dcodeIO ? window.dcodeIO.bcrypt : (window.bcrypt || null);
        let senhaHash = senha;
        if (bcrypt && bcrypt.hash) {
            const salt = await bcrypt.genSalt(10);
            senhaHash = await bcrypt.hash(senha, salt);
        }

        let usuarioSalvoNoSupabase = false;

        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('usuarios')
                    .insert([{
                        nome: nome,
                        email: email.toLowerCase(),
                        senha_hash: senhaHash,
                        perfil: perfil
                    }]);

                if (!error) {
                    usuarioSalvoNoSupabase = true;
                } else {
                    console.warn("Supabase insert error, usando persistência local:", error.message);
                }
            } catch (errSupabase) {
                console.warn("Erro ao comunicar com Supabase:", errSupabase);
            }
        }

        // Persistência local complementar
        let usuariosLocais = [];
        try {
            usuariosLocais = JSON.parse(localStorage.getItem("usuariosBarberFlow")) || [];
        } catch (e) {
            usuariosLocais = [];
        }

        const usuarioExistente = usuariosLocais.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (usuarioExistente) {
            exibirErroCadastro("Este e-mail já está cadastrado.");
            return;
        }

        usuariosLocais.push({
            id: Date.now(),
            nome: nome,
            email: email.toLowerCase(),
            senha_hash: senhaHash,
            perfil: perfil,
            especialidade: especialidade || "Corte e Barba"
        });
        localStorage.setItem("usuariosBarberFlow", JSON.stringify(usuariosLocais));

        // Se for barbeiro, registra na equipe de profissionais
        if (perfil === "barbeiro") {
            let equipe = [];
            try {
                equipe = JSON.parse(localStorage.getItem("equipeBarbeiros")) || [];
            } catch (e) {
                equipe = [];
            }
            if (!equipe.find(b => b.email && b.email.toLowerCase() === email.toLowerCase())) {
                equipe.push({
                    id: Date.now(),
                    nome: nome,
                    email: email.toLowerCase(),
                    especialidade: especialidade || "Corte e Barba",
                    status: "Ativo"
                });
                localStorage.setItem("equipeBarbeiros", JSON.stringify(equipe));
            }
        }

        // Sucesso
        alertFeedbackInline("Cadastro realizado com sucesso! Faça login para continuar.", "sucesso");
        if (formCadastro) formCadastro.style.display = "none";
        if (formLogin) formLogin.style.display = "flex";
        document.getElementById("email_login").value = email;

    } catch (err) {
        console.error("Erro no cadastro:", err);
        exibirErroCadastro("Falha ao registrar usuário: " + err.message);
    }
}

// Autenticação / Login
async function fazerLogin() {
    limparMensagens();

    const email = document.getElementById("email_login").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
        exibirErroLogin("Por favor, preencha o e-mail e a senha.");
        return;
    }

    let bcrypt = window.dcodeIO ? window.dcodeIO.bcrypt : (window.bcrypt || null);

    // Contas de teste padrão criptografadas ou fallback
    const contasDemo = [
        {
            email: "admin@barberflow.com",
            nome: "Administrador Geral",
            perfil: "admin",
            senha: "admin"
        },
        {
            email: "admin@teste.com",
            nome: "Administrador Sistema",
            perfil: "admin",
            senha: "admin"
        },
        {
            email: "barbeiro@barberflow.com",
            nome: "Gabriel Barbeiro",
            perfil: "barbeiro",
            senha: "barba"
        },
        {
            email: "barbeiro@teste.com",
            nome: "Gabriel Cavalheiro",
            perfil: "barbeiro",
            senha: "barba"
        },
        {
            email: "cliente@barberflow.com",
            nome: "Carlos Cliente",
            perfil: "cliente",
            senha: "corte"
        },
        {
            email: "cliente@teste.com",
            nome: "Kauan Souza",
            perfil: "cliente",
            senha: "corte"
        }
    ];

    try {
        let usuarioAutenticado = null;

        // 1. Verifica nas contas demo locais
        const demo = contasDemo.find(c => c.email.toLowerCase() === email.toLowerCase());
        if (demo && demo.senha === senha) {
            usuarioAutenticado = {
                id: Date.now(),
                nome: demo.nome,
                email: demo.email,
                perfil: demo.perfil
            };
        }

        // 2. Verifica no Supabase se não foi encontrado nas demos
        if (!usuarioAutenticado && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('usuarios')
                    .select('*')
                    .eq('email', email.toLowerCase())
                    .maybeSingle();

                if (data && data.senha_hash) {
                    let senhaValida = false;
                    if (bcrypt && bcrypt.compare) {
                        senhaValida = await bcrypt.compare(senha, data.senha_hash);
                    } else {
                        senhaValida = (senha === data.senha_hash);
                    }
                    if (senhaValida) {
                        usuarioAutenticado = {
                            id: data.id,
                            nome: data.nome || data.email.split('@')[0],
                            email: data.email,
                            perfil: data.perfil || "cliente"
                        };
                    }
                }
            } catch (errSupabase) {
                console.warn("Supabase offline ou inacessível:", errSupabase);
            }
        }

        // 3. Verifica no localStorage
        if (!usuarioAutenticado) {
            let locais = [];
            try {
                locais = JSON.parse(localStorage.getItem("usuariosBarberFlow")) || [];
            } catch (e) {
                locais = [];
            }
            const localUser = locais.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (localUser && localUser.senha_hash) {
                let senhaValida = false;
                if (bcrypt && bcrypt.compare) {
                    senhaValida = await bcrypt.compare(senha, localUser.senha_hash);
                } else {
                    senhaValida = (senha === localUser.senha_hash);
                }
                if (senhaValida) {
                    usuarioAutenticado = {
                        id: localUser.id,
                        nome: localUser.nome,
                        email: localUser.email,
                        perfil: localUser.perfil
                    };
                }
            }
        }

        // Resultado da autenticação
        if (usuarioAutenticado) {
            if (lembrarCheckbox && lembrarCheckbox.checked) {
                localStorage.setItem("emailLembrado", email);
            } else {
                localStorage.removeItem("emailLembrado");
            }

            // Salva sessão segura
            sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioAutenticado));

            // Semente de dados unificados se for primeiro acesso
            inicializarDadosSistema();

            // Redireciona para o Painel Unificado SEMANA-09
            window.location.href = "../dashboard/RF-09.html";
        } else {
            exibirErroLogin("E-mail ou senha inválidos. Verifique suas credenciais.");
        }

    } catch (err) {
        console.error("Erro no login:", err);
        exibirErroLogin("Erro ao autenticar: " + err.message);
    }
}

function alertFeedbackInline(msg, tipo) {
    if (msgErroCadastro) {
        msgErroCadastro.textContent = msg;
        msgErroCadastro.style.display = "block";
        msgErroCadastro.style.color = (tipo === "sucesso") ? "#10b981" : "#ef4444";
    }
}

// Inicializa dados realistas para Catálogo, Barbeiros e Agendamentos com Pagamentos
function inicializarDadosSistema() {
    if (!localStorage.getItem("barbeiros")) {
        const barbeirosPadrao = [
            { id: 1, nome: "Gabriel Barbeiro", especialidade: "Degradê e Barba", status: "Ativo" },
            { id: 2, nome: "Cauê Barber", especialidade: "Corte Clássico e Navalha", status: "Ativo" },
            { id: 3, nome: "Braynt Stylist", especialidade: "Platinado e Barba Terapia", status: "Ativo" }
        ];
        localStorage.setItem("barbeiros", JSON.stringify(barbeirosPadrao));
    }

    if (!localStorage.getItem("servicos")) {
        const servicosPadrao = [
            { id: 1, nome: "Corte Degradê", descricao: "Acabamento na máquina e tesoura", duracao: 30, preco: 45.00, status: "Ativo" },
            { id: 2, nome: "Barba Completa", descricao: "Toalha quente e navalha", duracao: 30, preco: 35.00, status: "Ativo" },
            { id: 3, nome: "Combo Corte + Barba", descricao: "Serviço completo premium", duracao: 60, preco: 70.00, status: "Ativo" },
            { id: 4, nome: "Platinado / Nevou", descricao: "Descoloração global", duracao: 90, preco: 120.00, status: "Ativo" }
        ];
        localStorage.setItem("servicos", JSON.stringify(servicosPadrao));
    }

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
                barbeiro: "Gabriel Barbeiro",
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
