const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn)
  {
    return res.status(400).json({message: "Please provide an ISBN"});
  }

  // Hack based on structure of code
  if (isbn <= 0 || isbn > books.length)
  {
    return res.status(400).json({message: "ISBN not valid"});
  }

  let book = books[isbn];
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    if(!author)
    {
      return res.status(400).json({message: "Please provide an Author"});
    }

    let author_books = [];
    let keys = Object.keys(books);
    keys.forEach((key) =>
    {
        if (books[key].author === author)
        {
            author_books.push(books[key]);
        }
    });
  return res.status(200).json(author_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
