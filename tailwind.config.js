/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#8b5cf6', // violet-500
        'primary-foreground': '#f8fafc', // slate-50
        
        // Secondary Colors
        'secondary': '#6366f1', // indigo-500
        'secondary-foreground': '#f8fafc', // slate-50
        
        // Accent Colors
        'accent': '#f59e0b', // amber-500
        'accent-foreground': '#0f0f23', // custom-dark
        
        // Background Colors
        'background': '#0f0f23', // custom-dark
        'surface': '#1e1b4b', // indigo-900
        
        // Text Colors
        'text-primary': '#f8fafc', // slate-50
        'text-secondary': '#cbd5e1', // slate-300
        
        // Status Colors
        'success': '#10b981', // emerald-500
        'success-foreground': '#f8fafc', // slate-50
        'warning': '#f59e0b', // amber-500
        'warning-foreground': '#0f0f23', // custom-dark
        'error': '#ef4444', // red-500
        'error-foreground': '#f8fafc', // slate-50
        
        // Border Colors
        'border': '#374151', // gray-700
        'border-primary': '#8b5cf6', // violet-500
      },
      fontFamily: {
        'headline': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'cta': ['Inter', 'sans-serif'],
        'accent': ['Playfair Display', 'serif'],
      },
      fontWeight: {
        'headline-semibold': '600',
        'headline-bold': '700',
        'headline-extrabold': '800',
        'body-normal': '400',
        'body-medium': '500',
        'cta-semibold': '600',
        'accent-semibold': '600',
      },
      boxShadow: {
        'cta': '0 10px 25px -5px rgba(139, 92, 246, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        'smooth': '250ms',
        'demo': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'ease-in-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '100': '100',
        '200': '200',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}