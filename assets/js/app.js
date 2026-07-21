const bookGrid = document.getElementById("bookGrid");

fetch("assets/data/books.json")
    .then(response => {

        if (!response.ok) {

            throw new Error("books.json not found");

        }

        return response.json();

    })

    .then(books => {

        bookGrid.innerHTML = "";

        books.forEach(book => {

            bookGrid.innerHTML += `

            <article class="book-card">

                <div class="book-cover">

                    <img
                        src="${book.cover}"
                        alt="${book.title}"
                    >

                </div>

                <h2>${book.title}</h2>

                <p>${book.author}</p>

                <p>${book.total_chapters} Chapters</p>

                <button onclick="openBook('${book.slug}')">

                    Continue Reading

                </button>

            </article>

            `;

        });

    })

    .catch(error => {

        console.error(error);

        bookGrid.innerHTML = `

            <h2>Unable to load books.</h2>

            <p>${error.message}</p>

        `;

    });

function openBook(slug) {

    window.location.href = `reader.html?book=${slug}`;

}