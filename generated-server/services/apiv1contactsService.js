'use strict'

var db = require('../db');

module.exports.getContacts = function getContact(req, res) {
    console.info("New GET request to /contacts");
    db.find({}, function (err, contacts) {
        if (err) {
            console.error('Error getting data from DB');
            res.status(500).send(); // internal server error
        } else {
            console.info("Sending contacts: " + JSON.stringify(contacts, 2, null));
            res.send(contacts);
        }
    });
};

module.exports.addContact = function addContact(req, res) {
    //console.warn(req)
    var newContact = req.body;
    if (!newContact) {
        console.warn("New POST request to /contacts/ without contact, sending 400...");
        res.status(400).send(); // bad request
    } else {
        console.info("New POST request to /contacts with body: " + JSON.stringify(newContact, 2, null));
        if (!newContact.name || !newContact.phone || !newContact.email) {
            console.warn("The contact " + JSON.stringify(newContact, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            db.find({ "name": newContact.name }, function (err, contacts) {
                if (err) {
                    console.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (contacts.length > 0) {
                        console.warn("The contact " + JSON.stringify(newContact, 2, null) + " already extis, sending 409...");
                        res.status(409).send(); // conflict
                    } else {
                        console.info("Adding contact " + JSON.stringify(newContact, 2, null));
                        db.insert(newContact);
                        res.status(201).send(); // created
                    }
                }
            });
        }
    }
};