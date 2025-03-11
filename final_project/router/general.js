const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const password = req.body.password;
  const username = req.body.username;

  if(!password || !username)
  {
    return res.status(400).json({message: "Please provide a username and password"});
  }

  if(!isValid(username))
  {
    return res.status(400).json({message: "Username is not valid or already exists"});
  }

  users.push({"username": username, "password": password})

  return res.status(200).json({message: "Successfully registered user"});
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
    const title = req.params.title;
    if(!title)
    {
      return res.status(400).json({message: "Please provide a Title"});
    }

    let titled_books = [];
    let keys = Object.keys(books);
    keys.forEach((key) =>
    {
        if (books[key].title === title)
        {
            titled_books.push(books[key]);
        }
    });
  return res.status(200).json(titled_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
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
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
