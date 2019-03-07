var express = require('express');
var global = require('./global.js')

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
/     Routes require
*/
var router = require('./routes.js');
app.use('/', router)


