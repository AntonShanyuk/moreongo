'use strict';

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

class MeetingController {
    constructor(config, meetingModel, organizationModel, validationChecker) {
        this.config = config;
        this.meetingModel = meetingModel;
        this.organizationModel = organizationModel;
        this.validationChecker = validationChecker;
    }

    postMeeting(req, res) {
        this._createMeeting(req, res).catch(err => {
            res.status(500).send(err);
        });
    }

    postMeetingAccepted(req, res) {
        this._checkOrganizationOwnership(req.body.organization, req.user.email).then(() => {
            return this._createMeeting(req, res, true);
        }).catch(err => {
            res.status(err.status || 500).send(err);
        });
    }

    getMyMeetings(req, res) {
        this.organizationModel.findOneAsync({ user: req.user.email }).then(organization => {
            var fromDate = req.query.date ? moment(req.query.date, this.config.dateUrlFormat) : moment();
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

        this.meetingModel.findByIdAsync(req.params.id).then(meeting => {
            return this._checkOrganizationOwnership(meeting.organization, req.user.email).return(meeting);
        }).then(meeting => {
            var statusMismatch = false;
            switch (meeting.status) {
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
                    throw new Error(`status ${meeting.status} is not supported`);
            }

            if (statusMismatch) {
                return Promise.reject({ status: 400, message: `Cannot change status from ${meeting.status} to ${req.body.status}` });
            }

            meeting.status = req.body.status;
            meeting.messages.push({
                status: req.body.status,
                text: req.body.message
            });

            return meeting.saveAsync();
        }).then(doc => {
            res.send(doc);
        }).catch(err => {
            res.status(err.status || 500).send(err);
        });
    }

    _checkOrganizationOwnership(organizationId, email) {
        return this.organizationModel.findOneAsync({ user: email }).then(organization => {
            if (organization._id.toString() !== organizationId) {
                return Promise.reject({ status: 403, message: 'Access denied' });
            }
        });
    }

    _createMeeting(req, res, isOwner) {
        this._validateMeetingRequest(req, isOwner);
        if (this.validationChecker.checkValidationErrors(req, res)) {
            return;
        }

        return this.meetingModel.createAsync({
            organization: req.body.organization,
            service: req.body.service,
            date: req.body.date,
            email: req.body.email,
            phone: req.body.phone,
            status: isOwner ? 'accepted' : 'pending',
            messages: [{
                status: isOwner ? 'accepted' : 'pending',
                text: req.body.message
            }]
        }).then(doc => {
            res.send(doc);
        });
    }

    _validateChangeStatusRequest(req) {
        req.checkBody('id', 'Invalid meeting id').notEmpty().isString();
        req.checkBody('status', 'Invalid status').notEmpty().isString();
        req.checkBody('message', 'Invalid message').notEmpty().isString();
    }

    _validateMeetingRequest(req, isOwner) {
        req.checkBody('organization', 'Invalid organizationId').notEmpty().isString();
        req.checkBody('service', 'Invalid service').notEmpty().isString();

        req.checkBody('date').notEmpty().isDate();
        if (isOwner) {
            req.checkBody('email', 'Invalid email').optional().isString().isEmail();
        } else {
            req.checkBody('email', 'Invalid email').notEmpty().isString().isEmail();
        }

        req.checkBody('phone', 'Invalid phone').notEmpty().isString();
        req.checkBody('message', 'Invalid message').notEmpty().isString();
    }
}

module.exports = MeetingController;