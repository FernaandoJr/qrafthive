# API Routes (Servidor)

Este documento descreve como utilizar as rotas expostas pelo servidor (localizadas em `apps/server/src/routes`). Inclui exemplos de requisições para **autenticação**, **health** e **qrcode**.

---

## Base

- **URL base (dev)**: `http://localhost:3333` (padrão em `src/config/env.ts` — variável `PORT`)
- As rotas principais estão organizadas sob o prefixo `/api/v1` quando protegidas por autenticação.

---

## Autenticação (Better-Auth) ✅

- O handler do Better-Auth está montado em: **`/api/auth/*`** (arquivo: `src/routes/auth.ts`).
- A implementação usa `better-auth` com `emailAndPassword` habilitado (veja `src/config/auth.ts`).

Observações:
- O Better-Auth provê endpoints prontos para signup/signin/session/etc. (a rota é proxyada por `/api/auth/*`).
- As sessões são gerenciadas via cookies.

Exemplo rápido (fluxo típico):

1) Registrar um usuário (exemplo genérico):

```bash
curl -X POST "http://localhost:3333/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "yourpass123" }' \
  -c cookies.txt
```

2) Fazer login (salva cookie de sessão em `cookies.txt`):

```bash
curl -X POST "http://localhost:3333/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com", "password": "yourpass123" }' \
  -c cookies.txt
```

> Nota: os nomes exatos de endpoints (e campos) seguem a API do pacote `better-auth`. Consulte a documentação do `better-auth` se precisar de detalhes adicionais.

---

## Rota: Health ✅

- **Endpoint**: `GET /api/v1/health/`
- **Descrição**: Retorna o status do servidor (uptime, timestamp, status).
- **Resposta (exemplo)**:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 123.45,
    "timestamp": "2025-12-23T..."
  }
}
```

Exemplo cURL:

```bash
curl "http://localhost:3333/api/v1/health/"
```

---

## Rota: Qrcode (protegida) 🔒

- **Endpoint**: `POST /api/v1/qrcode/`
- **Proteção**: Requer autenticação (middleware verifica sessão do Better-Auth).
- **Content-Type**: `application/json`
- **Resposta**: Retorna um SVG (`Content-Type: image/svg+xml`).

Body (interface `IQrcodeRequest` — veja `packages/shared/src/types/qrcode.ts`):

- data: string
- errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
- width: number
- margin: number
- darkColor: string (ex: `#000000`)
- lightColor: string (ex: `#ffffff`)
- cornerColor: string
- cornerInnerColor: string
- moduleShape: one of `square|circle|diamond|rounded|outlined`
- logo?: {
  - url: string
  - scale: number
  - maskMode: 'box' | 'alphaCell'
  - borderMargin: number
}

Exemplo de corpo JSON:

```json
{
  "data": "https://example.com",
  "errorCorrectionLevel": "H",
  "width": 512,
  "margin": 8,
  "darkColor": "#111827",
  "lightColor": "#ffffff",
  "cornerColor": "#111827",
  "cornerInnerColor": "#ffffff",
  "moduleShape": "rounded",
  "logo": {
    "url": "https://example.com/logo.png",
    "scale": 0.2,
    "maskMode": "box",
    "borderMargin": 6
  }
}
```

Exemplo cURL — usando cookies obtidos durante o login (veja seção Autenticação):

```bash
# Assumindo que cookies.txt contém a sessão autenticada
curl -X POST "http://localhost:3333/api/v1/qrcode/" \
  -H "Content-Type: application/json" \
  -d '@qrcode_body.json' \
  -b cookies.txt \
  -o qr.svg
```

Isto salvará o SVG gerado em `qr.svg`.

> Observação: o endpoint valida o corpo com `qrcodeSchema` (veja `packages/shared/src/utils/qrocde/schema.ts`).

---

## Variáveis de ambiente importantes 🔧

- `PORT` (padrão 3000)
- `MONGODB_URI` (conexão com MongoDB)
- `BETTER_AUTH_SECRET` (secreto do Better-Auth)
- `BETTER_AUTH_URL` (base URL do serviço de auth — exemplo: `http://localhost:3333`)

As variáveis podem ser definidas no arquivo `.env.local` (ex.: `apps/server/.env.local` ou `.env.example`).

---

## Executando em desenvolvimento

- A partir de `apps/server` rode:

```bash
pnpm --filter @repo/server dev
# ou, se preferir usar bun diretamente:
bun run --watch src/index.ts
```

---

## Observações finais 💡

- As rotas de autenticação são fornecidas pelo `better-auth` (ver `src/config/auth.ts`). Se precisar de exemplos adicionais para fluxos OAuth ou endpoints específicos do `better-auth`, posso adicioná-los ou extrair automaticamente a lista completa de endpoints do handler.

---

Se quiser, adiciono exemplos de testes automatizados (supertest/curl) ou um Postman/Insomnia collection. Quer que eu gere isso também? ✅