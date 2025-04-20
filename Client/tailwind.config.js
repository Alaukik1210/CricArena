/** @type {import('tailwindcss').Config} */



export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			goldy: '#b79558',
  			gold: '#FFD070',
  			goldx: '#363535',
  			orangex: '#FFD070',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			'audiowide': 'audiowide',
  			'product-sans': 'Product Sans',
  			'product-sans-black': [
  				'Product Sans Black'
  			],
  			'product-sans-medium': 'Product Sans Medium',
  			'cabinet': [
  				'CabinetGrotesk-Regular'
  			],
  			'cabinet-thin': [
  				'CabinetGrotesk-Thin'
  			],
  			'cabinet-extralight': [
  				'CabinetGrotesk-Extralight'
  			],
  			'cabinet-light': [
  				'CabinetGrotesk-Light'
  			],
  			'cabinet-medium': [
  				'CabinetGrotesk-Medium'
  			],
  			'cabinet-bold': [
  				'CabinetGrotesk-Bold'
  			],
  			'cabinet-extrabold': [
  				'CabinetGrotesk-Extrabold'
  			],
  			'cabinet-black': [
  				'CabinetGrotesk-Black'
  			]
  		},
  		backgroundImage: {
			'hero-pattern': 'url("/src/assets/herobg.png")',
			'matches': 'url("/src/assets/matchbg1.png")',
			'matches1': 'url("/src/assets/matchbg2.jpg")',
			'matches2': 'url("/src/assets/matchbg3.jpg")',
			'matches3': 'url("/src/assets/matchbg4.jpg")',
			'matches4': 'url("/src/assets/matchbg5.jpg")',
			'matches5': 'url("/src/assets/matchbg6.jpg")',
			'ball': 'url("/src/assets/ballbg1.png")',
			'banner': 'url("/src/assets/banner1.png")',
			'banner2': 'url("/src/assets/banner2.png")',
			'banner3': 'url("/src/assets/banner3.png")',
			'bann': 'url("/src/assets/bann.png")'
  		},
  		keyframes: {
  			animate: {
  				'0%': {
  					backgroundPosition: '0% 0%'
  				},
  				'100%': {
  					backgroundPosition: '100% 0%'
  				}
  			}
  		},
  		animation: {
  			animate: 'animate 5s linear infinite'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
