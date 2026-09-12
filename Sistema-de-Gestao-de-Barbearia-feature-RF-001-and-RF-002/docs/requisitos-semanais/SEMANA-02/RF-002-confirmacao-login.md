# 📋 ENTREGA SEMANAL DE REQUISITOS — SEMANA-02
**Versão:** 12.2  
**Laboratório de Inovação II -** Prof. Edilberto Silva — 2026  
**Formato:** Markdown (padrão de correção automatizada)  
**Valor Total da Entrega:** 100%  
**Data de Entrega:** 12/09/2026  
**Grupo:** Barbearia - Grupo 05 (BarberFlow)  
**Integrantes:**
* Braynt Oliveira (braynt62123906@edu.df.senac.br)
* Cauê Schwantes (caue62139126@edu.df.senac.br)
* Gabriel Lima (gabriel61889806@edu.df.senac.br)
* Kauan Souza (kauan61701296@edu.df.senac.br)
* Pedro Quartieri (pedro54660396@edu.df.senac.br)

---

### ⚙️ ESTRUTURA DE DIRETÓRIOS

```text
barberflow/
├── docs/
│   ├── requisitos-semanais/
│   │   ├── SEMANA-02/
│   │   │   └── RF-002-confirmacao-login.md (ESTE ARQUIVO - ENTREGAR)
│
├── src/
│   ├── prototipos/
│   │   ├── SEMANA-02/
│   │   │   ├── RF-002-confirmacao-login/
│   │   │   │   ├── index.html (tela de Login / Autenticação)
│   │   │   │   ├── styles/
│   │   │   │   │   └── style.css (CSS responsivo do portal de acesso)
│   │   │   │   └── assets/
│   │   │       ├── barbearia.jpg
│   │   │       └── icone_barbearia.jpg
```

* **Localização deste arquivo:** `docs/requisitos-semanais/SEMANA-02/RF-002-confirmacao-login.md`
* **Localização do Protótipo HTML+CSS:** `src/prototipos/SEMANA-02/RF-002-confirmacao-login/index.html` ⚠️ **OBRIGATÓRIO**

---

### 📊 PONTUAÇÃO POR TÓPICO (Autodeclaração de Conformidade)

| # | Tópico | Percentual | Obrigatoriedade | Status |
|---|---|---|---|---|
| 1 | **Identificação do Requisito** | 10% | Obrigatório | [x] |
| 2 | **Descrição e Atores** | 15% | Obrigatório | [x] |
| 3 | **Especificação de Casos de Uso** | 25% | Obrigatório | [x] |
| 4 | **Protótipos/Telas (HTML+CSS)** | 20% | **OBRIGATÓRIO** ⚠️ | [x] |
| 5 | **Arquitetura e ADR** | 20% | Obrigatório | [x] |
| 6 | **Qualidade e Conformidade** | 10% | Obrigatório | [x] |
| | **TOTAL** | **100%** | | |

---

### 1️⃣ IDENTIFICAÇÃO DO REQUISITO (10%)

#### RF-002: Autenticação e Confirmação de Login (BarberFlow)

* **ID:** RF-002
* **Título:** Validação de credenciais de login (E-mail e Senha) e autenticação de sessão de usuário
* **Tipo:** Requisito Funcional
* **Prioridade:** ALTA (Bloqueia o acesso de usuários não autorizados às funcionalidades protegidas do sistema)
* **Complexidade:** MÉDIA (Estimado 5 story points)
* **Status:** EM DESENVOLVIMENTO
* **Data de Criação:** 05/09/2026
* **Última Atualização:** 12/09/2026

**Breve Descrição:**  
O sistema **BarberFlow** deve validar de forma segura e responsiva as credenciais de acesso (E-mail e Senha) fornecidas pelo usuário no portal de login (`index.html`), efetuando a autenticação junto ao backend Express.js/MySQL, checando o hash criptográfico via Bcrypt e emitindo o token de sessão JWT de confirmação para validar o acesso do usuário.

---

### 2️⃣ DESCRIÇÃO E ATORES (15%)

#### Descrição Detalhada

**Por que este requisito existe?**  
O sistema BarberFlow necessita de um módulo de autenticação e confirmação de login refinado para:

* **Validar Identidade:** Garantir que o e-mail informado corresponda a um cadastro ativo e que a senha enviada coincida perfeitamente com o hash criptografado (Bcrypt) armazenado na base de dados.
* **Controlar Sessões de Acesso:** Gerar tokens de sessão dinâmicos e seguros (JWT), permitindo que o sistema reconheça a identidade do usuário autenticado em requisições subsequentes.
* **Mitigar Ataques de Segurança:** Proteger a barbearia contra tentativas ilícitas de acesso, bloqueando contas temporariamente após 5 tentativas falhas de login (proteção contra ataques de força bruta).
* **Oferecer Feedback Claro ao Usuário (UX):** Apresentar estados visuais nítidos de progresso (carregando/loading), mensagens de validação sintática e respostas genéricas de erro para não expor a existência de e-mails na base.
* **Garantir Rastreabilidade:** Persistir logs de auditoria imutáveis com o histórico de tentativas de autenticação (IP, timestamp e resultado da transação).

**Contexto do Negócio:**  
Ao acessar a página de autenticação (`index.html`), o usuário (Cliente, Barbeiro ou Administrador) insere suas credenciais. O frontend executa a higienização dos dados no cliente e dispara uma requisição segura para o backend. O servidor valida a combinação de e-mail e senha, verifica se o perfil está ativo e confirma o login, retornando o token de sessão que autoriza o usuário a operar na plataforma BarberFlow.

---

#### Atores do Sistema

##### 1. CLIENTE (Ator Principal)
* **Papel:** Inserir suas credenciais de e-mail e senha na tela de login para validar sua conta no sistema.
* **Responsabilidade:** Manter o sigilo de suas credenciais de acesso e fornecer dados válidos.
* **Permissões:**
  * ✅ CREATE (submeter credenciais para autenticação de login)
  * ✅ READ (visualizar confirmação de sessão e dados de perfil)
  * ❌ UPDATE / DELETE (sem permissão sobre dados de outros usuários)

##### 2. BARBEIRO / COLABORADOR (Ator Secundário)
* **Papel:** Autenticar-se no sistema com credenciais corporativas para confirmar sua escala de trabalho.
* **Responsabilidade:** Acessar a plataforma exclusivamente com sua conta individualizada.
* **Permissões:**
  * ✅ CREATE (autenticar-se na plataforma)
  * ✅ READ (visualizar confirmação de acesso de colaborador)
  * ❌ DELETE (sem permissão de gestão de usuários)

##### 3. ADMINISTRADOR (Dono/Gerente da Barbearia)
* **Papel:** Autenticar-se com perfil administrativo de alto nível para gerenciar a barbearia.
* **Responsabilidade:** Supervisionar os acessos e manter a segurança das contas administrativas.
* **Permissões:**
  * ✅ CREATE / READ / UPDATE / DELETE (permissões completas no sistema de gestão)

##### 4. SISTEMA (Ator Automático)
* **Papel:** Processar a validação das credenciais, consultar o MySQL, verificar o hash Bcrypt e gerar o token JWT de confirmação.
* **Responsabilidade:** Executar a validação em tempo hábil (< 500ms), bloquear robôs e gravar logs de auditoria.
* **Permissões:**
  * ✅ Todas as operações transacionais de autenticação e segurança.

---

### 3️⃣ ESPECIFICAÇÃO DE CASOS DE USO (25%)

#### UC-002: Autenticar e Validar Login de Usuário

##### Pré-Condições
* ✅ Usuário cadastrado na tabela `usuarios` do banco MySQL.
* ✅ Servidor de backend Express.js operacional.
* ✅ Protocolo HTTPS ativo.

##### Pós-Condições (Sucesso)
* ✅ Credenciais de e-mail e senha validadas com sucesso pelo Bcrypt.
* ✅ Token de acesso JWT gerado e retornado para a sessão do cliente.
* ✅ Status de login verificado e sessão iniciada.
* ✅ Log de auditoria persistido contendo `user_id`, `timestamp` e `ip_origem`.

##### Pós-Condições (Falha)
* ✅ Exibição de mensagem de erro genérica ("E-mail ou senha incorretos").
* ✅ Sessão de login não criada e campos de entrada limpos.
* ✅ Registro da tentativa malsucedida no log de segurança.

---

##### Fluxo Principal (F1 - Validação e Confirmação de Login)

1. O usuário acessa a página de login do BarberFlow (`index.html`).
2. O sistema renderiza a interface responsiva com os campos de "E-mail" e "Senha".
3. O usuário preenche o e-mail de acesso e a senha cadastrada.
4. O usuário clica no botão "Entrar".
5. O JavaScript do frontend executa a validação sintática (formato de e-mail e preenchimento dos campos).
6. O frontend ativa o estado visual de carregamento (*loading spinner*) e desabilita o botão para evitar cliques duplos.
7. O frontend envia uma requisição HTTP `POST` para a API no endpoint `/api/auth/login` transportando `{ email, senha }`.
8. O backend recebe a requisição e busca o e-mail na tabela `usuarios` do banco de dados MySQL.
9. O backend utiliza a biblioteca Bcrypt (`bcrypt.compare`) para comparar a senha informada com o hash salvo no banco.
10. O backend valida se a conta está ativa (`ativo = TRUE`) e se não possui bloqueio temporário ativo.
11. O backend gera o token JSON Web Token (JWT) assinado contendo o ID e perfil do usuário.
12. O backend responde com HTTP Status `200 OK`, retornando o token de confirmação de login e estabelecendo a sessão do usuário.

---

##### Fluxos Alternativos (FA)

**FA1 - Credenciais Incorretas (E-mail não encontrado ou Senha inválida)**
1. No passo 8 ou 9 do Fluxo Principal, se o e-mail não existir no MySQL ou a senha não coincidir com a hash Bcrypt:
2. O backend registra a falha de tentativa para o e-mail informado.
3. O backend responde com HTTP Status `401 Unauthorized` e payload genérico: *"E-mail ou senha incorretos. Por favor, tente novamente."*
4. O frontend desativa o estado de carregamento, exibe mensagem de alerta visual e limpa o campo de senha.
5. O caso de uso recomeça.

**FA2 - Formato de E-mail Inválido no Cliente (Validação Sintática)**
1. No passo 5 do Fluxo Principal, se o e-mail informado não contiver a sintaxe válida (ex: sem `@` ou `.`):
2. O frontend interrompe o envio da requisição para o servidor backend.
3. O campo e-mail recebe destaque visual em vermelho com o texto: *"Insira um endereço de e-mail válido."*
4. O caso de uso recomeça no cliente sem consumir banda do servidor.

**FA3 - Bloqueio por Tentativas Excessivas (Proteção Anti-Brute-Force)**
1. Se o mesmo e-mail acumular 5 tentativas seguidas de login sem sucesso no intervalo de 1 hora:
2. O backend suspende temporariamente a autenticação daquele e-mail por 15 minutos.
3. O backend retorna HTTP Status `403 Forbidden` com a mensagem: *"Conta bloqueada temporariamente por motivos de segurança. Tente novamente em 15 minutos."*
4. O caso de uso é encerrado.

---

#### Regras de Negócio (RN)

* **RN-01 (Verificação de Hash Criptográfico):** A validação da senha informada no login deve obrigatoriamente ser efetuada via comparação segura do algoritmo **Bcrypt (salt factor 12)** contra a tabela `usuarios`.
* **RN-02 (Mensagem Genérica Anti-Enumeração):** As respostas de erro para autenticação falha devem ser estritamente genéricas ("E-mail ou senha incorretos"), impedindo ataques de enumeração de contas.
* **RN-03 (Emissão de Token JWT):** A confirmação de login bem-sucedida deve resultar na emissão de um **Token JWT (JSON Web Token)** assinado com chave secreta do servidor.
* **RN-04 (Validação Sintática Obrigatória):** A requisição de login só pode ser despachada ao backend se o e-mail atender aos padrões de sintaxe web e a senha possuir no mínimo 6 caracteres.
* **RN-05 (Bloqueio Anti-Robô / Brute-Force):** O sistema deve suspender por 15 minutos o acesso a uma conta após 5 tentativas consecutivas de autenticação incorreta.
* **RN-06 (Persistência de Logs de Segurança):** Toda tentativa de autenticação (bem-sucedida ou recusada) deve gerar um log imutável contendo `user_id`, `timestamp`, `ip_origem` e `status`.

---

#### Requisitos Não-Funcionais (RNF)

* **RNF-01 (Tempo de Resposta de Autenticação):** O tempo total do processo de validação da senha (Bcrypt + MySQL + JWT) não deve exceder **500ms**.
* **RNF-02 (Comunicação Segura HTTPS):** Toda a troca de dados entre o formulário de login e a API de autenticação deve trafegar sob protocolo **HTTPS (TLS 1.3)**.
* **RNF-03 (Responsividade Mobile-First):** O formulário de login deve ser 100% responsivo, adaptando-se a dispositivos móveis a partir de **320px** até monitores de **1024px+**.
* **RNF-04 (Rastreabilidade de Acesso):** Os registros de logs de auditoria de autenticação devem ser imutáveis e mantidos por no mínimo 1 ano.
* **RNF-05 (Expiração de Sessão JWT):** O token de sessão gerado na confirmação do login deve ter validade máxima de 60 minutos, exigindo nova autenticação após expirar.
* **RNF-06 (Proteção contra Submissão Dupla):** O botão "Entrar" deve ser desabilitado instantaneamente ao ser clicado para evitar requisições concorrentes.

---

### 4️⃣ PROTÓTIPOS/FLUXOS DE TELAS (HTML+CSS) (20%)

O protótipo visual representa o fluxo completo da Semana 02 do **BarberFlow**:

* **Localização exata dos arquivos no repositório:**
  * Login / Autenticação: `src/prototipos/SEMANA-02/RF-002-confirmacao-login/index.html`
  * Estilos Compartilhados: `src/prototipos/SEMANA-02/RF-002-confirmacao-login/styles/style.css`
  * Imagens do Tema: `src/prototipos/SEMANA-02/RF-002-confirmacao-login/assets/barbearia.jpg` e `icone_barbearia.jpg`

---

#### Estados de Interface Implementados:

##### 1. Estado 1: Formulário Vazio (Estado Inicial)
* Exibe os campos de "E-mail" e "Senha" limpos, com a marca BarberFlow em destaque, caixa "Lembrar-me" desmarcada e botão "Entrar" ativo.

##### 2. Estado 2: Preenchido e Validação Sintática Positiva
* Ao digitar um e-mail com formato válido (`usuario@dominio.com`) e senha com 6+ caracteres, os inputs mantêm bordas sutis e o botão fica pronto para ação. Se o formato do e-mail for inválido, o input recebe borda vermelha indicativa.

##### 3. Estado 3: Carregando / Autenticando (State: Loading)
* Ao clicar em "Entrar", o botão é desabilitado, seu texto muda para "Autenticando..." acompanhado por um spinner giratório CSS, impedindo múltiplos cliques.

##### 4. Estado 4: Erro de Autenticação (Credenciais Inválidas)
* Exibe uma caixa de erro em vermelho no topo do formulário com a mensagem: *"E-mail ou senha incorretos. Por favor, tente novamente."*, mantendo o e-mail preenchido e limpando a senha.

##### 5. Estado 5: Autenticação Concluída / Sessão Confirmada (Sucesso)
* Após o retorno `200 OK` da API, a tela exibe mensagem de sucesso visual indicando login verificado e libera a sessão ativa do usuário.

---

#### Checklist de Conformidade Atendido (10/10):

* ✅ HTML5 estruturado semanticamente (`header`, `main`, `section`, `form`, `label`, `input`).
* ✅ Design 100% responsivo adaptável a dispositivos móveis via CSS Media Queries em `768px`.
* ✅ Estilos modulares e padronizados em `styles/style.css`.
* ✅ Validação dinâmicas no cliente via JavaScript nativo para gerenciamento dos 5 estados visuais da tela.

---

### 5️⃣ ARQUITETURA E ADR (20%)

#### Arquitetura de Componentes da Solução

O fluxo de autenticação e validação de login opera no modelo **Cliente-Servidor de N-Camadas**:

```text
  [ CLIENTE / BROWSER ] 
         │ (Validação Sintática no Form)
         ▼
  [ NAVEGADOR (POST /api/auth/login) ]
         │ (Protocolo HTTPS / TLS 1.3)
         ▼
  [ SERVER / BACKEND (Express.js) ] ──► [ CONTROLADOR AUTHENTICATION ]
         │                                       │
         │ (Validação de Hash Bcrypt)            ▼
         ├───────────────────────────────► [ EMITE TOKEN JWT ]
         │                                       │
         ▼ (Driver TCP/IP MySQL)                 ▼
  [ BANCO DE DADOS (MySQL 8) ] ◄─────── [ RETORNA SESSÃO CONFIRMADA ]
  (Tabelas: usuarios, perfis)
```

---

#### Registro de Decisão de Arquitetura (ADR)

##### ADR-001: Autenticação Stateless com JSON Web Token (JWT)
* **Status:** ACEITO
* **Contexto:** O sistema BarberFlow precisa confirmar a autenticação do usuário e emitir um comprovante de sessão seguro que possa ser validado sem armazenar estados pesados na memória do servidor.
* **Decisão:** Adotar **JSON Web Tokens (JWT)** assinados para gerenciar a confirmação de login. O token contém o ID do usuário e seu perfil, assinado criptograficamente pela chave privada da API.
* **Alternativas Analisadas:**
  * *Express-Session (Cookies de Sessão no Servidor):* Descartado por exigir banco em memória (Redis) e prender estado no servidor.
* **Consequências:**
  * ✅ Arquitetura *stateless* e escalável para autenticação de APIs.
  * ✅ O servidor valida a autenticação apenas checando a assinatura do JWT.
  * ⚠️ Requer definição de tempo de expiração curto para segurança.

---

##### ADR-002: Bcrypt para Hashing Criptográfico de Senhas
* **Status:** ACEITO
* **Contexto:** A validação de login exige comparar a senha digitada no formulário com o dado armazenado no MySQL. As senhas nunca podem ser armazenadas em texto puro.
* **Decisão:** Utilizar a biblioteca **Bcrypt (salt factor 12)** para realizar a comparação irreversível e segura da senha no momento do login.
* **Alternativas Analisadas:**
  * *SHA-256 / MD5:* Descartados por serem vulneráveis a ataques de aceleração por GPU e tabelas de busca (*rainbow tables*).
* **Consequências:**
  * ✅ Alta resistência contra ataques de dicionário e força bruta.
  * ✅ Padrão recomendado pela OWASP para proteção de credenciais.
  * ⚠️ Requer processamento de CPU adicional a cada tentativa de login.

---

##### ADR-003: MySQL 8 para Persistência de Dados de Usuários
* **Status:** ACEITO
* **Contexto:** O processo de login precisa consultar rapidamente os dados cadastrais do usuário e recuperar seu hash de senha e perfil de acesso.
* **Decisão:** Utilizar o SGBD relacional **MySQL 8+** com tabelas indexadas no campo `email`.
* **Alternativas Analisadas:**
  * *MongoDB:* Descartado pela ausência de chaves estrangeiras rígidas para associar usuários e perfis.
* **Consequências:**
  * ✅ Integridade ACID garantida durante as consultas de autenticação.
  * ✅ Alta velocidade de resposta com índice na coluna `email`.
  * ⚠️ Exige manutenção de migrations estruturadas no banco de dados.

---

#### Tabela de Tecnologias Escolhidas e Justificativas

| Camada | Tecnologia | Versão | Justificativa Técnica |
|---|---|---|---|
| **Apresentação (Front)** | HTML5 / CSS3 / Vanilla JS | ES2015+ | Padrão web leve, sem dependências externas, garantindo alta velocidade de carregamento e responsividade móvel. |
| **Servidor (Backend)** | Express.js (Node.js) | 4.18+ | Framework minimalista e rápido para gerenciar as rotas da API REST de autenticação de login. |
| **Persistência (BD)** | MySQL | 8+ | Banco relacional clássico de alta performance que garante a integridade e busca rápida de credenciais. |
| **Segurança de Sessão** | JWT (jsonwebtoken) | 9.0+ | Padrão aberto (RFC 7519) para emissão de tokens de confirmação de sessão de forma stateless. |
| **Hash de Senha** | Bcrypt | 5+ | Padrão OWASP para verificação irreversível e segura de senhas de acesso. |

---

### 6️⃣ QUALIDADE E CONFORMIDADE (10%)

#### Checklist de Qualidade Documental:

* ✅ **Zero Erros Ortográficos:** Texto revisado criteriosamente em português do Brasil.
* ✅ **Markdown Estruturado:** Uso rigoroso de tabelas, cabeçalhos de níveis claros e blocos de código formatados para leitura automatizada da banca.
* ✅ **Syntax Highlighting:** Todos os diagramas em ASCII art e blocos de código possuem realce de sintaxe em Markdown.
* ✅ **Fidelidade de Caminhos:** Todos os caminhos de arquivos refletem com exatidão a estrutura do repositório no GitHub.
* ✅ **Limpeza Integral de Template:** Todas as instruções em azul e textos genéricos do template v12.2 foram 100% removidos.

---

**Fim da Especificação Técnica do Módulo de Autenticação e Confirmação de Login (RF-002)**  
*BarberFlow - Sistema de Gestão de Barbearia — 2026.*
