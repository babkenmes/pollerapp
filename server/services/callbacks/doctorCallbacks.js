const helper = require('../../utils/entityHelper');
const constants = require('./../../utils/constants');

const _getAllRes = function (res, data) {
    res.json(data);
}
const _getByIdRes = function (res, data) {
    if (!data) {
        res.send(404);
    }
    else {
        res.json(data);
    }
}
const _addRes = function (res, data) {
    res.json(data);
}
const _editRes = function (req, res, data) {

    var newData = req.body;
    var restrictedFields = ["_id", "__v"];
    for (var field in newData) {
        if (newData.hasOwnProperty(field) && newData[field] !== undefined && !restrictedFields.some(function (rFld) { return rFld == field })) {
            if (!data[field] && !newData[field]) newData[field] = " ";
            data[field] = newData[field];
        }
    }
    var datafields = Object.keys(data);
    datafields.forEach(function (datafield) {
        if (data.hasOwnProperty(datafield) && !restrictedFields.some(function (rFld) { return rFld == datafield })) {
            if (!data[datafield]) data[datafield] = " ";
        }
    });
    data.save(function (err) {
        if (err)
            res.status(500).send(err);
        else {
            res.json(data);
        }
    });
}
const _deleteRes = function (res, data) {
    data.isDeleted = true;
    data.save(function (err) {
        if (err)
            res.status(403).send("You are not authorized");
        else
            res.json(data);
    });
}
const _generateXlsxRes = function (xlsxHelper, XLSX, req, res, data) {
    if (!data || !data.length) { res.send(404); return; }
    var userRole = req.user.role;
    var isAdmin = userRole === constants.roles.adminRoleName;
    var wb = xlsxHelper.generateDoctorWorkBook(data, isAdmin);
    var fileName = 'reports/Report_Doctor' + (isAdmin ? "_full" : "") + '.xlsx';
    XLSX.writeFile(wb, 'public/' + fileName);
    res.json({ url: fileName });
}
const _rejected = function (res, err) {
    console.log(err);
    res.status(500).send(err);
    return;
}

module.exports = 
{
    getAllRes: _getAllRes,
    getByIdRes: _getByIdRes,
    addRes: _addRes,
    editRes: _editRes,
    deleteRes: _deleteRes,
    generateXlsxRes: _generateXlsxRes,
    rejected:_rejected
}

