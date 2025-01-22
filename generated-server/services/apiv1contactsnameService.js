'use strict'

var db = require('../db');

module.exports.findByname = function findByname(req, res) {
    var name = req.params.name;
    if (!name) {
        console.warn("New GET request to /contacts/:name without name, sending 400...");
        res.status(400).send(); // bad request
    } else {
        console.info("New GET request to /contacts/" + name);
        db.find({ "name": name }, function (err, filteredContacts) {
            if (err) {
                console.error('Error getting data from DB');
                res.status(500).send(); // internal server error
            } else {
                if (filteredContacts.length > 0) {
                    var contact = filteredContacts[0]; //since we expect to have exactly ONE contact with this name
                    console.info("Sending contact: " + JSON.stringify(contact, 2, null));
                    res.send(contact);
                } else {
                    console.warn("There are no contacts with name " + name);
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
        console.warn("New PUT request to /contacts/ without contact, sending 400...");
        res.status(400).send(); // bad request
    } else {
        console.info("New PUT request to /contacts/" + name + " with data " + JSON.stringify(updatedContact, 2, null));
        if (!updatedContact.name || !updatedContact.phone || !updatedContact.email) {
            console.warn("The contact " + JSON.stringify(updatedContact, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            db.find({ "name": updatedContact.name }, function (err, contacts) {
                if (err) {
                    console.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (contacts.length > 0) {
                        db.update({ name: name }, updatedContact);
                        console.info("Modifying contact with name " + name + " with data " + JSON.stringify(updatedContact, 2, null));
                        res.status(204).send(); // no content
                    } else {
                        console.warn("There are not any contact with name " + name);
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
        console.warn("New DELETE request to /contacts/:name without name, sending 400...");
        res.status(400).send(); // bad request
    } else {
        console.info("New DELETE request to /contacts/" + name);
        db.remove({ "name": name }, function (err, numRemoved) {
            if (err) {
                console.error('Error removing data from DB');
                res.status(500).send(); // internal server error
            } else {
                console.info("Contacts removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.info("The contact with name " + name + " has been succesfully deleted, sending 204...");
                    res.status(204).send(); // no content
                } else {
                    console.warn("There are no contacts to delete");
                    res.status(404).send(); // not found
                }
            }
        });
    }
};

