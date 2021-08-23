var express = require('express');
var app = express();
var router = express.Router();

//EJS
// app.use(expressLayouts);
// app.set('view engine', 'ejs');

// //Login Page
// router.get('/login', (req, res) => res.send('Login'));

// router.get('/register', (req, res) => res.send('Register'));


app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//ROUTES
const api = require('./api');
app.use('/api', api);

app.listen(3000);
console.log("Server running on port 3000");
