export const colors = {
  black: '#0A0A0A',
  white: '#FFFFFF',
  copper: {
    base: '#C37663',
    light: '#D4957F',
    dark: '#A85F4D',
  },
  gray: {
    100: '#F5F5F5',
    500: '#737373',
    900: '#171717',
  },
} as const;

export const gradients = {
  copper: [colors.copper.base, colors.copper.dark] as const,
  copperSubtle: [colors.copper.base, colors.black] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const fontSize = {
  sm: 14,
  base: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;
