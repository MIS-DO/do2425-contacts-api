'use strict';

var Datastore = require('nedb');
var assert = require('assert');
var path = require('path');

const dbPath = 'data/';
const dbFileName = path.join(__dirname, dbPath, 'contacts.db');

var _db;

//Creates the connection to the database
module.exports.connect = function connect(cb) {
    if (_db) {
        console.warn("Trying to create the DB connection again!");
        return cb(null, _db);
    }
    _db = new Datastore({
        filename: dbFileName,
        autoload: true
    });
    return cb(null, _db);
};

//Return the connection to the database if it was previously created
module.exports.getConnection = function getConnection() {
    assert.ok(_db, "DB connection has not been created. Please call connect() first.");
    return _db;
};

//Helper method to initialize the database with sample data
module.exports.init = function init() {
    var sampleContacts = [
        {
            "name": "John",
            "phone": 601234567,
            "email": "john.doe@example.com"
        },
        {
            "name": "Jane",
            "phone": 954556357,
            "email": "jane.doe@example.com"
        },
        {
            "name": "Foo",
            "phone": 954556358,
            "email": "foo@example.com"
        },
        {
            "name": "Bar",
            "phone": 954556359,
            "email": "bar@example.com"
        }
    ];
    return this.getConnection().insert(sampleContacts);
};

//Executes the query and return the result in the callback function
module.exports.find = function find(query, cb) {
    return this.getConnection().find(query, cb);
};

//Inserts a new document in the database
module.exports.insert = function insert(doc, cb) {
    return this.getConnection().insert(doc, cb);
};

//Updates a document that matches the query
module.exports.update = function update(query, newDoc, cb) {
    return this.getConnection().update(query, newDoc, cb);
};

//Removes a document from the database
module.exports.remove = function remove(query, cb) {
    return this.getConnection().remove(query, cb);
};