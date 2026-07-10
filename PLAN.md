# ROCCMACH — Plan de construcción (modo Lexus)

> De la home aprobada → producto real → **beta deployable** para presentar al cliente.
> Filosofía: **local-first**, cada fase deja algo funcionando y demostrable. Nada de big-bang.

---

## 0. Decisiones de arquitectura (bloqueadas)

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | SSR/SEO, route handlers para pagos/webhooks, mismo stack que faind |
| Estilos | **Tailwind v4 + tokens** (port del CSS actual) | Mantener el look rojo/negro; velocidad y consistencia |
| CMS | **Sanity** (Studio embebido en `/studio`) | Editor visual, media library para hero, gratis, cliente autosuficiente |
| Pago < $50k | **Mercado Pago** (Checkout Pro, sandbox → prod) | Estándar MX: tarjetas, OXXO, SPEI, MSI |
| Cotización ≥ $50k | **UI mágica → WhatsApp + lead en Sanity** | Lo que ya diseñamos; el cliente ve los leads en Studio |
| Deploy | **Vercel** (preview = beta del cliente) | Link compartible por WhatsApp |
| Regla de negocio | `PRICE_THRESHOLD = 50000` centralizado | El precio en Sanity decide solo: checkout vs cotizar |

---

## Estructura de carpetas objetivo

```
roccar/
├── app/
│   ├── (site)/
│   │   ├── layout.tsx           # nav + footer + WhatsApp FAB
│   │   ├── page.tsx             # HOME (port de index.html)
│   │   ├── nosotros/page.tsx
│   │   ├── catalogo/page.tsx    # grid + filtros (lee Sanity)
│   │   ├── catalogo/[slug]/page.tsx   # detalle de equipo
│   │   └── contacto/page.tsx
│   ├── studio/[[...tool]]/page.tsx    # Sanity Studio
│   └── api/
│       ├── mercadopago/preference/route.ts
│       ├── mercadopago/webhook/route.ts
│       └── lead/route.ts        # guarda cotización
├── components/   # Hero, ServicesStack, Categories, CatalogGrid, ProductCard, QuoteModal, Footer...
├── sanity/       # schemas + client + queries (GROQ)
├── lib/          # config (threshold), mercadopago, format, utils
└── styles/globals.css   # tokens (--red, fuentes, etc.)
```

### Variables de entorno
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
MP_ACCESS_TOKEN=            # sandbox primero
NEXT_PUBLIC_MP_PUBLIC_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=523300000000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Roadmap por fases

### FASE 0 — Setup local · *(medio día)*
- `create-next-app` (TS, App Router) + Tailwind v4.
- Portar tokens del `index.html` a `globals.css` (colores, fuentes Saira Condensed + Inter).
- `npm run dev` corriendo en `localhost:3000`.
- **Cliente ve:** nada aún (cimientos).

### FASE 1 — Home en Next + componentes · *(1–1.5 días)*
- Romper la home actual en componentes React (Hero, marquee, ServicesStack sticky, Categories, CatalogGrid, MagicBanner, Footer, QuoteModal, WhatsAppFab).
- Data **mock** todavía (array local).
- Páginas shell: Nosotros, Catálogo, Contacto (mismo lenguaje visual).
- **Cliente ve:** la home que ya aprobó, ahora navegable entre páginas. ✅ *Primer demo serio.*

### FASE 2 — Sanity (CMS) · *(1 día)*
- Schemas: `product`, `category`, `brand`, `heroSlide`, `siteSettings`, `lead`.
- Studio embebido en `/studio` (el cliente edita ahí).
- Seed con 15–20 equipos reales + categorías + datos de contacto.
- Conectar front a Sanity con GROQ (catálogo y hero dejan de ser mock).
- **Cliente ve:** entra a `/studio`, cambia un precio o sube una foto de hero → la web cambia sola. *Momento "wow" de autonomía.*

### FASE 3 — Catálogo + lógica de negocio · *(1 día)*
- `/catalogo`: grid desde Sanity, filtros por categoría, búsqueda.
- `/catalogo/[slug]`: ficha del equipo (specs, galería, marca).
- Regla centralizada: `price < 50000` → card "Compra en línea"; `≥ 50000` → "Cotizar".
- **Cliente ve:** catálogo completo real, con la regla de los $50k funcionando.

### FASE 4 — Cotización UI mágica · *(medio día)*
- Modal multi-paso → arma mensaje y abre WhatsApp.
- Además **guarda el lead en Sanity** (`/api/lead`).
- **Cliente ve:** cotiza un montacargas y le llega a WhatsApp + aparece el lead en Studio.

### FASE 5 — Checkout Mercado Pago (sandbox) · *(1–1.5 días)*
- Carrito ligero para equipos < $50k + refacciones.
- `/api/mercadopago/preference` crea la preferencia; redirect a Checkout Pro.
- `/api/mercadopago/webhook` actualiza estado del pedido (guardado en Sanity).
- Tarjetas de prueba en sandbox.
- **Cliente ve:** compra de prueba de un patín de $18,900 con tarjeta sandbox, de punta a punta.

### FASE 6 — Pulido beta · *(1 día)*
- Responsive fino (375 / 768 / 1024 / 1440), animaciones, micro-interacciones.
- SEO local (title/desc, OpenGraph, sitemap, JSON-LD de productos), favicon, og-image.
- Performance (next/image, lazy, fuentes, Lighthouse ≥ 90).
- Accesibilidad (focus, alt, contraste) y `prefers-reduced-motion`.
- Contenido real (copy, fotos, teléfonos, redes).

### FASE 7 — Deploy beta a Vercel · *(medio día)*
- Vercel preview + Sanity hosted + MP sandbox.
- Variables de entorno en Vercel.
- **Entregable: link `roccmach.vercel.app` para el cliente.** ⭐ *Esto es lo que le presumes.*

### FASE 8 — Producción *(post-aprobación)*
- Dominio propio, credenciales MP de producción, analítica (GA4/Vercel), correos transaccionales, respaldo.

---

## Definición de "BETA" (lo que verá el cliente)
- [ ] Sitio multipágina con el diseño aprobado, responsive.
- [ ] Catálogo real cargado desde Sanity (él lo edita solo).
- [ ] Hero e imágenes gestionables desde `/studio`.
- [ ] Regla < $50k (checkout) vs ≥ $50k (cotización) funcionando.
- [ ] Cotización → WhatsApp + lead guardado.
- [ ] Checkout Mercado Pago en sandbox de punta a punta.
- [ ] Desplegado en Vercel con link compartible.

## Estimado total
**~7–9 días de desarrollo** hasta beta deployable (ritmo con Claude). Cada fase es un demo independiente.

## Orden de pago/valor para cobrarle al cliente (referencia)
1. Diseño + home (ya hecho) — base
2. Multipágina + CMS (autonomía) — alto valor percibido
3. Catálogo + regla $50k — core del negocio
4. Cotización mágica — diferenciador
5. Checkout MP — e-commerce real
6. SEO + deploy — lanzamiento
