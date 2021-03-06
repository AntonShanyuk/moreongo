'use strict';

var passport = require('passport');
var Promise = require('bluebird');

class ApiRoutes {
    constructor(organizationController, sessionController, meetingController) {
        this.organizationController = organizationController;
        this.sessionController = sessionController;
        this.meetingController = meetingController;
    }

    init(expressApp) {

        expressApp.get('/api/services/:term*', (req, res) => {
            this.organizationController.searchServices(req, res);
        });

        expressApp.get('/api/defaults', (req, res) => {
            res.send({
                city: 'Київ',
                location: { latitude: 50.4223541, longitude: 30.5211557 }
            });
        });

        expressApp.get('/api/session', (req, res) => {
            this.sessionController.get(req, res);
        });

        expressApp.post('/api/session', passport.authenticate('local'), (req, res) => {
            res.send({ ok: true });
        });

        expressApp.delete('/api/session', (req, res) => {
            req.logout();
            res.send({ ok: true });
        });

        expressApp.post('/api/organization', (req, res, next) => {
            this.organizationController.postOrganization(req, res, next);
        });

        expressApp.put('/api/organization/:id', (req, res, next) => {
            this.organizationController.putOrganization(req, res, next);
        });

        expressApp.get('/api/my-organization', ensureAuthenticated, (req, res) => {
            this.organizationController.myOrganization(req, res);
        });

        expressApp.get('/api/organizations/:lng/:lat', (req, res) => {
            this.organizationController.geoFind(req, res);
        });

        expressApp.post('/api/meeting', (req, res) => {
            this.meetingController.postMeeting(req, res);
        });

        expressApp.post('/api/meeting/accepted', ensureAuthenticated, (req, res) => {
            this.meetingController.postMeetingAccepted(req, res);
        });

        expressApp.put('/api/meeting/:id', (req, res) => {
            this.meetingController.putMeeting(req, res);
        });

        expressApp.get('/api/meetings/my', ensureAuthenticated, (req, res) => {
            this.meetingController.getMyMeetings(req, res);
        });

        function ensureAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.status(401).end();
            }
        }
    }
}

module.exports = ApiRoutes;