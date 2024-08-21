const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = [];

// Secret key for JWT (keep it private and secure)
const JWT_SECRET = '061f93f85d5cb02b485884781557126958e6539c0b387c06ca4ac80853e1e2c31f560c11d9681a29fb7701fd62068e2a85f8269b580d8a27a8ebdc1a4b830fc3'; // Change this to a secure key

let books = require("./booksdb.js"); // Ensure books is required here as well

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    // Store the token in session
    req.session.authorization = { accessToken: token };

    console.log('Session after login:', req.session); // Debugging line

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});



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



//  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"