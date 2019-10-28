const express = require('express');
const bodyParser = require('body-parser');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const config = require('./Config/config.json');
const database = require('./Database/database.js');
const apiRoutes = require('./Route/ApiRoutes');
const authRoutes = require('./Route/AuthRoutes');
const viewRoutes = require('./Route/ViewRoutes')

const userDAO = require('./DAO/UserDAO');


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

//set up passport authentication
passport.use(new LocalStrategy(
    function(email, password, done) {
        userDAO.getUser(email).then(function (user) {
            if(user  && user.password === password){
                console.log('Login Successful!');
                done(null, user, {message: 'Login Successful!'});
            } else {
                console.log('Invalid username or password.');
                done(null,false,{message: 'Invalid username or password.'});
            }
        }).catch(function (err) {
            done(null,false,{message: 'Server error: '+err});
        });
    }
));

passport.serializeUser(function(user, done) {
    console.log("serialize");
    done(null, user.email);
});

passport.deserializeUser(function(email, done) {
    console.log("deserialize");
    userDAO.getUser(email).then(function(user) {
        done(null, user)
    }).catch(function (err) {
        done(err)
    });
});

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/', viewRoutes);

app.get('/', function (req, res) {
    res.json({message: "Welcome to the Gatorloop backend."});
});