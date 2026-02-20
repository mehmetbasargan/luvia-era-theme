document.addEventListener('DOMContentLoaded', () => {
	const menuToggle = document.getElementById('menu-toggle');
	const mainMenu = document.getElementById('main-menu');
	const iconOpen = document.getElementById('icon-open');
	const iconClose = document.getElementById('icon-close');

	if (menuToggle && mainMenu) {
		menuToggle.addEventListener('click', () => {
			// Menü listesini aç/kapat
			mainMenu.classList.toggle('hidden');

			// İkonları değiştir
			if (mainMenu.classList.contains('hidden')) {
				// Menü kapalıysa
				iconOpen.classList.replace('hidden', 'block');
				iconClose.classList.replace('block', 'hidden');
			} else {
				// Menü açıksa
				iconOpen.classList.replace('block', 'hidden');
				iconClose.classList.replace('hidden', 'block');
			}
		});
	}
});
