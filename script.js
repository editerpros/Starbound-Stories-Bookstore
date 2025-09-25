// Hide splash after delay
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
  }, 3500);
});

// Book Data
const books = [
  {
    title: "Beyond The Horizon of Space: A Journey into the Unknown Universe",
    author: "Advait S",
    genre: "Fiction",
    price: "Free",
    cover: "images/Beyondthehorizonofspace.jpg",
    link: "https://www.patreon.com/posts/beyond-horizon-139032647?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=postshare_creator&utm_content=join_link"
  }
  
];

// Render Books
function renderBooks(filter = "all", search = "") {
  const list = document.getElementById("book-list");
  list.innerHTML = "";

  books
    .filter(b => (filter === "all" || b.genre === filter))
    .filter(b => b.title.toLowerCase().includes(search) || b.author.toLowerCase().includes(search))
    .forEach(book => {
      const card = document.createElement("div");
      card.classList.add("book-card");

      card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p class="price">${book.price}</p>
        ${book.price === "FREE" 
          ? `<a href="${book.link}" class="btn free">📖 Read Free</a>` 
          : `<a href="${book.link}" target="_blank" class="btn buy">Buy</a>`}
      `;

      list.appendChild(card);
    });
}

// Default Load
document.addEventListener("DOMContentLoaded", () => {
  renderBooks();

  // Search & Filter
  document.getElementById("search").addEventListener("input", e => {
    renderBooks(document.getElementById("genre-filter").value, e.target.value.toLowerCase());
  });

  document.getElementById("genre-filter").addEventListener("change", e => {
    renderBooks(e.target.value, document.getElementById("search").value.toLowerCase());
  });
});


