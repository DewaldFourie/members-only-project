const express = require("express");
const router = express.Router();

const home_controller = require("../controllers/indexController");
const register_controller = require("../controllers/registerController");

/// HOME ROUTE ///

// GET catalog home page
router.get("/", home_controller.index);

/// REGISTER USER ROUTES ///

// GET request for register a user
router.get("/user/register", register_controller.user_register_get);

// POST request for register a user
router.post("/user/register", register_controller.user_register_post);

module.exports = router;

