
const Doctor = require('../../models/doctor');
const helper = require('../../utils/entityHelper');
const jwt = require('jsonwebtoken');
const config = require('../../utils/config');
const socketHelper = require('../../utils/socketHelper');

const constants = require('./../../utils/constants');

const _submitSurveyRes = function (req, res, data) {
    if (!data) return next(res.status(404).send("No presentation found"));
    data.survey.answers = req.body;
    data.survey.submitted = true;
    data.save(function (err) {
        if (err)
            res.status(500).send(err);
        else
            res.json(data);
    });
}
const _getAllOldRes = function (req, res, data) {
    res.json(data);
}
const _getAllRes = function (req, res, data) {
    res.json(data);
}
const _generateXlsxRes = function (xlsxHelper, XLSX, req, res, data) {
    if (!data || !data.length) { res.send(404); return; }
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var userRole = req.user.role;
    var isAdmin = userRole === constants.roles.adminRoleName;
    var wb = xlsxHelper.generateWorkBook(data, isAdmin);
    var fileName = 'reports/Report_' + fromDate + '_' + toDate + (isAdmin ? "_full" : "") + '.xlsx';
    XLSX.writeFile(wb, 'public/' + fileName);
    res.json({ url: fileName });
}
const _getByIdRes = function (req, res, data) {
    if (!data) {
        res.send(404);
    }
    else {
        res.json(data);
    }
}
const _setVisitDoctorRes = function (req, res, data) {
    if (!data) {
        res.send(404);
    }
    else {
        if (!req.params.visit) res.status(417).send(err);
        data.doctorWantsVisit = req.params.visit;
        data.save(function (err) {
            if (err)
                res.status(500).send(err);
            else {
                res.json(data);
            }
        });
    }
}
const _startRes = function (io, req, res, data) {
    if (!data) { res.status(404).send("Presentation with requested id was not found"); return; }
    if (!io.nsps["/" + data._id.toString()]) {
        socketHelper.createNamespace(io, data);
    }
    res.sendStatus(200);
}
const _addRes = function (mailSenderService, Doctor, req, res, data) {
    if (data.doctor) {
        Doctor.findById(data.doctor, function (err, doctor) {
            if (err) {
                console.log(error);
            } else {
                var doctorObj = doctor
                if (doctorObj) {
                    var appointedDate = new Date(data.appointedDate);
                    appointedDate.setHours(appointedDate.getHours() + 3);
                    var mailData = {
                        firstName: doctorObj.firstName,
                        lastName: doctorObj.lastName,
                        startDate: appointedDate.toUTCString('ru', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric'
                        }).replace('GMT', "По Московскому времени")
                    };
                    mailSenderService.sendHtmlEmail(doctorObj.email, "Notification", mailData, "presentationNotification");
                }
            }
        });
    }
    res.json(data);
}
const _editRes = function (mailSenderService, req, res, data) {
    var newData = req.body;
    var restrictedFields = ["_id", "__v", "slidesInfo", "recordings", "selectedAdvmaterials", "status"];
    var appointedDateChanged = newData && newData.appointedDate && new Date(newData.appointedDate).getTime() != data.appointedDate.getTime();
    var doctorChanged = newData.doctor && newData.doctor != data.doctor;
    for (var field in newData) {
        if (newData.hasOwnProperty(field) && newData[field] !== undefined && !restrictedFields.some(function (rFld) { return rFld == field })) {
            data[field] = newData[field];
        }
    }
    data.save(function (err) {
        if (err)
            res.status(500).send(err);
        else {
            if ((appointedDateChanged || doctorChanged) && data.doctor) {
                Doctor.findById(data.doctor, function (err, doctor) {
                    if (err) {
                        console.log(error);
                    } else {
                        doctorObj = doctor
                        if (doctorObj) {
                            var appointedDate = new Date(data.appointedDate);
                            appointedDate.setHours(appointedDate.getHours() + 3);
                            var mailData = {
                                firstName: doctorObj.firstName,
                                lastName: doctorObj.lastName,
                                startDate: appointedDate.toUTCString('ru', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric'
                                }).replace('GMT', "По Московскому времени")
                            };
                            mailSenderService.sendHtmlEmail(doctorObj.email, "Notification", mailData, "presentationEditNotification");
                        }
                    }
                });
            }
            res.json(data);
        }
    });
}
const _deleteRes = function (req, res, data) {
    data.isDeleted = true;
    data.save(function (err) {
        if (err)
            res.status(403).send("You are not authorized");
        else
            res.json(data);
    });
}
const _presentationReminderRes = function (mailSenderService, req, res, data) {
    console.log("sending reminder email");
    if (!data) {
        res.status(404).send("Presentation with requested id was not found");
    }
    else {
        var siteURL = config.get('websiteUrl');
        var mailData = {
            firstName: data.doctor.firstName,
            lastName: data.doctor.lastName,
            startDate: data.appointedDate.toUTCString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).replace('GMT', "По Московскому времени")
        };
        mailData.url = siteURL + "/redirectToApp/" + req.params.id;
        mailSenderService.sendHtmlEmail(data.doctor.email, "Presentation Started", mailData, "presentationReminder");
        console.log("email sent");
        res.send(200);
    }
}
const _rejected = function (req, res, data) {
    console.log(err);
    res.status(500).send(err);
    return;
}


module.exports =
    {
        submitSurveyRes: _submitSurveyRes,
        getAllOldRes: _getAllOldRes,
        getAllRes: _getAllRes,
        generateXlsxRes: _generateXlsxRes,
        getByIdRes: _getByIdRes,
        startRes: _startRes,
        addRes: _addRes,
        editRes: _editRes,
        deleteRes: _deleteRes,
        presentationReminderRes: _presentationReminderRes,
        setVisitDoctorRes: _setVisitDoctorRes,
        rejected: _rejected
    };