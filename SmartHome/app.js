/*
	Name:		app.js
	Created:	04.11.2016
	Author:		Viktoria Jechsmayr

	Main-File for Server-implementation and coordination with SubServers
*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var smartHomeLib = require('smart-home-lib');
var deviceSettings = require('./deviceSettingsServer');
var dashboard = require('./dashboardServer');

var app = express();

var smartHome = smartHomeLib.createSmartHomeServer("0.0.0.0", 8888, 0x01);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});


var sendResponse = function (res, suc, mes, data) {
    res.json({ success: suc, message: mes, data: data });
};

//deviceSettingsServer setup call
deviceSettings.setup(app, smartHome, sendResponse);

//dashboardServer setup call
dashboard.setup(app, smartHome, sendResponse);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;