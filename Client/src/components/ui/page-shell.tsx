import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageShellProps {
    kicker?: string;
    title: string;
    description?: string;
    actions?: React.ReactNode;
    children?: React.ReactNode;
}

/** Page frame: a header block followed by stacked sections. */
export function PageShell({ kicker, title, description, actions, children }: PageShellProps) {
    return (
        <div className="min-h-screen px-4 pb-16 pt-28 md:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="rounded border border-rule bg-surface p-6 md:p-8 lg:p-10">
                    {kicker ? <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft">{kicker}</p> : null}
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-4xl">
                            <h1 className="font-display text-4xl uppercase leading-none tracking-wide md:text-5xl xl:text-6xl">
                                {title}
                            </h1>
                            {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-soft md:text-base">{description}</p> : null}
                        </div>
                        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
                    </div>
                </header>
                {children}
            </div>
        </div>
    );
}

interface SectionProps {
    kicker?: string;
    title?: string;
    description?: string;
    className?: string;
    children?: React.ReactNode;
}

export function Section({ kicker, title, description, className, children }: SectionProps) {
    return (
        <section className={cn("rounded border border-rule bg-surface p-6 md:p-8", className)}>
            {kicker ? <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft">{kicker}</p> : null}
            {title ? <h2 className="font-display text-2xl uppercase tracking-wide md:text-3xl">{title}</h2> : null}
            {description ? <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-soft md:text-base">{description}</p> : null}
            <div className={title || description ? "mt-6" : ""}>{children}</div>
        </section>
    );
}

interface StatProps {
    label: string;
    value: React.ReactNode;
    detail?: string;
}

/** A single figure. Values render in the data face with tabular figures. */
export function Stat({ label, value, detail }: StatProps) {
    return (
        <article className="rounded border border-rule bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{label}</p>
            <strong className="mt-3 block font-data text-3xl tabular-nums text-ink">{value}</strong>
            {detail ? <p className="mt-3 text-sm leading-6 text-ink-soft">{detail}</p> : null}
        </article>
    );
}

interface DashboardShellProps {
    title: string;
    description?: string;
    links: { href: string; label: string }[];
    children?: React.ReactNode;
}

export function DashboardShell({ title, description, links, children }: DashboardShellProps) {
    return (
        <div className="grid gap-6 md:gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded border border-rule bg-surface p-6 md:p-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft">Operational Dashboard</p>
                <h2 className="font-display text-2xl uppercase tracking-wide">{title}</h2>
                {description ? <p className="mt-3 text-sm leading-7 text-ink-soft">{description}</p> : null}
                <nav className="mt-6 flex flex-col gap-3">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className="rounded border border-rule bg-surface px-4 py-3 text-sm font-semibold text-ink transition hover:bg-surface-sunk"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <section className="space-y-6">{children}</section>
        </div>
    );
}
