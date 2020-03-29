'use strict';

var gBooks;
var gSortInAscending = true;
var gCurrentPage = 1;

const KEY = 'books';
const BOOKS_PER_PAGE = 3;

function creatBooks() {
    var books = loadFromStorage(KEY);
    if (!books || !books.length || books === null) books = [];
    gBooks = books;
    _saveCarsToStorage();
}

function _createBook(title, price) {
    return {
        id: makeId(),
        title: title,
        price: price,
        desc: makeLorem(),
        img: getRandomIntInclusive(0, 5),
        rating: 0
    };
}

function addBook(title, price) {
    const book = _createBook(title, price);
    gBooks.push(book);
    _saveCarsToStorage();
}

function deleteBook(bookId) {
    var bookIdx = getBookById(bookId);
    gBooks.splice(bookIdx, 1);
    _saveCarsToStorage();
}

function saveChangesInBook(book) {
    const bookIdx = getBookIdx(book.id);
    getBooks[bookIdx] = book;
    _saveCarsToStorage();
}

function getCurrentBooks() {
    const indexOfLastBook = gCurrentPage * BOOKS_PER_PAGE;
    const indexOfFirstBook = indexOfLastBook - BOOKS_PER_PAGE;
    const currentBooks = gBooks.slice(indexOfFirstBook, indexOfLastBook);
    return currentBooks;
}

function getBooks() {
    return gBooks;
}

function getBookById(bookId) {
    return gBooks.find(book => bookId.toString() === book.id);
}

function getBookByTitle(bookTitle) {
    return gBooks.find(book => bookTitle === book.title);
}

function getBookIdx(bookId) {
    return gBooks.findIndex(book => bookId.toString() === book.id);
}

function getBooksPerPage() {
    return BOOKS_PER_PAGE;
}

function getBooksSortingBy(field) {
    if (gSortInAscending) {
        ascendingSort(gBooks, field);
        gSortInAscending = false;
    } else {
        descendingSort(gBooks, field);
        gSortInAscending = true;
    }
}

function getCurrentPage() {
    return gCurrentPage;
}

function setCurrentPage(pageNumber) {
    gCurrentPage = pageNumber;
}

function setRateBook(value, bookTitle) {
    var bookToSet = getBookByTitle(bookTitle);
    var bookIdx = gBooks.findIndex(book => book.title === bookToSet.title);
    gBooks[bookIdx].rating = value;
    _saveCarsToStorage();
}

function _saveCarsToStorage() {
    saveToStorage(KEY, gBooks);
}
