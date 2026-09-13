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

### ⚙️ ESTRUTURA DE DIRETÓRIOS (Conforme Padrão v12.2)

```text
barberflow/
├── docs/
│   ├── requisitos-semanais/
│   │   ├── SEMANA-01/
│   │   │   └── RF-001-autenticacao-cadastro.md
│   │   └── SEMANA-02/
│   │       └── RF-002-confirmacao-login.md (ESTE ARQUIVO - ENTREGAR)
│
├── src/
│   ├── prototipos/
│   │   ├── SEMANA-02/
│   │   │   ├── RF-002-confirmacao-login/
│   │   │   │   ├── index.html (Portal de Acesso e Cadastro Dinâmico em Etapas)
│   │   │   │   ├── style.css (Estilo CSS unificado - Princípio DRY aplicado)
│   │   │   │   ├── app.js (Lógica de validação de login e fluxo de etapas)
│   │   │   │   └── assets/
│   │   │       ├── barbearia.jpg (Imagem de fundo com overlay escuro)
│   │   │       └── icone_barbearia.jpg (Ícone da marca BarberFlow)
```

* **Localização deste arquivo:** `docs/requisitos-semanais/SEMANA-02/RF-002-confirmacao-login.md`
* **Localização do Protótipo Funcional:** `src/prototipos/SEMANA-02/RF-002-confirmacao-login/index.html` ⚠️ **OBRIGATÓRIO**

---

### 📊 PONTUAÇÃO POR TÓPICO (Autodeclaração de Conformidade)

| # | Tópico | Percentual | Obrigatoriedade | Status |
|---|---|---|---|---|
| 1 | **Identificação do Requisito** | 10% | Obrigatório | [x] |
| 2 | **Descrição e Atores** | 15% | Obrigatório | [x] |
| 3 | **Especificação de Casos de Uso** | 25% | Obrigatório | [x] |
| 4 | **Protótipos/Telas (HTML+CSS+JS)** | 20% | **OBRIGATÓRIO** ⚠️ | [x] |
| 5 | **Arquitetura e ADR** | 20% | Obrigatório | [x] |
| 6 | **Qualidade e Conformidade** | 10% | Obrigatório | [x] |
| | **TOTAL** | **100%** | | |

---

### 1️⃣ IDENTIFICAÇÃO DO REQUISITO (10%)

#### RF-002: Validação de Credenciais e Confirmação de Login (BarberFlow)
* **ID:** RF-002
* **Título:** Validação de credenciais de login (E-mail e Senha) e confirmação de acesso do usuário
* **Tipo:** Requisito Funcional
* **Prioridade:** ALTA (Condição necessária para permitir a entrada de usuários e navegação no sistema)
* **Complexidade:** MÉDIA (Estimado 5 story points)
* **Status:** CONCLUÍDO
* **Data de Criação:** 05/09/2026
* **Última Atualização:** 12/09/2026

**Breve Descrição:**  
O sistema **BarberFlow** deve validar de forma segura, dinâmica e responsiva as credenciais de acesso (E-mail e Senha) inseridas pelo usuário na tela de login (`index.html`), checando o preenchimento obrigatório e a conformidade dos dados contra as informações cadastradas em memória pelo usuário (`emailSalvo` e `senhaSalva`) ou contra a credencial administrativa padrão de homologação (`admin@teste.com` / `123456`), emitindo alertas visuais imediatos de sucesso ou de erro sintático/lógico via JavaScript nativo (`app.js`).

---

### 2️⃣ DESCRIÇÃO E ATORES (15%)

#### Descrição Detalhada

**Por que este requisito existe?**  
O sistema BarberFlow necessita de um fluxo seguro e confiável de validação de login para:
* **Impedir Submissões Vazias:** Garantir que tentativas de autenticação sem preenchimento de e-mail e senha sejam imediatamente bloqueadas na interface.
* **Integrar Cadastro e Login:** Permitir que novos usuários realizem o cadastro interativo em etapas (`validarEmailCadastro()` e `verificarSenhas()`), armazenem seus dados em variáveis de escopo (`emailSalvo` e `senhaSalva`) e consigam realizar o login logo em seguida com suas próprias credenciais.
* **Facilitar Homologação e Demonstração:** Disponibilizar uma credencial padrão de teste (`admin@teste.com` / `123456`) para que avaliadores e o professor possam testar o acesso imediato sem necessidade obrigatória de criar uma conta a cada teste.
* **Prover Feedback Imediato:** Apresentar alertas claros e objetivos via navegador (`alert()`) orientando o usuário sobre o resultado da operação ("Login autorizado!" ou "E-mail ou senha incorretos.").
* **Garantir Experiência Fluida (UX):** Permitir a alternância entre a tela de login e o formulário de cadastro na mesma página, sem recarregar o navegador e sem perder o estado das variáveis.

**Contexto do Negócio:**  
Ao abrir o **BarberFlow** (`index.html`), o cliente ou administrador visualiza a marca, o slogan motivador e o formulário de Portal de Acesso. Caso já possua dados cadastrados (ou utilize o usuário de teste), digita suas credenciais e clica em "Entrar", disparando a função `fazerLogin()`. Caso seja um novo usuário, clica no link *"Não tem uma conta? Crie aqui!"*, que ativa a transição visual suave para o cadastro em 3 etapas sequenciais com validações em tempo real.

---

#### Atores do Sistema

##### 1. CLIENTE (Ator Principal)
* **Papel:** Inserir suas credenciais de login ou realizar o cadastro sequencial para confirmar o acesso.
* **Responsabilidade:** Preencher dados no formato correto e fornecer e-mail e senha correspondentes aos cadastrados.
* **Permissões:**
  * ✅ Realizar cadastro em 3 etapas (E-mail ➔ Senhas ➔ Confirmação)
  * ✅ Executar a ação de login para autenticação no sistema
  * ✅ Visualizar alertas de retorno e confirmação de acesso

##### 2. ADMINISTRADOR (Ator Secundário)
* **Papel:** Validar o acesso imediato à plataforma utilizando as credenciais padrão de homologação.
* **Responsabilidade:** Testar as regras de permissão e fluxo de entrada do sistema.
* **Permissões:**
  * ✅ Autenticar-se de forma direta com o usuário de teste administrativo (`admin@teste.com` / `123456`)

##### 3. SISTEMA / JAVASCRIPT NATIVO (Ator Automático)
* **Papel:** Capturar os eventos de clique, validar a sintaxe dos campos, gerenciar as classes CSS de transição e comparar os valores digitados com o estado em memória.
* **Responsabilidade:** Executar as validações sem recarregamento da página e emitir os feedbacks visuais adequados.
* **Permissões:**
  * ✅ Manipulação do DOM (`document.getElementById`, `classList.add`, `style.display`)

---

### 3️⃣ ESPECIFICAÇÃO DE CASOS DE USO (25%)

#### UC-002: Autenticar e Validar Login no BarberFlow

##### Pré-Condições
* ✅ Navegador web moderno atualizado (Chrome, Edge, Firefox ou Safari).
* ✅ Arquivo `index.html` carregado com seus vínculos a `style.css` e `app.js`.

##### Pós-Condições (Sucesso)
* ✅ Feedback visual positivo emitido ("Login autorizado!").
* ✅ Preparação para redirecionamento da sessão (`pages/dashboard.html`).

##### Pós-Condições (Falha)
* ✅ Emissão de alerta específico informando o motivo do erro (campos em branco ou credenciais incorretas).
* ✅ Permanência na tela de login para nova tentativa do usuário.

---

##### Fluxo Principal (F1 - Autenticação e Confirmação de Login)

1. O usuário acessa a página inicial do BarberFlow (`index.html`).
2. O sistema renderiza o layout com o painel de boas-vindas à esquerda e o card de "Portal de Acesso" à direita.
3. O usuário preenche o campo de e-mail (`#email_login`) e o campo de senha (`#senha`).
4. O usuário clica no botão "Entrar" (`onclick="fazerLogin()"`).
5. A função `fazerLogin()` no arquivo `app.js` é executada.
6. O sistema captura os valores dos inputs e verifica se algum dos campos está vazio.
7. O sistema compara os dados informados:
   * Verifica se coincidem com os valores salvos no cadastro em memória (`emailSalvo` e `senhaSalva`), **OU**
   * Verifica se coincidem com a credencial padrão de teste (`admin@teste.com` e `123456`).
8. As credenciais coincidem com sucesso.
9. O sistema dispara a mensagem visual de confirmação: `alert("Login autorizado!")`.
10. O fluxo é finalizado com sucesso.

---

##### Fluxos Alternativos (FA)

**FA1 - Campos em Branco no Login**
1. No passo 6 do Fluxo Principal, se o usuário deixar o e-mail ou a senha em branco e clicar em "Entrar":
2. O sistema interrompe a verificação e exibe o alerta: *"Por favor, preencha o e-mail e a senha!"*.
3. O cursor permanece na tela para preenchimento.

**FA2 - Credenciais Incorretas**
1. No passo 7 do Fluxo Principal, se os valores digitados não coincidirem com as credenciais salvas nem com a conta de teste:
2. O sistema exibe o alerta: *"E-mail ou senha incorretos."*.
3. O usuário permanece no formulário de login para corrigir os dados.

**FA3 - Cadastro Prévio de Novo Usuário (Alimentação do Estado em Memória)**
1. No passo 3 do Fluxo Principal, caso o usuário não possua conta cadastrada, clica no link *"Não tem uma conta? Crie aqui!"* (`.link_criar`).
2. O ouvinte de evento (`addEventListener`) adiciona a classe `.modo_cadastro` ao container principal:
   * O card de login e o texto lateral são ocultados com uma transição suave (`opacity: 0`).
   * O card de cadastro (`form_cadastro`) surge centralizado na tela na Etapa 1.
3. O usuário digita seu e-mail e clica no botão "Avançar" (`onclick="validarEmailCadastro()"`):
   * Se o e-mail não contiver `@` e `.`, é exibido o alerta: *"Por favor, insira um e-mail válido."*.
   * Se for válido, o sistema salva o valor na variável `emailSalvo`, oculta a `.etapa_1` e exibe a `.etapa_2`.
4. Na Etapa 2, o usuário insere a senha e a confirmação de senha e clica em "Finalizar Cadastro" (`onclick="verificarSenhas()"`):
   * Se as senhas divergirem, exibe: *"As senhas não coincidem! Tente novamente."*.
   * Se a senha tiver menos de 6 dígitos, exibe: *"A senha deve ter pelo menos 6 caracteres."*.
   * Se atender aos critérios, salva o valor na variável `senhaSalva`, oculta a `.etapa_2` e exibe a `.etapa_3`.
5. Na Etapa 3, o sistema exibe a mensagem de conta criada com sucesso.
6. O usuário clica em "Voltar à página de login" (`onclick="voltarAoLogin()"`):
   * A classe `.modo_cadastro` é removida, retornando o layout para o formulário de login.
   * O formulário de cadastro é resetado internamente para a `.etapa_1`.
7. O usuário insere o e-mail e senha recém-cadastrados e clica em "Entrar", obtendo a confirmação `"Login autorizado!"` no Fluxo Principal.

---

#### Regras de Negócio (RN)

* **RN-01 (Obrigatoriedade de Preenchimento):** Os campos de e-mail e senha são de preenchimento obrigatório para submissão do login.
* **RN-02 (Validação Sintática de E-mail):** O campo de e-mail no cadastro deve conter obrigatoriamente os caracteres `@` e `.` para ser aceito pelo sistema.
* **RN-03 (Política de Senha Mínima):** Toda senha cadastrada deve possuir comprimento mínimo de 6 caracteres (`senha.length >= 6`).
* **RN-04 (Consistência de Senha e Confirmação):** A confirmação de senha deve ser rigorosamente idêntica à senha digitada para autorizar a conclusão do cadastro.
* **RN-05 (Autenticação Armazenada em Memória):** O login é validado comparando os dados informados com as variáveis de estado do navegador (`emailSalvo` e `senhaSalva`) ou com a credencial administrativa fixa de homologação.
* **RN-06 (Transição de Telas Sem Recarregamento):** A transição entre login e cadastro deve operar de forma contínua via manipulação de classes CSS, preservando os dados salvos em memória.

---

#### Requisitos Não-Funcionais (RNF)

* **RNF-01 (Responsividade Mobile-First):** O layout adapta-se a telas de smartphones via CSS Media Queries (`@media (max-width: 768px)`), ocultando elementos decorativos laterais e centralizando o card de formulário.
* **RNF-02 (Execução Leve no Cliente):** O protótipo funciona de forma 100% nativa no navegador (JS e CSS puro), sem necessidade de instalação de dependências ou servidores nesta fase de entrega.
* **RNF-03 (Feedback Visual Imediato):** Toda validação ou tentativa de login responde instantaneamente ao clique do usuário por meio de alertas do navegador.
* **RNF-04 (Animações Fluídas de Interface):** Uso de animação `@keyframes fadeIn` e transições de `transform` e `opacity` para proporcionar uma experiência visual moderna e profissional.

---

### 4️⃣ PROTÓTIPOS/FLUXOS DE TELAS (HTML+CSS+JS) (20%)

> 💡 **Nota de Evolução em Relação ao Feedback da Semana 01:**  
> Na revisão da Semana 01, foram apontadas duplicações de código entre `style.css` e `cadastro.css` e a falta de arquivos HTML separados. Para a **Semana 02**, o grupo refatorou a arquitetura para um modelo de **Componente Único Dinâmico**: todos os estilos foram unificados em `style.css` (eliminando 100% do código duplicado e aplicando o princípio DRY), e o fluxo de telas ocorre sem fragmentação no `index.html` via `.modo_cadastro`.

* **Arquivos do Protótipo Funcional Entregues (100% Concluídos):**
  * `index.html` (Estrutura semântica completa com Login e Cadastro em 3 etapas)
  * `style.css` (Folha de estilo global, responsiva e com animações)
  * `app.js` (Script de validação e controle de etapas)
  * `assets/barbearia.jpg` (Imagem temática de fundo)
  * `assets/icone_barbearia.jpg` (Ícone oficial do BarberFlow)

---

#### Estados de Interface Implementados:

##### 1. Estado 1: Portal de Login (Estado Inicial)
* Exibe a imagem de fundo temática com máscara degradê escura (`linear-gradient`), cabeçalho da barbearia à esquerda e card claro (`whitesmoke`) com campos de E-mail, Senha, checkbox "Lembrar-me", botão "Entrar" e link para cadastro.

##### 2. Estado 2: Cadastro — Etapa 1 (E-mail)
* Ao clicar em "Não tem uma conta? Crie aqui!", o login desaparece suavemente e surge o card de cadastro centralizado, solicitando o e-mail com validação de formato (`@` e `.`).

##### 3. Estado 3: Cadastro — Etapa 2 (Senhas)
* Após validação do e-mail, a primeira etapa é ocultada (`display: none`) e a segunda etapa é exibida (`display: flex`), contendo os campos de "Senha" e "Confirmação da Senha" com checagem de 6 caracteres e equivalência.

##### 4. Estado 4: Cadastro — Etapa 3 (Sucesso)
* Exibe mensagem de confirmação de conta criada e botão para retornar ao login. A função `voltarAoLogin()` reseta o estado das etapas e remove a classe `.modo_cadastro`.

##### 5. Estado 5: Login Autorizado (Confirmação de Acesso)
* Ao preencher as credenciais cadastradas ou a conta `admin@teste.com` / `123456`, a função `fazerLogin()` valida os dados com sucesso e exibe o alerta de acesso autorizado.

---

#### Checklist de Conformidade Atendido (10/10):

* ✅ HTML5 estruturado semanticamente (`main`, `section`, `form`, `label`, `input`, `button`).
* ✅ Design responsivo validado em resolução mobile (`768px`) e desktop.
* ✅ Estilos unificados em arquivo único (`style.css`), sanando o apontamento de duplicação da Semana 01.
* ✅ Todos os assets e imagens presentes e renderizando perfeitamente.
* ✅ Código JavaScript nativo, limpo e modularizado em funções no `app.js`.

---

### 5️⃣ ARQUITETURA E ADR (20%)

#### Arquitetura de Componentes da Solução

O protótipo funcional opera no padrão de **Single-Page Component (Lógica no Cliente)**, manipulando diretamente o DOM e o estado da aplicação:

```text
  ┌────────────────────────────────────────────────────────┐
  │                 NAVEGADOR / BROWSER                    │
  ├────────────────────────────────────────────────────────┤
  │                                                        │
  │  [ CAMADA VISUAL (HTML5 + CSS3) ]                      │
  │  • index.html (Portal de Acesso & Formulário Cadastro) │
  │  • style.css (Estilos Globais e Classe .modo_cadastro) │
  │                     │                                  │
  │                     ▼ (Disparo de Eventos onclick)     │
  │                                                        │
  │  [ LÓGICA DE CONTROLE (JavaScript - app.js) ]          │
  │  • validarEmailCadastro()   ──► Valida sintaxe e armazena │
  │  • verificarSenhas()        ──► Valida regras de senha │
  │  • voltarAoLogin()          ──► Alterna visualização   │
  │  • fazerLogin()             ──► Valida credenciais     │
  │                     │                                  │
  │                     ▼                                  │
  │  [ ESTADO EM MEMÓRIA DE SESSÃO ]                       │
  │  • let emailSalvo = "usuario@email.com"                │
  │  • let senhaSalva = "******"                           │
  │  • Credencial Mock Admin ("admin@teste.com" / "123456")│
  │                                                        │
  └────────────────────────────────────────────────────────┘
```

---

#### Registro de Decisão de Arquitetura (ADR)

##### ADR-001: Eliminação de Duplicação e Unificação Modular de Estilos (DRY)
* **Status:** ACEITO
* **Contexto:** Na validação da Semana 01, o avaliador apontou violação do princípio DRY decorrente da existência de dois arquivos de estilo (`style.css` e `cadastro.css`) que compartilhavam classes idênticas (`.login`, `.input`, `.btn`).
* **Decisão:** Extinguir o arquivo `cadastro.css` e consolidar todas as regras visuais e de animação dentro de `style.css`.
* **Consequências:**
  * ✅ Eliminação completa de duplicação de regras CSS.
  * ✅ Facilidade de manutenção e padronização visual dos formulários.
  * ✅ Atendimento rigoroso ao apontamento de melhoria do professor.

---

##### ADR-002: Alternância de Telas em Camada Única com Classes CSS Dinâmicas
* **Status:** ACEITO
* **Contexto:** Separar o cadastro em páginas físicas distintas (`cadastro.html`, `cadastro_senha.html`) causaria recarregamento de página, rompendo a navegação e descartando variáveis de validação salvas no cliente.
* **Decisão:** Manter os formulários de login e cadastro em etapas dentro do mesmo documento (`index.html`), chaveando sua visualização através da classe CSS `.modo_cadastro` e manipulação da propriedade `display`.
* **Consequências:**
  * ✅ Transições visuais suaves entre os fluxos sem recarregar o navegador.
  * ✅ Persistência das variáveis `emailSalvo` e `senhaSalva` para validação imediata do login.

---

##### ADR-003: Validação e Gestão de Estado no Cliente via Vanilla JavaScript
* **Status:** ACEITO
* **Contexto:** Na fase atual de entregas de protótipos de interface e validação de regras de negócio, o sistema deve demonstrar o comportamento de cadastro e autenticação de forma autônoma e leve.
* **Decisão:** Utilizar variáveis de escopo em memória (`emailSalvo` e `senhaSalva`) gerenciadas puramente em **Vanilla JavaScript (`app.js`)** para simular o ciclo completo de cadastro e login.
* **Consequências:**
  * ✅ Execução direta em qualquer navegador sem necessidade de dependências externas.
  * ✅ Código 100% compreensível para todos os integrantes defenderem na prova oral.

---

##### ADR-004: Credencial Padrão de Homologação (Mock Administrativo)
* **Status:** ACEITO
* **Contexto:** Avaliadores e professores precisam testar a validação de login de forma ágil, sem obrigatoriedade de preencher todo o fluxo de cadastro a cada bateria de testes.
* **Decisão:** Incluir na função `fazerLogin()` uma credencial pré-autorizada de homologação (`admin@teste.com` e senha `123456`).
* **Consequências:**
  * ✅ Facilidade e agilidade na correção e demonstração do protótipo funcional.
  * ✅ Demonstração clara dos dois cenários: acesso via conta criada na sessão e acesso via conta pré-existente.

---

##### ADR-005: Planejamento de Persistência Relacional com MySQL para Módulos Futuros
* **Status:** PROPOSTO
* **Contexto:** Na entrega atual (Semana 02), os dados de cadastro e autenticação residem temporariamente em variáveis de escopo no navegador (`emailSalvo` e `senhaSalva`), sendo reiniciados ao atualizar a página. Com a chegada dos próximos requisitos (agendamento de horários, comissões de barbeiros e gestão de faturamento), o sistema precisará de persistência permanente e compartilhada entre múltiplos usuários.
* **Decisão:** Propor a adoção do SGBD relacional **MySQL** integrado a uma futura API backend em Node.js para persistir as tabelas de `usuarios`, `servicos` e `agendamentos`.
* **Alternativa Analisada:**
  * *LocalStorage / IndexedDB (Navegador):* Descartado por salvar dados apenas na máquina local do cliente, impedindo que o barbeiro ou o administrador vejam os agendamentos em tempo real.
* **Consequências:**
  * ✅ Persistência definitiva de contas e histórico de cortes/serviços.
  * ✅ Integridade transacional (ACID) garantida para a futura agenda dos barbeiros.
  * ⚠️ Exigirá a implementação da camada de backend e migração de dados nas próximas semanas.

---

#### Tabela de Tecnologias Escolhidas e Justificativas Técnicas

| Camada | Tecnologia | Versão | Justificativa Técnica |
|---|---|---|---|
| **Estrutura (HTML)** | HTML5 Semântico | W3C Standard | Marcação semântica (`main`, `section`, `form`, `label`, `input`, `button`), acessível e de fácil renderização. |
| **Estilização (CSS)** | CSS3 Modular (DRY) | W3C Standard | Flexbox para alinhamentos, `@keyframes` para transições e `@media (max-width: 768px)` para responsividade móvel. |
| **Lógica e Validação (JS)** | Vanilla JavaScript | ES6+ | Manipulação dinâmica do DOM, controle de eventos de clique e lógica de validação de credenciais com zero dependências. |
| **Identidade Visual** | Imagens e Ícones | JPG / SVG | Imagem temática de barbearia em alta definição e ícone vetorial da marca BarberFlow. |

---

### 6️⃣ QUALIDADE E CONFORMIDADE (10%)

#### Checklist de Qualidade Documental:

* ✅ **Estrutura de Pastas 100% Conforme v12.2:** Árvore de diretórios disposta no padrão exigido pela ementa da disciplina, sanando a penalização da Semana 01.
* ✅ **Completude Absoluta de Arquivos:** 100% dos arquivos referenciados no documento (`index.html`, `style.css`, `app.js`, `barbearia.jpg`, `icone_barbearia.jpg`) estão presentes e funcionais no repositório.
* ✅ **Zero Conceitos Fictícios:** Foco técnico exclusivo nas tecnologias e lógicas realmente desenvolvidas pela equipe.
* ✅ **Zero Erros Ortográficos:** Texto revisado minuciosamente em português formal.
* ✅ **Limpeza do Template:** Todos os textos de ajuda em azul e colchetes foram integralmente removidos.

---

**Fim da Especificação Técnica do Módulo de Validação e Confirmação de Login (RF-002)**  
*BarberFlow - Sistema de Gestão de Barbearia — 2026.*
