/* mobile menu */
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

/* back to top */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
	if (window.scrollY > 300) {
		// Butonu göster
		backToTop.classList.remove('translate-y-20', 'opacity-0');
		backToTop.classList.add('translate-y-0', 'opacity-100');
	} else {
		// Butonu gizle
		backToTop.classList.add('translate-y-20', 'opacity-0');
		backToTop.classList.remove('translate-y-0', 'opacity-100');
	}
});

backToTop.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth', // Yumuşak kaydırma
	});
});

/* filter settings */
// assets/collection-filters.js (veya main-collection.liquid içine <script> olarak)

document.addEventListener('DOMContentLoaded', function () {
	const filterForm = document.querySelector('#CollectionFiltersForm');

	if (filterForm) {
		filterForm.addEventListener('change', (event) => {
			const formData = new FormData(filterForm);
			const searchParams = new URLSearchParams(formData).toString();
			const fetchUrl = `${window.location.pathname}?${searchParams}`;

			// Sayfa yenilenmeden URL'i güncelle
			history.pushState({ path: fetchUrl }, '', fetchUrl);

			// Ürün grid'ini güncelle (Loading efekti ekleyebiliriz)
			const productGrid = document.querySelector('#ProductGridContainer');
			productGrid.style.opacity = '0.5'; // Hafif karartma (Loading hissi)

			fetch(fetchUrl)
				.then((response) => response.text())
				.then((responseText) => {
					const html = new DOMParser().parseFromString(responseText, 'text/html');
					const newProducts = html.querySelector('#ProductGridContainer').innerHTML;

					document.querySelector('#ProductGridContainer').innerHTML = newProducts;
					productGrid.style.opacity = '1'; // Geri getir
				})
				.catch((e) => console.error('Filter Error:', e));
		});
	}
});

/* drever */
const openBtn = document.getElementById('mobile-menu-open');
const closeBtn = document.getElementById('mobile-menu-close');
const overlay = document.getElementById('mobile-menu-overlay');
const drawer = document.getElementById('mobile-menu-drawer');
const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');

// Menüyü Aç
openBtn.addEventListener('click', () => {
	drawer.classList.remove('translate-x-full');
	overlay.classList.remove('hidden');
	document.body.classList.add('overflow-hidden'); // Sayfa kaymasını engeller
});

// Menüyü Kapat
const closeMenu = () => {
	drawer.classList.add('translate-x-full');
	overlay.classList.add('hidden');
	document.body.classList.remove('overflow-hidden');
};

closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// Mobil Dropdownları Aç/Kapat
dropdownBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		const subMenu = btn.nextElementSibling;
		const icon = btn.querySelector('svg');

		subMenu.classList.toggle('hidden');
		icon.classList.toggle('rotate-180');
	});
});
