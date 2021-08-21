'use strict'

const BookModel = require('../models/BooksModel.js');


async function AddBook(obj) {
  let newBook = new BookModel(obj);
  return await newBook.save();
}

module.exports = AddBook

