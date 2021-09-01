var mongoose=require('mongoose');
  
var userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    tasks: [{
        _id: {
            type: String
        }
    }],
    lists: [{
        _id: {
            type: String
        }
    }],
    role: {
        type: String
    }
  
});
  
module.exports = mongoose.model(
    'user', userSchema, 'users');