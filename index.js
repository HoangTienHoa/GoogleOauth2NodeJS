const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'sdakljAkdjhh23LahW23jjqlNNdbqkqncrytppcnvg&^jhw'
}));
app.use(passport.initialize());
app.use(passport.session());

const GOOGLE_CLIENT_ID = '545304120529-hs26skpg9hidffpopb9g5b2u6m486gcb.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
let userProfile;

app.get('/', function(req, res) {
    res.render('pages/auth');
});

app.get('/success', (req, res) => {
    console.log(userProfile);
    res.render('pages/success', {user: userProfile});
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        userProfile=profile;
        return done(null, userProfile);
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function(req, res) {
        // Successful authentication, redirect success.
        res.redirect('/success');
    });

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));