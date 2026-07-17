import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { TrackedFreightRouteQuote } from "@/lib/freightRoutes";
import { BRAND } from "@/lib/config";

const RED = "#E4151F";
const INK = "#0B0B0C";
const GRAY = "#6B7178";

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: INK, paddingBottom: 60 },
  header: { backgroundColor: INK, paddingVertical: 26, paddingHorizontal: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 26, fontFamily: "Helvetica-BoldOblique", color: "#fff" },
  logoRed: { color: RED },
  logoSub: { fontSize: 7, color: "#8A9099", letterSpacing: 3, marginTop: 3 },
  docTag: { color: "#fff", fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 2, textAlign: "right" },
  redBar: { height: 5, backgroundColor: RED },
  body: { paddingHorizontal: 40, paddingTop: 28 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  metaBox: { width: "48%" },
  metaLabel: { fontSize: 7, color: GRAY, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 },
  metaValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: INK },
  orderNum: { fontSize: 20, fontFamily: "Helvetica-Bold", color: RED },
  section: { marginTop: 30 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: GRAY, letterSpacing: 1.5, textTransform: "uppercase", borderBottomWidth: 2, borderBottomColor: INK, paddingBottom: 6, marginBottom: 14 },
  detailGrid: { flexDirection: "row", flexWrap: "wrap" },
  detailItem: { width: "50%", marginBottom: 14 },
  detailLabel: { fontSize: 8, color: GRAY, marginBottom: 2 },
  detailValue: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20 },
  totalBox: { width: "50%", flexDirection: "row", justifyContent: "space-between", borderTopWidth: 2, borderTopColor: INK, paddingTop: 10 },
  totalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  totalValue: { fontSize: 16, fontFamily: "Helvetica-Bold", color: RED },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 40, paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#E4E4E6", flexDirection: "row", justifyContent: "space-between" },
  footText: { fontSize: 8, color: GRAY },
  note: { marginTop: 30, fontSize: 9, color: GRAY, lineHeight: 1.5 },
});

const money = (n?: number) => "$" + (n ?? 0).toLocaleString("es-MX") + " MXN";
const fecha = (iso?: string) => {
  try { return iso ? new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" }) : "—"; }
  catch { return "—"; }
};

export function FreightRoutePdf({ quote }: { quote: TrackedFreightRouteQuote }) {
  return (
    <Document title={`Cotización de flete ${quote.folio}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.logo}>ROCC<Text style={s.logoRed}>MACH</Text></Text>
            <Text style={s.logoSub}>MAQUINARIA INDUSTRIAL</Text>
          </View>
          <View>
            <Text style={s.docTag}>COTIZACIÓN</Text>
            <Text style={s.docTag}>DE FLETE</Text>
          </View>
        </View>
        <View style={s.redBar} />

        <View style={s.body}>
          <View style={s.row}>
            <View style={s.metaBox}>
              <Text style={s.metaLabel}>Folio</Text>
              <Text style={s.orderNum}>{quote.folio}</Text>
            </View>
            <View style={[s.metaBox, { alignItems: "flex-end" }]}>
              <Text style={s.metaLabel}>Fecha</Text>
              <Text style={s.metaValue}>{fecha(quote.createdAt)}</Text>
              {quote.customerName ? (
                <>
                  <Text style={[s.metaLabel, { marginTop: 10 }]}>Cliente</Text>
                  <Text style={s.metaValue}>{quote.customerName}{quote.company ? ` · ${quote.company}` : ""}</Text>
                </>
              ) : null}
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Ruta cotizada</Text>
            <View style={s.detailGrid}>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Origen</Text>
                <Text style={s.detailValue}>Guadalajara, Jalisco</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Destino</Text>
                <Text style={s.detailValue}>{quote.destino}</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Tipo de caja</Text>
                <Text style={s.detailValue}>{quote.tipoCaja}</Text>
              </View>
            </View>
          </View>

          <View style={s.totalRow}>
            <View style={s.totalBox}>
              <Text style={s.totalLabel}>Precio pactado</Text>
              <Text style={s.totalValue}>{money(quote.total)}</Text>
            </View>
          </View>

          <Text style={s.note}>
            Precio de flete pactado para la ruta Guadalajara → {quote.destino} en unidad tipo {quote.tipoCaja}.
            Nuestro equipo te contactará para coordinar fecha, horarios y condiciones de carga.
          </Text>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footText}>ROCCMACH · {BRAND.city}</Text>
          <Text style={s.footText}>{BRAND.email} · WhatsApp +{BRAND.whatsapp}</Text>
        </View>
      </Page>
    </Document>
  );
}
