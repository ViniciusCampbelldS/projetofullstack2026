# Continuar o projeto no Codex do computador

> **Legenda da revisão (25/11/2026):** **Atual** = orientação ou pendência válida; **Concluído** = implementação ou etapa encontrada, com teste/publicação indicados separadamente; **Desatualizado** = retrato antigo ou afirmação que precisa de revisão. Os textos originais foram preservados. O frontend e o backend possuem mudanças locais ainda não publicadas.
O prompt completo para colar no novo chat está em [PROMPT-CODEX.md](PROMPT-CODEX.md). Preencha os caminhos locais; os links e as regras já estão incluídos.

## Abrir os projetos

> **Revisão em 25/11/2026:** Atual como orientação de configuração; a clonagem só é necessária se as pastas ainda não existirem.

Instale Git, Node24, Java24 (JDK) e Maven3.9+. No PowerShell, escolha uma pasta de projetos e execute:

```powershell
git clone https://github.com/ViniciusCampbelldS/tst-java-db-access-api.git
git clone https://github.com/ViniciusCampbelldS/projetofullstack2026.git
```

No aplicativo Codex, adicione cada pasta como um projeto separado. Abra um novo chat na pasta correspondente e peça: "Leia AGENTS.md, CONTINUAR-NO-CODEX.md e o TODO e continue a próxima pendência". Para trabalho nos dois lados, forneça os caminhos das duas pastas; mantenha seus .git independentes.

A conta GitHub conectada deve ter acesso aos repositórios de ViniciusCampbelldS. Render/Vercel/Supabase são conexões distintas; autorizar GitHub não concede acesso aos outros serviços. Se for usar esses conectores no novo chat, reconfirme a conta/espaço correto antes de publicar. Não copiar tokens da conversa anterior.

## Rodar backend

> **Revisão em 25/11/2026:** Atual como orientação de execução segura. A lista de migrações citada é histórica e não representa todas as versões existentes.

Na pasta tst-java-db-access-api, configure as variáveis localmente (substitua os placeholders sem salvar segredos em arquivos versionados):

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://HOST:5432/BASE?sslmode=require"
$env:SPRING_DATASOURCE_USERNAME="USUARIO"
$env:SPRING_DATASOURCE_PASSWORD="SENHA_LOCAL"
mvn test
mvn spring-boot:run
```

A API usa8080 por padrão. Use preferencialmente banco de desenvolvimento. Não apontar testes destrutivos ao Supabase publicado. ddl-auto=validate não executa migrações automaticamente. db/migrations001 e002 são arquivos de release: não reaplicar001 no banco compartilhado nem importar db/tests/legacy_fixture.sql na produção.

Os testes de autenticação usam H2 isolado; scripts/smoke_epi_local.py usa exclusivamente localhost18082 com fixture PostgreSQL descartável e credenciais fictícias de teste. Docker é opcional para o aplicativo, mas útil para esses testes de integração.

## Rodar frontend

> **Revisão em 25/11/2026:** Atual como orientação local; confira as versões e a configuração antes de executar.

Na pasta projetofullstack2026:

```powershell
npm ci
npm start
```

Abra http://localhost:4200. O ambiente de desenvolvimento usa a API local; confira src/environments/environment.development.ts. npm run build gera dist/frontend/browser. Na produção, environment.ts aponta para Render e vercel.json cuida das rotas Angular.

## Publicação existente

> **Revisão em 25/11/2026:** Atual como referência de endereços e regras; contas, configurações e estado publicado precisam ser verificados novamente.

- **Atual como referência; confirmar no ambiente.** Frontend: https://projetofullstack2026-chi.vercel.app/login (Vercel do Vinicius).
- **Atual como referência; confirmar no ambiente.** Backend: https://tst-java-db-access-api.onrender.com (Render do Vinicius).
- **Atual como referência; confirmar no ambiente.** Banco: Supabase projeto aabhyazfeeiwegchfxrl; só metadados aqui, nenhuma credencial.
- **Atual como referência; confirmar no ambiente.** CORS permite localhost4200 e os domínios autorizados do frontend. Não liberar todos os domínios para resolver erro.
- **Atual como referência; confirmar no ambiente.** O ADMIN inicial é o funcionário ID7. A senha não está documentada/versionada; solicitar acesso ao responsável. ADMIN/Gerência define senhas dos demais funcionários.

## Estado da entrega

> **Revisão em 25/11/2026:** Desatualizado como fotografia do estado atual: os hashes, migrações e funcionalidades descritos registram uma entrega anterior, não comprovam o deploy atual. Os relatos ainda não enviam imagens; fichas e documentos já têm implementação.

Publicação deste ciclo conferida: migração002 aplicada ao Supabase, backend dc6c9a6 no Render e frontend 2ba43c4 na Vercel. Os próximos commits de documentação não alteram o código publicado.

Etapas1–2 anteriores: login real e sessão revogável, papéis, notificações separadas, banco alinhado e site publicado. Esta continuação implementa cadastro/recebimento e autocompleteCA, entregas canônicas e substituição/descarte com trilha de data/motivo/responsável. Consulte commits por funcionalidade e TODO para o estado final e evidências de testes. Anexos continuam pendentes, sem upload demonstrativo que aparente persistir arquivos.

Não é preciso migrar arquivos temporários da nuvem. Os fontes, migrações, contexto e instruções estão no GitHub; novas sessões não herdam automaticamente o histórico deste chat nem suas conexões.
