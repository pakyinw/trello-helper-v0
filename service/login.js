var global = require('./../global.js')
const login = (request, response) => {
    global.oauth.getOAuthRequestToken((error, token, tokenSecret, results) => {
        global.oauth_secrets[token] = tokenSecret;
        response.redirect(`${global.authorizeURL}?oauth_token=${token}&name=${global.appName}&scope=read,write`);
    });
};

module.exports = login