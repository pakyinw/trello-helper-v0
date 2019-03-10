var helper = require('./../helper.js');
var url = require('url');

module.exports = (oauth, oauth_secrets) => {
  var firstBoard = (year, month, week, accessToken, accessTokenSecret) => (resolve, reject) => {
    console.log("year: " + year)
    var boardid;  
    oauth.getProtectedResource(`https://api.trello.com/1/boards/?name=${year}%20${month}%20Week%20${week}&pos=1`, "POST", accessToken, accessTokenSecret, (error, data, response) => {
      const jsonObj = JSON.parse(data);
      boardid = jsonObj.id;
      if (error){
        reject("First board error");
      }else{
        resolve(boardid);
      }
    });
  }
  
  var firstList = (year, month, week, accessToken, accessTokenSecret) => (value) => {
    const weeks = helper.getWeeksInMonth(month, year);
    const startEndDate = helper.getStartEndDate(weeks, week);
    const datesInWeek = helper.getDatesInWeek(startEndDate.start);
    return new Promise( (resolve) => {
      oauth.getProtectedResource(`https://api.trello.com/1/lists?name=${helper.getYYYYMMDD(datesInWeek[0]) + " Plan"}&idBoard=${value}&pos=1`, "POST", accessToken, accessTokenSecret, (error, data, response) => {
        var jsonObj = JSON.parse(data);
        const listid = jsonObj.id;
        console.log("end of boardpromise.then, value[0] = " + value);
        resolve([value, listid]);
      });
    });
  }
  
  var copyList = (accessToken, accessTokenSecret) => (value) => {
    console.log("starting creating cards, boardid = " + value[0]);
    console.log("starting creating cards, listid = " + value[1]);
    //var boardid = value[0];
    var listid = value[1];
    var singlecardpromise = new Promise(
      (resolve) => {
        //const cardname = helper.zeroFill(cardcount,2) + '00';
        //console.log(cardname);
        oauth.getProtectedResource(`https://api.trello.com/1/cards?idList=${listid}&name=0000&pos=1`, "POST", accessToken, accessTokenSecret, (error, data, response) => {
          console.log("singlecardpromise: " + data);
          resolve(value);
        });
      }
    );
    for (let cardcount = 1; cardcount < 24; cardcount ++){
      const cardname = helper.zeroFill(cardcount,2) + '00';
      const pos = cardcount;
      singlecardpromise = singlecardpromise.then(
        (value) => new Promise((resolve) => {
          oauth.getProtectedResource(`https://api.trello.com/1/cards?idList=${listid}&name=${cardname}&pos=${pos + 1}`, "POST", accessToken, accessTokenSecret, (error, data, response) => {
            console.log("singlecardpromise: " + data);
            resolve(value);
          });
        })
      );
    }
    return singlecardpromise.then((value) => value);
  }
  
  var copyBoard = (year, month, week, accessToken, accessTokenSecret) => (value) => {
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
    for (let dateInWeek in datesInWeek){
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
  
  var cweeklyboard = (req, res) =>{
    console.log("req.url: " + req.url)
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
    oauth.getOAuthAccessToken(token, tokenSecret, verifier, (error, accessToken, accessTokenSecret, results) => {
        console.log("start getOAuthAccessToken");
        console.log("year: " + year)
        const boardpromise = new Promise(firstBoard(year, month, week, accessToken, accessTokenSecret));
        const firstlistpromise = boardpromise.then(firstList(year, month, week, accessToken, accessTokenSecret));
        const copylistpromise = firstlistpromise.then(copyList(accessToken, accessTokenSecret));
        copylistpromise.then(copyBoard(year, month, week, accessToken, accessTokenSecret));
        res.redirect('/');
    });
  };

  return cweeklyboard;
}
  