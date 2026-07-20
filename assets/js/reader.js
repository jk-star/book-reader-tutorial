// =========================================
// BOOK READER ENGINE
// =========================================

// DOM
const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");
const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");

const prevBtn = document.getElementById("prevChapter");
const nextBtn = document.getElementById("nextChapter");

// URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("book");

// Global
let currentBook = null;
let currentChapter = 0;

// =========================================
// INIT
// =========================================

document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadBook();

    prevBtn.addEventListener("click", previousChapter);
    nextBtn.addEventListener("click", nextChapter);
}

// =========================================
// LOAD BOOK
// =========================================

async function loadBook() {

    try {

        const response = await fetch(`books/${slug}/book.json`);

        if (!response.ok) {
            throw new Error("book.json not found");
        }

        currentBook = await response.json();

        bookTitle.textContent = currentBook.title;
        bookAuthor.textContent = currentBook.author;

        createSidebar();

        openChapter(0);

    } catch (error) {

        console.error(error);

        content.innerHTML = `
            <h2>❌ Book Not Found</h2>
            <p>${error.message}</p>
        `;

    }

}

// =========================================
// SIDEBAR
// =========================================

function createSidebar() {

    sidebar.innerHTML = "";

    currentBook.chapters.forEach((chapter, index) => {

        const button = document.createElement("button");

        button.className = "chapter-btn";

        button.textContent = `${index + 1}. ${chapter.title}`;

        button.addEventListener("click", () => {

            openChapter(index);

        });

        sidebar.appendChild(button);

    });

}

// =========================================
// OPEN CHAPTER
// =========================================

async function openChapter(index) {

    currentChapter = index;

    const chapter = currentBook.chapters[index];

    try {

        const response = await fetch(`books/${slug}/${chapter.file}`);

        if (!response.ok) {

            throw new Error("Chapter file not found");

        }

        const markdown = await response.text();

        content.innerHTML = marked.parse(markdown);

        updateActiveChapter();

        updateNavigation();

    }

    catch (error) {

        console.error(error);

        content.innerHTML = `
            <h2>❌ Chapter Not Found</h2>
            <p>${chapter.file}</p>
        `;

    }

}

// =========================================
// ACTIVE BUTTON
// =========================================

function updateActiveChapter() {

    const buttons = document.querySelectorAll(".chapter-btn");

    buttons.forEach(btn => {

        btn.classList.remove("active");

    });

    if (buttons[currentChapter]) {

        buttons[currentChapter].classList.add("active");

    }

}

// =========================================
// NAVIGATION
// =========================================

function updateNavigation() {

    prevBtn.disabled = currentChapter === 0;

    nextBtn.disabled = currentChapter === currentBook.chapters.length - 1;

}

function previousChapter() {

    if (currentChapter > 0) {

        openChapter(currentChapter - 1);

    }

}

function nextChapter() {

    if (currentChapter < currentBook.chapters.length - 1) {

        openChapter(currentChapter + 1);

    }

}