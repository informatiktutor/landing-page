// Simple script to serve it gzipped.
var express = require('express');
var compression = require('compression');
var app = express();
app.use(compression());
app.use("/", express.static(__dirname + '/../docs'));
app.listen(3000);
