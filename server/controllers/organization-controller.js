'use strict';

var Promise = require('bluebird');
var passport = require('passport');

class OrganizationController {
    constructor(organizationModel, userModel) {
        this.organizationModel = organizationModel;
        this.userModel = userModel;
    }

    postOrganization(req, res) {
        return this.userModel.registerAsync(new this.userModel({ email: req.body.email }), req.body.password).then(user => {
            var localAuth = Promise.promisify(passport.authenticate('local'));
            return localAuth(req, res);
        }).then(() => {
            return this.organizationModel.createAsync(req.body);
        }).then(doc => {
            res.send(doc);
        }).catch(err => {
            res.status(500).send(err);
        });
    }
}

module.exports = OrganizationController;