const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get the list of books using Async-Await
const getBooks = async () => {
  try {
    // fetch with a Promise
    return await Promise.resolve(books);
  } catch (error) {
    console.error("Error fetching the list of books:", error);
    throw error;
  }
};
public_users.get('/', async (req, res) => {
  try {
    const books = await getBooks();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// Task 11: Get book details based on ISBN using Async-Await
const getBookByISBN = async (isbn) => {
  try {
    return await Promise.resolve(books[isbn]);
  } catch (error) {
    console.error("Error fetching book details by ISBN:", error);
    throw error;
  }
};
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByISBN(isbn);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Task 12: Get book details based on Author using Async-Await
const getBooksByAuthor = async (author) => {
  try {
    return await Promise.resolve(
      Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching books by author:", error);
    throw error;
  }
};
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const books = await getBooksByAuthor(author);
    if (books.length > 0) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Task 13: Get book details based on Title using Async-Await
const getBooksByTitle = async (title) => {
  try {
    return await Promise.resolve(
      Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching books by title:", error);
    throw error;
  }
};
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const books = await getBooksByTitle(title);
    if (books.length > 0) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
