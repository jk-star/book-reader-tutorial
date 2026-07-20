// =======================================
// Book Reader Engine
// =======================================

// ---------- DOM Elements ----------
const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");
const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");

// ---------- URL ----------
const params = new URLSearchParams(window.location.search);
const slug = params.get("book");

// ---------- Global Variables ----------
let currentBook = null;
let currentChapter = 0;

// ---------- Start ----------
document.addEventListener("DOMContentLoaded", () => {
    loadBook();
});

// =======================================
// Load Book
// =======================================

async function loadBook() {

    try {

        const response = await fetch(`books/${slug}/book.json`);

        if (!response.ok) {
            throw new Error("book.json not found");
        }

        currentBook = await response.json();

        // Book Info
        bookTitle.textContent = currentBook.title;
        bookAuthor.textContent = currentBook.author;

        // Sidebar
        createSidebar();

        // First Chapter
        openChapter(0);

    } catch (error) {

        console.error(error);

        content.innerHTML = `
            <h2>❌ Book Not Found</h2>
            <p>${error.message}</p>
        `;

    }

}

// =======================================
// Sidebar
// =======================================

function createSidebar() {

    sidebar.innerHTML = "";

    currentBook.chapters.forEach((chapter, index) => {

        const button = document.createElement("button");

        button.className = "chapter-btn";

        button.textContent = chapter.title;

        button.addEventListener("click", () => {

            openChapter(index);

        });

        sidebar.appendChild(button);

    });

}

// =======================================
// Open Chapter
// =======================================

async function openChapter(index) {

    currentChapter = index;

    const chapter = currentBook.chapters[index];

    try {

        const response = await fetch(`books/${slug}/${chapter.file}`);

        if (!response.ok) {

            throw new Error("Chapter not found");

        }

        const markdown = await response.text();

        content.innerHTML = marked.parse(markdown);

        updateActiveChapter();

    }

    catch (error) {

        console.error(error);

        content.innerHTML = `
            <h2>❌ Chapter Not Found</h2>
            <p>${chapter.file}</p>
        `;

    }

}

// =======================================
// Active Chapter
// =======================================

function updateActiveChapter() {

    const buttons = document.querySelectorAll(".chapter-btn");

    buttons.forEach((btn, index) => {

        if (index === currentChapter) {

            btn.classList.add("active");

        } else {

            btn.classList.remove("active");

        }

    });

}