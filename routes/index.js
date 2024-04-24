const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;


/**
 * -------------- GET ROUTES ----------------
 * ( Refer to catalog.js for complete route setup and application)
 */

router.get('/', (req, res, next) => {
    res.redirect("/catalog");
});


module.exports = router;