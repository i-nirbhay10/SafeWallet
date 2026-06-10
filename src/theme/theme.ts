const darkColors = {
  background: '#0B0F19', // Deep dark blue for a premium fintech feel
  surface: '#1A1F2C', // Slightly lighter for cards
  primary: '#6366F1', // Indigo accent
  secondary: '#10B981', // Emerald green for positive/income
  danger: '#EF4444', // Red for expenses
  text: '#F8FAFC', // Slate 50 for main text
  textSecondary: '#94A3B8', // Slate 400 for secondary text
  border: '#334155',
};

const lightColors = {
  background: '#F8FAFC', // Light slate background
  surface: '#FFFFFF', // White for cards
  primary: '#4F46E5', // Slightly darker Indigo accent for contrast
  secondary: '#059669', // Slightly darker Emerald green
  danger: '#DC2626', // Slightly darker Red
  text: '#0F172A', // Slate 900 for main text
  textSecondary: '#64748B', // Slate 500 for secondary text
  border: '#E2E8F0', // Light border
};

const common = {
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    round: 9999,
  },
};

export const darkTheme = {
  colors: darkColors,
  ...common,
};

export const lightTheme = {
  colors: lightColors,
  ...common,
};

// Set lightTheme as the default active theme
export const theme = lightTheme;
