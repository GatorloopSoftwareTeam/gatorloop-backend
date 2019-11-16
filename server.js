const express = require('express');
const bodyParser = require('body-parser');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const config = require('./Config/config.json');
const database = require('./Database/Database.js');
const apiRoutes = require('./Route/ApiRoutes');
const authRoutes = require('./Route/AuthRoutes');
const viewRoutes = require('./Route/ViewRoutes');

const userDAO = require('./DAO/UserDAO');
const User = require('./Model/User').Model;

//main express app
let app = express();

app.listen(config.port, "localhost", () => {
    console.log(`Now listening on port ${config.port}`);
});

database.connect();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/View');
app.set('view engine', 'ejs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(flash());
app.use(session({secret:'ntk7'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/', viewRoutes);

app.get('/', function (req, res) {
    res.json({message: "Welcome to the Gatorloop backend."});
});