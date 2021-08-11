var mongoose = require('mongoose');
var express = require('express'); 
const bodyParser = require("body-parser");
var router = express.Router();
var TicketModel = require('./ticketschema');

const app = express();
// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
// app.use(bodyParser.json());
app.use(express.json());


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

    //var newTicket = new TicketModel(req.body);

    // const ticket = mongoose.model('tickets',{
    //     title: { type: String },
    //     desc: { type: String },
    //     due: { type: String },
    //     status: { type: String }
    // });

    // var newTicket = new ticket({
    //     title: req.body.title,
    //     desc: req.body.desc,
    //     due: req.body.due,
    //     status: req.body.status
    // })
      
    // newTicket.save(function(err,result){
    //     if (err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log(result)
    //     }
    // })

    // var ticket = new TicketModel({
    //     title : "t1",
    //     desc : "desc",
    //     due : "d",
    //     status : "d"
    // });
       
       ticket.save(function(err, data){
           if(err){
               console.log(err);
           }
           else{
               res.send(data);
           }
       });
     });

   
    //RETRIEVE
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
 /*
     //UPDATE

     router.post('/update', function(req, res) {
        TicketModel.findByIdAndUpdate(req.body.id, 
        {Name:req.body.Name}, function(err, data) {
            if(err){
                console.log(err);
            }
            else{
                res.send(data);
                console.log("Data updated!");
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
*/
  
module.exports = router;