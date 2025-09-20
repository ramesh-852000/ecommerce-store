// Sample product data
const products = [
    { name: "Digital Camera", price: 99, category: "electronics", img: "images/product1.jpg" },
    { name: "Headphones", price: 69, category: "electronics", img: "images/product2.jpg" },
    { name: "Smartwatch", price: 49, category: "fashion", img: "images/product3.jpg" },
    { name: "Photography", price: 59, category: "fashion", img: "images/product4.jpg" },
    { name: "Laptop", price: 119, category: "accessories", img: "images/product5.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Cart Functions
function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartLink = document.querySelector('.nav-links li a[href="cart.html"]');
    if (cartLink) cartLink.textContent = `Cart (${count})`;
}

function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

function displayCart() {
    const cartContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    if (!cartContainer) return;
    cartContainer.innerHTML = "";
    if (cart.length === 0) { cartContainer.innerHTML = "<p>Your cart is empty.</p>"; cartTotal.textContent = "0"; return; }
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
      <div><h4>${item.name}</h4><p>$${item.price} x ${item.quantity}</p></div>
      <div>
        <button onclick="changeQuantity(${index},'decrease')">-</button>
        <button onclick="changeQuantity(${index},'increase')">+</button>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
        cartContainer.appendChild(div);
    });
    cartTotal.textContent = total.toFixed(2);
}

function changeQuantity(index, action) {
    if (action === "increase") cart[index].quantity += 1;
    else if (action === "decrease" && cart[index].quantity > 1) cart[index].quantity -= 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Checkout
const checkoutForm = document.querySelector(".checkout-form");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", e => {
        e.preventDefault();
        alert("✅ Order placed successfully!");
        cart = []; localStorage.removeItem("cart"); updateCartCount();
        window.location.href = "index.html";
    });
}

// Filters + Render
function renderProducts(productList) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = "";
    productList.forEach(prod => {
        const div = document.createElement("div");
        div.classList.add("product-card");
        div.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}">
      <h3>${prod.name}</h3>
      <p class="price">$${prod.price}</p>
      <button class="btn-secondary">Add to Cart</button>
    `;
        grid.appendChild(div);
    });
    document.querySelectorAll(".btn-secondary").forEach(btn => {
        btn.addEventListener("click", e => {
            const card = e.target.closest(".product-card");
            const name = card.querySelector("h3").textContent;
            const price = parseFloat(card.querySelector(".price").textContent.replace("$", ""));
            const img = card.querySelector("img").src;
            addToCart({ name, price, img });
        });
    });
}

function filterProducts() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const priceRange = document.getElementById("priceFilter").value;
    let filtered = products.filter(p => p.name.toLowerCase().includes(search));
    if (category !== "all") filtered = filtered.filter(p => p.category === category);
    if (priceRange === "low") filtered = filtered.filter(p => p.price < 50);
    else if (priceRange === "medium") filtered = filtered.filter(p => p.price >= 50 && p.price <= 100);
    else if (priceRange === "high") filtered = filtered.filter(p => p.price > 100);
    renderProducts(filtered);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayCart();
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    if (searchInput) searchInput.addEventListener("input", filterProducts);
    if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
    if (priceFilter) priceFilter.addEventListener("change", filterProducts);
    if (document.getElementById("productGrid")) renderProducts(products);
});
