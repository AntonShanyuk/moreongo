'use strict';

var _ = require('lodash');
var moment = require('moment');

class MeetingController {
    constructor(meetingModel, organizationModel, validationChecker) {
        this.meetingModel = meetingModel;
        this.organizationModel = organizationModel;
        this.validationChecker = validationChecker;
    }

    postMeeting(req, res) {
        this._validateMeetingRequest(req);
        if (this.validationChecker.checkValidationErrors(req, res)) {
            return;
        }

        this.meetingModel.createAsync({
            organization: req.body.organization,
            service: req.body.service,
            date: req.body.date,
            email: req.body.email,
            phone: req.body.phone
        }).then(doc => {
            res.send(doc);
        }).catch(err => {
            res.status(500).send(err);
        });
    }

    getMyMeetings(req, res) {
        this.organizationModel.findOneAsync({ user: req.user.email }).then(organization => {
            var fromDate = req.query.date ? moment(req.query.date) : moment();
            var toDate = moment(fromDate).add({ days: 1 });

            return this.meetingModel.findAsync({
                organization: organization._id,
                date: {
                    $gt: fromDate.startOf('day').toDate(),
                    $lt: toDate.startOf('day').toDate()
                }
            });
        }).then(results => {
            res.send(_.map(results, result => {
                return _.pick(result, ['_id', 'date', 'email', 'phone', 'service']);
            }));
        }).catch(err => {
            res.status(500).send(err);
        });
    }

    _validateMeetingRequest(req) {
        req.checkBody('organization').notEmpty().isString();
        req.checkBody('service', 'Invalid service').notEmpty().isString();

        req.checkBody('date').notEmpty().isDate();
        req.checkBody('email', 'Invalid email').notEmpty().isString().isEmail();
        req.checkBody('phone', 'Invalid phone').notEmpty().isString();
    }
}

module.exports = MeetingController;