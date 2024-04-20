const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const validPassword = require('../lib/passwordUtils').validPassword;

// create variable for custom fields for local-strategy
const customFields = {
    usernameField: 'username',
    passwordField: 'password',
}

// create a defined callback function to use in strategy
const verifyCallback = (username, password, done) => {
    
    User.findOne({ username: username })
    .then((user) => {

        if (!user) {return done(null, false)}

        const isValid = validPassword(password, user.hash, user.salt);
        
        if (isValid) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    })
    .catch((err) => {
        done(err);
    });

}

// create a new strategy in a very basic way with custom fields and a verifyCallback
const strategy = new LocalStrategy(customFields, verifyCallback);

// use the strategy created with passport as a middleware 
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});
