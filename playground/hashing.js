const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = "123abc!";

//this makes bcrypt take longer so that brute force attacks can't happen. Much fewer requests possible.
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

const hashedPassword = '$2a$10$x/SefK6Gfal2dSHBZz89YOukRlAk7C0teYKQlKj8OAKcfOsrtAJBq';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

//
// // jwt.sign //creates a hash, returns the token
// // jwt.verify //takes the token and secret, and ensures it wasn't manipulated.
//
// const data = {
//   id: 10
// };
//
// const token = jwt.sign(data, 'secret'); //this gets sent to the user as well as stored in the tokens array.
// console.log(token);
//
// const decoded = jwt.verify(token, 'secret');
// console.log('decoded', decoded);
//
// //this is JWT - JSON Web Tokens.
// //
// // const {SHA256} = require('crypto-js');
// //
// // const message = "I'm awesome.";
// //
// // const hash = SHA256(message).toString();
// //
// // console.log (`Message: ${message}%%%%%% Hash: ${hash}`);
// //
// // const data = {
// //   id: 4
// // };
// //
// // const token = {
// //   data,
// //   hash: SHA256(JSON.stringify(data)) + 'someSecret'.toString()
// // };
// //
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
// //
// //
// // const resultHash = SHA256(JSON.stringify(token.data)) + 'someSecret'.toString();
// //
// // if (resultHash === token.hash) {
// //   //data was not manipulated.
// //   console.log('data not changed.');
// // }else{
// //   console.log('data was changed, do not trust it!');
// // }
