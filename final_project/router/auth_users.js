const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

    if (username.length == 0)
    {
        return false;
    }

    let filtered_users = users.filter((user) => (user.username == username));

    return filtered_users.length == 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    if (username.length == 0)
    {
        return false;
    }

    let filtered_users = users.filter((user) => (user.username == username && user.password === password));

    return filtered_users.length == 1;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const password = req.body.password;
  const username = req.body.username;

  if(!password || !username)
  {
    return res.status(400).json({message: "Please provide a username and password"});
  }

  if(!authenticatedUser(username, password))
    {
        return res.status(400).json({message: "Failed to authenticate user"});
    }

    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }

    return res.status(200).json({message: "Successfully logged-in user"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  if (!username)
  {
    return res.status(400).json({message: "Error getting username from auth session"});
  }

  const isbn = req.params.isbn;
  if(!isbn)
  {
    return res.status(400).json({message: "Please provide an ISBN"});
  }

  const review = req.query.review;
  if(!review || review.length == 0)
  {
    return res.status(400).json({message: "Please provide a Review"});
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json(books[isbn]);
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    if (!username)
    {
      return res.status(400).json({message: "Error getting username from auth session"});
    }
  
    const isbn = req.params.isbn;
    if(!isbn)
    {
      return res.status(400).json({message: "Please provide an ISBN"});
    }
  
    let new_reviews = {};
    let reviewers = Object.keys(books[isbn].reviews);

    reviewers.forEach( (reviewer) => {
        if(reviewer != username)
        {
            new_reviews[reviewer] = books[isbn].reviews[reviewer];
        }
        else{
            console.log("Removing review for " + isbn + ": [" + username + "]->[" + books[isbn].reviews[username] + "]");
        }
        
    })

    books[isbn].reviews = new_reviews;
  
    return res.status(200).json(books[isbn]);
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
