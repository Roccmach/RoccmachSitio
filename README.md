# ROCCMACH — Sitio web + tienda en línea

Sitio de maquinaria industrial (montacargas, grúas, patines, plataformas) con catálogo dinámico, compra en línea y compra asistida, construido y entregado por **Fold**.

Producción: **https://roccmach.vercel.app**

---

## 1. Qué incluye este proyecto

- **Landing pages**: Inicio, Nosotros, Contacto.
- **Catálogo** (`/catalogo`): filtros por categoría, precio y capacidad de carga con sliders y buscador, todo alimentado desde el CMS (Sanity), sin tocar código para dar de alta equipo nuevo.
- **Compra en línea** (equipos con precio < $50,000 MXN): checkout con **Mercado Pago**.
- **Compra asistida** (equipos ≥ $50,000 MXN, o sin precio público): formulario de datos → se genera un pedido con folio → el equipo de ventas de ROCCMACH da seguimiento por WhatsApp/teléfono.
- **Seguimiento de pedido** (`/seguimiento/[folio]`): página pública donde el cliente ve el estatus de su compra, con descarga de comprobante en PDF.
- **Panel de contenido (Sanity Studio)**: dar de alta/editar equipos, categorías, banners de inicio, y configuración general del sitio sin necesitar a un programador.
- **SEO técnico**: datos estructurados (JSON-LD), metadatos por página, sitemap.

## 2. Cómo se administra el catálogo (día a día)

El catálogo **no vive en el código** — vive en Sanity, un CMS. Cualquier persona de ROCCMACH puede:

1. Entrar al Studio de Sanity con su cuenta.
2. Dar de alta un equipo nuevo (marca, modelo, categoría, precio, specs, fotos).
3. El sitio se actualiza solo — no requiere redeploy ni tocar código.

La regla de negocio "menor a $50,000 = compra en línea, mayor o igual = compra asistida" vive en un único lugar del código (`lib/config.ts`, constante `PRICE_THRESHOLD`) para que nunca quede desincronizada entre catálogo, checkout y textos del sitio.

## 3. Stack técnico (para cualquier desarrollador que le siga)

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Estilos | CSS puro (sin Tailwind/UI kit) — sistema de diseño propio en `app/globals.css` |
| Contenido | Sanity CMS (`sanity/`) — esquemas en `sanity/schemaTypes/` |
| Pagos | Mercado Pago Checkout Pro (`app/api/mercadopago/`) |
| Emails / notificaciones | Resend (`lib/email.ts`) |
| PDFs de pedido | `@react-pdf/renderer` (`lib/pdf/`) |
| Hosting / CI | Vercel, deploy automático al hacer push a `main` |

### Estructura de carpetas

```
app/(site)/          páginas públicas (Inicio, Catálogo, Nosotros, Contacto, Checkout, Seguimiento)
app/api/              endpoints: leads, Mercado Pago (preferencia + webhook), notificaciones, pedidos, PDF
components/site/      componentes de UI (Nav, catálogo, modal de compra, etc.)
lib/                  reglas de negocio, integración con Sanity/MP/Resend, config de marca
sanity/schemaTypes/   modelos de contenido (equipo, categoría, pedido, lead, banner, configuración)
scripts/              scripts de carga inicial de catálogo (seed)
```

### Variables de entorno (Vercel → Project Settings → Environment Variables)

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` | conexión al CMS |
| `SANITY_WRITE_TOKEN` | permite al sitio crear pedidos/leads en Sanity |
| `MP_ACCESS_TOKEN`, `NEXT_PUBLIC_MP_PUBLIC_KEY` | Mercado Pago |
| `RESEND_API_KEY` | envío de correos (confirmación de pedido) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | número de WhatsApp de ventas |
| `NEXT_PUBLIC_SITE_URL` | dominio público (el sitio ya tiene un respaldo automático a la URL de Vercel si esta variable falta o queda mal puesta) |

### Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Necesitas un `.env.local` con las variables de arriba (pide una copia a Fold).

### Deploy

Cada `git push` a `main` dispara un deploy automático en Vercel. No hay pasos manuales adicionales.

---

Desarrollado por **Fold**.
