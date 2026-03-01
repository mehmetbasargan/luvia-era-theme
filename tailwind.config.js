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
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				custombg: 'var(--color-custombg)',
				line: 'var(--color-line)',
				white: 'var(--color-white)',
				black: 'var(--color-black)',
				bgtransparent: 'var(--color-bgtransparent)',
				'bg-white': 'var(--color-white)',
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
