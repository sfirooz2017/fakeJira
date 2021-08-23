
var mongoose=require('mongoose');
  
var listSchema = new mongoose.Schema({

    title: {
        type: String
    },
    tasks: [{
        _id: {
            type: String
        }
    }]
});
  
module.exports = mongoose.model(
    'list', listSchema, 'lists');

    