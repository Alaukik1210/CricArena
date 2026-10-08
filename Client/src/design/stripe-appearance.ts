/**
 * Literal Maidan values for Stripe Elements.
 *
 * Elements renders in a cross-origin iframe and cannot resolve CSS custom
 * properties from this document, so these cannot be var(--ink) etc.
 * They live here, in the design layer, so the values stay in one place and
 * Layer 3 still never writes a colour. Keep in sync with design/tokens.css.
 */
export const stripeCardStyle = {
    base: {
        color: "#2B2520", // --ink
        fontFamily: '"Inter Tight", system-ui, sans-serif', // --font-body
        fontSize: "16px",
        "::placeholder": {
            color: "#A79D90", // --ink-faint
        },
    },
    invalid: {
        color: "#A32A1F", // --urgent
        iconColor: "#A32A1F",
    },
} as const;
