const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const tripController = require('./controllers/tripController');

router.use('/trip',tripController);
router.use(homeController);
router.use('/auth', authController);
router.use('*', (req, res) =>
{
    res.render('404');
});
module.exports = router;