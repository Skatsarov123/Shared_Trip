const router = require('express').Router();
const tripService = require('../services/tripService');
const authService = require('../services/authService');
const { AUTH_COOKIE_NAME } = require('../constants');
const { isGuest, isAuth } = require('../middlewares/authMiddleware');
const { count } = require('../models/user');



router.get('/login', isGuest, (req, res) => {
  res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
  const { email, password } = req.body;

  try {
    let token = await authService.login({ email, password })

    res.cookie(AUTH_COOKIE_NAME, token);

    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

router.get('/register',isGuest, (req, res) => {
  res.render('auth/register');
});


router.post('/register',isGuest, async (req, res) => {
  const { email, password, rePassword, gender } = req.body;

  if (password !== rePassword) {
    res.locals.error = 'Password missmatch';
    return res.render('auth/register');
  }

  try {
    await authService.register({
      email, password, rePassword,gender
    });


    let token = await authService.login({
      email,
      password
    })

    res.cookie(AUTH_COOKIE_NAME, token);

    res.redirect('/');
  } catch (error) {
    res.render('auth/register', { error: getErrorMessage(error) })
  }
});
router.get('/logout',isAuth, (req, res) => {
  user = req.user.email;
 
  res.clearCookie(AUTH_COOKIE_NAME);

  res.redirect('/');
});
function getErrorMessage(error) {
  let errorNames = Object.keys(error.errors);

  if (errorNames.length > 0) {
      return error.errors[errorNames[0]];
  } else {
      return error.massage;
  }
}

router.get('/profile',isAuth, async(req, res) => {


let user = await authService.profile(req.user._id);
let trips = await tripService.mytrips(req.user._id);
let male = user.gender == 'male';
let female = user.gender == 'female';

let tripCount = trips.length;
res.render('auth/profile',{ title: 'My Pofile', ...user,trips,tripCount,male,female });
})
module.exports = router;