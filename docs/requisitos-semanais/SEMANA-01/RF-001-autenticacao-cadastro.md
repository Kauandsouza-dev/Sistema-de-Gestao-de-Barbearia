# 📋 ENTREGA SEMANAL DE REQUISITOS — SEMANA-01
**Versão:** 12.2
**Laboratório de Inovação II -** Prof. Edilberto Silva — 2026
**Formato:** Markdown (padrão de correção automatizada)
**Valor Total da Entrega:** 100%
**Data de Entrega:** 30/08/2026
**Grupo:** Barbearia - Grupo 05
**Integrantes:**
* Braynt Oliveira (braynt62123906@edu.df.senac.br)
* Cauê Schwantes (caue62139126@edu.df.senac.br)
* Gabriel Lima (gabriel61889806@edu.df.senac.br)
* Kauan Souza (kauan61701296@edu.df.senac.br)
* Pedro Quartieri (pedro54660396@edu.df.senac.br)
---


#### ⚙️ ESTRUTURA DE DIRETÓRIOS


```
barberflow/
├── docs/
│   ├── requisitos-semanais/
│   │   ├── SEMANA-01/
│   │   │   ├── RF-001-autenticacao-cadastro.md (ESTE ARQUIVO - ENTREGAR)
│   │   └── ... (SEMANA-XX)
│
├── src/
│   ├── prototipos/
│   │   ├── SEMANA-01/
│   │   │   ├── RF-001-autenticacao-cadastro/
│   │   │   │   ├── index.html (tela de Login)
│   │   │   │   ├── pages
│   │   │   │       ├── cadastro.html (tela de cadastro)
│   │   │   │       ├── cadastro_senha.html (tela de inserção de senha do cadastro)
│   │   │   │       └── cadastro_senha_sucesso.html (tela de confirmação de cadastro)
│   │   │   │   ├── styles
│   │   │   │   	   │── style.css (CSS compartilhado entre as telas)
│   │   │   │       └── cadastro.css (tela de inserção de senha do cadastro)
│   │   │   │   ├── assets
│   │   │   │   	   │── barbearia.jpg
│   │   │   │       └── icone_barbearia.jpg
│   │   └── ... (SEMANA-XX)
```


* **Localização deste arquivo:** `docs/requisitos-semanais/SEMANA-01/RF-001-autenticacao-cadastro.md`
* **Localização do Protótipo HTML+CSS:** `src/prototipos/SEMANA-01/RF-001-autenticacao-cadastro/index.html` ⚠️ **OBRIGATÓRIO**


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


#### RF-001: Autenticação e Cadastro de Usuários (BarberFlow)
* **ID:** RF-001
* **Título:** Autenticar usuários e cadastrar novos usuários (clientes/colaboradores)
* **Tipo:** Requisito Funcional
* **Prioridade:** ALTA (Bloqueia o acesso de clientes a agendamentos e de administradores/barbeiros a painéis de controle do negócio)
* **Complexidade:** MÉDIA (Estimado 5 story points)
* **Status:** EM DESENVOLVIMENTO
* **Data de Criação:** 25/08/2026
* **Última Atualização:** 30/08/2026


**Breve Descrição:**  
O sistema **BarberFlow** deve permitir que usuários internos (Administradores e Barbeiros) e clientes façam login em sua conta e, para clientes ou novos colaboradores autorizados, realizem seu cadastro em etapas sequenciais (Cadastro Step-by-Step), de forma responsiva, moderna e segura.


---


### 2️⃣ DESCRIÇÃO E ATORES (15%)


#### Descrição Detalhada
**Por que este requisito existe?**  
O sistema BarberFlow necessita desse módulo central de Gestão de Acesso e Identidade (IAM) para:
* Restringir o acesso aos painéis administrativos da barbearia (faturamento, serviços, barbeiros) a colaboradores autorizados.
* Diferenciar os níveis de visualização e ação entre o Administrador da Barbearia, o Barbeiro e o Cliente Final.
* Assegurar a integridade e privacidade de dados de agendamentos e transações de clientes.
* Prover um mecanismo seguro e sem atritos de cadastro (separado em etapas de E-mail e Senha).
* Manter trilhas de auditoria das atividades críticas (logs de acesso).


**Contexto do Negócio:**  
A porta de entrada do sistema é a tela de login (`index.html`), que apresenta um painel moderno e focado na experiência do usuário (UX). Ela destaca a marca BarberFlow, apresenta um banner de marketing em telas grandes e fornece os campos padrão de autenticação (E-mail e Senha). Caso o visitante não possua uma conta, ele é guiado para a primeira etapa do fluxo de cadastro (`pages/cadastro.html`), onde informa seu e-mail e avança para a definição de senha criptografada (`pages/cadastro_senha.html`) antes de ativar sua conta (`pages/cadastro_senha_sucesso.html`).


#### Atores do Sistema


##### 1. CLIENTE (Ator Principal)
* **Papel:** Autenticar-se no sistema para agendar serviços de corte e barba, visualizar seu histórico de agendamentos e gerenciar seus dados cadastrais.
* **Responsabilidade:** Fornecer dados cadastrais válidos e manter o sigilo de suas credenciais de segurança.
* **Permissões:**
  * ✅ CREATE (cadastrar sua própria conta via fluxo em etapas)
  * ✅ READ (visualizar seus dados pessoais e agendamentos)
  * ✅ UPDATE (alterar sua senha ou informações cadastrais)
  * ❌ DELETE (sem permissão de exclusão física)


##### 2. BARBEIRO / COLABORADOR (Ator Secundário)
* **Papel:** Autenticar-se no painel interno para visualizar sua agenda pessoal de atendimentos e comissões diárias.
* **Responsabilidade:** Prestar os serviços agendados e atualizar o status dos atendimentos concluídos.
* **Permissões:**
  * ✅ READ (visualizar exclusivamente sua escala de trabalho diária)
  * ✅ UPDATE (alterar o status do agendamento para "concluído")
  * ❌ CREATE / DELETE (sem permissão para gerenciar outros usuários ou cadastrar novos barbeiros)


##### 3. ADMINISTRADOR (Dono da Barbearia)
* **Papel:** Autenticar-se no painel corporativo com privilégios de alto nível para gerenciar o faturamento total da barbearia, cadastrar serviços e barbeiros colaboradores.
* **Responsabilidade:** Auditar relatórios e gerenciar quem tem acesso administrativo ao sistema de gestão.
* **Permissões:**
  * ✅ CREATE / READ / UPDATE / DELETE (controle total sobre as tabelas de usuários, serviços e agendamentos)


##### 4. SISTEMA (Ator Automático)
* **Papel:** Validar a conformidade dos dados de login e cadastro.
* **Responsabilidade:** Consultar bases e impedir e-mails duplicados.
* **Permissões:**
  * ✅ Todas as operações lógicas e transacionais de banco de dados.


#### Benefícios por Ator:
* **Cliente:** Consegue criar sua conta rapidamente sem atritos cognitivos e acessar a agenda de marcações a qualquer hora.
* **Administrador / Barbeiro:** Controla o tráfego do negócio com segurança e restringe o acesso de dados de faturamento a colaboradores externos.
* **Negócio:** Reduz agendamentos falsos através da pré-validação de e-mail e garante conformidade com as melhores práticas de LGPD e segurança da informação.


---


### 3️⃣ ESPECIFICAÇÃO DE CASOS DE USO (25%)


#### UC-001: Autenticar e Cadastrar Usuários no BarberFlow


##### Pré-Condições
* ✅ Servidor de banco de dados MySQL operacional e acessível.
* ✅ Para o login, o usuário deve possuir uma conta ativa cadastrada.


##### Pós-Condições (Sucesso)
* ✅ Uma sessão de login segura é iniciada.
* ✅ O usuário é redirecionado para o painel correspondente ao seu perfil (Cliente, Barbeiro ou Administrador).
* ✅ Tentativas bem-sucedidas são registradas no log de auditoria.


##### Pós-Condições (Falha)
* ✅ Mensagem genérica de erro exibida na interface para evitar ataques de enumeração.
* ✅ Sessão de login não é criada, e os campos são limpos.
* ✅ Tentativas falhas são salvas em log contendo IP de origem e timestamp.


##### Fluxo Principal (Autenticação / Login)
1. O usuário acessa a tela inicial do BarberFlow (`index.html`).
2. O sistema renderiza a interface com a marca da barbearia, o slogan motivador e o formulário de Portal de Acesso.
3. O usuário clica na opção de cadastro de usuário.
4. O usuário insere seu e-mail de acesso no campo correspondente.
5. O usuário insere sua senha cadastrada no campo de senha.
6. O usuário clica no botão "Finalizar cadastro".
7. Uma mensagem de confirmação é apresentada identificando o sucesso no cadastro do usuário.
8. O usuário clica no botão “Voltar para a página de login” e é redirecionado para a mesma.


---


#### Regras de Negócio (RN)
* **RN-01 (Unicidade de Identificador):** O campo e-mail deve ser chave única e exclusiva na tabela `usuarios`. Não é permitido duplicidade.
* **RN-02 (Política de Senha Forte):** Toda senha de conta no BarberFlow deve possuir, obrigatoriamente, no mínimo 6 caracteres no momento da criação ou alteração.
* **RN-03 (Consistência de Senha):** O campo de senha e a confirmação de senha do cadastro devem ser idênticos.
* **RN-04 (Consistência de Chave Estrangeira):** Todo registro inserido na tabela `usuarios` deve referenciar obrigatoriamente um identificador válido existente na tabela `perfis`.
* **RN-05 (Validação Sintática no Cliente):** A primeira etapa do cadastro de clientes só deve enviar a requisição ao servidor caso o campo e-mail passe pela validação de formato (conter caracteres antes e depois do `@` e do `.`).
* **RN-06 (Bloqueio Anti-Robô):** O formulário de login deve bloquear temporariamente por 15 minutos o acesso a uma conta após 5 tentativas consecutivas de autenticação sem sucesso, mitigando ataques de dicionário.


---


#### Requisitos Não-Funcionais (RNF)
* **RNF-01 (Responsividade da Interface):** A interface do BarberFlow deve ser 100% responsiva, adaptando-se a resoluções de telas mobile a partir de 320px até telas desktop de 1024px ou superiores.
* **RNF-02 (Prevenção de Ataques de Enumeração):** As respostas de erros de login devem ser totalmente genéricas, sem indicar se o e-mail ou a senha foi o fator de falha.
* **RNF-03 (Interface intuitiva):** A paleta de cores deve ter bom contraste entre texto e fundo, garantindo fácil leitura, e a navegação deve ser simples o suficiente para que o usuário conclua as ações sem dificuldade.
* **RNF-04 (Rastreabilidade de Segurança):** O sistema deve gravar logs persistentes e imutáveis de acessos contendo ID do usuário, timestamp do evento e endereço IP originador.


---


### 4️⃣ PROTÓTIPOS/FLUXOS DE TELAS (HTML+CSS) (20%)


O protótipo visual foi desenvolvido de forma modular e responsiva para representar o fluxo completo da Semana 01 do **BarberFlow**:


* **Localização das Telas no Repositório:**
  * Login Inicial: `index.html`
  * Cadastro - Etapa 1: `pages/cadastro.html`
  * Cadastro - Etapa 2 (Senha): `pages/cadastro_senha.html`
  * Cadastro - Etapa 3 (Sucesso): `pages/cadastro_senha_sucesso.html`
  * Estilo da Home: `styles/style.css`
  * Estilo do Cadastro: `styles/cadastro.css`


#### Estados de Interface Implementados:


##### 1. Login Inicial (`index.html`):
* **Apresentação:** Fundo escuro imersivo com imagem de barbearia estilizada por degradê suave para dar legibilidade às informações. O cabeçalho à esquerda conta com o ícone da barbearia (`assets/icone_barbearia.jpg`) e o título estilizado da marca BarberFlow.
* **Portal de Acesso:** Card na cor `whitesmoke` que recebe o e-mail, senha, caixa de seleção para persistir a conexão ("Lembrar-me") e o botão de ação principal "Entrar". O link de redirecionamento "Não tem uma conta? Crie aqui!" aponta diretamente para o cadastro.


##### 2. Cadastro - Etapa 1 (E-mail - `pages/cadastro.html`):
* **Comportamento:** Tela limpa na cor clara, com foco no preenchimento de segurança do e-mail. Caso o usuário insira um e-mail sem formato válido, a função de validação no cliente impede o envio e exibe um alerta intuitivo solicitando a correção antes de avançar para a próxima etapa de segurança.


##### 3. Cadastro - Etapa 2 (Senha - `pages/cadastro_senha.html`):
* **Comportamento:** O usuário informa sua nova credencial de acesso e a repete no campo de confirmação. O script interno verifica se os campos possuem equivalência exata (RN-04) e se atendem ao limite mínimo de 6 caracteres (RN-03). Em caso de divergência, emite o alerta visual correspondente e congela a submissão.


##### 4. Cadastro - Etapa 3 (Sucesso - `pages/cadastro_senha_sucesso.html`):
* **Comportamento:** Tela de feedback positivo indicando que a conta foi aberta com sucesso e solicitando que o usuário verifique sua caixa de e-mail para ativação segura da conta antes de habilitar o login. Fornece o botão de retorno "Voltar à página de login" para facilitar a navegação do usuário.


**Checklist de Conformidade Atendido (10/10):**
* ✅ HTML5 estruturado semanticamente (`main`, `section`, `form`, `label`, `input`).
* ✅ Design responsivo com media queries de quebra em `768px`.
* ✅ Estilos modulares e apartados (`styles/style.css` e `styles/cadastro.css`).
* ✅ Validações dinâmicas de interface operando no cliente via JavaScript nativo.


---


### 5️⃣ ARQUITETURA E ADR (20%)


#### Arquitetura de Componentes da Solução


O fluxo de dados do BarberFlow opera sob o modelo clássico de arquitetura **Cliente-Servidor de N-Camadas**, estruturado de forma desacoplada para otimizar desempenho e segurança:


```text
  [ CAMADA DE APRESENTAÇÃO ]
             │ (Dispositivos Móveis / Browsers Desktop)
             ▼
  [ PROTOCOLO HTTPS (SSL/TLS 1.3) ]
             │
             ▼
  [ CAMADA DE APLICAÇÃO (BACKEND) ] ──► [ CONTROLADOR AUTH EXPRESS.JS ]
             │                                        │
             │ (Validação de Hash Bcrypt)             ▼
             ├────────────────────────────────► [ GERA SESSÃO JWT ]
             │
             ▼ (Driver de Conexão Segura TCP/IP)
  [ CAMADA DE DADOS ] ◄──► [ SGBD RELACIONAL MYSQL ]
```


---


#### Registro de Decisão de Arquitetura (ADR)


##### ADR-001: MySQL como Banco de Dados Relacional Principal
* **Status:** ACEITO
* **Contexto:** O BarberFlow necessita de um sistema de persistência estruturado e robusto para armazenar credenciais de usuários, perfis de acesso, e-mails de clientes e dados futuros de agendamentos. Esse ecossistema exige forte integridade referencial, consistência absoluta (propriedades ACID) e fácil gerenciamento de tabelas lógicas .
* **Decisão:** Adotar o SGBD relacional **MySQL 8+** como motor principal de banco de dados do sistema de barbearia.
* **Alternativas Analisadas:**
  * *MongoDB (NoSQL):* Descartado por não possuir o controle rigoroso de transações lógicas e restrições de chaves estrangeiras necessárias para gerenciar agendas de múltiplos barbeiros de forma consistente.
  * *PostgreSQL:* Excelente alternativa, mas a familiaridade técnica da equipe e o tempo de desenvolvimento reduzido justificaram a seleção do MySQL.
* **Consequências:**
  * ✅ Integridade ACID garantida para evitar double-booking de horários de corte.
  * ✅ Curva de aprendizado rápida e suporte nativo nas principais hospedagens.
  * ⚠️ Necessidade de gestão controlada de esquemas de tabelas e atualizações de migrations lógicas.


##### ADR-002: Bcrypt para Hashing Criptográfico de Senhas
* **Status:** ACEITO
* **Contexto:** Senhas de usuários (`usuarios.senha`) jamais devem ser armazenadas de forma visível ou em texto plano para garantir a conformidade com as regras de segurança digital da faculdade e leis vigentes de proteção de dados (LGPD).
* **Decisão:** Implementar a biblioteca **Bcrypt** no backend Node.js para criptografar as senhas do BarberFlow com um fator de salt padrão de 12 rounds antes de salvá-las na base MySQL.
* **Alternativas Analisadas:**
  * *MD5 / SHA-256:* Descartados por serem altamente suscetíveis a ataques de decodificação rápida por Rainbow Tables ou processamento em GPU.
* **Consequências:**
  * ✅ Criptografia altamente segura em conformidade com as diretrizes OWASP.
  * ✅ Implementação automática de proteção adaptativa contra ataques de brute-force
  * ⚠️ Maior processamento computacional de CPU a cada tentativa de validação de acesso.


##### ADR-003: REST API Stateless baseada em Express.js
* **Status:** ACEITO
* **Contexto:** O backend do BarberFlow deve responder de forma eficiente às requisições enviadas pelas telas de login, cadastro e redefinição de senhas, operando em alto desempenho sem prender memória física do servidor.
* **Decisão:** Construir o servidor backend utilizando a pilha **Node.js** com o framework leve e rápido **Express.js 4.18+**.
* **Alternativas Analisadas:**
  * *Django (Python) / Rails (Ruby):* Frameworks pesados ("opinionated") que aumentariam de forma desnecessária o tempo de desenvolvimento e o consumo de infraestrutura.
* **Consequências:**
  * ✅ Arquitetura leve, flexível e modular de microsserviços.
  * ✅ Uniformidade de linguagem (JavaScript full-stack) para toda a equipe.
  * ⚠️ Exige maior cuidado na padronização de middlewares e rotas para manter a organização do código.


---


#### Tabela de Tecnologias Escolhidas e Justificativas


| Camada | Tecnologia | Versão | Justificativa |
|---|---|---|---|
| **Apresentação (Front)** | HTML5 / CSS3 / Vanilla JS | ES2015+ | Web padrão, garantindo alto desempenho, responsividade móvel e sem dependências pesadas. |
| **Pilha de Execução** | Node.js | 18 LTS | Plataforma escalável e veloz para APIs assíncronas de alta performance. |
| **Servidor (Backend)** | Express.js | 4.18+ | Framework minimalista e flexível para gerenciar middlewares de segurança e endpoints. |
| **Persistência (BD)** | MySQL | 8+ | Banco de dados relacional clássico de alta consistência ACID e fácil deploy em ambiente acadêmico. |
| **Hash de Segurança** | Bcrypt | 5+ | Padrão OWASP para hashing irreversível de senhas com salting dinâmico. |
| **Validador de Entrada** | Express-Validator | 7+ | Middleware de validação robusto para garantir a higienização de inputs no backend. |


---


### 6️⃣ QUALIDADE E CONFORMIDADE (10%)


#### Checklist de Qualidade Documental:
* ✅ **Zero Erros Ortográficos:** Revisado minuciosamente em português brasileiro.
* ✅ **Markdown Estruturado:** Uso correto de tabelas, cabeçalhos de níveis claros, blocos lógicos e formatação em negrito para facilitar a leitura da banca.
* ✅ **Syntax Highlight:** Todos os diagramas e listas técnicas contam com realce de sintaxe adequado em markdown.
* ✅ **Fidelidade de Caminhos:** Todos os caminhos de arquivos, classes de estilo e JavaScript refletem o código de front-end real fornecido pela equipe do BarberFlow.
* ✅ **Limpeza de Template:** Todas as orientações, notas explicativas em azul ou colchetes de placeholders do template oficial foram inteiramente removidos para a entrega definitiva.


---


**Fim da Especificação Técnica do Módulo de Autenticação e Cadastro (RF-001)**  
*BarberFlow - Sistema de Gestão de Barbearia — 2026.*



