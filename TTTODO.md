# TODO — estado real do frontend (18/11/2026)

Revisado contra a branch de remoção de mocks. **[x] confirma implementação encontrada; testes e produção são estados separados.** Este arquivo substitui os checklists históricos que estavam contraditórios.

## Implementado no código

- [x] Login, sessão e usuário/perfil obtidos da API; guard/interceptor.
- [x] Rota `/epi/cadastro` separada da busca.
- [x] Cadastro EPI em lote, lista via API, edição, filtros e autocomplete CA (debounce, cancelamento e teclado).
- [x] Entrega real com funcionário e objetos por IDs; consulta entregas; upload/download de ficha PDF.
- [x] Substituição e descarte usam endpoints reais no fluxo da Busca EPI.
- [x] Portal Meus EPIs e fichas carregam dados da API autenticada.
- [x] Relato textual de situação/comentário é enviado à API; não é mais salvo apenas em localStorage.
- [x] Meus Treinamentos consulta a API do portal.
- [x] Gestão de turmas e presença persistidas; validade atualizada na NR.
- [x] Configuração de notificações usa endpoints separados para CA e NR.
- [x] Histórico de EPI e treinamento lê a API, agrupa eventos de criação de lote na exibição e permite adicionar nota.
- [x] Funcionários e seleção para entrega/treinamento consultam API; cadastro inclui e-mail e definição de senha por gestor.
- [x] Rota de cadastro EPI e fluxo de treinamento principal estão implementados.

## Pendências confirmadas

### P0 — validar a integração
- [x] Rodar build e testes Angular: build local passou (dois avisos de tamanho) e 16 testes passaram. Workflow de CI adicionado, primeira execução remota pendente.
- [ ] Rodar smoke tests com backend real.
- [ ] Validar em produção cadastro/edição/filtros, entrega/substituição/descarte, fichas, turma/presença, notificações, histórico, login e permissões.
- [ ] Confirmar se deploy Vercel corresponde ao `main` atual.

### P1 — dados reais e funcionalidades incompletas
- [ ] Upload e armazenamento de imagens nos relatos de estado do EPI: seleção/preview local existe, mas envio de anexos não está disponível; a tela informa isso.
- [ ] Interface de documentos de treinamento: backend tem PUT/GET/DELETE, mas ligar upload, exibição, download e exclusão na tela e validar permissões.
- [ ] Completar histórico de funcionário (criação e alterações de campos) quando o backend passar a registrar esses eventos.
- [ ] Permitir que o funcionário consulte seu próprio histórico, se esse requisito for mantido; atualmente a página administrativa de histórico é restrita.
- [x] Filtrar o histórico por área e navegar por páginas de 20, 50 ou 100 eventos via API. O agrupamento de criações de EPI é feito dentro de cada página. Build e suíte Angular passaram; validação com API publicada pendente.
- [ ] Implementar exportação PDF/XLSX/ODF reais; hoje esses formatos geram texto simples com a extensão correspondente.
- [ ] Validar o XML gerado (conteúdo, acentos, filtros e abertura em leitor) e ajustar MIME/encoding de todos os formatos.
- [x] Conectar indicadores de treinamento à API e substituir números fixos; os status usam validade da NR e prazo de aviso configurado.
- [ ] Substituir listas fixas de cargos e setores por entrada livre com sugestões dos valores cadastrados; não restringir o usuário a opções hardcoded.
- [ ] Revisar a busca de NR por número parcial e garantir que descrição/número e seleção estejam corretos.
- [ ] Revisar CRUD de NR para impedir nomes duplicados; backend ainda não valida duplicidade por nome.
- [ ] Rever e completar estados de loading, vazio, erro, sucesso e retry em todas as telas.

### P2 — remover código legado e corrigir UX
- [x] Remover mocks de EPIs de `EpiService`: `getAvailableEpis()`, `getDeliveryDraft()` e `getEmployeeEpis()`.
- [x] Remover `getPreviousEpis()` e modal antigo de substituição sem operação; o fluxo ativo na Busca EPI usa API.
- [x] Remover `carregarFallbackLocal()` não utilizado e não mascarar falha da API com dados locais.
- [x] Remover a classe duplicada `EpiService` em `epi-status.ts`; manter o serviço oficial em `services/epi.service.ts`.
- [ ] Revisar a rota antiga `/treinamento/presenca`: decidir se deve redirecionar à página unificada ou continuar suportada; não afirmar que está redirecionada sem alterar a rota.
- [ ] Corrigir textos com codificação quebrada (mojibake) e revisar acentos/legendas.
- [ ] Padronizar formulários EPI/funcionário, layout, validações, acessibilidade por teclado e responsividade mobile.
- [ ] Conferir filtros/status/datas em casos limite e ausência de dados.

## Dependências de backend/produção

- [ ] Confirmar migrations 004–012 no Supabase e deploy da API/frontend; status não é verificável somente pelo código.
- [ ] Testar autorização por chamadas diretas: Operário não pode consultar/alterar registros de outros funcionários nem executar operações administrativas.
- [ ] Verificar que relatos e documentos não vazam via URLs ou endpoints públicos.
- [ ] Conferir dados persistidos após recarga e após novo login.

## Observações

- As funcionalidades de entregas, substituição e descarte estão conectadas no fluxo atual; os mocks listados são código antigo/dead path, não evidência de que a operação principal ainda seja fictícia.
- Relatos em texto já persistem na API; o que falta é anexar imagens/arquivos.
- O backend tem endpoint de histórico e comentários; a integração frontend já existe.
- A recuperação por e-mail real está desativada por decisão anterior (modo demonstrativo).
