/**
 * Luvia Era - Global JS
 * Handles: Toast, Cart Drawer, Wishlist
 */

// 1. Toast System
window.showToast = function (message, type = 'info') {
	const oldToast = document.querySelector('.luvia-toast');
	if (oldToast) oldToast.remove();

	const toast = document.createElement('div');

	// Renkleri doğrudan JS içinden atayalım (Tailwind çakışmasını önler)
	let bgColor = 'var(--color-primary, #000)'; // Varsayılan: Temanızdaki primary renk
	if (type === 'success') bgColor = '#16a34a'; // bg-green-600
	if (type === 'error') bgColor = '#dc2626'; // bg-red-600
	if (type === 'info') bgColor = '#2563eb'; // bg-blue-600 (İsteğe bağlı)

	toast.className = `luvia-toast fixed bottom-8 left-1/2 -translate-x-1/2 text-white px-8 py-3 rounded-full shadow-2xl z-[9999] text-[12px] uppercase tracking-[0.2em] transition-all duration-500 opacity-0 translate-y-4`;

	// Arka plan rengini inline style olarak ekliyoruz
	toast.style.backgroundColor = bgColor;
	toast.innerText = message;

	document.body.appendChild(toast);

	setTimeout(() => toast.classList.remove('opacity-0', 'translate-y-4'), 10);
	setTimeout(() => {
		toast.classList.add('opacity-0', 'translate-y-4');
		setTimeout(() => toast.remove(), 500);
	}, 3000);
};

// 2. Cart Drawer Management
window.closeCartDrawer = function () {
	const drawer = document.getElementById('cart-drawer');
	const overlay = document.getElementById('cart-drawer-overlay');
	const content = document.getElementById('cart-drawer-content');

	if (overlay && content) {
		overlay.classList.replace('opacity-100', 'opacity-0');
		content.classList.replace('translate-x-0', 'translate-x-full');
		setTimeout(() => {
			if (drawer) drawer.classList.add('invisible');
		}, 500);
	}
};

window.openCartDrawer = function () {
	const drawer = document.getElementById('cart-drawer');
	const overlay = document.getElementById('cart-drawer-overlay');
	const content = document.getElementById('cart-drawer-content');

	if (drawer && overlay && content) {
		drawer.classList.remove('invisible');
		setTimeout(() => {
			overlay.classList.replace('opacity-0', 'opacity-100');
			content.classList.replace('translate-x-full', 'translate-x-0');
		}, 10);
	}
};

// 3. Wishlist Management
window.LuviaWishlist = {
	get: function () {
		return JSON.parse(localStorage.getItem('luvia-wishlist') || '[]');
	},

	toggle: function (productId) {
		let wishlist = this.get();
		const index = wishlist.indexOf(productId.toString());
		const isAdding = index === -1;

		if (isAdding) {
			wishlist.push(productId.toString());
			window.showToast(window.LuviaStrings.wishlistAdded || 'ADDED TO WISHLIST', 'success');
		} else {
			wishlist.splice(index, 1);
			window.showToast(window.LuviaStrings.wishlistRemoved || 'REMOVED FROM WISHLIST', 'error');
		}

		localStorage.setItem('luvia-wishlist', JSON.stringify(wishlist));
		this.updateUI(productId, isAdding);

		// Wishlist sayfasındaysak satırı kaldır
		const wishItem = document.getElementById(`wish-item-${productId}`);
		if (!isAdding && wishItem) {
			wishItem.style.opacity = '0';
			wishItem.style.transform = 'scale(0.9)';
			setTimeout(() => {
				wishItem.remove();
				if (typeof this.checkEmpty === 'function') this.checkEmpty();
			}, 300);
		}

		window.dispatchEvent(
			new CustomEvent('wishlist:updated', {
				detail: { productId, wishlist, isAdding },
			}),
		);
	},

	updateUI: function (productId, isActive) {
		const selectors = `.custom-wishlist-btn[data-product-id="${productId}"], .wishlist-trigger-btn[data-product-id="${productId}"]`;
		const buttons = document.querySelectorAll(selectors);

		buttons.forEach((btn) => {
			const svg = btn.querySelector('svg');
			if (isActive) {
				btn.classList.add('wishlist-active', 'active');
				if (svg) svg.setAttribute('fill', 'currentColor');
			} else {
				btn.classList.remove('wishlist-active', 'active');
				if (svg) svg.setAttribute('fill', 'none');
			}
		});
	},

	initIcons: function () {
		const wishlist = this.get();
		wishlist.forEach((id) => this.updateUI(id, true));
	},
};

// 4. Initialize & Listeners
document.addEventListener('DOMContentLoaded', () => {
	window.LuviaWishlist.initIcons();
});

document.addEventListener('wishlist:updated', function (e) {
	// Diğer sayfa öğelerini güncellemek gerekirse burası kullanılabilir
	console.log('Wishlist Sync:', e.detail.wishlist);
});

// Global Add to Cart Function (Tüm kartlar için ortak)
window.handleGlobalAddToCart = function (e, variantId) {
	const btn = e.currentTarget;
	const originalText = btn.innerText;

	if (!variantId) {
		console.error('Variant ID missing!');
		return;
	}

	btn.innerText = '...';
	btn.disabled = true;

	fetch('/cart/add.js', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id: variantId, quantity: 1 }),
	})
		.then((res) => res.json())
		.then((data) => {
			btn.innerText = 'ADDED';

			// Toast göster
			if (window.showToast) window.showToast(window.LuviaStrings.cartAdded || 'Product added to cart', 'success');

			// Drawer'ı aç
			if (window.openCartDrawer) window.openCartDrawer();

			// Sepeti yenile (Temanızdaki fonksiyon ismiyle eşleşmeli)
			if (typeof openAndRefreshCart === 'function') {
				openAndRefreshCart();
			}

			// Event fırlat
			document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: data }, bubbles: true }));

			setTimeout(() => {
				btn.innerText = originalText;
				btn.disabled = false;
			}, 2000);
		})
		.catch((err) => {
			btn.innerText = 'ERROR';
			console.error('Cart error:', err);
			setTimeout(() => {
				btn.innerText = originalText;
				btn.disabled = false;
			}, 2000);
		});
};

// Global Sepete Ekleme Fonksiyonu
window.handleGlobalAddToCart = function (e, variantId) {
	if (!variantId || variantId === '') {
		console.error('Hata: Variant ID bulunamadı.');
		window.showToast('Please select a variant', 'error');
		return;
	}

	const btn = e.currentTarget;
	const originalText = btn.innerText;

	btn.innerText = '...';
	btn.disabled = true;

	fetch('/cart/add.js', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id: variantId, quantity: 1 }),
	})
		.then((res) => res.json())
		.then((data) => {
			btn.innerText = 'ADDED';

			// 1. Bildirim (Toast) Göster
			if (window.showToast) {
				window.showToast(window.LuviaStrings?.cartAdded || 'Product added to cart', 'success');
			}

			// 2. Sepet Çekmecesini Aç
			if (window.openCartDrawer) {
				window.openCartDrawer();
			}

			// 3. Sepet İçeriğini Yenile (Eğer temanızda bu isimde bir fonksiyon varsa)
			if (typeof openAndRefreshCart === 'function') {
				openAndRefreshCart();
			}

			// Genel sepet güncelleme olayını tetikle
			document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: data }, bubbles: true }));

			setTimeout(() => {
				btn.innerText = originalText;
				btn.disabled = false;
			}, 2000);
		})
		.catch((err) => {
			console.error('Sepet Hatası:', err);
			btn.innerText = 'ERROR';
			if (window.showToast) window.showToast('Error adding to cart', 'error');
			setTimeout(() => {
				btn.innerText = originalText;
				btn.disabled = false;
			}, 2000);
		});
};
