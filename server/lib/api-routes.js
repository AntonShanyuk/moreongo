'use strict';

var passport = require('passport');
var Promise = require('bluebird');

class ApiRoutes {
    constructor(organizationController, sessionController) {
        this.organizationController = organizationController;
        this.sessionController = sessionController;
    }

    init(expressApp) {

        expressApp.get('/api/services/:term*', (req, res) => {
            this.organizationController.searchServices(req, res);
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