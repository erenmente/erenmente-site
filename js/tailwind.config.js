tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    bg: '#ffffff',
                    surface: '#f8fafc',
                    text: '#0f172a',
                    muted: '#64748b',
                    border: '#e2e8f0',
                    primary: '#4f46e5',
                    hover: '#4338ca',
                    accent: '#9333ea',
                    card_back: '#1e293b',
                }
            },
            fontFamily: {
                sans: ['Indie Flower', 'cursive', 'sans-serif'],
                heading: ['Indie Flower', 'cursive', 'sans-serif'],
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
    }
}
