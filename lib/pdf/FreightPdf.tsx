import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { TrackedFreightQuote } from "@/lib/freight";
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
  section: { marginTop: 26 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: GRAY, letterSpacing: 1.5, textTransform: "uppercase", borderBottomWidth: 2, borderBottomColor: INK, paddingBottom: 6, marginBottom: 10 },
  addrRow: { flexDirection: "row", gap: 30 },
  addrBox: { width: "48%" },
  addrLabel: { fontSize: 8, color: GRAY, marginBottom: 2 },
  addrValue: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  detailGrid: { flexDirection: "row", flexWrap: "wrap" },
  detailItem: { width: "50%", marginBottom: 12 },
  detailLabel: { fontSize: 8, color: GRAY, marginBottom: 2 },
  detailValue: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 18 },
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
const addr = (a: { ciudad: string; cp: string }) => `${a.ciudad}, CP ${a.cp}`;

export function FreightPdf({ quote }: { quote: TrackedFreightQuote }) {
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
            <Text style={s.sectionTitle}>Ruta</Text>
            <View style={s.addrRow}>
              <View style={s.addrBox}>
                <Text style={s.addrLabel}>Origen</Text>
                <Text style={s.addrValue}>{addr(quote.origen)}</Text>
              </View>
              <View style={s.addrBox}>
                <Text style={s.addrLabel}>Destino</Text>
                <Text style={s.addrValue}>{addr(quote.destino)}</Text>
              </View>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Detalle de la carga</Text>
            <View style={s.detailGrid}>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Tipo de caja</Text>
                <Text style={s.detailValue}>{quote.tipoCaja || "—"}</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Tipo de carga</Text>
                <Text style={s.detailValue}>{quote.tipoCarga || "—"}</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Empaque</Text>
                <Text style={s.detailValue}>{quote.empaque || "—"}</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Peso neto</Text>
                <Text style={s.detailValue}>{quote.pesoNeto ? `${quote.pesoNeto} kg` : "—"}</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Peso bruto</Text>
                <Text style={s.detailValue}>{quote.pesoBruto ? `${quote.pesoBruto} kg` : "—"}</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Horario de carga</Text>
                <Text style={s.detailValue}>{quote.horarioCarga || "—"}</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Horario de descarga</Text>
                <Text style={s.detailValue}>{quote.horarioDescarga || "—"}</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Distancia calculada</Text>
                <Text style={s.detailValue}>{quote.distanceKm} km</Text>
              </View>
              <View style={s.detailItem}>
                <Text style={s.detailLabel}>Precio por km</Text>
                <Text style={s.detailValue}>{money(quote.pricePerKmUsed)}</Text>
              </View>
            </View>
          </View>

          <View style={s.totalRow}>
            <View style={s.totalBox}>
              <Text style={s.totalLabel}>Total estimado</Text>
              <Text style={s.totalValue}>{money(quote.total)}</Text>
            </View>
          </View>

          <Text style={s.note}>
            Esta cotización es un estimado calculado a partir de la distancia por carretera entre origen y
            destino. El precio final puede variar según condiciones de acceso, tiempos de espera y
            disponibilidad. Nuestro equipo te contactará para confirmar los detalles. La información y los
            precios de este documento pueden cambiar sin previo aviso.
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
