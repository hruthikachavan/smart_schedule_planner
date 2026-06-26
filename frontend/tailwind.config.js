export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float':    'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from:{ opacity:'0' }, to:{ opacity:'1' } },
        slideUp: { from:{ opacity:'0', transform:'translateY(16px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        scaleIn: { from:{ opacity:'0', transform:'scale(0.95)' }, to:{ opacity:'1', transform:'scale(1)' } },
        float:   { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
}
