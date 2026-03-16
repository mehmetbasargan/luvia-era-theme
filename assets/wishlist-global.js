/**
 * Luvia Era - Global JS (Wishlist, Cart Drawer, Notifications)
 */

// Global showToast function
window.showToast = function (message, type = 'info') {
	const oldToast = document.querySelector('.luvia-toast');
	if (oldToast) oldToast.remove();

	const toast = document.createElement('div');
	// You can adjust colors according to your design
	const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-primary';

	toast.className = `luvia-toast fixed bottom-8 left-1/2 -translate-x-1/2 ${bgColor} text-white px-8 py-3 rounded-full shadow-2xl z-[9999] text-[12px] uppercase tracking-[0.2em] transition-all duration-500 opacity-0 translate-y-4`;
	toast.innerText = message;
	document.body.appendChild(toast);

	setTimeout(() => toast.classList.remove('opacity-0', 'translate-y-4'), 10);
	setTimeout(() => {
		toast.classList.add('opacity-0', 'translate-y-4');
		setTimeout(() => toast.remove(), 500);
	}, 3000);
};

// Global Cart Drawer Functions
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

// Global Wishlist Object
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
			window.showToast(window.LuviaStrings.wishlistAdded, 'success');
		} else {
			wishlist.splice(index, 1);
			window.showToast(window.LuviaStrings.wishlistRemoved, 'info');
		}

		localStorage.setItem('luvia-wishlist', JSON.stringify(wishlist));
		this.updateUI(productId, isAdding);

		const wishItem = document.getElementById(`wish-item-${productId}`);
		if (!isAdding && wishItem) {
			wishItem.style.opacity = '0';
			setTimeout(() => {
				wishItem.remove();
				if (typeof this.checkEmpty === 'function') this.checkEmpty();
			}, 300);
		}

		window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { productId, wishlist, isAdding } }));
	},

	updateUI: function (productId, isActive) {
		const selectors = `.custom-wishlist-btn[data-product-id="${productId}"], .wishlist-trigger-btn[data-product-id="${productId}"], [data-id="${productId}"].custom-wishlist-btn`;
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

document.addEventListener('DOMContentLoaded', () => {
	window.LuviaWishlist.initIcons();
});
