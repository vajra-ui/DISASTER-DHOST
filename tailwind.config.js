/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dosth: {
          bg: '#090D16',
          card: '#111827',
          cardHover: '#1F2937',
          surface: '#151D30',
          border: '#1F2E4D',
          primary: '#E11D48',      // Vibrant guardian crimson-rose
          secondary: '#9333EA',    // Guardian violet
          accent: '#06B6D4',       // Cyan navigation
          safe: '#10B981',         // Safe emerald green
          warning: '#F59E0B',      // Caution amber
          emergency: '#EF4444',    // High alert red
          muted: '#94A3B8',
          text: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-safe': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
        'glow-primary': '0 0 25px -3px rgba(225, 29, 72, 0.4)',
        'glow-emergency': '0 0 30px -2px rgba(239, 68, 68, 0.6)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar': 'radar 3s ease-out infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
