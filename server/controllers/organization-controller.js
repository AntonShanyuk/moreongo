'use strict';

class OrganizationController {
    constructor(organizationModel) {
        this.organizationModel = organizationModel;
    }

    postOrganization(req, res) {
        return this.organizationModel.createAsync(req.body).then(doc => {
            res.send(doc);
        }).catch(err => {
            res.status(500).send(err);
        });
    }
}

module.exports = OrganizationController;