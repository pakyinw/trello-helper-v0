module.exports = (oauth, oauth_secrets, authorizeURL, appName) => {
    const login = (request, response) => {
        oauth.getOAuthRequestToken((error, token, tokenSecret, results) => {
            oauth_secrets[token] = tokenSecret;
            response.redirect(`${authorizeURL}?oauth_token=${token}&name=${appName}&scope=read,write`);
        });
    };
    return login;
}