'use strict'

var db = require('../db');
const logger = require('../logger');

module.exports.findByname = function findByname(req, res) {
    var name = req.params.name;
    if (!name) {
        logger.warn("New GET request to /contacts/:name without name, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New GET request to /contacts/" + name);
        db.find({ "name": name }, function (err, filteredContacts) {
            if (err) {
                logger.error('Error getting data from DB');
                res.status(500).send(); // internal server error
            } else {
                if (filteredContacts.length > 0) {
                    var contact = filteredContacts[0]; //since we expect to have exactly ONE contact with this name
                    logger.debug("Sending contact: " + JSON.stringify(contact, 2, null));
                    res.send(contact);
                } else {
                    logger.warn("There are no contacts with name " + name);
                    res.status(404).send(); // not found
                }
            }
        });
    }
};


module.exports.updateContact = function updateContact(req, res) {
    var updatedContact = req.body;
    var name = req.params.name;
    if (!updatedContact) {
        logger.warn("New PUT request to /contacts/ without contact, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New PUT request to /contacts/" + name + " with data " + JSON.stringify(updatedContact, 2, null));
        if (!updatedContact.name || !updatedContact.phone || !updatedContact.email) {
            logger.warn("The contact " + JSON.stringify(updatedContact, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            db.find({ "name": updatedContact.name }, function (err, contacts) {
                if (err) {
                    logger.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (contacts.length > 0) {
                        db.update({ name: name }, updatedContact);
                        logger.debug("Modifying contact with name " + name + " with data " + JSON.stringify(updatedContact, 2, null));
                        res.status(204).send(); // no content
                    } else {
                        logger.warn("There are not any contact with name " + name);
                        res.status(404).send(); // not found
                    }
                }
            });
        }
    }
};


module.exports.deleteContact = function deleteContact(req, res) {
    var name = req.params.name;
    if (!name) {
        logger.warn("New DELETE request to /contacts/:name without name, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New DELETE request to /contacts/" + name);
        db.remove({ "name": name }, function (err, numRemoved) {
            if (err) {
                logger.error('Error removing data from DB');
                res.status(500).send(); // internal server error
            } else {
                logger.info("Contacts removed: " + numRemoved);
                if (numRemoved === 1) {
                    logger.debug("The contact with name " + name + " has been succesfully deleted, sending 204...");
                    res.status(204).send(); // no content
                } else {
                    logger.warn("There are no contacts to delete");
                    res.status(404).send(); // not found
                }
            }
        });
    }
};

