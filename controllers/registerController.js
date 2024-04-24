
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;


// Display User register form GET
exports.user_register_get = (req, res, next) => {
    res.render("register_form", { title: "Register" })
};

// Handle User register on POST
exports.user_register_post = [
    // validate and sanitize fields
    body("firstName")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First Name must be specified")
        .isAlphanumeric()
        .withMessage("First Name has non-alphanumeric characters."),
    body("lastName")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Last Name must be specified")
        .isAlphanumeric()
        .withMessage("Last Name has non-alphanumeric characters."),
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username must be specified"),
    body("password")
        .isLength({ min: 3 })
        .escape()
        .withMessage("Password must be at least 3 characters long."),
        
    

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a User object with escaped and trimmed data
        const saltHash = genPassword(req.body.password);

        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const newUser = new User({ 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            hash: hash,
            salt: salt,
            member: false,
            admin: false,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error msgs
            res.render("register_form", { 
                title: "Register", 
                newUser: newUser,
                usernameError: false,
                errors: errors.array(),
            });
            return
        }
        else {
            // Data from form is valid 
            const usernameExists = await User.findOne({
                username: req.body.username,
            }).collation({ locale: "en", strength: 2 }).exec()

            if (usernameExists) {
                res.render('register_form', { 
                    title: "Register",
                    newUser: newUser,
                    usernameError: true,
                });
            }
            else {
                await newUser.save();
                // redirect to login page
                res.redirect("/catalog/user/login")
            }
        }
    })
]
