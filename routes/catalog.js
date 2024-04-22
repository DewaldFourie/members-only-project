const express = require("express");
const router = express.Router();
const passport = require('passport');
const home_controller = require("../controllers/indexController");
const register_controller = require("../controllers/registerController");
const login_controller = require("../controllers/loginController");
const dashboard_controller = require("../controllers/dashboardController");
const isAuth = require('./authMiddleware').isAuth;
const connection = require('../config/database');
const User = connection.models.User;

/// HOME ROUTE ///

// GET catalog home page
router.get("/", home_controller.index);

/// REGISTER USER ROUTES ///

// GET request for register a user
router.get("/user/register", register_controller.user_register_get);

// POST request for register a user
router.post("/user/register", register_controller.user_register_post);


/// LOGIN USER ROUTES ///

// GET request for user login
router.get("/user/login", login_controller.user_login_get);


// POST request for user login 
router.post('/user/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/catalog/user/login-failure'); }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.redirect(`/catalog/user/dashboard/${user.username}`);
        });
    })(req, res, next);
});


// GET request for a failed user login 
router.get('/user/login-failure', login_controller.user_login_failure_get)
module.exports = router;


/// USER DASHBOARD ROUTES ///

// GET request for a successful user login 
router.get('/user/dashboard/:username', isAuth,  dashboard_controller.user_dashboard_get)

// GET request for a VIP member register 
router.get('/user/dashboard/register_vip/:username', dashboard_controller.user_vip_register_get)


/// LOGOUT USER ROUTES ///

// GET route for logging a user out
router.get('/user/logout', (req, res, next) => {
    req.logout();
    res.redirect("/catalog/user/login");
})