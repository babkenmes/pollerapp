/* @flow */
const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll.js');
const helper = require('../utils/entityHelper');
const oauth2 = require('./../utils/auth/oauth2');
const constants = require('./../utils/constants');


/* GET all Polls. */
router.get('/', function (req, res, next) {
    Poll.find({}).select('title').exec(function (err, polls) {
        if (err) return next(err);
        res.json(polls);
    });
});

/* GET /Polls/id */
router.get('/:id', function (req, res, next) {
    Poll.findById(req.params.id, function (err, data) {
        if (err) return next(err);
        if (!data) {
            res.send(404);
        }
        else {
            if (data.voters.some(voterIP=>voterIP == req.ip))
                data._doc["hasVoted"] = true;
            res.json(data);
        }
    });
});

/* POST: Add new Poll*/
router.post('/', oauth2.token, function (req, res, next) {
    const entity = req.body;
    delete entity._id;
    helper.setCommonProps(entity, true, req.user.username);
    Poll.create(entity, function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
});

/* POST: Vote Poll*/
router.post('/vote/:id', function (req, res, next) {
    const options = req.body;
    Poll.findById(req.params.id, function (err, data) {
        if (err) return next(err);
        if (!data) {
            res.send(404);
        }
        else {
            if (data.voters.some(voterIP=>voterIP == req.ip))
                res.send(405).send('You have already voted');

            options.forEach(optID => {
                const option = data.options.find(opt => {
                    return opt._id == optID
                })
                if (option)
                    option.votes = option.votes + 1;
            })
            data.voters.push(req.ip);
            data.save(function (err) {
                if (err)
                    res.status(500).send(err.message);
                else
                    res.json(data);
            });
        }
    });
});

/* PUT /Polls/:id */
router.put('/:id', oauth2.token, function (req, res, next) {
    const entity = req.body;
    helper.setCommonProps(entity, false, req.user.username);
    Poll.findByIdAndUpdate(req.params.id, entity, function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
});

/* DELETE /Polls/:id */
router.delete('/:id', oauth2.token, function (req, res, next) {
    Poll.findOneAndRemove({ "_id": req.params.id }, function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
});

module.exports = router;