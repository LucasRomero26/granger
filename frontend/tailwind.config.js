/** Allow opacity modifiers (e.g. bg-accent/70) with CSS variable colors. */
const withAlpha = (variable) =>
  `color-mix(in srgb, var(${variable}) calc(100% * <alpha-value>), transparent)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mist: withAlpha('--color-mist'),
        frost: withAlpha('--color-frost'),
        ink: withAlpha('--color-ink'),
        muted: withAlpha('--color-muted'),
        navy: {
          DEFAULT: withAlpha('--color-navy'),
          soft: withAlpha('--color-navy-soft'),
          fg: withAlpha('--color-navy-fg'),
          muted: withAlpha('--color-navy-muted'),
        },
        accent: {
          DEFAULT: withAlpha('--color-accent'),
          soft: withAlpha('--color-accent-soft'),
          fg: withAlpha('--color-accent-fg'),
        },
        brass: withAlpha('--color-brass'),
        pink: withAlpha('--color-pink'),
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
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        glass: '0 1px 2px rgba(11, 27, 58, 0.04), 0 4px 16px rgba(11, 27, 58, 0.05)',
        soft: '0 1px 2px rgba(11, 27, 58, 0.04), 0 2px 8px rgba(11, 27, 58, 0.04)',
        lift: '0 12px 32px -8px rgba(11, 27, 58, 0.16), 0 4px 12px -4px rgba(11, 27, 58, 0.08)',
        float:
          '0 24px 48px -12px rgba(11, 27, 58, 0.16), 0 8px 20px -8px rgba(11, 27, 58, 0.08)',
        drag: '0 24px 48px rgba(11, 27, 58, 0.24)',
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
