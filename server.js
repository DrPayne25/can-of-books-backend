'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();
app.use(cors());
 
//below lines of code is taken directly from jsonwebtoken
//https://www.npmjs.com/package/jsonwebtoken
//-------------------------------
var jwksClient = require('jwks-rsa');
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
 
jwt.verify(token, getKey, options, function(err, decoded) {
  console.log(decoded.foo) // bar
});

const PORT = process.env.PORT || 3001;

app.get('/test', (request, response) => {
  //grab the token sent by the front end
  const token = request.headers.authorization.split(' ')[1];

  //from the docs. 
  jwt.verify(token, getKey, {}, (err, user){
    if(err){
      response.status(500).send('invalid token');
    }
    response.send(user);
  })

})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
