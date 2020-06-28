var mongoose = require('mongoose');
var Schema = mongoose.Schema;
titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
var bcrypt = require('bcrypt');
const saltRounds = 10;


   var emailValidator = [
        validate({
            validator: 'isEmail',            
            message: 'Invalid Email'
        }),
        validate({
            validator: 'isLength',
            arguments: [3, 30],
            message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
        })
    ];

    var usernameValidator = [
        validate({
            validator: 'isLength',
            arguments: [3, 25],
            message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
        }),
        validate({
            validator: 'isAlphanumeric',
            message: 'Username must contain letters and numbers only'
        })
    ];

    var passwordValidator = [
        validate({
            validator: 'isLength',
            arguments: [8, 25],
            message: 'Password length should me more than 8 and less than 25'
        }),       
    ];
  
var UserSchema = new Schema({
    name: {type: String, required:true},
    username: {type: String, lowercase:true, required:true, unique:true,validate:usernameValidator},
    password: {type: String, required:true,validate:passwordValidator},
    email: {type: String, lowercase:true, required:true, unique:true, validate:emailValidator},
    
});

UserSchema.pre('save',function(next)
{
    var user=this;
    
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) return next(err); // Exit if error is found
        user.password = hash; // Assign the hash to the user's password so it is saved in database encrypted
        next(); // Exit Bcrypt function
    });
});

UserSchema.plugin(titlize, {
    paths: [ 'name' ], // Array of paths
    
  });


UserSchema.methods.comparePassword=function(password){
    return bcrypt.compareSync(password, this.password);
};

//bcrypt.compareSync(myPlaintextPassword, hash);




module.exports = mongoose.model('User',UserSchema);
