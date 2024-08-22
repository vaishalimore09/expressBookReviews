const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Session middleware configuration
app.use(session({ secret: "fingerprint", resave: true, saveUninitialized: true }))

// Middleware for user authentication
app.use("/customer/auth/*", (req, res, next) => {
    console.log(req.session.authorization);
    const token = req.session.authorization?.accessToken || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "User not logged in" });
    }

    jwt.verify(token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated" });
        } else {
            req.user = user;
            next();
        }
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
