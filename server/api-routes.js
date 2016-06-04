'use strict';

class ApiRoutes {
    constructor(expressApp, organizationController) {
        this.app = expressApp;
        this.organizationController = organizationController;
    }

    init() {
        this.app.get('/api/cities/:term?', (req, res) => {
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

        this.app.get('/api/services/:term?', (req, res) => {
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

        this.app.post('/api/organization', (req, res) => {
            this.organizationController.postOrganization(req, res);
        });
    }
}

module.exports = ApiRoutes;