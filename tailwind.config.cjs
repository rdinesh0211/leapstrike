/** Tailwind build config — compiles assets/site.css from build/input.css.
 *  Scans HTML + site.js so classes toggled in JS are never purged. */
module.exports = {
  content: ['./*.html', './assets/*.js'],
  theme: {
    extend: {
      colors: {
        teal: { 400: '#1FC2B0', 500: '#14A89A', 600: '#0E8C80', 700: '#0B6F66', 800: '#0A5450', 900: '#0C3A3B' },
        mint: '#2FD3C0',
        ink: '#0F2E2E',
        surface: '#F5F7F7',
        surface2: '#E9F0EF',
      },
      fontFamily: {
        display: ['Anton', 'ui-sans-serif', 'sans-serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 22px 44px -26px rgba(12,58,59,0.38)',
        float: '0 34px 64px -30px rgba(12,58,59,0.50)',
        pill: '0 14px 30px -12px rgba(20,168,154,0.55)',
      },
      letterSpacing: { tightest: '-0.04em' },
    },
  },
};
