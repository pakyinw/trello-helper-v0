const express = require('express');
/*
/     Express Server Setup
*/
const app = express();
app.use(express.static('public'));

const server = app.listen(3000, function () {
  console.log('Server up and running...🏃🏃🏻');
  console.log("Listening on port %s", server.address().port);
});

/*
/     Routes require
*/
const router = require('./routes.js');
app.use('/', router)


