'use strict'

const BookModel = require('../models/BooksModel.js');

async function clearData(req, res) {
  try{
    await BookModel.deleteMany({})
    res.status(200).send('DBase is now gone your welcome');
  }
  catch(err){
    res.status(500).send('Error clearing DB');
  }
}
console.log("DB has been Cleared")

module.exports = clearData;

