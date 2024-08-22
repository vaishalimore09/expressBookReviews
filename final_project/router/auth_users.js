const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router(); // Define the router

let users = [];
let books = require("./booksdb.js"); // Ensure books is required here as well

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login endpoint
regd_users.post("/login", (req, res) => { // Use regd_users.post instead of app.post
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT access token
  let accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  // Store access token in session
  req.session.authorization = {
    accessToken: accessToken
  };

  return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Get ISBN from URL parameters
  const username = req.user.username; // Get username from the session token

  let book = books[isbn];

  if (book) {
    if (book.reviews && book.reviews[username]) {
      // Delete the review of the logged-in user
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for the user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query; // Get review from query parameters
  const { isbn } = req.params; // Get ISBN from URL parameters
  const username = req.user.username; // Get username from the token

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  let book = books[isbn];

  if (book) {
    if (!book.reviews) {
      book.reviews = {};
    }

    // Update or add review
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
