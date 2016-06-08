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
            return localAuth(req, res).return(user);
        }).then(user => {
            Promise.promisifyAll(req);
            return req.loginAsync(user);
        }).then(() => {
            return this.organizationModel.createAsync({
                name: req.body.name,
                address: req.body.address,
                services: req.body.services,
                user: req.body.email
            });
        }).then(doc => {
            res.send(doc);
        }).catch(err => {
            res.status(500).end();
        });
    }

    putOrganization(req, res){
        this.organizationModel.updateAsync({_id: req.params.id, user: req.user.email}, req.body).then(() => {
            res.send({ok: true});
        }).catch(err => {
            res.status(500).end();
        });
    }

    myOrganization(req, res) {
        this.organizationModel.findOneAsync({ user: req.user.email }).then(organization => {
            res.send(organization);
        }).catch(err => {
            res.status(500).end();
        });
    }
}

module.exports = OrganizationController;