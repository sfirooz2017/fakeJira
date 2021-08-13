var mongoose = require('mongoose');
var express = require('express'); 
const bodyParser = require("body-parser");
var router = express.Router();
var TicketModel = require('./ticketschema');
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

     //RETRIEVE ONE
     router.get('/find', function(req, res) {

        TicketModel.findById((req.query.id) , 
        function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                res.send(data);
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
                console.log(data);
            }
        });  
    });    


    
     //DELETE
router.post('/delete', function(req, res) {
    TicketModel.findByIdAndDelete((req.body.id), 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
            console.log("Data Deleted!");
        }
    });  
});

router.post('/cache/save', function(req, res){
    cache.put(req.body.key, req.body.value);
    console.log(req.body.key);
    res.send(req.body.value);
});
router.post('/cache/delete', function(req, res){
    cache.del(req.body.key);
});
router.get('/cache/find', function(req, res){
    cache.get(req.body.key);
});
router.get('/cache/findall', function(req, res){
    var r = cache.exportJson();
    res.send(JSON.parse(r));
});

  
module.exports = router;