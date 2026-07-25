import coreWebVitals from 'eslint-config-next/core-web-vitals'

// eslint-config-next 16 ships flat config directly, so no FlatCompat shim is
// needed. The old shim also imported @eslint/eslintrc, which was never a
// declared dependency — it only resolved transitively.
const eslintConfig = [{ ignores: ['.next/**', 'out/**', 'node_modules/**'] }, ...coreWebVitals]

export default eslintConfig
