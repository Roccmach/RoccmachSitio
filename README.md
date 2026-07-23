# ROCCMACH — Sitio web + tienda en línea

Sitio de maquinaria industrial (montacargas, grúas, patines, plataformas) con catálogo dinámico, compra en línea y compra asistida, construido y entregado por **Fold**.

Producción: **https://roccmach.vercel.app**

---

1. [Qué incluye este proyecto](#1-qué-incluye-este-proyecto)
2. [Cómo se administra el catálogo](#2-cómo-se-administra-el-catálogo-día-a-día)
3. [Stack técnico](#3-stack-técnico-para-cualquier-desarrollador-que-le-siga)
4. [Variables de entorno](#4-variables-de-entorno)
5. [Correr en local](#5-correr-en-local)
6. [Deploy](#6-deploy)

---

## 1. Qué incluye este proyecto

- **Landing pages**: Inicio, Nosotros, Contacto.
- **Catálogo** (`/catalogo`): filtros por categoría, precio y capacidad de carga con sliders y buscador, todo alimentado desde el CMS (Sanity), sin tocar código para dar de alta equipo nuevo.
- **Compra en línea** (equipos con precio < $50,000 MXN): checkout con **Mercado Pago**.
- **Compra asistida** (equipos ≥ $50,000 MXN, o sin precio público): formulario de datos → se genera un pedido con folio → el equipo de ventas de ROCCMACH da seguimiento por WhatsApp/teléfono.
- **Seguimiento de pedido** (`/seguimiento`, buscando por número de pedido, o `/seguimiento/[token]` con el link único que llega por correo): página pública donde el cliente ve el estatus de su compra, con descarga de comprobante en PDF.
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

## 4. Variables de entorno

Todas las claves del proyecto viven en variables de entorno — **nunca hardcodeadas en el código**. Hay dos lugares donde se configuran, y deben tener los mismos valores en ambos:

- **Local** (tu máquina, para desarrollar): archivo `.env.local` en la raíz del proyecto (no se sube a git).
- **Producción** (el sitio real): Vercel → proyecto `roccmach` → **Settings → Environment Variables**.

Para empezar en local:

```bash
cp .env.example .env.local
```

Y llena `.env.local` con los valores reales (el archivo trae comentarios explicando de dónde sacar cada uno). `.env.example` es la plantilla sin valores — ese sí vive en git, a propósito, como referencia.

> **Importante:** en Vercel, si agregas o cambias una variable, **no se aplica sola** a lo que ya está desplegado — hace falta un redeploy (Deployments → el más reciente → menú `⋯` → **Redeploy**, o simplemente un nuevo `git push`). Es el error más común al configurar una clave nueva: se guarda bien pero parece que "no jaló" porque falta ese paso.

### Tabla completa

| Variable | Obligatoria | De dónde se saca | Si falta |
|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sí | manage.sanity.io → proyecto → Settings → API | El sitio no puede leer contenido — cae a datos vacíos, no truena |
| `NEXT_PUBLIC_SANITY_DATASET` | Sí | Normalmente `production` | Igual que arriba |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sí | Fecha fija, ya viene en `.env.example` | Igual que arriba |
| `SANITY_WRITE_TOKEN` | Sí | manage.sanity.io → API → Tokens → **Add API token**, permiso **Editor** | El sitio no puede crear pedidos ni leads (checkout y formularios dejan de guardar) |
| `SANITY_WEBHOOK_SECRET` | Sí | Lo generas tú (un string random y largo) — debe coincidir con el `?secret=...` del webhook en manage.sanity.io → API → Webhooks | `/api/notify` rechaza todo con 401 (a propósito — nunca debe quedar sin este valor) y no se mandan los correos de cambio de estatus |
| `MP_ACCESS_TOKEN` | Sí, para vender en línea | mercadopago.com.mx/developers/panel/app → Credenciales. `TEST-...` = sandbox, `APP_USR-...` = producción real | La compra en línea cae a WhatsApp en vez de checkout |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | Sí, junto con la anterior | Mismo panel de Mercado Pago | Igual que arriba |
| `RESEND_API_KEY` | Sí, para mandar correos | resend.com → API Keys → Create | Los correos se omiten silenciosamente, nada se rompe |
| `RESEND_FROM` | No (tiene default) | Requiere verificar un dominio propio primero en resend.com → Domains | Los correos salen desde una dirección de pruebas compartida de Resend |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Sí | Número de ventas, formato `52...` sin signos | Los botones de WhatsApp quedan sin número |
| `NEXT_PUBLIC_SITE_URL` | Sí en producción | El dominio real del sitio, sin `/` al final | Afecta links en correos, regreso de pago de Mercado Pago, sitemap y SEO — en local puede quedar en `localhost` |

## 5. Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 6. Deploy

Cada `git push` a `main` dispara un deploy automático en Vercel — no hay pasos manuales adicionales, salvo el redeploy mencionado arriba cuando cambian variables de entorno.

---

Desarrollado por **Fold**.
