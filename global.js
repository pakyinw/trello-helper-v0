/*
      Global constant
*/
require('dotenv').config();
const OAuth = require('oauth').OAuth

let global = {
    /*
    /     OAuth Setup and Functions
    */
   requestURL : "https://trello.com/1/OAuthGetRequestToken",
   accessURL : "https://trello.com/1/OAuthGetAccessToken",
   authorizeURL : "https://trello.com/1/OAuthAuthorizeToken",
   appName : "Trello Helper",

   // Trello redirects the user here after authentication
   loginCallback : "http://localhost:3000/",

   // You should have {"token": "tokenSecret"} pairs in a real application
   // Storage should be more permanent (redis would be a good choice)
   oauth_secrets : {},
}

// Be sure to include your key and secret in 🗝.env ↖️ over there.
// You can get your key and secret from Trello at: https://trello.com/app-key
global["key"] = process.env.TRELLO_KEY;
global["secret"] = process.env.TRELLO_OAUTH_SECRET;
global["oauth"] = new OAuth(global["requestURL"], global["accessURL"], global["key"], global["secret"], "1.0A", global["loginCallback"], "HMAC-SHA1")

module.exports = global