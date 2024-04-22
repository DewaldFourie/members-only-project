const express = require("express");
const router = express.Router();
const passport = require('passport');
const home_controller = require("../controllers/indexController");
const register_controller = require("../controllers/registerController");
const login_controller = require("../controllers/loginController");

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
router.post('/user/login', passport.authenticate('local', { failureRedirect: '/catalog/user/login-failure', successRedirect: '/catalog/user/dashboard' }));

// GET request for a successful user login 
router.get('/user/dashboard', login_controller.user_dashboard_get)

// POST request for a failed user login 
router.get('/user/login-failure', login_controller.user_login_failure_get)
module.exports = router;

