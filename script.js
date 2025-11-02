/* ------------------------------------------------------------------
   Starbound Stories — Enhanced & Fixed script.js
   Theme: Dark blue + neon cyan
   ------------------------------------------------------------------ */

/* -------------------------
   Book Data
   ------------------------- */
const books = [
  {
    title: "𝗘𝗖𝗟𝗜𝗣𝗦𝗘𝗥𝗔-𝗧𝗛𝗘 𝗧𝗥𝗘𝗔𝗦𝗨𝗥𝗘 𝗢𝗙 𝗦𝗛𝗔𝗗𝗢𝗪𝗦",
    author: "Aradhya S",
    genre: "Fantasy",
    price: 0,
    cover: "https://c10.patreonusercontent.com/4/patreon-media/p/post/142633367/5f3d3ab7e66444d88a2cc5bd637f36d8/eyJ3Ijo2MjB9/1.png?token-hash=1fwOQDtK7cRxACP8iuDpbfVLjElDP-KLvZPQPHyb3AY%3D&token-time=1763337600",
    link: "https://www.patreon.com/posts/142633367",
    description: "",
    featured: true
  },
  {
    title: "Beyond The Horizon of Space: A Journey into the Unknown Universe",
    author: "Advait S",
    genre: "Fiction",
    price: 0,
    cover: "https://images.unsplash.com/photo-1447433819943-74a20887a81e?auto=format&fit=crop&w=600&q=80",
    link: "https://www.patreon.com/posts/beyond-horizon-139032647?source=storefront",
    description: "An epic tale of exploration and discovery in the uncharted reaches of the cosmos.",
    featured: true
  }
];

/* -------------------------
   State & Utilities
   ------------------------- */
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let theme = localStorage.getItem("theme") || "dark";
const favCountEl = document.getElementById("fav-count");

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavCount();
}

function updateFavCount() {
  if (favCountEl) favCountEl.textContent = favorites.length;
}

function formatPrice(price) {
  return price === 0 ? "FREE" : `$${price.toFixed(2)}`;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

/* -------------------------
   Render Books
   ------------------------- */
function renderBooks({ targetEl, list }) {
  const container = targetEl || document.getElementById("book-list");
  container.innerHTML = "";

  list.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      ${book.featured ? '<div class="featured">FEATURED</div>' : ""}
      <button class="favorite-btn ${favorites.includes(book.title) ? "favorited" : ""}" aria-label="Toggle favorite">❤️</button>
      <img src="${book.cover}" loading="lazy" alt="Cover of ${escapeHtml(book.title)}">
      <h3>${escapeHtml(book.title)}</h3>
      <p>${escapeHtml(book.author)}</p>
      <p class="price">${formatPrice(book.price)}</p>
      <div class="card-actions">
        ${
          book.price === 0
            ? `<a href="${book.link}" class="btn free" target="_blank" rel="noopener">📖 Read Free</a>`
            : `<a href="${book.link}" class="btn buy" target="_blank" rel="noopener">Buy on Patreon</a>`
        }
      </div>
    `;

    // Favorite button
    const favBtn = card.querySelector(".favorite-btn");
    favBtn.addEventListener("click", () => {
      if (favorites.includes(book.title)) {
        favorites = favorites.filter(fav => fav !== book.title);
        favBtn.classList.remove("favorited");
      } else {
        favorites.push(book.title);
        favBtn.classList.add("favorited");
      }
      saveFavorites();
      renderCurrentView();
    });

    // Modal trigger
    card.querySelector("img").addEventListener("click", () => showModal(book));
    card.querySelector("h3").addEventListener("click", () => showModal(book));

    container.appendChild(card);
  });
}

/* -------------------------
   Modal Logic
   ------------------------- */
const modal = document.getElementById("book-modal");
const modalClose = document.querySelector(".close-modal");

function showModal(book) {
  document.getElementById("modal-cover").src = book.cover;
  document.getElementById("modal-title").textContent = book.title;
  document.getElementById("modal-author").textContent = `Author: ${book.author}`;
  document.getElementById("modal-price").textContent = formatPrice(book.price);
  document.getElementById("modal-description").textContent = book.description;
  const link = document.getElementById("modal-link");
  link.href = book.link;
  link.textContent = book.price === 0 ? "Read Free" : "Buy on Patreon";
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

if (modalClose) modalClose.addEventListener("click", closeModal);
window.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.style.display === "flex") closeModal();
});

/* -------------------------
   Views & Filters
   ------------------------- */
function setActiveView(id) {
  document.querySelectorAll(".view").forEach(v => {
    v.hidden = v.id !== id;
  });
}

function renderCurrentView() {
  const activeView = document.querySelector(".view:not([hidden])")?.id || "home";

  if (activeView === "home") {
    const genre = document.getElementById("genre-filter")?.value || "all";
    const search = document.getElementById("search")?.value.trim().toLowerCase() || "";
    const sort = document.getElementById("sort-filter")?.value || "default";

    let list = books
      .filter(b => genre === "all" || b.genre === genre)
      .filter(b => b.title.toLowerCase().includes(search) || b.author.toLowerCase().includes(search));

    switch (sort) {
      case "price-low": list.sort((a, b) => a.price - b.price); break;
      case "price-high": list.sort((a, b) => b.price - a.price); break;
      case "title-az": list.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "title-za": list.sort((a, b) => b.title.localeCompare(a.title)); break;
      case "author-az": list.sort((a, b) => a.author.localeCompare(b.author)); break;
      case "author-za": list.sort((a, b) => b.author.localeCompare(a.author)); break;
    }

    const listEl = document.getElementById("book-list");
    const noResults = document.getElementById("no-results");
    if (list.length === 0) {
      if (noResults) noResults.hidden = false;
      listEl.innerHTML = "";
    } else {
      if (noResults) noResults.hidden = true;
      renderBooks({ targetEl: listEl, list });
    }
  }

  if (activeView === "favorites") {
    const favList = books.filter(b => favorites.includes(b.title));
    const favContainer = document.getElementById("favorites-list");
    const noFav = document.getElementById("no-favorites");
    if (favList.length === 0) {
      if (favContainer) favContainer.innerHTML = "";
      if (noFav) noFav.hidden = false;
    } else {
      if (noFav) noFav.hidden = true;
      renderBooks({ targetEl: favContainer, list: favList });
    }
  }
}

/* -------------------------
   Search Suggestions
   ------------------------- */
const searchInput = document.getElementById("search");
const suggestionsEl = document.getElementById("suggestions");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      suggestionsEl.hidden = true;
      renderCurrentView();
      return;
    }

    const matches = books
      .filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .slice(0, 6);

    if (matches.length === 0) {
      suggestionsEl.hidden = true;
    } else {
      suggestionsEl.innerHTML = matches
        .map(m => `<li>${escapeHtml(m.title)} — ${escapeHtml(m.author)}</li>`)
        .join("");
      suggestionsEl.hidden = false;
      suggestionsEl.querySelectorAll("li").forEach((li, i) => {
        li.addEventListener("click", () => {
          searchInput.value = matches[i].title;
          suggestionsEl.hidden = true;
          renderCurrentView();
        });
      });
    }
    renderCurrentView();
  });
}

/* -------------------------
   Nav, Filters, and Sorts
   ------------------------- */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view || btn.textContent.toLowerCase();
    setActiveView(view);
    renderCurrentView();
  });
});

["genre-filter", "sort-filter"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", renderCurrentView);
});

/* -------------------------
   Mobile Menu Toggle
   ------------------------- */
const menuToggle = document.getElementById("menu-toggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const mobile = document.getElementById("mobile-menu");
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobile.hidden = !mobile.hidden;
  });
}

/* -------------------------
   Theme Toggle
   ------------------------- */
const themeToggle = document.getElementById("theme-toggle");
function applyTheme() {
  if (theme === "light") {
    document.documentElement.classList.add("light");
    themeToggle.textContent = "☀️";
    themeToggle.setAttribute("aria-pressed", "true");
  } else {
    document.documentElement.classList.remove("light");
    themeToggle.textContent = "🌙";
    themeToggle.setAttribute("aria-pressed", "false");
  }
}
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme);
    applyTheme();
  });
}
applyTheme();

/* -------------------------
   Starfield Animation
   ------------------------- */
function startStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 1.5 + 0.3,
    s: Math.random() * 1.2 + 0.2
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.x += 0.1 * s.z;
      s.y += 0.02 * s.z;
      if (s.x > w) s.x = 0;
      if (s.y > h) s.y = 0;
      const size = s.s * s.z;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.6 * s.z})`;
      ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* -------------------------
   Initialization (splash fix)
   ------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");
  const year = document.getElementById("year");

  const hideSplash = () => {
    if (!splash) return;
    splash.style.transition = "opacity 0.8s ease";
    splash.style.opacity = 0;
    setTimeout(() => (splash.style.display = "none"), 800);
  };

  try {
    updateFavCount();
    if (year) year.textContent = new Date().getFullYear();
    renderCurrentView();
    startStarfield();
  } catch (err) {
    console.error("Init error:", err);
  } finally {
    setTimeout(hideSplash, 1200);
  }
});

