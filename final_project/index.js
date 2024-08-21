const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Session middleware should be before the auth middleware
app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authorization middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    console.log('Session Authorization:', req.session.authorization); // Debugging line

    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;
        console.log('Token:', token); // Debugging line

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
