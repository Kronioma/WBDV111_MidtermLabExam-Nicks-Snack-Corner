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
 
function toggleNav() {
  document.querySelector('.nav-left').classList.toggle('open');
  document.querySelector('.nav-right').classList.toggle('open');
}
 
function openCheckout() {
  if (cart.length === 0) {
    showCartToast('', 0);
    const toast = document.getElementById('cart-toast');
    toast.textContent = 'Your cart is empty!';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
    return;
  }
 
  const summary = document.getElementById("checkout-summary");
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  summary.innerHTML = `
    <h4>Order Summary</h4>
    <ul>
      ${cart.map(item => `<li>${item.name} x${item.qty} — ₱${item.price * item.qty}</li>`).join("")}
    </ul>
    <p class="summary-total">Total: ₱${total}</p>
  `;
 
  document.getElementById("checkout-modal").classList.add("active");
  document.getElementById("cart-drawer").classList.remove("open");
}
 
function closeCheckout() {
  document.getElementById("checkout-modal").classList.remove("active");
}
 
function closeCheckoutOnOverlay(event) {
  if (event.target === document.getElementById("checkout-modal")) {
    closeCheckout();
  }
}
 
function submitOrder(event) {
  event.preventDefault();
 
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
 
  if (!name || !address) {
    const toast = document.getElementById('cart-toast');
    toast.textContent = 'Please fill in all fields!';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
    return;
  }
 
 
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const orderLines = cart.map(item => `• ${item.name} x${item.qty} = ₱${item.price * item.qty}`).join("\n");
  const message = `🧾 New Order!\n\n👤 Name: ${name}\n📍 Address: ${address}\n💳 Payment: Cash\n\n🛒 Items:\n${orderLines}\n\n💰 Total: ₱${total}`;
 

  cart = [];
  updateCartUI();
  closeCheckout();
 
  
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
 
 
  const toast = document.getElementById('cart-toast');
  toast.textContent = `Order placed! Thank you, ${name}! 🎉`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
 

  const WHATSAPP_NUMBER = "639XXXXXXXXX";
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
 
 
}

