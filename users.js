const { response } = require('express');
var express = require('express');
var app = express();
const bcrypt = require('bcryptjs')

const User = require('./schemas/userschema');


User.findOne({email: require.body.email})
    .then(user => {
        if(user){
            res.send("Duplicate user")
        }
        else
        {
            const newUser = new User({
            name: request.body.name,
            email: request.body.email,
            password: request.body.password
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
                        }

                        )
                        .catch(err => console.log(err));

            }))
        }

    })

//app.use('login', require('./login'));
