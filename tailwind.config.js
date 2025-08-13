/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B4FE9",
        secondary: "#8B7FF0",
        accent: "#FF6B6B",
        surface: "#FFFFFF",
        background: "#F8F9FC",
        success: "#4ECB71",
        warning: "#FFB84D",
        error: "#FF5757",
        info: "#4DA6FF"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.3s ease-out',
        'celebration': 'celebration 0.5s ease-out',
        'pulse-priority': 'pulsePriority 2s infinite',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        celebration: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '25%': { transform: 'scale(1.1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulsePriority: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      }
    },
  },
  plugins: [],
}