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
                location: req.body.location,
                services: req.body.services,
                user: req.body.email
            });
        }).then(doc => {
            res.send(doc);
        }).catch(err => {
            res.status(500).end();
        });
    }

    putOrganization(req, res) {
        this.organizationModel.updateAsync({ _id: req.params.id, user: req.user.email }, req.body).then(organization => {
            res.send(organization);
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
            res.status(500).end();
        });
    }

    geoFind(req, res) {
        var query = {
            location: {
                $near: [req.params.lng, req.params.lat],
                $maxDistance: 0.3
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
}

module.exports = OrganizationController;