const bookGrid = document.getElementById("bookGrid");

fetch("assest/data/books.json")
    .then(res => res.json())

    .then(books => {

        books.forEach(book => {

            bookGrid.innerHTML += `

        <article class="book-card">

            <div
            class="book-cover"

            style="background:${book.themeColor}">

            📘

            </div>

            <h2>

            ${book.title}

            </h2>

            <p>

            ${book.chapters} Chapters

            </p>

            <button>

            Continue Reading

            </button>

        </article>

        `;

        });

    });
