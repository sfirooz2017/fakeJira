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
//app.use(bodyparser.urlencoded({extended:true});

//var mongoose = require('mongoose');
//const uri = "mongodb+srv://shannonUser:52WfXbrV2$8Agq_@cluster0.q546l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// mongoose.connect(uri);
// var db = mongoose.connection;






app.listen(3000);
console.log("Server running on port 3000");
