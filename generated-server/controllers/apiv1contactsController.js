const service = require('../services/apiv1contactsService.js');

module.exports.getContacts = function getContacts(req, res) {
    service.getContacts(req, res);
}

module.exports.addContact = function addContact(req, res) {
    service.addContact(req, res);
}

