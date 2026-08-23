<!-- ===== Visão geral do projeto ===== -->
# Documentação do Projeto Angular

Este documento descreve a estrutura do frontend Angular, os principais módulos, componentes e páginas do projeto. O objetivo é fornecer uma visão geral clara em português para desenvolvedores que estão trabalhando no sistema.

<!-- ===== Estrutura principal ===== -->
## Estrutura principal da aplicação

A aplicação está organizada em várias pastas dentro de `src/app/`:

- `components/`: componentes reutilizáveis e específicos de funcionalidade.
- `pages/`: páginas principais do sistema que combinam componentes.
- `models/`: definições de interfaces e tipos usados no projeto.
- `service/`: serviços no estilo Angular para lidar com autenticação e notificações.
- `services/`: serviços de dados de implementação local, como dados de exemplo de EPIs.

<!-- ===== App geral ===== -->
## App e configuração geral

- `src/app/app.ts`: componente principal que contém a estrutura do app e lógica de navegação.
- `src/app/app.html`: template de layout principal que carrega o conteúdo via `router-outlet`.
- `src/app/app.config.ts`: configuração do Angular, incluindo provedor HTTP com interceptor de autenticação.

<!-- ===== Rotas e autenticação ===== -->
## Rotas e guarda de autenticação

- `src/app/components/epi/app.routes.ts`: define as rotas principais do sistema (`/login`, `/epi`, `/treinamento`, etc.).
- `src/app/auth/auth.guard.ts`: guarda de rota que protege páginas que exigem login.
- `src/app/auth/auth-interceptor.ts`: adiciona o token de autenticação a requisições HTTP.

<!-- ===== Componente de login ===== -->
## Login

- `src/app/components/geral/login/login.ts`: componente de login com campos `cpf` e `senha`.
- `src/app/components/geral/login/login.html`: template de login com formulário e botão de "Esqueci minha senha".
- `src/app/components/geral/login/login.scss`: estilos do formulário de login.

O login atualmente usa credenciais de teste fixas e armazena um token local para permitir acesso às páginas protegidas.

<!-- ===== Homepage ===== -->
## Homepage

- `src/app/components/geral/homepage/homepage.ts`: lógica da página inicial, incluindo cálculos de EPIs válidos, próximos do vencimento e vencidos.
- `src/app/components/geral/homepage/homepage.html`: layout visual do painel inicial com estatísticas e listas de alerta.
- `src/app/components/geral/homepage/homepage.scss`: estilos específicos da homepage.

Essa página exibe métricas geradas a partir do serviço de notificações e serve como dashboard do usuário.

<!-- ===== Cabeçalho e navegação ===== -->
## Cabeçalho e navegação

- `src/app/components/geral/app-header/app-header.ts`: componente de cabeçalho com estados de notificação e opções de menu.
- `src/app/components/geral/app-header/app-header.html`: markup do cabeçalho e painel de avisos.

O cabeçalho também permite configurar os dias de aviso de vencimento para EPIs e NRs.

<!-- ===== Gestão de EPIs ===== -->
## Gestão de EPIs

### Páginas relacionadas
- `src/app/pages/epi-management/epi-management.ts`: controla as abas de gerenciamento de EPIs (`busca`, `cadastro`, `entrega`, `historico`).
- `src/app/pages/epi-management/epi-management.html`: template da página de gerenciamento de EPIs.

### Componentes de EPI
- `src/app/components/epi/epi-filter/epi-filter.ts`: componente de busca e filtro de EPIs (atualmente apenas template sem lógica de filtro implementada).
- `src/app/components/epi/epi-filter/epi-filter.html`: interface de filtro e tabela de resultados de EPIs.
- `src/app/components/epi/entrega-epi/entrega-epi.ts`: lógica de entrega de EPIs, seleção de itens e upload de ficha.
- `src/app/components/epi/entrega-epi/entrega-epi.html`: formulário de entrega com upload e listagem de itens.
- `src/app/components/epi/ficha-entrega-epi-modal/ficha-entrega-epi-modal.ts`: modal de ficha digital para entrega de EPIs.
- `src/app/components/epi/ficha-entrega-epi-modal/ficha-entrega-epi-modal.html`: template do modal de ficha digital.
- `src/app/components/epi/replace-epi-modal/replace-epi-modal.ts`: modal para marcar um EPI como substituído.
- `src/app/components/epi/replace-epi-modal/replace-epi-modal.html`: template do modal de substituição.
- `src/app/components/geral/admin-history/admin-history.ts`: histórico de alterações administrativas.
- `src/app/components/geral/admin-history/admin-history.html`: lista de alterações da administração.

### Dados de exemplo e modelos
- `src/app/services/epi-data.ts`: provê dados de exemplo para EPIs, entregas, histórico e relatórios.
- `src/app/models/epi.models.ts`: modelagem de tipos como `EpiRecord`, `EmployeeEpi`, `DeliveryItem`, `HistoryEntry`, entre outros.

<!-- ===== Portal do funcionário ===== -->
## Portal do Funcionário

- `src/app/components/funcionario/funcionario-portal.ts`: componente principal do portal do funcionário.
- Rotas filhas incluem relatórios de estado e listas de EPIs.
- `src/app/pages/employee-report/employee-report.ts`: componente de página onde o funcionário pode relatar o estado do EPI.
- `src/app/pages/employee-report/employee-report.html`: template da página de relatório com upload de imagens e comentário.

Essa área ainda está em desenvolvimento e serve como base para o portal interno do funcionário.

<!-- ===== Treinamentos ===== -->
## Treinamentos

- `src/app/components/treinamento/gerenciar-treinamento.ts`: componente de gestão de treinamentos.
- `src/app/components/treinamento/gerenciar-treinamento.html`: template com mensagem de área em breve.

Atualmente essa funcionalidade está apenas estruturada com placeholder. A gestão de treinamentos não possui ainda lógica de cadastro ou edição.

<!-- ===== Autenticação e serviços ===== -->
## Serviços principais

- `src/app/service/auth.ts`: serviço de autenticação do frontend.
- `src/app/service/notificacao.ts`: serviço que define dados de EPIs monitorados, cálculo de vencimento e persistência de configuração de aviso.

Esses serviços suportam a navegação, o estado de autenticação e a exibição dos avisos de EPIs e NRs.

<!-- ===== Observações do estado atual ===== -->
## Observações do estado atual

- Muitas telas existem como protótipos ou placeholders.
- A página de login está funcional com validação local de usuário de teste.
- A página de homepage já mostra métricas de EPIs e listas de alerta, mas é baseada em dados fixos.
- A gestão de EPIs tem componentes de formulário e modal funcionando no frontend.
- A gestão de treinamentos ainda precisa de implementação real.
- O portal do funcionário exibe relatório de estado e upload de imagens.

<!-- ===== Como executar ===== -->
## Como executar o projeto

No diretório `Angular`, use os comandos padrão do Angular CLI:

```bash
npm install
ng serve
```

Depois de iniciar, acesse `http://localhost:4200/`.

<!-- ===== Notas adicionais ===== -->
## Notas adicionais

- O projeto usa Angular standalone components em várias partes.
- A navegação é baseada no roteador Angular e no `authGuard`.
- Os dados de EPIs e entregas são fornecidos por serviços locais para prototipagem.
- Para continuar o desenvolvimento, foque na implementação das telas de cadastro de EPI, treinamentos e portal do funcionário.
