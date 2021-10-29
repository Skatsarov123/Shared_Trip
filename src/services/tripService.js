const Trip = require('../models/trip');

exports.getAll = () => Trip.find().lean();

exports.create = (tripData) => Trip.create(tripData);

exports.mytrips = (UserId) => Trip.find({buddies:UserId}).lean().populate('buddies');

exports.getOne = (tripId) => Trip.findById(tripId).populate('buddies');



exports.addPassenger = (tripId, buddiesId) =>
    // let housing = await housingService.getOne(req.params.housingId);
    // housing.tenants.push(req.user._id)
    // return housing.save();

    Trip.findOneAndUpdate(
        { _id: tripId },
        {
            $push: { buddies: buddiesId },
            $inc: { seats: -1 }
        },
        { runValidators: true }
    );

exports.delete = (tripId) => Trip.findByIdAndDelete(tripId);

exports.updateOne = (tripId, tripData) => Trip.findByIdAndUpdate(tripId, tripData);

exports.search = (text) => Trip.find({ type: { $regex: `${text}` , $options: 'i'}}).lean();

