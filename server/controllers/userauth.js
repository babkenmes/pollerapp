const express = require('express');
const passport = require('passport');
const router = express.Router();
const oauth2 = require('./../utils/auth/oauth2');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const User = require('../models/User.js');

require('../utils/auth/auth');
router.use(passport.initialize());
router.post('/token', oauth2.token);

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.json(401, { error: 'You have no permission to execute this action.' });
        }
        var token = jwt.sign({ username: user.username, role: user.role, _id: user._id, }, config.get("jwtSecret"));
        res.json({ success: true, token: token, username: user.username, fullName: user.firstName + " " + user.lastName, role: user.role });
    })(req, res, next);
});

router.post('/register', function (req, res, next) {
    let entity = new User();
    entity = req.body;
    User.create(entity, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.get('/userInfo',
    oauth2.token,
    function (req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`.  It is typically used to indicate scope of the token,
        // and used in access control checks.  For illustrative purposes, this
        // example simply returns the scope in the response.
        res.json({ user_id: req.user.userId, username: req.user.username, firstName: req.user.firstName, lastName: req.user.lastName })
    }
);


module.exports = router;