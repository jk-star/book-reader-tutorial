// =========================================
// DOM ELEMENTS
// =========================================

const bookGrid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");
const categoryContainer = document.getElementById("categoryContainer");
const sortBooks = document.getElementById("sortBooks");
const continueReading = document.getElementById("continueReading");
const favoriteOnly = document.getElementById("favoriteOnly");

const totalBooks = document.getElementById("totalBooks");
const favoriteCount = document.getElementById("favoriteCount");
const readingCount = document.getElementById("readingCount");
const completedCount = document.getElementById("completedCount");

// =========================================
// GLOBAL VARIABLES
// =========================================

let books = [];
let currentCategory = "All";

// =========================================
// LOAD BOOKS
// =========================================

fetch("assets/data/books.json")
    .then(res => {

        if (!res.ok) {
            throw new Error("Unable to load books.json");
        }

        return res.json();

    })
    .then(data => {

        books = data;

        createCategories();
        filterBooks();
        renderContinueReading();
        updateDashboard();

    })
    .catch(error => {

        console.error(error);

        bookGrid.innerHTML = `
            <h2>Unable to load books.</h2>
            <p>${error.message}</p>
        `;

    });

// =========================================
// RENDER BOOKS
// =========================================

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

        const isFavorite = getFavorites().includes(book.slug);

        bookGrid.innerHTML += `

        <article class="book-card">

            <button
                class="favorite-btn"
                onclick="toggleFavorite('${book.slug}')">

                ${isFavorite ? "❤️" : "🤍"}

            </button>

            <div class="book-cover">

                <img
                    src="${book.cover}"
                    alt="${book.title}">

            </div>

            <h2>${book.title}</h2>

            <p>${book.author}</p>

            <p class="book-rating">

                ⭐ ${book.rating}

            </p>

            <p>${book.category}</p>

            <p>${book.total_chapters} Chapters</p>

            <button onclick="openBook('${book.slug}')">

                Continue Reading

            </button>

        </article>

        `;

    });

}

// =========================================
// CONTINUE READING
// =========================================

function renderContinueReading() {

    let lastBook = null;
    let lastChapter = -1;

    books.forEach(book => {

        const chapter =
            localStorage.getItem(`book-${book.slug}`);

        if (chapter !== null) {

            lastBook = book;
            lastChapter = Number(chapter);

        }

    });

    if (!lastBook) {

        continueReading.innerHTML = "";

        return;

    }

    const progress = Math.round(

        ((lastChapter + 1) /
            lastBook.total_chapters) * 100

    );

    continueReading.innerHTML = `

        <div class="continue-card">

            <img
                src="${lastBook.cover}"
                alt="${lastBook.title}">

            <div>

                <h2>Continue Reading</h2>

                <h3>${lastBook.title}</h3>

                <p>

                    Last Read :
                    Chapter ${lastChapter + 1}

                </p>

                <p>

                    Progress :
                    ${progress}%

                </p>

                <button
                    onclick="openBook('${lastBook.slug}')">

                    Continue Reading →

                </button>

            </div>

        </div>

    `;

}

// =========================================
// CATEGORY BUTTONS
// =========================================

function createCategories() {

    const categories = [

        "All",

        ...new Set(

            books.map(book => book.category)

        )

    ];

    categoryContainer.innerHTML = "";

    categories.forEach(category => {

        const button = document.createElement("button");

        button.className = "category-btn";

        if (category === currentCategory) {

            button.classList.add("active");

        }

        button.textContent = category;

        button.onclick = () => {

            currentCategory = category;

            filterBooks();

        };

        categoryContainer.appendChild(button);

    });

}

// =========================================
// FILTER + SEARCH + SORT
// =========================================

function filterBooks() {

    let filtered = [...books];

    // Category

    if (currentCategory !== "All") {

        filtered = filtered.filter(book =>

            book.category === currentCategory

        );

    }

    // Search

    const keyword = searchInput.value.toLowerCase();

    if (keyword) {

        filtered = filtered.filter(book =>

            book.title.toLowerCase().includes(keyword)

            ||

            book.author.toLowerCase().includes(keyword)

            ||

            book.category.toLowerCase().includes(keyword)

        );

    }

    // Favorites

    if (favoriteOnly.checked) {

        const favorites = getFavorites();

        filtered = filtered.filter(book =>

            favorites.includes(book.slug)

        );

    }

    // Sorting

    switch (sortBooks.value) {

        case "az":

            filtered.sort((a, b) =>

                a.title.localeCompare(b.title)

            );

            break;

        case "za":

            filtered.sort((a, b) =>

                b.title.localeCompare(a.title)

            );

            break;

        case "author":

            filtered.sort((a, b) =>

                a.author.localeCompare(b.author)

            );

            break;

        case "rating":

            filtered.sort((a, b) =>

                b.rating - a.rating

            );

            break;

        case "chapters":

            filtered.sort((a, b) =>

                b.total_chapters - a.total_chapters

            );

            break;

    }

    renderBooks(filtered);

    createCategories();

}

// =========================================
// FAVORITES
// =========================================

function getFavorites() {

    return JSON.parse(

        localStorage.getItem("favorites") || "[]"

    );

}

function saveFavorites(favorites) {

    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );

}

function toggleFavorite(slug) {

    let favorites = getFavorites();

    if (favorites.includes(slug)) {

        favorites = favorites.filter(

            item => item !== slug

        );

    }

    else {

        favorites.push(slug);

    }

    saveFavorites(favorites);

    filterBooks();

}

// =========================================
// OPEN BOOK
// =========================================

function openBook(slug) {

    window.location.href = `reader.html?book=${slug}`;

}

// =========================================
// EVENTS
// =========================================

searchInput.addEventListener("input", filterBooks);

sortBooks.addEventListener("change", filterBooks);

favoriteOnly.addEventListener("change", filterBooks);


function updateDashboard() {

    totalBooks.textContent = books.length;

    favoriteCount.textContent = getFavorites().length;

    let reading = 0;
    let completed = 0;

    books.forEach(book => {

        const chapter = localStorage.getItem(`book-${book.slug}`);

        if (chapter !== null) {

            reading++;

            if (Number(chapter) + 1 >= book.total_chapters) {

                completed++;

            }

        }

    });

    readingCount.textContent = reading;

    completedCount.textContent = completed;

}