# Instruções para continuar no Codex

Projeto didático de gestão de EPIs e treinamentos. Converse em português. Preserve soluções simples e o escopo solicitado.

## Repositórios e regras

- Backend: ViniciusCampbelldS/tst-java-db-access-api (Spring Boot/Java24/PostgreSQL).
- Frontend: ViniciusCampbelldS/projetofullstack2026 (Angular21/Node24).
- São dois repositórios independentes. Não copie fontes entre eles nem crie monorepositório. Mantenha commits separados por funcionalidade e por repositório; não reescreva histórico publicado.
- O ambiente /workspace desta conversa era Linux na nuvem, não uma pasta do Windows. Este arquivo e CONTINUAR-NO-CODEX.md transportam o contexto; não exigem acesso àquela máquina.
- Leia o TODO deste repositório e CONTINUAR-NO-CODEX.md antes de alterar. Marque implementação e teste separadamente; não trate interface mockada como fluxo concluído.
- Nunca versionar senhas, tokens, credenciais de banco, .env, cookies/sessões ou dados de teste da produção. Credenciais ficam no ambiente. E-mails são fictícios @marmetalurgia.com. Recuperação de senha é demonstrativa sem envio por escolha do usuário.

## Modelo que deve ser preservado

- Cada epis.id é UM objeto físico; vários objetos podem compartilhar CA/lote. CA é inteiro.
- Posse vem somente de entrega_epi_itens aberta (encerrado_em NULL), ligada a entregas_epi. Índice único parcial garante uma posse por objeto. Tabelas entregas_epis e epi_funcionarios são backups legados somente para leitura.
- Entrega usa funcionarioId e epiIds físicos. Substituição fecha o item anterior, marca o EPI antigo substituido e entrega o novo ao mesmo funcionário. Descarte é lógico, registra data/motivo/responsável e fecha a posse. Não remover o registro com DELETE.
- dias_notificacao_epis(id,ca,dias_aviso) e dias_notificacao_treinamentos(id,nr,dias_aviso). Não há is_norma nem ca_ou_nr no contrato definitivo. Não criar cas. NRs usam seu número como ID manual (incluindo NR00 de teste preservada).
- Funcionário, e-mail, perfil e credenciais estão em funcionarios. Não criar usuarios/perfis separados. Associações de NR são FK nr_id, embora o contrato nRs legado continue por nomes resolvidos no backend.
- Perfil: ADM/Gerência tudo; TST EPI/NR/treinamentos; RH cadastro/dados de funcionários; Operário seus EPIs/treinamentos e relatos. Só ADMIN/Gerência altera perfil e define senha. Autor vem da sessão, nunca do corpo enviado pelo navegador.
- Transações e locks de objetos em ordem de ID + índice parcial protegem contra dupla entrega/rollback parcial. Não reintroduzir ManyToMany gravável para posse.

## Próximo trabalho após esta entrega

Upload real de fichas/imagens/documentos; gestão persistida de treinamentos na página unificada; históricos reais; exportações PDF/XLSX/ODF; cargos/setores livres e padronização/responsividade. Não recriar páginas Agendar/Abrir Turma separadas. Consultar TODO para os detalhes.
