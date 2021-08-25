var express = require('express');
var app = express();
var router = express.Router();
const path = require('path');

const passport = require('passport');
//const flash = require('connect-flash');
const session = require('express-session');

//Passport Config
require('./config/passport')(passport);
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');

app.use(express.static(__dirname + "/public"));

//app.use('/user', ensureAuthenticated, express.static(path.join(__dirname, '/public/pages/users')));

app.get('/pages/user/*', ensureAuthenticated, (req, res) => {
    console.log("ahh");
    res.send("not allowed");
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  

//ROUTES
const api = require('./api');
app.use('/api', api);
 



app.listen(3000);
console.log("Server running on port 3000");
