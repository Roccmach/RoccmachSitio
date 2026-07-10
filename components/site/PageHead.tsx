import Link from "next/link";

export default function PageHead({
  eyebrow,
  title,
  subtitle,
  crumb,
  image,
  compact,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  crumb?: { label: string; href: string }[];
  image?: string;
  compact?: boolean;
}) {
  return (
    <header className={`page-head${image ? " page-head-photo" : ""}${compact ? " page-head-compact" : ""}`}>
      <div className="hero-bg"><div className="blade" /><div className="grid-lines" /></div>
      {image && (
        <div className="page-head-bg" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
      )}
      <div className="inner">
        {crumb && (
          <div className="crumb">
            {crumb.map((c, i) => (
              <span key={c.href}>
                {i > 0 && " / "}
                <Link href={c.href}>{c.label}</Link>
              </span>
            ))}
          </div>
        )}
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="display">{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
}
