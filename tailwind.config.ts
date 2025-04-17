
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: '#FFFFFF', // White border
				input: '#FFFFFF',  // White border/ring for input
				ring: '#FFFFFF',   // White ring
				background: '#000000', // Black background
				foreground: '#FFFFFF', // White text
				primary: {
					DEFAULT: '#FFFFFF', // White primary elements (buttons, etc.)
					foreground: '#000000' // Black text on primary elements
				},
				secondary: {
					DEFAULT: '#000000', // Black secondary elements
					foreground: '#FFFFFF' // White text on secondary elements
				},
				destructive: { // Map destructive to contrast
					DEFAULT: '#FFFFFF', 
					foreground: '#000000' 
				},
				muted: { // Map muted to contrast
					DEFAULT: '#000000', 
					foreground: '#FFFFFF' 
				},
				accent: { // Map accent to contrast
					DEFAULT: '#FFFFFF', 
					foreground: '#000000' 
				},
				popover: {
					DEFAULT: '#000000', // Black popover background
					foreground: '#FFFFFF' // White popover text
				},
				card: {
					DEFAULT: '#000000', // Black card background
					foreground: '#FFFFFF' // White card text
				},
				sidebar: {
					DEFAULT: '#000000', // Black sidebar background
					foreground: '#FFFFFF', // White sidebar text
					primary: '#FFFFFF', // White accents in sidebar
					'primary-foreground': '#000000', // Black text on sidebar accents
					accent: '#000000', // Black accent background in sidebar
					'accent-foreground': '#FFFFFF', // White text on sidebar accent background
					border: '#FFFFFF', // White border in sidebar
					ring: '#FFFFFF' // White ring in sidebar
				},
				chat: {
					user: '#000000', // Black background for user messages
					assistant: '#000000', // Black background for assistant messages
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-light': {
					'0%, 100%': { opacity: '0.4' },
					'50%': { opacity: '0.7' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-light': 'pulse-light 1.5s ease-in-out infinite',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
