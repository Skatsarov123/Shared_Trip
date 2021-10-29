const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
   
    start: {
        type: String,
        required: true,
        minlength: [4,' at least 4 characters long '] 
    },
    end: {
        type: String,
        required: true,
        minlength: [4,' at least 4 characters long '] 
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//i
    },
    brand: {
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
        min:[0, 'min 0'],   
        max:[4, 'max 4'] 
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: [10,' at least 10 characters long '] 
    },
    buddies: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

tripSchema.method('getBuddies', function(){
    return this.buddies.map(x => x.email).join(', ');
});
const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip