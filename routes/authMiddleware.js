
const express = require("express");

// Define middleware functions

// Middleware function to check if a user req is authenticated and logged in
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).json({ msg: 'You are not authorized to view this resource.' });
    }
}

// Middleware function to check if a user req is authenticated and if they are a VIP member
const isMember = (req, res, next) => {
    if (req.isAuthenticated() && req.user.member) {
        next();
    } else {
        return res.status(401).json({ msg: 'You are not authorized to view this resource because you are not a VIP Member.' });
    }
}

module.exports = { isAuth, isMember };
