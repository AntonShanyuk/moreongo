'use strict';

var Promise = require('bluebird');
var passport = require('passport');

class OrganizationController {
    constructor(organizationModel, userModel) {
        this.organizationModel = organizationModel;
        this.userModel = userModel;
    }

    postOrganization(req, res) {
        this._validateOrganization(req);
        this._validateUser(req);

        if (this._checkValidationErrors(req, res)) {
            return;
        }

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
                location: req.body.location,
                services: req.body.services,
                user: req.body.email
            });
        }).then(doc => {
            res.send(doc);
        }).catch(err => {
            res.status(500).send(err);
        });
    }

    putOrganization(req, res) {
        this._validateOrganization(req);

        if (this._checkValidationErrors(req, res)) {
            return;
        }

        this.organizationModel.updateAsync({ _id: req.params.id, user: req.user.email }, {
            name: req.body.name,
            services: req.body.services,
            address: req.body.address,
            location: req.body.location
        }).then(organization => {
            res.send(organization);
        }).catch(err => {
            res.status(500).send(err);
        });
    }

    myOrganization(req, res) {
        this.organizationModel.findOneAsync({ user: req.user.email }).then(organization => {
            res.send(organization);
        }).catch(err => {
            res.status(500).send(err);
        });
    }

    searchServices(req, res) {
        var regexStr = `^${req.params.term}`;
        var regexOptions = 'i';
        var regex = new RegExp(regexStr, regexOptions);
        this.organizationModel.mapReduceAsync({
            scope: {
                regex: regex
            },
            map: function () {
                for (var i = 0; i < this.services.length; i++) {
                    var service = this.services[i];
                    if (regex.test(service.name)) {
                        emit(service.name, 1);
                    }
                }
            },
            reduce: function (key, values) {
                return Array.sum(values);
            },
            out: {
                inline: true
            },
            query: {
                services: {
                    $elemMatch: {
                        name: {
                            $regex: regexStr,
                            $options: regexOptions
                        }
                    }
                }
            }
        }).then(results => {
            res.send(results);
        }).catch(err => {
            res.status(500).send(err);
        });
    }

    geoFind(req, res) {
        var query = {
            location: {
                $near: [req.params.lng, req.params.lat],
                $maxDistance: 0.3 // try 4/zoom
            }
        }

        if (req.query.service) {
            query.services = {
                $elemMatch: {
                    name: {
                        $regex: `^${req.query.service}`,
                        $options: 'i'
                    }
                }
            }
        }

        this.organizationModel.findAsync(query).then(results => {
            res.send(results);
        });
    }

    _validateOrganization(req) {
        req.checkBody('name', 'Invalid name').notEmpty();
        req.checkBody('address', 'Invalid address').notEmpty();
        req.checkBody('location', 'Invalid location').notEmpty().isArray();
        req.checkBody('location[0]', 'Invalid longitude').notEmpty().isFloat();
        req.checkBody('location[1]', 'Invalid latitude').notEmpty().isFloat();
    }

    _validateUser(req) {
        req.checkBody('email', 'Invalid email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid password').notEmpty();
    }

    _checkValidationErrors(req, res) {
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send(errors);
            return true;
        }
    }
}

module.exports = OrganizationController;