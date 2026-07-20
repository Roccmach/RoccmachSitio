import Hero from "@/components/site/Hero";
import BrandMarquee from "@/components/site/BrandMarquee";
import Services from "@/components/site/Services";
import Categories from "@/components/site/Categories";
import FeaturedProducts from "@/components/site/FeaturedProducts";
import TestimonialsGrid from "@/components/site/TestimonialsGrid";
import HomeBanner from "@/components/site/HomeBanner";
import MagicBanner from "@/components/site/MagicBanner";
import ScrollReveals from "@/components/site/ScrollReveals";
import ScrollParallax from "@/components/site/ScrollParallax";

export const revalidate = 60;

export default function Home() {
  return (
    <main>
      <ScrollReveals />
      <ScrollParallax />
      <Hero />
      <BrandMarquee />
      <Services />
      <Categories />
      <FeaturedProducts />
      <TestimonialsGrid />
      <HomeBanner />
      <MagicBanner />
    </main>
  );
}
