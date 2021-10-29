const router = require('express').Router();

const { request } = require('express');
const { isAuth } = require('../middlewares/authMiddleware');

const tripService = require('../services/tripService');



router.get('/shared', async (req, res) => {
    let trip = await tripService.getAll();
    res.render('trip/shared', { trip });
});

router.get('/create', isAuth, (req, res) => {
    res.render('trip/create', { title: 'Offer Trip' });
});

router.post('/create', isAuth, async (req, res) => {
    try {
        await tripService.create({ ...req.body, creator: req.user._id });

        res.redirect('/');
    } catch (error) {
        res.render('trip/create', { error: getErrorMessage(error) })
    }

});
function getErrorMessage(error) {
    let errorNames = Object.keys(error.errors);

    if (errorNames.length > 0) {
        return error.errors[errorNames[0]];
    } else {
        return error.massage;
    }
}

router.get('/:tripId/details', async (req, res) => {

    let trip = await tripService.getOne(req.params.tripId);
    let tripData = await trip.toObject();
    let isOwner = tripData.creator == req.user?._id;
    let isJoined = trip.buddies.some(x => x._id == req.user?._id);
    let buddies = trip.getBuddies();
    let isAvailable = trip.seats > 0;
    let driver = tripData.creator = req.user?.email;
    res.render('trip/details', { ...tripData, isOwner, buddies, isJoined, isAvailable,driver })
});


router.get('/:tripId/join', isOwner, async (req, res) => {

    await tripService.addPassenger(req.params.tripId, req.user?._id);

    res.redirect(`/trip/${req.params.tripId}/details`);
});


router.get('/:tripId/delete', isntOwner, async (req, res) => {
    await tripService.delete(req.params.tripId)

    res.redirect('/trip/shared');
});


router.get('/:tripId/edit', isntOwner, async (req, res) => {
    let trip = await tripService.getOne(req.params.tripId);

    res.render('trip/edit', { ...trip.toObject() });
});


router.post('/:tripId/edit', isntOwner, async (req, res) => {
    await tripService.updateOne(req.params.tripId, req.body)

    res.redirect(`/trip/${req.params.tripId}/details`);
});

async function isOwner(req, res, next) {
    let trip = await tripService.getOne(req.params.tripId);

    if (trip.owner == req.user._id) {
        res.redirect(`/trip/${req.params.tripId}/details`);
    } else {
        next();
    }
}
async function isntOwner(req, res, next) {
    let trip = await tripService.getOne(req.params.tripId);
    if (trip.owner != req.user._id) {
        next()
    } else {
        res.redirect(`/trip/${req.params.tripId}/details`);
    }
}
module.exports = router;

