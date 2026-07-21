/** Allow opacity modifiers (e.g. bg-frost/70) with CSS variable colors. */
const withAlpha = (variable) =>
  `color-mix(in oklch, var(${variable}) calc(100% * <alpha-value>), transparent)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mist: withAlpha('--color-mist'),
        frost: withAlpha('--color-frost'),
        ink: withAlpha('--color-ink'),
        muted: withAlpha('--color-muted'),
        accent: {
          DEFAULT: withAlpha('--color-accent'),
          soft: withAlpha('--color-accent-soft'),
          fg: withAlpha('--color-accent-fg'),
        },
        brass: withAlpha('--color-brass'),
        glass: {
          DEFAULT: withAlpha('--color-glass'),
          border: withAlpha('--color-glass-border'),
          strong: withAlpha('--color-glass-strong'),
        },
        card: withAlpha('--color-card'),
        danger: withAlpha('--color-danger'),
        success: withAlpha('--color-success'),
      },
      fontFamily: {
        display: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 10px 40px rgba(15, 23, 42, 0.06), 0 1px 0 rgba(255,255,255,0.5) inset',
        'glass-dark': '0 10px 40px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255,255,255,0.05) inset',
        soft: '0 4px 20px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
        lift: '0 18px 40px -8px rgba(15, 23, 42, 0.18), 0 4px 12px -4px rgba(15, 23, 42, 0.08)',
        float:
          '0 28px 60px -14px rgba(15, 23, 42, 0.14), 0 10px 24px -8px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        drag: '0 24px 48px rgba(15, 23, 42, 0.22)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        soft: '450ms',
      },
      zIndex: {
        dropdown: '40',
        sticky: '50',
        'modal-backdrop': '60',
        modal: '70',
        toast: '80',
        tooltip: '90',
      },
    },
  },
  plugins: [],
}
