const express = require('express');
const port = 8000;
const axios = require('axios');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const session= require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const mongoStore = require('connect-mongo')(session);
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./assets'));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(session({
    name: 'nodues',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000*60*100
    },
    store: new mongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }, (err) => {
        if (err) {
            console.log('Error in setting up connect-mongo');
        }
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/', require('./routes/index'));

app.listen(port, (err) => {
    if (err) {
        console.log('Error in running the server', err);
        return;
    }
    console.log('Server is running perfectly fine on port: ', port);
})

//client id = 417822814724-2klognhn6le7q43c0vc0tqpn0cbgu053.apps.googleusercontent.com
//client secret = tn3wI5iFPkAawIotSB9IHIX2