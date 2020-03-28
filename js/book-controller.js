'use strict';

function onInit() {
    creatBooks();
    booksToDisplay();
}

function booksToDisplay() {
    if (!getBooks().length) {
        document.querySelector('.no-books-modal').innerHTML = 'There are no books in store';
        document.querySelector('.no-books-modal').style.display = 'block';
    } else {
        document.querySelector('.no-books-modal').style.display = 'none';
        renderBooks();
    }
}

function renderBooks() {
    var books = getCurrentBooks();
    var strHtmls = books.map(
        book => `<tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.price}$</td>
                    <td>
                        <button class="actions-btn read" onclick=onReadBook(${book.id})>Read</button>
                        <button class="actions-btn update" onclick=onUpdateBook(${book.id})>Update</button>
                        <button class="actions-btn delete" onclick="onDeleteBook(event,${book.id})">Delete</button>
                    </td>
                </tr>`
    );
    document.querySelector('.book-list').innerHTML = strHtmls.join('');
    onPagination();
}

function onAddBook() {
    var title = document.querySelector('#title').value;
    var price = document.querySelector('#price').value;
    if (title === '' || price === '') showAlert('inValidInputs');
    else {
        addBook(title, price);
        showAlert('success');
        onClearFields();
        booksToDisplay();
    }
}

function onDeleteBook(bookId) {
    if (getCurrentBooks().length === 1) onChangePage(getCurrentPage() - 1);
    deleteBook(bookId);
    showAlert('success');
    booksToDisplay();
}

function onUpdateBook(bookId) {
    var strHtml = ` <div class="update-book-form">
                        <div class="modal-header">
                            <span onclick="onCloseModal()" class="close-modal-btn">&times;</span>
                         </div>
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" name="title" class="form-control update-title" />
                        </div>
                        <div class="form-group">
                            <label for="price">Price</label>
                            <input type="text" name="price" class="form-control update-price" />
                        </div>
                        <button onclick="onSaveBook(${bookId})" class="btn save">Save</button>
                    </div> 
    `;
    document.querySelector('.update-modal').innerHTML = strHtml;
    document.querySelector('.update-modal').style.display = 'block';
    var book = getBookById(bookId);
    document.querySelector('input[name="title"]').value = book.title;
    document.querySelector('input[name="price"]').value = book.price;
}

function onSaveBook(bookId) {
    var book = getBookById(bookId);
    book.title = document.querySelector('input[name="title"]').value;
    book.price = document.querySelector('input[name="price"]').value;
    if (book.price === '' || book.title === '') {
        showAlert('inValidInputs');
    } else {
        saveChangesInBook(book);
        showAlert('success');
        booksToDisplay();
        document.querySelector('.update-modal').style.display = 'none';
    }
}

function onReadBook(bookId) {
    document.querySelector('.read-modal').style.display = 'block';
    const book = getBookById(bookId);
    var strHtml = ` <div class="modal-content">
                        <div class="modal-read-header">
                            <span onclick="onCloseModal()" class="close-modal-btn">&times;</span>
                            <h2>${book.title}</h2>
                        </div>
                        <div class="modal-body">
                            <img src="img/books/${book.img}.jpg" width="100" height="100"/>
                            <p>${book.desc}</p>
                        </div>
                        <div class="modal-footer">
                            <span>Your Rate: </span>
                            <input type="number" name="rating" class="rating" value="${book.rating}">
                            <button class="rate-btn" onclick="onRateBook()">Save</button>
                            <span class="save-rate-success"></span>
                            <h3>Price: ${book.price}$</h3>
                        </div>
                    </div>
                  `;
    document.querySelector('.read-modal').innerHTML = strHtml;
}

function onSort(el) {
    getBooksSortingBy(el.innerText);
    booksToDisplay();
}

function onRateBook() {
    const bookTitle = document.querySelector('.modal-read-header h2').innerText;
    const userRating = document.querySelector('input[class="rating"]').value;
    setRateBook(userRating, bookTitle);
    document.querySelector('.save-rate-success').style.display = 'block';
    document.querySelector('.save-rate-success').innerText =
        'Your Rate Has Been Saved';
    setTimeout(
        () => (document.querySelector('.save-rate-success').style.display = 'none'),
        3000
    );
}

function onClearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#price').value = '';
}

function showAlert(message) {
    if (message === 'success') {
        document.querySelector('.modal').style.display = 'block';
        document.querySelector('.modal').className = 'modal success';
        document.querySelector('.modal p').innerHTML = 'Successful Action';
        setTimeout(
            () => (document.querySelector('.modal').style.display = 'none'),
            2500
        );
    } else {
        document.querySelector('.modal').style.display = 'block';
        document.querySelector('.modal').className = 'modal delete';
        document.querySelector('.modal p').innerHTML = 'Please fill in all fields';
        setTimeout(
            () => (document.querySelector('.modal').style.display = 'none'),
            2500
        );
    }
}

function onCloseModal() {
    document.querySelector('.update-modal').style.display = 'none';
    document.querySelector('.read-modal').style.display = 'none';
}

function onPagination() {
    const pageNumbers = [];
    for (var i = 1; i <= Math.ceil(getBooks().length / getBooksPerPage()); i++) {
        pageNumbers.push(i);
    }
    var strHtml = pageNumbers.map(
        pageNumber =>
            `   
            <button onclick="onChangePage(${pageNumber})" class="pagination-page" href="!#">
                ${pageNumber}
            </button>
        `
    );
    document.querySelector('.pagination').innerHTML = strHtml.join('');
}

function onChangePage(pageNumber) {
    setCurrentPage(pageNumber);
    booksToDisplay();
}
