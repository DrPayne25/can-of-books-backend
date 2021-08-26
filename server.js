'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const mongoose = require('mongoose');
const BookModel = require('./models/BooksModel.js');
const ClearBooks = require('./modules/ClearBooks.js');
const AddBook = require('./modules/AddBook')
const Seed = require('./modules/Seed')

const app = express();
app.use(express.json())
app.use(cors());

//below lines of code is taken directly from jsonwebtoken
//https://www.npmjs.com/package/jsonwebtoken
//-------------------------------
var client = jwksClient({
  //Personal Key not from them
  jwksUri: 'https://dev-ccettuzw.us.auth0.com/.well-known/jwks.json'
});
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
//---------------------------------

const PORT = process.env.PORT;

app.get('/test', (request, response) => {
  //grab the token sent by the front end
  const token = request.headers.authorization.split(' ')[1];

  //from the docs. 
  jwt.verify(token, getKey, {}, function (err, user) {
    if (err) {
      response.status(500).send('invalid token');
    }
    response.send(user);
  })

})

mongoose.connect('mongodb://127.0.0.1:27017/books', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to the database');

  });

app.get('/clear', ClearBooks);
app.get('/seed', Seed);
app.get('/add', AddBook)

app.get('/books', (req, res) => {
  // console.log(req.headers);
  // console.log(req.params);
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, getKey, {}, function (err, user) {
      if (err) {
        res.status(500).send('invalid token');
      }
      BookModel.find((err, booksdb) => {
        res.status(200).send(booksdb);
      });
    })
  }
  catch (err) {
    res.status(500).send('dbase error');
  }
})

app.post('/books', (req, res) => {
  try {
    let { title, description, status, email } = req.body
    let newBook = new BookModel({ title, description, status, email });
    newBook.save();
    res.send(newBook);
  } catch (err) {
    res.status(500).send('something went wrong adding your book')
  }
});

app.delete('/books/:id', (req, res) => {
  // console.log(req.params);
  // console.log(req.query);
  let id = req.params.id;
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, getKey, {}, async function (err, user) {
      if (err) {
        res.status(500).send('invalid token');
      } else {
        let email = req.query.email;
        // console.log(email, user.email);
        if (email === user.email) {
          await BookModel.findByIdAndDelete(id)
          res.status(200).send(`Successfully Removed book ID: ${id}`);
        }
      };
    });
  }
  catch (err) {
    res.status(500).send('dbase error')
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    let myId = req.params.id;
    console.log(req.body);
    console.log(req.params)
    console.log(myId);
    let { title, description, status, email } = req.body;
    const updatedBook = await BookModel.findByIdAndUpdate(myId, { title, description, status, email }, { new: true, overwrite: true });

    console.log('UpdatedBook:', updatedBook);
    res.status(200).send(updatedBook);
  }
  catch (error) {
    res.status(500).send('Unable to update book');
  }
})


app.listen(PORT, () => console.log(`listening on ${PORT}`));


