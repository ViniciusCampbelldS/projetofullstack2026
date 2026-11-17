# Prompt para continuar no Codex

Copie o texto abaixo para um novo chat no Codex, após adicionar as duas pastas locais ao workspace. Substitua os caminhos pelos caminhos reais no seu computador.

---

Continue meu projeto didático de gestão de EPIs e treinamentos. Converse em português, com explicações simples. O projeto principal é o do Vinicius.

## Repositórios separados

- Backend: https://github.com/ViniciusCampbelldS/tst-java-db-access-api
- Frontend: https://github.com/ViniciusCampbelldS/projetofullstack2026
- Pasta backend no computador: <PREENCHER_CAMINHO_BACKEND>
- Pasta frontend no computador: <PREENCHER_CAMINHO_FRONTEND>

Preserve os dois .git independentes e faça commits separados por funcionalidade e repositório. Não use cópias da conta zZzArthurz nem reescreva histórico publicado. A antiga pasta /workspace era de um ambiente Linux na nuvem; não existe necessariamente no meu Windows.

Antes de mudar código, leia AGENTS.md e CONTINUAR-NO-CODEX.md nos dois repositórios; leia TODO no backend e TTTODO.md no frontend. Confira branch, remotes, alterações locais e commits atuais. Preserve trabalho não commitado. Não presuma que o novo chat herdou acesso ao GitHub, Render, Vercel ou Supabase.

## Links publicados

- Frontend principal: https://projetofullstack2026-chi.vercel.app/login
- API Spring Boot: https://tst-java-db-access-api.onrender.com
- Render: https://dashboard.render.com/web/srv-db2k45d9fdbs739nn4b0
- Supabase: https://supabase.com/dashboard/project/aabhyazfeeiwegchfxrl
- Vercel project ID: prj_13tpDfnl738Ne8RtqI4wWKk70YjD (conta/espaço do Vinicius).

Confirme a conta e o repositório de origem antes de publicar. Credenciais ficam em variáveis de ambiente/conexões autorizadas. Não coloque senhas, tokens, cookies ou dados de produção em commits, logs ou mensagens. O ADMIN inicial é o funcionário ID7; peça acesso ao responsável se necessário.

## Stack e execução

Backend: Java24/JDK, Spring Boot3.5, Maven3.9+, PostgreSQL/Supabase. Frontend: Angular21, Node24, npm. Siga os comandos do guia de continuação. API local na porta8080; Angular na4200. Em produção, Angular fica na Vercel e a API no Render. Não tente transformar a API Java em função Vercel sem um novo pedido.

## Regras já decididas

1. Cada epis.id é um objeto físico. Vários objetos podem compartilhar o mesmo ca INTEGER. Um objeto não pode pertencer simultaneamente a dois funcionários.
2. A posse oficial usa entregas_epi (cabeçalho) e entrega_epi_itens (objetos). Item aberto tem encerrado_em NULL. entregas_epis e epi_funcionarios são legados preservados para consulta após a migração002; não volte a escrever neles.
3. Substituição fecha a posse anterior, marca substituido no EPI antigo e entrega outro ID físico ao mesmo funcionário. Descarte é lógico, com data/motivo/responsável; não apaga o objeto.
4. Notificações: dias_notificacao_epis(id,ca,dias_aviso) e dias_notificacao_treinamentos(id,nr,dias_aviso). Não criar cas, is_norma nem ca_ou_nr. CA da regra não precisa de FK para epis.ca; todos os objetos com o mesmo CA compartilham a antecedência.
5. NR possui id e nome. O id é o número da NR, informado manualmente; não criar outro campo número nem unicidade do nome.
6. Cadastro de funcionário, e-mail, perfil e login ficam em funcionarios. Não separar uma tabela usuarios. E-mails fictícios terminam em @marmetalurgia.com; recuperação de senha é demonstrativa, sem envio funcional por escolha minha.
7. TST gerencia EPIs/treinamentos e adiciona NRs; Operário vê os próprios EPIs/treinamentos e relata o estado do EPI; RH cadastra/consulta funcionários; ADMIN/Gerência pode tudo. Backend valida identidade e permissões; autor vem da sessão.
8. Treinamentos devem ficar numa página unificada; não recriar páginas separadas Agendar/Abrir Turma.

## O que já foi trabalhado

Login e sessão reais, perfis e portal autenticado; notificações separadas e migração001; publicação principal na Vercel/Render. Neste ciclo: rota de cadastro EPI, CA→nome com autocomplete e nome manual, quantidade como objetos distintos, entrega com IDs reais, consolidação de posse e operações transacionais de substituição/descarte. Commits de implementação e de documentação são separados.

Não confunda implementação com publicação: confira no TODO e nos deploys se a migração002 e os commits deste ciclo já estão em produção. ddl-auto=validate não aplica SQL automaticamente. Migrações ficam em db/migrations. Nunca rode db/tests/legacy_fixture.sql nem testes destrutivos no banco publicado. Validar alterações de posse/concorrência em PostgreSQL descartável.

## Pendências principais

- Upload real e download autorizado de imagens/fichas/documentos; não simular sucesso sem persistir.
- Treinamentos, turmas, participantes e presença com API e dados reais na página unificada.
- Histórico real de alterações de EPI e treinamento; a trilha de entrega/descarte não substitui auditoria completa de edição.
- PDF/XLSX/ODF verdadeiros e validação do XML.
- Cargos/setores livres; padronização dos formulários; revisão de textos, responsividade e estados de erro/vazio/carregamento.
- Teste completo dos fluxos e permissões. Leia o TODO para detalhes e eventuais itens já concluídos depois deste prompt.

Comece conferindo o estado real dos dois repositórios e resuma o que já está concluído, o que ainda está apenas local e qual pendência faz sentido executar a seguir. Se eu já indicar a tarefa, execute-a até concluir, teste de forma proporcional e atualize o TODO. Não marque uploads, históricos ou relatórios como prontos apenas porque existe uma tela visual.
