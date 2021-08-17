var mongoose = require('mongoose');
var express = require('express'); 
const bodyParser = require("body-parser");
var router = express.Router();
var TicketModel = require('./schemas/ticketschema');
var ListModel = require('./schemas/listschema');
var cache = require('memory-cache');
const util = require('util');
const app = express();
app.use(express.json());
mongoose.set('useFindAndModify', false);


// Connecting to database
var query = 'mongodb+srv://shannonUser:52WfXbrV2$8Agq_'
    + '@cluster0.q546l.mongodb.net/ticket?'
    + 'retryWrites=true&w=majority'
  
const db = (query);
mongoose.Promise = global.Promise;
  
mongoose.connect(db, { useNewUrlParser : true, 
useUnifiedTopology: true }, function(error) {
    if (error) {
        console.log("Error!" + error);
    }
});



    //CREATE

router.post('/save', function(req, res) {

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

router.post('/cache/save', function(req, res){
    cache.put(req.body.key, req.body.value, 86400000);
    res.send(req.body.value);
});

router.post('/list/save', function(req, res){
2
    var list = new ListModel(); 
    list.title = req.body.title;
    var tasks = req.body.tasks;

    tasks.forEach((task => {
        list.tasks.push({ _id: task._id});
    }))
 
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
router.get('/findall', function(req, res) {
    TicketModel.find(function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
 });


router.get('/cache/findall', function(req, res){
    var r = cache.keys();
    res.send(r);
});

router.get('/list/findall', function(req, res) {
    ListModel.find(function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
 });


 router.get('/findallids', function(req, res) {
     TicketModel.find({}, '_id', function(err, docs){
        res.send(docs);
         console.log(docs);
    });
 });

//RETRIEVE ONE
router.get('/find', function(req, res) {

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

router.get('/cache/find', function(req, res){
    console.log(req.query);
    var result = cache.get(req.query.key);
    console.log(result + "r");
    res.send(result);
});

router.get('/list/find', function(req, res) {

    ListModel.findById((req.body.id), 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            if (data==null)
            {
            res.send("Not found");
            }
            else
          //  {
            res.send(data);
            //}
        }
    });  
});

     //UPDATE

router.post('/update', function(req, res) {
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

router.post('/list/update', function(req, res) {
    TicketModel.findByIdAndUpdate(req.body.id, 
    {title:req.body.title}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
});    


     //DELETE
router.post('/delete', function(req, res) {
    TicketModel.findByIdAndDelete((req.body.id), 
    function(err, data) {
        if(err){
            res.send(err);
            console.log(err);
        }
        else{
            res.send("Data Deleted!");
            console.log("Data Deleted!");
        }
    });  
});


router.post('/cache/delete', function(req, res){
    cache.del(req.body.key);
    console.log(req.body.key + "req");
    res.send();
    
});

router.post('/list/delete', function(req, res) {
    ListModel.findByIdAndDelete((req.body.id), 
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

  
module.exports = router;