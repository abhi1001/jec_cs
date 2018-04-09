var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { JWTData: req.JWTData });
});
router.get('/index', function (req, res, next) {
  res.render('index', { JWTData: req.JWTData });
});
router.get('/login', function (req, res, next) {
  res.render('login', { JWTData: req.JWTData });
});
router.get('/aboutus', function (req, res, next) {
  res.render('aboutus', { JWTData: req.JWTData });
});
router.get('/academics', function (req, res, next) {
  res.render('academics', { JWTData: req.JWTData });
});
router.get('/chat', function (req, res, next) {
  if(req.JWTData.userType == 'guest'){
    return res.redirect('/login');
  }
  res.render('chat', { JWTData: req.JWTData });
});
router.get('/event', function (req, res, next) {
  res.render('event', { JWTData: req.JWTData });
});
router.get('/contactus', function (req, res, next) {
  res.render('contactus', { JWTData: req.JWTData });
});
router.get('/logout', function (req, res, next) {
  res.clearCookie("token");
  res.redirect('/');
});

router.post('/register', function (req, res, next) {
  console.log('###########################');
  console.log(req.body);

  var payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password
  };

  req.app.db.models.User.create(payload, (err, data) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json(data);
  });
});



router.post('/login', function (req, res, next) {
  console.log('###########################');
  console.log(req.body);

  var payload = {
    email: req.body.email,
  };

  req.app.db.models.User.findOne(payload, (err, data) => {
    if (err) {
      return next(err);
    }
    if (data == null) {
      res.send('User not found');
    } else {
      if (data.validPassword(req.body.password)) {
        
        var userPayload = {
          user: data.email,
          userType : 'user',
          firstName : data.firstName,
        }

        var token = req.app.jwt.sign(userPayload, 'secret');

        // add token to cookie
        res.cookie('token', token);

        return res.redirect('/chat');
      }
      else {
        return res.send('failed');
      }
    }
  });
});

module.exports = router;