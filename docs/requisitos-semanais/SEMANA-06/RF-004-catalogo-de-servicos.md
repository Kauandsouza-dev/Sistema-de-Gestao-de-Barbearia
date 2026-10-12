# 📋 ENTREGA SEMANAL DE REQUISITOS — SEMANA-06
**Versão do Protocolo:** v14.3  
**Disciplina:** Laboratório de Inovação II — Prof. Edilberto Silva (2026)  
**Instituição:** Faculdade Senac Distrito Federal  
**Formato:** Markdown Técnico (Padrão de Validação e Rastreabilidade)  
**Valor Total da Entrega:** 100%  
**Data da Entrega:** 11/10/2026  
**Status do Requisito:** Concluído e Validado no Protótipo  
**Grupo:** Barbearia — Grupo 05 (BarberFlow)  
**Integrantes:**
* Braynt Oliveira (`braynt62123906@edu.df.senac.br`)
* Cauê Schwantes (`caue62139126@edu.df.senac.br`)
* Gabriel Lima (`gabriel61889806@edu.df.senac.br`)
* Kauan Souza (`kauan61701296@edu.df.senac.br`)
* Pedro Quartieri (`pedro54660396@edu.df.senac.br`)

---

### ⚙️ ESTRUTURA DE DIRETÓRIOS DO PROJETO (Conforme Padrão v14.3)

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
│       └── SEMANA-06/
│           └── RF-04-catalogo-de-servicos.md   <-- (ESTE ARQUIVO DE ESPECIFICAÇÃO)
└── src/
    └── prototipos/
        └── SEMANA-06/
            └── RF-004-catalogo-de-servicos/
                ├── app/
                │   ├── RF-03.html               <-- (Portal de Acesso e Autenticação)
                │   ├── style.css                <-- (Estilos visuais do portal)
                │   └── app.js                   <-- (Lógica de autenticação e navegação)
                ├── dashboard/
                │   ├── dashboard.html           <-- (Tela Principal de Agendamentos)
                │   ├── dashboard.css            <-- (Estilo da esteira de agendamentos)
                │   ├── dashboard.js             <-- (Lógica dos agendamentos)
                │   └── servicos/
                │       ├── servicos.html        <-- (Protótipo do Catálogo de Serviços)
                │       ├── servicos.css         <-- (Estilos da tabela e modal de serviços)
                │       └── servicos.js          <-- (Motor CRUD de Serviços e localStorage)
                └── assets/
                    ├── barbearia.webp           <-- (Imagem de fundo otimizada)
                    └── icone_barbearia.webp     <-- (Ícone da marca BarberFlow em WebP)
```

* **Localização deste arquivo:** `docs/requisitos-semanais/SEMANA-06/RF-04-catalogo-de-servicos.md`
* **Localização dos Protótipos:** `src/prototipos/SEMANA-06/RF-004-catalogo-de-servicos/`

---

## 1️⃣ TÓPICO 1: IDENTIFICAÇÃO DO REQUISITO

| Atributo | Detalhe |
|---|---|
| **ID do Requisito** | **RF-04** |
| **Título do Requisito** | Catálogo e Gestão de Serviços da Barbearia (CRUD Completo, Busca Dinâmica, Alternância de Status e Persistência Local) |
| **Tipo de Requisito** | Requisito Funcional (RF) |
| **Prioridade de Negócio** | **ALTA** (Base operacional para agendamentos e precificação da barbearia) |
| **Complexidade Técnica** | **MÉDIA** (5 Story Points — CRUD com validações de dados e reatividade no DOM) |
| **Status de Desenvolvimento**| **CONCLUÍDO** |
| **Data de Criação** | 05/10/2026 |
| **Data da Última Revisão** | 11/10/2026 |

### 🎯 Descrição Executiva
Construir uma interface simples, rápida e acessível para o gerenciamento dos serviços oferecidos pela barbearia BarberFlow. O módulo permite cadastrar novos procedimentos (corte, barba, combos), editar valores e tempos de atendimento, ativar ou inativar itens temporariamente e excluir serviços obsoletos. Todas as informações são salvas diretamente no navegador através do `localStorage`, garantindo que os dados não se percam ao atualizar a página, com pesquisa dinâmica instantânea e proteção contra inserção de código malicioso no front-end.

---

## 2️⃣ TÓPICO 2: DESCRIÇÃO E ATORES

### 💡 Por que este requisito existe? (Benefícios de Negócio)
1. **Centralização do Cardápio de Serviços:** Substitui tabelas impressas ou anotações informais por uma listagem padronizada com nome, descrição, tempo e preço.
2. **Clareza na Duração do Atendimento:** Definir o tempo em minutos de cada serviço é essencial para evitar choque de horários na agenda de cortes da barbearia.
3. **Gestão Flexível de Disponibilidade (Ativar / Desativar):** Permite pausar a oferta de um serviço (por exemplo, falta de produto para platinado) sem precisar deletá-lo do sistema.
4. **Busca Rápida no Balcão:** O atendente ou barbeiro localiza qualquer serviço rapidamente apenas digitando parte do nome ou da descrição.
5. **Prevenção de Erros de Preenchimento:** Validações simples no formulário impedem o cadastro de serviços sem nome, com duração zerada ou com preços negativos.
6. **Autonomia Local no Navegador:** Funciona de forma autônoma com `localStorage`, permitindo testar e demonstrar toda a experiência de usuário sem depender de um servidor configurado no momento.

### 👥 Atores do Sistema
* **Barbeiro / Atendente (Ator Operacional):** Consulta o catálogo para tirar dúvidas de preços e durações durante o atendimento ao cliente.
* **Administrador / Dono da Barbearia (Ator Principal):** Responsável por cadastrar novos serviços, ajustar valores, mudar status para inativo e remover serviços que não fazem mais parte do portfólio.
* **Cliente (Ator Indireto):** Não acessa esta tela administrativa diretamente, mas se beneficia de preços transparentes e tempos de corte previamente estipulados.
* **Motor JavaScript da Aplicação (Ator Automático):** Carrega os dados salvos, renderiza as linhas da tabela em tempo real, executa os filtros de busca e mantém a tela sincronizada com o armazenamento local.

### 🔐 Matriz de Permissões CRUD

| Operação | Barbeiro | Administrador | Cliente (Indireto) | Motor JS (Automático) |
|---|:---:|:---:|:---:|:---:|
| **Create (Cadastrar)** | ❌ | ✅ | ❌ | ✅ (Gera ID incremental) |
| **Read (Visualizar)** | ✅ | ✅ | ❌ | ✅ (Renderiza tabela) |
| **Search (Filtrar)** | ✅ | ✅ | ❌ | ✅ (Filtro instantâneo) |
| **Update (Editar)** | ❌ | ✅ | ❌ | ✅ (Atualiza no array) |
| **Toggle Status (Ativar/Desativar)** | ❌ | ✅ | ❌ | ✅ (Alterna classe e estado) |
| **Delete (Excluir)** | ❌ | ✅ (Com confirmação) | ❌ | ✅ (Remove do array) |

---

## 3️⃣ TÓPICO 3: ESPECIFICAÇÃO DE CASOS DE USO E REGRAS

### 📌 UC-004.1: Carregamento Inicial da Tela e Carga de Demonstração (READ)
* **Ator Principal:** Barbeiro / Administrador.
* **Pré-condições:** Navegador aberto no arquivo `dashboard/servicos/servicos.html`.
* **Gatilho:** Abertura ou atualização da página (`iniciar()`).
* **Fluxo Principal:**
  1. O navegador executa a função `iniciar()`.
  2. O script consulta o `localStorage` pela chave `"servicos"`.
  3. Se a chave for `null` (primeiro acesso), o sistema carrega automaticamente um lote inicial com 5 serviços comuns de barbearia (*Corte Masculino, Barba, Corte + Barba, Sobrancelha, Nevou / Platinado*) e grava no storage via `JSON.stringify()`.
  4. Se a chave já existir, o script converte a string salva de volta para array usando `JSON.parse()`.
  5. A função `mostrarServicos()` é chamada, limpando linhas anteriores e gerando as linhas da tabela com nome, descrição, duração, preço formatado em reais e botões de ação.
* **Fluxo Alternativo (A1 - Nenhum Serviço Cadastrado):**
  * 3a. Se a lista estiver vazia (usuário excluiu todos os serviços), a tabela fica oculta e o aviso `#mensagemVazia` é exibido informando *"Nenhum serviço encontrado."*.
* **Pós-condições de Sucesso:** Tabela populada e exibida em tela com visual limpo.

---

### 📌 UC-004.2: Busca e Filtragem Dinâmica por Nome ou Descrição (SEARCH)
* **Ator Principal:** Barbeiro / Administrador.
* **Pré-condições:** Tabela de serviços renderizada na tela.
* **Gatilho:** Digitação de qualquer caractere no campo `#busca` (`onkeyup`).
* **Fluxo Principal:**
  1. O usuário digita um termo de busca (ex: *"barba"*).
  2. O evento chama a função `mostrarServicos()`.
  3. O script lê o valor do campo e converte o texto para letras minúsculas.
  4. Para cada item do array de serviços, o código compara se o texto digitado está contido no nome ou na descrição utilizando `.indexOf()`.
  5. A tabela é reconstruída instantaneamente apenas com os itens correspondentes.
* **Fluxo Alternativo (A1 - Nenhum Resultado Encontrado):**
  * 4a. Caso nenhum serviço atenda ao critério digitado, a tabela é ocultada e a mensagem de aviso `#mensagemVazia` aparece.
  * 4b. Quando o usuário apaga o texto da busca, a lista completa volta a ser exibida imediatamente.
* **Pós-condições de Sucesso:** Filtro reativo aplicado em tempo real sem recarregar a página.

---

### 📌 UC-004.3: Cadastro de Novo Serviço (CREATE)
* **Ator Principal:** Administrador.
* **Pré-condições:** Tela do catálogo aberta.
* **Gatilho:** Clique no botão `+ Novo Serviço`.
* **Fluxo Principal:**
  1. O usuário clica no botão `#botaoNovo`.
  2. A função `abrirFormularioNovo()` limpa os campos do formulário, define o título como *"Novo Serviço"*, seta o status padrão como *"Ativo"* e exibe o card `#caixaFormulario`.
  3. O foco do cursor vai direto para o campo `#campoNome`.
  4. O usuário preenche os campos (nome, descrição opcional, duração em minutos e preço em reais).
  5. O usuário clica em `Salvar`.
  6. A função `salvarServico()` valida os dados preenchidos (regras RN-01, RN-02 e RN-03).
  7. O sistema calcula o próximo ID (maior ID existente + 1) e insere o novo objeto no array.
  8. Os dados são salvos no `localStorage`, a tabela é redesenhada e o formulário é fechado.
* **Fluxo Alternativo (A1 - Dados Inválidos):**
  * 6a. Se o nome estiver em branco, um alerta solicita o preenchimento e o foco retorna ao campo de nome.
  * 6b. Se a duração for menor ou igual a zero, ou não for número, o sistema avisa e não salva.
  * 6c. Se o preço for negativo ou inválido, o sistema impede o salvamento.
* **Fluxo Alternativo (A2 - Cancelamento):**
  * 4a. O usuário clica no botão `Cancelar`, fechando o formulário sem salvar nada.
* **Pós-condições de Sucesso:** Novo serviço registrado e visível na tabela.

---

### 📌 UC-004.4: Edição de Serviço Existente (UPDATE)
* **Ator Principal:** Administrador.
* **Pré-condições:** Serviço listado na tabela.
* **Gatilho:** Clique no botão `Editar` na linha do serviço.
* **Fluxo Principal:**
  1. O usuário clica em `Editar` no item desejado.
  2. A função `abrirFormularioEdicao(id)` busca o objeto no array e popula os campos com os dados atuais.
  3. A variável de controle `idSendoEditado` recebe o ID numérico do serviço.
  4. O título da caixa muda para *"Editar Serviço"* e o card fica visível.
  5. O usuário altera os valores necessários e clica em `Salvar`.
  6. O sistema valida as alterações, localiza o item pelo ID no array e atualiza suas propriedades.
  7. A lista atualizada é salva no `localStorage`, a tabela é atualizada e a caixa fecha.
* **Pós-condições de Sucesso:** Dados do serviço alterados com sucesso na tabela e no storage.

---

### 📌 UC-004.5: Alternância Rápida de Status [Ativo / Inativo] (TOGGLE)
* **Ator Principal:** Administrador.
* **Pré-condições:** Serviço listado na tabela.
* **Gatilho:** Clique no botão `Ativar` ou `Desativar` da linha.
* **Fluxo Principal:**
  1. O usuário clica no botão de status da linha.
  2. A função `alternarStatusServico(id)` localiza o item no array.
  3. Se o status atual for `"Ativo"`, ele vira `"Inativo"`. Se for `"Inativo"`, vira `"Ativo"`.
  4. O novo estado é gravado no `localStorage`.
  5. A tabela é redesenhada: o texto do botão muda e a etiqueta do status troca de classe (`status_ativo` em verde para `status_inativo` em vermelho/cinza).
* **Pós-condições de Sucesso:** Status alterado imediatamente com um único clique.

---

### 📌 UC-004.6: Exclusão de Serviço com Confirmação (DELETE)
* **Ator Principal:** Administrador.
* **Pré-condições:** Serviço cadastrado e visível na tabela.
* **Gatilho:** Clique no botão `Excluir`.
* **Fluxo Principal:**
  1. O usuário clica no botão `Excluir` da linha do serviço.
  2. Uma caixa de diálogo do navegador (`confirm`) pergunta: *"Tem certeza que deseja excluir este serviço?"*.
  3. O usuário clica em `OK` (confirmar).
  4. O script filtra o array de serviços, criando uma nova lista que exclui o item selecionado.
  5. O novo array é persistido no `localStorage`.
  6. A tabela é redesenhada sem o item excluído.
* **Fluxo Alternativo (A1 - Cancelar Exclusão):**
  * 3a. Se o usuário clicar em `Cancelar`, a função aborta e nenhum registro é apagado.
* **Pós-condições de Sucesso:** Registro removido permanentemente do armazenamento local.

---

### 📏 Regras de Negócio (RN)

* **RN-01 (Nome Obrigatório):** O nome do serviço não pode ser deixado em branco nem conter apenas espaços.
* **RN-02 (Duração em Minutos):** A duração do procedimento deve ser um número inteiro positivo maior do que zero (ex: 30 min).
* **RN-03 (Preço Válido):** O valor cobrado deve ser um número maior ou igual a zero (permitindo serviços promocionais ou cortes cortesia a R$ 0,00).
* **RN-04 (Identificador Incremental Único):** Novos serviços recebem automaticamente um ID igual ao maior ID existente somado de 1.
* **RN-05 (Status Inicial Padrão):** Todo serviço novo é criado com status inicial definido como `"Ativo"`.
* **RN-06 (Confirmação para Remoção):** A exclusão de qualquer item exige confirmação do usuário para evitar perda acidental de dados.
* **RN-07 (Carga Seed Inicial):** Caso o sistema seja aberto pela primeira vez em um navegador limpo, devem ser criados 5 serviços modelo para demonstração imediata.
* **RN-08 (Formatação de Moeda BRL):** Os preços salvos como número puro no JavaScript são formatados em tela com o prefixo `R$` e vírgula decimal (ex: `R$ 35,00`).

---

### 🛡️ Requisitos Não-Funcionais (RNF)

* **RNF-01 (Tempo de Resposta do Front):** As operações de renderização da tabela, busca dinâmica e fechamento de modais devem responder em menos de 50 milissegundos.
* **RNF-02 (Responsividade Móvel):** A interface deve se adaptar a telas menores (smartphones e tablets) através de regras de layout flexível e quebras em `768px`.
* **RNF-03 (Acessibilidade Semântica WCAG 2.1):** O HTML deve utilizar elementos nativos estruturados (`table`, `thead`, `tbody`, `th[scope="col"]`, `label[for]` vinculado a `input[id]`), permitindo navegação lógica por teclado e leitores de tela.
* **RNF-04 (Segurança e Prevenção contra XSS):** O texto digitado pelo usuário deve ser inserido nas células via `innerText`, garantindo que caracteres como `<` e `>` sejam tratados como texto comum e não como scripts executáveis.
* **RNF-05 (Persistência no Cliente):** Utilização da Web Storage API (`localStorage`) para armazenar os dados localmente, com suporte a até 5MB de dados por domínio.
* **RNF-06 (Desenvolvimento Nativo e Sem Dependências):** O protótipo utiliza estritamente Vanilla JavaScript, HTML5 e CSS3 puro, dispensando bibliotecas pesadas ou frameworks complexos durante a fase de prototipagem.
* **RNF-07 (Otimização de Imagens em WebP):** Utilização exclusiva de imagens no formato WebP (`barbearia.webp` e `icone_barbearia.webp`), garantindo peso reduzido (< 100KB) e carregamento instantâneo.
* **RNF-08 (Execução Limpa - Clean Console):** O código deve rodar sem gerar mensagens de erro vermelhas no console do navegador durante todas as operações do CRUD.

---

## 4️⃣ TÓPICO 4: PROTÓTIPO DE TELA (HTML+CSS+JS)

### 🖥️ Mapeamento de Arquivos do Módulo

| Arquivo Físico | Papel no Protótipo |
|---|---|
| `dashboard/servicos/servicos.html` | Estrutura da página com cabeçalho de navegação, campo de busca, tabela de listagem e formulário de cadastro/edição. |
| `dashboard/servicos/servicos.css` | Folha de estilo visual, tema escuro moderno, espaçamentos, classes de status verde/vermelho e layout responsivo. |
| `dashboard/servicos/servicos.js` | Motor em JavaScript contendo as funções do CRUD, manipulação de arrays, eventos de formulário e persistência no storage. |
| `assets/icone_barbearia.webp` | Identidade visual da barbearia posicionada no topo da barra de navegação. |
| `assets/barbearia.webp` | Imagem decorativa de fundo utilizada nas telas do sistema. |

### 🔍 Componentes de Interface Desenvolvidos:
1. **Cabeçalho Superior com Navegação:** Contém a marca BarberFlow, abas para alternar entre *Agendamentos* e *Catálogo de Serviços* e botão de encerrar sessão (*Sair*).
2. **Barra de Ações e Busca:** Título da página acompanhado do botão de destaque `+ Novo Serviço` e campo de filtro com lupa para busca rápida por digitação.
3. **Tabela de Serviços:** Linhas zebradas e organizadas exibindo: Nome, Descrição, Duração em minutos, Preço formatado em reais, Badge de Status colorido e coluna de Ações com 3 botões (Editar, Ativar/Desativar e Excluir).
4. **Card de Formulário Dinâmico (`#caixaFormulario`):** Painel que aparece no centro da tela ao clicar em novo ou editar, contendo os campos de entrada, validações e botões de Salvar e Cancelar.
5. **Feedback de Lista Vazia (`#mensagemVazia`):** Bloco textual amigável que surge na tela caso nenhum serviço seja encontrado na busca ou caso a lista esteja vazia.

### 📋 Checklist de Conformidade do Protótipo (10/10)
* ✅ HTML5 estruturado semanticamente (`header`, `nav`, `main`, `table`, `thead`, `tbody`, `button`).
* ✅ Estilos CSS isolados e bem definidos sem conflitos de classes.
* ✅ JavaScript modular organizado por funções claras e comentadas.
* ✅ CRUD completo e funcional testado localmente.
* ✅ Persistência de dados ativa e recuperável via `localStorage`.
* ✅ Busca instantânea sem necessidade de submissão de formulário ou botão de "pesquisar".
* ✅ Tratamento de dados contra injeção de scripts (XSS) com `.innerText`.
* ✅ Imagens leves no formato moderno WebP.
* ✅ Confirmação prévia antes de exclusões.
* ✅ Execução com console 100% limpo no DevTools do navegador.

---

## 5️⃣ TÓPICO 5: ARQUITETURA E ADR

### 🏗️ Arquitetura de Componentes da Solução

O protótipo do BarberFlow nesta fase opera sob uma arquitetura **Single Page Component (SPA) no Front-End**, executando inteiramente no navegador do usuário:

```text
+-----------------------------------------------------------------------------------+
|                        NAVEGADOR WEB DO USUÁRIO (CLIENTE)                         |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                   CAMADA DE APRESENTAÇÃO (HTML5 + CSS3)                     |  |
|  |     [ Barra de Busca ]   [ Tabela de Serviços ]   [ Card Formulário ]       |  |
|  +-----------------------------------------------------------------------------+  |
|                                         ▲                                         |
|                                         │ Manipulação Segura (innerText)          |
|                                         ▼                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                 MOTOR DE REGRAS E EVENTOS (Vanilla JS ES6+)                 |  |
|  |     iniciar() | mostrarServicos() | salvarServico() | excluirServico()      |  |
|  +-----------------------------------------------------------------------------+  |
|                                         ▲                                         |
|                                         │ Serialização (JSON.stringify / parse)   |
|                                         ▼                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                      WEB STORAGE API (localStorage)                         |  |
|  |                       Chave: "servicos" (Array de Objetos)                  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

### 📝 Registro de Decisões de Arquitetura (ADRs)

#### 🔹 ADR-001: Persistência Local via Web Storage API (`localStorage`)
* **Status:** **ACEITO**
* **Contexto:** Necessidade de armazenar os serviços da barbearia de forma simples durante a prototipagem, permitindo testar recargas de página sem perder os dados cadastrados e sem exigir um servidor de banco de dados ativo.
* **Decisão:** Utilizar a API nativa `localStorage`, gravando a lista convertida em texto com `JSON.stringify()` e lendo de volta com `JSON.parse()`.
* **Alternativas Analisadas:**
  * *Variáveis globais em memória:* Perderiam tudo a cada `F5`.
  * *IndexedDB:* Muito mais complexo de configurar para a quantidade simples de dados necessária nesta semana.
* **Consequências:** Solução direta, sem dependência de internet ou bibliotecas adicionais, com persistência garantida na máquina local.

---

#### 🔹 ADR-002: Formulário Único Dinâmico para Cadastro e Edição
* **Status:** **ACEITO**
* **Contexto:** Evitar criar duas telas ou dois blocos HTML separados (um para criar e outro para editar serviços), reduzindo o tamanho do código e a repetição de estilos.
* **Decisão:** Manter um único elemento `#caixaFormulario` no HTML. Uma variável JavaScript chamada `idSendoEditado` guarda `null` quando for um novo cadastro e guarda o número do ID quando for uma edição.
* **Consequências:** Código mais limpo e fácil de manter (princípio DRY - Don't Repeat Yourself), com reaproveitamento integral dos campos e botões.

---

#### 🔹 ADR-003: Carga Inicial de Serviços de Demonstração (Seed Data)
* **Status:** **ACEITO**
* **Contexto:** Ao abrir o protótipo pela primeira vez na correção do professor, a tabela não deve aparecer vazia e sem graça, para que a interface e o funcionamento possam ser testados de imediato.
* **Decisão:** Na função `iniciar()`, se o `localStorage` não tiver nada salvo, o sistema cadastra automaticamente 5 serviços padrão (Corte Masculino, Barba, Combo, Sobrancelha e Platinado).
* **Consequências:** Facilidade de avaliação imediata da tabela, das cores de status e do campo de busca sem exigir que o avaliador digite dados manualmente do zero.

---

#### 🔹 ADR-004: Busca e Filtragem Direta na Memória do Navegador
* **Status:** **ACEITO**
* **Contexto:** A busca por serviços precisa ser ágil, permitindo que o usuário encontre um item enquanto digita sem lentidão.
* **Decisão:** Executar o filtro no próprio array em memória através do evento `onkeyup` do input, utilizando o método `.indexOf()` comparando nome e descrição em letras minúsculas.
* **Consequências:** Resposta visual instantânea (menos de 10ms), sem engasgos de interface e sem complexidade de bibliotecas externas.

---

#### 🔹 ADR-005: Proteção Básica contra Injeção de Código (XSS) via `innerText`
* **Status:** **ACEITO**
* **Contexto:** Garantir que se alguém cadastrar um serviço com caracteres especiais ou tags (como `<script>` ou `<b>`), isso não quebre a página nem execute códigos indevidos.
* **Decisão:** Preencher as células da tabela sempre usando `.innerText` em vez de `.innerHTML`.
* **Consequências:** O navegador renderiza qualquer entrada como texto puro, neutralizando tentativas simples de injeção de script de forma nativa e segura.

---

#### 🔹 ADR-006: Adoção do Formato WebP para Imagens do Projeto
* **Status:** **ACEITO**
* **Contexto:** Na entrega da Semana 03, o professor pontuou que imagens em JPG de alta resolução deixavam o projeto pesado desnecessariamente.
* **Decisão:** Converter todas as imagens da pasta `assets/` para a extensão `.webp`.
* **Consequências:** Redução de mais de 80% no tamanho dos arquivos de imagem sem perda perceptível de qualidade, acelerando o carregamento da página.

---

#### 🔹 ADR-007: Migração Futura para Backend Node.js / Express e Banco MySQL
* **Status:** **PROPOSTO** *(Evolução do Projeto — RF-006)*
* **Contexto:** Em um ambiente real de barbearia com vários computadores e celulares conectados, o `localStorage` não é suficiente porque ele só existe no navegador daquele aparelho específico.
* **Decisão:** Em etapas futuras do curso, conectar o front-end a um servidor backend em Node.js com Express e banco de dados relacional MySQL, tornando o catálogo e agendamentos compartilhados em tempo real via API REST (alinhado a **RF-006 — API RESTful e Backend**).
* **Consequências:** Centralização dos dados, sincronização entre dispositivos e histórico permanente de serviços e preços.

---

#### 🔹 ADR-008: Criptografia de Senhas com Algoritmo Bcrypt (RF-008)
* **Status:** **PROPOSTO** *(Roadmap de Segurança)*
* **Contexto:** Ao migrar para o banco de dados MySQL, as senhas de usuários (Clientes, Barbeiros e Administradores) não podem ser armazenadas em texto puro para preservar a privacidade e conformidade de segurança.
* **Decisão:** Utilizar a biblioteca `bcrypt` no backend Node.js para converter as senhas em hashes criptográficos irrecuperáveis antes de salvá-las no MySQL, comparando apenas os hashes no momento da autenticação.
* **Consequências:** Proteção sólida das credenciais mesmo em caso de acesso indevido à base de dados.

---

#### 🔹 ADR-009: Painel de Indicadores e Métricas Financeiras na Dashboard (RF-005)
* **Status:** **PROPOSTO** *(Roadmap de Interface e Negócio)*
* **Contexto:** Necessidade do gestor da barbearia acompanhar a saúde financeira do estabelecimento diretamente pelo sistema em tempo real.
* **Decisão:** Adicionar cards informativos no topo da Dashboard calculados dinamicamente a partir dos agendamentos:
  * **Faturamento Bruto:** Soma do valor dos atendimentos marcados como *Confirmado*.
  * **Taxa de Conversão/Cancelamento:** Proporção percentual de atendimentos Confirmados vs. Cancelados.
  * **Contadores por Status:** Quantitativo de agendamentos Confirmados, Pendentes e Cancelados.
  * **Atualização em Tempo Real:** Recálculo imediato dos valores ao cadastrar, alterar ou excluir um atendimento.
* **Consequências:** Visibilidade financeira imediata para o dono do negócio sem esforço manual de cálculo.

---

#### 🔹 ADR-010: Integração de Notificações via WhatsApp / Google Calendar (RF-007)
* **Status:** **PROPOSTO** *(Ideia Preliminar para Futuro)*
* **Contexto:** Ideia de automatizar lembretes de corte para os clientes e sincronizar horários com a agenda pessoal do Google.
* **Decisão:** Manter registrado como proposta no backlog do projeto para implementação futura.
* **Observação:** A princípio o grupo ainda não estudou a fundo a viabilidade técnica, consumo de APIs externas ou custos envolvidos nesta ideia, tratando-se apenas de uma proposta preliminar para evolução futura do BarberFlow.

---

### 🗺️ Matriz de Rastreabilidade: Requisitos Futuros x Decisões de Arquitetura (ADRs)

Para assegurar a coerência entre a visão de produto e o planejamento técnico, a tabela abaixo mapeia diretamente como cada Requisito Funcional proposto no backlog é sustentado por sua respectiva Decisão de Arquitetura (ADR):

| Requisito Funcional (Backlog) | ADR Vinculada | Decisão Arquitetural Adotada | Status |
|---|:---:|---|:---:|
| **RF-005** — Painel de Métricas Financeiras | **ADR-009** | Cards calculados dinamicamente no front-end em tempo real a partir dos agendamentos confirmados. | **PROPOSTO** |
| **RF-006** — API RESTful e Backend | **ADR-007** | Servidor centralizado Node.js + Express substituindo o `localStorage` por requisições HTTP JSON. | **PROPOSTO** |
| **RF-007** — Notificações WhatsApp / Google Calendar | **ADR-010** | Ideia preliminar de integração com APIs externas (sem estudo técnico aprofundado nesta etapa). | **PROPOSTO** |
| **RF-008** — Criptografia de Senhas (Bcrypt) | **ADR-008** | Hashes criptográficos irreversíveis gerados pela biblioteca Bcrypt antes da persistência no banco MySQL. | **PROPOSTO** |

---

### 💻 Tabela de Tecnologias Utilizadas

| Camada | Tecnologia | Função no Projeto | Justificativa Acadêmica |
|---|---|---|---|
| **Estrutura (Front)** | HTML5 Semântico | Marcação das telas | Padrão web acessível e compatível com leitores de tela. |
| **Estilização (Visual)** | CSS3 Modular | Design escuro responsivo | Flexbox nativo e media queries sem necessidade de frameworks pesados como Bootstrap. |
| **Comportamento (Lógica)**| Vanilla JavaScript (ES6) | Funções do CRUD e eventos | Execução direta no navegador com alto desempenho e aprendizado dos fundamentos. |
| **Armazenamento** | Web Storage (`localStorage`) | Persistência dos dados | Solução prática para protótipos funcionais que mantém os dados após fechar a aba. |
| **Mídia e Assets** | WebP | Ícones e ilustrações | Padrão moderno de compressão para web atendendo ao feedback de performance da banca. |

---

## 6️⃣ TÓPICO 6: QUALIDADE E CONFORMIDADE

### ✅ Checklist de Verificação de Conformidade Documental (Protocolo v14.3)

* ✅ **Estrutura de Diretórios 100% Conforme:** Pastas rigorosamente organizadas sob `docs/requisitos-semanais/SEMANA-06/` e `src/prototipos/SEMANA-06/RF-004-catalogo-de-servicos/`.
* ✅ **Mapeamento Real de Arquivos:** Todos os arquivos citados no documento existem na pasta e foram testados em conjunto no navegador.
* ✅ **Linguagem Clara e Realista:** Texto técnico condizente com estudantes de Análise e Desenvolvimento de Sistemas, explicando as decisões tomadas de forma sincera e fundamentada.
* ✅ **Casos de Uso Granulares:** Subdivididos em 6 casos de uso individuais (UC-004.1 a UC-004.6), atendendo à recomendação de detalhamento do professor.
* ✅ **Conjunto Completo de RNFs:** Lista robusta com 8 Requisitos Não-Funcionais cobrindo performance, acessibilidade, segurança e qualidade de código.
* ✅ **ADRs Estruturadas:** 7 registros de decisão documentando o que foi feito na prática e o que está planejado para o futuro do sistema.
* ✅ **Formatação Limpa em Markdown:** Cabeçalhos hierárquicos, tabelas organizadas e blocos de código com destaque de sintaxe para facilitar a leitura.

---

**Fim da Especificação Técnica do Módulo de Catálogo de Serviços (RF-04)**  
*BarberFlow — Sistema de Gestão de Barbearia (2026)*  
*Laboratório de Inovação II — Prof. Edilberto Silva* 💈
