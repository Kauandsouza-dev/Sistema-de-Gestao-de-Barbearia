# 📋 ENTREGA SEMANAL DE REQUISITOS — SEMANA-08
**Versão do Protocolo:** v15.0  
**Disciplina:** Laboratório de Inovação II — Prof. Edilberto Silva (2026)  
**Instituição:** Faculdade Senac Distrito Federal  
**Formato:** Markdown Técnico (Padrão de Validação e Rastreabilidade)  
**Valor Total da Entrega:** 100%  
**Data da Entrega:** 25/10/2026  
**Status do Requisito:** Concluído e Validado no Protótipo  
**Grupo:** Barbearia — Grupo 05 (BarberFlow)  
**Integrantes:**
* Braynt Oliveira (`braynt62123906@edu.df.senac.br`)
* Cauê Schwantes (`caue62139126@edu.df.senac.br`)
* Gabriel Lima (`gabriel61889806@edu.df.senac.br`)
* Kauan Souza (`kauan61701296@edu.df.senac.br`)
* Pedro Quartieri (`pedro54660396@edu.df.senac.br`)

---

### ⚙️ ESTRUTURA DE DIRETÓRIOS DO PROJETO (Conforme Padrão v15.0)

```text
barberflow/
├── docs/
│   └── requisitos-semanais/
│       ├── SEMANA-01/
│       │   └── RF-001-autenticacao-cadastro.md
│       ├── SEMANA-02/
│       │   └── RF-002-confirmacao-login.md
│       ├── SEMANA-03/
│       │   └── RF-003-dashboard-agenda.md
│       ├── SEMANA-04/
│       │   └── RF-004-revisao-projeto.md
│       ├── SEMANA-06/
│       │   └── RF-006-catalogo-de-servicos.md
│       ├── SEMANA-07/
│       │   └── RF-007-criptografia-de-senhas-bcrypt.md
│       └── SEMANA-08/
│           └── RF-008-painel-de-metricas-financeiras.md   <-- (ESTE ARQUIVO DE ESPECIFICAÇÃO)
└── src/
    └── prototipos/
        └── SEMANA-08/
            └── RF-008-painel-de-metricas-financeiras/
                ├── app/
                │   ├── login.html                         <-- (Portal de Acesso e Cadastro Cliente / Barbeiro)
                │   ├── style.css                          <-- (Estilos visuais do portal e Dark Mode)
                │   └── app.js                             <-- (Motor Bcrypt, Supabase e Sessão por Ator)
                ├── dashboard/
                │   ├── RF-008-painel-de-metricas-financeiras.html <-- (Painel Financeiro 70/30, Repasse e Agenda)
                │   ├── dashboard.css                      <-- (Estilo dos cards financeiros e tabelas)
                │   ├── dashboard.js                       <-- (Comissão 70/30, Fechamento de Caixa, RBAC e CRUD)
                │   └── servicos/
                │       ├── servicos.html                  <-- (Catálogo de Serviços da Barbearia)
                │       ├── servicos.css                   <-- (Estilo das tabelas e formulários)
                │       └── servicos.js                    <-- (CRUD de Serviços e Controle de Acesso)
                └── assets/
                    ├── barbearia.webp                     <-- (Imagem de fundo WebP otimizada)
                    └── icone_barbearia.webp               <-- (Identidade visual da barbearia em WebP)
```

* **Localização deste arquivo:** `docs/requisitos-semanais/SEMANA-08/RF-008-painel-de-metricas-financeiras.md`
* **Localização dos Protótipos:** `src/prototipos/SEMANA-08/RF-008-painel-de-metricas-financeiras/`

---

## 1️⃣ TÓPICO 1: IDENTIFICAÇÃO DO REQUISITO

| Atributo | Detalhe |
|---|---|
| **ID do Requisito** | **RF-008** |
| **Título do Requisito** | Painel de Indicadores e Métricas Financeiras (Comissão 70% Barbeiro / 30% Salão), Controle de Caixa e Interfaces Adaptativas por Ator (RBAC) |
| **Tipo de Requisito** | Requisito Funcional (RF) |
| **Prioridade de Negócio** | **ALTA** (Governança de caixa, divisão transparente de comissões e segregação operacional por perfil) |
| **Complexidade Técnica** | **ALTA** (8 Story Points — Cruzamento dinâmico de entidades, rateio financeiro 70%/30% em tempo real, fechamento por barbeiro e RBAC) |
| **Status de Desenvolvimento** | **CONCLUÍDO** |
| **Data de Criação** | 19/10/2026 |
| **Data da Última Revisão** | 25/10/2026 |

### 🎯 Descrição Executiva
Implementar o **Painel de Indicadores e Métricas Financeiras** e a **Tabela Gerencial de Controle de Caixa e Repasse por Barbeiro** na Dashboard do sistema BarberFlow, fundamentados no modelo de parceria **70% / 30%** (Lei nº 13.352/2016), no qual os barbeiros recebem **70% de comissão** sobre cada serviço confirmado e o dono da barbearia retém **30% de quota-parte** pela estrutura do salão. O módulo cruza em tempo real os agendamentos (`"agendamentos"`, agora enriquecidos com a **Forma de Pagamento**: `Pix`, `Cartão` ou `Dinheiro`) com os preços vigentes no Catálogo de Serviços (`"servicos"`). Além disso, aplica **Controle de Acesso Baseado em Papel (RBAC)** via `sessionStorage` para os 3 atores do sistema (**Administrador**, **Barbeiro** e **Cliente**), permitindo também a seleção do tipo de conta (*Cliente* ou *Barbeiro*) no cadastro com criptografia Bcrypt e persistência no Supabase.

### 🔧 Correções Técnicas e Evoluções Consolidadas a partir da Semana 07
1. **Correção de Redirecionamento no Logout (`dashboard/servicos/servicos.js`):** Ajuste do caminho relativo na função `sair()` de `../app/login.html` para `../../app/login.html`, eliminando o erro `404` ao encerrar a sessão a partir do Catálogo de Serviços.
2. **Padronização Tipográfica e de Ícone (`dashboard/servicos/servicos.html`):** Inclusão da família tipográfica `Raleway` via Google Fonts no `<head>` e correção do atributo `type="image/webp"` no favicon.
3. **Validação Visual Embutida nos Formulários (`#mensagemErro`):** Substituição dos diálogos bloqueantes `alert()` nos formulários da Dashboard e do Catálogo de Serviços por mensagens visuais inline com `role="alert"`, destaque de borda vermelha (`.input_invalido`) e atributo `aria-invalid="true"`.
4. **Seleção de Perfil no Cadastro e Sessão Unificada (`app/login.html` e `app/app.js`):** Inclusão do seletor `#perfil_cadastro` (*Cliente* ou *Barbeiro*) integrado ao Supabase e garantia de gravação do objeto `usuarioLogado` no `sessionStorage`.

---

## 2️⃣ TÓPICO 2: DESCRIÇÃO E ATORES

### 💡 Por que este requisito existe? (Benefícios de Negócio)
1. **Automação do Rateio Financeiro (70% Barbeiro / 30% Salão):** Elimina cálculos manuais de fim de expediente ao exibir instantaneamente quanto do faturamento bruto (100%) pertence à barbearia (30%) e quanto deve ser repassado aos barbeiros (70%).
2. **Governança de Caixa e Prevenção de Conflito de Interesses:** Como o pagamento do cliente (em Pix, Cartão ou Dinheiro) passa pelo caixa do estabelecimento para posterior repasse de 70% ao barbeiro, o sistema centraliza a conferência financeira e a exclusão física de registros no perfil **Administrador**, evitando que anotações unilaterais ou exclusões indevidas distorçam o fechamento do caixa.
3. **Transparência Individual para o Barbeiro:** Quando o barbeiro acessa o sistema, os cards superiores adaptam-se automaticamente para mostrar exclusivamente a **Sua Produção Bruta (100%)**, o **Seu Ganho Líquido (70%)** e o **Repasse ao Salão (30%)**, garantindo total clareza sobre suas comissões sem expor o faturamento global da barbearia nem o ganho dos demais colegas.
4. **Rastreabilidade de Meios de Pagamento (`Pix`, `Cartão`, `Dinheiro`):** Cada agendamento registra a forma de pagamento utilizada pelo cliente, auxiliando a conferência de maquininha, extrato Pix e gaveta de dinheiro no fechamento diário.
5. **Integração Direta entre Agenda e Catálogo de Preços (`RF-006`):** A tabela de agendamentos exibe o valor do corte ao lado do nome do procedimento (ex: `Corte + Barba (R$ 55,00)`) e recalcula todas as comissões automaticamente sempre que um atendimento é confirmado, cancelado ou alterado.
6. **Autoatendimento Seguro para o Cliente:** O cliente visualiza apenas seus próprios horários marcados, podendo solicitar novos agendamentos (que entram como `"Pendente"`) ou cancelar agendamentos futuros com um clique.

### 👥 Atores do Sistema e Governança de Caixa
* **Administrador (`perfil: "admin"` — Dono / Caixa):** Representa a administração e o caixa/recepção da barbearia (onde o cliente efetua o pagamento após o corte). Visualiza o Painel de Indicadores Financeiros globais (Faturamento Bruto 100%, Receita do Salão 30% e Comissão dos Barbeiros 70%), a **Tabela Gerencial de Controle de Caixa e Repasse por Barbeiro** (`#cartaoRepasseBarbeiros`), gerencia todos os agendamentos (podendo confirmar pagamentos no caixa e sendo o único autorizado a excluir registros fisicamente) e detém controle total (CRUD) sobre o Catálogo de Serviços.
  * *Nota de Modelagem de Atores:* A função de **Caixa / Recepção** foi unificada no perfil `Administrador` para assegurar a auditoria dos recebimentos (evitando depender apenas da anotação unilateral do barbeiro) sem inflar o escopo do projeto com um quarto ator separado.
* **Barbeiro (`perfil: "barbeiro"` — Ator Operacional):** Profissional que atua na barbearia recebendo 70% do valor de cada corte confirmado. Visualiza na Dashboard os 4 cards superiores filtrados exclusivamente para a sua carteira (*"Minha Produção Bruta (100%)"*, *"Meu Ganho Líquido (70%)"*, *"Repasse ao Salão (30%)"*, Taxa de Conversão e Contadores próprios), além da *"Minha Agenda Diária"* com seus próprios clientes. Pode lançar novos agendamentos para si (que entram com status inicial `"Pendente"` para conferência do caixa), atualizar seus atendimentos e consultar o Catálogo de Serviços em modo **somente-leitura**, sem poder excluir agendamentos do histórico nem ver o quadro financeiro dos outros barbeiros.
* **Cliente (`perfil: "cliente"` — Ator Solicitante / Externo):** Acessa o portal simplificado intitulado *"Meus Agendamentos"*, onde visualiza exclusivamente os seus próprios horários marcados, a forma de pagamento escolhida e o preço do serviço. Pode solicitar novos agendamentos (com seu nome travado e status inicial fixado em `"Pendente"`) e cancelar seus próprios agendamentos ativos. Não possui acesso aos painéis financeiros, à busca de clientes nem ao Catálogo de Serviços administrativo.
* **Motor JavaScript da Aplicação (Ator Automático):** Valida a sessão ativa no `sessionStorage`, aplica o bloqueio de rotas (*Route Guard*), adapta os elementos do DOM e os rótulos financeiros conforme o perfil logado, cruza os dados de `"agendamentos"` e `"servicos"` no `localStorage` e executa o cálculo de rateio `70% / 30%` em tempo real (`atualizarMetricas()` e `atualizarTabelaRepasseBarbeiros()`).

### 🔑 Contas de Homologação para Validação dos 3 Atores
Além do cadastro real de Clientes e Barbeiros no banco em nuvem **Supabase** (com senhas criptografadas via **Bcrypt**), o módulo `app/app.js` disponibiliza 3 credenciais de homologação para avaliação imediata de cada visão:

| Ator / Perfil | E-mail de Acesso | Senha | Nome Exibido no Cabeçalho | Visão Carregada na Dashboard |
|---|---|:---:|---|---|
| **Administrador** | `admin@teste.com` | `123456` | `Administrador (Admin)` | Faturamento Geral (100% / 30% Salão / 70% Barbeiros) + Tabela de Repasse por Barbeiro + Agenda Completa + CRUD Catálogo |
| **Barbeiro** | `barbeiro@teste.com` | `123456` | `Gabriel Cavalheiro (Barbeiro)` | Produção Individual (100% / 70% Ganho Líquido / 30% Salão) + Agenda de Gabriel Cavalheiro + Catálogo Somente-Leitura |
| **Cliente** | `cliente@teste.com` | `123456` | `Kauan Souza (Cliente)` | Portal *"Meus Agendamentos"* (Sem cards financeiros) + Solicitar Novo Agendamento / Cancelar |

### 🔐 Matriz de Permissões CRUD e Controle de Acesso (RBAC)

| Funcionalidade / Operação | Cliente (`cliente`) | Barbeiro (`barbeiro`) | Administrador (`admin`) | Motor JS (Automático) |
|---|:---:|:---:|:---:|:---:|
| **Cards de Métricas e Rateio 70%/30% (`#painelMetricas`)** | ❌ (Oculto) | ✅ (Apenas produção própria) | ✅ (Visão global do salão) | ✅ (Adapta rótulos e cálculo) |
| **Tabela de Caixa e Repasse por Barbeiro (`#tabelaBarbeiros`)** | ❌ (Oculto) | ❌ (Oculto) | ✅ (Fechamento de todos) | ✅ (Agrupa por barbeiro) |
| **Aba Gestão de Barbeiros (`#linkBarbeiros` / `#abaGestaoBarbeiros`)** | ❌ (Oculto) | ❌ (Oculto) | ✅ (Aba dedicada: Aprovar, Cadastrar, Editar e Desativar) | ✅ (Sincroniza `<select>` e Supabase) |
| **Visualizar Agendamentos e Pagamento (READ)** | ✅ (Apenas próprios) | ✅ (Apenas da sua agenda) | ✅ (Todos da barbearia) | ✅ (Exibe preço e pagamento) |
| **Buscar Agendamentos por Cliente (SEARCH)** | ❌ (Campo oculto) | ✅ (Na própria agenda) | ✅ (Em toda a base) | ✅ (Filtro `onkeyup`) |
| **Criar Novo Agendamento (CREATE)** | ✅ (Entra como *Pendente*) | ✅ (Entra como *Pendente*) | ✅ (Livre escolha de status) | ✅ (Valida conflito de horário) |
| **Editar Agendamento / Forma de Pagamento (UPDATE)** | ❌ | ✅ (Seus atendimentos) | ✅ (Qualquer registro) | ✅ (Recalcula rateio 70/30) |
| **Cancelar Agendamento Próprio (CANCEL)** | ✅ (Muda para *Cancelado*) | ✅ (Via edição de status) | ✅ (Via edição de status) | ✅ (Estorna valor e libera vaga) |
| **Excluir Agendamento Fisicamente (DELETE)** | ❌ | ❌ (Proteção de caixa) | ✅ (Com confirmação) | ✅ (Remove do array) |
| **Acessar Catálogo de Serviços (`servicos.html`)** | ❌ (Rota bloqueada) | ✅ (Somente-leitura) | ✅ (CRUD completo) | ✅ (Bloqueia não autorizados) |

---

## 3️⃣ TÓPICO 3: ESPECIFICAÇÃO DE CASOS DE USO E REGRAS

### 📌 UC-008.1: Solicitação de Candidato a Barbeiro no Cadastro, Gestão de Equipe pelo Admin e Adaptação RBAC (AUTH + RBAC)
* **Ator Principal:** Administrador, Barbeiro ou Cliente.
* **Pré-condições:** Navegador aberto no Portal de Acesso (`app/login.html`) ou tentativa de acesso a qualquer rota interna (`dashboard/RF-008-painel-de-metricas-financeiras.html` ou `dashboard/servicos/servicos.html`).
* **Gatilho:** Criação de conta (`validarEmailCadastro()` / `verificarSenhas()`), clique em `Entrar` (`fazerLogin()`), abertura de página interna (`verificarSessaoEAdaptarTela()`) ou gerenciamento de equipe pelo Administrador (`aprovarCandidatoBarbeiro()`, `salvarBarbeiroAdmin()`, `desativarBarbeiroAdmin()`).
* **Fluxo Principal:**
  1. No cadastro de nova conta (`login.html`), o usuário informa Nome, E-mail e seleciona no `<select id="perfil_cadastro">` o **Tipo de Solicitação**: `"cliente"` (*Cliente*) ou `"candidato_barbeiro"` (*Interessado em atuar como Barbeiro*, preenchendo também sua especialidade/experiência em `#especialidade_cadastro`).
  2. Na Etapa 2 do cadastro, `verificarSenhas()` gera o hash Bcrypt com `genSalt(10)`, grava o usuário no Supabase e, caso seja um interessado em atuar como barbeiro (`"candidato_barbeiro"`), registra a solicitação com status `"Pendente"` para avaliação do Administrador (`salvarSolicitacaoBarbeiroLocal()`), mantendo o privilégio inicial restrito a `"cliente"` até a aprovação.
  3. No Painel do Administrador, através da nova **Aba de Gestão de Barbeiros** no menu de navegação (`#linkBarbeiros` que exibe a seção `#abaGestaoBarbeiros`), o gestor visualiza a tabela `#tabelaGestaoBarbeiros` com todos os profissionais ativos e solicitações pendentes, podendo **Aprovar** um candidato (`aprovarCandidatoBarbeiro()`), **Cadastrar ou Editar** um barbeiro diretamente (`salvarBarbeiroAdmin()`) ou **Desativar/Recusar** (`desativarBarbeiroAdmin()`), sincronizando o perfil na tabela `usuarios` do Supabase (`sincronizarPerfilBarbeiroNoSupabase()`) e atualizando imediatamente o `<select id="campoBarbeiro">`.
  4. Ao carregar a Dashboard, `verificarSessaoEAdaptarTela()` identifica o perfil no cabeçalho `#infoUsuario` (`"Admin"`, `"Barbeiro"` ou `"Cliente"`) e adapta a interface:
     * Se `"admin"`: exibe `#painelMetricas` (visão global), exibe `#cartaoRepasseBarbeiros` na aba de Agendamentos, disponibiliza no menu a aba `#linkBarbeiros` para acesso à `#abaGestaoBarbeiros`, exibe `#linkServicos` e define `#tituloPagina` como `"Agendamentos e Controle de Caixa"`.
     * Se `"barbeiro"`: exibe `#painelMetricas` (adaptado para produção individual e comissão 70%), oculta `#cartaoRepasseBarbeiros` e a aba `#linkBarbeiros` (`display: none`), mantém `#linkServicos` visível e define `#tituloPagina` como `"Minha Agenda Diária (Gabriel Cavalheiro)"`.
     * Se `"cliente"`: oculta `#painelMetricas`, oculta `#cartaoRepasseBarbeiros`, oculta a aba `#linkBarbeiros`, oculta `#linkServicos`, oculta `#busca` e define `#tituloPagina` como `"Meus Agendamentos"`.
* **Fluxo Alternativo (A1 - Tentativa de Acesso Direto Sem Sessão Ativa):**
  * 4a. Caso `sessionStorage.getItem("usuarioLogado")` seja `null` ou inválido, o navegador é redirecionado imediatamente para `../app/login.html`.
* **Fluxo Alternativo (A2 - Credenciais Inválidas ou Senhas Divergentes):**
  * 2a. Caso as senhas não coincidam no cadastro, tenham menos de 6 caracteres ou as credenciais de login estejam incorretas, o sistema interrompe a operação e informa o usuário.
* **Pós-condições de Sucesso:** Conta persistida com perfil correto (`cliente` ou `barbeiro`), sessão iniciada em `sessionStorage` e Dashboard adaptada às permissões do ator.
* **Pós-condições de Falha:** A sessão não é criada, nenhum dado financeiro ou administrativo é renderizado e o navegador permanece retido na tela `app/login.html`.

---

### 📌 UC-008.2: Cálculo Dinâmico do Rateio Financeiro (70% Barbeiro / 30% Salão) e Indicadores em Tempo Real (METRICS)
* **Ator Principal:** Administrador e Barbeiro (gerenciado automaticamente pelo Motor JavaScript).
* **Pré-condições:** Usuário autenticado na Dashboard com listas `"agendamentos"` e `"servicos"` carregadas no `localStorage`.
* **Gatilho:** Execução automática de `atualizarMetricas()` ao final de `mostrarAgendamentos()`.
* **Fluxo Principal:**
  1. A função `atualizarMetricas()` percorre o array `agendamentos`.
  2. Se o usuário logado for `"barbeiro"`, o laço filtra apenas os agendamentos cujo `ag.barbeiro` corresponda a `usuarioLogado.nome`; se for `"admin"`, considera todos os agendamentos da barbearia.
  3. Para cada atendimento com `status == "Confirmado"`, o sistema incrementa `qtdConfirmados` e soma ao `faturamentoTotal` o preço retornado por `pegarPrecoDoServico(ag.servico)` (ex: `Corte + Barba` = `R$ 55,00`).
  4. O sistema calcula a partilha financeira `70% / 30%`:
     * `valorSalao30 = faturamentoTotal * 0.30` (ex: `R$ 16,50` no estado inicial).
     * `valorBarbeiro70 = faturamentoTotal * 0.70` (ex: `R$ 38,50` no estado inicial).
  5. O sistema adapta dinamicamente os textos e valores dos Cards 1 e 2 conforme o perfil:
     * Para **Administrador**: Card 1 exibe `"Faturamento Bruto (100%)"` (`faturamentoTotal`); Card 2 exibe em destaque `"Receita do Salão (30%)"` (`valorSalao30`) e no subtítulo `"Comissão Barbeiros (70%): R$ XX,XX"` (`valorBarbeiro70`).
     * Para **Barbeiro**: Card 1 exibe `"Minha Produção Bruta (100%)"` (`faturamentoTotal` próprio); Card 2 exibe em destaque `"Meu Ganho Líquido (70%)"` (`valorBarbeiro70`) e no subtítulo `"Repasse ao Salão (30%): R$ XX,XX"` (`valorSalao30`).
  6. Nos Cards 3 e 4, o sistema atualiza a Taxa de Conversão (`%`), a Taxa de Cancelamento (`%`) e os contadores absolutos (`Confirmados`, `Pendentes`, `Cancelados`) dentro do escopo do perfil logado.
* **Fluxo Alternativo (A1 - Nenhum Atendimento Registrado para o Escopo):**
  * 4a. Se `totalAtendimentosConsiderados == 0`, todos os valores monetários são exibidos como `"R$ 0,00"` e as taxas percentuais como `"0%"`, prevenindo divisão por zero.
* **Pós-condições de Sucesso:** Os 4 cards superiores refletem instantaneamente o faturamento bruto, a comissão líquida de 70% do barbeiro, a quota-parte de 30% do salão e as taxas de conversão do perfil ativo.
* **Pós-condições de Falha:** Em caso de lista vazia ou serviço sem preço correspondente, os indicadores exibem valores zerados seguros (`R$ 0,00` / `0%`) sem quebrar o DOM.

---

### 📌 UC-008.3: Consolidação da Tabela de Controle de Caixa e Repasse por Barbeiro (CASHIER REPORT)
* **Ator Principal:** Administrador (`perfil: "admin"`).
* **Pré-condições:** Usuário autenticado com perfil `"admin"` na Dashboard.
* **Gatilho:** Chamada automática de `atualizarTabelaRepasseBarbeiros()` ao final de `atualizarMetricas()`.
* **Fluxo Principal:**
  1. A função `atualizarTabelaRepasseBarbeiros()` limpa as linhas anteriores de `#corpoTabelaBarbeiros`.
  2. O script percorre todos os registros de `agendamentos`, agrupando os profissionais por nome no array auxiliar `resumoPorBarbeiro`.
  3. Para cada agendamento com `status == "Confirmado"`, o sistema incrementa `cortesConfirmados` do respectivo barbeiro e soma o valor do serviço ao `totalBruto` daquele profissional.
  4. Para cada barbeiro agrupado, o sistema calcula:
     * `ganhoBarbeiro = totalBruto * 0.70` (Comissão de 70% a ser repassada ao barbeiro).
     * `parteSalao = totalBruto * 0.30` (Quota de 30% retida pelo caixa do salão).
  5. O sistema insere uma linha em `#corpoTabelaBarbeiros` exibindo: `Barbeiro`, `Cortes Confirmados`, `Total Bruto (100%)`, `Comissão Barbeiro (70%)` e `Parte do Salão (30%)`.
* **Fluxo Alternativo (A1 - Barbeiro Sem Cortes Confirmados no Dia):**
  * 3a. Se um barbeiro possuir apenas agendamentos `"Pendentes"` ou `"Cancelados"`, ele é listado na tabela de fechamento de caixa com `0` cortes confirmados e valores `R$ 0,00` em todas as colunas financeiras.
* **Pós-condições de Sucesso:** Tabela gerencial de fechamento de caixa atualizada em tempo real, permitindo ao administrador conferir quanto entrou no caixa e quanto deve transferir a cada barbeiro.
* **Pós-condições de Falha:** Caso o usuário logado não seja `"admin"`, o container `#cartaoRepasseBarbeiros` permanece oculto (`display: none`), protegendo o sigilo dos repasses dos demais profissionais.

---

### 📌 UC-008.4: Consulta e Filtragem de Agendamentos com Preço e Forma de Pagamento (READ / SEARCH)
* **Ator Principal:** Administrador, Barbeiro ou Cliente.
* **Pré-condições:** Usuário autenticado na tela `dashboard/RF-008-painel-de-metricas-financeiras.html`.
* **Gatilho:** Carregamento inicial da página (`iniciar()`) ou digitação no campo `#busca` (`onkeyup="mostrarAgendamentos()"`).
* **Fluxo Principal:**
  1. A função `mostrarAgendamentos()` limpa `#corpoTabela` e percorre `agendamentos` aplicando o filtro de escopo do ator (`admin` vê todos; `barbeiro` vê apenas os seus; `cliente` vê apenas os seus) e o filtro textual de busca por nome do cliente.
  2. Para cada agendamento visível, o sistema consulta `pegarPrecoDoServico(ag.servico)` e monta a linha da tabela com 8 colunas:
     * `Cliente`, `Serviço` (formatado com preço, ex: `"Corte + Barba (R$ 55,00)"`), `Barbeiro`, `Data`, `Hora`, `Pagamento` (`Pix`, `Cartão` ou `Dinheiro`), `Status` e `Ações`.
  3. Na coluna `Ações`, o sistema renderiza apenas os botões compatíveis com o papel do usuário:
     * **Administrador:** `Editar` e `Excluir`.
     * **Barbeiro:** Apenas `Editar` (sem botão de exclusão física para preservar a auditoria do caixa).
     * **Cliente:** Apenas `Cancelar` (para agendamentos não cancelados).
* **Fluxo Alternativo (A1 - Nenhum Agendamento Encontrado):**
  * 2a. Se `quantidadeMostrada == 0`, a tabela `#tabela` é ocultada e `#mensagemVazia` (*"Nenhum agendamento encontrado."*) é exibido.
* **Pós-condições de Sucesso:** Listagem exibida com preços, formas de pagamento e ações restritas ao perfil autenticado.
* **Pós-condições de Falha:** Nenhum registro de outro cliente ou de outro barbeiro é vazado na tela; se a busca não retornar itens, o aviso visual de lista vazia é exibido.

---

### 📌 UC-008.5: Criação e Edição de Agendamento com Seleção de Barbeiro, Quadro de Horários Comerciais (09:00 às 18:00), Forma de Pagamento e Validação Visual (CREATE / UPDATE)
* **Ator Principal:** Administrador, Barbeiro ou Cliente.
* **Pré-condições:** Usuário autenticado na Dashboard.
* **Gatilho:** Clique em `+ Novo Agendamento` (`abrirFormularioNovo()`) ou `Editar` (`abrirFormularioEdicao(id)`), seguido de `Salvar` (`salvarAgendamento()`).
* **Fluxo Principal:**
  1. Ao abrir o formulário, o sistema executa:
     * `carregarSelectServicos()`: popula `#campoServico` com os serviços ativos do catálogo e seus preços.
     * `buscarBarbeirosDoBanco()` e `carregarSelectBarbeiros()`: consultam na tabela `usuarios` do Supabase todos os registros com `perfil == "barbeiro"` e populam dinamicamente o `<select id="campoBarbeiro">`, evitando erros de digitação manual pelo cliente.
     * `carregarSelectHorarios()` e `atualizarTabelaHorarios()`: populam o `<select id="campoHora">` e a tabela interativa `#tabelaHorarios` com os horários comerciais de 30 em 30 minutos entre **`09:00` e `18:00`**, marcando visualmente como `(Ocupado)` e desabilitando os horários em que o barbeiro selecionado já possui agendamento ativo naquela data.
     * `#campoPagamento`: disponibiliza as opções `Pix`, `Cartão` e `Dinheiro`.
  2. Em um **Novo Agendamento**, o sistema aplica as travas de governança por ator:
     * Se **Cliente**: trava `#campoCliente` com seu nome, mantém o `<select id="campoBarbeiro">` e o quadro de horários (`09:00` às `18:00`) abertos para escolha simplificada e trava `#campoStatus` como `"Pendente"`.
     * Se **Barbeiro**: trava o `<select id="campoBarbeiro">` com seu próprio nome e trava `#campoStatus` inicial como `"Pendente"`.
     * Se **Administrador**: todos os campos permanecem abertos e o status padrão inicia como `"Confirmado"`.
  3. Ao clicar em `Salvar`, `salvarAgendamento()` valida se cliente, barbeiro, data e horário comercial foram selecionados e verifica se há colisão na agenda do profissional via `existeConflitoDeHorario(barbeiro, data, hora, idSendoEditado)`.
  4. Sendo os dados válidos, o agendamento (incluindo a propriedade `pagamento`) é gravado no `localStorage`, a tabela é atualizada e tanto os cards de comissão `70%/30%` quanto a tabela de repasse por barbeiro são recalculados imediatamente.
* **Fluxo Alternativo (A1 - Erro de Preenchimento ou Conflito de Horário):**
  * 3a. Se faltar algum dado obrigatório ou se o barbeiro já tiver atendimento ativo no mesmo dia e hora, `mostrarErroFormulario(mensagem, idCampo)` exibe o alerta visual em `#mensagemErro`, aplica `.input_invalido` e `aria-invalid="true"` no campo e posiciona o foco nele.
* **Pós-condições de Sucesso:** Agendamento persistido com barbeiro padronizado, horário comercial válido (`09:00`–`18:00`) e forma de pagamento registrada, recalculando os indicadores financeiros.
* **Pós-condições de Falha:** O registro inválido ou conflitante é rejeitado, o `localStorage` não é alterado e o formulário permanece aberto destacando o campo com erro.

---

### 📌 UC-008.6: Cancelamento pelo Cliente, Exclusão pelo Administrador e Proteção de Rota no Catálogo (CANCEL / DELETE / GUARD)
* **Ator Principal:** Cliente, Barbeiro ou Administrador.
* **Pré-condições:** Usuário autenticado operando a Dashboard ou navegando para `dashboard/servicos/servicos.html`.
* **Gatilho:** Clique em `Cancelar` (Cliente), `Excluir` (Administrador) ou acesso à URL `servicos.html`.
* **Fluxo Principal:**
  1. Quando o **Cliente** aciona `Cancelar` (`cancelarAgendamentoCliente(id)`) e confirma na caixa de diálogo, o status do agendamento muda para `"Cancelado"`, liberando o horário do barbeiro e deduzindo o valor das métricas caso estivesse confirmado.
  2. Quando o **Administrador** aciona `Excluir` (`excluirAgendamento(id)`) e confirma a operação, o registro é removido fisicamente do array `agendamentos` e os indicadores `70%/30%` são recalculados.
  3. Ao acessar `dashboard/servicos/servicos.html`, `verificarSessaoEAdaptarTela()` libera o CRUD completo para `"admin"` e adapta a tela para **somente-leitura** para `"barbeiro"` (ocultando `#botaoNovo` e `#colunaAcoes`).
* **Fluxo Alternativo (A1 - Tentativa de Acesso ao Catálogo por Cliente ou Sem Sessão):**
  * 3a. Se `perfil == "cliente"`, o sistema bloqueia a rota redirecionando imediatamente para `../RF-008-painel-de-metricas-financeiras.html`. Se não houver sessão ativa, redireciona para `../../app/login.html`.
* **Fluxo Alternativo (A2 - Tentativa de Exclusão Física por Perfil Não Autorizado):**
  * 2a. Se `usuarioLogado.perfil != "admin"`, `excluirAgendamento()` aborta imediatamente (`return`), impedindo a remoção do registro.
* **Pós-condições de Sucesso:** Cancelamento ou exclusão processados conforme a regra de alçada e catálogo protegido por perfil.
* **Pós-condições de Falha:** Operação não autorizada ou cancelada pelo usuário é abortada sem alteração nos dados persistidos.

---

### 📏 Regras de Negócio (RN)

* **RN-01 (Partilha Financeira 70% / 30%):** Sobre todo agendamento com status `"Confirmado"`, o valor do serviço obtido no Catálogo (`100%`) é dividido automaticamente na proporção de **70% (`PERCENTUAL_BARBEIRO = 0.70`)** de comissão líquida para o Barbeiro e **30% (`PERCENTUAL_SALAO = 0.30`)** de receita retida pelo Salão. Agendamentos `"Pendentes"` ou `"Cancelados"` não geram comissão nem receita.
* **RN-02 (Adaptação Contextual dos Cards Financeiros por Perfil):** O painel `#painelMetricas` adapta seu escopo conforme o ator: para o **Administrador**, apresenta o Faturamento Bruto Global (100%), a Receita do Salão (30%) e a Comissão Total dos Barbeiros (70%); para o **Barbeiro**, filtra apenas os atendimentos daquele profissional, destacando a *"Minha Produção Bruta (100%)"*, o *"Meu Ganho Líquido (70%)"* e o *"Repasse ao Salão (30%)"*; para o **Cliente**, o painel financeiro é integralmente ocultado.
* **RN-03 (Fechamento de Caixa e Repasse Individualizado por Barbeiro):** A tabela `#tabelaBarbeiros` (`#cartaoRepasseBarbeiros`) é exclusiva do perfil **Administrador** e consolida dinamicamente, para cada barbeiro cadastrado nos agendamentos, o número de cortes confirmados, o total bruto pago pelos clientes (100%), o valor exato de repasse ao barbeiro (70%) e a quota do salão (30%).
* **RN-04 (Governança de Caixa na Criação e Exclusão de Agendamentos):** Novos agendamentos criados tanto pelo **Cliente** quanto pelo **Barbeiro** entram obrigatoriamente com status inicial `"Pendente"`. Apenas o **Administrador** pode criar agendamentos diretamente como `"Confirmado"` ou excluir registros fisicamente (`DELETE`), garantindo que nenhum atendimento pago seja apagado unilateralmente para ocultar o repasse de 30% do salão.
* **RN-05 (Registro Obrigatório de Forma de Pagamento):** Todo agendamento deve possuir uma forma de pagamento associada (`Pix`, `Cartão` ou `Dinheiro`), exibida na tabela de agendamentos. Registros legados sem esse atributo recebem automaticamente `"Pix"` como valor padrão de compatibilidade.
* **RN-06 (Fluxo de Solicitação de Barbeiro, Gestão em Aba Própria e Sincronização Supabase):** No formulário público de criação de conta (`login.html`), o usuário pode cadastrar-se diretamente como **Cliente (`"cliente"`)** ou enviar uma solicitação como **Interessado em atuar como Barbeiro (`"candidato_barbeiro"`)** informando sua especialidade. Para evitar cadastros indevidos de terceiros na agenda da barbearia, o interessado permanece com acesso restrito de cliente e não aparece no `<select id="campoBarbeiro">` até que o **Administrador (`"admin"`)** aprove sua solicitação (ou o cadastre/edite diretamente) na aba dedicada **Gestão de Barbeiros** (`#linkBarbeiros` / `#abaGestaoBarbeiros`). O `<select id="campoBarbeiro">` e a tabela financeira consomem exclusivamente profissionais autenticados da tabela `usuarios` do Supabase ou cadastrados/aprovados pelo gestor, eliminando variáveis mockadas residuais.
* **RN-07 (Isolamento de Visão na Agenda):** O **Administrador** visualiza os agendamentos de todos os profissionais; o **Barbeiro** visualiza exclusivamente os agendamentos vinculados ao seu próprio nome; o **Cliente** visualiza exclusivamente os agendamentos vinculados ao seu próprio nome.
* **RN-08 (Seleção Padronizada de Barbeiro, Quadro de Horários Comerciais 09:00–18:00 e Prevenção de Conflitos):** A escolha do profissional é feita via `<select id="campoBarbeiro">` (`carregarSelectBarbeiros()`) e a escolha de horário via `<select id="campoHora">` integrado à tabela interativa `#tabelaHorarios` (`09:00` às `18:00`, em intervalos de 30 minutos). Um mesmo barbeiro não pode ter dois agendamentos ativos (`"Confirmado"` ou `"Pendente"`) na mesma data e hora, sendo os horários já ocupados bloqueados visualmente na grade (`(Ocupado)`). Agendamentos `"Cancelados"` liberam imediatamente o horário.
* **RN-09 (Permissão Somente-Leitura no Catálogo para Barbeiro):** O **Barbeiro** pode acessar o Catálogo de Serviços (`servicos.html`) apenas para consulta de preços e tempos de execução (sem botão de novo serviço e sem coluna de ações), impedindo que altere unilateralmente o preço dos serviços para manipular a base de cálculo da comissão.
* **RN-10 (Fórmulas de Taxa de Conversão e Cancelamento):** A Taxa de Conversão é calculada por `Math.round((qtdConfirmados / totalConsiderados) * 100)` e a Taxa de Cancelamento por `Math.round((qtdCancelados / totalConsiderados) * 100)`, respeitando o escopo do ator logado (global para Administrador, individual para Barbeiro).

---

### 🛡️ Requisitos Não-Funcionais (RNF)

* **RNF-01 (Tempo de Resposta e Recálculo Financeiro Instantâneo):** O cálculo do rateio `70% / 30%`, a montagem da tabela de repasse por barbeiro e a re-renderização da agenda devem ocorrer em menos de **50 milissegundos** após qualquer alteração, sem recarregar a página.
* **RNF-02 (Controle de Sessão e Bloqueio de Rotas via `sessionStorage`):** O estado de autenticação deve ser mantido via `sessionStorage` (`"usuarioLogado"`), redirecionando acessos não autenticados para `login.html` e bloqueando o acesso do perfil `"cliente"` à rota `servicos.html` em menos de **20ms**.
* **RNF-03 (Segurança de Credenciais com Bcrypt):** Todas as senhas de contas criadas (sejam Clientes ou Barbeiros) devem ser criptografadas no cliente com `bcryptjs` utilizando **Salt Rounds = 10** (`$2a$10$...`) antes do envio ao banco PostgreSQL no Supabase.
* **RNF-04 (Acessibilidade Web e Feedback Visual WCAG 2.1 AA):** Os formulários devem exibir erros de validação no próprio layout através do componente `#mensagemErro` com `role="alert"`, aplicando a classe `.input_invalido` e `aria-invalid="true"` no campo inválido, além de tabelas semânticas com `<thead>` e `<th scope="col">`.
* **RNF-05 (Prevenção contra Injeção de Scripts - XSS):** Todos os textos dinâmicos (nomes de clientes, barbeiros, preços, formas de pagamento e métricas) devem ser inseridos no DOM exclusivamente via `.innerText`.
* **RNF-06 (Resiliência e Retrocompatibilidade de Storage):** As leituras de `localStorage` e `sessionStorage` devem utilizar blocos `try / catch` e higienizar registros antigos (injetando `pagamento: "Pix"` caso ausente), evitando falhas de execução.
* **RNF-07 (Responsividade Mobile):** O grid de 4 cards financeiros (`.painel_metricas`), a tabela de repasse de barbeiros e a tabela de agendamentos devem adaptar-se a telas menores (`@media 768px`) utilizando atributos `data-label` em todas as células.
* **RNF-08 (Otimização de Imagens em WebP):** Uso estrito de imagens `.webp` (`barbearia.webp` e `icone_barbearia.webp`) com peso inferior a **100KB**.
* **RNF-09 (Execução Limpa - Clean Console):** Execução com **zero erros** no console do DevTools em todos os fluxos dos 3 atores.

---

## 4️⃣ TÓPICO 4: PROTÓTIPO DE TELA (HTML+CSS+JS)

### 🖥️ Mapeamento de Arquivos do Módulo (Semana 08)

| Arquivo Físico | Papel no Protótipo |
|---|---|
| `app/login.html` | Portal de Acesso com Login, Cadastro em 3 etapas (incluindo seletor `#perfil_cadastro`: *Cliente* ou *Barbeiro*), Recuperação de Senha e Dark Mode. |
| `app/style.css` | Folha de estilos do portal de acesso, transições visuais e suporte ao modo escuro. |
| `app/app.js` | Motor de autenticação híbrido: integra com Supabase + Bcrypt (`genSalt(10)`), grava o perfil escolhido no cadastro, valida as 3 contas de homologação e popula o `sessionStorage`. |
| `dashboard/RF-008-painel-de-metricas-financeiras.html` | Estrutura principal contendo o menu com abas de navegação (`#linkAgendamentos`, `#linkBarbeiros`, `#linkServicos`), os 4 cards do `#painelMetricas` (100% / 30% Salão / 70% Barbeiros / Conversão / Contadores), o card `#cartaoRepasseBarbeiros` (`#tabelaBarbeiros`), o container `#abaGestaoBarbeiros` (`#tabelaGestaoBarbeiros` e `#cartaoCadastroBarbeiroAdmin`), a tabela de agendamentos com coluna `Pagamento` e o formulário com `#campoPagamento` e `#mensagemErro`. |
| `dashboard/dashboard.css` | Estilização dos 4 cards financeiros, abas de navegação do menu (`.link_ativo`), tabela de fechamento de caixa, painel de gestão de barbeiros, badges de status coloridos, bordas de erro `.input_invalido` e layout responsivo. |
| `dashboard/dashboard.js` | Motor de regras de negócio: alternância de abas (`alternarAbaMenu()`), consulta a barbeiros reais do Supabase (`buscarBarbeirosDoBanco()`), higienização de legados (`limparBarbeirosLegadosInexistentes()`), constantes `PERCENTUAL_BARBEIRO (0.70)` e `PERCENTUAL_SALAO (0.30)`, `atualizarMetricas()`, `atualizarTabelaRepasseBarbeiros()`, adaptação RBAC (`verificarSessaoEAdaptarTela()`) e CRUD de agendamentos. |
| `dashboard/servicos/servicos.html` | Catálogo de Serviços com cabeçalho padronizado (`Raleway`), busca dinâmica e formulário com validação visual `#mensagemErro`. |
| `dashboard/servicos/servicos.css` | Estilos visuais do catálogo de serviços e estados de validação. |
| `dashboard/servicos/servicos.js` | Motor CRUD do catálogo com bloqueio de rota para clientes e modo somente-leitura para barbeiros. |
| `assets/icone_barbearia.webp` | Logotipo otimizado em WebP utilizado nos cabeçalhos e favicons. |
| `assets/barbearia.webp` | Imagem de fundo otimizada em WebP do Portal de Acesso. |

### 🎨 Estados Visuais e Comportamento Adaptativo por Ator

1. **Visão do Administrador (`admin@teste.com` — Fechamento Geral da Barbearia):**
   * **Cabeçalho e Título:** Exibe `"Administrador (Admin)"` e título `"Agendamentos e Controle de Caixa"`.
   * **Painel Superior (`#painelMetricas` — 4 Cards Globais):**
     * *Card 1:* **Faturamento Bruto (100%)** (`R$ 55,00` inicial).
     * *Card 2:* **Receita do Salão (30%)** em destaque (`R$ 16,50` inicial) e subtítulo **Comissão Barbeiros (70%): R$ 38,50**.
     * *Card 3:* **Taxa de Conversão** (`33%` inicial) e **Cancelamento: 33%**.
     * *Card 4:* **Status dos Atendimentos** (`1 Confirmados`, `1 Pendentes`, `1 Cancelados`).
   * **Tabela de Controle de Caixa e Repasse por Barbeiro (`#cartaoRepasseBarbeiros`):** Visível exclusivamente para o Admin na aba de Agendamentos, listando cada profissional ativo cadastrado no banco (ex: `Gabriel Cavalheiro` com 1 corte confirmado, Total Bruto `R$ 55,00`, Comissão Barbeiro 70% `R$ 38,50` e Parte do Salão 30% `R$ 16,50`).
   * **Aba de Gestão de Barbeiros (`#linkBarbeiros`):** Acesso exclusivo do Admin para gerenciar aprovações de candidatos e cadastros de barbeiros sem poluir a visão da agenda principal.
2. **Visão do Barbeiro (`barbeiro@teste.com` — Produção e Comissão Individual):**
   * **Cabeçalho e Título:** Exibe `"Gabriel Cavalheiro (Barbeiro)"` e título `"Minha Agenda Diária (Gabriel Cavalheiro)"`.
   * **Painel Superior (`#painelMetricas` — 4 Cards Filtrados para o Barbeiro):**
     * *Card 1:* Rótulo muda para **Minha Produção Bruta (100%)** (`R$ 55,00`).
     * *Card 2:* Rótulo muda para **Meu Ganho Líquido (70%)** exibindo `R$ 38,50` em destaque principal, e subtítulo **Repasse ao Salão (30%): R$ 16,50**.
     * *Cards 3 e 4:* Taxa de Conversão (`50%`) e Contadores (`1 Confirmados`, `0 Pendentes`, `1 Cancelados`) calculados apenas sobre os cortes de Gabriel Cavalheiro.
   * **Sigilo e Governança:** A tabela geral `#cartaoRepasseBarbeiros` e a aba `#linkBarbeiros` ficam ocultas; na tabela de agendamentos aparecem apenas os clientes de Gabriel Cavalheiro e apenas o botão `Editar` (sem botão `Excluir`); no Catálogo de Serviços, a visualização é somente-leitura.
3. **Visão do Cliente (`cliente@teste.com` — Portal de Autoatendimento):**
   * **Cabeçalho e Título:** Exibe `"Kauan Souza (Cliente)"` e título `"Meus Agendamentos"`.
   * **Simplificação de Interface:** Tanto `#painelMetricas` quanto `#cartaoRepasseBarbeiros`, o link do Catálogo e o campo de busca ficam ocultos. O cliente vê apenas seus agendamentos com preço, forma de pagamento e botão `Cancelar`.
4. **Estado de Erro Visual nos Formulários (`#mensagemErro` + `.input_invalido`):**
   * Exibe mensagens claras dentro do formulário com `role="alert"` e borda vermelha no campo incorreto sempre que há campo vazio ou choque de horário do barbeiro.

### 📋 Checklist de Conformidade do Protótipo (12/12)
* ✅ Rateio financeiro (70% Barbeiro / 30% Salão) implementado e calculado em tempo real nos cards superiores.
* ✅ Tabela Gerencial de Controle de Caixa e Repasse por Barbeiro (`#tabelaBarbeiros`) funcional e exclusiva do Administrador.
* ✅ Aba dedicada de Gestão de Barbeiros no menu do Administrador (`#linkBarbeiros` / `#abaGestaoBarbeiros`) para aprovação e edição de profissionais.
* ✅ Sincronização dinâmica de profissionais reais a partir do banco de dados do Supabase e expurgo total de variáveis fictícias legadas.
* ✅ Painel de métricas adaptativo: visão global do salão para o Administrador e visão de ganho líquido individual (70%) para o Barbeiro.
* ✅ Registro e exibição da Forma de Pagamento (`Pix`, `Cartão`, `Dinheiro`) e do preço do serviço na tabela de agendamentos.
* ✅ Seleção de Tipo de Conta (`Cliente` ou `Barbeiro`) no cadastro integrada ao Supabase + Bcrypt.
* ✅ Governança de caixa: novos agendamentos de barbeiros/clientes entram como `"Pendente"` e apenas o Administrador pode excluir registros.
* ✅ Bloqueio de rotas via `sessionStorage` e modo somente-leitura no Catálogo de Serviços para o Barbeiro.
* ✅ Validação visual inline (`#mensagemErro` + `.input_invalido` + `aria-invalid="true"`) sem uso de `alert()` nos formulários.
* ✅ Proteção contra XSS via `.innerText` e resiliência `try / catch` no `localStorage` e `sessionStorage`.
* ✅ Execução 100% limpa no console do navegador.

---

## 5️⃣ TÓPICO 5: ARQUITETURA E ADR

### 🏗️ Arquitetura de Componentes da Solução (Semana 08)

A arquitetura integra o Portal de Autenticação em Nuvem (**Supabase + Bcrypt.js**), o controle de sessão por perfil (**`sessionStorage`**) e o motor financeiro de rateio **70% Barbeiro / 30% Salão** (**`localStorage`**):

```text
+------------------------------------------------------------------------------------------------------+
|                                 NAVEGADOR WEB DO USUÁRIO (CLIENTE)                                   |
|                                                                                                      |
|  +------------------------------------------------------------------------------------------------+  |
|  |                     CAMADA DE APRESENTAÇÃO ADAPTATIVA (HTML5 + CSS3 + RBAC)                    |  |
|  |  [ Login / Cadastro Cliente ou Barbeiro ]  [ Cards 70%/30% ]  [ Tabela Caixa ]  [ Agenda/Pgto ]|  |
|  +------------------------------------------------------------------------------------------------+  |
|                     ▲                                                         ▲                      |
|                     │ Autenticação e Perfil                                   │ DOM Segura           |
|                     ▼                                                         ▼ (innerText / WCAG)   |
|  +-------------------------------------------+   +------------------------------------------------+  |
|  |    MÓDULO DE AUTENTICAÇÃO (app/app.js)    |   |   MOTOR FINANCEIRO E AGENDA (dashboard.js)     |  |
|  |  - Cadastro: #perfil_cadastro             |   |  - Rateio: 70% Barbeiro / 30% Salão            |  |
|  |  - Bcrypt (Salt 10) + Contas Homologação  |   |  - atualizarMetricas() [Global vs Individual]  |  |
|  +-------------------------------------------+   |  - atualizarTabelaRepasseBarbeiros() [Caixa]   |  |
|        │                               │         +------------------------------------------------+  |
|        │ HTTPS (REST)                  │ Grava / Lê Sessão                     ▲                     |
|        ▼                               ▼                                       │ Cruzamento Dinâmico |
|  +--------------------+   +-------------------------------------------------+  │ em Tempo Real       |
|  | SUPABASE CLOUD DB  |   |          WEB STORAGE API DO NAVEGADOR           |◄─┘                     |
|  | Tabela: "usuarios" |   | - sessionStorage: "usuarioLogado" (RBAC)        |                        |
|  | (Hash + Perfil)    |   | - localStorage: "agendamentos" (Pgto) x "servicos"                       |
|  +--------------------+   +-------------------------------------------------+                        |
+------------------------------------------------------------------------------------------------------+
```

---

### 📝 Registro de Decisões de Arquitetura (ADRs)

#### 🔹 ADR-001: Motor de Rateio Financeiro (70% Barbeiro / 30% Salão) em Tempo Real
* **Status:** **IMPLEMENTADO** *(Concretização e Evolução do RF-008)*
* **Contexto:** Em barbearias reais que operam sob parceria (Lei nº 13.352/2016), o faturamento bruto dos cortes não pertence 100% ao dono do estabelecimento: 70% do valor de cada serviço executado é repassado como comissão ao barbeiro e 30% ficam com o salão para custeio da estrutura.
* **Decisão:** Implementar constantes explícitas (`PERCENTUAL_BARBEIRO = 0.70` e `PERCENTUAL_SALAO = 0.30`) em `dashboard.js`, fazendo com que `atualizarMetricas()` e `atualizarTabelaRepasseBarbeiros()` cruzem os agendamentos `"Confirmados"` com os preços do Catálogo (`pegarPrecoDoServico()`) e calculem automaticamente o Faturamento Bruto (100%), a Receita do Salão (30%) e a Comissão dos Barbeiros (70%), além de registrar a Forma de Pagamento (`Pix`, `Cartão`, `Dinheiro`) em cada atendimento.
* **Consequências:** Aderência fiel à realidade financeira de uma barbearia brasileira, transparência imediata de comissões para o barbeiro e fechamento de caixa automatizado para o gestor.

---

#### 🔹 ADR-002: Centralização do Controle de Caixa no Perfil Administrador para Prevenir Conflito de Interesses
* **Status:** **IMPLEMENTADO**
* **Contexto:** Quando o cliente finaliza o corte, o pagamento é recebido no caixa/recepção da barbearia para posterior repasse dos 70% ao barbeiro. Se o controle financeiro dependesse apenas da anotação unilateral do barbeiro (ou se o barbeiro pudesse excluir agendamentos realizados ou alterar preços do catálogo), haveria risco de conflito de interesses e perda da quota de 30% do salão. Por outro lado, criar um 4º ator separado exclusivamente para "Recepção / Caixa" aumentaria desnecessariamente a complexidade do sistema.
* **Decisão:** Unificar a função de **Caixa / Recepção** no perfil `Administrador ("admin")`, mantendo os **3 atores canônicos** do projeto (`Administrador`, `Barbeiro` e `Cliente`). Como mecanismo de governança técnica:
  1. Novos agendamentos lançados pelo Barbeiro entram como `"Pendente"` até conferência/confirmação;
  2. Apenas o `Administrador` visualiza a tabela consolidada de repasse (`#cartaoRepasseBarbeiros`) e possui o botão `Excluir` na agenda;
  3. O Barbeiro acessa o Catálogo de Serviços em modo estritamente **somente-leitura**.
* **Consequências:** Controle interno robusto contra fraudes ou erros operacionais, mantendo a arquitetura enxuta com 3 perfis bem delimitados.

---

#### 🔹 ADR-003: Interfaces Adaptativas (RBAC) e Cards Financeiros Bivalentes em HTML Único (Princípio DRY)
* **Status:** **IMPLEMENTADO**
* **Contexto:** Tanto o Dono do Salão quanto o Barbeiro precisam acompanhar indicadores financeiros, porém sob perspectivas diferentes (visão global do salão vs. ganho líquido individual do barbeiro), enquanto o Cliente precisa apenas de uma tela limpa para agendar ou cancelar horários.
* **Decisão:** Reutilizar a mesma estrutura DOM em `RF-008-painel-de-metricas-financeiras.html` e `servicos.html`, adaptando dinamicamente os rótulos dos cards (`#rotuloFaturamento`, `#rotuloDivisao`), a visibilidade das tabelas e os campos travados (`disabled`) por meio de `verificarSessaoEAdaptarTela()` e `atualizarMetricas()`.
* **Consequências:** Zero duplicação de arquivos HTML/CSS (Princípio *DRY*), manutenção simplificada e experiência personalizada para cada um dos 3 atores.

---

#### 🔹 ADR-004: Proteção de Rotas via `sessionStorage`, Seleção de Perfil no Cadastro e Contas de Homologação
* **Status:** **IMPLEMENTADO**
* **Contexto:** Necessidade de impedir o acesso direto via URL às telas internas sem login, permitir que novos Clientes e Barbeiros criem contas reais no Supabase e oferecer contas prontas para avaliação imediata da banca.
* **Decisão:** Adicionar o `<select id="perfil_cadastro">` (*Cliente* ou *Barbeiro*) em `app/login.html` salvando o perfil no Supabase junto ao hash Bcrypt, armazenar a sessão autenticada em `sessionStorage.setItem("usuarioLogado", ...)` e manter as 3 contas de homologação (`admin@teste.com`, `barbeiro@teste.com`, `cliente@teste.com`).
* **Consequências:** Fluxo de ponta a ponta funcional tanto com banco em nuvem quanto em testes rápidos de avaliação.

---

#### 🔹 ADR-005: Validação Visual Embutida no Formulário com Acessibilidade WCAG (`#mensagemErro`)
* **Status:** **IMPLEMENTADO** *(Atendimento ao Feedback da Semana 06)*
* **Contexto:** Substituir alertas nativos (`alert()`) nos formulários de agendamento e catálogo por feedback visual integrado ao layout.
* **Decisão:** Utilizar `<p id="mensagemErro" role="alert">`, classe `.input_invalido` e atributo `aria-invalid="true"` acionados por `mostrarErroFormulario(mensagem, idCampo)`.
* **Consequências:** Conformidade com WCAG 2.1 e melhor usabilidade.

---

#### 🔹 ADR-006: Migração Completa das Tabelas de Agendamentos e Serviços para o Supabase (RF-009)
* **Status:** **PROPOSTO** *(Próxima Evolução Arquitetural)*
* **Contexto:** Enquanto a tabela `usuarios` já opera integrada ao PostgreSQL do Supabase, os dados de `"agendamentos"` e `"servicos"` permanecem no `localStorage` para máxima velocidade e independência na validação das regras de rateio 70/30.
* **Decisão:** Em etapa futura, migrar `"agendamentos"` e `"servicos"` para tabelas relacionais no Supabase.
* **Consequências:** Sincronização em nuvem entre múltiplos dispositivos.

---

### 🗺️ Matriz de Rastreabilidade: Requisitos x Decisões de Arquitetura (ADRs)

| Requisito Funcional | ADR Vinculada | Decisão Arquitetural Adotada | Status |
|---|:---:|---|:---:|
| **RF-003** — Dashboard e Gestão de Agendamentos | **ADR-002 / ADR-003** | Agenda integrada com preços, forma de pagamento, validação visual e controle de alçada por perfil. | **IMPLEMENTADO** |
| **RF-006** — Catálogo de Serviços | **ADR-002 / ADR-005** | CRUD em `localStorage` com validação inline `#mensagemErro` e modo somente-leitura para Barbeiro. | **IMPLEMENTADO** |
| **RF-007** — Criptografia Bcrypt e Cadastro por Perfil | **ADR-004** | Hashes Bcrypt (Salt 10) e seletor `#perfil_cadastro` (*Cliente* / *Barbeiro*) persistidos no Supabase. | **IMPLEMENTADO** |
| **RF-008** — Painel Financeiro 70/30, Caixa e RBAC | **ADR-001 / ADR-002 / ADR-003** | Rateio 70% Barbeiro / 30% Salão, tabela de fechamento de caixa, forma de pagamento e RBAC. | **IMPLEMENTADO** |
| **RF-009** — Persistência Relacional Completa em Nuvem | **ADR-006** | Migração futura das chaves `agendamentos` e `servicos` do `localStorage` para o Supabase. | **PROPOSTO** |

---

### 💻 Tabela de Tecnologias Utilizadas

| Camada | Tecnologia | Função no Projeto | Justificativa Acadêmica e Técnica |
|---|---|---|---|
| **Estrutura (Front-End)** | HTML5 Semântico (WCAG 2.1) | Marcação das telas, cards e tabelas | Uso de `section`, `nav`, `table`, `thead`, `th[scope="col"]`, `role="alert"` e `aria-invalid`. |
| **Estilização (Visual)** | CSS3 Modular + Flexbox | Layout dos 4 cards financeiros e tabelas | Responsividade (`@media 768px`), variáveis de tema (Dark Mode) e destaque semântico. |
| **Comportamento e Regras** | Vanilla JavaScript (ES6+) | Rateio 70%/30%, fechamento de caixa e RBAC | Execução direta no navegador sem dependência de frameworks pesados. |
| **Sessão e Cache Local** | Web Storage (`sessionStorage` / `localStorage`) | Controle de sessão ativa e persistência | `sessionStorage` protege as rotas por aba; `localStorage` armazena agenda, pagamentos e catálogo. |
| **Segurança e Nuvem** | Bcrypt.js (`2.4.3`) + Supabase (`@supabase/supabase-js@2`) | Hash de senhas e banco PostgreSQL | Cadastro real de Clientes e Barbeiros em nuvem aliado às 3 contas de homologação. |
| **Mídia e Tipografia** | Imagens `.webp` + Google Fonts (`Raleway`) | Identidade visual padronizada | Imagens leves (< 100KB) e tipografia uniforme em todos os módulos. |

---

## 6️⃣ TÓPICO 6: QUALIDADE E CONFORMIDADE

### 🛠️ Registro de Atendimento aos Feedbacks Anteriores (Prof. Edilberto Silva)
1. **Inclusão Obrigatória de Pós-condições de Falha em Todos os Casos de Uso (Feedback Semana 06):** Todos os 6 Casos de Uso (`UC-008.1` a `UC-008.6`) documentam tanto as **Pós-condições de Sucesso** quanto as **Pós-condições de Falha**.
2. **Validação Visual dos Estados de Erro nos Formulários (Feedback Semana 06):** Formulários equipados com `#mensagemErro` (`role="alert"`) e `.input_invalido` (`aria-invalid="true"`).
3. **Correção do Bug de Logout no Catálogo e Padronização Visual (Auditoria Semana 07):** Ajustado o redirecionamento `../../app/login.html` em `servicos.js` e incluída a fonte `Raleway` em `servicos.html`.
4. **Remoção de Tabela de Autodeclaração de Nota (Feedback Semana 06):** Documento focado estritamente na especificação técnica e verificação de conformidade, sem tabelas de autopontuação.

### ✅ Checklist de Verificação de Conformidade Documental e Técnica (Protocolo v15.0)
* ✅ **Estrutura de Diretórios 100% Conforme:** Arquivos organizados em `docs/requisitos-semanais/SEMANA-08/RF-008-painel-de-metricas-financeiras.md` e `src/prototipos/SEMANA-08/RF-008-painel-de-metricas-financeiras/`.
* ✅ **Fidelidade Total com o Rateio Financeiro (70%/30%):** Documentação alinhada às funções `atualizarMetricas()`, `atualizarTabelaRepasseBarbeiros()`, constantes `PERCENTUAL_BARBEIRO (0.70)` / `PERCENTUAL_SALAO (0.30)`, seletor `#campoPagamento` (`Pix`, `Cartão`, `Dinheiro`) e seletor `#perfil_cadastro` (`Cliente` / `Barbeiro`).
* ✅ **Gestão de Barbeiros e Supabase em Conformidade:** Documentação alinhada à nova aba de navegação (`#linkBarbeiros`), integração de profissionais cadastrados na nuvem e eliminação de registros mockados.
* ✅ **6 Tópicos Obrigatórios Completos:** Identificação, Descrição/Atores/Governança de Caixa/Matriz RBAC, Casos de Uso Granulares (com Pós-condições de Sucesso e de Falha) + 10 RNs + 9 RNFs, Protótipo de Tela, Arquitetura/ADRs e Qualidade/Conformidade.
* ✅ **Testabilidade Imediata dos 3 Atores:** Credenciais de homologação (`admin@teste.com`, `barbeiro@teste.com`, `cliente@teste.com` — senha `123456`) documentadas e prontas para inspeção.

---

**Fim da Especificação Técnica do Painel de Métricas Financeiras, Controle de Caixa 70/30 e RBAC (RF-008)**  
*BarberFlow — Sistema de Gestão de Barbearia (2026)*  
*Laboratório de Inovação II — Prof. Edilberto Silva* 💈
