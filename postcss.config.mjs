/** PostCSS pipeline for webpack builds (`next dev/build --webpack`).
 * Turbopack builds use the @tailwindcss/turbopack loader in next.config.ts.
 * Only one pipeline runs per builder — they never double-process. */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
