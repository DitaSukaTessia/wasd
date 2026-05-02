/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cosmos: {
          black: '#02020f',
          deep: '#070720',
          navy: '#0a0a2e',
          purple: '#1a0a3e',
          violet: '#2d1b69',
          indigo: '#3730a3',
          blue: '#1e40af',
          cyan: '#0891b2',
          nebula: '#7c3aed',
          star: '#fbbf24',
          pink: '#ec4899',
          rose: '#f43f5e',
          gold: '#f59e0b',
          silver: '#e2e8f0',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        exo: ['Exo 2', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        inter: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shooting-star': 'shootingStar 3s linear infinite',
        'nebula-pulse': 'nebulaPulse 8s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 30s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)' },
          '50%': { boxShadow: '0 0 60px rgba(124, 58, 237, 0.8), 0 0 100px rgba(236, 72, 153, 0.4)' },
        },
        shootingStar: {
          '0%': { transform: 'translateX(-100px) translateY(-100px)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateX(300px) translateY(300px)', opacity: '0' },
        },
        nebulaPulse: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
        rotateSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        }
      },
      backgroundImage: {
        'galaxy': 'radial-gradient(ellipse at center, #1a0a3e 0%, #070720 40%, #02020f 100%)',
        'nebula': 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(236,72,153,0.2) 0%, transparent 50%)',
      }
    },
  },
  plugins: [],
}
