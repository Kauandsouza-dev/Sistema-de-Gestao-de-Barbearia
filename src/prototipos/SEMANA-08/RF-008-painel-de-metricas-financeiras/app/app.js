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
let perfilSalvo = "cliente";
let especialidadeSalva = "";
let senhaHashSalva = "";

linkCriar.addEventListener("click", (evento) => {
    evento.preventDefault();
    mainContainer.classList.add("modo_cadastro");
});

linkEsqueci.addEventListener("click", (evento) => {
    evento.preventDefault();
    mainContainer.classList.add("modo_recuperar");
});

if (emailSalvoNoNavegador) {
    document.getElementById("email_login").value = emailSalvoNoNavegador;
    document.getElementById("lembrar").checked = true;
}

function alternarCamposCandidatoBarbeiro() {
    let selectPerfil = document.getElementById("perfil_cadastro");
    let blocoInteresse = document.getElementById("blocoInteresseBarbeiro");
    if (!selectPerfil || !blocoInteresse) return;

    if (selectPerfil.value === "candidato_barbeiro") {
        blocoInteresse.style.display = "flex";
    } else {
        blocoInteresse.style.display = "none";
    }
}

function salvarSolicitacaoBarbeiroLocal(nomeCandidato, emailCandidato, especialidadeCandidato) {
    let listaEquipe = [];
    try {
        listaEquipe = JSON.parse(localStorage.getItem("equipeBarbeiros")) || [];
    } catch (e) {
        listaEquipe = [];
    }

    let encontrado = false;
    for (let i = 0; i < listaEquipe.length; i++) {
        if (listaEquipe[i].email && listaEquipe[i].email.toLowerCase() === emailCandidato.toLowerCase()) {
            listaEquipe[i].nome = nomeCandidato;
            listaEquipe[i].especialidade = especialidadeCandidato || "Corte e Barba";
            listaEquipe[i].status = "Pendente";
            encontrado = true;
            break;
        }
    }

    if (!encontrado) {
        listaEquipe.push({
            id: Date.now(),
            nome: nomeCandidato,
            email: emailCandidato,
            especialidade: especialidadeCandidato || "Corte e Barba",
            status: "Pendente"
        });
    }

    localStorage.setItem("equipeBarbeiros", JSON.stringify(listaEquipe));
}

function obterPerfilAtualizadoLocal(emailUsuario, perfilBanco) {
    let listaEquipe = [];
    try {
        listaEquipe = JSON.parse(localStorage.getItem("equipeBarbeiros")) || [];
    } catch (e) {
        listaEquipe = [];
    }

    for (let i = 0; i < listaEquipe.length; i++) {
        if (listaEquipe[i].email && listaEquipe[i].email.toLowerCase() === emailUsuario.toLowerCase()) {
            if (listaEquipe[i].status === "Ativo") {
                return "barbeiro";
            } else {
                return "cliente";
            }
        }
    }

    if (perfilBanco === "candidato_barbeiro") {
        return "cliente";
    }

    return perfilBanco || "cliente";
}

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

    let selectPerfil = document.getElementById("perfil_cadastro");
    let inputEspecialidade = document.getElementById("especialidade_cadastro");
    nomeSalvo = nome || email.split('@')[0];
    emailSalvo = email;
    perfilSalvo = selectPerfil ? selectPerfil.value : "cliente";
    especialidadeSalva = inputEspecialidade ? inputEspecialidade.value.trim() : "";

    if (perfilSalvo === "candidato_barbeiro" && especialidadeSalva === "") {
        alert("Por favor, informe sua especialidade ou experiência como barbeiro.");
        return;
    }

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
        const salt = await dcodeIO.bcrypt.genSalt(10);
        senhaHashSalva = await dcodeIO.bcrypt.hash(senha, salt);

        console.log("🔒 Senha criptografada com sucesso!");
        console.log("Hash bcrypt gerado:", senhaHashSalva);

        let perfilParaBanco = perfilSalvo === "candidato_barbeiro" ? "candidato_barbeiro" : "cliente";

        let resultadoInsert = await supabaseClient
            .from('usuarios')
            .insert([
                {
                    nome: nomeSalvo || emailSalvo.split('@')[0],
                    email: emailSalvo,
                    senha_hash: senhaHashSalva,
                    perfil: perfilParaBanco
                }
            ]);

        if (resultadoInsert.error && perfilParaBanco === "candidato_barbeiro") {
            let msgErro = resultadoInsert.error.message || "";
            if (!msgErro.includes("unique") && !msgErro.includes("duplicate") && resultadoInsert.error.code !== "23505") {
                resultadoInsert = await supabaseClient
                    .from('usuarios')
                    .insert([
                        {
                            nome: nomeSalvo || emailSalvo.split('@')[0],
                            email: emailSalvo,
                            senha_hash: senhaHashSalva,
                            perfil: "cliente"
                        }
                    ]);
            }
        }

        if (resultadoInsert.error) {
            console.error("Erro Supabase:", resultadoInsert.error);
            if (resultadoInsert.error.code === '23505' || resultadoInsert.error.message.includes('unique') || resultadoInsert.error.message.includes('duplicate')) {
                alert("Este e-mail já está cadastrado no sistema!");
            } else {
                alert("Erro ao salvar no banco Supabase: " + resultadoInsert.error.message);
            }
            return;
        }

        console.log("✅ Usuário gravado com sucesso no Supabase!");

        if (perfilSalvo === "candidato_barbeiro") {
            salvarSolicitacaoBarbeiroLocal(nomeSalvo || emailSalvo.split('@')[0], emailSalvo, especialidadeSalva);
        }

        let textoConfirmacao = document.getElementById("textoConfirmacaoCadastro");
        if (textoConfirmacao) {
            if (perfilSalvo === "candidato_barbeiro") {
                textoConfirmacao.innerHTML = "Conta criada e solicitação enviada!<br><b>O Administrador avaliará seu cadastro para habilitar seu perfil de Barbeiro.</b>";
            } else {
                textoConfirmacao.innerHTML = "Conta criada com sucesso!<br><b>Verifique seu e-mail para ativar a conta.</b>";
            }
        }

        document.getElementById("senha_cadastro").value = "";
        document.getElementById("confirmacao_senha").value = "";

        document.querySelector(".etapa_2").style.display = "none";
        document.querySelector(".etapa_3").style.display = "flex";
    } catch (erro) {
        alert("Erro ao processar o cadastro.");
        console.error(erro);
    }
}

function voltarAoLogin() {
    mainContainer.classList.remove("modo_cadastro");
    mainContainer.classList.remove("modo_recuperar");
    document.querySelector(".etapa_1").style.display = "flex";
    document.querySelector(".etapa_2").style.display = "none";
    document.querySelector(".etapa_3").style.display = "none";

    const inputNome = document.getElementById("nome_cadastro");
    if (inputNome) inputNome.value = "";
    document.getElementById("email_cadastro").value = "";
    document.getElementById("senha_cadastro").value = "";
    document.getElementById("confirmacao_senha").value = "";

    const selectPerfil = document.getElementById("perfil_cadastro");
    if (selectPerfil) selectPerfil.value = "cliente";
    const inputEsp = document.getElementById("especialidade_cadastro");
    if (inputEsp) inputEsp.value = "";
    alternarCamposCandidatoBarbeiro();

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

    let isAdmin = (emailDigitado === "admin@teste.com" && senhaDigitada === "123456");
    let isBarbeiro = (emailDigitado === "barbeiro@teste.com" && senhaDigitada === "123456");
    let isCliente = (emailDigitado === "cliente@teste.com" && senhaDigitada === "123456");

    try {
        let usuario = null;
        let senhaValida = false;

        if (!isAdmin && !isBarbeiro && !isCliente) {
            const { data, error } = await supabaseClient
                .from('usuarios')
                .select('*')
                .eq('email', emailDigitado)
                .maybeSingle();

            if (error) {
                console.error("Erro ao consultar Supabase:", error);
                alert("Erro na conexão com o banco de dados: " + error.message);
                return;
            }
            usuario = data;

            if (usuario && usuario.senha_hash) {
                senhaValida = await dcodeIO.bcrypt.compare(senhaDigitada, usuario.senha_hash);
            }
        }

        if (senhaValida || isAdmin || isBarbeiro || isCliente) {
            if (lembrarCheckbox.checked) {
                localStorage.setItem("emailLembrado", emailDigitado);
            } else {
                localStorage.removeItem("emailLembrado");
            }

            if (usuario) {
                let perfilEfetivo = obterPerfilAtualizadoLocal(usuario.email, usuario.perfil);
                sessionStorage.setItem("usuarioLogado", JSON.stringify({
                    id: usuario.id,
                    nome: usuario.nome || usuario.email.split('@')[0],
                    email: usuario.email,
                    perfil: perfilEfetivo
                }));
            } else if (isAdmin) {
                sessionStorage.setItem("usuarioLogado", JSON.stringify({
                    id: 1,
                    nome: "Administrador",
                    email: "admin@teste.com",
                    perfil: "admin"
                }));
            } else if (isBarbeiro) {
                sessionStorage.setItem("usuarioLogado", JSON.stringify({
                    id: 5,
                    nome: "Gabriel Cavalheiro",
                    email: "gabrielrcl26@yahoo.com.br",
                    perfil: "barbeiro"
                }));
            } else if (isCliente) {
                sessionStorage.setItem("usuarioLogado", JSON.stringify({
                    id: 3,
                    nome: "Kauan Souza",
                    email: "cliente@teste.com",
                    perfil: "cliente"
                }));
            }

            console.log("✅ Login autenticado com sucesso!");
            window.location.href = "../dashboard/RF-008-painel-de-metricas-financeiras.html";
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

if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark-mode");
    btnTema.textContent = "☀️";
}

btnTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        btnTema.textContent = "☀️";
        localStorage.setItem("tema", "dark");
    } else {
        btnTema.textContent = "🌙";
        localStorage.setItem("tema", "light");
    }
});
