// ====== إعدادات ======
const WHATSAPP_NUMBER = "201000000000"; // غيّره برقمك (بكود الدولة من غير +)

// ====== المنتجات (عدّل الصور والأسعار من هنا) ======
const products = [
  { id: 1, name: "تيشيرت أبيض كلاسيك", price: 250, cat: "tshirt", img: "https://picsum.photos/seed/tshirt1/400/500" },
  { id: 2, name: "تيشيرت أسود بيسك",   price: 270, cat: "tshirt", img: "https://picsum.photos/seed/tshirt2/400/500" },
  { id: 3, name: "تيشيرت أوفر سايز",    price: 320, cat: "tshirt", img: "https://picsum.photos/seed/tshirt3/400/500" },
  { id: 4, name: "بنطلون جينز",        price: 550, cat: "pants",  img: "https://picsum.photos/seed/pants1/400/500" },
  { id: 5, name: "بنطلون كارجو",       price: 600, cat: "pants",  img: "https://picsum.photos/seed/pants2/400/500" },
  { id: 6, name: "بنطلون قماش",        price: 520, cat: "pants",  img: "https://picsum.photos/seed/pants3/400/500" },
  { id: 7, name: "جاكيت جينز",         price: 850, cat: "jacket", img: "https://picsum.photos/seed/jacket1/400/500" },
  { id: 8, name: "جاكيت شتوي",         price: 1100, cat: "jacket", img: "https://picsum.photos/seed/jacket2/400/500" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ====== عناصر الصفحة ======
const grid = document.getElementById("productGrid");
const cartEl = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

// ====== عرض المنتجات ======
function renderProducts(cat = "all") {
  const list = cat === "all" ? products : products.filter(p => p.cat === cat);
  grid.innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="price">${p.price} جنيه</p>
        <button class="btn" onclick="addToCart(${p.id})">أضف للسلة</button>
      </div>
    </div>
  `).join("");
}

// ====== الفلتر ======
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    renderProducts(btn.dataset.cat);
  });
});

// ====== السلة ======
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  openCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty">السلة فاضية</p>';
  } else {
    cartItemsEl.innerHTML = cart.map(c => {
      const p = products.find(x => x.id === c.id);
      return `
        <div class="cart-item">
          <img src="${p.img}" alt="${p.name}">
          <div class="info">
            <div>${p.name}</div>
            <div>${p.price} جنيه</div>
            <div class="qty">
              <button onclick="changeQty(${p.id}, 1)">+</button>
              <span>${c.qty}</span>
              <button onclick="changeQty(${p.id}, -1)">-</button>
            </div>
          </div>
          <button class="remove" onclick="removeItem(${p.id})">🗑</button>
        </div>`;
    }).join("");
  }

  const total = cart.reduce((sum, c) => sum + products.find(x => x.id === c.id).price * c.qty, 0);
  const count = cart.reduce((sum, c) => sum + c.qty, 0);
  cartTotal.textContent = total;
  cartCount.textContent = count;
}

function openCart() { cartEl.classList.add("open"); overlay.classList.add("show"); }
function closeCart() { cartEl.classList.remove("open"); overlay.classList.remove("show"); }

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// ====== الطلب عبر واتساب ======
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) return alert("السلة فاضية!");
  let msg = "مرحباً، عايز أطلب:\n\n";
  cart.forEach(c => {
    const p = products.find(x => x.id === c.id);
    msg += `• ${p.name} × ${c.qty} = ${p.price * c.qty} جنيه\n`;
  });
  msg += `\nالإجمالي: ${cartTotal.textContent} جنيه`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
});

// ====== تشغيل ======
renderProducts();
renderCart();