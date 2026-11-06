const products = window.CECIL_PRODUCTS;

const productsElement = document.querySelector("#products");
const searchInput = document.querySelector("#search-input");
const resultCount = document.querySelector("#result-count");
const emptyResults = document.querySelector("#empty-results");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const cartItemsElement = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const drawerCount = document.querySelector("#drawer-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const toast = document.querySelector("#toast");

let activeFilter = "Tous";
let cart = [];
let toastTimeout;

const formatPrice = (price) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase("fr");
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeFilter === "Tous" || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.category}`.toLocaleLowerCase("fr").includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  resultCount.textContent = `${visibleProducts.length} ${visibleProducts.length > 1 ? "articles" : "article"}`;
  emptyResults.hidden = visibleProducts.length > 0;
  productsElement.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image-wrap">
            <img class="product-image" src="${product.image}" alt="${product.alt}" loading="lazy" />
            <span class="product-tag">${product.tag}</span>
            <button class="add-button" type="button" data-add="${product.id}" aria-label="Ajouter ${product.name} au panier">
              Ajouter au panier <span aria-hidden="true">+</span>
            </button>
          </div>
          <div class="product-info">
            <div>
              <p class="product-name">${product.name}</p>
              <p class="product-category">${product.category}</p>
            </div>
            <p class="product-price">${formatPrice(product.price)}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCart() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  cartCount.textContent = itemCount;
  cartCount.closest("button").setAttribute("aria-label", `Ouvrir le panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`);
  drawerCount.textContent = `(${itemCount})`;
  cartSubtotal.textContent = formatPrice(subtotal);

  if (cart.length === 0) {
    cartItemsElement.innerHTML = '<p class="cart-empty">Votre panier est encore vide.</p>';
    return;
  }

  cartItemsElement.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
          <img src="${item.image}" alt="" />
          <div class="cart-item-copy">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-category">${item.category}</p>
            <div class="quantity-controls" aria-label="Quantité de ${item.name}">
              <button type="button" data-quantity="${item.id}" data-change="-1" aria-label="Retirer un ${item.name}">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-quantity="${item.id}" data-change="1" aria-label="Ajouter un ${item.name}">+</button>
            </div>
          </div>
          <button class="remove-item" type="button" data-remove="${item.id}" aria-label="Supprimer ${item.name} du panier">Supprimer</button>
        </article>
      `,
    )
    .join("");
}

function openCart() {
  drawerBackdrop.hidden = false;
  requestAnimationFrame(() => {
    drawerBackdrop.classList.add("is-visible");
    cartDrawer.classList.add("is-open");
  });
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  drawerBackdrop.classList.remove("is-visible");
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  window.setTimeout(() => {
    if (!cartDrawer.classList.contains("is-open")) drawerBackdrop.hidden = true;
  }, 250);
  document.querySelector("#open-cart").focus();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.querySelector(".filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-button").forEach((filterButton) => {
    const isActive = filterButton === button;
    filterButton.classList.toggle("is-active", isActive);
    filterButton.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);

productsElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const product = products.find((item) => item.id === Number(button.dataset.add));
  if (!product) return;

  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
  showToast(`${product.name} ajouté au panier`);
});

cartItemsElement.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const productId = Number(quantityButton.dataset.quantity);
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    item.quantity += Number(quantityButton.dataset.change);
    if (item.quantity <= 0) cart = cart.filter((cartItem) => cartItem.id !== productId);
    renderCart();
    return;
  }

  if (removeButton) {
    cart = cart.filter((item) => item.id !== Number(removeButton.dataset.remove));
    renderCart();
  }
});

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) closeCart();
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#newsletter-note").textContent =
    "Merci ! Cette inscription est une démonstration : aucune donnée n’a été envoyée.";
  event.currentTarget.reset();
});

renderProducts();
renderCart();
