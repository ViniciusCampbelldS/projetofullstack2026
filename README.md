# MAR — Frontend Angular 21

Interface corporativa de gestão de EPI, funcionários, entregas, notificações e treinamentos. O CSS foi refatorado mantendo a identidade MAR azul/laranja, sem alterar a navegação nem substituir as páginas por um dashboard genérico.

## Rodar

```bash
npm ci
npm start
```

Se você baixou a versão anterior e encontrou **`NG0908: Angular requires Zone.js`**, use esta versão corrigida e execute `npm ci` de novo. `zone.js` agora está incluído nas dependências e carregado antes do bootstrap do Angular em `src/main.ts`.

Acesse `http://localhost:4200` com a API Java rodando em `http://localhost:8080`. O proxy local em `proxy.conf.json` encaminha `/api` ao backend.

```bash
npm run build
```

Consulte [`../README.md`](../README.md) para configuração completa do banco, credenciais de desenvolvimento e limitações.
