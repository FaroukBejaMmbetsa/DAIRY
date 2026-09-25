const products = [
  {
    id: 'cow-fleck',
    category: 'cows',
    type: 'Holstein Friesian',
    name: 'Fleck',
    description: 'Calm, healthy and ready for a productive new home.',
    price: 185000,
    unit: 'per cow',
    icon: '🐄'
  },
  {
    id: 'cow-mara',
    category: 'cows',
    type: 'Ayrshire',
    name: 'Mara',
    description: 'A sturdy young cow with a gentle temperament.',
    price: 142000,
    unit: 'per cow',
    icon: '🐮'
  },
  {
    id: 'cow-sunny',
    category: 'cows',
    type: 'Jersey cross',
    name: 'Sunny',
    description: 'Compact, friendly and well suited to a smaller farm.',
    price: 118000,
    unit: 'per cow',
    icon: '🐄'
  },
  {
    id: 'cow-olive',
    category: 'cows',
    type: 'Guernsey',
    name: 'Olive',
    description: 'A dependable dairy cow with a bright personality.',
    price: 156000,
    unit: 'per cow',
    icon: '🐮'
  },
  {
    id: 'milk-fresh',
    category: 'dairy',
    type: 'Fresh dairy',
    name: 'Fresh milk',
    description: 'Chilled farm milk, bottled fresh for your household.',
    price: 120,
    unit: 'per litre',
    icon: '🥛'
  },
  {
    id: 'milk-yoghurt',
    category: 'dairy',
    type: 'Cultured dairy',
    name: 'Natural yoghurt',
    description: 'Smooth, lightly cultured yoghurt made from fresh milk.',
    price: 180,
    unit: 'per 500 ml',
    icon: '🍶'
  },
  {
    id: 'cheese-farmhouse',
    category: 'dairy',
    type: 'Farmhouse cheese',
    name: 'Farmhouse cheese',
    description: 'A firm, creamy cheese for breakfast boards and cooking.',
    price: 850,
    unit: 'per 500 g',
    icon: '🧀'
  },
  {
    id: 'butter-creamy',
    category: 'dairy',
    type: 'Churned dairy',
    name: 'Cream butter',
    description: 'Rich churned butter with a clean, golden finish.',
    price: 480,
    unit: 'per 250 g',
    icon: '🧈'
  }
];

const cartKey = 'dairy-cart';
const purchaseKey = 'dairy-purchases';
const paymentPromptAmount = 1;
const currency = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0
});

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function getPurchases() {
  return JSON.parse(localStorage.getItem(purchaseKey) || '[]');
}

function productById(productId) {
  return products.find((product) => product.id === productId);
}

function formatMoney(amount) {
  return currency.format(amount);
}

function renderShell() {
  const header = document.getElementById('siteHeader');
  const cartUi = document.getElementById('cartUi');
  if (!header || !cartUi) return;

  header.innerHTML = `
    <div class="header-left">
      <a class="logo" href="customer_dashboard.html" aria-label="Dairy Management home">
        <span class="logo-mark" aria-hidden="true">DM</span>
        Dairy Management
      </a>
      <button class="cart-trigger" type="button" data-cart-open aria-label="Open shopping cart">
        Cart <span class="cart-count" data-cart-count>0</span>
      </button>
    </div>
    <div class="header-actions">
      <details class="nav-menu">
        <summary class="menu-summary">Menu</summary>
        <nav class="menu-links" aria-label="Customer pages">
          <a href="customer_dashboard.html">Overview</a>
          <a href="cows.html">Cows for sale</a>
          <a href="dairy-products.html">Dairy products</a>
          <a href="purchases.html">Previous purchases</a>
          <a href="about.html">About us</a>
          <button type="button" data-logout>Log out</button>
        </nav>
      </details>
    </div>`;

  cartUi.innerHTML = `
    <div class="cart-backdrop" data-cart-close hidden></div>
    <aside class="cart-drawer" data-cart-drawer aria-label="Shopping cart">
      <div class="cart-header">
        <div>
          <p class="kicker">Your basket</p>
          <h2>Cart</h2>
        </div>
        <button class="close-cart" type="button" data-cart-close aria-label="Close cart">×</button>
      </div>
      <div class="cart-items" data-cart-items></div>
      <div class="cart-summary">
        <div class="summary-row total"><span>Total</span><strong data-cart-total>KES 0</strong></div>
        <button class="pay-button" type="button" data-payment-open disabled>Make payment</button>
      </div>
    </aside>
    <div class="modal-backdrop" data-payment-modal hidden>
      <form class="payment-modal" data-payment-form>
        <p class="kicker">Checkout</p>
        <h2>Pay securely</h2>
        <p>This is testing mode. The future Daraja prompt will always request <strong data-payment-amount>KES 1</strong>, regardless of the basket value.</p>
        <p>Basket value: <strong data-order-total>KES 0</strong></p>
        <label for="paymentPhone">M-Pesa phone number</label>
        <input id="paymentPhone" name="phone" type="tel" inputmode="tel" placeholder="07XX XXX XXX" required>
        <div class="modal-actions">
          <button class="cancel-button" type="button" data-payment-close>Cancel</button>
          <button class="pay-button" type="submit">Confirm payment</button>
        </div>
        <p class="form-message" data-payment-message role="status" aria-live="polite"></p>
      </form>
    </div>`;
}

function renderProducts() {
  document.querySelectorAll('[data-product-grid]').forEach((grid) => {
    const category = grid.dataset.category;
    const visibleProducts = products.filter((product) => product.category === category);
    grid.innerHTML = visibleProducts.map((product) => `
      <article class="product-card">
        <div class="product-art ${product.category === 'cows' ? 'cow' : ''}" aria-hidden="true">
          <span>${product.icon}</span>
        </div>
        <div class="product-info">
          <p class="product-type">${product.type}</p>
          <h3>${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-meta">
            <span class="product-price">${formatMoney(product.price)} <small>${product.unit}</small></span>
            <button class="add-button" type="button" data-add-to-cart="${product.id}">Add to cart</button>
          </div>
        </div>
      </article>`).join('');
  });
}

function cartQuantity() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function cartTotal() {
  return getCart().reduce((total, item) => {
    const product = productById(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function renderCart() {
  const cart = getCart();
  document.querySelectorAll('[data-cart-count]').forEach((element) => {
    element.textContent = cartQuantity();
  });

  const items = document.querySelector('[data-cart-items]');
  const total = document.querySelector('[data-cart-total]');
  const paymentButton = document.querySelector('[data-payment-open]');
  if (!items || !total || !paymentButton) return;

  if (!cart.length) {
    items.innerHTML = '<p class="empty-cart">Your cart is waiting for something good.</p>';
  } else {
    items.innerHTML = cart.map((item) => {
      const product = productById(item.productId);
      return `<div class="cart-item">
        <div class="cart-item-art" aria-hidden="true">${product.icon}</div>
        <div>
          <h3>${product.name}</h3>
          <p>${formatMoney(product.price)} each</p>
          <div class="quantity-control" aria-label="Quantity for ${product.name}">
            <button type="button" data-cart-action="decrease" data-product-id="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="increase" data-product-id="${product.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-item" type="button" data-cart-action="remove" data-product-id="${product.id}">Remove</button>
      </div>`;
    }).join('');
  }

  total.textContent = formatMoney(cartTotal());
  paymentButton.disabled = !cart.length;
}

function setCartOpen(isOpen) {
  const drawer = document.querySelector('[data-cart-drawer]');
  const backdrop = document.querySelector('[data-cart-close].cart-backdrop');
  drawer?.classList.toggle('open', isOpen);
  if (backdrop) backdrop.hidden = !isOpen;
}

function addToCart(productId) {
  const cart = getCart();
  const item = cart.find((entry) => entry.productId === productId);
  if (item) item.quantity += 1;
  else cart.push({ productId, quantity: 1 });
  saveCart(cart);
  renderCart();
  setCartOpen(true);
}

function updateQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find((entry) => entry.productId === productId);
  if (!item) return;
  item.quantity += change;
  saveCart(cart.filter((entry) => entry.quantity > 0));
  renderCart();
}

function removeFromCart(productId) {
  saveCart(getCart().filter((entry) => entry.productId !== productId));
  renderCart();
}

function logOut() {
  saveCart([]);
  window.location.href = 'login_page.html';
}

function openPayment() {
  const modal = document.querySelector('[data-payment-modal]');
  if (!modal) return;
  modal.querySelector('[data-payment-amount]').textContent = formatMoney(paymentPromptAmount);
  modal.querySelector('[data-order-total]').textContent = formatMoney(cartTotal());
  modal.hidden = false;
}

function closePayment() {
  const modal = document.querySelector('[data-payment-modal]');
  if (modal) modal.hidden = true;
}

function completePayment(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const phone = new FormData(form).get('phone').trim();
  const message = document.querySelector('[data-payment-message]');
  if (!/^0\d{9}$/.test(phone.replace(/\s/g, ''))) {
    message.textContent = 'Enter a valid 10-digit Kenyan phone number.';
    message.style.color = 'var(--coral)';
    return;
  }

  const purchase = {
    id: `DM-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
    total: cartTotal(),
    paymentPromptAmount,
    items: getCart(),
    phone
  };
  localStorage.setItem(purchaseKey, JSON.stringify([purchase, ...getPurchases()]));
  saveCart([]);
  form.reset();
  closePayment();
  setCartOpen(false);
  renderCart();
  window.location.href = 'purchases.html';
}

function renderPurchases() {
  const list = document.querySelector('[data-purchase-list]');
  if (!list) return;
  const purchases = getPurchases();
  if (!purchases.length) {
    list.innerHTML = '<p class="empty-cart">Your successful purchases will appear here.</p>';
    return;
  }

  list.innerHTML = purchases.map((purchase) => {
    const date = new Date(purchase.date).toLocaleDateString('en-KE', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    const itemCount = purchase.items.reduce((total, item) => total + item.quantity, 0);
    return `<article class="purchase-card">
      <div>
        <h3>Order ${purchase.id}</h3>
        <p>${date} · ${itemCount} item${itemCount === 1 ? '' : 's'}</p>
        <span class="purchase-status">Successful</span>
      </div>
      <div class="purchase-total">${formatMoney(purchase.total)}</div>
    </article>`;
  }).join('');
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add-to-cart]');
    if (addButton) addToCart(addButton.dataset.addToCart);

    const cartAction = event.target.closest('[data-cart-action]');
    if (cartAction) {
      const { cartAction: action, productId } = cartAction.dataset;
      if (action === 'increase') updateQuantity(productId, 1);
      if (action === 'decrease') updateQuantity(productId, -1);
      if (action === 'remove') removeFromCart(productId);
    }

    if (event.target.closest('[data-cart-open]')) setCartOpen(true);
    if (event.target.closest('[data-cart-close]')) setCartOpen(false);
    if (event.target.closest('[data-payment-open]')) openPayment();
    if (event.target.closest('[data-payment-close]')) closePayment();
    if (event.target.closest('[data-logout]')) logOut();
  });

  document.querySelector('[data-payment-form]')?.addEventListener('submit', completePayment);
}

document.addEventListener('DOMContentLoaded', () => {
  renderShell();
  renderProducts();
  renderCart();
  renderPurchases();
  bindEvents();
});
