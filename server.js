var express = require('express');
 
var http = require('http')
var OAuth = require('oauth').OAuth
var url = require('url')
var helper = require('./helper.js');
var dotenv = require('dotenv').config();

//var cardcount = 1;
//var startcreatecard = true;

/*
/     Express Server Setup
*/
var app = express();

app.use(express.static('public'));

var server = app.listen(3000, function () {
  console.log('Server up and running...🏃🏃🏻');
  console.log("Listening on port %s", server.address().port);
});


/*
/     OAuth Setup and Functions
*/
const requestURL = "https://trello.com/1/OAuthGetRequestToken";
const accessURL = "https://trello.com/1/OAuthGetAccessToken";
const authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
const appName = "Trello Helper";

// Be sure to include your key and secret in 🗝.env ↖️ over there.
// You can get your key and secret from Trello at: https://trello.com/app-key
const key = process.env.TRELLO_KEY;
const secret = process.env.TRELLO_OAUTH_SECRET;

// Trello redirects the user here after authentication
const loginCallback = `http://localhost:3000/`;

// You should have {"token": "tokenSecret"} pairs in a real application
// Storage should be more permanent (redis would be a good choice)
const oauth_secrets = {};

const oauth = new OAuth(requestURL, accessURL, key, secret, "1.0A", loginCallback, "HMAC-SHA1")

const login = function(request, response) {
  oauth.getOAuthRequestToken(function(error, token, tokenSecret, results){
    oauth_secrets[token] = tokenSecret;
    response.redirect(`${authorizeURL}?oauth_token=${token}&name=${appName}&scope=read,write`);
  });
};


var cweeklyboard = function(req, res) {
  const query = url.parse(req.url, true).query;
  const token = query.oauth_token;
  const tokenSecret = oauth_secrets[token];
  const verifier = query.oauth_verifier;
  const year = query.year;
  const month = query.month;
  const week = query.week;
  console.log(token);
  console.log(tokenSecret);
  console.log(verifier);
  console.log(year);
  console.log(month);
  console.log(week);
  oauth.getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results){
      // In a real app, the accessToken and accessTokenSecret should be stored
      
      console.log("start getOAuthAccessToken");
      const boardpromise = new Promise(
        function(resolve){          
          var boardid;
          oauth.getProtectedResource(`https://api.trello.com/1/boards/?name=${year}%20${month}%20Week%20${week}&pos=1`, "POST", accessToken, accessTokenSecret, function(error, data, response){
            const jsonObj = JSON.parse(data);
            boardid = jsonObj.id;
            resolve(boardid);
          });
          //return new Promise();
        }
      );
      const firstlistpromise = boardpromise.then(
        function(value){
          const weeks = helper.getWeeksInMonth(month, year);
          const startEndDate = helper.getStartEndDate(weeks, week);
          const datesInWeek = helper.getDatesInWeek(startEndDate.start);
          return new Promise( (resolve) => {
            oauth.getProtectedResource(`https://api.trello.com/1/lists?name=${helper.getYYYYMMDD(datesInWeek[0]) + " Plan"}&idBoard=${value}&pos=1`, "POST", accessToken, accessTokenSecret, function(error, data, response){
              var jsonObj = JSON.parse(data);
              const listid = jsonObj.id;
              console.log("end of boardpromise.then, value[0] = " + value);
              resolve([value, listid]);
            });
          });
        }
      );
      const copylistpromise = firstlistpromise.then(
        function(value){
          console.log("starting creating cards, boardid = " + value[0]);
          console.log("starting creating cards, listid = " + value[1]);
          //var boardid = value[0];
          var listid = value[1];
          var singlecardpromise = new Promise(
            function(resolve){
              //const cardname = helper.zeroFill(cardcount,2) + '00';
              //console.log(cardname);
              oauth.getProtectedResource(`https://api.trello.com/1/cards?idList=${listid}&name=0000&pos=1`, "POST", accessToken, accessTokenSecret, function(error, data, response){
                console.log("singlecardpromise: " + data);
                resolve(value);
              });
            }
          );
          for (var cardcount = 1; cardcount < 24; cardcount ++){
            const cardname = helper.zeroFill(cardcount,2) + '00';
            const pos = cardcount;
            singlecardpromise = singlecardpromise.then(
              function(value){
                console.log(cardname);
                return new Promise(
                  function (resolve){
                    oauth.getProtectedResource(`https://api.trello.com/1/cards?idList=${listid}&name=${cardname}&pos=${pos + 1}`, "POST", accessToken, accessTokenSecret, function(error, data, response){
                      console.log("singlecardpromise: " + data);
                      resolve(value);
                    });
                  }
                );
              }
            );
          }
          return singlecardpromise.then((value) => value);
        }
        
      );
      copylistpromise.then(
        function(value){
          const weeks = helper.getWeeksInMonth(month, year);
          const startEndDate = helper.getStartEndDate(weeks, week);
          const datesInWeek = helper.getDatesInWeek(startEndDate.start);
          var boardid = value[0];
          var listid = value[1];
          console.log("copylistpromise.listid: " + value);
          var listpromise = new Promise(
            function(resolve){
              oauth.getProtectedResource(`https://api.trello.com/1/lists?name=${helper.getYYYYMMDD(datesInWeek[0]) + " Done"}&idBoard=${boardid}&idListSource=${listid}&pos=2`, "POST", accessToken, accessTokenSecret, function(error, data, response){
                var jsonObj = JSON.parse(data);
                console.log(data);
                const listid = jsonObj.id;
                resolve(value);
              });
            }
          );
          var position = 1;
          for (var dateInWeek in datesInWeek){
            if (position == 1){
              position += 2;
              continue;
            }
            const cDateInWeek = dateInWeek;
            const cPos1 = position;
            listpromise = listpromise.then(
              function(value){
                var boardid = value[0];
                var listid = value[1];
                return new Promise(
                  function(resolve){
                    oauth.getProtectedResource(`https://api.trello.com/1/lists?name=${helper.getYYYYMMDD(datesInWeek[cDateInWeek]) + " Plan"}&idBoard=${boardid}&idListSource=${listid}&pos=${cPos1}`, "POST", accessToken, accessTokenSecret, function(error, data, response){
                      console.log(data);
                      resolve(value);
                    });
                  }
                );
              }
            );
            position++;
            const cPos2 = position;
            listpromise = listpromise.then(
              function(value){
                var boardid = value[0];
                var listid = value[1];
                return new Promise(
                  function(resolve){
                    oauth.getProtectedResource(`https://api.trello.com/1/lists?name=${helper.getYYYYMMDD(datesInWeek[cDateInWeek]) + " Done"}&idBoard=${boardid}&idListSource=${listid}&pos=${cPos2}`, "POST", accessToken, accessTokenSecret, function(error, data, response){
                      console.log(data);
                      resolve(value);
                    });
                  }
                );
              }
            );
            position++;
          }
        }
      );
      
    
      res.redirect('/');
  });
  //
};



/*
/     Routes
*/
app.get("/", function (request, response) {
  const query = url.parse(request.url, true).query;
  const oauth_token = query.oauth_token;
  const oauth_verifier = query.oauth_verifier;
  console.log(`GET '/' 🤠 ${Date()}`);
  var authenticated = !helper.isEmptyObject(oauth_secrets);
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
  <p><input type="hidden" name="oauth_token" value="${oauth_token}"></p>
  <p><input type="hidden" name="oauth_verifier" value="${oauth_verifier}"></p>
  <p><input type="submit"></p>
  </form>
  <hr>
  <p>&nbsp;</p>
  `;

  page += authenticated ? create_weekly_board_mod : login_mod;
  response.send(page);
});

app.get("/login", function (request, response) {
  console.log(`GET '/login' 🤠 ${Date()}`);
  login(request, response);
});

app.get("/cweeklyboard", function (request, response) {
  console.log(`GET '/cweeklyboard' 🤠 ${Date()}`);
  cweeklyboard(request, response);
});


