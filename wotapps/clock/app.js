'use strict';

var EXPRESS_PORT = process.env.PORT || 4000;
var EXPRESS_IPADDR = process.env.IPADDR || '0.0.0.0';
var EXPRESS_ROOT = __dirname + "/web";

function startExpress(root, port, ipaddr) {
  var express = require('express');
  var app = express();
  app.use(express.static(root));
  app.listen(port, ipaddr, function() {
    console.log('Listening on %s:%d',
		ipaddr, port);
  });
}

startExpress(EXPRESS_ROOT, EXPRESS_PORT, EXPRESS_IPADDR);