# Migration Intelligence Engine

Ferramenta de IA para atração e conversão de Merchant Sellers — merchants que já vendem online em outras plataformas e representam o ICP de maior valor para a **Nuvemshop Next**.

**Time:** Nurturing Acquisition · Growth Marketing — Nuvemshop

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

## Estrutura do Projeto

```
migration-Intelligence-engine/
├── frontend/                    # Aplicação Next.js com API routes
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/analyze/route.ts  # API: scraping + Claude LLM
│   │   │   ├── layout.tsx       # Root layout com metadata e fonte
│   │   │   ├── page.tsx         # Página principal e orquestração de estado
│   │   │   └── globals.css      # Tokens de tema e estilos globais
│   │   ├── components/
│   │   │   └── sections/
│   │   │       ├── Navbar.tsx
│   │   │       ├── HeroSection.tsx
│   │   │       ├── QualificationForm.tsx
│   │   │       ├── LoadingAnalysis.tsx
│   │   │       ├── EconomyReport.tsx
│   │   │       ├── MigrationPlan.tsx
│   │   │       ├── QuickWins.tsx
│   │   │       ├── CTASection.tsx
│   │   │       └── Footer.tsx
│   │   ├── lib/
│   │   │   ├── data.ts          # Dados de negócio e constantes
│   │   │   └── analyze.ts       # Lógica de cálculo e geração de análise
│   │   └── types/
│   │       └── report.ts        # Definições de tipos TypeScript
│   ├── public/                  # Assets estáticos (logos Nuvemshop)
│   ├── package.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   └── tsconfig.json
├── competitive-analysis/        # Análises comparativas por concorrente
│   ├── nuvemshop-x-shopify.md   # (placeholder)
│   ├── nuvemshop-x-tray.md
│   ├── nuvemshop-x-vtex.md
│   ├── nuvemshop-x-woocommerce.md
│   ├── nuvemshop-x-wix-.md     # (placeholder)
│   └── nuvemshop-x-lojaintegrada.md
├── assets/                      # Logos e imagens de marca
├── frontend-spec.md             # Especificação de design (tokens, componentes, responsividade)
└── migration_intelligence_engine.md  # Plano estratégico completo
```

---

## Frontend

### Stack

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Next.js | 16.2.1 | Framework React com API routes |
| React | 19.2.4 | UI library |
| Tailwind CSS | 4.2.2 | Estilização utility-first |
| Framer Motion | 12.38.0 | Animações e transições |
| TypeScript | 5.9.3 | Tipagem estática |
| Cheerio | - | Scraping de lojas (server-side) |
| @anthropic-ai/sdk | - | Integração com Claude (LLM) |

### Fluxo do Usuário

```
1. Hero → Merchant insere URL da loja
2. Qualification Form → Seleciona plataforma, faturamento e dores
3. Loading Analysis → Animação de progresso (4 etapas, ~3s)
4. Relatório → Economia projetada + Plano de migração + Quick wins
5. CTA → Agendar demonstração ou baixar PDF
```

### Design System

Baseado nos tokens da marca Nuvemshop e no Nimbus Design System:

- **Cores:** Primary #171E43, Accent #0050C3, Success #00A650
- **Fonte:** Plus Jakarta Sans (400–800)
- **Espaçamento:** Sistema base-4 (4px increments)
- **Breakpoints:** Mobile (<768px), Tablet (768–1024px), Desktop (>1024px)

### API Route — Scraping + IA

O frontend inclui uma API route (`/api/analyze`) que faz:

1. **Scraping real** da URL do merchant com Cheerio:
   - Detecta plataforma via signatures no HTML (Shopify, Tray, WooCommerce, etc.)
   - Identifica tecnologias (Google Analytics, Meta Pixel, RD Station, etc.)
   - Extrai título, descrição e dados estruturados
2. **Diagnóstico por IA** via Claude (Anthropic API):
   - Gera um parágrafo personalizado sobre a loja analisada
   - Classifica complexidade de migração (baixa/média/alta)
   - Produz dicas contextualizadas baseadas nas dores reportadas

Se a API key não estiver configurada, a ferramenta funciona com fallback inteligente (dados hardcoded + insights baseados em regras).

```bash
# Configurar a API key
cp .env.example .env.local
# Editar .env.local com sua ANTHROPIC_API_KEY
```

### Lógica de Cálculo

O cálculo de economia roda client-side com dados enriquecidos pelo scraping:

```
Custo Atual = Plano + (Faturamento × Taxa Transação) + Apps
Custo Nuvemshop = Plano Next fixo (R$349–1999/mês)
Economia Mensal = Custo Atual - Custo Nuvemshop
Economia Anual = Economia Mensal × 12
```

Dados de custo segmentados por plataforma de origem (5) e faixa de faturamento (5 tiers).

### Comandos

```bash
cd frontend

# Desenvolvimento
npm run dev

# Build (static export)
npm run build

# Produção
npm start
```

---

## Análises Competitivas

Documentos de comparação detalhada entre Nuvemshop e concorrentes, usados como base de dados para os quick wins e argumentos de venda da ferramenta.

| Arquivo | Status | Destaques |
|---------|--------|-----------|
| **vs Loja Integrada** | Completo | Nuvemshop vence com plano gratuito ilimitado, 200+ apps, Nuvem Pago/Envio nativos |
| **vs Tray** | Completo | Nuvemshop tem plano gratuito (Tray não), WhatsApp nativo via Nuvem Chat, 99.9% uptime |
| **vs VTEX** | Completo | VTEX é enterprise (R$1.500+/mês + devs), Nuvemshop Next oferece autonomia + custo menor |
| **vs Shopify** | Completo | Nuvemshop elimina risco cambial (USD→BRL), Pix nativo, Nuvem Envio sem apps pagos |
| **vs WooCommerce** | Completo | WooCommerce tem custos ocultos (hosting, plugins, dev), Nuvemshop é zero manutenção |
| **vs Wix** | Placeholder | Pendente |

---

## Arquitetura Planejada (Full Stack)

O MVP frontend está implementado com lógica client-side. A arquitetura completa prevê:

```
[Merchant insere URL]
        │
        ▼
[N8N Webhook]
        │
        ├──→ Scraping (Cheerio/Puppeteer): plataforma, produtos, tech stack
        ├──→ StoreLeads API: tráfego, apps instalados, rank
        ├──→ Cálculo de custos: atual vs. Nuvemshop Next
        └──→ LLM (Claude/OpenAI): relatório personalizado
                │
                ▼
        [Relatório → Captura lead → Supabase]
                │
                ▼
        [Nurturing automatizado via N8N + WhatsApp]
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

## Integração com Ecossistema

```
Churn Radar ──→ Migration Intelligence Engine ──→ Nuvemshop Next (vendas)
                         │
                         └──→ Nurturing via IA (WhatsApp)
```

- **Churn Radar** detecta merchants em janela de migração e envia link da ferramenta
- **Migration Engine** gera lead pré-qualificado com dados enriquecidos
- **Agente WhatsApp** faz follow-up contextualizado com dados do relatório

---

## Status Atual

- [x] Plano estratégico documentado
- [x] Especificação de design (tokens, componentes, responsividade)
- [x] Frontend implementado (Next.js + API routes)
- [x] Scraping real de lojas com Cheerio (detecção de plataforma, tecnologias)
- [x] Integração com Claude (Anthropic) para diagnóstico personalizado por IA
- [x] Análises competitivas: Loja Integrada, Tray, VTEX, Shopify, WooCommerce
- [ ] Análise competitiva: Wix
- [ ] Integração StoreLeads API (enriquecimento de dados)
- [ ] Integração Supabase (persistência de leads)
- [ ] Fluxo de nurturing automatizado
- [ ] Landing pages SEO por plataforma
