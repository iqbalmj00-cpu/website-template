/** @type {import('tailwindcss').Config} */
const brandWithAlpha = ({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue === undefined) return "rgb(var(--brand-rgb, 249, 115, 22))";
    return `rgba(var(--brand-rgb, 249, 115, 22), ${opacityValue})`;
};

module.exports = {
    content: [
        "./app/**/*.js",
        "./app/**/*.ts",
        "./app/**/*.jsx",
        "./app/**/*.tsx",
        "./app/**/*.mdx",
        "./components/**/*.js",
        "./components/**/*.ts",
        "./components/**/*.jsx",
        "./components/**/*.tsx",
        "./components/**/*.mdx",
        "./lib/**/*.js",
        "./lib/**/*.ts",
        "./lib/**/*.jsx",
        "./lib/**/*.tsx",
        "./lib/**/*.mdx",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--body-font)", "system-ui", "sans-serif"],
                display: ["var(--heading-font)", "system-ui", "sans-serif"],
                body: ["var(--body-font)", "system-ui", "sans-serif"],
                mono: ['"JetBrains Mono"', "ui-monospace", '"SF Mono"', "monospace"],
            },
            colors: {
                brand: {
                    DEFAULT: brandWithAlpha,
                    2: "#ff8a36",
                    deep: "var(--brand-dark)",
                },
                "brand-dark": "var(--brand-dark)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                muted: {
                    DEFAULT: "var(--muted)",
                    inv: "rgba(250, 246, 239, 0.62)",
                },
                card: "var(--card)",
                border: "var(--border)",
                paper: {
                    DEFAULT: "var(--paper)",
                    2: "var(--paper-2)",
                    3: "var(--paper-3)",
                },
                ink: {
                    DEFAULT: "var(--ink)",
                    2: "var(--ink-2)",
                    3: "#1c2e29",
                },
                line: {
                    DEFAULT: "var(--line)",
                    strong: "rgba(13, 24, 20, 0.18)",
                    inv: "rgba(250, 246, 239, 0.10)",
                    "inv-strong": "rgba(250, 246, 239, 0.20)",
                },
                green: {
                    DEFAULT: "var(--green)",
                },
                gold: "#d4a242",
                red: "#d62828",
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                DEFAULT: "var(--radius)",
                skin: "var(--radius)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
                button: "var(--btn-radius)",
                card: "var(--card-radius)",
                pill: "var(--radius-pill)",
            },
            maxWidth: {
                container: "1480px",
            },
            transitionTimingFunction: {
                snap: "cubic-bezier(0.22, 1, 0.36, 1)",
                out: "cubic-bezier(0.22, 1, 0.36, 1)",
                "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
                spring: "cubic-bezier(0.34, 1.4, 0.64, 1)",
            },
            boxShadow: {
                brand: "0 16px 40px rgba(var(--brand-rgb, 249, 115, 22), 0.28)",
                "brand-lg": "0 14px 28px rgba(var(--brand-rgb, 249, 115, 22), 0.36)",
                paper: "0 20px 70px rgba(16, 32, 24, 0.10)",
                sm: "0 2px 8px rgba(13,24,20,0.06)",
                lg: "0 32px 80px rgba(13,24,20,0.18)",
            },
        },
    },
    plugins: [],
};
