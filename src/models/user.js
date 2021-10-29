const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        validate: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'shout be email']
    },
    password:{
        type: String,
        required: true,
        minlength: [4,'The password should be at least 4 characters long '] 
    },
    gender:{
        type: String,
        enum: ['female', 'male'],
    },
});

userSchema.pre('save', function(next){
   return bcrypt.hash(this.password, SALT_ROUNDS)
       .then((hash)=>{
           this.password = hash;

           return next();
       });
});

userSchema.method('validatePassword', function(password){
   return bcrypt.compare(password, this.password)
});

const User = mongoose.model('User', userSchema);

module.exports = User