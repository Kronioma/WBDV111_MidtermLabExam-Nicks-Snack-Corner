let cart = [];

function updateQty(btn, change) {
  const qtySpan = btn.parentElement.querySelector('.qty-value');
  let qty = parseInt(qtySpan.textContent);
  qty = Math.max(1, qty + change);
  qtySpan.textContent = qty;
}

function addToCart(name, price, btn) {
  const card = btn.closest('.product-card');
  const qty = parseInt(card.querySelector('.qty-value').textContent);

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }

  updateCartUI();
  showCartToast(name, qty);
}

function updateCartUI() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');

  cartItems.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;

    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <div class="cart-item-controls">
        <button class="cart-qty-btn" onclick="changeCartQty(${index}, -1)">−</button>
        <span>${item.qty}</span>
        <button class="cart-qty-btn" onclick="changeCartQty(${index}, 1)">+</button>
        <span class="cart-item-price">₱${item.price * item.qty}</span>
        <button class="cart-remove" onclick="removeFromCart(${index})">✕</button>
      </div>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: ₱${total}`;
  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? 'flex' : 'none';
}

function changeCartQty(index, change) {
  cart[index].qty = Math.max(1, cart[index].qty + change);
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  drawer.classList.toggle('open');
}

function showCartToast(name, qty) {
  const toast = document.getElementById('cart-toast');
  toast.textContent = `Added ${qty}x ${name} to cart!`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}