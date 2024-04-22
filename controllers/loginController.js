const router = require('express').Router();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const connection = require('../config/database');
const User = connection.models.User;
const passport = require('passport');

// Display User login form GET
exports.user_login_get = (req, res, next) => {

    res.render("login_form", { title: "Login" })

}

// Display user login SUCCESS 
exports.user_dashboard_get = (req, res, next) => {

    res.render("dashboard", {title: "Dashboard"})

}

// Display user login FAILURE
exports.user_login_failure_get = (req, res, next) => {

    res.render("login_failure", {title: "Login Failure"})

}

