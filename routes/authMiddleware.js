
const express = require("express");

// Define middleware functions
const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).json({ msg: 'You are not authorized to view this resource.' });
    }
}

const isMember = (req, res, next) => {
    if (req.isAuthenticated() && req.user.member) {
        next();
    } else {
        return res.status(401).json({ msg: 'You are not authorized to view this resource because you are not a VIP Member.' });
    }
}

module.exports = { isAuth, isMember };
