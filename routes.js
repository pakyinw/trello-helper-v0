let global = require('./global.js')
const express = require('express');
const router = express.Router();
const entry = require('./service/entry.js')(global.oauth_secrets)
const login = require('./service/login.js')(global.oauth, global.oauth_secrets, global.authorizeURL, global.appName)
const cweeklyboard = require('./service/cweeklyboard.js')(global.oauth, global.oauth_secrets)

/*
/     Routes
*/
router.get("/", (request, response) => {
    console.log(`GET '/' 🤠 ${Date()}`);
    entry(request, response);
});
  
router.get("/login", (request, response) => {
    console.log(`GET '/login' 🤠 ${Date()}`);
    login(request, response);
});


router.get("/cweeklyboard", (request, response) => {
    console.log(`GET '/cweeklyboard' 🤠 ${Date()}`);
    cweeklyboard(request, response);
});

module.exports = router