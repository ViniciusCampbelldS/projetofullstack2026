# Site Development TODO

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
