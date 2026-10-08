/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                ground: "var(--ground)",
                // DEPRECATED - the 11 marketing components in features/marketing
                // still use these 73 times. Task 3 removed them on the incorrect
                // assumption they were unused, which silently dropped the classes
                // (Tailwind does not error on unknown utilities). Restyling the
                // marketing surface into Maidan is P1 design work, not P0a.
                // Remove these together with that redesign.
                goldy: "#b79558",
                gold: "#FFD070",
                goldx: "#363535",
                orangex: "#FFD070",
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
                scrim: "var(--scrim)",
                rule: {
                    DEFAULT: "var(--rule)",
                    soft: "var(--rule-soft)",
                },
            },
            fontFamily: {
                display: ["var(--font-display)"],
                body: ["var(--font-body)"],
                data: ["var(--font-data)"],
                // DEPRECATED - same reason as the gold* colours above.
                "product-sans": ["Product Sans", "var(--font-body)"],
                "product-sans-black": ["Product Sans Black", "var(--font-display)"],
                "product-sans-medium": ["Product Sans Medium", "var(--font-body)"],
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
                "hero-pattern": 'url("/src/assets/herobg.webp")',
                matches: 'url("/src/assets/matchbg1.webp")',
                matches1: 'url("/src/assets/matchbg2.webp")',
                matches2: 'url("/src/assets/matchbg3.webp")',
                matches3: 'url("/src/assets/matchbg4.webp")',
                ball: 'url("/src/assets/ballbg1.webp")',
                banner: 'url("/src/assets/banner1.png")',
                banner3: 'url("/src/assets/banner3.png")',
                bann: 'url("/src/assets/bann.png")',
            },
            screens: { xs: "475px" },
        },
    },
    // Live dependency: ui/popover and ui/select use animate-in / animate-out /
    // fade-* / zoom-* / slide-in-*. Tailwind emits no error for an unknown
    // utility, so removing this would silently kill their transitions.
    // Re-check with: grep -rnE "animate-in|animate-out|fade-(in|out)|zoom-(in|out)|slide-in-" src/
    plugins: [require("tailwindcss-animate")],
};
