'use strict';

var passport = require('passport');
var Promise = require('bluebird');

class ApiRoutes {
    constructor(organizationController, sessionController) {
        this.organizationController = organizationController;
        this.sessionController = sessionController;
    }

    init(expressApp) {
        expressApp.get('/api/cities/:term?', (req, res) => {
            res.send([
                {
                    id: 1,
                    text: 'Киев'
                }, {
                    id: 2,
                    text: 'Житомир'
                }
            ]);
        });

        expressApp.get('/api/services/:term?', (req, res) => {
            res.send([
                {
                    id: 1,
                    text: 'Стрижка мужская'
                }, {
                    id: 2,
                    text: 'Стрижка женская'
                }
            ]);
        });

        expressApp.get('/api/session', (req, res) => {
            this.sessionController.get(req, res);
        });

        expressApp.post('/api/organization', (req, res, next) => {
            this.organizationController.postOrganization(req, res, next);
        });

        expressApp.get('/api/my-organization', ensureAuthenticated, (req, res) => {
            res.send({
                my: true
            });
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