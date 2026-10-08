/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                ground: "var(--ground)",
                surface: {
                    DEFAULT: "var(--surface)",
                    sunk: "var(--surface-sunk)",
                },
                ink: {
                    DEFAULT: "var(--ink)",
                    soft: "var(--ink-soft)",
                    faint: "var(--ink-faint)",
                },
                go: "var(--go)",
                urgent: "var(--urgent)",
                pending: "var(--pending)",
                rule: {
                    DEFAULT: "var(--rule)",
                    soft: "var(--rule-soft)",
                },
                // DEPRECATED shadcn HSL mappings — kept for ui/*.jsx primitives
                // until Task 13; removed in Task 15 with the legacy :root block.
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
            },
            fontFamily: {
                display: ["var(--font-display)"],
                body: ["var(--font-body)"],
                data: ["var(--font-data)"],
                // DEPRECATED — @apply'd by the legacy block in index.css; the
                // build fails without them. Removed in Task 15 with that block.
                "cabinet-black": ["CabinetGrotesk-Black"],
                "cabinet-extrabold": ["CabinetGrotesk-Extrabold"],
            },
            borderRadius: {
                DEFAULT: "var(--radius)",
                sm: "2px",
                md: "var(--radius)",
                lg: "var(--radius)",
            },
            // Only the nine actually referenced in src/. Verified with:
            //   grep -rhoE "bg-(hero-pattern|matches[0-9]*|ball|banner[0-9]*|bann)" src/ | sort -u
            backgroundImage: {
                "hero-pattern": 'url("/src/assets/herobg.png")',
                matches: 'url("/src/assets/matchbg1.png")',
                matches1: 'url("/src/assets/matchbg2.jpg")',
                matches2: 'url("/src/assets/matchbg3.jpg")',
                matches3: 'url("/src/assets/matchbg4.jpg")',
                ball: 'url("/src/assets/ballbg1.png")',
                banner: 'url("/src/assets/banner1.png")',
                banner3: 'url("/src/assets/banner3.png")',
                bann: 'url("/src/assets/bann.png")',
            },
            screens: { xs: "475px" },
        },
    },
    // DEPRECATED — ui/popover, ui/select, ui/tabs and ui/toast use this
    // plugin's animate-in / fade-* / zoom-* / slide-in-* utilities and remain
    // .jsx until Task 13. Removing it here silently drops those utilities
    // (Tailwind emits no error for an unknown class) and kills their
    // enter/exit transitions. Revisit in Task 15.
    plugins: [require("tailwindcss-animate")],
};
