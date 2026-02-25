/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./layout/*.liquid',
		'./sections/**/*.liquid', // Bu: sections altındaki tüm klasörleri tara demek
		'./snippets/**/*.liquid', // Bu da aynı şekilde tüm snippet alt klasörleri
		'./templates/**/*.liquid',
		'./config/*.json',
	],
	theme: {
		extend: {
			colors: {
				primary: '#3b443c',
				secondary: '#b2ac88',
				'custom-bg': '#f9f9f9',
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				josefin: ['Josefin Sans', 'sans-serif'],
			},
			// Container'ı burada özelleştiriyoruz
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
