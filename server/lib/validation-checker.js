'use strict';

class ValidationChecker {
    checkValidationErrors(req, res) {
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send(errors);
            return true;
        }
    }
}

module.exports = ValidationChecker;