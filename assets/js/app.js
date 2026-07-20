const bookGrid = document.getElementById("bookGrid");

fetch("books/finish-what-you-start/books.json")
    .then(res => res.json())

    .then(books => {

        books.forEach(book => {

            bookGrid.innerHTML += `

            <article class="book-card">

                <div class="book-cover">
                    <img src="${book.cover}">
                </div>

                <h2>${book.title}</h2>

                <p> ${book.total_chapters} Chapters </p>

               <button onclick="openBook('${book.slug}')">
                    Continue Reading
                </button>

            </article>

        `;

        });

    });

function openBook(slug) {
    window.location.href = `reader.html?book=${slug}`;
}