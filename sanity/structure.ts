import type { StructureResolver } from "sanity/structure";
import {
  TrolleyIcon,
  CreditCardIcon,
  BasketIcon,
  EarthAmericasIcon,
  MarkerIcon,
  InboxIcon,
  PackageIcon,
  TagsIcon,
  TargetIcon,
  BillIcon,
  ImagesIcon,
  StarIcon,
  ImageIcon,
  DocumentTextIcon,
  CogIcon,
} from "@sanity/icons";

/**
 * Acomodo del admin en grupos que sí hacen sentido para el negocio, en vez del
 * listado plano por default (que mezclaba pedidos, catálogo, contenido de
 * marketing y configuración sin ningún orden).
 *
 * "Pedidos y cotizaciones" es el grupo operativo — lo que ventas revisa todo
 * el día — separado en 4 listas filtradas: MercadoPago y +$50k son ambos el
 * mismo tipo "order" (se distinguen por el campo `kind`), así que se filtran
 * aquí en vez de vivir como un solo listado mezclado.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("ROCCMACH")
    .items([
      S.listItem()
        .title("Pedidos y cotizaciones")
        .icon(TrolleyIcon)
        .child(
          S.list()
            .title("Pedidos y cotizaciones")
            .items([
              S.listItem()
                .title("Pedidos MercadoPago")
                .icon(CreditCardIcon)
                .child(
                  S.documentList()
                    .title("Pedidos MercadoPago")
                    .schemaType("order")
                    .filter('_type == "order" && kind == "mercadopago"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }])
                ),
              S.listItem()
                .title("Pedidos +$50k")
                .icon(BasketIcon)
                .child(
                  S.documentList()
                    .title("Pedidos +$50k")
                    .schemaType("order")
                    .filter('_type == "order" && kind == "asistido"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }])
                ),
              S.listItem()
                .title("Cotizaciones de flete")
                .icon(EarthAmericasIcon)
                .child(S.documentTypeList("freightQuote").title("Cotizaciones de flete")),
              S.listItem()
                .title("Cotizaciones de rutas fijas")
                .icon(MarkerIcon)
                .child(S.documentTypeList("freightRouteQuote").title("Cotizaciones de rutas fijas")),
              S.listItem()
                .title("Leads")
                .icon(InboxIcon)
                .child(S.documentTypeList("lead").title("Leads")),
            ])
        ),

      S.divider(),

      S.listItem()
        .title("Catálogo")
        .icon(PackageIcon)
        .child(
          S.list()
            .title("Catálogo")
            .items([
              S.documentTypeListItem("product").title("Productos").icon(PackageIcon),
              S.documentTypeListItem("category").title("Categorías").icon(TagsIcon),
            ])
        ),

      S.listItem()
        .title("Flete — configuración")
        .icon(TargetIcon)
        .child(
          S.list()
            .title("Flete — configuración")
            .items([
              S.documentTypeListItem("freightRoute").title("Rutas fijas").icon(MarkerIcon),
              S.listItem()
                .title("Precios por km")
                .icon(BillIcon)
                .child(S.document().schemaType("freightSettings").documentId("freightSettings")),
            ])
        ),

      S.listItem()
        .title("Contenido del sitio")
        .icon(ImagesIcon)
        .child(
          S.list()
            .title("Contenido del sitio")
            .items([
              S.documentTypeListItem("heroSlide").title("Imágenes del Hero").icon(ImagesIcon),
              S.documentTypeListItem("testimonial").title("Testimonios").icon(StarIcon),
              S.listItem()
                .title("Banner Home")
                .icon(ImageIcon)
                .child(S.document().schemaType("bannerHome").documentId("bannerHome")),
              S.documentTypeListItem("legalPage").title("Páginas legales").icon(DocumentTextIcon),
            ])
        ),

      S.divider(),

      S.listItem()
        .title("Configuración del sitio")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
