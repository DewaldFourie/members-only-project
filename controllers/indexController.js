
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {

    res.render("index", {
        title: "MembersOnly Home",
    })

})