const linkCriar = document.querySelector(".link_criar");
const mainContainer = document.querySelector(".conteudo_pagina")
let emailSalvo = "";
let senhaSalva = "";

linkCriar.addEventListener("click", (evento) => {
    evento.preventDefault();
    mainContainer.classList.add("modo_cadastro");
});

// FUNÇÕES
function validarEmailCadastro() {
    let email = document.getElementById("email_cadastro").value;
    let formatoValido = email.includes("@") && email.includes(".");
    if (email === "") {
        alert("Por favor, preencha o e-mail.");
        return;
    }
    if (!formatoValido) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    // armazenei o e-mail digitado
    emailSalvo = email;

    // aqui esconde a etapa 1 quando o validarEmail for = true; e traz a etapa 2 de verificar senha
    document.querySelector(".etapa_1").style.display = "none";
    document.querySelector(".etapa_2").style.display = "flex";
}
function verificarSenhas() {
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
    // armazenei a senha digitada
    senhaSalva = senha;
    // aqui esconde a etapa 2 quando o verificarSenhas for = true; e traz a etapa 3 de confirmação do cadastro
    document.querySelector(".etapa_2").style.display = "none";
    document.querySelector(".etapa_3").style.display = "flex";
}
function voltarAoLogin() {
    // 1. sai do cadastro e volta pro login
    mainContainer.classList.remove("modo_cadastro");
    // 2. reseta tudo pra cadastrar de novo (caso necessário)
    document.querySelector(".etapa_1").style.display = "flex";
    document.querySelector(".etapa_2").style.display = "none";
    document.querySelector(".etapa_3").style.display = "none";
}
function fazerLogin() {


    // puxar os dados de cadastro pra armazenar e rodar a função
    let emailDigitado = document.getElementById("email_login").value;
    let senhaDigitada = document.getElementById("senha").value;

    // pra não aceitar qualquer e-mail ou senha (vazio incluso)
    if (emailDigitado === "" || senhaDigitada === "") {
        alert("Por favor, preencha o e-mail e a senha!");
        return;
    }
    // verificação do cadastro pro login
    if ((emailDigitado === emailSalvo && senhaDigitada === senhaSalva) ||
        (emailDigitado === "admin@teste.com" && senhaDigitada === "123456")) {
        alert("Login autorizado!")
        //  window.location.href = "pages/dashboard.html"; futura implementação da dashboard pós-login efetuado
    } else {
        alert("E-mail ou senha incorretos.")
    }
}