import { Link } from "react-router-dom";

export function ProductShell({ kicker, title, description, actions, children }) {
  return (
    <div className="product-page">
      <div className="product-shell">
        <section className="product-hero">
          {kicker ? <p className="section-kicker">{kicker}</p> : null}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <h1 className="display-title">{title}</h1>
              {description ? <p className="section-copy">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </section>
        {children}
      </div>
    </div>
  );
}

export function SectionBlock({ kicker, title, description, children, className = "" }) {
  return (
    <section className={`product-panel p-6 md:p-8 ${className}`}>
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      {title ? <h2 className="section-title">{title}</h2> : null}
      {description ? <p className="section-copy">{description}</p> : null}
      <div className={title || description ? "mt-6" : ""}>{children}</div>
    </section>
  );
}

export function MetricCard({ label, value, detail }) {
  return (
    <article className="stat-card">
      <p className="section-kicker mb-2">{label}</p>
      <strong className="stat-value">{value}</strong>
      {detail ? <p className="muted-copy mt-3 text-sm leading-6">{detail}</p> : null}
    </article>
  );
}

export function RoleDashboard({ title, description, links, children }) {
  return (
    <div className="product-grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="product-panel p-6 md:p-8">
        <p className="section-kicker">Operational Dashboard</p>
        <h2 className="section-title">{title}</h2>
        <p className="section-copy">{description}</p>
        <div className="mt-6 flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#d8b56d]/60 hover:text-[#f0ddb0]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </aside>
      <section className="space-y-6">{children}</section>
    </div>
  );
}
