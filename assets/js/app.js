const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");

const categoryContainer = document.getElementById("categoryContainer");

let books = [];
let currentCategory = "All";

fetch("assets/data/books.json")
    .then(res => res.json())
    .then(data => {

        books = data;

        //renderBooks(books);

        createCategories();
        filterBooks();

    });

function renderBooks(bookList) {

    bookGrid.innerHTML = "";

    if (bookList.length === 0) {
        bookGrid.innerHTML = `
            <div class="empty-books">
                <h2>📚 No Books Found</h2>
                <p>Try another keyword.</p>
            </div>
        `;
        return;
    }

    bookList.forEach(book => {
        bookGrid.innerHTML += `
        <article class="book-card">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}">
            </div>

            <h2>${book.title}</h2>

            <p>${book.author}</p>

            <p>${book.category}</p>

            <p>${book.total_chapters} Chapters</p>

            <button onclick="openBook('${book.slug}')">
                Continue Reading
            </button>
        </article>`;
    });

}


searchInput.addEventListener("input", function () {

    const keyword = this.value.toLowerCase();

    const filteredBooks = books.filter(book => {

        return (

            book.title.toLowerCase().includes(keyword)

            ||

            book.author.toLowerCase().includes(keyword)

            ||

            book.category.toLowerCase().includes(keyword)

        );

    });

    //renderBooks(filteredBooks);
    searchInput.addEventListener("input", () => {
        filterBooks();
    });

});

function openBook(slug) {

    window.location.href = `reader.html?book=${slug}`;

}

function createCategories() {

    const categories = [

        "All",

        ...new Set(

            books.map(book => book.category)

        )

    ];

    categoryContainer.innerHTML = "";

    categories.forEach(category => {

        const btn = document.createElement("button");
        btn.className = "category-btn";

        if (category === currentCategory) {
            btn.classList.add("active");
        }

        btn.textContent = category;
        btn.onclick = () => {
            currentCategory = category;
            filterBooks();
        };

        categoryContainer.appendChild(btn);

    });

}

function filterBooks() {

    let filtered = [...books];

    // Category Filter

    if (currentCategory !== "All") {
        filtered = filtered.filter(book =>
            book.category === currentCategory
        );
    }

    // Search Filter

    const keyword =
        searchInput.value.toLowerCase();

    if (keyword) {
        filtered = filtered.filter(book =>
            book.title.toLowerCase().includes(keyword)
            ||
            book.author.toLowerCase().includes(keyword)
            ||
            book.category.toLowerCase().includes(keyword)
        );
    }

    renderBooks(filtered);
    createCategories();

}