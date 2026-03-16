/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./layout/*.liquid',
		'./sections/**/*.liquid',
		'./snippets/**/*.liquid',
		'./templates/**/*.liquid',
		'./config/*.json',
	],
	theme: {
		extend: {
			colors: {
				// --- Global Marka Renkleri (Settings > Colors) ---
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				custombg: 'var(--color-custombg)',
				line: 'var(--color-line)',
				white: 'var(--color-white)',
				black: 'var(--color-black)',
				bgtransparent: 'var(--color-bgtransparent)',

				// --- Dynamic Color Scheme Colors ---
				// These colors change section-based according to selected scheme
				'scheme-bg': 'var(--color-background)',
				'scheme-text': 'var(--color-text)',
				'scheme-heading': 'var(--color-heading)',
				'scheme-btn': 'var(--color-button)',
				'scheme-btn-hover': 'var(--color-button-hover)',
				'scheme-btn-text': 'var(--color-button-label)',
				'scheme-shadow': 'var(--color-shadow)',
			},

			fontFamily: {
				inter: 'var(--font-body)',
				josefin: 'var(--font-heading)',
			},
			container: {
				center: true,
				padding: '1rem',
				screens: {
					sm: '100%',
					md: '100%',
					lg: '1280px',
				},
			},
		},
	},
	plugins: [],
};
