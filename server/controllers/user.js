const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const helper = require('../utils/entityHelper');
const oauth2 = require('./../utils/auth/oauth2');
const constants = require('./../utils/constants');

router.use(oauth2.token, function (req, res, next) {
    if (req.user.role == constants.roles.adminRoleName) {
        req.user.queryConditions = {
            "$or": [
                { "role": constants.roles.medRepRoleName },
                { "role": constants.roles.supervisorRoleName }
            ]
        };
        next();
    }
    else {
        return res.status(403).send("You are not aouthorized");
    }
});

/* GET all Users. */
router.get('/', function (req, res) {
    User.find(req.user.queryConditions, function (err, todos) {
        if (err) return next(err);
        res.json(todos);
    });
});

/* GET /Users/id */
router.get('/:id', function (req, res, next) {
    User.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        if (!post) {
            res.send(404);
        }
        else {
            res.json(post);
        }
    });
});

/* POST: Add new Users*/
router.post('/', function (req, res, next) {
    var entity = new User();
    entity = req.body;
    helper.setCommonProps(entity, true, req.user.username);
    User.create(entity, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /Users/:id */
router.put('/:id', function (req, res, next) {
    var entity = req.body;
    helper.setCommonProps(entity, false, req.user.username);
    User.findByIdAndUpdate(req.params.id, entity, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /Users/:id */
router.delete('/:id', function (req, res, next) {
    var entity = new User();
    entity.firstName = req.body.firstName;
    entity.lastName = req.body.lastName;
    entity.middleName = req.body.middleName;
    helper.setCommonProps(entity, true, req.user.username);
    req.user.queryConditions["_id"] = req.params.id;
    User.findOneAndRemove(req.user.queryConditions, entity, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.post('/user/resetPassword', function (req, res, next) {     
    User.findById(req.body.id).then(function (user) {
        user.resetPassword(req.body.newPassword);
        user.save();
        res.send(200);
    })
});

module.exports = router;