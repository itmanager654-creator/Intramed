/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', alt: 'var(--bg-alt)', surface: 'var(--surface)', surface2: 'var(--surface-2)',
        ink: 'var(--text)', muted: 'var(--text-muted)', brand: 'var(--accent)', brandDark: 'var(--accent-dark)',
        tint: 'var(--accent-tint)', line: 'var(--border)',
      },
      fontFamily: { heading: ['var(--font-poppins)', 'sans-serif'], sans: ['var(--font-inter)', 'sans-serif'] },
      boxShadow: { card: 'var(--shadow)' },
    },
  },
  plugins: [],
};
