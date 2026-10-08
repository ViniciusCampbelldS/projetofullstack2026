# Site Development TODO
## TODO - Migração completa para Java/PostgreSQL

### Funcionários
- [ ] Implementar PATCH `/funcionarios/{id}` na API Java.
- [ ] Confirmar que GET/POST/PUT/PATCH/DELETE usam o mesmo contrato:
  `permissoes`, `nRs` e `status`.
- [ ] Remover definitivamente qualquer lista mockada de funcionários.
- [ ] Fazer todas as telas que pesquisam funcionário consumirem `GET /funcionarios`.
- [ ] Centralizar a conversão dos status `At`, `Af` e `In` no frontend.

### NRs
- [ ] Criar entidade Java `Nr`.
- [ ] Criar tabela PostgreSQL de NRs.
- [ ] Criar GET `/nrs`.
- [ ] Criar POST `/nrs`.
- [ ] Carregar as NRs existentes do banco no Angular.
- [ ] Remover a lista fixa `nrOptions` de `gerenciar-funcionarios.ts`.
- [ ] Permitir pesquisar NR por número parcial:
      `7` → `07`, `17`, `27`, `37`.
- [ ] Permitir pesquisar NR pela descrição.
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
- [ ] Implementar busca de funcionários usando dados do banco.
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
