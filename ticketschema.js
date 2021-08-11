
var mongoose=require('mongoose');
  
var ticketSchema = new mongoose.Schema({
    title: {
    type:Number
    },
    desc: {
    type:String
    },
    due: {
    type:String
    },
    status: {
    type:String
    }
});
  
module.exports = mongoose.model(
    'ticket', ticketSchema, 'tickets');