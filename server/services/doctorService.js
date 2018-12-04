
module.exports = function (Doctor) {
    const helper = require('../utils/entityHelper');
    const doctorCallbacks = require('./callbacks/doctorCallbacks'); 

    const XLSX = require('xlsx');
    const xlsxHelper = require('../utils/xlsxHelper');
    const constants = require('./../utils/constants');

    const _getAll = function (req, res, next) {
        var query = Doctor.find(req.user.queryConditions);
        query.exec().then(doctorCallbacks.getAllRes.bind(null, res));
    };

    const _getById = function (req, res, next) {
        if (!req.user) { res.status(417).send("No user info in request");  }
        if (!req.user.queryConditions) {res.status(417).send("No queryconditions in request"); }
        req.user.queryConditions["_id"] = req.params.id;

        var query = Doctor.findOne(req.user.queryConditions).populate("presentations");
        query.exec().then(doctorCallbacks.getByIdRes.bind(null, res), doctorCallbacks.rejected.bind(null, res));
    };

    const _add = function (req, res, next) {
        var entity = new Doctor();
        entity = req.body;
        helper.setCommonProps(entity, true, req.user.username);
        
        Doctor.create(entity).then(doctorCallbacks.addRes.bind(null, res), doctorCallbacks.rejected.bind(null, res));
    };

    const _edit = function (req, res, next) {
        if (!req.user) { res.status(417).send("No user info in request"); }
        if (!req.user.queryConditions) { res.status(417).send("No queryconditions in request"); }
        req.user.queryConditions["_id"] = req.params.id;
        var query = Doctor.findOne(req.user.queryConditions);
        query.exec().then(doctorCallbacks.editRes.bind(null, req, res), doctorCallbacks.rejected.bind(null, res));
    }

    const _delete = function (req, res, next) {
        if (!req.user) { res.status(417).send("No user info in request"); }
        if (!req.user.queryConditions) { res.status(417).send("No queryconditions in request"); }
        req.user.queryConditions["_id"] = req.params.id;

        var query = Doctor.findOne(req.user.queryConditions);
        query.exec().then(doctorCallbacks.deleteRes.bind(null, res), doctorCallbacks.rejected.bind(null, res));
    }

    const _generateXlsx = function (req, res, next) {
        if (!(req.user.role != constants.roles.supervisorRoleName || req.user.role != constants.roles.adminRoleName)) {
            return res.status(403).send("You are not authorized");
        }
        var query = Doctor.find(req.user.queryConditions);
        query.exec().then(doctorCallbacks.generateXlsxRes.bind(null, xlsxHelper, XLSX, req, res), doctorCallbacks.rejected.bind(null, res));
    }

    return {
        getAll: _getAll,
        getById: _getById,
        add: _add,
        edit: _edit,
        generateXlsx: _generateXlsx,
        delete: _delete
    };
};
