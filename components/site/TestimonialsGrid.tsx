import { getTestimonials } from "@/lib/testimonials";

export default async function TestimonialsGrid() {
  const testimonials = await getTestimonials();
  if (!testimonials.length) return null;

  return (
    <section className="block testimonials" id="testimonios">
      <div className="wrap">
        <div className="sec-head reveal">
          <div className="eyebrow">Clientes reales</div>
          <h2 className="display">Lo que dicen<br />de nosotros.</h2>
        </div>

        <div className="tm-grid">
          {testimonials.map((t, i) => (
            <figure className="tm-card reveal" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.imageUrl} alt={t.name} loading="lazy" />
              <div className="tm-scrim" />
              <figcaption>
                <p>&ldquo;{t.feedback}&rdquo;</p>
                <b>{t.name}</b>
                {t.company && <span>{t.company}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
