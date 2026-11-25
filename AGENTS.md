# Instruções para continuar no Codex

> **Legenda da revisão (25/11/2026):** **Atual** = orientação ou pendência válida; **Concluído** = implementação ou etapa encontrada, com teste/publicação indicados separadamente; **Desatualizado** = retrato antigo ou afirmação que precisa de revisão. Os textos originais foram preservados. O frontend e o backend possuem mudanças locais ainda não publicadas.
Projeto didático de gestão de EPIs e treinamentos. Converse em português. Preserve soluções simples e o escopo solicitado.

## Repositórios e regras

> **Revisão em 25/11/2026:** Atual: orientações de trabalho e segurança. Referências ao ambiente em nuvem são contexto histórico.

- **Atual.** Backend: ViniciusCampbelldS/tst-java-db-access-api (Spring Boot/Java24/PostgreSQL).
- **Atual.** Frontend: ViniciusCampbelldS/projetofullstack2026 (Angular21/Node24).
- **Atual.** São dois repositórios independentes. Não copie fontes entre eles nem crie monorepositório. Mantenha commits separados por funcionalidade e por repositório; não reescreva histórico publicado.
- **Atual.** O ambiente /workspace desta conversa era Linux na nuvem, não uma pasta do Windows. Este arquivo e CONTINUAR-NO-CODEX.md transportam o contexto; não exigem acesso àquela máquina.
- **Atual.** Leia o TODO deste repositório e CONTINUAR-NO-CODEX.md antes de alterar. Marque implementação e teste separadamente; não trate interface mockada como fluxo concluído.
- **Atual.** Nunca versionar senhas, tokens, credenciais de banco, .env, cookies/sessões ou dados de teste da produção. Credenciais ficam no ambiente. E-mails são fictícios @marmetalurgia.com. Recuperação de senha é demonstrativa sem envio por escolha do usuário.

## Modelo que deve ser preservado

> **Revisão em 25/11/2026:** Atual: regras de domínio e segurança; veja a ressalva sobre tabelas legadas no item específico.

- **Atual.** Cada epis.id é UM objeto físico; vários objetos podem compartilhar CA/lote. CA é inteiro.
- **Desatualizado em parte: a migração 006 prevê a remoção das tabelas legadas após conferências; confirme o banco antes de presumir que existem. A regra da posse continua atual.** Posse vem somente de entrega_epi_itens aberta (encerrado_em NULL), ligada a entregas_epi. Índice único parcial garante uma posse por objeto. Tabelas entregas_epis e epi_funcionarios são backups legados somente para leitura.
- **Atual.** Entrega usa funcionarioId e epiIds físicos. Substituição fecha o item anterior, marca o EPI antigo substituido e entrega o novo ao mesmo funcionário. Descarte é lógico, registra data/motivo/responsável e fecha a posse. Não remover o registro com DELETE.
- **Atual.** dias_notificacao_epis(id,ca,dias_aviso) e dias_notificacao_treinamentos(id,nr,dias_aviso). Não há is_norma nem ca_ou_nr no contrato definitivo. Não criar cas. NRs usam seu número como ID manual (incluindo NR00 de teste preservada).
- **Atual.** Funcionário, e-mail, perfil e credenciais estão em funcionarios. Não criar usuarios/perfis separados. Associações de NR são FK nr_id, embora o contrato nRs legado continue por nomes resolvidos no backend.
- **Atual.** Perfil: ADM/Gerência tudo; TST EPI/NR/treinamentos; RH cadastro/dados de funcionários; Operário seus EPIs/treinamentos e relatos. Só ADMIN/Gerência altera perfil e define senha. Autor vem da sessão, nunca do corpo enviado pelo navegador.
- **Atual.** Transações e locks de objetos em ordem de ID + índice parcial protegem contra dupla entrega/rollback parcial. Não reintroduzir ManyToMany gravável para posse.

## Próximo trabalho após esta entrega

> **Revisão em 25/11/2026:** Desatualizado como lista de pendências: fichas, treinamentos, históricos, exportações e cargos/setores já têm implementação; imagens e revisão visual seguem pendentes. Consulte TODO e verifique publicação separadamente.

Upload real de fichas/imagens/documentos; gestão persistida de treinamentos na página unificada; históricos reais; exportações PDF/XLSX/ODF; cargos/setores livres e padronização/responsividade. Não recriar páginas Agendar/Abrir Turma separadas. Consultar TODO para os detalhes.
