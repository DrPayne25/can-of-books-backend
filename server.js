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

app.get('/clear', ClearBooks);
app.get('/seed', Seed);
app.get('/add', AddBook)

app.get('/books', (req, res) => {
  // console.log('I am here')
  try {
    // console.log('I am also here just an fyi')
    const token = req.headers.authorization.split(' ')[1];
    // console.log(token);
    //from the docs. 
    jwt.verify(token, getKey, {}, function (err, user) {
      // console.log('I am in the token now hehehe')
      if (err) {
        response.status(500).send('invalid token');
      }
      //BookModel refers to the schema we created! 
      BookModel.find((err, booksdb)=> {
        res.status(200).send(booksdb);
      });
    })
  }
  catch (err) {
    res.status(500).send('dbase error');
  }
})

mongoose.connect('mongodb://127.0.0.1:27017/books', {
  useNewURLParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to the database');

  });

app.listen(PORT, () => console.log(`listening on ${PORT}`));


