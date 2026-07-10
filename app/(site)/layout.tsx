import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import WhatsAppFab from "@/components/site/WhatsAppFab";
import QuoteModal from "@/components/site/QuoteModal";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
      <WhatsAppFab />
      <QuoteModal />
    </>
  );
}
