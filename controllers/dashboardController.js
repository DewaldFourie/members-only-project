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

exports.user_vip_register_get = asyncHandler(async (req, res, next) => {

    const userDetails = req.user

    res.render("vip_register", {title: "VIP Register", userDetails: userDetails})

})