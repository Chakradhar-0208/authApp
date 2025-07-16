// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Includes all components and pages in src
  ],
  theme: {
    extend: {
      screens: {
      '2xs':"360px",
      'xs':"480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
    
  },
  plugins: [],
  
  "tailwind": {
    "css": "styles/global.css"
  }

  
}

