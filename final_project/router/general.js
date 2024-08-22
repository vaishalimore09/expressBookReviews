const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const { username, password } = req.body; // Retrieve username and password from request body
  
  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  // res.send(JSON.stringify(books, null, 4));
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Assuming books is an object where ISBN is the key

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const author = req.params.author; // Retrieve the author from the request parameters
  const booksByAuthor = []; // Array to store books by the specified author

  // Iterate through the books object
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Assuming books is an object where ISBN is the key

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
