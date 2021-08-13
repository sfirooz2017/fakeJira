var express = require('express');
var app = express();


//CREATE ID FOR EACH POST


app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const api = require('./api');
app.use('/api', api);

app.listen(3000);
console.log("Server running on port 3000");
