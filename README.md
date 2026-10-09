# NOC Monitor

Painel de monitoramento de servidores feito pra demonstrar a stack **React + Next.js (App Router) + TypeScript + Tailwind CSS + Radix UI**, com gráficos em **Recharts**, formulário com **React Hook Form + Zod** e testes com **Vitest**.

Os dados são simulados em memória (sem banco), então roda em qualquer lugar sem configuração.

## O que tem

| Tela | Rota | O que demonstra |
|---|---|---|
| Painel | `/` | Server Component buscando dados com `async/await`, cards de resumo, gráfico de latência 24h, tabela com busca (debounce), filtro (Radix Select) e atualização ao vivo a cada 5s |
| Detalhe | `/servidores/[id]` | Rota dinâmica, `loading.tsx`, `notFound()` → `not-found.tsx` |
| Novo servidor | `/servidores/novo` | React Hook Form + Zod, campos que mudam conforme o tipo, validação no blur, Server Action validando de novo no servidor |
| API | `/api/status` | Route Handler que simula uma rodada de checagem |

## Rodar local

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # testes (Vitest)
npm run lint
npm run build
```

## Subir na VPS (Docker)

Pré-requisito: Docker e Docker Compose instalados na VPS.

```bash
# 1. Enviar o projeto (do seu computador)
scp noc-monitor.zip usuario@IP_DA_VPS:~
# ou: git clone https://github.com/SEU_USUARIO/noc-monitor.git

# 2. Na VPS
unzip noc-monitor.zip && cd noc-monitor
docker compose up -d --build

# 3. Conferir
docker compose logs -f
curl http://localhost:3000/api/status
```

Abra `http://IP_DA_VPS:3000`. Se não abrir, libere a porta: `sudo ufw allow 3000`.

### Opcional: domínio com HTTPS (Nginx)

```nginx
server {
    server_name noc.seudominio.com.br;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Depois: `sudo certbot --nginx -d noc.seudominio.com.br`.

### Sem Docker (PM2)

```bash
npm ci && npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
npm i -g pm2
PORT=3000 pm2 start .next/standalone/server.js --name noc-monitor
pm2 save
```

## Estrutura

```
src/
├── app/
│   ├── layout.tsx              # casca: cabeçalho e navegação
│   ├── page.tsx                # painel (Server Component)
│   ├── loading.tsx / error.tsx / not-found.tsx
│   ├── actions.ts              # Server Action de cadastro
│   ├── api/status/route.ts     # Route Handler
│   └── servidores/
│       ├── [id]/page.tsx       # rota dinâmica
│       └── novo/page.tsx
├── components/
│   ├── ui/                     # Design System: Button (cva), StatusBadge, Card, Field, Select (Radix)
│   ├── server-table.tsx        # Client: busca, filtro, polling
│   ├── latency-chart.tsx       # Client: Recharts
│   └── server-form.tsx         # Client: React Hook Form + Zod
├── hooks/use-debounce.ts
└── lib/
    ├── types.ts                # tipos e union type de status
    ├── schema.ts               # schema Zod (discriminated union)
    ├── filter.ts               # funções puras (testadas)
    └── data.ts                 # "banco" em memória + simulação
```

## Decisões técnicas

- **Server vs Client:** páginas são Server Components e buscam os dados no servidor. Só o que tem interação (tabela, gráfico, formulário) é Client Component, recebendo os dados por props.
- **Design tokens:** cores, raio e fontes ficam em `@theme` no `globals.css` e viram classes do Tailwind (`bg-surface`, `text-ok`).
- **Variantes com cva:** `Button` e `StatusBadge` declaram as variantes num lugar só.
- **Radix UI:** Select, Tooltip e Label trazem teclado, foco e ARIA prontos; o visual é só Tailwind.
- **Validação nos dois lados:** o mesmo schema Zod valida no navegador e na Server Action.
- **Acessibilidade:** status sempre com cor + texto, labels ligados aos inputs, erros com `aria-describedby`, foco visível, link "pular para o conteúdo", tabela alternativa ao gráfico.
- **Tempo real:** hoje é polling a cada 5s em `/api/status`. Num NOC de verdade eu trocaria por **WebSocket ou SSE**, pro servidor empurrar a mudança.
- **Próximos passos:** virtualização da tabela (`react-window`) pra milhares de linhas, persistência em banco, autenticação via middleware, testes E2E com Playwright.
