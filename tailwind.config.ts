import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'dark-green': '#1b3a4b', // Fundo principal
        'light-beige': '#f5f3e5', // Texto principal
        'forest-green': '#2c6e49', // Botão Monster
        'moss-green': '#4a773c', // Hover botão Monster
        'emerald-green': '#4a7f5f', // Botão Spell
        'jade-green': '#5a8d6c', // Hover botão Spell
        'burgundy': '#6c2f27', // Botão Class
        'ruby-red': '#7c3a2c', // Hover botão Class
        'royal-blue': '#2a3a8c', // Botão Equipment
        'sapphire-blue': '#3b5a9b', // Hover botão Equipment
        'gold': '#d4af37' // Cor do texto no carregando
      }
    },
  },
  plugins: [],
};
export default config;
