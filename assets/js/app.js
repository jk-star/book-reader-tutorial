const bookGrid = document.getElementById("bookGrid");

fetch("assets/data/books.json")
    .then(res => res.json())

    .then(books => {
        
        books.forEach(book => {

            bookGrid.innerHTML += `

            <article class="book-card">

                <div class="book-cover">
                    <img src="${book.cover}">
                </div>

                <h2>${book.title}</h2>

                <p> ${book.chapters} Chapters </p>

                <button> Continue Reading </button>

            </article>

        `;

        });

    });
