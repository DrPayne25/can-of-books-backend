'use strict'

const BookModel = require('../models/BooksModel.js');
const AddBook = require('../modules/AddBook.js')


async function seed(req, res) {
  let books = await BookModel.find({});
  try {
    if (books.length === 0) {
      await AddBook({
        title: "The Subtle Art of Not Giving a Fuck",
        description: "The Subtle Art of Not Giving a Fuck: A Counterintuitive Approach to Living a Good Life is the second book by blogger and author Mark Manson.",
        status: "Dont Know what this is",
        email: "alex.payne1125@gmail.com",
      });
      await AddBook({
        title: "A Game of Thrones",
        description: "A Game of Thrones is the first novel in A Song of Ice and Fire, a series of fantasy novels by the American author George R. R. Martin.",
        status: "Dont Know what this is",
        email: "alex.payne1125@gmail.com",
      });
      await AddBook({
        title: "Thrawn",
        description: "Star Wars: Thrawn is a Star Wars novel by Timothy Zahn, published on April 11, 2017 by Del Rey Books.",
        status: "Dont Know what this is",
        email: "alex.payne1125@gmail.com",
      });
      res.status(200).send('DBase is now seeded hehehe!!');
    }
  } catch (err) {
    res.status(500).send('Error clearing DB');
  }
}
