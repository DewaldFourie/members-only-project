const router = require('express').Router();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const connection = require('../config/database');
const User = connection.models.User;
const passport = require('passport');


// Display user dashboard when user login SUCCESS
exports.user_dashboard_get = asyncHandler(async (req, res, next) => {

    const userDetails = req.user;

    res.render("dashboard", {title: "Dashboard", userDetails: userDetails})

});

// Display VIP login 
exports.user_vip_register_get = asyncHandler(async (req, res, next) => {

    const userDetails = req.user

    res.render("vip_register", {title: "VIP Register", userDetails: userDetails})

})

// Handle VIP login 
exports.user_vip_register_post = asyncHandler(async (req, res, next) => {

    const secretCode = req.body.secret_code;
    const username = req.params.username;
    const userDetails = req.user;

    // Check if the secret code is correct
    if (secretCode === "0000") {
        // update the user's membership status to true
        User.findOneAndUpdate({ username: username }, { member: true }, { new: true }, (err, user) => {
            if (err) {
                return res.status(500).send("Error Updating user membership status.");
            }
            // Redirect to the user's dashboard with updated details
            res.redirect(`/catalog/user/dashboard/${username}`);
        })
    }
    else {
        // if the secret code is incorrect, render the vip registration page again
        res.render("vip_register", { title: "VIP Register", userDetails: userDetails });
    }

})