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

const bookCover = document.getElementById("bookCover");
const chapterCount = document.getElementById("chapterCount");
const progressBar = document.getElementById("progressBar");

const chapterContent = document.getElementById("content");

const darkBtn = document.querySelector(
    '.reader-tools button[title="Dark Mode"]'
);

const bookmarkBtn = document.getElementById("bookmarkBtn");
// =========================================
// INIT
// =========================================

document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadBook();
    console.log(`book cover ${bookCover}`);
    bookCover.src = `books/${slug}/${currentBook.cover}`;

    prevBtn.addEventListener("click", previousChapter);
    nextBtn.addEventListener("click", nextChapter);

    loadTheme();

    darkBtn.addEventListener("click", toggleTheme);

    bookmarkBtn.addEventListener(
        "click",
        toggleBookmark
    );
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

        const savedChapter =
            localStorage.getItem(`book-${slug}`);

        if (savedChapter !== null) {

            openChapter(Number(savedChapter));

        } else {

            openChapter(0);

        }

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

        // Save Last Read Chapter
        localStorage.setItem(
            `book-${slug}`,
            currentChapter
        );

        // Update UI
        updateActiveChapter();
        updateNavigation();
        updateProgress();
        updateBookmarkIcon();

        chapterCount.textContent =
            `Chapter ${currentChapter + 1} / ${currentBook.chapters.length}`;

        const progress =
            ((currentChapter + 1) / currentBook.chapters.length) * 100;

        progressBar.style.width = progress + "%";

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

chapterContent.addEventListener("scroll", () => {

    const scrollTop = chapterContent.scrollTop;

    const scrollHeight =
        chapterContent.scrollHeight -
        chapterContent.clientHeight;

    if (scrollHeight <= 0) return;

    const percentage =
        (scrollTop / scrollHeight) * 100;

    console.log(
        "Reading Progress :",
        Math.round(percentage) + "%"
    );

});

// =========================================
// Progress
// =========================================

function updateProgress() {

    const percentage =
        ((currentChapter + 1) / currentBook.chapters.length) * 100;

    progressBar.style.width = percentage + "%";

    chapterCount.textContent =
        `Chapter ${currentChapter + 1} / ${currentBook.chapters.length}`;

}

// =========================================
// Theme
// =========================================

function loadTheme() {

    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
    }

}

function toggleTheme() {

    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

}

function toggleTheme() {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );

    darkBtn.textContent = isDark ? "☀️" : "🌙";

}

// =========================================
// Bookmark
// =========================================

function getBookmarks() {

    return JSON.parse(
        localStorage.getItem(`bookmark-${slug}`) || "[]"
    );

}

function saveBookmarks(bookmarks) {

    localStorage.setItem(
        `bookmark-${slug}`,
        JSON.stringify(bookmarks)
    );

}

function toggleBookmark() {

    let bookmarks = getBookmarks();

    if (bookmarks.includes(currentChapter)) {

        bookmarks = bookmarks.filter(
            chapter => chapter !== currentChapter
        );

    } else {

        bookmarks.push(currentChapter);

    }

    saveBookmarks(bookmarks);

    updateBookmarkIcon();

}

function updateBookmarkIcon() {

    const bookmarks = getBookmarks();

    bookmarkBtn.textContent =
        bookmarks.includes(currentChapter)
            ? "⭐"
            : "🔖";

}