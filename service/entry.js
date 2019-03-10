let url = require('url')
let helper = require('./../helper.js');

module.exports = (oauth_secrets) => {

    const create_weekly_board_mod = (oauth_token, oauth_verifier) => `
        <p>&nbsp;</p>
        <p>Create Weekly Board<p>
        <form action="./cweeklyboard">
        <p>Year: <input type="text" name="year" value="2020" /></p>
        <p>Month: <input type="text" name="month" value="1" /></p>
        <p>Week: <input type="text" name="week" value="1" /></p>
        <p><input type="hidden" name="oauth_token" value="${oauth_token}"></p>
        <p><input type="hidden" name="oauth_verifier" value="${oauth_verifier}"></p>
        <p><input type="submit"></p>
        </form>
        <hr>
        <p>&nbsp;</p>
        `;

    const login_mod = `
    <p><a href='./login'>Login with OAuth!</a></p>  
    `; 

    const title = `
    <h1>Hello, I am trello-helper!</h1>
    `;
 
    const entry = (request, response) => {
        const query = url.parse(request.url, true).query;
        const oauth_token = query.oauth_token;
        const oauth_verifier = query.oauth_verifier;
    
        console.log(`GET '/' 🤠 ${Date()}`);
        let authenticated = !helper.isEmptyObject(oauth_secrets);
        let page = title;    
        page += authenticated ? create_weekly_board_mod(oauth_token, oauth_verifier) : login_mod;

        response.send(page);
    };
    return entry;
}