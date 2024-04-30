const router = require('express').Router();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const connection = require('../config/database');
const User = connection.models.User;
const Message = connection.models.Message;
const passport = require('passport');
const moment = require('moment');
require('dotenv').config();


// Display user dashboard when user login SUCCESS
exports.user_dashboard_get = asyncHandler(async (req, res, next) => {
    try {
        // get userDetails and all messages with the user populated and display newest first
        const userDetails = req.user;
        const allMessages = await Message.find().sort({ timestamp: -1 }).populate('user').exec();
        
        // Format the timestamp for each message
        allMessages.forEach(message => {
            message.timestampFormatted = moment(message.timestamp).format('HH:mm DD-MM-YYYY');
        });

        res.render("dashboard", { title: "Dashboard", userDetails: userDetails, allMessages: allMessages });

    } catch (error) {
        next(error);
    }
});


// Display new Message Form
exports.new_message_get = asyncHandler(async (req, res, next) => {
    const userDetails = req.user;
    res.render("new_message", { title: "New Message", userDetails: userDetails })
})

// Handle the new message Form on POST
exports.new_message_post = [

    //validate and sanitize fields
    body("title")
        .trim()
        .isLength({ min:1 })
        .escape()
        .withMessage("Title must be specified"),
    body("text") 
        .trim()
        .isLength({ min:1 })
        .escape()
        .withMessage("Message can not be empty."),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);
        const userDetails = req.user;
        // Get current user's ID
        const userId = req.user._id;
        // Get current timestamp 
        const timeStamp = moment().toDate()

        // Create a new Message Object with escaped and trimmed data
        const newMessage = new Message({
            title: req.body.title,
            timestamp: timeStamp,
            text: req.body.text,
            user: userId, 
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error msgs
            res.render("new_message", { 
                title: "Write a new Message", 
                userDetails: userDetails,
                newMessage: newMessage,
                errors: errors.array(),
            });
            return
        }
        else {
            // data from form is valid
            await newMessage.save();
            res.redirect(`/catalog/user/dashboard/${userDetails.username}`);
        }
    })
]

// Display VIP login 
exports.user_vip_register_get = asyncHandler(async (req, res, next) => {
    const userDetails = req.user
    res.render("vip_register", {title: "VIP Access", userDetails: userDetails})

})

// Handle VIP login in POST
exports.user_vip_register_post = asyncHandler(async (req, res, next) => {

    // Get secret code from form and User details from session 
    const secretCode = req.body.secret_code;
    const username = req.params.username;
    const userDetails = req.user;

    // Check if the secret code is correct
    if (secretCode === process.env.VIP_SECRET_CODE) {
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
        res.render("vip_register", { title: "Try Again", userDetails: userDetails });
    }

})

exports.delete_message = asyncHandler(async (req, res, next) => {
    try {
        const messageId = req.params.messageId; // Assuming messageId is passed in the URL
        const userDetails = req.user;

        // Check if the logged-in user is an admin
        if (userDetails.admin) {
            // Find the message by messageId and ensure the user is the author (optional check)
            const message = await Message.findById(messageId);
            
            if (!message) {
                return res.status(404).send("Message not found.");
            }

            // Optionally, you might want to check if the user trying to delete is the author of the message
            // if (message.user.toString() !== userDetails._id.toString()) {
            //     return res.status(403).send("You are not authorized to delete this message.");
            // }

            // If all checks pass, proceed to delete the message
            await Message.findByIdAndDelete(messageId);
            res.redirect(`/catalog/user/dashboard/${userDetails.username}`);
        } else {
            // If the user is not an admin, handle the unauthorized attempt
            return res.status(403).send("You are not authorized to delete messages.");
        }
    } catch (error) {
        next(error);
    }
});
