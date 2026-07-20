import { getBannerHome } from "@/lib/bannerHome";

export default async function HomeBanner() {
  const banner = await getBannerHome();
  if (!banner) return null;

  let host = "sitio externo";
  try {
    host = new URL(banner.url).hostname.replace(/^www\./, "");
  } catch {}

  return (
    <section className="block home-banner">
      <div className="wrap">
        <a
          className="hb-link reveal"
          href={banner.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={`Ir a ${host}`}
        >
          <picture>
            <source media="(max-width: 760px)" srcSet={banner.mobileUrl} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={banner.desktopUrl} alt="" loading="lazy" />
          </picture>
          <span className="hb-shine" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
