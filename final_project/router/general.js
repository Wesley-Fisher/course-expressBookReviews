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
public_users.get('/', async function (req, res) {
    try {
        await new Promise ((resolve) => {
            resolve(res.status(200).json(books));
        });
        console.log("Promise for task 8-10 [/] completed");
    } catch (error)
    {
        console.log("Error in Promise for task 8-10 [/]: " + error);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {

  async function asGetFromISBN(resolve, reject)
  {
    const isbn = req.params.isbn;
    if(!isbn)
    {
        reject(res.status(400).json({message: "Please provide an ISBN"}));
    }

    // Hack based on structure of code
    if (isbn <= 0 || isbn > books.length)
    {
        reject(res.status(400).json({message: "ISBN not valid"}));
    }

    let book = books[isbn];
    resolve(res.status(200).json(book));
  };

  try {
    await new Promise(asGetFromISBN)
    console.log("Promise for [get /isbn/:isbn] completed");
  }
  catch(error){
    console.log("Error in [get /isbn/:isbn]: " + error);
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    async function asGetFromAuthor(resolve, reject)
    {
        const author = req.params.author;
        if(!author)
        {
            reject(res.status(400).json({message: "Please provide an Author"}));
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
        resolve(res.status(200).json(author_books));
    }
  
    try {
        await new Promise(asGetFromAuthor)
        console.log("Promise for [get /author/:author] completed");
      }
      catch(error){
        console.log("Error in [get /author/:author]: " + error);
      }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    async function asGetFromTitle(resolve, reject)
    {
        const title = req.params.title;
        if(!title)
        {
         reject(res.status(400).json({message: "Please provide a Title"}));
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
        resolve(res.status(200).json(titled_books));
    }

    try {
        await new Promise(asGetFromTitle)
        console.log("Promise for [get /title/:title] completed");
      }
      catch(error){
        console.log("Error in [get /title/:title]: " + error);
      }
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
