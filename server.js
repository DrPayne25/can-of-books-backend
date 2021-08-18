'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const mongoose = require('mongoose')
const BookModel = require('./models/books.js')

const app = express();
app.use(cors());
 
//below lines of code is taken directly from jsonwebtoken
//https://www.npmjs.com/package/jsonwebtoken
//-------------------------------
var client = jwksClient({
  //Personal Key not from them
  jwksUri: 'https://dev-ccettuzw.us.auth0.com/.well-known/jwks.json'
});
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
//---------------------------------

const PORT = process.env.PORT ;

app.get('/test', (request, response) => {
  //grab the token sent by the front end
  const token = request.headers.authorization.split(' ')[1];

  //from the docs. 
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err){
      response.status(500).send('invalid token');
    }
    response.send(user);
  })

})

app.get('/books', async (req, res) => {
  try {
    let booksdb = await BookModel.find({});
    res.status(200).send(booksdb);
  }
  catch (err) {
    res.status(500).send('dbase error');
  }
})

mongoose.connect('mongodb://127.0.0.1:27017/books', {
  useNewURLParser: true,
  useUnifiedTopology: true
})
  .then(async ()=> {
    console.log('Connected to the database');

    let books = await BookModel.find({});
    if(books.length === 2) {
      await addBook({
        title: "subtle art of not giving an f",
        description: "The Subtle Art of Not Giving a Fuck: A Counterintuitive Approach to Living a Good Life is the second book by blogger and author Mark Manson.",
        status: 'Dont Know what this is',
        email: 'alex.payne1125@gmail.com',
      });
    }
  });

  async function addBook(obj){
    let newBook = new BookModel(obj);
    return await newBook.save();
  }

  async function clear() {
    try{
      await BookModel.deleteMany({})
      console.log('DBase is now gone your welcome');
    }
    catch(err){
      console.log('Error clearing DB');
    }
  }

app.listen(PORT, () => console.log(`listening on ${PORT}`));
