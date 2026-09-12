const linkCriar = document.querySelector(".link_criar");
const mainContainer = document.querySelector(".conteudo_pagina")

linkCriar.addEventListener("click", (evento) => {
    evento.preventDefault();
    mainContainer.classList.add("modo_cadastro");
});

function validarEmail() {
    var email = document.getElementById("email_cadastro").value;
    var formatoValido = email.includes("@") && email.includes(".");
    if (email === "") {
        alert("Por favor, preencha o e-mail.");
        return;
    }
    if (!formatoValido) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }
    // aqui esconde a etapa 1 quando o validarEmail for = true; e traz a etapa 2 de verificar senha
    document.querySelector(".etapa_1").style.display = "none";
    document.querySelector(".etapa_2").style.display = "flex";
}

function verificarSenhas() {
    var senha = document.getElementById("senha_cadastro").value;
    var confirmacao = document.getElementById("confirmacao_senha").value;
    if (senha !== confirmacao) {
        alert("As senhas não coincidem! Tente novamente.");
        return;
    }
    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }
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