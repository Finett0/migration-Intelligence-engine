# Migration Intelligence Engine

Ferramenta de IA para atração e conversão de Merchant Sellers — merchants que já vendem online em outras plataformas e representam o ICP de maior valor para a **Nuvemshop Next**.

**Time:** Nurturing Acquisition · Growth Marketing — Nuvemshop

**Live:** [migration-intelligence-engine.vercel.app](https://migration-intelligence-engine.vercel.app)

---

## Problema

O funil atual da Nuvemshop Next tem alta fricção. O único CTA disponível é "Fale com um especialista", criando uma barreira para merchants em momento de curiosidade ativa que querem respostas imediatas sobre economia e tempo de migração. O aha moment está preso atrás de uma barreira humana.

```
FUNIL ATUAL (alto atrito):
Merchant interessado → Formulário → Espera (horas/dias) → Reunião → Proposta → Decisão

FUNIL PROPOSTO (self-service):
Merchant interessado → Insere URL da loja → Relatório instantâneo → Agendamento informado
```

## Hipóteses

| # | Hipótese | Como a ferramenta resolve |
|---|----------|--------------------------|
| 1 | **Switching Cost percebido > real** | Diagnóstico automático com inventário, integrações compatíveis e cronograma estimado |
| 2 | **Value Gap não comunicado** | Cálculo automático de economia (plano + taxas + apps + câmbio) personalizado por merchant |
| 3 | **Timing de interceptação** | Landing pages SEO por plataforma + outbound contextualizado via Churn Radar |

---

## URLs

| URL | Descrição | Acesso |
|-----|-----------|--------|
| [migration-intelligence-engine.vercel.app](https://migration-intelligence-engine.vercel.app) | App principal | Público |
| [migration-intelligence-engine.vercel.app/admin](https://migration-intelligence-engine.vercel.app/admin) | Dashboard admin | Senha protegido |
| [migration-intelligence-engine.vercel.app/admin/leads](https://migration-intelligence-engine.vercel.app/admin/leads) | Lista de leads | Senha protegido |

---

## Stack Tecnológico

### Frontend

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| Next.js | 16.2.1 | Framework React (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.9.3 | Tipagem estática |
| Tailwind CSS | 4.2.2 | Estilização utility-first |
| Framer Motion | 12.38.0 | Animações e transições |
| jsPDF | 4.2.1 | Geração de PDF no client-side |

### Backend (API Routes)

| Rota | Método | Função |
|------|--------|--------|
| `/api/analyze` | POST | Scraping da loja + diagnóstico IA + criação de lead |
| `/api/send` | POST | Envio de email via Resend + tracking pixel |
| `/api/admin/auth` | POST/DELETE | Login/logout do admin (JWT) |
| `/api/events/pdf-download` | POST | Tracking de download do PDF |
| `/api/events/email-open` | GET | Pixel 1x1 PNG para tracking de abertura de email |

### Modelo de IA

| Item | Detalhe |
|------|---------|
| Provider | Anthropic |
| Modelo | `claude-sonnet-4-20250514` |
| SDK | `@anthropic-ai/sdk` v0.80.0 |
| Uso | Diagnóstico personalizado de migração em português — complexidade, dicas e análise contextualizada |

### Banco de Dados

| Item | Detalhe |
|------|---------|
| Banco | PostgreSQL (Prisma Postgres) |
| ORM | Prisma 7.5.0 |
| Driver | `@prisma/adapter-pg` |
| Modelos | `Lead` (url, email, phone, platform, revenue, pains, score) + `Event` (type, metadata) |

### Integrações Externas

| Serviço | Função |
|---------|--------|
| **Anthropic Claude** | Análise inteligente das lojas via LLM |
| **Resend** | Envio de emails transacionais (relatório ROI) |
| **Cheerio** | Web scraping e parse HTML das lojas |
| **Vercel** | Hosting + Serverless Functions |
| **Prisma Postgres** | Database gerenciado |

### Autenticação (Admin)

| Item | Detalhe |
|------|---------|
| Método | Senha única + JWT |
| Lib | `jose` v6.2.2 (HS256) |
| Expiração | 24 horas |
| Cookie | `admin_session` (HTTP-only, secure) |

---

## Fluxo do Usuário

```
1. Hero → Merchant insere URL da loja
2. Qualification Form → Seleciona plataforma, faturamento e dores
3. Loading Analysis → Scraping real + Claude AI (~3-5s)
4. Relatório → Economia projetada + Plano de migração + Quick wins
5. CTA → Baixar PDF ou enviar relatório por email
```

---

## Lead Scoring

Cada interação do merchant gera pontos automaticamente:

| Evento | Pontos |
|--------|--------|
| Análise da loja | +1 |
| Download do PDF | +3 |
| Email enviado | +5 |
| Abertura do email | +2 |

**Score máximo: 11 pontos.** Leads com score alto = prospects mais engajados, prontos para abordagem comercial.

---

## Admin Dashboard

O dashboard em `/admin` oferece:

- **KPIs em tempo real** — total de leads, análises, PDFs, emails enviados/abertos
- **Funil de conversão** — análise → PDF → email → abertura
- **Top leads por score** — priorização para o time comercial
- **Atividade recente** — timeline de eventos
- **Detalhe do lead** — timeline completa com score breakdown

---

## Plataformas Detectadas

O scraping identifica automaticamente:

| Plataforma | Detecção |
|-----------|----------|
| Shopify | `/products.json`, `/collections.json`, meta tags |
| Tray | Signatures HTML específicas |
| WooCommerce | `/wp-json/wc/store/v1/` endpoints |
| Loja Integrada | Signatures HTML específicas |
| VTEX | `/api/catalog_system/pub/` endpoints |
| Nuvemshop | Signatures HTML específicas |

Também detecta integrações: Google Analytics, Meta Pixel, RD Station, Hotjar, Zendesk, Mailchimp, HubSpot, e mais.

---

## Estrutura do Projeto

```
migration-Intelligence-engine/
├── frontend/
│   ├── prisma/
│   │   └── schema.prisma          # Schema do banco (Lead + Event)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── analyze/route.ts       # Scraping + IA + lead tracking
│   │   │   │   ├── send/route.ts          # Email via Resend + tracking pixel
│   │   │   │   ├── admin/auth/route.ts    # Auth JWT
│   │   │   │   └── events/
│   │   │   │       ├── pdf-download/route.ts
│   │   │   │       └── email-open/route.ts
│   │   │   ├── (admin)/
│   │   │   │   ├── layout.tsx             # Layout admin com sidebar
│   │   │   │   └── admin/
│   │   │   │       ├── page.tsx           # Dashboard principal
│   │   │   │       ├── login/page.tsx     # Tela de login
│   │   │   │       ├── leads/page.tsx     # Lista de leads
│   │   │   │       └── leads/[id]/page.tsx # Detalhe do lead
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                   # Página principal
│   │   │   └── globals.css
│   │   ├── components/sections/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── QualificationForm.tsx
│   │   │   ├── LoadingAnalysis.tsx
│   │   │   ├── EconomyReport.tsx
│   │   │   ├── MigrationPlan.tsx
│   │   │   ├── QuickWins.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── Footer.tsx
│   │   ├── lib/
│   │   │   ├── analyze.ts          # Lógica de cálculo e geração de análise
│   │   │   ├── data.ts             # Dados de negócio e constantes
│   │   │   ├── prisma.ts           # Singleton Prisma client
│   │   │   ├── track.ts            # Lead upsert + event tracking
│   │   │   ├── scoring.ts          # Constantes de pontuação
│   │   │   ├── admin-auth.ts       # JWT helpers (jose)
│   │   │   └── generatePDF.ts      # Geração de PDF (jsPDF)
│   │   └── types/
│   │       └── report.ts
│   ├── public/                     # Assets estáticos (logos)
│   ├── package.json
│   └── prisma.config.ts
├── competitive-analysis/           # Análises comparativas por concorrente
├── assets/                         # Logos e imagens de marca
├── frontend-spec.md                # Especificação de design
└── migration_intelligence_engine.md # Plano estratégico completo
```

---

## Lógica de Cálculo

```
Custo Atual = Plano + (Faturamento x Taxa Transação) + Apps
Custo Nuvemshop = R$449/mês (plano fixo)
Economia Mensal = Custo Atual - Custo Nuvemshop
Economia Anual = Economia Mensal x 12
```

Dados segmentados por plataforma de origem (6) e faixa de faturamento (5 tiers).

---

## Análises Competitivas

| Arquivo | Status | Destaques |
|---------|--------|-----------|
| **vs Shopify** | Completo | Nuvemshop elimina risco cambial (USD→BRL), Pix nativo, Nuvem Envio sem apps pagos |
| **vs Tray** | Completo | Nuvemshop tem plano gratuito (Tray não), WhatsApp nativo via Nuvem Chat, 99.9% uptime |
| **vs VTEX** | Completo | VTEX é enterprise (R$1.500+/mês + devs), Nuvemshop Next oferece autonomia + custo menor |
| **vs WooCommerce** | Completo | WooCommerce tem custos ocultos (hosting, plugins, dev), Nuvemshop é zero manutenção |
| **vs Loja Integrada** | Completo | Nuvemshop vence com plano gratuito ilimitado, 200+ apps, Nuvem Pago/Envio nativos |

---

## Como Rodar Localmente

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas API keys

# Gerar Prisma client
npx prisma generate

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
```

### Variáveis de Ambiente

```
ANTHROPIC_API_KEY=        # API key do Claude (Anthropic)
DATABASE_URL=             # Connection string PostgreSQL
RESEND_API_KEY=           # API key do Resend (emails)
ADMIN_PASSWORD=           # Senha do admin dashboard
ADMIN_JWT_SECRET=         # Secret para JWT
NEXT_PUBLIC_APP_URL=      # URL pública do app
```

---

## Métricas de Sucesso

**North Star:** 15–20% de taxa de agendamento entre merchants que completam a análise.

| Métrica | Meta |
|---------|------|
| Análises completadas | 200+/mês após 90 dias |
| Captura de lead | >60% dos que veem o relatório |
| Redução ciclo de vendas | -30% vs. fluxo atual |
| SQL rate | >40% |
| Economia projetada média | >R$5.000/ano por merchant |

---

## Status

- [x] Plano estratégico documentado
- [x] Especificação de design (tokens, componentes, responsividade)
- [x] Frontend implementado (Next.js 16 + App Router)
- [x] Scraping real de lojas com Cheerio (6 plataformas)
- [x] Integração com Claude (Anthropic) para diagnóstico por IA
- [x] Geração de PDF com relatório completo (jsPDF)
- [x] Envio de email com Resend + tracking pixel
- [x] Banco de dados PostgreSQL com Prisma 7
- [x] Lead scoring automático (análise → PDF → email → abertura)
- [x] Admin dashboard com KPIs, funil, leads e timeline
- [x] Autenticação admin (JWT + cookie HTTP-only)
- [x] Deploy em produção (Vercel)
- [x] Análises competitivas: Shopify, Tray, VTEX, WooCommerce, Loja Integrada
