var express = require('express');
/*
/     Express Server Setup
*/

let app = express();
app.use(express.static('public'));
let server = app.listen(3000, function () {
  console.log('Server up and running...🏃🏃🏻');
  console.log("Listening on port %s", server.address().port);
});

/*
/     Routes require
*/
let router = require('./routes.js');
app.use('/', router)


