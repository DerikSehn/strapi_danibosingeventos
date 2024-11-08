import type { Config } from 'tailwindcss';

/* https://coolors.co/a30000-fea82f-fbfbff-040f16 */
const colors = {
  secondary: {
    DEFAULT: '#4f5d2f',
    100: '#101209',
    200: '#1f2512',
    300: '#2f371c',
    400: '#3e4925',
    500: '#4f5d2f',
    600: '#788d47',
    700: '#9eb46a',
    800: '#becd9c',
    900: '#dfe6cd',
  },
  primary: {
    DEFAULT: '#fea82f',
    100: '#3c2300',
    200: '#784601',
    300: '#b46901',
    400: '#f08c01',
    500: '#fea82f',
    600: '#feb959',
    700: '#fecb82',
    800: '#ffdcac',
    900: '#ffeed5',
  },
  white: {
    DEFAULT: '#fff0db',
    100: '#5f3700',
    200: '#be6f00',
    300: '#ffa11e',
    400: '#ffc97c',
    500: '#fff0db',
    600: '#fff3e2',
    700: '#fff6ea',
    800: '#fff9f1',
    900: '#fffcf8',
  },
  black: {
    DEFAULT: '#040f16',
    100: '#010304',
    200: '#020609',
    300: '#02090d',
    400: '#030c11',
    500: '#040f16',
    600: '#134767',
    700: '#227fb9',
    800: '#5baee1',
    900: '#add6f0',
  },
};

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          ...colors.primary,
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          ...colors.secondary,
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
