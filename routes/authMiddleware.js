
const express = require("express");

// Define middleware functions
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).json({ msg: 'You are not authorized to view this resource' });
    }
}

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        return res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an Admin.' });
    }
}

module.exports = { isAuth, isAdmin };
