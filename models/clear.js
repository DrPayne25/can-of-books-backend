'use strict'

const BookModel = require('./models/books.js')

async function Clear(req, res) {
  try{
    await BookModel.deleteMany({})
    res.status(200).send('DBase is now gone your welcome');
  }
  catch(err){
    res.status(500).send('Error clearing DB');
  }
}

module.exports = (Clear);

