'use strict';

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

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
            phone: req.body.phone,
            messages: [{
                status: 'pending',
                text: req.body.message
            }]
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
                $or: [
                    {
                        date: {
                            $gt: fromDate.startOf('day').toDate(),
                            $lt: toDate.startOf('day').toDate()
                        }
                    },
                    {
                        status: 'pending'
                    }
                ]
            });
        }).then(results => {
            res.send(_.map(results, result => {
                return _.pick(result, ['_id', 'date', 'email', 'phone', 'service', 'status', 'messages']);
            }));
        }).catch(err => {
            res.status(500).send(err);
        });
    }

    putMeeting(req, res) {
        this._validateChangeStatusRequest(req);
        if (this.validationChecker.checkValidationErrors(req, res)) {
            return;
        }

        Promise.props({
            meeting: this.meetingModel.findByIdAsync(req.params.id),
            userOrganization: this.organizationModel.findOneAsync({ user: req.user.email })
        }).then(result => {
            if (result.userOrganization._id.toString() !== result.meeting.organization) {
                return Promise.reject({ status: 403, message: 'Access denied' });
            }

            var statusMismatch = false;
            switch (result.meeting.status) {
                case 'pending':
                    if (req.body.status == 'pending' || req.body.status == 'cancelled') {
                        statusMismatch = true;
                    }
                    break;
                case 'accepted':
                    if (req.body.status == 'pending' || req.body.status == 'accepted' || req.body.status == 'rejected') {
                        statusMismatch = true;
                    }
                    break;
                case 'rejected':
                    statusMismatch = true;
                    break;
                case 'cancelled':
                    statusMismatch = true;
                    break;
                default:
                    throw new Error(`status ${result.meeting.status} is not supported`);
            }

            if (statusMismatch) {
                return Promise.reject({ status: 400, message: `Cannot change status from ${result.meeting.status} to ${req.body.status}` });
            }

            result.meeting.status = req.body.status;
            result.meeting.messages.push({
                status: req.body.status,
                text: req.body.message
            });

            return result.meeting.saveAsync();
        }).then(doc => {
            res.send(doc);
        }).catch(err => {
            res.status(err.status || 500).send(err);
        });
    }

    _validateChangeStatusRequest(req) {
        req.checkBody('id', 'Invalid meeting id').notEmpty().isString();
        req.checkBody('status', 'Invalid status').notEmpty().isString();
        req.checkBody('message', 'Invalid message').notEmpty().isString();
    }

    _validateMeetingRequest(req) {
        req.checkBody('organization', 'Invalid organizationId').notEmpty().isString();
        req.checkBody('service', 'Invalid service').notEmpty().isString();

        req.checkBody('date').notEmpty().isDate();
        req.checkBody('email', 'Invalid email').notEmpty().isString().isEmail();
        req.checkBody('phone', 'Invalid phone').notEmpty().isString();
        req.checkBody('message', 'Invalid message').notEmpty().isString();
    }
}

module.exports = MeetingController;