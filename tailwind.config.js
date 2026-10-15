/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vscode: {
          activityBar: '#181818',
          activityBarActive: '#2d2d2d',
          sidebar: '#1f1f1f',
          sidebarBorder: '#2b2b2b',
          editor: '#141414',
          card: '#222222',
          cardHover: '#2a2a2a',
          accent: '#0078d4',
          accentHover: '#1084d8',
          listHover: '#2a2d2e',
          listActive: '#37373d',
        }
      }
    },
  },
  plugins: [],
};
