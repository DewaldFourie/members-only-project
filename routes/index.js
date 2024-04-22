const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

/**
 * -------------- POST ROUTES ----------------
 */

 // TODO
//  router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));

 // TODO
//  router.post('/register', (req, res, next) => {
//     const saltHash = genPassword(req.body.password);

//     const salt = saltHash.salt;
//     const hash = saltHash.hash;

//     const newUser = new User({ 
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         username: req.body.username,
//         hash: hash,
//         salt: salt,
//         member: true,
//         admin: false,
//     });

//     newUser.save()
//         .then((user) => {
//             console.log(user);
//         });
//     res.redirect('/login')
//  });


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.redirect("/catalog");
});

// // When you visit http://localhost:3000/login, you will see "Login Page"
// router.get('/login', (req, res, next) => {

//     const form = '<h1>Login Page</h1><form method="POST" action="/login">\
//     Enter Username:<br><input type="text" name="username">\
//     <br>Enter Password:<br><input type="password" name="password">\
//     <br><br><input type="submit" value="Submit"></form>';

//     res.send(form);

// });

// // When you visit http://localhost:3000/register, you will see "Register Page"
// router.get('/register', (req, res, next) => {

//     const form = '<h1>Register Page</h1><form method="post" action="register">\
//                     Enter First Name:<br><input type="text" name="firstName">\
//                     <br>Enter Last Name:<br><input type="text" name="lastName">\
//                     <br>Enter Username:<br><input type="text" name="username">\
//                     <br>Enter Password:<br><input type="password" name="password">\
//                     <br><br><input type="submit" value="Submit"></form>';

//     res.send(form);
    
// });

// this is the route to go to a protected page, see the isAuth middleware that controls authentication
router.get('/protected-route', isAuth, (req, res, next) => {
    
    res.send('You made it to the route.');

});

// this is the route to go to the admin page, 
router.get('/admin-route', isAdmin, (req, res, next) => {
    
    res.send('You made it to the ADMIN route.');

});

// Visiting this route logs the user out
// router.get('/logout', (req, res, next) => {
//     req.logout();
//     res.redirect('/protected-route');
// });

// router.get('/login-success', (req, res, next) => {
//     res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
// });

// router.get('/login-failure', (req, res, next) => {
//     res.send('You entered the wrong password.');
// });

module.exports = router;