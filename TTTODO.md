# TODO consolidado — revisão de 16/11/2026

## Cadastro, entregas e baixa de EPI — continuação de 16/11/2026

Este bloco registra a implementação mais recente e prevalece sobre os checklists históricos abaixo.

- [x] Rota /epi/cadastro com criação separada da busca, API de lote e objetos físicos com IDs distintos.
- [x] Autocomplete CA → nome com busca limitada, debounce/cancelamento, teclado e nome manual.
- [x] Entrega real por funcionarioId e epiIds, listagem de cabeçalhos/itens e confirmação após resposta da API.
- [x] Fonte de posse única: entregas_epi + entrega_epi_itens; migração002 reconcilia legados sem inventar datas/autores e torna as tabelas antigas somente leitura.
- [x] Impedir dupla posse com transações, locks e índice único parcial por objeto aberto.
- [x] Substituição fecha item anterior, registra vínculo com novo item e mantém substituido no objeto antigo.
- [x] Descarte lógico registra data, motivo e responsável; fecha posse e bloqueia DELETE físico.
- [x] Testes HTTP locais de lote, autocomplete, posse, concorrência, rollback, substituição, descarte e bloqueio por perfil; build Java24 e 5 testes de autenticação.
- [x] Build Angular de produção e 6 testes em 2 specs. Correção complementar das larguras das sete colunas da tabela, com novo build aprovado.
- [x] API publicada: 19 verificações HTTP aprovadas (401 sem sessão, ADMIN real, consulta de EPIs disponíveis/sugestões/entregas e logout com revogação). Navegador: cadastro, preenchimento por CA e consulta de entregas. Operações que alteram posse foram exercitadas apenas no PostgreSQL local descartável.
- [x] Preparação Codex: AGENTS.md, CONTINUAR-NO-CODEX.md e PROMPT-CODEX.md nos dois repositórios.
- [x] Migração002 aplicada ao Supabase; backend dc6c9a6 publicado no Render (dep-dbtrqe5bedkc73emtpr0, live) e frontend 2ba43c4 publicado na Vercel (dpl_B7zXFgfHeNLNQuhCYrnneBjMdU4J, READY). Contagens reconciliadas: 2 cabeçalhos/3 itens; legados 1 entrega/2 vínculos preservados; nenhuma posse duplicada.
- [x] Ficha de entrega opcional em PDF (até 5 MB), persistida na mesma transação da entrega. Download autenticado para o funcionário titular, TST, ADMIN e Gerência.
- [x] Validado em PostgreSQL descartável: migração 003, upload, listagem em nova sessão, download com bytes idênticos, bloqueio de acesso por outro funcionário e rejeição de arquivo inválido ou acima do limite. Build Angular, 16 testes Angular e 5 testes Java aprovados.
- [ ] Aplicar a migração 003 antes do deploy da API. Validar o fluxo na interface publicada após o deploy.
- [ ] Upload e download autorizado de imagens de relatos e documentos de treinamento.
- [ ] Histórico completo de edições de EPI e treinamento; os eventos de posse não cobrem todas as alterações.
- [ ] Gestão persistida de treinamentos na página unificada; relatórios reais e revisão visual final.

Estrutura de entrega atual: entregas_epi(id,funcionario_id,data_entrega opcional apenas para legado sem data,criada_em,ficha_nome,ficha_tipo_conteudo,responsavel_id,origem_legado_id,origem_juncao); entrega_epi_itens(id,entrega_id,epi_id,encerrado_em,motivo_encerramento,encerrado_por_id,item_anterior_id), com unicidade de epi_id quando aberto. epis mantém os dados físicos e acrescenta descartado_em,data_descarte,motivo_descarte,responsavel_descarte_id. Chave/conteúdo do arquivo da ficha ainda pendente. entregas_epis e epi_funcionarios ficam preservadas, sem novas escritas.

## Etapas 1–2 implementadas — 16/11/2026

- [x] Migração transacional de CA inteiro, regras separadas, NR manual e associação por nr_id, preservando dados legados.
- [x] Campos de e-mail fictício e credenciais na própria funcionarios, sem tabela usuarios.
- [x] Login por CPF/e-mail, senha com BCrypt, sessão expirada/revogável e perfil vindo do banco.
- [x] Matriz autorizada: TST EPI/NR/treinamentos; RH funcionários; ADMIN/Gerência tudo; Operário próprios dados/relatos.
- [x] API e interface de definição de senha por ADMIN/Gerência, sem senha padrão no código.
- [x] Recuperação DEMONSTRATIVA sem envio conforme decisão do usuário; mecanismo de token temporário/uso único verificado com e-mail simulado.
- [x] Portal e identidade deixam de usar exemplos fixos; dados próprios e notificações são consultados pela sessão.
- [x] Verificação Java 24, testes de autenticação, migração PostgreSQL local e build de produção Angular.
- [ ] Concluir upload de anexos, CRUD persistido de treinamentos e consolidação dos modelos de entrega nas próximas etapas.

Detalhes, execução e limites em IMPLEMENTACAO-1-2.md no backend. A recuperação real por e-mail está fora do escopo por solicitação expressa do usuário.

Status verificado por leitura do código nas revisões backend b4644751aa6c392aa853c86381ab028eff949fb9 e frontend af7db6dd55b42e1cca9678d1d5159a91089830dc. Não houve teste de execução nesta revisão. As estruturas do Supabase foram consultadas anteriormente. Este documento substitui as propostas anteriores de cas e de tabela única de notificações.


## Implementações confirmadas — status das caixas

Marcação de implementação por inspeção do código; testes integrados continuam pendentes.

- [x] PATCH de funcionário implementado na API.
- [x] Catálogo de NRs carregado pela API na gestão de funcionários, sem lista fixa nrOptions.
- [x] Pesquisa de NR pela descrição implementada no frontend.
- [x] Seleção de funcionários em entregas e treinamentos consulta a API.
- [x] CRUD de EPI e cadastro em lote implementados na API; formulário atual chama POST /epis/bulk.
- [x] Filtros locais de Busca EPI ligados aos campos da tela.
- [x] Download de relatório e gerador XML implementados; validar arquivos e concluir formatos PDF/XLSX/ODF permanece pendente.

## NR — arquivos já implementados

- [x] Model: src/main/java/br/com/tst/model/NR.java.
- [x] Repository: src/main/java/br/com/tst/repository/NRRepository.java.
- [x] Request: src/main/java/br/com/tst/dto/NRRequest.java.
- [x] Response: src/main/java/br/com/tst/dto/NRResponse.java.
- [x] IniciaisConfig: src/main/java/br/com/tst/config/NRIniciaisConfig.java.
- [x] ApiController: src/main/java/br/com/tst/api/NRApiController.java; GET lista/ID, POST, PUT e DELETE.
- [ ] Garantir ID manual igual ao número da NR: retirar geração automática e adaptar Request, controller e carga inicial.
- [ ] Reconciliar cadastro id=40 / NR 00 - Teste antes de migrar as referências.
- [ ] Garantir unicidade do cadastro na API e banco, além da PK.
- [ ] Alinhar funcionarios_nrs: banco já usa nr_id FK, mas Java ainda usa coleção de textos.

## Notificações — decisão definitiva do usuário

- [ ] Separar em dias_notificacao_epis: id PK gerado, ca INTEGER NOT NULL UNIQUE, dias_aviso INTEGER NOT NULL CHECK > 0.
- [ ] Separar em dias_notificacao_treinamentos: id PK gerado, nr INTEGER NOT NULL UNIQUE FK nrs(id), dias_aviso INTEGER NOT NULL CHECK > 0. nr guarda a PK da NR; alinhar tipo com nrs.id antes da FK.
- [ ] Remover is_norma e ca_ou_nr do contrato definitivo, tanto no banco quanto na API e Angular.
- [ ] Não criar tabela cas. O ca da configuração não precisa de FK para epis.ca: vários objetos podem compartilhar o mesmo CA.
- [ ] Aplicar a mesma antecedência a todos os objetos do mesmo CA, respeitando o vencimento individual.
- [ ] Migrar as 25 regras de dias_notificacao_epi para as duas tabelas. Mapear as 21 regras textuais NR-xx para IDs reais; resolver NR-00 explicitamente, sem presumir que o ID é zero.
- [ ] Atualizar entidades, repositórios, requests/responses, services, controllers e telas para os nomes ca/nr/diasAviso. O Java revisado ainda aponta para dias_notificacao, diferente da tabela real dias_notificacao_epi.
- [ ] Definir comportamento padrão quando não existir configuração.
- [ ] Remover tabela antiga somente depois de validar migração e atualizar consumidores.

## Exportar arquivos — parcial

- [x] Botões de exportação de EPI e download local implementados.
- [x] Gerador de XML estruturado implementado em busca-epi.ts; validar abertura/conteúdo antes de considerar concluído.
- [ ] Gerar PDF verdadeiro: atualmente é texto simples salvo com extensão .pdf.
- [ ] Gerar XLSX verdadeiro: atualmente é texto simples salvo com extensão .xlsx.
- [ ] Gerar ODF no formato escolhido: atualmente é texto simples salvo com extensão .odf.
- [ ] Usar MIME types corretos; respeitar filtros, cabeçalhos, datas e acentos.
- [ ] Verificar arquivo abrindo em leitor PDF e aplicativo de planilha.
- [ ] Definir e implementar exportações equivalentes para funcionários/treinamentos conforme necessidade.

## Padronizar frontend de criação — pendente

- [ ] Usar o mesmo padrão nos cadastros EPI, treinamento e funcionário: cabeçalho, largura, espaçamento, campos, ações Salvar/Cancelar, obrigatoriedade, validações e mensagens.
- [ ] Separar claramente filtros de busca e campos de criação: o formulário de EPI atual mistura os dois.
- [ ] Uniformizar comportamento de abertura/fechamento e confirmação entre criação e edição.
- [ ] Garantir estados de carregamento, falha e sucesso e responsividade.
- [ ] Conferir visualmente as três telas após implementação. A revisão atual é apenas do código; classes comuns existentes não comprovam padronização completa.

## Cargo e setor sem opções fixas — pendente

- [ ] Remover arrays readonly cargos e setores de gerenciar-funcionarios.ts.
- [ ] Permitir digitar novo cargo/setor no cadastro e edição.
- [ ] Sugerir valores já cadastrados, sem restringir a seleção à lista.
- [ ] Alimentar os filtros com valores reais dos funcionários, sem lista fixa.
- [ ] Começar campos vazios: Ex.: Compras e Ex.: Metalúrgico I devem ser placeholders, não valores enviados ao banco.
- [ ] Manter limites do backend (40 caracteres) e normalizar espaços.

## Autocomplete de CA — pendente

- [ ] Ao digitar CA, buscar CAs/nome dos EPIs cadastrados; sugerir correspondências parciais sem repetir CA/nome por objeto físico.
- [ ] Ao selecionar sugestão, preencher CA e nome automaticamente; manter IDs dos objetos independentes.
- [ ] Permitir nome manual se não houver resultado.
- [ ] Implementar busca limitada no backend e debounce/cancelamento no Angular; seleção por teclado, carregamento e mensagens de erro/vazio.

## Entregas e objetos físicos — pendente

- [ ] Cada epis.id representa um objeto; manter substituido no EPI. Não permitir dois funcionários simultâneos.
- [ ] Adotar entregas_epi + entrega_epi_itens como fonte oficial. Migrar o registro de entregas_epis e reconciliar os 2 vínculos epi_funcionarios antes de retirar estruturas redundantes.
- [ ] Acrescentar responsável e chave do arquivo da ficha ao cabeçalho; hoje há nome/tipo, sem caminho ou conteúdo.
- [ ] Acrescentar encerramento/motivo e item anterior aos itens; índice único parcial em epi_id para entregas abertas.
- [ ] Salvar entrega, substituição e descarte em transações; confirmar sucesso na tela somente após retorno da API.
- [ ] Selecionar funcionario.id e epi.id reais; remover catálogos e entregas mockados.
- [ ] Bloquear entrega de objeto já entregue, descartado ou substituído.
- [ ] Não inventar datas/responsáveis ausentes nos registros legados.

## Estrutura final das demais tabelas

| Tabela | Estrutura / ajuste |
| --- | --- |
| funcionarios | Manter id,nome,cpf,cargo,setor,permissoes,status; acrescentar email único normalizado,senha_hash,recuperacao_token_hash e recuperacao_expira_em opcionais; auditar UNIQUE(cpf). Cadastro, perfil e login ficam nesta tabela. |
| nrs | id numérico manual como número da NR; nome. |
| funcionarios_nrs | Manter id,funcionario_id FK,nr_id FK obrigatório; UNIQUE(funcionario_id,nr_id). |
| epis | id por objeto; ca INTEGER obrigatório, sem UNIQUE nem FK de CA; nome,lote,vencimento,substituido; acrescentar descarte e motivo opcionais. |
| entregas_epi | id,funcionario_id FK,data_entrega,criada_em,ficha_nome,ficha_tipo_conteudo; acrescentar responsável FK e chave de arquivo. |
| entrega_epi_itens | id,entrega_id FK,epi_id FK; UNIQUE(entrega_id,epi_id); acrescentar encerramento/motivo,item_anterior_id opcional FK e unicidade de objeto em entrega aberta. |
| dias_notificacao_epis | id PK,ca INTEGER UNIQUE obrigatório,dias_aviso INTEGER positivo obrigatório. |
| dias_notificacao_treinamentos | id PK,nr INTEGER UNIQUE obrigatório FK nrs.id,dias_aviso INTEGER positivo obrigatório. |
| treinamentos | id,nome,nr_id FK,validade_meses positiva; migrar dados individuais para turma/participação antes de retirar colunas antigas. |
| turmas_treinamento | Manter id,data,horario,nome e dados de documento; acrescentar treinamento_id FK, substituir nr textual pelo relacionamento e manter vencimento padrão se necessário. Preservar documento_conteudo BYTEA ao migrar anexos. |
| presencas_treinamento | Manter id,turma_id FK,funcionario_id FK,presente,atualizado_em e UNIQUE existente; acrescentar conclusão e vencimento individuais. |
| relatos_epi | Manter id,situacao,comentario,criado_em; ligar ao item da entrega para registrar posse; migrar anexos além de nomes_arquivos. |
| documentos (proposta) | id,nome_original,chave_arquivo,mime_type,tamanho_bytes,enviado_por FK,criado_em e vínculo com entrega/turma/relato. |
| historico_alteracoes (proposta) | id,autor_id FK opcional,data,entidade,registro_id,acao,antes/depois JSONB. |

Não criar tabela usuarios nem separar perfil/login de funcionarios.

Tabelas a retirar apenas após migração validada: entregas_epis, epi_funcionarios e dias_notificacao_epi. Não criar cas.

## Demais integrações e correções

- [ ] Conectar treinamentos, turmas, presenças, relatos, históricos, portal e dashboard aos dados reais; reaproveitar tabelas existentes no Supabase.
- [ ] Implementar upload persistido e associação de documentos.
- [ ] Implementar autenticação e autorização no backend; retirar login fixo e perfil simulado.
- [ ] Corrigir rota /epi/cadastro e conferir rotas de treinamento.
- [ ] Corrigir fetch dos funcionários em EpiRepository.findAll(Sort) e limite transacional de conversão para DTO.
- [ ] Remover EpiService duplicado em epi-status.ts.
- [ ] Remover senha padrão do application.properties e trocar credencial exposta.
- [ ] Criar migrações versionadas, conferir dados não numéricos e não depender de ddl-auto=update.
- [ ] Revisar RLS/privilégios da Data API: as 13 tabelas públicas estavam sem RLS na inspeção anterior.
- [ ] Verificar persistência após recarga, migração das regras, CA compartilhado, CA/NR de mesmo número, concorrência de entrega, substituição e exportações reais.



## Complemento da revisão — recuperação de senha, páginas e permissões

Revisão estática de 16/11/2026. Os itens abaixo distinguem interface implementada de persistência real; nenhuma tela foi executada nesta conferência.

### Recuperação de senha e login na própria tabela funcionarios — novo requisito

- [ ] Acrescentar email ao Funcionario, DTOs e formulários de cadastro/edição; validar formato e normalizar para impedir contas com e-mails equivalentes.
- [ ] Migrar o banco com email único sem diferenciar maiúsculas/minúsculas; reconciliar/preencher funcionários existentes antes de exigir email obrigatório para contas com login.
- [ ] Manter cadastro, perfil e credenciais na própria tabela funcionarios. Não criar usuarios nem tabela separada de perfil/login.
- [ ] Acrescentar senha_hash em funcionarios; nunca retornar hash ou credenciais nos responses de funcionário.
- [ ] Implementar Esqueci minha senha e Redefinir senha, com envio de link ao e-mail cadastrado.
- [ ] Para este projeto, guardar em funcionarios os campos de recuperação: recuperacao_token_hash e recuperacao_expira_em, ambos opcionais. Guardar somente o hash do token; tornar token temporário e de uso único, invalidando-o após redefinição.
- [ ] Limitar tentativas de recuperação e responder de forma genérica independentemente de o e-mail existir.
- [ ] Configurar provedor/SMTP e URL de retorno por ambiente; validar nova senha, gravar hash e invalidar sessões antigas após redefinição.
- [ ] Retirar login/token fixos; a autenticação deve identificar o próprio funcionarios.id e suas permissões.

### Históricos de EPI e treinamento — já previstos; detalhamento

- [ ] Histórico EPI: substituir EpiService.getHistory(), que retorna exemplos fixos, por consulta à API.
- [ ] Histórico treinamento: substituir as linhas estáticas do HTML por registros persistidos.
- [ ] Registrar criação, edição, entrega/substituição/descarte e alterações de treinamento/presença/anexos, conforme a operação; autor derivado da autenticação, timestamp e valores alterados.
- [ ] Gravar a auditoria junto com a operação, permitir filtro/paginação e impedir alteração do histórico por ações comuns.
- [ ] Não registrar senha, hash de senha ou tokens nos dados de auditoria.

### Cadastro/Recebimento e Busca EPI — correção de status

- [x] Cadastro de EPI já possui salvarEpi() chamando EpiService.cadastrarEmLote() e tratamento de resposta/erro. Não marcar como ausência total de API.
- [x] Busca EPI já possui aplicarFiltros(), ligado ao ngModelChange para nome, CA, validade, funcionário, situação e inclusão de substituídos.
- [ ] Corrigir o acesso à página Cadastro/Recebimento: há referência a /epi/cadastro, mas falta rota correspondente; separar ou organizar claramente o modo de cadastro e busca.
- [ ] Testar POST /epis/bulk com backend ligado: quantidade N deve gerar N objetos físicos; conferir salvamento, datas e permanência após recarga.
- [ ] Testar filtros em dados reais e corrigir divergências de datas/status; lote não participa do predicado atual, definir se deve ser filtro.
- [ ] Retirar fallback de dados fictícios que pode mascarar falha da API.

### Meus EPIs e portal autenticado — não falta apenas upload

- [x] Interface de Meus EPIs, seleção local de imagens e geração demonstrativa de ficha existem.
- [ ] Substituir getEmployeeEpis() fixo pela consulta dos objetos vinculados ao funcionário autenticado.
- [ ] Salvar relatos na API: atualmente submitReport() grava no localStorage, sem persistência compartilhada.
- [ ] Implementar upload real de imagens/documentos, associação ao relato/entrega, validação de tamanho/tipo e consulta/download autorizado.
- [ ] Substituir fichas demonstrativas por documentos reais da entrega.
- [ ] Fazer Meus Treinamentos usar participações do funcionário autenticado.
- [ ] Remover mocks/localStorage usados como fonte de dados de negócio; não confundir isso com armazenamento necessário à sessão.
- [ ] Backend deve determinar identidade a partir da sessão/token, sem confiar no funcionario_id enviado pelo cliente.

### Treinamentos em uma página — mudança de escopo

- [ ] Não criar páginas separadas Agendar e Abrir Turma. Concentrar o fluxo necessário na página de gestão de treinamentos.
- [ ] Retirar links, rotas/views e textos antigos que exponham esses fluxos como páginas separadas; manter/redirecionar acesso à presença se necessário dentro do fluxo unificado.
- [ ] A retirada das páginas não elimina a persistência de turmas, participantes e presença. Reaproveitar as tabelas existentes.
- [x] Seleção de funcionários já consulta GET /funcionarios.
- [x] Novo treinamento e edição têm lógica local em arrays; ainda não persistem no backend.
- [ ] Conectar novo/editar à API e salvar participantes por ID, preservando alterações após recarga.
- [ ] Conectar filtros de treinamento à listagem: inputs atuais não estão vinculados ao estado de filtro.
- [ ] Implementar ação real do botão Visualizar, que está sem handler.
- [ ] Integrar criação de turma, presença e anexos no fluxo unificado; a implementação atual de criarTurma() altera apenas array local e o upload gera apenas prévia.
- [ ] Selecionar funcionários existentes por ID; caso haja cadastro de funcionário dentro desse fluxo, usar a API de funcionários, não nomes locais.

### Relatórios/exportação — já previsto; validar conclusão

- [ ] Concluir PDF/XLSX/ODF verdadeiros; botões existentes geram texto simples com extensão desses formatos.
- [x] XML possui gerador estruturado; não tratar como inexistente.
- [ ] Validar XML, conteúdo/filtros, MIME type, acentuação e abertura em aplicação externa; validar também os demais formatos.

### Permissões TST/RH/Gerência e funcionário — detalhamento necessário

- [ ] Definir matriz de ações por perfil (visualizar, criar, editar, excluir/descartar, exportar e administrar funcionários).
- [ ] Acrescentar RH/Gerência aos contratos, validações e constraints do banco. Hoje há ADM/field/tst no backend e TST/Funcionário no frontend; documentar equivalências sem inventar permissões.
- [x] Há bloqueios parciais no frontend: tstGuard e botões de EPI desabilitados conforme perfil.
- [ ] Completar visibilidade/estado desabilitado, mensagens e proteção de rotas para a matriz completa, usando perfil vindo da autenticação, sem permitir autoatribuição no navegador.
- [ ] Aplicar autorização em cada endpoint do backend e nas consultas/arquivos; frontend sozinho não protege dados.
- [ ] Testar negação real com chamadas HTTP diretas e acesso a registros de outro funcionário.

### Qualidade e teste integrado — itens existentes, agora explícitos

- [ ] Revisar arquivos como UTF-8, acentos e textos com codificação quebrada; revisar também nomes e legendas dos fluxos unificados.
- [ ] Padronizar carregamento, vazio, erro, sucesso e opção de tentar novamente nas listas, formulários, upload e exportação.
- [ ] Validar responsividade de todas as páginas, tabelas, modais, filtros e seletores, incluindo uso por teclado.
- [ ] Testar com backend ligado: login, recuperação de senha por e-mail, cadastro, edição, filtros, persistência após recarga, entrega, presença, upload, históricos, relatórios e permissões.
- [ ] Testar link de recuperação inválido/expirado/reutilizado, e-mail desconhecido e invalidação das sessões.

## Checklist anterior para referência

O status consolidado acima prevalece sobre as marcações históricas abaixo.

# Site Development TODO
## TODO - Migração completa para Java/PostgreSQL

### Funcionários
- [x] Implementar PATCH `/funcionarios/{id}` na API Java.
- [ ] Confirmar que GET/POST/PUT/PATCH/DELETE usam o mesmo contrato:
  `permissoes`, `nRs` e `status`.
- [ ] Remover definitivamente qualquer lista mockada de funcionários.
- [ ] Fazer todas as telas que pesquisam funcionário consumirem `GET /funcionarios`.
- [ ] Centralizar a conversão dos status `At`, `Af` e `In` no frontend.

### NRs
- [x] Criar entidade Java `Nr`.
- [x] Criar tabela PostgreSQL de NRs.
- [x] Criar GET `/nrs`.
- [x] Criar POST `/nrs`.
- [x] Carregar as NRs existentes do banco no Angular.
- [x] Remover a lista fixa `nrOptions` de `gerenciar-funcionarios.ts`.
- [ ] Permitir pesquisar NR por número parcial:
      `7` → `07`, `17`, `27`, `37`.
- [x] Permitir pesquisar NR pela descrição.
- [ ] Criar nova NR com confirmação.
- [ ] Impedir número de NR duplicado.
- [ ] Impedir descrição completa idêntica.
- [ ] Garantir unicidade também no banco de dados.

### EPI
- [ ] Remover `getAvailableEpis()` baseado em dados fixos.
- [ ] Remover `getDeliveryDraft()` baseado em dados fixos.
- [ ] Remover `getEmployeeEpis()` baseado em dados fixos.
- [ ] Remover `getPreviousEpis()` baseado em dados fixos.
- [ ] Implementar histórico de EPI no Java/PostgreSQL.
- [ ] Implementar `getHistory()` usando a API Java.
- [ ] Persistir entrega de EPI no banco.
- [ ] Persistir vínculo EPI ↔ funcionário.
- [ ] Persistir substituição de EPI.
- [ ] Persistir descarte de EPI.
- [ ] Migrar filtros de EPI para dados reais.
- [ ] Remover `carregarFallbackLocal()` de `busca-epi.ts`.
- [ ] Remover os dados locais do `NotificacaoService`.
- [ ] Implementar upload real de ficha/imagem/documento.

### Treinamentos
- [ ] Remover arrays locais de `treinamentos`.
- [ ] Remover arrays locais de `turmas`.
- [ ] Implementar CRUD de treinamentos no Java.
- [ ] Implementar CRUD de turmas no Java.
- [ ] Implementar vínculo treinamento ↔ funcionário.
- [ ] Implementar presença no banco.
- [ ] Implementar histórico de alterações de treinamento.
- [x] Implementar busca de funcionários usando dados do banco.
- [ ] Remover todos os dados hardcoded das telas de treinamento.

### Portal do Funcionário
- [ ] Migrar "Meus EPIs" para dados reais do banco.
- [ ] Migrar "Meus Treinamentos" para dados reais do banco.
- [ ] Remover dados fixos do portal.
- [ ] Migrar relatos de estado de EPI para backend.
- [ ] Migrar upload de imagens/documentos para backend.

### Home e Dashboard
- [ ] Substituir indicadores hardcoded por dados da API.
- [ ] Substituir pendências fixas por dados reais.
- [ ] Substituir informações fixas do funcionário logado por dados reais.

### Autenticação
- [ ] Remover login hardcoded do backend.
- [ ] Autenticar usuário contra o banco.
- [ ] Carregar perfil/permissões do usuário pelo backend.
- [ ] Fazer o frontend parar de simular o perfil via `sessionStorage`.

### Infraestrutura
- [ ] Configurar banco de desenvolvimento.
- [ ] Configurar banco de produção.
- [ ] Configurar CORS somente para os domínios reais do frontend.
- [ ] Configurar variáveis de ambiente.
- [ ] Revisar relacionamentos JPA.
- [ ] Criar migrações/versionamento do banco.
- [ ] Remover o backend NestJS depois que todas as rotas forem migradas.
- [ ] Remover código morto e arquivos antigos.

### Testes
- [ ] Testar CRUD de funcionário.
- [ ] Testar PATCH de status.
- [ ] Testar filtros dos cinco grupos de status.
- [ ] Testar criação e duplicidade de NR.
- [ ] Testar CRUD de EPI.
- [ ] Testar entrega/substituição/descarte de EPI.
- [ ] Testar CRUD de treinamento.
- [ ] Testar presença.
- [ ] Testar histórico.
- [ ] Testar autenticação e autorização.


## Escopo Atual
- Frontend apenas neste ciclo.
- Perfis simulados no frontend: `TST` e `Operário`.
- TST: gerencia EPIs, treinamentos, funcionários e NRs.
- Operário: acessa o portal e visualiza telas administrativas sem editar.

## Feito
- Login com seleção de perfil TST/Operário.
- Home, menu principal e notificações.
- Portal do Funcionário.
- Meus EPIs com relato de estado, upload de imagens e documentos.
- Meus Treinamentos.
- Gestão de EPIs com busca, status, exportação local e ações administrativas.
- Cadastro/recebimento de EPI com formulário e lista local.
- Entrega de EPI com upload, ficha e substituição.
- Histórico de alterações de EPI.
- Gestão de Treinamentos com tabela, seleção de funcionários e edição local.
- Abertura de turma com participantes, upload de lista e tabela local.
- Histórico de alterações de treinamentos.
- Gerenciar Funcionários com cadastro, edição, remoção, NRs e filtros locais.
- Padrão visual de largura/responsividade entre as páginas principais.

## Regras De Perfil No Frontend
- TST pode editar EPIs, descartar EPIs, alterar estados, exportar relatórios, editar treinamentos e gerenciar funcionários/NRs.
- Operário acessa o portal do funcionário e fica sem permissão nas ações administrativas.

## Ainda Pendente Para Integração Real
- Conectar formulários ao backend.
- Persistir cadastros, edições, descartes e turmas no banco.
- Autenticação real por perfil vinda do backend.
- Exportação real para PDF/XLSX/XML/ODF com conteúdo formatado.
- Filtros administrativos consumindo dados reais.
- Upload real de documentos e imagens.
- Histórico real com timestamp, usuário e alterações vindas do backend.

## Ajustes Finais De Frontend
- Revisão visual mobile em todas as rotas.
- Conferir textos e acentos finais.
- Revisar estados vazios e mensagens de erro/sucesso.
- Remover arquivos antigos em `lixeira` se não forem mais necessários.
