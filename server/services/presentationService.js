module.exports = function (Presentation, Doctor, io) {
    const presClbcks = require('./callbacks/presentationCallbacks');
    const XLSX = require('xlsx');
    const mailSenderService = require('../services/mailSender');
    const xlsxHelper = require('../utils/xlsxHelper');

    const helper = require('../utils/entityHelper');
    const jwt = require('jsonwebtoken');
    const config = require('../utils/config');
    const socketHelper = require('../utils/socketHelper');

    const constants = require('./../utils/constants');

    const _submitSurvey = function (req, res, next) {
        req.user.queryConditions["_id"] = req.params.id;
        var query = Presentation.findOne(req.user.queryConditions).populate('medRep').populate('doctor').populate('file').populate('survey.survey')
        query.exec().then(presClbcks.submitSurveyRes.bind(null, req, res), presClbcks.rejected.bind(null, res));
    }
    const _getAllOld = function (req, res, next) {
        var query = Presentation.find(req.user.queryConditions).select('+slidesInfo +recordings').populate('medRep').populate('doctor').populate('file').populate('survey.survey').populate('survey.answers.question').populate('selectedAdvmaterials');
        query.exec().then(presClbcks.getAllOldRes.bind(null, req, res), presClbcks.rejected.bind(null, res));
    }
    const _getAll = function (req, res, next) {
        var query = Presentation.find(req.user.queryConditions).populate('medRep').populate('doctor')
        query.exec().then(presClbcks.getAllRes.bind(null, req, res), presClbcks.rejected.bind(null, res));
    }

    const _generateXlsx = function (req, res, next) {
        var fromDate = req.query.fromDate;
        var toDate = req.query.toDate;
        req.user.queryConditions["appointedDate"] = { $gte: fromDate, $lte: toDate };
        req.user.queryConditions["status"] = "finished";
        if (!(req.user.role != constants.roles.supervisorRoleName || req.user.role != constants.roles.adminRoleName)) {
            return res.status(403).send("You are not authorized");
        }
        var query = Presentation.find(req.user.queryConditions).select('+slidesInfo +recordings').populate('medRep').populate('doctor').populate('file').populate('survey.survey').populate('survey.answers.question').populate('selectedAdvmaterials')
        query.exec().then(presClbcks.generateXlsxRes.bind(null, xlsxHelper, XLSX, req, res), presClbcks.rejected.bind(null, res));
    }

    const _getById = function (req, res, next) {
        req.user.queryConditions["_id"] = req.params.id;
        var query = Presentation.findOne(req.user.queryConditions).select('+slidesInfo +recordings').populate('medRep doctor file survey.survey survey.answers.question selectedAdvmaterials')
        query.exec().then(presClbcks.getByIdRes.bind(null, req, res), presClbcks.rejected.bind(null, res));
    };
    const _setVisitDoctor = function (req, res, next) {
        req.user.queryConditions["_id"] = req.params.id;
        var query = Presentation.findOne(req.user.queryConditions)
        query.exec().then(presClbcks.setVisitDoctorRes.bind(null, req, res), presClbcks.rejected.bind(null, res));
    };
    const _start = function (req, res, next) {
        req.user.queryConditions["_id"] = req.params.id;
        var query = Presentation.findOne(req.user.queryConditions).select('+slidesInfo +recordings').populate('medRep').populate('doctor').populate('file').populate('survey.survey').populate('survey.answers.question').populate('selectedAdvmaterials')
        query.exec().then(presClbcks.startRes.bind(null, io, req, res), presClbcks.rejected.bind(null, res));
    }
    const _add =  function (req, res, next) {
        var entity = new Presentation();
        var doctorObj;
        entity = req.body;
        entity.medRep = req.user._id;
        helper.setCommonProps(entity, true, req.user.username);
        Presentation.create(entity).then(presClbcks.addRes.bind(null, mailSenderService, Doctor, req, res), presClbcks.rejected.bind(null, res));
    }
    const _edit = function (req, res, next) {
        req.user.queryConditions["_id"] = req.params.id;
        var query = Presentation.findOne(req.user.queryConditions);
        query.exec().then(presClbcks.editRes.bind(null, mailSenderService, req, res), presClbcks.rejected.bind(null, res));
    }
    const _delete = function (req, res, next) {
        req.user.queryConditions["_id"] = req.params.id;
        var query = Presentation.findOne(req.user.queryConditions);
        query.exec().then(presClbcks.deleteRes.bind(null, req, res), presClbcks.rejected.bind(null, res));
    }
    const _presentationReminder = function (req, res) {
        req.user.queryConditions["_id"] = req.params.id;
        var query = Presentation.findOne(req.user.queryConditions).populate('doctor');
        query.exec().then(presClbcks.presentationReminderRes.bind(null, mailSenderService, req, res), presClbcks.rejected.bind(null, res));
    }

    return {
        submitSurvey: _submitSurvey,
        getAllOld: _getAllOld,
        getAll: _getAll,
        generateXlsx: _generateXlsx,
        getById: _getById,
        start: _start,
        add: _add,
        edit: _edit,
        delete: _delete,
        presentationReminder: _presentationReminder,
        setVisitDoctor: _setVisitDoctor
    };
}