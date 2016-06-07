'use strict';

class SessionController {
    constructor(organizationModel, userModel) {
        this.organizationModel = organizationModel;
        this.userModel = userModel;
    }

    get(req, res) {
        var body = { isAuthenticated: req.isAuthenticated() };
        if (!body.isAuthenticated) {
            res.send(body);
        } else {
            this.organizationModel.findOneAsync({ user: req.user.email }).then(organization => {
                body.organizationName = organization.name;
                res.send(body);
            }).catch(err => {
                res.status(500).end();
            });
        }
    }
}

module.exports = SessionController;