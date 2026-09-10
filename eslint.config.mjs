import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", ".generated/**", ".test-out/**", "next-env.d.ts"]),
  { rules: {
    // React Compiler is not enabled in this migration. Keep its new diagnostics
    // visible without turning an upgrade into a rewrite of durable recovery refs.
    // Existing rules-of-hooks and exhaustive-deps retain the Next preset levels.
    "react-hooks/immutability": "warn",
    "react-hooks/preserve-manual-memoization": "warn",
    "react-hooks/purity": "warn",
    "react-hooks/refs": "warn",
    "react-hooks/set-state-in-effect": "warn",
    "react-hooks/static-components": "warn",
    "react/no-unknown-property": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-no-target-blank": "off",
  } },
]);
