var express = require('express');
var router = express.Router();
var url = require('url')
var login = require('./service/login.js')
var cweeklyboard = require('./service/cweeklyboard.js')
var helper = require('./helper.js');
var global = require('./global.js')


/*
/     Routes
*/
router.get("/", (request, response) => {
    const query = url.parse(request.url, true).query;
    const oauth_token = query.oauth_token;
    const oauth_verifier = query.oauth_verifier;
    console.log(`GET '/' 🤠 ${Date()}`);
    var authenticated = !helper.isEmptyObject(global.oauth_secrets);
    var page = `
    <h1>Hello, I am trello-helper!</h1>
    `;
    var login_mod = `
    <p><a href='./login'>Login with OAuth!</a></p>  
    `;  

    var create_weekly_board_mod = `
    <p>&nbsp;</p>
    <p>Create Weekly Board<p>
    <form action="./cweeklyboard">
    <p>Year: <input type="text" name="year" value="2020" /></p>
    <p>Month: <input type="text" name="month" value="1" /></p>
    <p>Week: <input type="text" name="week" value="1" /></p>
    <p><input type="hidden" name="oauth_token" value="${global.oauth_token}"></p>
    <p><input type="hidden" name="oauth_verifier" value="${global.oauth_verifier}"></p>
    <p><input type="submit"></p>
    </form>
    <hr>
    <p>&nbsp;</p>
    `;

    page += authenticated ? create_weekly_board_mod : login_mod;
    response.send(page);
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