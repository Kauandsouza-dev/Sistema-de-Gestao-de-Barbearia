const SUPABASE_URL = "https://qqxntkifbvzcneaqbhae.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FjIQ8xTPK0Y7TrMxlknn-A_48rvJyeD";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const linkCriar = document.querySelector(".link_criar");
const linkEsqueci = document.querySelector(".link_esqueci");
const mainContainer = document.querySelector(".conteudo_pagina");
const lembrarCheckbox = document.getElementById("lembrar");
const emailSalvoNoNavegador = localStorage.getItem("emailLembrado");
const btnTema = document.getElementById("toggle_tema");
let nomeSalvo = "";
let emailSalvo = "";
let senhaHashSalva = ""; // guardará o HASH e não a senha pura!

linkCriar.addEventListener("click", (evento) => {
    evento.preventDefault();
    mainContainer.classList.add("modo_cadastro");
});

linkEsqueci.addEventListener("click", (evento) => {
    evento.preventDefault();
    mainContainer.classList.add("modo_recuperar");
});

// Salvar o e-mail no lembrar-me
if (emailSalvoNoNavegador) {
    document.getElementById("email_login").value = emailSalvoNoNavegador;

    document.getElementById("lembrar").checked = true;
}

// FUNÇÕES
function validarEmailCadastro() {
    let nomeInput = document.getElementById("nome_cadastro");
    let nome = nomeInput ? nomeInput.value.trim() : "";
    let email = document.getElementById("email_cadastro").value.trim();
    let formatoValido = email.includes("@") && email.includes(".");

    if (nomeInput && nome === "") {
        alert("Por favor, preencha o seu nome.");
        return;
    }
    if (email === "") {
        alert("Por favor, preencha o e-mail.");
        return;
    }
    if (!formatoValido) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    // armazenei o nome e o e-mail digitados
    nomeSalvo = nome || email.split('@')[0];
    emailSalvo = email;

    // aqui esconde a etapa 1 quando o validarEmail for = true; e traz a etapa 2 de verificar senha
    document.querySelector(".etapa_1").style.display = "none";
    document.querySelector(".etapa_2").style.display = "flex";
}

async function verificarSenhas() {
    let senha = document.getElementById("senha_cadastro").value;
    let confirmacao = document.getElementById("confirmacao_senha").value;

    if (senha !== confirmacao) {
        alert("As senhas não coincidem! Tente novamente.");
        return;
    }
    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    try {
        // Gera o Salt e o Hash usando o bcryptjs puro
        const salt = await dcodeIO.bcrypt.genSalt(10);
        senhaHashSalva = await dcodeIO.bcrypt.hash(senha, salt);

        console.log("🔒 Senha criptografada com sucesso!");
        console.log("Hash bcrypt gerado:", senhaHashSalva);

        // Insere o novo usuário na tabela 'usuarios' do Supabase
        const { data, error } = await supabaseClient
            .from('usuarios')
            .insert([
                {
                    nome: nomeSalvo || emailSalvo.split('@')[0],
                    email: emailSalvo,
                    senha_hash: senhaHashSalva,
                    perfil: 'cliente'
                }
            ]);

        if (error) {
            console.error("Erro Supabase:", error);
            if (error.code === '23505' || error.message.includes('unique') || error.message.includes('duplicate')) {
                alert("Este e-mail já está cadastrado no sistema!");
            } else {
                alert("Erro ao salvar no banco Supabase: " + error.message);
            }
            return;
        }

        console.log("✅ Usuário gravado com sucesso no Supabase!");

        // Limpa os campos por segurança
        document.getElementById("senha_cadastro").value = "";
        document.getElementById("confirmacao_senha").value = "";

        // Esconde a etapa 2 e traz a etapa 3 de confirmação
        document.querySelector(".etapa_2").style.display = "none";
        document.querySelector(".etapa_3").style.display = "flex";
    } catch (erro) {
        alert("Erro ao processar o cadastro.");
        console.error(erro);
    }
}

function voltarAoLogin() {
    // 1. sai do cadastro e volta pro login
    mainContainer.classList.remove("modo_cadastro");
    mainContainer.classList.remove("modo_recuperar");
    // 2. reseta tudo pra cadastrar de novo (caso necessário)
    document.querySelector(".etapa_1").style.display = "flex";
    document.querySelector(".etapa_2").style.display = "none";
    document.querySelector(".etapa_3").style.display = "none";

    const inputNome = document.getElementById("nome_cadastro");
    if (inputNome) inputNome.value = "";
    document.getElementById("email_cadastro").value = "";
    document.getElementById("senha_cadastro").value = "";
    document.getElementById("confirmacao_senha").value = "";

    document.querySelector(".recuperar_1").style.display = "flex";
    document.querySelector(".recuperar_2").style.display = "none";
    document.getElementById("email_recuperar").value = "";
}

async function fazerLogin() {
    let emailDigitado = document.getElementById("email_login").value.trim();
    let senhaDigitada = document.getElementById("senha").value;

    if (emailDigitado === "" || senhaDigitada === "") {
        alert("Por favor, preencha o e-mail e a senha!");
        return;
    }

    try {
        // 1. Busca o registro do usuário na tabela 'usuarios' do Supabase pelo e-mail
        const { data: usuario, error } = await supabaseClient
            .from('usuarios')
            .select('*')
            .eq('email', emailDigitado)
            .maybeSingle();

        if (error) {
            console.error("Erro ao consultar Supabase:", error);
            alert("Erro na conexão com o banco de dados: " + error.message);
            return;
        }

        let senhaValida = false;

        // 2. Se o usuário existir no Supabase, compara a senha digitada com a senha_hash (bcrypt)
        if (usuario && usuario.senha_hash) {
            senhaValida = await dcodeIO.bcrypt.compare(senhaDigitada, usuario.senha_hash);
        }

        // Usuário admin de teste padrão
        let isAdmin = (emailDigitado === "admin@teste.com" && senhaDigitada === "123456");

        if (senhaValida || isAdmin) {
            if (lembrarCheckbox.checked) {
                localStorage.setItem("emailLembrado", emailDigitado);
            } else {
                localStorage.removeItem("emailLembrado");
            }

            // Armazena a sessão ativa do usuário
            if (usuario) {
                sessionStorage.setItem("usuarioLogado", JSON.stringify({
                    id: usuario.id,
                    nome: usuario.nome || usuario.email.split('@')[0],
                    email: usuario.email,
                    perfil: usuario.perfil
                }));
            }

            console.log("✅ Login autenticado com sucesso via Supabase + bcrypt!");
            window.location.href = "../dashboard/dashboard.html";
        } else {
            alert("E-mail ou senha incorretos.");
        }
    } catch (erro) {
        console.error("Erro no login:", erro);
        alert("Erro ao autenticar: " + erro.message);
    }
}

function enviarRecuperacao() {
    let emailRecup = document.getElementById("email_recuperar").value;

    if (emailRecup === "" || !emailRecup.includes("@") || !emailRecup.includes(".")) {
        alert("Por favor, insira um e-mail válido para recuperação.");
        return;
    }

    document.querySelector(".recuperar_1").style.display = "none";
    document.querySelector(".recuperar_2").style.display = "flex";
}

// DARK MODE
// checa se já tava no dark mode na hora que abre a página
if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark-mode");
    btnTema.textContent = "☀️"; // Muda o ícone para sol
}
// alterna entre claro e escuro com o botão
btnTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    // Se ligou o dark mode:
    if (document.body.classList.contains("dark-mode")) {
        btnTema.textContent = "☀️";
        localStorage.setItem("tema", "dark");
    } else {
        btnTema.textContent = "🌙";
        localStorage.setItem("tema", "light");
    }
});