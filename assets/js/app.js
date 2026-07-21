const bookGrid = document.getElementById("bookGrid");

fetch("books/finish-what-you-start/book.json")
    .then(res => {
        if (!res.ok) {
            throw new Error("Book not found");
        }
        return res.json();
    })
    .then(book => {

        bookGrid.innerHTML = `
            <article class="book-card">

                <div class="book-cover">
                    <img src="books/finish-what-you-start/${book.cover}"
                         alt="${book.title}">
                </div>

                <h2>${book.title}</h2>

                <p>${book.author}</p>

                <p>${book.chapters.length} Chapters</p>

                <button onclick="openBook('${book.slug}')">
                    Continue Reading
                </button>

            </article>
        `;

    })
    .catch(error => {

        console.error(error);

        bookGrid.innerHTML = `
            <h2>❌ Unable to load book</h2>
            <p>${error.message}</p>
        `;

    });

function openBook(slug) {
    window.location.href = `reader.html?book=${slug}`;
}