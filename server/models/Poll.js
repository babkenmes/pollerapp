/* @flow */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Option = new Schema({
    title: String,
    votes: { type: Number, default: 0 },
});
const Poll = new Schema({
    title: String,
    createdBy: {
        type: String,
        required: true
    },
    options: [Option],
    voters: [String],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', Poll);