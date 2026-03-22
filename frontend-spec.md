# Frontend Design Spec — Migration Intelligence Engine

## Guia de Estilo e Componentes para a IA Codar

**Baseado em:** Nuvemshop Brand Tokens + Nimbus Design System
**Projeto:** Migration Intelligence Engine (MVP)
**Stack:** Next.js / React ou HTML + Tailwind (adaptável)

---

## 1. Design Tokens

### 1.1 Cores

```css
:root {
  /* ── Brand ── */
  --color-primary:        #171E43;   /* Azul escuro — textos principais, headers, navbar */
  --color-accent:         #0050C3;   /* Azul Nuvemshop — CTAs, links, destaques */
  --color-accent-hover:   #003D94;   /* Accent escurecido para hover */
  --color-accent-light:   #E8F0FE;   /* Accent clarinho — badges, backgrounds sutis */
  --color-background:     #FFFFFF;   /* Fundo principal */
  --color-text-primary:   #0050C3;   /* Texto com destaque (conforme token brand) */
  --color-text-dark:      #171E43;   /* Texto headings e body forte */
  --color-link:           #0050C3;   /* Links */

  /* ── Superfícies ── */
  --color-surface:        #FFFFFF;   /* Cards, modais */
  --color-surface-alt:    #F7F8FA;   /* Fundo alternativo — seções zebra, inputs */
  --color-border:         #E4E7EC;   /* Bordas de cards, inputs, dividers */
  --color-border-focus:   #0050C3;   /* Borda ao focar input */

  /* ── Semânticas ── */
  --color-success:        #00A650;   /* Verde — economia, checkmarks, positivo */
  --color-success-light:  #E6F9ED;   /* Fundo verde suave */
  --color-warning:        #F59E0B;   /* Amarelo — atenção, alertas neutros */
  --color-warning-light:  #FEF3C7;
  --color-danger:         #E53935;   /* Vermelho — custo alto, perda, erro */
  --color-danger-light:   #FEE2E2;
  --color-neutral-500:    #6B7280;   /* Texto secundário, placeholders */
  --color-neutral-300:    #D1D5DB;   /* Bordas mais leves, dividers sutis */
  --color-neutral-100:    #F3F4F6;   /* Background ultra-leve */

  /* ── Gradientes (usados na hero) ── */
  --gradient-hero:        linear-gradient(135deg, #171E43 0%, #0050C3 100%);
  --gradient-card-accent: linear-gradient(135deg, #0050C3 0%, #003D94 100%);
}
```

### 1.2 Tipografia

```css
/* 
 * Font: Plus Jakarta Sans (Google Fonts)
 * Import: https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap
 */

:root {
  --font-family:       'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* ── Tamanhos ── */
  --text-h1:           64px;    /* Hero headline */
  --text-h2:           40px;    /* Section titles */
  --text-h3:           24px;    /* Card titles, subsections */
  --text-h4:           20px;    /* Subtítulos menores */
  --text-body:         16px;    /* Corpo padrão */
  --text-body-lg:      18px;    /* Corpo destaque */
  --text-small:        14px;    /* Labels, captions, helper text */
  --text-xs:           12px;    /* Badges, tags, micro-text */

  /* ── Pesos ── */
  --font-regular:      400;
  --font-medium:       500;
  --font-semibold:     600;
  --font-bold:         700;
  --font-extrabold:    800;

  /* ── Line Height ── */
  --leading-tight:     1.2;     /* Headlines */
  --leading-normal:    1.5;     /* Body text */
  --leading-relaxed:   1.75;    /* Texto longo / legibilidade */
}
```

### 1.3 Espaçamento

```css
/* 
 * Sistema base-4 (conforme token: Base Unit = 4)
 * Todas as margens/paddings são múltiplos de 4px
 */

:root {
  --space-1:   4px;     /* 1 unit */
  --space-2:   8px;     /* 2 units */
  --space-3:   12px;    /* 3 units */
  --space-4:   16px;    /* 4 units — padding padrão de cards */
  --space-5:   20px;
  --space-6:   24px;    /* Gap entre elementos relacionados */
  --space-8:   32px;    /* Separação de blocos */
  --space-10:  40px;
  --space-12:  48px;    /* Padding de seções */
  --space-16:  64px;    /* Separação de seções grandes */
  --space-20:  80px;    /* Padding hero */
  --space-24:  96px;    /* Espaçamento entre seções na página */
}
```

### 1.4 Bordas e Sombras

```css
:root {
  /* ── Border Radius (token: 6px) ── */
  --radius-sm:     4px;     /* Badges, tags */
  --radius-md:     6px;     /* Padrão — inputs, botões, cards */
  --radius-lg:     12px;    /* Cards maiores, modais */
  --radius-xl:     16px;    /* Cards hero, containers destaque */
  --radius-full:   9999px;  /* Pills, avatares */

  /* ── Sombras ── */
  --shadow-sm:     0 1px 2px rgba(23, 30, 67, 0.05);
  --shadow-md:     0 4px 12px rgba(23, 30, 67, 0.08);
  --shadow-lg:     0 8px 24px rgba(23, 30, 67, 0.12);
  --shadow-xl:     0 16px 48px rgba(23, 30, 67, 0.16);
}
```

### 1.5 Breakpoints

```css
/* Mobile-first */
--bp-sm:   640px;
--bp-md:   768px;
--bp-lg:   1024px;
--bp-xl:   1280px;
--bp-2xl:  1440px;   /* Max-width do container principal */
```

---

## 2. Componentes da Página

### 2.1 Layout Geral

```
┌──────────────────────────────────────────────────────────┐
│  NAVBAR (fixo no topo)                                    │
├──────────────────────────────────────────────────────────┤
│  HERO SECTION                                             │
│  - Headline + subtítulo                                   │
│  - Input da URL + botão "Analisar"                        │
│  - Trust badges (300+ migrações, 96% satisfação)         │
├──────────────────────────────────────────────────────────┤
│  LOADING STATE (aparece ao analisar)                      │
│  - Animação de progresso                                  │
│  - Steps sendo executados em tempo real                   │
├──────────────────────────────────────────────────────────┤
│  RELATÓRIO (aparece após análise)                         │
│  - Seção 1: Economia projetada (cards comparativos)      │
│  - Seção 2: Plano de migração (timeline/checklist)       │
│  - Seção 3: Quick wins (grid de benefícios)              │
│  - CTA: Agendar demonstração / Baixar PDF                │
├──────────────────────────────────────────────────────────┤
│  FOOTER                                                   │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Navbar

```
Estilo: Fundo branco, borda inferior sutil, fixo no topo
Altura: 64px
Conteúdo:
  - Logo Nuvemshop (esquerda): ícone de dois anéis interligados (branco sobre azul #0050C3)
  - Texto "Nuvemshop" ao lado do logo
  - Links de navegação (centro, opcional no MVP)
  - CTA "Fale com um especialista" (direita): botão outline azul

Logo SVG path (simplificado — dois anéis interligados):
  Usar a imagem oficial ou SVG do site nuvemshop.com.br
  Fallback: texto "Nuvemshop" em font-bold cor accent

CSS:
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-8);
  position: sticky; top: 0; z-index: 50;
```

### 2.3 Hero Section

```
Estilo: Gradiente escuro (#171E43 → #0050C3) com texto branco
Padding: 80px vertical, centrado
Max-width: 720px para o conteúdo

Elementos:
  ┌─────────────────────────────────────────────┐
  │  Badge: "Migration Intelligence Engine"      │
  │  Estilo: pill, fundo branco/10%, texto branco│
  │                                               │
  │  H1: "Descubra quanto você economiza         │
  │       migrando para a Nuvemshop"              │
  │  Estilo: 40-48px, extrabold, branco           │
  │                                               │
  │  Subtítulo: "Analise sua loja atual em        │
  │  30 segundos e receba um relatório            │
  │  personalizado com economia projetada,        │
  │  plano de migração e benefícios exclusivos."  │
  │  Estilo: 18px, regular, branco/80%            │
  │                                               │
  │  ┌─────────────────────────────────────────┐ │
  │  │  🔗 https://minhaloja.com.br     [Analisar]│
  │  └─────────────────────────────────────────┘ │
  │  Input: fundo branco, border-radius 6px       │
  │  Botão: fundo accent, texto branco, bold      │
  │  Composição: input + botão lado a lado        │
  │                                               │
  │  Trust: "✓ 300+ migrações  ✓ 96% satisfação  │
  │          ✓ Gratuito e instantâneo"            │
  │  Estilo: 14px, branco/60%, ícones check       │
  └─────────────────────────────────────────────┘

CSS Hero:
  background: var(--gradient-hero);
  padding: var(--space-20) var(--space-8);
  text-align: center;

CSS Input Group:
  display: flex;
  max-width: 560px;
  margin: 0 auto;
  background: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);

CSS Input:
  flex: 1;
  padding: var(--space-4) var(--space-6);
  border: none;
  font-size: var(--text-body-lg);
  outline: none;

CSS Button (Analisar):
  background: var(--color-accent);
  color: white;
  padding: var(--space-4) var(--space-8);
  font-weight: var(--font-bold);
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: var(--color-accent-hover); }
```

### 2.4 Formulário de Qualificação (aparece após inserir URL)

```
Estilo: Modal ou seção expandida, fundo branco, max-width 600px
Aparece com transição suave após o merchant clicar "Analisar"

Campos:
  1. Plataforma atual (se não detectou automaticamente)
     Tipo: Select / Radio buttons
     Opções: Shopify | Tray | WooCommerce | Loja Integrada | Outra
     Estilo: Radio pills lado a lado, selecionado = fundo accent + texto branco

  2. Faturamento mensal aproximado
     Tipo: Select
     Opções: Até R$10k | R$10k-50k | R$50k-100k | R$100k-500k | R$500k+
     Estilo: Dropdown com borda --color-border, foco --color-border-focus

  3. Maior frustração com a plataforma atual
     Tipo: Multi-select (checkboxes visuais)
     Opções: Custo alto | Suporte ruim | Performance lenta | 
             Poucas integrações | Difícil de customizar | Taxas de transação
     Estilo: Chips/pills clicáveis, selecionado = borda accent + fundo accent-light

  4. Botão "Gerar meu relatório"
     Estilo: Botão primário full-width, accent, bold, 48px height

CSS Formulário:
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
```

### 2.5 Loading State (Análise em Progresso)

```
Estilo: Centrado, fundo branco, animação elegante
Aparece enquanto o backend processa (15-30s)

Elementos:
  ┌─────────────────────────────────────────────┐
  │                                               │
  │  [Animação: ícone Nuvemshop pulsando]        │
  │                                               │
  │  "Analisando sua loja..."                     │
  │  Estilo: 24px, semibold, --color-text-dark    │
  │                                               │
  │  Steps com status em tempo real:              │
  │  ✅ Detectando plataforma...         OK       │
  │  ✅ Contando produtos e categorias... OK      │
  │  🔄 Calculando economia projetada... [spin]   │
  │  ⏳ Gerando plano de migração...              │
  │                                               │
  │  Cada step aparece em sequência               │
  │  com animação de entrada (fade + slide up)    │
  └─────────────────────────────────────────────┘

CSS Steps:
  cada step = div com flex, gap 12px
  ícone check: color var(--color-success)
  ícone spinning: color var(--color-accent), animação rotate
  ícone pending: color var(--color-neutral-300)
  texto: 16px, font-medium
  transição: opacity 0→1, translateY(8px→0), duration 0.4s
```

### 2.6 Relatório — Seção 1: Economia Projetada

```
Estilo: Fundo branco, destaque visual forte, números grandes

  ┌─────────────────────────────────────────────────────┐
  │  Badge: "💰 Economia Projetada"                      │
  │                                                       │
  │  ┌──────────────┐    →    ┌──────────────┐           │
  │  │ Plataforma   │         │ Nuvemshop    │           │
  │  │ atual        │         │ Next         │           │
  │  │              │         │              │           │
  │  │ R$ 1.790/mês │         │ R$ 599/mês   │           │
  │  │              │         │              │           │
  │  │ Plano: $79   │         │ Plano: R$599 │           │
  │  │ Taxas: R$1k  │         │ Taxas: R$0   │           │
  │  │ Apps: R$300  │         │ Apps: incluso │           │
  │  └──────────────┘         └──────────────┘           │
  │                                                       │
  │  ┌─────────────────────────────────────────────────┐ │
  │  │  🎯 ECONOMIA ANUAL ESTIMADA: R$ 14.292          │ │
  │  │  Estilo: card destaque, fundo success-light,    │ │
  │  │  borda success, texto grande bold               │ │
  │  └─────────────────────────────────────────────────┘ │
  └─────────────────────────────────────────────────────┘

CSS Card Comparação:
  display: grid; grid-template-columns: 1fr auto 1fr;
  gap: var(--space-6);

Card "Atual":
  background: var(--color-neutral-100);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  Preço: color var(--color-danger), font-size 32px, font-extrabold
  Label: text-small, neutral-500

Card "Nuvemshop":
  background: var(--color-accent-light);
  border: 2px solid var(--color-accent);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  Preço: color var(--color-success), font-size 32px, font-extrabold
  Badge "Recomendado": fundo accent, texto branco, radius-full

Seta central:
  Ícone → (arrow right), color accent, 24px

Card Economia:
  background: var(--color-success-light);
  border: 2px solid var(--color-success);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-6);
  text-align: center;
  font-size: 28px; font-weight: extrabold; color: var(--color-success);
```

### 2.7 Relatório — Seção 2: Plano de Migração

```
Estilo: Timeline vertical com ícones numerados

  ┌─────────────────────────────────────────────────────┐
  │  Badge: "📋 Seu Plano de Migração"                   │
  │                                                       │
  │  Detectamos na sua loja:                              │
  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
  │  │  420   │ │   18   │ │  Blog  │ │ Mercado│        │
  │  │produtos│ │categ.  │ │ ativo  │ │ Pago   │        │
  │  └────────┘ └────────┘ └────────┘ └────────┘        │
  │  Estilo: stat cards, fundo surface-alt, número bold  │
  │                                                       │
  │  Cronograma estimado: ~25 dias                       │
  │                                                       │
  │  Timeline:                                            │
  │  (1)── Migração de catálogo ─── ~3 dias              │
  │  (2)── Configuração de layout ── ~5 dias             │
  │  (3)── Integrações (pagamento, frete) ── ~3 dias     │
  │  (4)── Testes e ajustes ── ~7 dias                   │
  │  (5)── Redirects SEO e lançamento ── ~7 dias         │
  │                                                       │
  │  💬 "Lojas similares migraram em ~25 dias com        │
  │      migração assistida pela Nuvemshop Next"         │
  └─────────────────────────────────────────────────────┘

CSS Stat Cards:
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  Cada card:
    background: var(--color-surface-alt);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    text-align: center;
    Número: font-size 28px, font-extrabold, color accent
    Label: font-size 14px, color neutral-500

CSS Timeline:
  cada step = flex row, gap 16px
  Número: 28px circle, fundo accent, texto branco, font-bold
  Linha vertical: 2px, cor border, conectando os círculos
  Texto: 16px, font-medium, color text-dark
  Prazo: 14px, color neutral-500, alinhado à direita
```

### 2.8 Relatório — Seção 3: Quick Wins

```
Estilo: Grid de cards com ícones

  ┌─────────────────────────────────────────────────────┐
  │  Badge: "🚀 O Que Você Ganha na Nuvemshop"          │
  │                                                       │
  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
  │  │ 💳          │ │ 🚚          │ │ 🇧🇷          │    │
  │  │ Pix nativo  │ │ Frete até   │ │ Suporte     │    │
  │  │ via Nuvem   │ │ 60% mais    │ │ em PT com   │    │
  │  │ Pago — sem  │ │ barato com  │ │ 96% de      │    │
  │  │ app extra   │ │ Nuvem Envio │ │ satisfação  │    │
  │  └─────────────┘ └─────────────┘ └─────────────┘    │
  │                                                       │
  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
  │  │ 🎨          │ │ 🤖          │ │ 📊          │    │
  │  │ 70+ layouts │ │ IA ilimitada│ │ 100% uptime │    │
  │  │ gratuitos e │ │ para gestão │ │ mesmo na    │    │
  │  │ customizá-  │ │ de produtos │ │ Black       │    │
  │  │ veis        │ │ e campanhas │ │ Friday      │    │
  │  └─────────────┘ └─────────────┘ └─────────────┘    │
  └─────────────────────────────────────────────────────┘

CSS Grid:
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

CSS Card:
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: box-shadow 0.2s, border-color 0.2s;
  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-accent);
  }
  Ícone: 32px, margin-bottom 12px
  Título: 16px, font-semibold, color text-dark
  Descrição: 14px, color neutral-500, line-height relaxed
```

### 2.9 CTA Final

```
Estilo: Seção destaque com gradiente, full-width

  ┌─────────────────────────────────────────────────────┐
  │  Background: gradient-hero (mesmo da hero)           │
  │                                                       │
  │  H2: "Pronto para economizar R$14.292/ano?"          │
  │  Estilo: 32px, extrabold, branco                     │
  │                                                       │
  │  Subtítulo: "Agende uma demonstração gratuita com    │
  │  nosso time de especialistas em migração."            │
  │  Estilo: 18px, branco/80%                            │
  │                                                       │
  │  ┌──────────────────────┐  ┌──────────────────────┐  │
  │  │ Agendar demonstração │  │ Baixar relatório PDF │  │
  │  │ (botão primário)     │  │ (botão secundário)   │  │
  │  └──────────────────────┘  └──────────────────────┘  │
  │                                                       │
  │  Formulário de captura (se ainda não capturou):      │
  │  [E-mail]  [WhatsApp]  [Enviar]                      │
  └─────────────────────────────────────────────────────┘

CSS Botão Primário:
  background: white;
  color: var(--color-accent);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-md);
  font-weight: var(--font-bold);
  font-size: var(--text-body-lg);
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  &:hover { box-shadow: var(--shadow-lg); transform: translateY(-1px); }

CSS Botão Secundário:
  background: transparent;
  color: white;
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-md);
  font-weight: var(--font-bold);
  font-size: var(--text-body-lg);
  border: 2px solid white;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.1); }
```

---

## 3. Componentes Reutilizáveis

### 3.1 Botões

```
Primário:
  bg: var(--color-accent)
  text: white
  padding: 12px 32px
  border-radius: var(--radius-md)
  font: 16px, bold
  hover: bg var(--color-accent-hover)
  disabled: opacity 0.5, cursor not-allowed

Secundário (outline):
  bg: transparent
  text: var(--color-accent)
  border: 2px solid var(--color-accent)
  padding: 12px 32px
  border-radius: var(--radius-md)
  font: 16px, bold
  hover: bg var(--color-accent-light)

Ghost:
  bg: transparent
  text: var(--color-accent)
  padding: 12px 32px
  font: 16px, bold
  hover: bg var(--color-neutral-100)

Tamanhos:
  sm: padding 8px 16px, font 14px
  md: padding 12px 32px, font 16px (padrão)
  lg: padding 16px 40px, font 18px
```

### 3.2 Badge / Tag

```
Padrão:
  display: inline-flex
  padding: 4px 12px
  border-radius: var(--radius-full)
  font: 12px, font-semibold
  text-transform: uppercase
  letter-spacing: 0.5px

Variantes:
  accent:  bg accent-light, text accent
  success: bg success-light, text success
  warning: bg warning-light, text warning (cor #92400E)
  danger:  bg danger-light, text danger
  neutral: bg neutral-100, text neutral-500
```

### 3.3 Card

```
Padrão:
  bg: var(--color-surface)
  border: 1px solid var(--color-border)
  border-radius: var(--radius-lg)
  padding: var(--space-6)
  box-shadow: var(--shadow-sm)

Hover (interativo):
  box-shadow: var(--shadow-md)
  border-color: var(--color-accent)
  transition: all 0.2s ease

Destaque:
  border: 2px solid var(--color-accent)
  box-shadow: var(--shadow-md)
```

### 3.4 Input

```
Padrão:
  bg: var(--color-surface)
  border: 1px solid var(--color-border)
  border-radius: var(--radius-md)
  padding: 12px 16px
  font: 16px, regular
  color: var(--color-text-dark)
  placeholder color: var(--color-neutral-500)

Focus:
  border-color: var(--color-border-focus)
  box-shadow: 0 0 0 3px rgba(0, 80, 195, 0.1)
  outline: none

Error:
  border-color: var(--color-danger)
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1)
```

### 3.5 Progress Bar

```
Container:
  width: 100%
  height: 8px
  bg: var(--color-neutral-100)
  border-radius: var(--radius-full)
  overflow: hidden

Fill:
  height: 100%
  bg: var(--color-accent)
  border-radius: var(--radius-full)
  transition: width 0.6s ease
```

### 3.6 Stat Card (números de destaque)

```
Container:
  bg: var(--color-surface-alt)
  border-radius: var(--radius-md)
  padding: var(--space-4)
  text-align: center

Número:
  font-size: 28px
  font-weight: var(--font-extrabold)
  color: var(--color-accent)
  line-height: var(--leading-tight)

Label:
  font-size: var(--text-small)
  color: var(--color-neutral-500)
  margin-top: var(--space-1)
```

---

## 4. Animações e Transições

```css
/* Transições padrão para hover e interações */
--transition-fast:    0.15s ease;
--transition-normal:  0.2s ease;
--transition-slow:    0.3s ease;

/* Animação de entrada para elementos do relatório */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeSlideUp 0.4s ease forwards;
}

/* Stagger delay para elementos sequenciais */
.animate-in:nth-child(1) { animation-delay: 0.0s; }
.animate-in:nth-child(2) { animation-delay: 0.1s; }
.animate-in:nth-child(3) { animation-delay: 0.2s; }
.animate-in:nth-child(4) { animation-delay: 0.3s; }

/* Spinner para loading */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}

/* Pulse para ícone durante análise */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

---

## 5. Responsividade

```
Desktop (>1024px):
  - Container max-width: 1200px, centrado
  - Grids: 3 colunas para cards, 2 colunas para comparação
  - Hero: texto grande (48px h1)
  - Side-by-side para formulário e preview

Tablet (768px-1024px):
  - Grids: 2 colunas para cards
  - Hero: texto médio (36px h1)
  - Stack vertical para comparação de planos

Mobile (<768px):
  - Grids: 1 coluna para tudo
  - Hero: texto menor (28px h1), padding reduzido
  - Input e botão empilhados verticalmente
  - Cards full-width
  - CTA buttons full-width e empilhados
  - Timeline simplificada
```

---

## 6. Estrutura de Arquivos Sugerida

```
/src
  /components
    /ui
      Button.tsx          # Botões (primary, secondary, ghost)
      Badge.tsx           # Tags e badges
      Card.tsx            # Card container
      Input.tsx           # Input text
      Select.tsx          # Dropdown select
      StatCard.tsx        # Número + label
      ProgressBar.tsx     # Barra de progresso
      Timeline.tsx        # Timeline com steps
    /sections
      Navbar.tsx          # Navbar fixa
      HeroSection.tsx     # Hero com input de URL
      QualificationForm.tsx  # Perguntas de qualificação
      LoadingAnalysis.tsx    # Estado de loading animado
      EconomyReport.tsx     # Seção 1: Economia
      MigrationPlan.tsx     # Seção 2: Plano de migração
      QuickWins.tsx         # Seção 3: Benefícios
      CTASection.tsx        # CTA final com captura
      Footer.tsx            # Footer
  /styles
    globals.css           # CSS variables (tokens acima)
    animations.css        # Keyframes e animações
  /lib
    analyze.ts            # Lógica de chamada ao backend
    calculations.ts       # Cálculos de economia
  /types
    report.ts             # Types do relatório
```

---

## 7. Referências Visuais

- **Nuvemshop Next:** https://www.nuvemshop.com.br/next
- **Nuvemshop Next Migração:** https://www.nuvemshop.com.br/next/migracao
- **Nimbus Design System:** https://nimbus.nuvemshop.com.br/
- **Nimbus GitHub:** https://github.com/TiendaNube/nimbus-design-system
- **Nimbus Storybook (componentes interativos):** acessível via repositório
- **Google Font:** https://fonts.google.com/specimen/Plus+Jakarta+Sans
