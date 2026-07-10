import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { TrackedOrder } from "@/lib/products";
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
  statusPill: { marginTop: 4, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#fff", backgroundColor: INK, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, alignSelf: "flex-start" },
  tableHead: { flexDirection: "row", borderBottomWidth: 2, borderBottomColor: INK, paddingBottom: 6, marginTop: 34 },
  th: { fontSize: 8, fontFamily: "Helvetica-Bold", color: GRAY, letterSpacing: 1, textTransform: "uppercase" },
  tr: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E4E4E6" },
  cItem: { width: "60%" },
  cQty: { width: "15%", textAlign: "center" },
  cPrice: { width: "25%", textAlign: "right" },
  itemName: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 18 },
  totalBox: { width: "40%", flexDirection: "row", justifyContent: "space-between", borderTopWidth: 2, borderTopColor: INK, paddingTop: 10 },
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

export function OrderPdf({ order }: { order: TrackedOrder }) {
  return (
    <Document title={`Comprobante ${order.orderNumber}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.logo}>ROCC<Text style={s.logoRed}>MACH</Text></Text>
            <Text style={s.logoSub}>MAQUINARIA INDUSTRIAL</Text>
          </View>
          <View>
            <Text style={s.docTag}>COMPROBANTE</Text>
            <Text style={s.docTag}>DE PEDIDO</Text>
          </View>
        </View>
        <View style={s.redBar} />

        <View style={s.body}>
          <View style={s.row}>
            <View style={s.metaBox}>
              <Text style={s.metaLabel}>Número de pedido</Text>
              <Text style={s.orderNum}>{order.orderNumber}</Text>
              <Text style={s.statusPill}>{order.status}</Text>
            </View>
            <View style={[s.metaBox, { alignItems: "flex-end" }]}>
              <Text style={s.metaLabel}>Fecha</Text>
              <Text style={s.metaValue}>{fecha(order.createdAt)}</Text>
              {order.customerName ? (
                <>
                  <Text style={[s.metaLabel, { marginTop: 10 }]}>Cliente</Text>
                  <Text style={s.metaValue}>{order.customerName}</Text>
                </>
              ) : null}
            </View>
          </View>

          <View style={s.tableHead}>
            <Text style={[s.th, s.cItem]}>Equipo</Text>
            <Text style={[s.th, s.cQty]}>Cant.</Text>
            <Text style={[s.th, s.cPrice]}>Importe</Text>
          </View>
          {(order.items ?? []).map((it, i) => (
            <View style={s.tr} key={i}>
              <View style={s.cItem}><Text style={s.itemName}>{it.title}</Text></View>
              <Text style={s.cQty}>{it.qty}</Text>
              <Text style={s.cPrice}>{money(it.price * it.qty)}</Text>
            </View>
          ))}

          <View style={s.totalRow}>
            <View style={s.totalBox}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalValue}>{money(order.total)}</Text>
            </View>
          </View>

          <Text style={s.note}>
            Este comprobante confirma tu pedido con ROCCMACH Maquinaria Industrial. Conserva tu número de
            pedido para dar seguimiento a la entrega. Precios en pesos mexicanos, IVA incluido.
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
