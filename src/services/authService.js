
const jwt = require('../utils/jwt');
const User = require('../models/user');
const {JWT_SECRET} =require ('../constants');

exports.login = async ({email,password}) => {
    let user = await User.findOne({email});

    if(!user){
        throw new Error('invalid email or password')
    }
    let isValid = await user.validatePassword(password);

    if(!isValid){
        throw new Error('invalid email or password')
    }
    let payload = {
        _id: user._id,
        email:user.email,
       
    };
    let token= await jwt.sign(payload, JWT_SECRET);
   
    return token
}

exports.profile = (userId) =>User.findById(userId).lean();

exports.register = (userData)=>User.create(userData);