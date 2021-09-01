const mongoose = require('mongoose');
const express = require('express'); 
const bodyParser = require("body-parser");
const router = express.Router();
const TicketModel = require('./schemas/ticketschema');
const ListModel = require('./schemas/listschema');
const UserModel = require('./schemas/userschema');
const cache = require('memory-cache');
const util = require('util');
const app = express();
app.use(express.json());
const bcrypt = require('bcryptjs')
const { ensureAuthenticated, ensureAdmin, forwardAuthenticated } = require('./config/auth');

const passport = require('passport');
mongoose.set('useFindAndModify', false);


// Connecting to database
var query = require('./config/keys').MongoURI;
  
const db = (query);
mongoose.Promise = global.Promise;
  
mongoose.connect(db, { useNewUrlParser : true, 
useUnifiedTopology: true }, function(error) {
    if (error) {
        console.log("Error!" + error);
    }
});

    //CREATE

router.post('/save', ensureAuthenticated, function(req, res) {

    var ticket = new TicketModel();
    ticket.title = req.body.title;
    ticket.desc = req.body.desc;
    ticket.due = req.body.due;
    ticket.status = req.body.status;

    ticket.save(function(err, data){
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });
});

router.post('/cache/save', ensureAuthenticated, function(req, res){
    cache.put(req.body.key, req.body.value, 86400000);
    res.send(req.body.value);
});

router.post('/list/save', ensureAuthenticated, function(req, res){
    var list = new ListModel(); 
    list.title = req.body.title;
    list.tasks = req.body.tasks;

    list.save(function(err, data){
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });
});

//RETRIEVE ALL

router.get('/findall', ensureAdmin, function(req, res) {
    TicketModel.find(function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
 });

 router.get('/user/findall', ensureAuthenticated, function(req, res) {

    TicketModel.find({'_id' : {$in : req.user.tasks}},
        function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
 });

router.get('/cache/findall', ensureAuthenticated, function(req, res){
    var r = cache.keys();
    res.send(r);
});


router.get('/list/findall', ensureAdmin, function(req, res) {

    ListModel.find(function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
 });

router.get('/users/findall', ensureAdmin, function(req, res) {

    UserModel.find(function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
 });

router.get('/user/list/findall', ensureAuthenticated, function(req, res) {


    ListModel.find({'_id' : {$in : req.user.lists}},
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }   
    });  
 });

 router.get('/findallids', ensureAuthenticated, function(req, res) {
     TicketModel.find({}, '_id', function(err, docs){
        res.send(docs);
    });
 });

//RETRIEVE ONE

router.get('/find', ensureAuthenticated, function(req, res) {
    TicketModel.findById((req.query.id), 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
});

router.get('/cache/find', ensureAuthenticated, function(req, res){
    var result = cache.get(req.query.key);
    res.send(result);
});

router.get('/list/find', ensureAuthenticated, function(req, res) {
    ListModel.findById((req.query.id), 
    function(err, data) {
        if(err){
            res.send(err);
        }
        else{
            if (data==null)
            {
                res.send("Not found");
            }
            else
                res.send(data);
        }
    });  
});

     //UPDATE

router.post('/update', ensureAuthenticated, function(req, res) {
    TicketModel.findByIdAndUpdate(req.body.id, 
    {title:req.body.title, desc: req.body.desc, due: req.body.due, status: req.body.status}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
});    

router.post('/user/update', ensureAuthenticated, function(req, res) {

    UserModel.findByIdAndUpdate(req.user.id, 
    {tasks:req.body.tasks, lists: req.body.lists}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
});

router.post('/user/updateRole', ensureAdmin, function(req, res) {

    UserModel.findByIdAndUpdate(req.body.id, 
    {role:req.body.role}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
});

router.post('/list/update', ensureAuthenticated, function(req, res) {
    ListModel.findByIdAndUpdate(req.body._id, 
    {title:req.body.title, tasks:req.body.tasks}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
});    
     //DELETE

router.post('/delete', ensureAuthenticated, function(req, res) {
    TicketModel.findByIdAndDelete((req.body.id), 
    function(err, data) {
        if(err){
            res.send(err);
            console.log(err);
        }
        else{
            res.send("Data Deleted!");
        }
    });  
});

router.post('/user/delete', ensureAdmin, function(req, res) {
    UserModel.findByIdAndDelete((req.body.id), 
    function(err, data) {
        if(err){
            res.send(err);
            console.log(err);
        }
        else{
            res.send("Data Deleted!");
        }
    });  
});

router.post('/cache/delete', ensureAuthenticated, function(req, res){
    cache.del(req.body.key);
    res.send();
    console.log("cache deleted");
    
});

router.post('/cache/deleteAll', ensureAuthenticated, function(req, res){
    cache.clear();
    res.send();    
});

router.post('/list/delete', ensureAuthenticated, function(req, res) {
    ListModel.findByIdAndDelete((req.body._id), 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send("Data Deleted!");
            console.log("Data Deleted!");
        }
    });  
});

    //AUTH

router.post('/register', function(req, res) {
    //Check if user already exists
    UserModel.findOne({email: req.body.email})
    .then(user => {
        if(user){
            res.send("Duplicate user")
        }
        else
        {
            const newUser = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            tasks: req.body.tasks,
            lists: req.body.lists
            });
            //Hash password
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //replace password with hash
                    newUser.password = hash;
                    newUser.save() //move this to own func later
                        .then(user => {
                            res.send();
                        })
                        .catch(err => console.log(err));
                }))
        }

    })

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/#',
        failureRedirect: '/login'
        // failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send();
})

router.get('/auth', ensureAuthenticated, (req, res) =>
  {
      res.send(req.user);
  })

module.exports = router;