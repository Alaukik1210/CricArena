/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        goldy: "#b79558",
        gold: "#FFD070",
        goldx:"#363535",
      },
      fontFamily: {
        "audiowide": "audiowide",
        "product-sans": "'Product Sans'",
        "product-sans-black": ["'Product Sans Black'"],
        "product-sans-medium": "'Product Sans Medium'",
        "cabinet": ['CabinetGrotesk-Regular'],
        "cabinet-thin": ['CabinetGrotesk-Thin'],
        "cabinet-extralight": ['CabinetGrotesk-Extralight'],
        "cabinet-light": ['CabinetGrotesk-Light'],
        "cabinet-medium": ['CabinetGrotesk-Medium'],
        "cabinet-bold": ['CabinetGrotesk-Bold'],
        "cabinet-extrabold": ['CabinetGrotesk-Extrabold'],
        "cabinet-black": ['CabinetGrotesk-Black'],
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
        "matches": "url('/src/assets/matchbg1.png')",
        "matches1": "url('/src/assets/matchbg2.jpg')",
        "matches2": "url('/src/assets/matchbg3.jpg')",
        "matches3": "url('/src/assets/matchbg4.jpg')",
        "matches4": "url('/src/assets/matchbg5.jpg')",
        "matches5": "url('/src/assets/matchbg6.jpg')",
        "ball": "url('/src/assets/ballbg1.png')",
        "banner": "url('/src/assets/banner1.png')",
        "banner2": "url('/src/assets/banner2.png')",
        "banner3": "url('/src/assets/banner3.png')",
        "bann": "url('/src/assets/bann.png')",
      },
      keyframes: {
        animate: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 0%' },
        },
      },
      animation: {
        'animate': 'animate 5s linear infinite',
      },
    },
  },
  plugins: [],
};
