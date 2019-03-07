var OAuth = require('oauth').OAuth
var dotenv = require('dotenv').config();

/*
      Global constant
*/
var requestURL = "https://trello.com/1/OAuthGetRequestToken";
var accessURL = "https://trello.com/1/OAuthGetAccessToken";
var key = process.env.TRELLO_KEY;
var secret = process.env.TRELLO_OAUTH_SECRET;
const loginCallback = `http://localhost:3000/`;

module.exports = {
    /*
    /     OAuth Setup and Functions
    */
    requestURL : requestURL,
    accessURL : accessURL,
    authorizeURL : "https://trello.com/1/OAuthAuthorizeToken",
    appName : "Trello Helper",


    // Be sure to include your key and secret in 🗝.env ↖️ over there.
    // You can get your key and secret from Trello at: https://trello.com/app-key
    key : key,
    secret : secret,

    // Trello redirects the user here after authentication
    loginCallback : loginCallback,

    // You should have {"token": "tokenSecret"} pairs in a real application
    // Storage should be more permanent (redis would be a good choice)
    oauth_secrets : {},
    oauth : new OAuth(requestURL, accessURL, key, secret, "1.0A", loginCallback, "HMAC-SHA1")
}