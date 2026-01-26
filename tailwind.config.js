/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./js/**/*.js",
        "./v2/**/*.html",
        "./firatasistan/**/*.html",
        "./sepetsepetyemek/**/*.html"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    // Light Mode - Soft Futuristic (Lavender Dream)
                    bg: '#F5F3FF',           // Soft lavender instead of white
                    surface: '#EDE9FE',      // Light purple surface
                    text: '#1E1B4B',         // Deep indigo text
                    muted: '#7C69BA',        // Purple-gray muted
                    border: '#DDD6FE',       // Lavender border

                    // Primary Colors - Cyberpunk Neon
                    primary: '#8B5CF6',      // Vibrant purple (main CTA)
                    hover: '#7C3AED',        // Darker purple hover
                    accent: '#EC4899',       // Hot pink accent

                    // Neon Highlights
                    neon: {
                        cyan: '#06D6FF',     // Electric cyan
                        pink: '#FF10F0',     // Neon magenta
                        lime: '#39FF14',     // Matrix green
                        blue: '#00F0FF',     // Sky neon
                    },

                    // Dark Mode Specific
                    dark: {
                        bg: '#0A0118',       // Ultra deep purple-black
                        surface: '#1A0B2E',  // Dark purple surface
                        card: '#16213E',     // Card background
                        text: '#E2E8F0',     // Light text for dark
                        border: '#2D1B69',   // Purple border dark
                    },

                    // Card backgrounds
                    card_back: '#1E1B4B',    // Deep indigo for flipped cards
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
                hand: ['Indie Flower', 'cursive'],
            },
            animation: {
                'gradient-x': 'gradient-x 3s ease infinite',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
            },
        }
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.perspective-1000': { perspective: '1000px' },
                '.transform-style-preserve-3d': { transformStyle: 'preserve-3d' },
                '.backface-hidden': { backfaceVisibility: 'hidden' },
                '.rotate-y-180': { transform: 'rotateY(180deg)' },
            })
        }
    ],
}
