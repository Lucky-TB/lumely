/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  corePlugins: {
    aspectRatio: false, // Disable aspect-ratio utilities
  },
  theme: {
    extend: {
      colors: {
        // Lumely Color Scheme - Light Mode
        primary: {
          50: '#F0F9FA',
          100: '#E1F3F5',
          200: '#C3E7EB',
          300: '#A8DADC',  // Primary - Soft Blue-Green
          400: '#8BCED1',
          500: '#6EC2C6',
          600: '#51B6BB',
          700: '#34AAB0',
          800: '#179EA5',
          900: '#00929A',
        },
        secondary: {
          50: '#F0F4F8',
          100: '#E1E9F1',
          200: '#C3D3E3',
          300: '#A5BDD5',
          400: '#87A7C7',
          500: '#6991B9',
          600: '#4B7BAB',
          700: '#457B9D',  // Secondary - Muted Indigo
          800: '#3D6B8D',
          900: '#355B7D',
        },
        accent: {
          50: '#FEF7F0',
          100: '#FDEFE1',
          200: '#FBDFC3',
          300: '#F9CFA5',
          400: '#F7BF87',
          500: '#F5AF69',
          600: '#F4A261',  // Accent - Warm Coral
          700: '#F29251',
          800: '#F08241',
          900: '#EE7231',
        },
        background: '#FAF9F6',  // Off-White
        surface: '#F5F5F5',     // Light Gray
        
        // Dark Mode Colors
        dark: {
          background: '#0F0F23',    // Deep Dark Blue-Black
          surface: '#1A1A2E',       // Dark Blue-Gray
          card: '#16213E',          // Dark Blue Card
          primary: '#4ECDC4',       // Bright Teal
          secondary: '#45B7D1',     // Bright Blue
          accent: '#FF6B6B',        // Bright Coral
          text: '#E8E8E8',          // Light Gray Text
          textSecondary: '#B0B0B0', // Muted Gray Text
          border: '#2D3748',        // Dark Border
        },
      },
      fontFamily: {
        'inter': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};