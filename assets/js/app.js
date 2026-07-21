const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");

let books = [];

fetch("assets/data/books.json")
    .then(res => res.json())
    .then(data => {

        books = data;

        renderBooks(books);

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

    renderBooks(filteredBooks);

});

function openBook(slug) {

    window.location.href = `reader.html?book=${slug}`;

}