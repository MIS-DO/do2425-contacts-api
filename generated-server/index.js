const http = require('http');
const express = require("express");
const { initialize } = require('@oas-tools/core');


const serverPort = 8080;
const app = express();
app.use(express.json({limit: '50mb'}));

const config = {
    oasFile: "./api/oas-doc.yaml",
    middleware: {
        security: {
            auth: {
            }
        }
    }
}

// Initialize database before running the app
var db = require('./db');
db.connect(function (err, _db) {
  console.info('Initializing DB from the other container...');
  if(err) {
    console.error('Error connecting to DB!', err);
    return 1;
  } else {
    db.find({}, function (err, contacts) {
      if(err) {
        console.error('Error while getting initial data from DB!', err);
      } else {
        if (contacts.length === 0) {
          console.info('Empty DB, loading initial data...');
          db.init();
      } else {
          console.info('DB already has ' + contacts.length + ' contacts.');
      }
      }
    });
  }
});


initialize(app, config).then(() => {
    http.createServer(app).listen(serverPort, () => {
    console.log("\nApp running at http://localhost:" + serverPort);
    console.log("________________________________________________________________");
    if (!config?.middleware?.swagger?.disable) {
        console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
        console.log("________________________________________________________________");
    }
    });
});
