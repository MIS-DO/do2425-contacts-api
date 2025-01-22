const service = require('../services/apiv1contactsnameService.js');

module.exports.findByname = function findByname(req, res) {
    service.findByname(req, res);
}

module.exports.updateContact = function updateContact(req, res) {
    service.updateContact(req, res);
}

module.exports.deleteContact = function deleteContact(req, res) {
    service.deleteContact(req, res);
}

